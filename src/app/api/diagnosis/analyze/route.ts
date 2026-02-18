import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGemini } from '@/lib/gemini/client';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { sessionId, answers, scores } = await request.json();

  if (!sessionId || !answers) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
  }

  // AI設定を取得
  const { data: aiConfig } = await supabase
    .from('diagnosis_ai_config')
    .select('*')
    .order('id', { ascending: false })
    .limit(1)
    .single();

  const systemPrompt = aiConfig?.system_prompt || 'あなたはコンプライアンスの専門家です。';

  // カテゴリ情報を取得
  const { data: categories } = await supabase
    .from('diagnosis_categories')
    .select('id, name, slug')
    .eq('is_active', true);

  const prompt = `
以下のアンケート回答結果を分析してください。

## カテゴリ
${JSON.stringify(categories, null, 2)}

## 回答データ
${JSON.stringify(answers, null, 2)}

## スコア
${JSON.stringify(scores, null, 2)}

JSON形式で以下の構造で回答してください:
{
  "summary": "全体の要約（200文字以内）",
  "risk_level": "low|medium|high|critical",
  "categories": [
    {
      "name": "カテゴリ名",
      "score": 数値,
      "analysis": "分析コメント",
      "recommendations": ["改善提案1", "改善提案2"]
    }
  ]
}`;

  try {
    const { text, promptTokens } = await callGemini(
      prompt,
      systemPrompt,
      aiConfig?.model_name || 'gemini-2.0-flash'
    );

    // JSONを抽出
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const analysis = jsonMatch ? JSON.parse(jsonMatch[0]) : { summary: text, risk_level: 'medium' };

    // レポートを保存
    const { data: report, error } = await supabase
      .from('diagnosis_reports')
      .insert({
        session_id: sessionId,
        user_id: user.id,
        summary: analysis.summary,
        detail_analysis: analysis.categories || [],
        risk_level: analysis.risk_level,
        recommendations: analysis.categories?.flatMap((c: { recommendations?: string[] }) => c.recommendations || []) || [],
        gemini_model: aiConfig?.model_name || 'gemini-2.0-flash',
        prompt_tokens: promptTokens,
      })
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // セッションを完了に更新
    await supabase
      .from('diagnosis_sessions')
      .update({ status: 'completed', completed_at: new Date().toISOString(), raw_scores: scores })
      .eq('id', sessionId);

    return NextResponse.json({ report, analysis });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analysis failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
