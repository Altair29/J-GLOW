import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticleContent from '@/components/business/ArticleContent';
import FullHtmlArticle from '@/components/business/FullHtmlArticle';

type Props = {
  params: Promise<{ slug: string }>;
};

const blogBodyStyles = `
  .blog-body {
    color: #2c2c2c;
    font-size: 16px;
    line-height: 1.85;
  }
  .blog-body img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
  }
  .blog-body h2 {
    font-size: 22px;
    font-weight: 900;
    color: #1a2f5e;
    margin-top: 48px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #c9a84c;
    line-height: 1.5;
  }
  .blog-body > div > h2:first-child,
  .blog-body > h2:first-child {
    margin-top: 0;
  }
  .blog-body h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1a2f5e;
    margin-top: 32px;
    margin-bottom: 12px;
    padding-left: 14px;
    border-left: 4px solid #c9a84c;
    line-height: 1.5;
  }
  .blog-body p {
    margin-bottom: 16px;
    line-height: 1.9;
  }
  .blog-body strong {
    color: #1a2f5e;
    font-weight: 700;
  }
  .blog-body ul {
    list-style-type: disc !important;
    padding-left: 1.5rem !important;
    margin: 1rem 0;
  }
  .blog-body ol {
    list-style-type: decimal !important;
    padding-left: 1.5rem !important;
    margin: 1rem 0;
  }
  .blog-body li {
    margin-bottom: 0.35rem;
    line-height: 1.8;
    display: list-item !important;
  }
  .blog-body table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    margin: 1.5rem 0;
    border-radius: 6px;
    display: block;
    overflow-x: auto;
  }
  .blog-body thead {
    background-color: #1a2f5e;
    color: #ffffff;
  }
  .blog-body th {
    font-weight: 600;
    padding: 0.625rem 1rem;
    text-align: left;
    font-size: 0.8125rem;
  }
  .blog-body td {
    border: 1px solid #e2e5ea;
    padding: 0.625rem 1rem;
    vertical-align: top;
  }
  .blog-body tr:nth-child(even) td {
    background-color: #f8f9fb;
  }
  .blog-body blockquote {
    border-left: 4px solid #c9a84c;
    background-color: #faf5e8;
    padding: 0.75rem 1.25rem;
    margin: 1.5rem 0;
    border-radius: 0 8px 8px 0;
  }
  .blog-body blockquote p {
    margin-bottom: 0;
  }
`;

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: post } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single();

  if (!post) notFound();

  const body = post.body ?? '';
  const isFullHtml = body.trimStart().startsWith('<style>');

  // フルHTML記事（自前のヘッダー・スタイル・スクリプトを持つ）
  if (isFullHtml) {
    return <FullHtmlArticle html={body} />;
  }

  // Markdown / シンプルHTML記事
  const publishedDate = post.published_at ?? post.created_at;
  const dateStr = publishedDate
    ? new Date(publishedDate).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      }).replace(/\//g, '-')
    : '';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: blogBodyStyles }} />
      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1d3d 100%)' }}>
          <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2.5rem 1.5rem 4rem' }}>
            <nav style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#93c5fd', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              <Link href="/business" style={{ color: '#93c5fd', textDecoration: 'none' }}>企業向けトップ</Link>
              <span style={{ color: '#6094d8' }}>/</span>
              <span style={{ color: '#bfdbfe' }}>{post.title}</span>
            </nav>
            {dateStr && (
              <span style={{ color: '#93c5fd', fontSize: '12px', display: 'block', marginBottom: '1rem' }}>{dateStr}</span>
            )}
            <h1 style={{ fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)', fontWeight: '700', color: '#fff', lineHeight: '1.45' }}>
              {post.title}
            </h1>
          </div>
        </div>

        {/* Body */}
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '2.5rem 1.5rem' }}>
          <div className="blog-body">
            <ArticleContent content={body} />
          </div>

          <div style={{ marginTop: '3rem', paddingTop: '2rem', borderTop: '1px solid #e2e5ea' }}>
            <Link href="/business" style={{ fontSize: '14px', fontWeight: '500', color: '#1a2f5e', textDecoration: 'none' }}>
              &larr; 企業向けトップに戻る
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
