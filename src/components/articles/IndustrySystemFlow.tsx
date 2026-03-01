'use client';

import { useInView } from '@/hooks/useInView';

type VisaFlags = {
  ikusei: boolean;
  tokutei1: boolean;
  tokutei2: boolean;
};

type Props = {
  visa: VisaFlags;
};

const STEPS = [
  {
    key: 'ikusei' as const,
    title: '育成就労',
    duration: '最長3年',
    description: '技能を育成しながら就労',
    color: '#1a2f5e',
  },
  {
    key: 'tokutei1' as const,
    title: '特定技能1号',
    duration: '最長5年',
    description: '即戦力として就労',
    color: '#2d5a9e',
  },
  {
    key: 'tokutei2' as const,
    title: '特定技能2号',
    duration: '期間制限なし',
    description: '熟練技能・家族帯同可',
    color: '#c9a84c',
  },
];

export default function IndustrySystemFlow({ visa }: Props) {
  const view = useInView(0.2);

  return (
    <section
      ref={view.ref}
      style={{
        backgroundColor: '#fff',
        borderTop: '1px solid #e2e8f0',
        padding: '48px 24px',
      }}
    >
      <div style={{ maxWidth: '720px', margin: '0 auto' }}>
        <h2
          style={{
            fontSize: '18px',
            fontWeight: 700,
            color: '#1a2f5e',
            marginBottom: '8px',
            paddingBottom: '10px',
            borderBottom: '2px solid #c9a84c',
          }}
        >
          この分野のキャリアパス
        </h2>
        <p
          style={{
            fontSize: '13px',
            color: '#64748b',
            marginBottom: '32px',
          }}
        >
          この分野で利用可能な在留資格のステップです
        </p>

        {/* フローチャート */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'stretch',
            gap: '0',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {STEPS.map((step, i) => {
            const active = visa[step.key];
            return (
              <div
                key={step.key}
                style={{
                  display: 'flex',
                  alignItems: 'stretch',
                  opacity: view.inView ? 1 : 0,
                  transform: view.inView ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                }}
              >
                {/* カード */}
                <div
                  style={{
                    width: '180px',
                    padding: '20px 16px',
                    borderRadius: '12px',
                    border: `2px solid ${active ? step.color : '#e2e8f0'}`,
                    backgroundColor: active ? '#fff' : '#f9fafb',
                    opacity: active ? 1 : 0.5,
                    textAlign: 'center',
                    position: 'relative',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    minHeight: '140px',
                  }}
                >
                  {!active && (
                    <span
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        fontSize: '10px',
                        fontWeight: 600,
                        color: '#94a3b8',
                        backgroundColor: '#f1f5f9',
                        padding: '2px 8px',
                        borderRadius: '4px',
                      }}
                    >
                      対象外
                    </span>
                  )}
                  <div
                    style={{
                      fontSize: '15px',
                      fontWeight: 700,
                      color: active ? step.color : '#94a3b8',
                      marginBottom: '6px',
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      display: 'inline-block',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: active ? '#fff' : '#94a3b8',
                      backgroundColor: active ? step.color : '#e2e8f0',
                      padding: '2px 10px',
                      borderRadius: '999px',
                      marginBottom: '8px',
                      alignSelf: 'center',
                    }}
                  >
                    {step.duration}
                  </div>
                  <div
                    style={{
                      fontSize: '12px',
                      color: active ? '#64748b' : '#94a3b8',
                      lineHeight: 1.5,
                    }}
                  >
                    {step.description}
                  </div>
                </div>

                {/* 矢印（最後のステップには不要） */}
                {i < STEPS.length - 1 && (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0 8px',
                      opacity: view.inView ? 1 : 0,
                      transition: `opacity 0.5s ease ${(i + 0.5) * 0.15}s`,
                    }}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#94a3b8"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="industry-flow-arrow"
                    >
                      <path d="M5 12h14" />
                      <path d="m12 5 7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* モバイル用スタイル */}
        <style>{`
          @media (max-width: 640px) {
            .industry-flow-arrow {
              transform: rotate(90deg);
            }
          }
        `}</style>
      </div>
    </section>
  );
}
