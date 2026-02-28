import Link from 'next/link';
import { ArrowRight, CalendarClock } from 'lucide-react';

type Step = {
  period: string;
  title: string;
  description: string;
  highlight?: boolean;
};

const steps: Step[] = [
  {
    period: 'Step 1',
    title: '現状の見える化',
    description:
      '外国人スタッフの在留資格・スキルレベル・定着状況を棚卸し。自社診断で課題の優先度を把握します。',
  },
  {
    period: 'Step 2',
    title: '仕組みの導入・改善',
    description:
      '教育カリキュラムの設計、コミュニケーション体制の整備、管理フローの標準化を進めます。',
    highlight: true,
  },
  {
    period: 'Step 3',
    title: '定着と戦力化',
    description:
      '外国人スタッフが自律的に成長し、チームの戦力として定着する環境を継続的に運用します。',
  },
];

export function BusinessHubTimeline() {
  return (
    <section className="py-16 md:py-20">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <CalendarClock size={18} style={{ color: '#c9a84c' }} />
            <span
              className="text-xs font-semibold tracking-widest uppercase"
              style={{ color: '#c9a84c' }}
            >
              Roadmap
            </span>
          </div>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-gray-900 mb-3">
            改善ロードマップ
          </h2>
          <p className="text-gray-500 text-sm md:text-base max-w-lg mx-auto">
            外国人雇用の課題を3ステップで整理し、着実に改善していきます
          </p>
        </div>

        {/* ステップ */}
        <div className="relative">
          {/* 縦ライン */}
          <div
            className="absolute left-6 md:left-1/2 top-0 bottom-0 w-px md:-translate-x-px"
            style={{ backgroundColor: '#c9a84c', opacity: 0.25 }}
          />

          <div className="space-y-8">
            {steps.map((step, i) => (
              <div
                key={step.period}
                className={`relative flex items-start gap-6 md:gap-0 ${
                  i % 2 === 0
                    ? 'md:flex-row'
                    : 'md:flex-row-reverse'
                }`}
              >
                {/* ドット */}
                <div
                  className="absolute left-6 md:left-1/2 w-3 h-3 rounded-full md:-translate-x-1.5 -translate-x-1.5 mt-1.5 z-10"
                  style={{
                    backgroundColor: step.highlight ? '#c9a84c' : '#1a2f5e',
                    boxShadow: step.highlight
                      ? '0 0 0 4px rgba(201, 168, 76, 0.2)'
                      : '0 0 0 4px rgba(26, 47, 94, 0.1)',
                  }}
                />

                {/* スペーサー（モバイルは左の余白） */}
                <div className="w-12 md:hidden shrink-0" />

                {/* カード */}
                <div className="md:w-[calc(50%-2rem)] flex-1 md:flex-none">
                  <div
                    className={`bg-white rounded-xl border p-5 ${
                      step.highlight
                        ? 'border-[#c9a84c]/30 shadow-md'
                        : 'border-gray-200'
                    }`}
                  >
                    <span
                      className="text-xs font-bold tracking-wide"
                      style={{
                        color: step.highlight ? '#c9a84c' : '#1a2f5e',
                      }}
                    >
                      {step.period}
                    </span>
                    <h3 className="font-bold text-gray-900 mt-1 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-sm text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 詳しく見るリンク */}
        <div className="text-center mt-10">
          <Link
            href="/business/diagnosis"
            className="inline-flex items-center gap-2 text-sm font-semibold hover:gap-3 transition-all"
            style={{ color: '#1a2f5e' }}
          >
            まず自社診断から始める
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
