'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const cards = [
  {
    id: 'hiring',
    image: '/images/card-hiring.png',
    badge: 'はじめての方へ',
    title: 'はじめての外国人雇用',
    subtitle: '国籍・分野・時期から最適な採用プランを提案',
    features: [
      '在留資格の選び方を基礎から解説',
      '受入れまでの7ステップを網羅',
      'コスト・スケジュールの目安がわかる',
    ],
    link: '/business/hiring-guide',
  },
  {
    id: 'existing',
    image: '/images/card-existing.png',
    badge: '既に雇用している方へ',
    title: '外国人スタッフをもっと活かすために',
    subtitle: 'コミュニケーション・定着・スキルアップを支援',
    features: [
      '現場指示書・メンター制度の導入法',
      '在留資格の更新・移行チェック',
      '定着率を上げる実践ノウハウ',
    ],
    link: '/business/existing-users',
  },
  {
    id: 'roadmap',
    image: '/images/card-roadmap.png',
    badge: '制度変更への対応',
    title: '育成就労ロードマップ',
    subtitle: '2027年4月の制度開始に向けた準備を整理',
    features: [
      '施行までのスケジュールを時系列で確認',
      '監理団体・受入企業それぞれのToDoリスト',
      '最新の運用要領ポイントも解説',
    ],
    link: '/business/roadmap',
  },
];

export default function GuidanceSection() {
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
            <span style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 700 }}>Guidance</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800,
            color: '#1a2f5e', margin: '0 0 14px', letterSpacing: '-0.5px',
          }}>
            あなたの状況に合わせて
            <span style={{ color: '#c9a84c' }}>お選び</span>ください
          </h2>
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
                {/* Photo area */}
                <div style={{ position: 'relative', height: '160px', flexShrink: 0, overflow: 'hidden' }}>
                  <Image
                    src={card.image}
                    alt={card.title}
                    fill
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.5s',
                      transform: isHovered ? 'scale(1.05)' : 'scale(1)',
                    }}
                  />
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: isHovered ? 'rgba(255,255,255,0.1)' : 'transparent',
                    transition: 'background 0.3s',
                  }} />
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
