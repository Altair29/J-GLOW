'use client';

import { useInView } from '@/hooks/useInView';
import StatCard from '@/components/articles/StatCard';
import type { IndustryStat } from '@/lib/industry-data';

type Props = {
  stats: [IndustryStat, IndustryStat, IndustryStat];
};

export default function IndustryStatsBanner({ stats }: Props) {
  const view = useInView(0.3);

  return (
    <section
      ref={view.ref}
      style={{
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e2e8f0',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}
      >
        {stats.map((stat, i) => (
          <StatCard
            key={stat.label}
            number={stat.value}
            unit={stat.unit}
            label={stat.label}
            source={stat.source}
            delay={i * 0.15}
            inView={view.inView}
          />
        ))}
      </div>
    </section>
  );
}
