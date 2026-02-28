import Link from 'next/link';
import { ArrowRight, Play } from 'lucide-react';

const ladderSteps = [
  {
    num: '1',
    label: '育成就労',
    name: '育成就労（旧：技能実習）',
    period: '入国〜最長3年',
    badge: '2027年〜 新制度',
    badgeStyle: 'outline' as const,
    color: '#4a90c4',
  },
  {
    num: '2',
    label: '特定技能1号',
    name: '特定技能1号',
    period: '最長5年（更新可）',
    badge: null,
    badgeStyle: null,
    color: '#2d6ea8',
  },
  {
    num: '3',
    label: '特定技能2号',
    name: '特定技能2号',
    period: '期限なし・家族帯同可',
    badge: null,
    badgeStyle: null,
    color: '#1a4f8c',
  },
  {
    num: '★',
    label: '長期定着・戦力化',
    name: '永続的な戦力として定着',
    period: '永住権取得も視野に',
    badge: 'ゴール',
    badgeStyle: 'filled' as const,
    color: '#c9a84c',
  },
];

export function LadderHeroSection() {
  return (
    <section className="relative overflow-hidden">
      {/* ネイビーグラデーション背景 */}
      <div
        className="absolute inset-0"
        style={{
          background: 'linear-gradient(135deg, #0f1e3d 0%, #1a2f5e 100%)',
        }}
      />
      {/* 薄いゴールドのアクセント */}
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
              🎯 育てる
            </span>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-tight text-white mb-5">
              在留資格を
              <span style={{ color: '#c9a84c' }}>ステップアップ</span>
              させる仕組みをつくる
            </h1>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              入国直後から特定技能2号まで。外国人材が成長できる環境を設計するための情報と診断ツールを提供します。在留資格の種類を問わず、今いるスタッフの「次のステップ」を一緒に考えましょう。
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="#diagnostic"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-[#1a2f5e] text-sm shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: '#c9a84c' }}
              >
                <Play size={15} />
                移行チェッカーを使う（無料・3分）
              </Link>
              <Link
                href="#contents"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm border-2 border-white/30 hover:border-white/60 hover:-translate-y-0.5 transition-all duration-200"
              >
                コンテンツ一覧を見る
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* 右カラム: キャリアラダービジュアル */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
              キャリアラダー
            </p>
            <div className="flex flex-col gap-2">
              {ladderSteps.map((step, i) => (
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
                  {i < ladderSteps.length - 1 && (
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
