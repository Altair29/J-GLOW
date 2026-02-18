import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars, getFeatureCards } from '@/lib/data';
import { getIcon } from '@/lib/icons';

/* ========================================
   Bento配置マップ
   sort_order → { gridClass, size }
   ======================================== */
const bentoMap: Record<number, { gridClass: string; size: 'lg' | 'md' | 'sm' }> = {
  4: { gridClass: 'md:col-span-2 md:row-span-2', size: 'lg' },
  1: { gridClass: 'md:col-span-2',               size: 'md' },
  2: { gridClass: '',                             size: 'sm' },
  7: { gridClass: '',                             size: 'sm' },
  3: { gridClass: 'md:col-span-2',               size: 'md' },
  5: { gridClass: '',                             size: 'sm' },
  6: { gridClass: '',                             size: 'sm' },
};

const bentoOrder = [4, 1, 2, 7, 3, 5, 6];

/* サイズ別スタイル */
const sizeStyles = {
  lg: { padding: 'p-8',  title: 'text-2xl', icon: 32, minH: 'min-h-[200px] md:min-h-0' },
  md: { padding: 'p-6',  title: 'text-xl',  icon: 28, minH: '' },
  sm: { padding: 'p-5',  title: 'text-lg',  icon: 24, minH: '' },
};

export default async function BusinessPage() {
  const supabase = await createClient();
  const [texts, theme, cards] = await Promise.all([
    getContentBlocks(supabase, 'business_home'),
    getThemeVars(supabase, 'business'),
    getFeatureCards(supabase, 'business'),
  ]);

  /* sort_order → card のマップ */
  const cardBySortOrder = new Map(cards.map((c) => [c.sort_order, c]));

  /* Bento順に並べ替え */
  const sortedCards = bentoOrder
    .map((order) => cardBySortOrder.get(order))
    .filter(Boolean) as typeof cards;

  return (
    <div>
      {/* ========================================
          ヒーローセクション
          ======================================== */}
      <section className="relative min-h-[560px] flex items-center overflow-hidden">
        {/* 背景画像 */}
        <Image
          src="/images/hero-1.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        {/* オーバーレイ */}
        <div className="absolute inset-0 hero-overlay" />

        {/* コンテンツ */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 text-center">
          <h1
            className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl font-bold leading-tight mb-6"
            style={{ color: theme['--biz-hero-text-dark'] || '#1e293b' }}
          >
            {texts.hero_title || ''}
          </h1>
          <p
            className="font-[family-name:var(--font-heading)] text-lg md:text-xl max-w-2xl mx-auto mb-10"
            style={{ color: theme['--biz-hero-subtext'] || '#475569' }}
          >
            {texts.hero_subtitle || ''}
          </p>
          <Link
            href="/business/diagnosis"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl font-semibold text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: theme['--biz-primary'] || '#1e3a5f' }}
          >
            {texts.hero_cta || ''}
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* ========================================
          Bento Grid セクション
          ======================================== */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2
          className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-12"
          style={{ color: theme['--biz-hero-text-dark'] || '#1e293b' }}
        >
          {texts.section_heading || ''}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
          {sortedCards.map((card, idx) => {
            const bento = bentoMap[card.sort_order] ?? { gridClass: '', size: 'sm' as const };
            const ss = sizeStyles[bento.size];
            const Icon = getIcon(card.icon);

            return (
              <Link
                key={card.id}
                href={card.href}
                className={`group block glass bento-card rounded-2xl animate-fade-in-up ${ss.padding} ${ss.minH} ${bento.gridClass}`}
                style={{
                  animationDelay: `${idx * 80}ms`,
                  borderColor: card.color_border,
                  color: card.color_text,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="shrink-0 p-3 rounded-lg"
                    style={{ backgroundColor: card.color_icon_bg }}
                  >
                    {Icon && <Icon size={ss.icon} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className={`${ss.title} font-bold mb-2`}>{card.title}</h3>
                    <p className="text-sm opacity-80 leading-relaxed">
                      {card.description}
                    </p>
                    <span className="inline-flex items-center gap-1 mt-3 text-sm font-medium group-hover:gap-2 transition-all">
                      {texts.card_more_label || '詳しく見る'}
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
