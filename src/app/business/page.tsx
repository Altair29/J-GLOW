import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Newspaper } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import {
  getContentBlocks,
  getThemeVars,
  getFeatureCards,
  getFeatureLabels,
} from '@/lib/data';
import { getIcon } from '@/lib/icons';
import type { FeatureCard } from '@/types/database';

/* ========================================
   Bento Grid 配置定義
   4col × 3row  — F型視線誘導
   ======================================== */
type BentoSlot = {
  gridClass: string;
  size: 'xl' | 'lg' | 'md' | 'sm';
};

const bentoSlots: Record<number, BentoSlot> = {
  4: { gridClass: 'md:col-span-2 md:row-span-2', size: 'xl' }, // ① Simulation
  1: { gridClass: '',                              size: 'md' }, // ② Assessment
  // sort_order=2 (News) は特別レンダリング
  3: { gridClass: '',                              size: 'md' }, // ④ Roadmap
  5: { gridClass: '',                              size: 'sm' }, // ⑤ Whitepaper
  7: { gridClass: '',                              size: 'sm' }, // ⑥ Statistics
  6: { gridClass: 'md:col-span-2',                 size: 'md' }, // ⑦ Subsidy
};

const sizeConfig = {
  xl: { padding: 'p-8 md:p-10', title: 'text-2xl md:text-3xl', desc: 'text-base', icon: 40, gap: 'gap-5' },
  lg: { padding: 'p-7',         title: 'text-xl md:text-2xl',   desc: 'text-sm',  icon: 32, gap: 'gap-4' },
  md: { padding: 'p-6',         title: 'text-lg',               desc: 'text-sm',  icon: 26, gap: 'gap-3' },
  sm: { padding: 'p-5',         title: 'text-base',             desc: 'text-xs',  icon: 22, gap: 'gap-3' },
};

/* Bento 並び順 (News=2 を除く6枚) */
const bentoOrder = [4, 1, 3, 5, 7, 6];

/* ========================================
   汎用 Bento カードコンポーネント
   ======================================== */
function BentoCard({
  card,
  slot,
  delay,
  moreLabel,
}: {
  card: FeatureCard;
  slot: BentoSlot;
  delay: number;
  moreLabel: string;
}) {
  const cfg = sizeConfig[slot.size];
  const Icon = getIcon(card.icon);

  return (
    <Link
      href={card.href}
      className={`group block glass bento-card rounded-2xl animate-fade-in-up ${cfg.padding} ${slot.gridClass}`}
      style={{
        animationDelay: `${delay}ms`,
        color: card.color_text,
      }}
    >
      <div className={`flex flex-col h-full ${cfg.gap}`}>
        <div
          className="shrink-0 w-fit p-3 rounded-xl"
          style={{ backgroundColor: card.color_icon_bg }}
        >
          {Icon && <Icon size={cfg.icon} strokeWidth={1.8} />}
        </div>
        <div className="flex-1">
          <h3 className={`${cfg.title} font-bold leading-snug mb-2`}>
            {card.title}
          </h3>
          <p className={`${cfg.desc} opacity-70 leading-relaxed`}>
            {card.description}
          </p>
        </div>
        <span className="inline-flex items-center gap-1 text-sm font-medium opacity-60 group-hover:opacity-100 group-hover:gap-2 transition-all mt-auto">
          {moreLabel}
          <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
}

/* ========================================
   メインページ
   ======================================== */
export default async function BusinessPage() {
  const supabase = await createClient();

  const [texts, theme, cards, labels, { data: latestPosts }] =
    await Promise.all([
      getContentBlocks(supabase, 'business_home'),
      getThemeVars(supabase, 'business'),
      getFeatureCards(supabase, 'business'),
      getFeatureLabels(supabase),
      supabase
        .from('blog_posts')
        .select(
          'id, title, slug, cover_image_url, is_pinned, published_at'
        )
        .eq('status', 'published')
        .lte('published_at', new Date().toISOString())
        .order('is_pinned', { ascending: false })
        .order('published_at', { ascending: false })
        .limit(5),
    ]);

  const cardMap = new Map(cards.map((c) => [c.sort_order, c]));
  const newsCard = cardMap.get(2);
  const posts = latestPosts ?? [];

  return (
    <div>
      {/* ========================================
          ヒーローセクション
          ======================================== */}
      <section className="relative min-h-[520px] md:min-h-[600px] flex items-center overflow-hidden">
        <Image
          src="/images/hero-1.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-24 text-center">
          <h1
            className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-5"
            style={{ color: theme['--biz-hero-text-dark'] || '#1e293b' }}
          >
            {texts.hero_title || ''}
          </h1>
          <p
            className="font-[family-name:var(--font-heading)] text-base sm:text-lg md:text-xl max-w-2xl mx-auto mb-10 tracking-wide"
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
      <section className="max-w-7xl mx-auto px-4 py-16 md:py-20">
        <h2
          className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-4"
          style={{ color: theme['--biz-hero-text-dark'] || '#1e293b' }}
        >
          {texts.section_heading || ''}
        </h2>
        <p className="text-center text-slate-500 text-sm md:text-base mb-12 max-w-xl mx-auto">
          {texts.section_subheading || '企業の外国人材活用を、あらゆる角度からサポートします。'}
        </p>

        {/* 4col × 3row Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-5">

          {/* ── Row 1-2, Col 1-2: ① Simulation (2col×2row) ── */}
          {cardMap.get(4) && (
            <BentoCard
              card={cardMap.get(4)!}
              slot={bentoSlots[4]}
              delay={0}
              moreLabel={texts.card_more_label || '詳しく見る'}
            />
          )}

          {/* ── Row 1, Col 3: ② Assessment ── */}
          {cardMap.get(1) && (
            <BentoCard
              card={cardMap.get(1)!}
              slot={bentoSlots[1]}
              delay={80}
              moreLabel={texts.card_more_label || '詳しく見る'}
            />
          )}

          {/* ── Row 1-2, Col 4: ③ News (LIVE / 2row) ── */}
          <div
            className="md:row-span-2 glass bento-card rounded-2xl p-5 flex flex-col animate-fade-in-up"
            style={{ animationDelay: '160ms' }}
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="p-2.5 rounded-xl"
                style={{
                  backgroundColor: newsCard?.color_icon_bg || '#e0e7ff',
                }}
              >
                <Newspaper
                  size={22}
                  strokeWidth={1.8}
                  style={{ color: newsCard?.color_text || '#4338ca' }}
                />
              </div>
              <h3
                className="text-lg font-bold"
                style={{ color: newsCard?.color_text || '#4338ca' }}
              >
                {labels.news}
              </h3>
            </div>

            {/* 記事リスト */}
            <div className="flex-1 space-y-2.5 min-h-0">
              {posts.length > 0 ? (
                posts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/business/blog/${post.slug}`}
                    className="group/post flex items-start gap-3 p-2 -mx-2 rounded-lg hover:bg-white/70 transition-colors"
                  >
                    <div className="shrink-0 w-11 h-11 rounded-lg overflow-hidden bg-slate-100 mt-0.5">
                      {post.cover_image_url ? (
                        <img
                          src={post.cover_image_url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center"
                          style={{
                            backgroundColor:
                              theme['--biz-primary'] || '#1e3a5f',
                          }}
                        >
                          <span className="text-white/40 text-[10px]">
                            NEW
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-700 leading-snug line-clamp-2 group-hover/post:text-slate-900 transition-colors">
                        {post.title}
                      </p>
                      <time className="text-[11px] text-slate-400 mt-0.5 block">
                        {post.published_at
                          ? new Date(post.published_at).toLocaleDateString(
                              'ja-JP'
                            )
                          : ''}
                      </time>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-xs text-slate-400 py-4 text-center">
                  記事がまだありません
                </p>
              )}
            </div>

            {/* 一覧リンク */}
            <Link
              href="/business/blog"
              className="inline-flex items-center gap-1 text-sm font-medium mt-3 pt-3 border-t border-slate-200/60 opacity-60 hover:opacity-100 transition-opacity"
              style={{ color: newsCard?.color_text || '#4338ca' }}
            >
              一覧へ
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* ── Row 2, Col 3: ④ Roadmap ── */}
          {cardMap.get(3) && (
            <BentoCard
              card={cardMap.get(3)!}
              slot={bentoSlots[3]}
              delay={240}
              moreLabel={texts.card_more_label || '詳しく見る'}
            />
          )}

          {/* ── Row 3: ⑤ Whitepaper | ⑥ Statistics | ⑦ Subsidy (2col) ── */}
          {cardMap.get(5) && (
            <BentoCard
              card={cardMap.get(5)!}
              slot={bentoSlots[5]}
              delay={320}
              moreLabel={texts.card_more_label || '詳しく見る'}
            />
          )}
          {cardMap.get(7) && (
            <BentoCard
              card={cardMap.get(7)!}
              slot={bentoSlots[7]}
              delay={400}
              moreLabel={texts.card_more_label || '詳しく見る'}
            />
          )}
          {cardMap.get(6) && (
            <BentoCard
              card={cardMap.get(6)!}
              slot={bentoSlots[6]}
              delay={480}
              moreLabel={texts.card_more_label || '詳しく見る'}
            />
          )}
        </div>
      </section>
    </div>
  );
}
