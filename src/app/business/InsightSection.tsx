'use client';

import { useState } from 'react';
import Link from 'next/link';

const cards = [
  {
    id: 'labor-shortage',
    bg: 'linear-gradient(135deg, #1a2f5e 0%, #2a4f8e 100%)',
    stat: '1,100万人',
    statSub: '2040年に予測される労働力不足',
    badge: 'データで見る',
    title: '日本の労働力不足の現実',
    subtitle: '統計データで読み解く人手不足の実態',
    features: [
      '2040年に1,100万人の労働力不足予測',
      '業種別の人手不足ランキングと傾向',
      'なぜ今、外国人雇用なのかが数字でわかる',
    ],
    link: '/business/hiring-guide/labor-shortage',
  },
  {
    id: 'trends',
    bg: 'linear-gradient(135deg, #0f3d2e 0%, #1a6a50 100%)',
    stat: '257万人',
    statSub: '外国人労働者数（2025年10月・過去最多）',
    badge: 'トレンド',
    title: '外国人採用の最新動向',
    subtitle: '育成就労制度で変わる採用市場の今',
    features: [
      '外国人労働者数が過去最多の257万人に',
      '育成就労制度で何が変わるかを整理',
      '2027年に向けた業種別の受入れ動向',
    ],
    link: '/business/hiring-guide/trends',
  },
  {
    id: 'honest',
    bg: 'linear-gradient(135deg, #3d2a0e 0%, #7a5520 100%)',
    stat: '離職率16.1%',
    statSub: '日本人新卒の半分以下',
    badge: '正直に書きます',
    title: '外国人雇用の正直ガイド',
    subtitle: 'メリットもリスクも包み隠さず解説',
    features: [
      '外国人材の離職率は日本人新卒の半分以下',
      'よくある課題とその対処法を正直に紹介',
      '準備した企業ほど定着率が高い理由',
    ],
    link: '/business/hiring-guide/honest-guide',
  },
];

export default function InsightSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section style={{
      background: '#f4f7fb',
      padding: '72px 0 80px',
      borderTop: '1px solid #e2e8f0',
      fontFamily: "'Noto Sans JP', 'Hiragino Kaku Gothic ProN', sans-serif",
    }}>
      <div style={{ maxWidth: '1080px', margin: '0 auto', padding: '0 24px' }}>

        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '52px' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '20px', padding: '5px 16px',
            marginBottom: '16px',
          }}>
            <span style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 700 }}>Insight</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800,
            color: '#1a2f5e', margin: '0 0 14px', letterSpacing: '-0.5px',
          }}>
            数字から見る、外国人雇用の
            <span style={{ color: '#c9a84c' }}>今と未来</span>
          </h2>
          <p style={{
            fontSize: '15px', color: '#555', maxWidth: '520px',
            margin: '0 auto', lineHeight: 1.8,
          }}>
            データで読み解く外国人雇用の現状とこれから
          </p>
        </div>

        {/* Card Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '20px',
        }}>
          {cards.map((card) => {
            const isHovered = hovered === card.id;
            return (
              <Link
                key={card.id}
                href={card.link}
                onMouseEnter={() => setHovered(card.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'white',
                  borderRadius: '16px',
                  border: isHovered ? '2px solid #c9a84c' : '2px solid transparent',
                  boxShadow: isHovered
                    ? '0 12px 40px rgba(201,168,76,0.2)'
                    : '0 2px 16px rgba(26,47,94,0.07)',
                  transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isHovered ? 'translateY(-4px)' : 'none',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Gradient stat area */}
                <div style={{
                  height: '160px', flexShrink: 0,
                  background: card.bg,
                  display: 'flex', flexDirection: 'column',
                  alignItems: 'center', justifyContent: 'center',
                  padding: '0 24px',
                  position: 'relative', overflow: 'hidden',
                }}>
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
                    transition: 'background 0.3s',
                  }} />
                  <p style={{
                    fontSize: '32px', fontWeight: 900, color: 'white',
                    position: 'relative', zIndex: 1, textAlign: 'center',
                    transition: 'transform 0.3s',
                    transform: isHovered ? 'scale(1.1)' : 'scale(1)',
                  }}>
                    {card.stat}
                  </p>
                  <p style={{
                    fontSize: '12px', color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center', marginTop: '4px',
                    position: 'relative', zIndex: 1, lineHeight: 1.5,
                  }}>
                    {card.statSub}
                  </p>
                </div>

                {/* Content area */}
                <div style={{ padding: '24px 24px 24px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  {/* Badge */}
                  <span style={{
                    alignSelf: 'flex-start',
                    background: isHovered ? '#c9a84c' : '#f0f4ff',
                    color: isHovered ? 'white' : '#1a2f5e',
                    border: isHovered ? 'none' : '1px solid #d0dcf0',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    letterSpacing: '0.3px',
                    marginBottom: '12px',
                  }}>
                    {card.badge}
                  </span>

                  {/* Title */}
                  <h3 style={{
                    margin: '0 0 4px',
                    fontSize: '16px', fontWeight: 800,
                    color: '#1a2f5e', lineHeight: 1.4,
                  }}>
                    {card.title}
                  </h3>
                  <p style={{
                    margin: '0 0 16px',
                    fontSize: '12px', color: '#888',
                    lineHeight: 1.6,
                  }}>
                    {card.subtitle}
                  </p>

                  {/* Divider */}
                  <div style={{
                    height: '1px',
                    background: 'linear-gradient(to right, #e2e8f0, transparent)',
                    marginBottom: '14px',
                  }} />

                  {/* Feature list */}
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', flex: 1 }}>
                    {card.features.map((f, i) => (
                      <li key={i} style={{
                        display: 'flex', alignItems: 'flex-start', gap: '8px',
                        fontSize: '12.5px', color: '#444', lineHeight: 1.6,
                        marginBottom: i < card.features.length - 1 ? '5px' : 0,
                      }}>
                        <span style={{
                          width: '16px', height: '16px', minWidth: '16px',
                          background: isHovered ? '#c9a84c' : '#1a2f5e',
                          borderRadius: '50%',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          marginTop: '2px',
                          transition: 'background 0.2s',
                        }}>
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
                            <path d="M1.5 4L3.5 6L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </span>
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <div style={{
                    marginTop: '20px',
                    display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                    gap: '4px',
                  }}>
                    <span style={{
                      fontSize: '12px', fontWeight: 700,
                      color: isHovered ? '#c9a84c' : '#1a2f5e',
                      transition: 'color 0.2s',
                    }}>
                      詳しく見る
                    </span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                      style={{
                        transform: isHovered ? 'translateX(3px)' : 'none',
                        transition: 'transform 0.2s',
                      }}
                    >
                      <path d="M3 8H13M9 4L13 8L9 12"
                        stroke={isHovered ? '#c9a84c' : '#1a2f5e'}
                        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
