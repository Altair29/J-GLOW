import { createClient } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import ArticleContent from '@/components/business/ArticleContent';

type Props = {
  params: Promise<{ slug: string }>;
};

const articleStyles = `
  .la-body {
    color: #2c2c2c;
    font-size: 16px;
    line-height: 1.85;
  }
  .la-body img {
    width: 100%;
    height: auto;
    border-radius: 8px;
    margin: 2rem 0;
  }
  .la-body h2 {
    font-size: 22px;
    font-weight: 900;
    color: #1a2f5e;
    margin-top: 48px;
    margin-bottom: 16px;
    padding-bottom: 10px;
    border-bottom: 2px solid #c9a84c;
    line-height: 1.5;
  }
  .la-body > div > h2:first-child,
  .la-body > h2:first-child {
    margin-top: 0;
  }
  .la-body h3 {
    font-size: 18px;
    font-weight: 700;
    color: #1a2f5e;
    margin-top: 32px;
    margin-bottom: 12px;
    padding-left: 14px;
    border-left: 4px solid #c9a84c;
    line-height: 1.5;
  }
  .la-body h4 {
    font-size: 15px;
    font-weight: 700;
    color: #2c2c2c;
    margin-top: 24px;
    margin-bottom: 8px;
  }
  .la-body p {
    margin-bottom: 16px;
    line-height: 1.9;
  }
  .la-body strong {
    color: #1a2f5e;
    font-weight: 700;
  }
  .la-body a {
    color: #1a2f5e;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .la-body a:hover {
    color: #2a4a7f;
  }
  .la-body ul {
    list-style-type: disc !important;
    padding-left: 1.5rem !important;
    margin: 1rem 0;
  }
  .la-body ol {
    list-style-type: decimal !important;
    padding-left: 1.5rem !important;
    margin: 1rem 0;
  }
  .la-body li {
    margin-bottom: 0.35rem;
    line-height: 1.8;
    display: list-item !important;
  }
  .la-body table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.875rem;
    margin: 1.5rem 0;
    border-radius: 6px;
    display: block;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .la-body thead {
    background-color: #1a2f5e;
    color: #ffffff;
  }
  .la-body th {
    font-weight: 600;
    padding: 0.625rem 1rem;
    text-align: left;
    font-size: 0.8125rem;
    white-space: nowrap;
  }
  .la-body td {
    border: 1px solid #e2e5ea;
    padding: 0.625rem 1rem;
    color: #2c2c2c;
    vertical-align: top;
  }
  .la-body tr:nth-child(even) td {
    background-color: #f8f9fb;
  }
  .la-body blockquote {
    border-left: 4px solid #c9a84c;
    background-color: #faf5e8;
    padding: 0.75rem 1.25rem;
    color: #2c2c2c;
    font-style: normal;
    margin: 1.5rem 0;
    border-radius: 0 8px 8px 0;
  }
  .la-body blockquote p {
    margin-bottom: 0;
  }
  .la-body pre {
    background-color: #f8fafc !important;
    border: 1px solid #e2e5ea;
    border-radius: 8px;
    padding: 1.25rem 1.5rem;
    overflow-x: auto;
    margin: 1.5rem 0;
  }
  .la-body pre code {
    background-color: transparent !important;
    color: #1e293b;
    font-size: 0.85rem;
    line-height: 1.7;
    padding: 0;
  }
  .la-body code {
    background-color: #f0f2f5;
    color: #1a2f5e;
    padding: 0.125rem 0.375rem;
    border-radius: 4px;
    font-size: 0.875rem;
  }
  .la-body hr {
    border: none;
    border-top: 1px solid #e2e5ea;
    margin: 2rem 0;
  }
`;

export default async function ContinueArticlePage({ params }: Props) {
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

  // フルHTML記事（自前のヘッダー・スタイルを持つ）
  if (isFullHtml) {
    return (
      <div
        style={{ minHeight: '100vh' }}
        dangerouslySetInnerHTML={{ __html: body }}
      />
    );
  }

  const publishedDate = post.published_at ?? post.created_at;
  const dateStr = publishedDate
    ? new Date(publishedDate)
        .toLocaleDateString('ja-JP', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        })
        .replace(/\//g, '-')
    : '';

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: articleStyles }} />

      <div style={{ minHeight: '100vh', backgroundColor: '#f8fafc' }}>
        {/* ヒーロー */}
        <div
          style={{
            background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1d3d 100%)',
          }}
        >
          <div
            style={{
              maxWidth: '820px',
              margin: '0 auto',
              padding: '2.5rem 1.5rem 4rem',
            }}
          >
            {/* パンくず */}
            <nav
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
                color: '#93c5fd',
                marginBottom: '1.25rem',
                flexWrap: 'wrap',
              }}
            >
              <Link
                href="/business"
                style={{ color: '#93c5fd', textDecoration: 'none' }}
              >
                企業向けトップ
              </Link>
              <span style={{ color: '#6094d8' }}>/</span>
              <Link
                href="/business/existing-users"
                style={{ color: '#93c5fd', textDecoration: 'none' }}
              >
                外国人スタッフを活かす
              </Link>
              <span style={{ color: '#6094d8' }}>/</span>
              <Link
                href="/business/existing-users/continue#contents"
                style={{ color: '#93c5fd', textDecoration: 'none' }}
              >
                続ける・判断する
              </Link>
              <span style={{ color: '#6094d8' }}>/</span>
              <span style={{ color: '#bfdbfe' }}>{post.title}</span>
            </nav>

            {/* カテゴリ + 日付 */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '1rem',
              }}
            >
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: '#c9a84c',
                  color: '#fff',
                  fontSize: '11px',
                  fontWeight: '600',
                  padding: '3px 12px',
                  borderRadius: '999px',
                  letterSpacing: '0.03em',
                }}
              >
                続ける・判断する
              </span>
              {dateStr && (
                <span style={{ color: '#93c5fd', fontSize: '12px' }}>
                  {dateStr}
                </span>
              )}
            </div>

            {/* タイトル */}
            <h1
              style={{
                fontSize: 'clamp(1.35rem, 2.5vw, 1.75rem)',
                fontWeight: '700',
                color: '#fff',
                lineHeight: '1.45',
                marginBottom: '1rem',
              }}
            >
              {post.title}
            </h1>

            {/* リード文 */}
            {post.excerpt && (
              <p
                style={{
                  color: '#bfdbfe',
                  fontSize: '14px',
                  lineHeight: '1.8',
                  maxWidth: '640px',
                }}
              >
                {post.excerpt}
              </p>
            )}
          </div>
        </div>

        {/* 記事本文 */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="la-body">
            <ArticleContent content={post.body ?? ''} />
          </div>

          {/* フッターナビ */}
          <div
            style={{
              marginTop: '3.5rem',
              paddingTop: '2rem',
              borderTop: '1px solid #e2e5ea',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <Link
              href="/business/existing-users/continue#contents"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#1a2f5e',
                textDecoration: 'none',
              }}
            >
              ← コンテンツ一覧に戻る
            </Link>
            <Link
              href="/business/existing-users/ladder/checker"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '14px',
                fontWeight: '500',
                color: '#fff',
                backgroundColor: '#1a2f5e',
                padding: '10px 20px',
                borderRadius: '8px',
                textDecoration: 'none',
              }}
            >
              移行チェッカーを使う →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
