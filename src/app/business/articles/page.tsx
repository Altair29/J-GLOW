import { createClient } from '@/lib/supabase/server';
import Link from 'next/link';

export const metadata = {
  title: '分野別 外国人採用ガイド | J-GLOW',
  description:
    '育成就労・特定技能が対象となる全19分野の受入れ情報を分野ごとに詳しく解説しています。',
};

// slug → アイコン
const INDUSTRY_ICONS: Record<string, string> = {
  kaigo: '🏥',
  kogyo: '🏭',
  nogyo: '🌾',
  inshoku: '🍱',
  kensetsu: '🏗️',
  biru: '🧹',
  zosen: '⚓',
  'jidosha-seib': '🔧',
  koku: '✈️',
  shukuhaku: '🏨',
  gyogyo: '🎣',
  gaishoku: '🍽️',
  'jidosha-unso': '🚛',
  tetsudo: '🚃',
  ringyo: '🌲',
  mokuzai: '🪵',
  linen: '👕',
  butsuryu: '📦',
  shigen: '♻️',
};

// 特定技能のみ（育成就労対象外）
const TOKUTEI_ONLY_SLUGS = new Set(['koku', 'jidosha-unso']);

// slug → 短い説明文
const INDUSTRY_DESCRIPTIONS: Record<string, string> = {
  kaigo: '高齢化が進む中、外国人スタッフの受入れが最も活発な分野です。',
  kogyo: '製造業全般で幅広い業務に外国人材を受け入れることができます。',
  nogyo: '季節労働や地域人材不足を補う重要な受入れ分野です。',
  inshoku: '食品製造・加工分野で外国人材の活躍が広がっています。',
  kensetsu: '建設需要の高まりに伴い、外国人材の受入れが拡大中です。',
  biru: 'ビルクリーニング分野で安定した雇用機会を提供します。',
  zosen: '造船・舶用工業分野での技術継承が課題となっています。',
  'jidosha-seib': '自動車整備士の人材不足を外国人材で補う分野です。',
  koku: '航空分野は特定技能のみが対象の専門分野です。',
  shukuhaku: '観光業の回復に伴い、宿泊分野での人材需要が増加中です。',
  gyogyo: '漁業・養殖業で外国人材の受入れが進んでいます。',
  gaishoku: '外食産業での人材確保が急務となっている分野です。',
  'jidosha-unso': '自動車運送業は特定技能のみが対象の分野です。',
  tetsudo: '鉄道分野での外国人材受入れが新たに始まります。',
  ringyo: '林業分野での担い手不足を外国人材で補います。',
  mokuzai: '木材産業での人材確保を支援する分野です。',
  linen: 'リネンサプライ分野でのクリーニング業務を担います。',
  butsuryu: '物流分野での倉庫・運搬業務に外国人材を受け入れます。',
  shigen: '資源リサイクル分野での人材確保を支援します。',
};

export default async function ArticlesPage() {
  const supabase = await createClient();

  // industry-guide カテゴリのIDを取得
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id')
    .eq('slug', 'industry-guide')
    .single();

  const categoryId = categories?.id;

  // 分野別ガイドの記事のみ取得
  const { data: posts } = categoryId
    ? await supabase
        .from('blog_posts')
        .select('slug, title')
        .eq('status', 'published')
        .eq('category_id', categoryId)
        .order('title', { ascending: true })
    : { data: [] };

  const industryPosts = posts || [];

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* ヒーロー */}
      <section
        className="py-16 sm:py-20 text-white"
        style={{ background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 100%)' }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <nav className="text-sm text-blue-200 mb-6">
            <Link href="/business" className="hover:text-white">
              企業向けトップ
            </Link>
            <span className="mx-2">&gt;</span>
            <span>分野別ガイド</span>
          </nav>
          <h1 className="text-2xl sm:text-3xl font-bold">
            分野別 外国人採用ガイド
          </h1>
          <p className="mt-4 text-blue-200 text-sm sm:text-base max-w-2xl leading-relaxed">
            育成就労・特定技能が対象となる全19分野の
            <br className="hidden sm:block" />
            受入れ情報を分野ごとに詳しく解説しています。
          </p>
        </div>
      </section>

      {/* 制度比較マップ誘導カード */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-12 pb-2">
        <Link
          href="/business/articles/industry-overview"
          className="group block rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5"
          style={{ background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 60%, #2a4a8e 100%)' }}
        >
          <div className="flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
            <div className="text-5xl shrink-0">🗺️</div>
            <div className="flex-1 text-center sm:text-left">
              <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded mb-2" style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}>
                NEW
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mb-1">
                19分野 制度比較マップ
              </h2>
              <p className="text-sm text-blue-200 leading-relaxed">
                育成就労・特定技能の全19分野を受入れ人数・転籍制限・試験難易度で比較。キャリアパスの全体像もわかります。
              </p>
            </div>
            <span
              className="shrink-0 inline-flex items-center gap-1.5 text-sm font-bold px-6 py-2.5 rounded-lg group-hover:gap-2.5 transition-all"
              style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
            >
              比較マップを見る →
            </span>
          </div>
        </Link>
      </section>

      {/* カードグリッド */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {industryPosts.map((post) => {
            const isTokuteiOnly = TOKUTEI_ONLY_SLUGS.has(post.slug);
            const icon = INDUSTRY_ICONS[post.slug] || '📄';
            const desc = INDUSTRY_DESCRIPTIONS[post.slug] || '';

            return (
              <Link
                key={post.slug}
                href={`/business/articles/${post.slug}`}
                className="relative block rounded-xl border border-gray-200 bg-white p-6 transition-shadow hover:shadow-lg group"
                style={isTokuteiOnly ? { opacity: 0.85 } : undefined}
              >
                {/* 育成就労対象外ラベル */}
                {isTokuteiOnly && (
                  <span className="absolute top-3 right-3 text-[10px] font-semibold text-gray-400 bg-gray-100 rounded px-2 py-0.5">
                    育成就労対象外
                  </span>
                )}

                {/* バッジ */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {isTokuteiOnly ? (
                    <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-gray-200 text-gray-600">
                      特定技能のみ
                    </span>
                  ) : (
                    <>
                      <span
                        className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded text-white"
                        style={{ backgroundColor: '#1a2f5e' }}
                      >
                        育成就労
                      </span>
                      <span className="inline-block text-[11px] font-bold px-2.5 py-0.5 rounded bg-sky-100 text-sky-700">
                        特定技能
                      </span>
                    </>
                  )}
                </div>

                {/* アイコン + 分野名 */}
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-3xl leading-none">{icon}</span>
                  <h3 className="text-lg font-bold text-[#1a2f5e] leading-snug group-hover:underline">
                    {post.title.replace(/^【分野別ガイド】/, '').replace(/分野$/, '')}
                  </h3>
                </div>

                {/* 説明文 */}
                {desc && (
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {desc}
                  </p>
                )}

                {/* ボタン */}
                <span
                  className="inline-block text-xs font-bold px-4 py-1.5 rounded-md transition-opacity group-hover:opacity-90"
                  style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
                >
                  詳しく見る →
                </span>
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <section
          className="mt-16 rounded-2xl p-8 sm:p-10 text-center"
          style={{ background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 100%)' }}
        >
          <h2 className="text-lg sm:text-xl font-bold text-white mb-3">
            分野が決まったら、採用コストを試算しましょう
          </h2>
          <p className="text-sm text-blue-200 mb-6 max-w-lg mx-auto">
            在留資格・分野・人数を入力するだけで、採用から受入れまでの概算コストを無料で試算できます。
          </p>
          <Link
            href="/business/cost-simulator"
            className="inline-block text-sm font-bold px-8 py-3 rounded-lg transition-opacity hover:opacity-90"
            style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
          >
            コストシミュレーターを使う →
          </Link>
        </section>
      </main>
    </div>
  );
}
