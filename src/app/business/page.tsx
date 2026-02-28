import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';

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

  const tools = [
    {
      name: '外国人採用ナビゲーター',
      desc: '業種・条件から最適な在留資格を提案',
      href: '/business/cost-simulator',
      icon: '🧭',
    },
    {
      name: '採用計画コストシミュレーター',
      desc: '在留資格別の採用コストを詳細試算',
      href: '/business/hiring-guide/cost-simulator',
      icon: '💴',
    },
    {
      name: '労働条件通知書 生成ツール',
      desc: 'ビザ別に対応した労働条件通知書を自動生成',
      href: '/business/tools/labor-notice',
      icon: '📄',
    },
    {
      name: '現場指示書ビルダー',
      desc: '7言語対応の現場ルールを自社用にカスタマイズ',
      href: '/business/existing-users/connect/templates',
      icon: '🏭',
    },
    {
      name: '特定技能移行チェッカー',
      desc: '育成就労から特定技能への移行可否を診断',
      href: '/business/existing-users/ladder/checker',
      icon: '✅',
    },
    {
      name: '全19分野 解説',
      desc: '育成就労・特定技能が使える分野を網羅解説',
      href: '/business/articles',
      icon: '📋',
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

        <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
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
        </div>
      </section>

      {/* ========================================
          [2] 状況別3本柱カード
          ======================================== */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ color: primaryColor }}
          >
            あなたの状況に合わせてお選びください
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </section>

      {/* ========================================
          [3] 現場で使えるツール（6ツール）
          ======================================== */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-3"
            style={{ color: primaryColor }}
          >
            現場で使えるツール
          </h2>
          <p className="text-sm text-slate-500 text-center max-w-xl mx-auto mb-10 leading-relaxed">
            コストシミュレーター・適正診断など、実務に直結するツールを無料で提供しています。
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((t) => (
              <Link key={t.href} href={t.href} className="group">
                <div
                  className="p-5 rounded-xl border border-white/10 hover:border-[#c9a84c]/30 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 h-full flex flex-col"
                  style={{ background: 'linear-gradient(145deg, #1a2f5e 0%, #142548 100%)' }}
                >
                  <span className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-white/10 text-xl mb-3">
                    {t.icon}
                  </span>
                  <h3 className="text-white font-[family-name:var(--font-heading)] text-sm font-bold mb-1.5">
                    {t.name}
                  </h3>
                  <p className="text-slate-300/70 text-xs leading-relaxed mb-3 flex-1">{t.desc}</p>
                  <span
                    className="inline-flex items-center gap-1.5 text-xs font-semibold group-hover:gap-2.5 transition-all duration-200"
                    style={{ color: '#c9a84c' }}
                  >
                    使ってみる <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          [4] 制度の今を知る（統計 + 記事）
          ======================================== */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2
            className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center mb-12"
            style={{ color: primaryColor }}
          >
            制度の今を知る
          </h2>

          {/* 記事3本 */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
          </div>
        </div>
      </section>
    </div>
  );
}
