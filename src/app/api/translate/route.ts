import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGemini } from '@/lib/gemini/client';

export async function POST(request: NextRequest) {
  const { text, targetLang, sourceLang = 'ja', context } = await request.json();

  if (!text || !targetLang) {
    return NextResponse.json({ error: 'text and targetLang are required' }, { status: 400 });
  }

  const supabase = await createClient();

  // キャッシュ確認
  const { data: cached } = await supabase
    .from('translation_cache')
    .select('translated')
    .eq('source_text', text)
    .eq('source_lang', sourceLang)
    .eq('target_lang', targetLang)
    .single();

  if (cached) {
    return NextResponse.json({ translated: cached.translated, cached: true });
  }

  // LLMで翻訳
  const prompt = `Translate the following text from ${sourceLang} to ${targetLang}.
${context ? `Context: ${context}` : ''}
Return ONLY the translated text, nothing else.

Text: ${text}`;

  try {
    const { text: translated } = await callGemini(prompt);

    // キャッシュに保存
    await supabase
      .from('translation_cache')
      .upsert({
        source_text: text,
        source_lang: sourceLang,
        target_lang: targetLang,
        translated: translated.trim(),
        context,
      });

    return NextResponse.json({ translated: translated.trim(), cached: false });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Translation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
