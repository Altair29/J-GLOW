import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import ToolsSection from './ToolsSection';
import { FadeUp, FadeUpGroup } from '@/components/common/FadeUp';

export default async function BusinessPage() {
  const supabase = await createClient();

  const [texts, theme] = await Promise.all([
    getContentBlocks(supabase, 'business_home'),
    getThemeVars(supabase, 'business'),
  ]);

  const pillars = [
    {
      title: 'はじめての外国人雇用',
      desc: '国籍・分野・時期を入力するだけでコスト・リスクを即試算',
      href: '/business/hiring-guide',
      image: '/images/card-hiring.png',
      external: false,
    },
    {
      title: '外国人スタッフをもっと活かすために',
      desc: 'コミュニケーション・定着・スキルアップの課題を解決します',
      href: '/business/existing-users',
      image: '/images/card-existing.png',
      external: false,
    },
    {
      title: '育成就労ロードマップ',
      desc: '2027年4月の制度変更に向けた準備スケジュールを確認',
      href: '/business/roadmap',
      image: '/images/card-roadmap.png',
      external: false,
    },
  ];

  const primaryColor = theme['--biz-primary'] || '#1a2f5e';

  return (
    <div>
      {/* ========================================
          [1] ヒーロー（縮小版）
          ======================================== */}
      <section className="relative min-h-[360px] md:min-h-[50vh] flex items-center overflow-hidden">
        <Image
          src="/images/hero-1.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" />

        <FadeUp duration={0.8} distance={40} className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1
            className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl mx-auto mb-4"
            style={{ color: theme['--biz-hero-text-dark'] || '#1a2f5e' }}
          >
            あなたの会社の外国人雇用を、<br className="hidden sm:block" />
            もう一段階先へ。
          </h1>
          <p
            className="font-[family-name:var(--font-heading)] text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-3"
            style={{ color: theme['--biz-hero-text-dark'] || '#1a2f5e', opacity: 0.75 }}
          >
            グローバル人材の熱量(Glow)を、日本の新たな成長力(Grow)に。
          </p>
          <p
            className="text-xs sm:text-sm max-w-2xl mx-auto mb-8"
            style={{ color: theme['--biz-hero-subtext'] || '#4a5568', opacity: 0.5 }}
          >
            Japan and Global: Talent Glowing and Growing Together
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/business/cost-simulator"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
            >
              自社に合う外国人採用を診断
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/business/hiring-guide"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm border-2 hover:-translate-y-0.5 transition-all duration-200 bg-white/30 backdrop-blur-sm"
              style={{ borderColor: '#1a2f5e', color: '#1a2f5e' }}
            >
              採用ガイドを見る
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ========================================
          [2] 状況別3本柱カード
          ======================================== */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp>
            <h2
              className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-12"
              style={{ color: primaryColor }}
            >
              あなたの状況に合わせてお選びください
            </h2>
          </FadeUp>
          <FadeUpGroup stagger={0.12} className="grid md:grid-cols-3 gap-6">
            {pillars.map((p) => {
              const cardContent = (
                <>
                  <div className="relative h-[200px] overflow-hidden">
                    <Image
                      src={p.image}
                      alt={p.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div className="p-6 md:p-8 flex flex-col flex-1">
                    <h3
                      className="font-[family-name:var(--font-heading)] text-lg font-bold mb-2"
                      style={{ color: primaryColor }}
                    >
                      {p.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-6 flex-1">
                      {p.desc}
                    </p>
                    <span
                      className="inline-flex items-center justify-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-lg text-white hover:opacity-90 transition-opacity w-full"
                      style={{ backgroundColor: primaryColor }}
                    >
                      詳しく見る
                      <ArrowRight size={14} />
                    </span>
                  </div>
                </>
              );

              const cardClass = "group glass rounded-2xl overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col";

              if (p.external) {
                return (
                  <a key={p.href} href={p.href} target="_blank" rel="noopener noreferrer" className={cardClass}>
                    {cardContent}
                  </a>
                );
              }
              return (
                <Link key={p.href} href={p.href} className={cardClass}>
                  {cardContent}
                </Link>
              );
            })}
          </FadeUpGroup>
        </div>
      </section>

      {/* ========================================
          [3] 現場で使えるツール（6ツール）
          ======================================== */}
      <FadeUp>
        <ToolsSection />
      </FadeUp>

      {/* ========================================
          [4] 制度の今を知る（統計 + 記事）
          ======================================== */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp>
            <h2
              className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-12"
              style={{ color: primaryColor }}
            >
              制度の今を知る
            </h2>
          </FadeUp>

          {/* 記事3本 */}
          <FadeUpGroup stagger={0.1} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link href="/business/hiring-guide/labor-shortage"
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-gradient-to-br from-[#1a2f5e] to-[#2a4a8e] flex items-center justify-center p-6">
                <p className="text-white text-center font-bold text-lg leading-snug">
                  1,100万人<br />
                  <span className="text-sm font-normal text-blue-200">2040年に予測される労働力不足</span>
                </p>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#c9a84c] font-semibold mb-1">データで見る</p>
                <h3 className="text-base font-bold text-[#1a2f5e] mb-2 group-hover:underline">
                  日本の労働力不足の現実
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  2040年に向けて加速する人手不足の実態を、統計データで解説。なぜ今、外国人雇用なのかがわかります。
                </p>
              </div>
            </Link>

            <Link href="/business/hiring-guide/trends"
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-gradient-to-br from-[#2a6e4e] to-[#3a8e6e] flex items-center justify-center p-6">
                <p className="text-white text-center font-bold text-lg leading-snug">
                  257万人<br />
                  <span className="text-sm font-normal text-green-200">外国人労働者数（2025年10月・過去最多）</span>
                </p>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#c9a84c] font-semibold mb-1">トレンド</p>
                <h3 className="text-base font-bold text-[#1a2f5e] mb-2 group-hover:underline">
                  外国人採用の最新動向
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  育成就労制度の開始で何が変わるか。2027年に向けた各業種の受入れ動向を整理しました。
                </p>
              </div>
            </Link>

            <Link href="/business/hiring-guide/honest-guide"
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-gradient-to-br from-[#7a3a1e] to-[#c9a84c] flex items-center justify-center p-6">
                <p className="text-white text-center font-bold text-lg leading-snug">
                  離職率16.1%<br />
                  <span className="text-sm font-normal text-amber-100">日本人新卒の半分以下</span>
                </p>
              </div>
              <div className="p-5">
                <p className="text-xs text-[#c9a84c] font-semibold mb-1">正直に書きます</p>
                <h3 className="text-base font-bold text-[#1a2f5e] mb-2 group-hover:underline">
                  外国人雇用の正直ガイド
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  メリットだけでなくリアルな課題も含めて解説。準備した企業ほど定着率が高い理由がわかります。
                </p>
              </div>
            </Link>
          </FadeUpGroup>
        </div>
      </section>

      {/* ========================================
          [5] 監理団体・士業の方へ
          ======================================== */}
      <section
        className="py-16 md:py-20"
        style={{ backgroundColor: '#1a2f5e', borderTop: '1px solid #2a4a8e' }}
      >
        <div className="max-w-5xl mx-auto px-4">
          <FadeUp>
            <p
              className="text-xs font-semibold tracking-widest uppercase text-center mb-3"
              style={{ color: '#c9a84c' }}
            >
              For Professionals
            </p>
            <h2
              className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-3 text-white"
            >
              監理団体・登録支援機関・士業の方へ
            </h2>
            <p className="text-sm text-center max-w-xl mx-auto mb-10 leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
              加盟企業・顧問先への提案に使えるツールを揃えています。<br />
              J-GLOWのツールで、外国人雇用支援の業務効率を上げてください。
            </p>
          </FadeUp>
          <style>{`
            .pro-card {
              background: rgba(255,255,255,0.07);
              border: 1px solid rgba(255,255,255,0.15);
            }
            .pro-card:hover {
              background: rgba(255,255,255,0.12);
              border-color: #c9a84c;
            }
          `}</style>
          <FadeUpGroup stagger={0.12} className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {[
              {
                icon: '\u{1F4B0}',
                title: '採用コストシミュレーター',
                desc: '企業訪問時にその場で試算。説得力ある提案資料をPDFで作成できます。',
                href: '/business/cost-simulator',
                badge: '無料',
              },
              {
                icon: '\u{1F4CB}',
                title: '現場指示書ビルダー',
                desc: '6言語対応の現場ルール・安全指示書を作成。印刷して即日使用できます。',
                href: '/business/existing-users/connect/templates',
                badge: '無料',
              },
              {
                icon: '\u{2705}',
                title: '育成就労・特定技能 移行チェッカー',
                desc: '5問の質問に答えるだけで移行可否と企業のToDoを確認。監理団体の企業訪問に最適。',
                href: '/business/roadmap?from=professionals&type=kanri',
                badge: '無料',
              },
            ].map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="pro-card block rounded-xl p-5 transition-all duration-200 no-underline"
              >
                <div className="text-2xl mb-2">{card.icon}</div>
                <span
                  className="inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full mb-2"
                  style={{ backgroundColor: 'rgba(201,168,76,0.2)', color: '#c9a84c' }}
                >
                  {card.badge}
                </span>
                <h3 className="text-white text-sm font-bold mb-2 leading-snug">
                  {card.title}
                </h3>
                <p className="text-xs leading-relaxed m-0" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {card.desc}
                </p>
              </Link>
            ))}
          </FadeUpGroup>

          <FadeUp delay={0.3}>
            <div className="text-center mt-10">
              <Link
                href="/business/partners"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5"
                style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
              >
                パートナー登録について
                <ArrowRight size={14} />
              </Link>
            </div>
          </FadeUp>
        </div>
      </section>
    </div>
  );
}
