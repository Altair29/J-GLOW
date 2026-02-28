import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { Badge } from '@/components/shared';

export default async function WhitepapersPage() {
  const supabase = await createClient();

  const [texts, theme, { data: whitepapers }, { data: categories }] = await Promise.all([
    getContentBlocks(supabase, 'business_whitepapers'),
    getThemeVars(supabase, 'business'),
    supabase
      .from('whitepapers')
      .select('id, title, slug, summary, industry, thumbnail_url, is_featured, published_at, category_id, whitepaper_categories(name)')
      .eq('status', 'published')
      .order('is_featured', { ascending: false })
      .order('published_at', { ascending: false }),
    supabase
      .from('whitepaper_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  const allPapers = whitepapers || [];
  const allCategories = categories || [];
  const featured = allPapers.filter((wp) => wp.is_featured);
  const rest = allPapers.filter((wp) => !wp.is_featured);

  return (
    <div>
      {/* ヒーロー */}
      <section
        className="py-16"
        style={{
          backgroundColor: theme['--biz-hero-bg'] || '#1a2f5e',
          color: theme['--biz-hero-text'] || '#ffffff',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">{texts.hero_title || '戦略的ホワイトペーパー'}</h1>
          <p className="text-lg opacity-80">{texts.hero_subtitle || ''}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* カテゴリフィルタ */}
        {allCategories.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            <span className="px-3 py-1.5 text-sm font-medium rounded-full bg-gray-900 text-white">
              {texts.filter_category || 'すべて'}
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

        {/* 注目のホワイトペーパー */}
        {featured.length > 0 && (
          <div className="mb-12">
            <h2 className="text-xl font-bold text-gray-900 mb-6">{texts.section_featured || '注目のホワイトペーパー'}</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featured.map((wp) => {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const catName = (wp as any).whitepaper_categories?.name;
                return (
                  <Link
                    key={wp.id}
                    href={`/business/whitepapers/${wp.slug}`}
                    className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                      {wp.thumbnail_url ? (
                        <img src={wp.thumbnail_url} alt={wp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme['--biz-primary'] || '#1a2f5e' }}>
                          <span className="text-white/40 text-4xl">WP</span>
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge style={{ backgroundColor: '#fdf5e0', color: '#8a7530' }}>注目</Badge>
                        {catName && <Badge style={{ backgroundColor: '#e8ecf5', color: '#1a2f5e' }}>{catName}</Badge>}
                        {wp.industry && <Badge style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{wp.industry}</Badge>}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-[#1a2f5e] transition-colors">{wp.title}</h3>
                      {wp.summary && <p className="text-sm text-gray-600 line-clamp-3">{wp.summary}</p>}
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* すべてのホワイトペーパー */}
        <h2 className="text-xl font-bold text-gray-900 mb-6">{texts.section_all || 'すべてのホワイトペーパー'}</h2>
        {rest.length === 0 && featured.length === 0 ? (
          <p className="text-center text-gray-500 py-12">{texts.empty_state || '該当するホワイトペーパーが見つかりませんでした。'}</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.map((wp) => {
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const catName = (wp as any).whitepaper_categories?.name;
              return (
                <Link
                  key={wp.id}
                  href={`/business/whitepapers/${wp.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="aspect-[16/9] bg-gray-100 overflow-hidden">
                    {wp.thumbnail_url ? (
                      <img src={wp.thumbnail_url} alt={wp.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: theme['--biz-primary'] || '#1a2f5e' }}>
                        <span className="text-white/40 text-2xl">WP</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex flex-wrap gap-1 mb-2">
                      {catName && <Badge style={{ backgroundColor: '#e8ecf5', color: '#1a2f5e' }}>{catName}</Badge>}
                    </div>
                    <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 group-hover:text-[#1a2f5e] transition-colors">{wp.title}</h3>
                    {wp.summary && <p className="text-xs text-gray-500 line-clamp-2">{wp.summary}</p>}
                    <span className="inline-block mt-3 text-sm font-medium" style={{ color: theme['--biz-primary'] || '#1a2f5e' }}>
                      {texts.read_more || '詳しく読む'} →
                    </span>
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
