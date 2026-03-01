'use client';

import { useState } from 'react';
import Link from 'next/link';

const tools = [
  {
    id: 'navigator',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="28" fill="#EEF3FB" stroke="#1a2f5e" strokeWidth="2.5"/>
        <circle cx="40" cy="40" r="18" fill="white" stroke="#1a2f5e" strokeWidth="1.5"/>
        <path d="M40 18 L43 36 L40 38 L37 36 Z" fill="#c9a84c"/>
        <path d="M40 62 L37 44 L40 42 L43 44 Z" fill="#1a2f5e"/>
        <path d="M18 40 L36 37 L38 40 L36 43 Z" fill="#1a2f5e"/>
        <path d="M62 40 L44 43 L42 40 L44 37 Z" fill="#1a2f5e"/>
        <circle cx="40" cy="40" r="4" fill="#c9a84c"/>
        <line x1="40" y1="14" x2="40" y2="18" stroke="#1a2f5e" strokeWidth="2" strokeLinecap="round"/>
        <line x1="40" y1="62" x2="40" y2="66" stroke="#1a2f5e" strokeWidth="2" strokeLinecap="round"/>
        <line x1="14" y1="40" x2="18" y2="40" stroke="#1a2f5e" strokeWidth="2" strokeLinecap="round"/>
        <line x1="62" y1="40" x2="66" y2="40" stroke="#1a2f5e" strokeWidth="2" strokeLinecap="round"/>
        <rect x="12" y="54" width="8" height="10" rx="1" fill="#c9a84c" opacity="0.7"/>
        <rect x="14" y="50" width="4" height="5" rx="1" fill="#c9a84c" opacity="0.7"/>
      </svg>
    ),
    badge: 'ステップ式',
    title: '外国人採用ナビゲーター',
    subtitle: '業種・条件から在留資格を自動提案',
    features: ['業種・規模を入力するだけ', '育成就労・特定技能など最適ビザを表示', 'コスト目安もその場で確認'],
    link: '/business/navigator',
  },
  {
    id: 'simulator',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16" y="14" width="48" height="52" rx="6" fill="#EEF3FB" stroke="#1a2f5e" strokeWidth="2.5"/>
        <rect x="22" y="20" width="36" height="14" rx="3" fill="#1a2f5e"/>
        <text x="40" y="31" textAnchor="middle" fill="#c9a84c" fontSize="10" fontWeight="bold" fontFamily="Arial">¥ 試算</text>
        <rect x="22" y="40" width="10" height="18" rx="2" fill="#c9a84c"/>
        <rect x="35" y="44" width="10" height="14" rx="2" fill="#1a2f5e" opacity="0.6"/>
        <rect x="48" y="48" width="10" height="10" rx="2" fill="#1a2f5e" opacity="0.35"/>
        <path d="M22 56 L32 48 L42 52 L54 42" stroke="#c9a84c" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="54" cy="42" r="2.5" fill="#c9a84c"/>
      </svg>
    ),
    badge: 'PDF出力対応',
    title: '採用計画コストシミュレーター',
    subtitle: '初年度〜3年間のコストを詳細試算',
    features: ['送出機関・管理費など全項目網羅', '3ペルソナ（監理団体/経験あり/未経験）', '提案書PDFとして即出力可能'],
    link: '/business/hiring-guide/cost-simulator',
  },
  {
    id: 'labor',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="18" y="10" width="38" height="50" rx="4" fill="white" stroke="#1a2f5e" strokeWidth="2.5"/>
        <rect x="18" y="10" width="38" height="12" rx="4" fill="#1a2f5e"/>
        <rect x="18" y="16" width="38" height="6" fill="#1a2f5e"/>
        <text x="37" y="20" textAnchor="middle" fill="white" fontSize="6" fontFamily="Arial" fontWeight="bold">労働条件通知書</text>
        <line x1="24" y1="30" x2="50" y2="30" stroke="#c9a84c" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="36" x2="50" y2="36" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="42" x2="44" y2="42" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
        <line x1="24" y1="48" x2="50" y2="48" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="58" cy="52" r="12" fill="#c9a84c"/>
        <text x="58" y="56" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">8言語</text>
        <circle cx="26" cy="55" r="3" fill="#EF4444" opacity="0.7"/>
        <circle cx="34" cy="57" r="3" fill="#22C55E" opacity="0.7"/>
        <circle cx="42" cy="55" r="3" fill="#3B82F6" opacity="0.7"/>
      </svg>
    ),
    badge: '8言語対応',
    title: '労働条件通知書 生成ツール',
    subtitle: 'ビザ別・8言語に対応した書類を自動生成',
    features: ['育成就労・特定技能など在留資格別に対応', '日・英・越・中・比・尼・緬・タイ語', '入管庁様式に準拠したPDF出力'],
    link: '/business/tools/labor-notice',
  },
  {
    id: 'template',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="14" y="16" width="32" height="42" rx="4" fill="white" stroke="#1a2f5e" strokeWidth="2.5"/>
        <rect x="14" y="16" width="32" height="10" rx="4" fill="#1a2f5e"/>
        <rect x="14" y="20" width="32" height="6" fill="#1a2f5e"/>
        <circle cx="21" cy="34" r="3" fill="#c9a84c"/>
        <line x1="26" y1="34" x2="40" y2="34" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="21" cy="42" r="3" fill="#c9a84c"/>
        <line x1="26" y1="42" x2="40" y2="42" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="21" cy="50" r="3" fill="#1a2f5e" opacity="0.3"/>
        <line x1="26" y1="50" x2="38" y2="50" stroke="#ddd" strokeWidth="1.5" strokeLinecap="round"/>
        <rect x="42" y="28" width="24" height="16" rx="4" fill="#c9a84c"/>
        <path d="M44 44 L42 50 L50 44 Z" fill="#c9a84c"/>
        <text x="54" y="39" textAnchor="middle" fill="white" fontSize="6" fontWeight="bold" fontFamily="Arial">7言語</text>
        <text x="54" y="46" textAnchor="middle" fill="white" fontSize="5" fontFamily="Arial">で出力</text>
        <circle cx="58" cy="60" r="5" fill="#1a2f5e" opacity="0.2"/>
        <circle cx="58" cy="57" r="3" fill="#1a2f5e"/>
        <path d="M53 68 Q58 63 63 68" stroke="#1a2f5e" strokeWidth="2" strokeLinecap="round" fill="none"/>
      </svg>
    ),
    badge: '7言語出力',
    title: '現場指示書ビルダー',
    subtitle: '現場ルールを7言語で即プリントアウト',
    features: ['安全・緊急・日常ルールを組み合わせ自在', '日・越・尼・英・緬・比・中の7言語', '印刷して現場ですぐに使える'],
    link: '/business/existing-users/connect/templates',
  },
  {
    id: 'checker',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="40" cy="40" r="26" fill="#EEF3FB" stroke="#1a2f5e" strokeWidth="2.5"/>
        <path d="M40 16 A24 24 0 0 1 63 52" stroke="#c9a84c" strokeWidth="4" strokeLinecap="round" fill="none"/>
        <circle cx="40" cy="32" r="5" fill="#c9a84c"/>
        <path d="M37 32 L39 34 L43 30" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="40" cy="44" r="5" fill="#c9a84c"/>
        <path d="M37 44 L39 46 L43 42" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="40" cy="56" r="5" fill="#ddd"/>
        <path d="M38 54 L42 58 M42 54 L38 58" stroke="#aaa" strokeWidth="2" strokeLinecap="round"/>
        <text x="40" y="72" textAnchor="middle" fill="#1a2f5e" fontSize="7" fontWeight="bold" fontFamily="Arial">5問診断</text>
      </svg>
    ),
    badge: '5問で完了',
    title: '特定技能移行チェッカー',
    subtitle: '育成就労から特定技能への移行可否を診断',
    features: ['質問5問に答えるだけで判定', '移行可能な在留資格とルートを提示', '企業のToDoリストと試験情報も同時表示'],
    link: '/business/existing-users/ladder/checker',
  },
  {
    id: 'fields',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        {([
          [12,12,22,22], [36,12,22,22], [60,12,22,22],
          [12,36,22,22], [36,36,22,22], [60,36,22,22],
          [12,60,22,14], [36,60,22,14], [60,60,22,14],
        ] as const).map(([x, y, w, h], i) => (
          <rect key={i} x={x-10} y={y-8} width={w} height={h} rx="4"
            fill={i < 6 ? '#EEF3FB' : i === 6 ? '#c9a84c' : i === 7 ? '#c9a84c' : '#1a2f5e'}
            stroke={i < 6 ? '#1a2f5e' : 'none'}
            strokeWidth="1.5" opacity={i >= 6 ? 0.85 : 1}
          />
        ))}
        <text x="8"  y="20" fontSize="8" textAnchor="middle" fontFamily="Arial">{'\u{1F3E5}'}</text>
        <text x="32" y="20" fontSize="8" textAnchor="middle" fontFamily="Arial">{'\u{1F3D7}\uFE0F'}</text>
        <text x="56" y="20" fontSize="8" textAnchor="middle" fontFamily="Arial">{'\u{1F3ED}'}</text>
        <text x="8"  y="44" fontSize="8" textAnchor="middle" fontFamily="Arial">{'\u{1F33E}'}</text>
        <text x="32" y="44" fontSize="8" textAnchor="middle" fontFamily="Arial">{'\u{1F37D}\uFE0F'}</text>
        <text x="56" y="44" fontSize="8" textAnchor="middle" fontFamily="Arial">{'\u{1F6A2}'}</text>
        <text x="8"  y="68" fontSize="7" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold">新</text>
        <text x="32" y="68" fontSize="7" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold">新</text>
        <text x="56" y="68" fontSize="7" textAnchor="middle" fill="white" fontFamily="Arial" fontWeight="bold">+3</text>
      </svg>
    ),
    badge: '全19分野',
    title: '全19分野 解説',
    subtitle: '育成就労・特定技能が使える分野を網羅解説',
    features: ['各分野の制度・職種・要件を詳細解説', '受入見込数など最新統計データ付き', '2027年開始の新3分野も先行掲載'],
    link: '/business/articles',
  },
  {
    id: 'msim',
    icon: (
      <svg viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="8" y="12" width="64" height="48" rx="6" fill="#EEF3FB" stroke="#1a2f5e" strokeWidth="2.5"/>
        <rect x="8" y="12" width="64" height="12" rx="6" fill="#1a2f5e"/>
        <rect x="8" y="18" width="64" height="6" fill="#1a2f5e"/>
        <text x="40" y="22" textAnchor="middle" fill="white" fontSize="7" fontWeight="bold" fontFamily="Arial">経営SIM</text>
        <rect x="14" y="30" width="22" height="6" rx="3" fill="#c9a84c"/>
        <rect x="14" y="38" width="18" height="6" rx="3" fill="#2563eb" opacity="0.6"/>
        <rect x="14" y="46" width="20" height="6" rx="3" fill="#059669" opacity="0.6"/>
        <circle cx="54" cy="42" r="12" fill="white" stroke="#1a2f5e" strokeWidth="1.5"/>
        <path d="M49 42 L53 46 L59 38" stroke="#c9a84c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="26" cy="66" r="4" fill="#c9a84c"/>
        <circle cx="40" cy="66" r="4" fill="#1a2f5e"/>
        <circle cx="54" cy="66" r="4" fill="#dc2626" opacity="0.7"/>
      </svg>
    ),
    badge: 'ターン制',
    title: '経営シミュレーション',
    subtitle: '外国人雇用のリアルを体験して学ぶ',
    features: ['業種別のリアルなシナリオで経営判断', '法令遵守・コスト・定着率を同時に管理', '学びのポイントで実務知識も習得'],
    link: '/business/management-sim',
  },
];

export default function ToolsSection() {
  const [hovered, setHovered] = useState<string | null>(null);

  return (
    <section style={{
      background: '#f4f7fb',
      padding: '72px 0 80px',
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
            <span style={{ color: '#c9a84c', fontSize: '13px', fontWeight: 700 }}>現場で使えるツール</span>
          </div>
          <h2 style={{
            fontSize: 'clamp(24px, 4vw, 34px)', fontWeight: 800,
            color: '#1a2f5e', margin: '0 0 14px', letterSpacing: '-0.5px',
          }}>
            外国人雇用の実務を、
            <span style={{ color: '#c9a84c' }}>ゼロコスト</span>で効率化
          </h2>
          <p style={{
            fontSize: '15px', color: '#555', maxWidth: '520px',
            margin: '0 auto', lineHeight: 1.8,
          }}>
            コストシミュレーター・適正診断など、実務に直結するツールを<br />
            すべて<strong>無料</strong>で提供しています。
          </p>
        </div>

        {/* Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))',
          gap: '20px',
        }}>
          {tools.map((tool) => {
            const isHovered = hovered === tool.id;
            return (
              <Link
                key={tool.id}
                href={tool.link}
                onMouseEnter={() => setHovered(tool.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: 'block',
                  background: 'white',
                  borderRadius: '16px',
                  padding: '28px 24px 24px',
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
                {/* Corner accent */}
                {isHovered && (
                  <div style={{
                    position: 'absolute', top: 0, right: 0,
                    width: '60px', height: '60px',
                    background: 'linear-gradient(135deg, transparent 50%, rgba(201,168,76,0.12) 50%)',
                    pointerEvents: 'none',
                  }} />
                )}

                {/* Top row: icon + badge */}
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{
                    width: '72px', height: '72px',
                    background: isHovered ? '#fffbee' : '#f4f7fb',
                    borderRadius: '16px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'background 0.2s',
                  }}>
                    <div style={{ width: '52px', height: '52px' }}>
                      {tool.icon}
                    </div>
                  </div>
                  <span style={{
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
                  }}>
                    {tool.badge}
                  </span>
                </div>

                {/* Title */}
                <h3 style={{
                  margin: '0 0 4px',
                  fontSize: '16px', fontWeight: 800,
                  color: '#1a2f5e', lineHeight: 1.4,
                }}>
                  {tool.title}
                </h3>
                <p style={{
                  margin: '0 0 16px',
                  fontSize: '12px', color: '#888',
                  lineHeight: 1.6,
                }}>
                  {tool.subtitle}
                </p>

                {/* Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, #e2e8f0, transparent)',
                  marginBottom: '14px',
                }} />

                {/* Feature list */}
                <ul style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                  {tool.features.map((f, i) => (
                    <li key={i} style={{
                      display: 'flex', alignItems: 'flex-start', gap: '8px',
                      fontSize: '12.5px', color: '#444', lineHeight: 1.6,
                      marginBottom: i < tool.features.length - 1 ? '5px' : 0,
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
                    今すぐ使う
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
              </Link>
            );
          })}
        </div>


      </div>
    </section>
  );
}
