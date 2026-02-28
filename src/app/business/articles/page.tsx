import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: '育成就労・外国人雇用 記事一覧 | J-GLOW',
  description: '育成就労制度の解説記事・分野別ガイドの一覧。2027年4月施行に向けた実務情報を掲載。',
};

export default async function ArticlesPage() {
  const supabase = await createClient();

  // カテゴリ取得
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, slug, name')
    .in('slug', ['ikuseshuro', 'industry-guide']);

  const categoryMap: Record<number, { slug: string; name: string }> = {};
  for (const cat of categories || []) {
    categoryMap[cat.id] = { slug: cat.slug, name: cat.name };
  }

  // 記事取得
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('slug, title, category_id, is_pinned, published_at')
    .eq('status', 'published')
    .in('category_id', Object.keys(categoryMap).map(Number))
    .order('is_pinned', { ascending: false })
    .order('published_at', { ascending: true });

  // カテゴリ分類
  const ikuseshuroPosts = (posts || []).filter(p => categoryMap[p.category_id]?.slug === 'ikuseshuro');
  const industryPosts = (posts || []).filter(p => categoryMap[p.category_id]?.slug === 'industry-guide');

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* ヒーロー */}
      <section
        className="py-16 text-white"
        style={{ background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1d3d 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-6">
          <nav className="text-sm text-blue-200 mb-4">
            <Link href="/business" className="hover:text-white">企業向けトップ</Link>
            <span className="mx-2">{'>'}</span>
            <span>記事一覧</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold">
            育成就労制度・外国人雇用の記事
          </h1>
          <p className="mt-3 text-blue-200 text-sm">
            2027年4月施行の育成就労制度を中心に、外国人雇用の実務情報を解説しています。
          </p>
        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 py-12">
        {/* 特別記事 */}
        {ikuseshuroPosts.filter(p => p.is_pinned).length > 0 && (
          <section className="mb-12">
            <h2 className="text-lg font-bold text-[#1a2f5e] mb-4 pb-2 border-b-2 border-[#c9a84c]">
              特別記事
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              {ikuseshuroPosts.filter(p => p.is_pinned).map(post => (
                <Link
                  key={post.slug}
                  href={`/business/articles/${post.slug}`}
                  className="block rounded-xl border border-gray-200 bg-white p-5 hover:shadow-md transition-shadow"
                >
                  <span className="inline-block text-xs font-semibold text-[#c9a84c] bg-amber-50 px-2 py-0.5 rounded mb-2">
                    特別記事
                  </span>
                  <h3 className="text-base font-bold text-[#1a2f5e] leading-snug">
                    {post.title}
                  </h3>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* 育成就労制度の記事 */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#1a2f5e] mb-4 pb-2 border-b-2 border-[#c9a84c]">
            育成就労制度の記事（{ikuseshuroPosts.filter(p => !p.is_pinned).length}本）
          </h2>
          <div className="space-y-3">
            {ikuseshuroPosts.filter(p => !p.is_pinned).map((post, i) => (
              <Link
                key={post.slug}
                href={`/business/articles/${post.slug}`}
                className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <span className="shrink-0 w-8 h-8 rounded-full bg-[#1a2f5e] text-white text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <h3 className="text-sm font-bold text-gray-800 leading-relaxed">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>

        {/* 分野別ガイド */}
        <section className="mb-12">
          <h2 className="text-lg font-bold text-[#1a2f5e] mb-4 pb-2 border-b-2 border-[#c9a84c]">
            分野別ガイド（{industryPosts.length}分野）
          </h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {industryPosts.map(post => (
              <Link
                key={post.slug}
                href={`/business/articles/${post.slug}`}
                className="block rounded-lg border border-gray-200 bg-white p-4 hover:shadow-sm transition-shadow"
              >
                <h3 className="text-sm font-bold text-gray-800 leading-relaxed">
                  {post.title}
                </h3>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
