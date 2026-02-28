import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const cards = [
  {
    emoji: '🤝',
    label: 'つなぐ',
    title: '現場コミュニケーション改善',
    description:
      '言葉の壁を下げ、日本人スタッフと外国人材が協力できる職場づくりのためのコンテンツです。',
    href: '/business/existing-users/connect',
    linkLabel: '「つなぐ」を見る',
  },
  {
    emoji: '📊',
    label: '続ける・判断する',
    title: '定着と制度対応',
    description:
      '育成就労への移行コスト試算や、コンプライアンスチェックなど経営判断に必要な情報を提供します。',
    href: '/business/existing-users/continue',
    linkLabel: '「続ける・判断する」を見る',
  },
];

export function LadderFooterCTA() {
  return (
    <section
      className="py-16 md:py-20"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-6">
          {cards.map((card) => (
            <div
              key={card.label}
              className="rounded-2xl border border-gray-200 p-7 md:p-8"
              style={{ backgroundColor: '#f7f8fb' }}
            >
              <span
                className="inline-block text-xs font-semibold px-3 py-1 rounded-full mb-4"
                style={{
                  backgroundColor: 'rgba(26, 47, 94, 0.06)',
                  color: '#1a2f5e',
                }}
              >
                {card.emoji} {card.label}
              </span>

              <h3 className="text-lg font-bold text-gray-900 mb-2">
                {card.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed mb-6">
                {card.description}
              </p>

              <Link
                href={card.href}
                className="inline-flex items-center gap-1.5 text-sm font-semibold hover:gap-2.5 transition-all"
                style={{ color: '#1a2f5e' }}
              >
                {card.linkLabel}
                <ArrowRight size={14} />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
