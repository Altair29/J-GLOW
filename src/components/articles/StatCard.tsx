'use client';

type Props = {
  number: string;
  unit: string;
  label: string;
  source: string;
  delay?: number;
  inView: boolean;
  color?: string;
};

export default function StatCard({
  number,
  unit,
  label,
  source,
  delay = 0,
  inView,
  color = '#1a2f5e',
}: Props) {
  return (
    <div
      style={{
        backgroundColor: '#fff',
        border: '1px solid #e2e8f0',
        borderRadius: '12px',
        padding: '24px 20px',
        textAlign: 'center',
        opacity: inView ? 1 : 0,
        transform: inView ? 'translateY(0)' : 'translateY(10px)',
        transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
      }}
    >
      <div
        style={{
          fontSize: 'clamp(2rem, 5vw, 2.5rem)',
          fontWeight: 700,
          color,
          lineHeight: 1.2,
          marginBottom: '8px',
        }}
      >
        {number}
        <span style={{ fontSize: '0.5em', marginLeft: '2px' }}>{unit}</span>
      </div>
      <div
        style={{
          fontSize: '14px',
          fontWeight: 600,
          color: '#1e293b',
          marginBottom: '12px',
          lineHeight: 1.5,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: '11px',
          color: '#94a3b8',
          lineHeight: 1.5,
          whiteSpace: 'pre-line',
        }}
      >
        {source}
      </div>
    </div>
  );
}
