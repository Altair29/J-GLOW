'use client';

import { useState } from 'react';
import Link from 'next/link';

const cards = [
  {
    id: 'pro-simulator',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="12" y="26" width="56" height="38" rx="6" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"/>
        <path d="M30 26V20a6 6 0 0 1 6-6h8a6 6 0 0 1 6 6v6" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5" fill="none" strokeLinecap="round"/>
        <rect x="36" y="23" width="8" height="6" rx="2" fill="#c9a84c"/>
        <rect x="20" y="46" width="8" height="12" rx="2" fill="#c9a84c"/>
        <rect x="31" y="40" width="8" height="18" rx="2" fill="rgba(255,255,255,0.25)"/>
        <rect x="42" y="43" width="8" height="15" rx="2" fill="rgba(255,255,255,0.15)"/>
        <path d="M20 50 L31 44 L42 47 L56 38" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="56" cy="38" r="2.5" fill="#c9a84c"/>
        <rect x="52" y="48" width="16" height="12" rx="3" fill="#c9a84c"/>
        <text x="60" y="57" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">PDF</text>
      </svg>
    ),
    badge: 'PDF出力対応',
    title: '採用コストシミュレーター',
    subtitle: '受入企業への訪問時にその場で提案',
    features: [
      '在留資格別の採用コストを即試算',
      'PDFで提案資料をその場で出力',
      '企業訪問の営業ツールとして活用可能',
    ],
    link: '/business/cost-simulator',
  },
  {
    id: 'pro-template',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="16" width="36" height="50" rx="4" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"/>
        <rect x="26" y="12" width="12" height="8" rx="3" fill="rgba(255,255,255,0.4)"/>
        <rect x="29" y="10" width="6" height="4" rx="2" fill="#c9a84c"/>
        <rect x="14" y="24" width="36" height="10" fill="rgba(255,255,255,0.2)"/>
        <text x="32" y="32" textAnchor="middle" fill="white" fontSize="5.5" fontFamily="Arial" fontWeight="bold">INSTRUCTION</text>
        <line x1="20" y1="42" x2="44" y2="42" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="20" y1="48" x2="40" y2="48" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="20" y1="54" x2="44" y2="54" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="58" cy="36" r="14" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.4)" strokeWidth="2"/>
        <ellipse cx="58" cy="36" rx="6" ry="14" stroke="rgba(255,255,255,0.3)" strokeWidth="1" fill="none"/>
        <line x1="44" y1="36" x2="72" y2="36" stroke="rgba(255,255,255,0.3)" strokeWidth="1"/>
        <line x1="46" y1="28" x2="70" y2="28" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
        <line x1="46" y1="44" x2="70" y2="44" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8"/>
        <rect x="50" y="52" width="18" height="10" rx="3" fill="#c9a84c"/>
        <text x="59" y="59.5" textAnchor="middle" fill="white" fontSize="5.5" fontWeight="bold" fontFamily="Arial">6言語</text>
        <circle cx="22" cy="62" r="3" fill="#22C55E" opacity="0.7"/>
        <circle cx="30" cy="62" r="3" fill="#3B82F6" opacity="0.7"/>
        <circle cx="38" cy="62" r="3" fill="#EF4444" opacity="0.7"/>
      </svg>
    ),
    badge: '6言語対応',
    title: '現場指示書ビルダー',
    subtitle: '受入企業に多言語指示書を即提供',
    features: [
      '安全・緊急・日常ルールを自在に組合せ',
      '6言語対応で受入現場にすぐ導入',
      '企業への付加価値サービスとして提案',
    ],
    link: '/business/existing-users/connect/templates',
  },
  {
    id: 'pro-checker',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="10" y="32" width="60" height="16" rx="8" fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.3)" strokeWidth="2"/>
        <line x1="18" y1="40" x2="24" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="28" y1="40" x2="34" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="38" y1="40" x2="44" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="48" y1="40" x2="54" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="58" y1="40" x2="64" y2="40" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="18" cy="40" r="8" fill="rgba(255,255,255,0.2)"/>
        <text x="18" y="43" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">育</text>
        <circle cx="40" cy="40" r="10" fill="rgba(255,255,255,0.1)" stroke="#c9a84c" strokeWidth="3"/>
        <path d="M35 40 L38 43 L45 36" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="62" cy="40" r="8" fill="#c9a84c"/>
        <text x="62" y="43" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">特</text>
        <path d="M27 40 L30 40" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/>
        <path d="M29 37 L32 40 L29 43" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <path d="M51 40 L54 40" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round"/>
        <path d="M53 37 L56 40 L53 43" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
        <text x="18" y="24" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontSize="5.5" fontFamily="Arial" fontWeight="bold">育成就労</text>
        <text x="62" y="24" textAnchor="middle" fill="#c9a84c" fontSize="5.5" fontFamily="Arial" fontWeight="bold">特定技能</text>
        <rect x="28" y="56" width="24" height="10" rx="3" fill="rgba(255,255,255,0.2)"/>
        <text x="40" y="63.5" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">5問診断</text>
      </svg>
    ),
    badge: '5問で完了',
    title: '育成就労・特定技能 移行チェッカー',
    subtitle: '移行可否と企業のToDoを即診断',
    features: [
      '質問5問に答えるだけで判定',
      '移行ルートと必要な試験情報を表示',
      '受入企業への訪問・提案ツールに最適',
    ],
    link: '/business/roadmap?from=professionals&type=kanri',
  },
];

export default function ProfessionalsSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section style={{
      background: '#1a2f5e',
      padding: '72px 0 80px',
      borderTop: '1px solid #2a4a8e',
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
            <span style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 700 }}>For Professionals</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800,
            color: 'white', margin: '0 0 14px', letterSpacing: '-0.5px',
          }}>
            監理団体・登録支援機関・
            <span style={{ color: '#c9a84c' }}>士業</span>の方へ
          </h2>
          <p style={{
            fontSize: '15px', color: 'rgba(255,255,255,0.6)', maxWidth: '520px',
            margin: '0 auto', lineHeight: 1.8,
          }}>
            加盟企業・顧問先への提案に使えるツールを揃えています。<br />
            J-GLOWのツールで、外国人雇用支援の業務効率を上げてください。
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
                  display: 'block',
                  background: isHovered ? '#2d4a7a' : '#243a6a',
                  borderRadius: '16px',
                  padding: '28px 24px 24px',
                  border: isHovered ? '2px solid #c9a84c' : '2px solid rgba(255,255,255,0.1)',
                  boxShadow: isHovered
                    ? '0 12px 40px rgba(201,168,76,0.25)'
                    : '0 2px 16px rgba(0,0,0,0.2)',
                  transition: 'all 0.22s cubic-bezier(0.34, 1.56, 0.64, 1)',
                  transform: isHovered ? 'translateY(-4px)' : 'none',
                  textDecoration: 'none',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Corner accent */}
                {isHovered && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '60px', height: '60px',
                    background: 'linear-gradient(135deg, transparent 50%, rgba(201,168,76,0.2) 50%)',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Top row: icon + badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '72px', height: '72px',
                    background: isHovered ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.08)',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{ width: '52px', height: '52px' }}>
                      {card.icon}
                    </div>
                  </div>
                  <span style={{
                    background: isHovered ? '#c9a84c' : 'rgba(201,168,76,0.15)',
                    color: isHovered ? 'white' : '#c9a84c',
                    border: isHovered ? 'none' : '1px solid rgba(201,168,76,0.3)',
                    borderRadius: '20px',
                    padding: '4px 12px',
                    fontSize: '11px',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    transition: 'all 0.2s',
                    letterSpacing: '0.3px',
                  }}>
                    {card.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  margin: '0 0 4px',
                  fontSize: '16px', fontWeight: 800,
                  color: 'white', lineHeight: 1.4,
                }}>
                  {card.title}
                </h3>
                <p style={{
                  margin: '0 0 16px',
                  fontSize: '12px', color: 'rgba(255,255,255,0.5)',
                  lineHeight: 1.6,
                }}>
                  {card.subtitle}
                </p>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, rgba(255,255,255,0.15), transparent)',
                  marginBottom: '14px',
                }} />

                {/* Feature list */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {card.features.map((f, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      fontSize: '12.5px', color: 'rgba(255,255,255,0.75)', lineHeight: 1.6,
                      marginBottom: i < card.features.length - 1 ? '5px' : 0,
                    }}>
                      <span style={{
                        width: '16px', height: '16px', minWidth: '16px',
                        background: isHovered ? '#c9a84c' : 'rgba(255,255,255,0.2)',
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
                    color: isHovered ? '#c9a84c' : 'rgba(255,255,255,0.7)',
                    transition: 'color 0.2s',
                  }}>
                    今すぐ使う
                  </span>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                    style={{
                      transform: isHovered ? 'translateX(3px)' : 'none',
                      transition: 'transform 0.2s',
                    }}
                  >
                    <path d="M3 8H13M9 4L13 8L9 12"
                      stroke={isHovered ? '#c9a84c' : 'rgba(255,255,255,0.7)'}
                      strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              </Link>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link
            href="/business/partners"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '12px 28px',
              borderRadius: '8px',
              fontSize: '14px', fontWeight: 700,
              background: '#c9a84c', color: '#1a2f5e',
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}
          >
            パートナー登録について
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M3 8H13M9 4L13 8L9 12" stroke="#1a2f5e" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  );
}
