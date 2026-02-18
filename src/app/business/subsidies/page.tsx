import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { Badge } from '@/components/shared';
import { SubsidySearchForm } from '@/components/business/SubsidySearchForm';

export default async function SubsidiesPage() {
  const supabase = await createClient();

  const [texts, theme, { data: featured }] = await Promise.all([
    getContentBlocks(supabase, 'business_subsidies'),
    getThemeVars(supabase, 'business'),
    supabase
      .from('subsidies')
      .select('id, name, slug, provider, summary, max_amount, status, is_featured')
      .eq('status', 'active')
      .eq('is_featured', true)
      .order('sort_order')
      .limit(6),
  ]);

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
          <h1 className="text-3xl font-bold mb-3">{texts.hero_title || '助成金活用ナビ'}</h1>
          <p className="text-lg opacity-80">{texts.hero_subtitle || ''}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        {/* 検索フォーム */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-12">
          <h2 className="text-lg font-bold text-gray-900 mb-4">{texts.search_heading || '条件を選択してください'}</h2>
          <SubsidySearchForm texts={texts} theme={theme} />
        </div>

        {/* 注目の助成金 */}
        {(featured || []).length > 0 && (
          <div>
            <h2 className="text-xl font-bold text-gray-900 mb-6">{texts.featured_heading || '注目の助成金'}</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {(featured || []).map((sub) => (
                <Link
                  key={sub.id}
                  href={`/business/subsidies/${sub.slug}`}
                  className="group block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>
                      {sub.status === 'active' ? '受付中' : sub.status}
                    </Badge>
                    {sub.is_featured && <Badge style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>注目</Badge>}
                  </div>
                  <h3 className="font-bold text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">{sub.name}</h3>
                  <p className="text-xs text-gray-500 mb-2">{sub.provider}</p>
                  <p className="text-sm text-gray-600 line-clamp-2 mb-3">{sub.summary}</p>
                  {sub.max_amount && (
                    <span className="text-sm font-medium" style={{ color: theme['--biz-primary'] || '#1e3a5f' }}>
                      最大 {sub.max_amount}
                    </span>
                  )}
                </Link>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
