import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticleContent from '@/components/business/ArticleContent';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: post } = await supabase
    .from('blog_posts')
    .select('title, excerpt')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) return { title: '記事が見つかりません' };
  return {
    title: `${post.title} | J-GLOW`,
    description: post.excerpt || post.title,
  };
}

export default async function ArticleDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) notFound();

  const body = post.body || '';
  const isFullHtml = body.trimStart().startsWith('<style>');

  if (isFullHtml) {
    return <div dangerouslySetInnerHTML={{ __html: body }} />;
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* ヒーロー */}
      <section
        className="py-12 text-white"
        style={{ background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1d3d 100%)' }}
      >
        <div className="max-w-3xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/business" className="hover:text-white">企業向けトップ</Link>
            <span className="mx-2">{'>'}</span>
            <Link href="/business/articles" className="hover:text-white">記事一覧</Link>
            <span className="mx-2">{'>'}</span>
            <span className="text-white/70">{post.title.slice(0, 30)}{post.title.length > 30 ? '...' : ''}</span>
          </nav>
          <h1 className="text-xl sm:text-2xl font-bold leading-tight">
            {post.title}
          </h1>
          {post.published_at && (
            <p className="mt-3 text-blue-200 text-xs">
              {new Date(post.published_at).toLocaleDateString('ja-JP')}
            </p>
          )}
        </div>
      </section>

      {/* 本文 */}
      <main className="max-w-3xl mx-auto px-6 py-10">
        <div className="ladder-article">
          <ArticleContent content={body} />
        </div>

        {/* フッターナビ */}
        <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-between border-t border-gray-200 pt-6">
          <Link
            href="/business/articles"
            className="text-sm font-semibold text-[#1a2f5e] hover:underline"
          >
            ← 記事一覧に戻る
          </Link>
          <Link
            href="/business/hiring-guide"
            className="text-sm font-semibold text-[#c9a84c] hover:underline"
          >
            はじめての外国人雇用ガイド →
          </Link>
        </div>
      </main>
    </div>
  );
}
