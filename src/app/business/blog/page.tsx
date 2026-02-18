import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { Badge } from '@/components/shared';

export default async function BlogListPage() {
  const supabase = await createClient();

  const [texts, theme, { data: posts }, { data: categories }] = await Promise.all([
    getContentBlocks(supabase, 'business_blog'),
    getThemeVars(supabase, 'business'),
    supabase
      .from('blog_posts')
      .select('id, title, slug, excerpt, cover_image_url, is_pinned, published_at, category_id, blog_categories(name)')
      .eq('status', 'published')
      .lte('published_at', new Date().toISOString())
      .order('is_pinned', { ascending: false })
      .order('pin_order', { ascending: true })
      .order('published_at', { ascending: false }),
    supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  const allPosts = posts || [];
  const allCategories = categories || [];

  return (
    <div>
      {/* ヒーロー */}
      <section
        className="py-16"
        style={{
          backgroundColor: theme['--biz-hero-bg'] || '#1e3a5f',
          color: theme['--biz-hero-text'] || '#ffffff',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">
            {texts.hero_title || 'ブログ'}
          </h1>
          <p className="text-lg opacity-80">
            {texts.hero_subtitle || ''}
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* カテゴリフィルタ (静的表示、将来クライアント側フィルタに拡張可能) */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-900 text-white">
              {texts.filter_all || 'すべて'}
            </span>
            {allCategories.map((cat) => (
              <span
                key={cat.id}
                className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer transition-colors"
              >
                {cat.name}
              </span>
            ))}
          </div>
        )}

        {/* 記事一覧 */}
        {allPosts.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{texts.empty_state || '記事が見つかりませんでした。'}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allPosts.map((post) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const categoryName = (post as any).blog_categories?.name;
              return (
                <Link
                  key={post.id}
                  href={`/business/blog/${post.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  {/* カバー画像 */}
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    {post.cover_image_url ? (
                      <img
                        src={post.cover_image_url}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ backgroundColor: theme['--biz-primary'] || '#1e3a5f' }}
                      >
                        <span className="text-white/50 text-sm">No Image</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      {post.is_pinned && (
                        <Badge style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>
                          {texts.pinned_label || '注目'}
                        </Badge>
                      )}
                      {categoryName && (
                        <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
                          {categoryName}
                        </Badge>
                      )}
                    </div>
                    <h2 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-700 transition-colors">
                      {post.title}
                    </h2>
                    {post.excerpt && (
                      <p className="text-sm text-gray-600 line-clamp-3 mb-3">{post.excerpt}</p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-400">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString('ja-JP')
                          : ''}
                      </span>
                      <span
                        className="text-sm font-medium"
                        style={{ color: theme['--biz-primary'] || '#1e3a5f' }}
                      >
                        {texts.read_more || '続きを読む'} →
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
