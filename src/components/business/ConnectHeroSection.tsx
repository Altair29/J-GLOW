import Link from 'next/link';
import { ArrowRight, MessageCircle } from 'lucide-react';

const connectStages = [
  {
    num: '1',
    label: '伝わらない原因を知る',
    name: '伝わらない原因を知る',
    period: '「はい」の落とし穴・やさしい日本語',
    badge: '基礎理解',
    badgeStyle: 'outline' as const,
    color: '#4a90c4',
  },
  {
    num: '2',
    label: '口頭に頼らない仕組みをつくる',
    name: '口頭に頼らない仕組みをつくる',
    period: 'マニュアル設計・ビジュアル指示書',
    badge: null,
    badgeStyle: null,
    color: '#2d6ea8',
  },
  {
    num: '3',
    label: 'すれ違いを構造的に減らす',
    name: 'すれ違いを構造的に減らす',
    period: '文化ギャップ・メンター・日本語支援',
    badge: null,
    badgeStyle: null,
    color: '#1a4f8c',
  },
  {
    num: '★',
    label: '声を上げられる職場にする',
    name: '声を上げられる職場にする',
    period: '心理的安全性の確立',
    badge: 'ゴール',
    badgeStyle: 'filled' as const,
    color: '#c9a84c',
  },
];

export function ConnectHeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 100%)',
        }}
      />
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 70% 50%, #c9a84c 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 md:gap-14 items-center">
          {/* 左カラム */}
          <div>
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full border mb-6"
              style={{ borderColor: '#c9a84c', color: '#c9a84c' }}
            >
              <MessageCircle size={12} className="inline -mt-0.5 mr-1" />
              CONNECT
            </span>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-tight text-white mb-5">
              外国人材と
              <span style={{ color: '#c9a84c' }}>&ldquo;つながる&rdquo;</span>
              現場をつくる
            </h1>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              外国人スタッフの日本語力が上がるのを待つより、「伝わる仕組み」を先につくる。言葉の壁を下げ、日本人スタッフと外国人材が協力できる職場づくりのためのコンテンツです。
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#contents"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#1a2f5e] text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: '#c9a84c' }}
              >
                コンテンツ一覧を見る
                <ArrowRight size={15} />
              </Link>
              <Link
                href="/business/existing-users/ladder"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm border-2 border-white/30 hover:border-white/60 hover:-translate-y-0.5 transition-all duration-200"
              >
                「育てる」を見る
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* 右カラム: ステージビジュアル */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
              コミュニケーション改善ステージ
            </p>
            <div className="flex flex-col gap-2">
              {connectStages.map((step, i) => (
                <div key={step.num}>
                  <div
                    className="rounded-xl p-4"
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      borderLeft: `3px solid ${step.color}`,
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold text-white"
                        style={{ backgroundColor: step.color }}
                      >
                        {step.num}
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-white">
                            {step.name}
                          </span>
                          {step.badge && step.badgeStyle === 'outline' && (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full border"
                              style={{
                                borderColor: '#c9a84c',
                                color: '#c9a84c',
                              }}
                            >
                              {step.badge}
                            </span>
                          )}
                          {step.badge && step.badgeStyle === 'filled' && (
                            <span
                              className="text-[10px] font-semibold px-2 py-0.5 rounded-full text-[#1a2f5e]"
                              style={{ backgroundColor: '#c9a84c' }}
                            >
                              {step.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-white/50 mt-0.5">
                          {step.period}
                        </p>
                      </div>
                    </div>
                  </div>
                  {i < connectStages.length - 1 && (
                    <div className="text-center text-white/30 text-sm py-0.5">
                      ↓
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
