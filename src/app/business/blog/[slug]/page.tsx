import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { Badge } from '@/components/shared';
import { MarkdownPreview } from '@/components/admin/blog/MarkdownPreview';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const [texts, theme, { data: post }] = await Promise.all([
    getContentBlocks(supabase, 'business_blog_detail'),
    getThemeVars(supabase, 'business'),
    supabase
      .from('blog_posts')
      .select('*, blog_categories(name, slug), profiles(display_name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
  ]);

  if (!post) notFound();

  // タグ取得
  const { data: postTags } = await supabase
    .from('blog_post_tags')
    .select('blog_tags(name, slug)')
    .eq('post_id', post.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tags = (postTags || []).map((pt: any) => pt.blog_tags).filter(Boolean);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categoryName = (post as any).blog_categories?.name;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const authorName = (post as any).profiles?.display_name;

  // 関連記事 (同カテゴリ)
  const { data: relatedPosts } = post.category_id
    ? await supabase
        .from('blog_posts')
        .select('id, title, slug, cover_image_url, published_at')
        .eq('status', 'published')
        .eq('category_id', post.category_id)
        .neq('id', post.id)
        .order('published_at', { ascending: false })
        .limit(3)
    : { data: [] };

  return (
    <div>
      {/* カバー画像 */}
      {post.cover_image_url && (
        <div className="w-full h-64 md:h-96 overflow-hidden">
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* 戻るリンク */}
        <Link
          href="/business/blog"
          className="text-sm mb-6 inline-block hover:opacity-80 transition-opacity"
          style={{ color: theme['--biz-primary'] || '#1e3a5f' }}
        >
          {texts.back_link || '← ブログ一覧に戻る'}
        </Link>

        {/* メタ情報 */}
        <div className="flex flex-wrap items-center gap-2 mb-4">
          {categoryName && (
            <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
              {categoryName}
            </Badge>
          )}
          {post.published_at && (
            <span className="text-sm text-gray-500">
              {new Date(post.published_at).toLocaleDateString('ja-JP', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          )}
          {authorName && (
            <span className="text-sm text-gray-500">
              / {authorName}
            </span>
          )}
        </div>

        {/* タイトル */}
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
          {post.title}
        </h1>

        {/* 本文 (Markdown) */}
        <div className="mb-12">
          <MarkdownPreview content={post.body} />
        </div>

        {/* タグ */}
        {tags.length > 0 && (
          <div className="border-t pt-6 mb-8">
            <span className="text-sm font-medium text-gray-500 mr-2">
              {texts.tags_label || 'タグ'}:
            </span>
            <div className="inline-flex flex-wrap gap-2">
              {tags.map((tag: { name: string; slug: string }) => (
                <Badge
                  key={tag.slug}
                  style={{ backgroundColor: '#f3f4f6', color: '#374151' }}
                >
                  #{tag.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* 関連記事 */}
        {relatedPosts && relatedPosts.length > 0 && (
          <div className="border-t pt-8">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              {texts.related_heading || '関連記事'}
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              {relatedPosts.map((rp) => (
                <Link
                  key={rp.id}
                  href={`/business/blog/${rp.slug}`}
                  className="group block bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    {rp.cover_image_url ? (
                      <img
                        src={rp.cover_image_url}
                        alt={rp.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: theme['--biz-primary'] || '#1e3a5f' }}
                      >
                        <span className="text-white/40 text-xs">No Image</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {rp.title}
                    </h3>
                    <span className="text-xs text-gray-400 mt-1 block">
                      {rp.published_at
                        ? new Date(rp.published_at).toLocaleDateString('ja-JP')
                        : ''}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}
