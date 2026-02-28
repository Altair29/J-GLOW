import Link from 'next/link';
import { ArrowRight, Shield } from 'lucide-react';

const continueStages = [
  {
    num: '1',
    label: 'なぜ辞めるのかを知る',
    name: 'なぜ辞めるのかを知る',
    period: '在留資格別の離職構造',
    badge: '基礎理解',
    badgeStyle: 'outline' as const,
    color: '#4a90c4',
  },
  {
    num: '2',
    label: '給与・ポジションで向き合う',
    name: '給与・ポジションで向き合う',
    period: '同等待遇の義務と昇給設計',
    badge: null,
    badgeStyle: null,
    color: '#2d6ea8',
  },
  {
    num: '3',
    label: '在留資格別キャリア支援',
    name: '在留資格別キャリア支援',
    period: '育成就労・技人国・留学生',
    badge: null,
    badgeStyle: null,
    color: '#1a4f8c',
  },
  {
    num: '\u2605',
    label: '制度対応・コンプライアンス',
    name: '制度対応・コンプライアンス',
    period: '更新管理と違反防止',
    badge: 'ゴール',
    badgeStyle: 'filled' as const,
    color: '#c9a84c',
  },
];

export function ContinueHeroSection() {
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
              <Shield size={12} className="inline -mt-0.5 mr-1" />
              CONTINUE
            </span>

            <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-[2.5rem] font-bold leading-tight text-white mb-5">
              外国人材が
              <span style={{ color: '#c9a84c' }}>&ldquo;続ける&rdquo;</span>
              職場をつくる
            </h1>

            <p className="text-base md:text-lg text-white/70 leading-relaxed mb-8 max-w-lg">
              外国人材が辞める理由の多くは、採用後の関わり方にあります。給与・キャリア・生活支援・在留資格管理——それぞれに向き合うことで、「この会社で長く働きたい」と思われる職場になります。
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
                href="/business/existing-users/connect"
                className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl font-semibold text-white text-sm border-2 border-white/30 hover:border-white/60 hover:-translate-y-0.5 transition-all duration-200"
              >
                「つなぐ」を見る
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>

          {/* 右カラム: ステージビジュアル */}
          <div>
            <p className="text-xs font-semibold tracking-widest uppercase text-white/40 mb-4">
              定着・制度対応ステージ
            </p>
            <div className="flex flex-col gap-2">
              {continueStages.map((step, i) => (
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
                  {i < continueStages.length - 1 && (
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
