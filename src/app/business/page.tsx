import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowRight,
  Calculator,
  BookOpen,
  Coins,
  ExternalLink,
} from 'lucide-react';
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
      icon: Calculator,
      title: '外国人雇用コストシミュレーター',
      desc: '採用コストを簡単試算',
      href: '/business/cost-simulator',
      external: false,
      disabled: false,
    },
    {
      icon: BookOpen,
      title: '育成就労・特定技能 全19分野 解説',
      desc: '分野別の制度詳細を解説',
      href: '/business/articles',
      external: false,
      disabled: false,
    },
    {
      icon: Coins,
      title: '助成金活用',
      desc: '活用可能な助成金を検索',
      href: '#',
      external: false,
      disabled: true,
    },
  ];

  const primaryColor = theme['--biz-primary'] || '#1a2f5e';

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
            className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold leading-tight mb-4"
            style={{ color: theme['--biz-hero-text-dark'] || '#1a2f5e' }}
          >
            あなたの会社の外国人雇用を、もう一段階先へ。
          </h1>
          <p
            className="font-[family-name:var(--font-heading)] text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-3"
            style={{ color: theme['--biz-hero-text-dark'] || '#1a2f5e', opacity: 0.75 }}
          >
            グローバル人材の熱量(Glow)を、日本の新たな成長力(Grow)に。
          </p>
          <p
            className="text-xs sm:text-sm max-w-2xl mx-auto mb-10"
            style={{ color: theme['--biz-hero-subtext'] || '#4a5568', opacity: 0.5 }}
          >
            Japan and Global: Talent Glowing and Growing Together
          </p>
        </div>
      </section>

      {/* ========================================
          数字で語る
          ======================================== */}
      <section className="py-10" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8 md:gap-12 text-center">
            {[
              { number: '230万人', label: '日本で働く外国人労働者数（2024年10月・過去最多）' },
              { number: '60.5%', label: '2024年の就業者増加数に占める外国人の割合' },
              { number: '1,100万人', label: '2040年に予測される労働力不足' },
            ].map((s) => (
              <div key={s.number}>
                <p className="font-[family-name:var(--font-number)] text-4xl md:text-5xl font-bold mb-2" style={{ color: '#1a2f5e' }}>
                  {s.number}
                </p>
                <p className="text-sm text-slate-500 leading-relaxed">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          選ばれる理由
          ======================================== */}
      <section className="py-8" style={{ backgroundColor: '#ffffff', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-center mb-6" style={{ color: '#1a2f5e' }}>
            なぜJ-GLOWが選ばれるのか
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              { title: '制度情報をまとめて把握', desc: '育成就労・特定技能・技能実習の制度変更を一元管理。常に最新情報を確認できます。' },
              { title: '現場で使えるツール', desc: 'コストシミュレーター・適正診断など、実務に直結するツールを無料で提供しています。' },
              { title: '伴走型サポート', desc: '課題の特定から実行まで、御社の状況に合わせた個別サポートを提供します。' },
            ].map((r) => (
              <div key={r.title} className="glass rounded-xl p-4 md:p-5 text-center">
                <h3 className="font-[family-name:var(--font-heading)] text-sm font-bold mb-1.5" style={{ color: '#1a2f5e' }}>
                  {r.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          コンサルティングの流れ
          ======================================== */}
      <section className="py-8" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-center mb-8" style={{ color: '#1a2f5e' }}>
            J-GLOWのコンサルティングの流れ
          </h2>
          <div className="grid md:grid-cols-3 gap-4 md:gap-0 items-start">
            {[
              { step: 'Step 1', title: '現状診断', desc: '外国人雇用の現状をヒアリング・診断し、課題を可視化します。' },
              { step: 'Step 2', title: '課題の特定と提案', desc: '制度・コスト・運用面の課題を整理し、最適な改善策をご提案します。' },
              { step: 'Step 3', title: '実行支援', desc: '計画の実行をサポートし、定着・成果につなげます。' },
            ].map((s, i) => (
              <div key={s.step} className="flex items-start md:flex-col md:items-center md:text-center gap-4 md:gap-0 relative">
                {i > 0 && (
                  <div className="hidden md:block absolute -left-2 top-8 text-slate-300 text-2xl">→</div>
                )}
                <div
                  className="shrink-0 w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-white font-bold text-lg md:text-xl md:mb-4"
                  style={{ backgroundColor: '#1a2f5e' }}
                >
                  {i + 1}
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: '#c9a84c' }}>{s.step}</p>
                  <h3 className="font-[family-name:var(--font-heading)] text-base md:text-lg font-bold mb-2" style={{ color: '#1a2f5e' }}>
                    {s.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================
          3本柱カード
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
          サポートツール
          ======================================== */}
      <section className="py-16 md:py-20" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-5xl mx-auto px-4">
        <h2
          className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold mb-6"
          style={{ color: primaryColor }}
        >
          活用できるツール
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {tools.map((t) => {
            const Icon = t.icon;
            const card = (
              <div
                className={`glass rounded-xl p-5 flex items-start gap-4 transition-all duration-300 ${
                  t.disabled
                    ? 'opacity-40 pointer-events-none'
                    : 'hover:shadow-lg hover:-translate-y-0.5'
                }`}
              >
                <div
                  className="p-2 rounded-lg shrink-0"
                  style={{ backgroundColor: `${primaryColor}15` }}
                >
                  <Icon size={18} style={{ color: primaryColor }} />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3
                      className="font-[family-name:var(--font-heading)] text-sm font-bold"
                      style={{ color: primaryColor }}
                    >
                      {t.title}
                    </h3>
                    {t.disabled && (
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-500 px-2 py-0.5 rounded-full">
                        準備中
                      </span>
                    )}
                    {t.external && (
                      <ExternalLink size={12} className="text-slate-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{t.desc}</p>
                </div>
              </div>
            );

            if (t.disabled) {
              return <div key={t.title}>{card}</div>;
            }
            if (t.external) {
              return (
                <a key={t.title} href={t.href} target="_blank" rel="noopener noreferrer">
                  {card}
                </a>
              );
            }
            return (
              <Link key={t.title} href={t.href}>
                {card}
              </Link>
            );
          })}
        </div>
        </div>
      </section>

      {/* ========================================
          深掘り記事
          ======================================== */}
      <section className="py-16" style={{ backgroundColor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-[#1a2f5e] mb-8">もっと詳しく知りたい方へ</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

            {/* カード① */}
            <a href="/business/hiring-guide/labor-shortage"
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
            </a>

            {/* カード② */}
            <a href="/business/hiring-guide/trends"
              className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
              <div className="h-36 bg-gradient-to-br from-[#2a6e4e] to-[#3a8e6e] flex items-center justify-center p-6">
                <p className="text-white text-center font-bold text-lg leading-snug">
                  284,466人<br />
                  <span className="text-sm font-normal text-green-200">特定技能在留者数（2024年12月）</span>
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
            </a>

            {/* カード③ */}
            <a href="/business/hiring-guide/honest-guide"
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
            </a>

          </div>
        </div>
      </section>
    </div>
  );
}
