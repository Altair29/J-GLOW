import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { callGemini } from '@/lib/gemini/client';

const IMAGEN_API_BASE = 'https://us-central1-aiplatform.googleapis.com/v1';

/**
 * POST /api/blog/generate-cover
 * タイトルからAIカバー画像を生成
 *
 * 1. Gemini でタイトルから画像生成用プロンプトを生成
 * 2. Imagen API で画像を生成
 * 3. Supabase Storage に保存
 * 4. 公開URLを返却
 */
export async function POST(request: NextRequest) {
  try {
    // 認証チェック
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 権限チェック (admin or editor)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile || !['admin', 'editor'].includes(profile.role)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const { title } = await request.json();
    if (!title || typeof title !== 'string') {
      return NextResponse.json({ error: 'title is required' }, { status: 400 });
    }

    // Step 1: Gemini でプロンプト生成
    const { text: imagePrompt } = await callGemini(
      `以下のブログ記事タイトルから、カバー画像を生成するための英語の画像生成プロンプトを1つだけ出力してください。プロンプトのみを出力し、説明は不要です。プロフェッショナルで落ち着いたビジネス向けのイラストレーションスタイルにしてください。\n\nタイトル: ${title}`,
      'あなたは画像生成プロンプトの専門家です。高品質なカバー画像のためのプロンプトを生成してください。'
    );

    const cleanPrompt = imagePrompt.trim().replace(/^["']|["']$/g, '');

    // Step 2: Imagen API で画像生成
    const gcpProjectId = process.env.GCP_PROJECT_ID;
    const gcpAccessToken = process.env.GCP_ACCESS_TOKEN;

    if (!gcpProjectId || !gcpAccessToken) {
      // Imagen APIが設定されていない場合はプレースホルダーURLを返す
      return NextResponse.json({
        url: `https://placehold.co/1200x630/1e3a5f/ffffff?text=${encodeURIComponent(title.slice(0, 20))}`,
        prompt: cleanPrompt,
        fallback: true,
      });
    }

    const imagenResponse = await fetch(
      `${IMAGEN_API_BASE}/projects/${gcpProjectId}/locations/us-central1/publishers/google/models/imagen-3.0-generate-001:predict`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${gcpAccessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          instances: [{ prompt: cleanPrompt }],
          parameters: {
            sampleCount: 1,
            aspectRatio: '16:9',
            safetyFilterLevel: 'block_some',
          },
        }),
      }
    );

    if (!imagenResponse.ok) {
      const errText = await imagenResponse.text();
      console.error('Imagen API error:', errText);
      // フォールバック
      return NextResponse.json({
        url: `https://placehold.co/1200x630/1e3a5f/ffffff?text=${encodeURIComponent(title.slice(0, 20))}`,
        prompt: cleanPrompt,
        fallback: true,
      });
    }

    const imagenData = await imagenResponse.json();
    const base64Image = imagenData.predictions?.[0]?.bytesBase64Encoded;

    if (!base64Image) {
      return NextResponse.json({
        url: `https://placehold.co/1200x630/1e3a5f/ffffff?text=${encodeURIComponent(title.slice(0, 20))}`,
        prompt: cleanPrompt,
        fallback: true,
      });
    }

    // Step 3: Supabase Storage に保存
    const buffer = Buffer.from(base64Image, 'base64');
    const fileName = `blog-covers/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.png`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(fileName, buffer, {
        contentType: 'image/png',
        upsert: false,
      });

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
    }

    // 公開URLを取得
    const { data: publicUrlData } = supabase.storage
      .from('public')
      .getPublicUrl(fileName);

    return NextResponse.json({
      url: publicUrlData.publicUrl,
      prompt: cleanPrompt,
      fallback: false,
    });
  } catch (err) {
    console.error('generate-cover error:', err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
