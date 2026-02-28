'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import ArticleHeader from '@/components/articles/ArticleHeader';
import { useInView } from '@/hooks/useInView';

const navy = '#1a2f5e';
const gold = '#c9a84c';
const teal = '#0d9488';
const textMain = '#1e293b';
const textSub = '#64748b';
const bg = '#f8f9fc';
const border = '#e2e8f0';
const green = '#16a34a';

// ─── Data ────────────────────────────────────────────────────────

const routeNodes = [
  { label: '育成就労', sub: '最長3年', color: '#94a3b8', x: 30, icon: '🌱' },
  { label: '特定技能1号', sub: '最長5年', color: gold, x: 190, icon: '⭐' },
  { label: '特定技能2号', sub: '更新制', color: teal, x: 370, icon: '🏆' },
  { label: '永住', sub: '無期限', color: navy, x: 530, icon: '🏠' },
];

const industryRequirements = [
  { industry: '介護', exam: '介護技能評価試験 + 介護日本語', jpLevel: 'N3以上', passRate: '約65%', note: '日本語要件が最も厳しい' },
  { industry: '製造業', exam: '製造分野特定技能2号評価試験', jpLevel: 'N3推奨', passRate: '約55%', note: '2024年から2号対象' },
  { industry: '建設', exam: '建設分野特定技能2号評価試験', jpLevel: 'N3推奨', passRate: '約50%', note: '班長経験が事実上必須' },
  { industry: '外食', exam: '外食業技能測定試験', jpLevel: 'N3必須', passRate: '約60%', note: '接客日本語が重視' },
  { industry: '宿泊', exam: '宿泊業技能測定試験', jpLevel: 'N3必須', passRate: '約70%', note: '比較的合格しやすい' },
];

const actionCards = [
  {
    icon: '📅',
    title: '逆算スケジュールを立てる',
    desc: '2号試験の日程から逆算し、6ヶ月前に試験対策開始、12ヶ月前に日本語強化を始める計画を立てましょう。',
    color: navy,
  },
  {
    icon: '👨‍💼',
    title: 'リーダー職を経験させる',
    desc: '2号試験では「監督的な業務経験」が問われます。早い段階でチームリーダーや教育係の役割を与えましょう。',
    color: gold,
  },
  {
    icon: '📖',
    title: '日本語学習を支援する',
    desc: 'N3以上の取得を目標に、オンライン学習・社内勉強会・JLPT受験費用の補助を検討してください。',
    color: teal,
  },
];

const reformPoints = [
  {
    item: '育成就労の転職',
    before: '原則不可（技能実習）',
    after: '同一分野内で可能（1年経過後）',
    impact: '人材流出リスクが大幅増加',
  },
  {
    item: '特定技能の対象分野',
    before: '14分野',
    after: '16分野（2号も大幅拡大）',
    impact: '転職先の選択肢が増加',
  },
  {
    item: '永住許可の要件',
    before: '10年在留が原則',
    after: '特定技能2号から最短3年で申請可能',
    impact: '長期定着のインセンティブ',
  },
];

const jpLevels = [
  { level: 'N5', height: 40, color: '#e2e8f0', tag: '参考', tagColor: '#94a3b8' },
  { level: 'N4', height: 72, color: '#94a3b8', tag: '育成就労推奨', tagColor: '#d97706' },
  { level: 'N3', height: 108, color: gold, tag: '外食2号に必要', tagColor: '#d97706' },
  { level: 'N2', height: 156, color: teal, tag: '製造・建設2号に実質必要', tagColor: green },
  { level: 'N1', height: 200, color: navy, tag: '技人国で高評価', tagColor: '#1d4ed8' },
];

const prChecklist = [
  '特定技能2号で3年以上の在留実績がある',
  '年収が300万円以上（世帯年収で判断される場合あり）',
  '税金・社会保険料の滞納がない',
  '日本語能力N2以上（永住申請では重要視される）',
  '犯罪歴・在留資格違反がない',
  '身元保証人を確保している',
];

// ─── Component ───────────────────────────────────────────────────

export default function CareerIkuseiTokuteiPage() {
  const routeView = useInView(0.2);
  const countView = useInView(0.3);
  const cardsView = useInView(0.2);
  const jpView = useInView(0.3);
  const checkView = useInView(0.2);

  return (
    <div style={{ backgroundColor: bg, minHeight: '100vh' }}>
      <ArticleHeader
        category="キャリアパス設計"
        title="育成就労 → 特定技能 → 永住：外国人材キャリアルートの全体像と企業の打ち手"
        updatedAt="2026年2月更新"
        readTime="推定読了時間：10分"
        accentChar="道"
        gradientTo="#0d4f3c"
      />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <article>
          {/* Lead */}
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: textMain, marginBottom: '3rem' }}>
            2025年の制度改正により、外国人材のキャリアパスは大きく変わりました。
            育成就労から特定技能、そして永住へ——明確なルートが整備されたことで、
            企業には「この会社で長く働きたい」と思わせるキャリア設計が求められています。
          </p>

          {/* Section 1: Career Route Map SVG */}
          <SectionTitle>キャリアルートマップ</SectionTitle>
          <div
            ref={routeView.ref}
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '32px 16px',
              marginBottom: '3rem',
              overflowX: 'auto',
            }}
          >
            <svg
              viewBox="0 0 680 200"
              style={{ width: '100%', minWidth: '500px', height: 'auto' }}
            >
              {/* Connection lines */}
              {routeNodes.slice(0, -1).map((node, i) => {
                const next = routeNodes[i + 1];
                return (
                  <line
                    key={`line-${i}`}
                    x1={node.x + 70}
                    y1={80}
                    x2={next.x + 10}
                    y2={80}
                    stroke={border}
                    strokeWidth="3"
                    strokeDasharray="8,4"
                    opacity={routeView.inView ? 1 : 0}
                    style={{ transition: `opacity 0.5s ease ${0.2 + i * 0.2}s` }}
                  />
                );
              })}
              {/* Year labels */}
              {[
                { text: '3年', x: 145 },
                { text: '5年', x: 315 },
                { text: '最短3年', x: 475 },
              ].map((yr, i) => (
                <text
                  key={`yr-${i}`}
                  x={yr.x}
                  y={68}
                  textAnchor="middle"
                  fontSize="11"
                  fill={textSub}
                  opacity={routeView.inView ? 1 : 0}
                  style={{ transition: `opacity 0.5s ease ${0.3 + i * 0.2}s` }}
                >
                  {yr.text}
                </text>
              ))}
              {/* Nodes */}
              {routeNodes.map((node, i) => (
                <g
                  key={i}
                  opacity={routeView.inView ? 1 : 0}
                  style={{ transition: `opacity 0.6s ease ${0.1 + i * 0.2}s` }}
                >
                  <rect
                    x={node.x}
                    y={75}
                    width="80"
                    height="80"
                    rx="12"
                    fill={node.color}
                    opacity={0.1}
                  />
                  <rect
                    x={node.x}
                    y={75}
                    width="80"
                    height="80"
                    rx="12"
                    fill="none"
                    stroke={node.color}
                    strokeWidth="2"
                  />
                  <text
                    x={node.x + 40}
                    y={108}
                    textAnchor="middle"
                    fontSize="22"
                  >
                    {node.icon}
                  </text>
                  <text
                    x={node.x + 40}
                    y={136}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill={navy}
                  >
                    {node.label}
                  </text>
                  <text
                    x={node.x + 40}
                    y={150}
                    textAnchor="middle"
                    fontSize="9"
                    fill={textSub}
                  >
                    {node.sub}
                  </text>
                </g>
              ))}
            </svg>
          </div>

          {/* Section 2: Count-up */}
          <SectionTitle>特定技能2号の取得実績</SectionTitle>
          <div
            ref={countView.ref}
            style={{
              backgroundColor: '#fff',
              border: `2px solid ${teal}`,
              borderRadius: '12px',
              padding: '32px 24px',
              marginBottom: '2rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', color: textSub, marginBottom: '8px' }}>
              2024年末時点の特定技能2号在留者数
            </div>
            <CountUp target={1047} inView={countView.inView} />
            <div style={{ fontSize: '13px', color: textSub, marginTop: '16px', lineHeight: 1.7, maxWidth: '480px', margin: '16px auto 0' }}>
              2号取得者はまだ少数ですが、2025年の制度拡大により急増が見込まれます。
              早期に育成パスを整備した企業が人材確保の優位性を得ます。
            </div>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.8, color: textSub, marginBottom: '3rem' }}>
            特定技能2号は建設・造船以外にも拡大され、現在は全16分野で取得可能です。
            ただし分野ごとに試験の難易度や日本語要件が異なるため、業種に応じた戦略が必要です。
          </p>

          {/* Section 3: Industry Requirements Table */}
          <SectionTitle>業種別の2号要件</SectionTitle>
          <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
            <table
              style={{
                width: '100%',
                minWidth: '580px',
                borderCollapse: 'collapse',
                fontSize: '13px',
                backgroundColor: '#fff',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: navy, color: '#fff' }}>
                  {['業種', '試験内容', '日本語', '合格率', '備考'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {industryRequirements.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: navy }}>{row.industry}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px' }}>{row.exam}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600 }}>{row.jpLevel}</td>
                    <td style={{ padding: '12px 14px', color: textSub }}>{row.passRate}</td>
                    <td style={{ padding: '12px 14px', color: textSub, fontSize: '12px' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Action Cards */}
          <SectionTitle>企業がすべき3つのアクション</SectionTitle>
          <div
            ref={cardsView.ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px',
              marginBottom: '3rem',
            }}
          >
            {actionCards.map((card, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#fff',
                  border: `1px solid ${border}`,
                  borderRadius: '12px',
                  padding: '24px 20px',
                  borderTop: `3px solid ${card.color}`,
                  opacity: cardsView.inView ? 1 : 0,
                  transform: cardsView.inView ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease ${i * 0.15}s, transform 0.5s ease ${i * 0.15}s`,
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>{card.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: card.color, marginBottom: '8px' }}>{card.title}</div>
                <div style={{ fontSize: '13px', color: textSub, lineHeight: 1.6 }}>{card.desc}</div>
              </div>
            ))}
          </div>

          {/* Section 5: Reform Comparison */}
          <SectionTitle>2025年10月改正の主要変更点</SectionTitle>
          <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
            <table
              style={{
                width: '100%',
                minWidth: '480px',
                borderCollapse: 'collapse',
                fontSize: '13px',
                backgroundColor: '#fff',
                border: `1px solid ${border}`,
                borderRadius: '8px',
                overflow: 'hidden',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: navy, color: '#fff' }}>
                  {['項目', '改正前', '改正後', '企業への影響'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {reformPoints.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: navy }}>{row.item}</td>
                    <td style={{ padding: '12px 14px', color: textSub }}>{row.before}</td>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: teal }}>{row.after}</td>
                    <td style={{ padding: '12px 14px', color: textSub, fontSize: '12px' }}>{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 6: JP Level Bar Chart */}
          <SectionTitle>日本語レベルとキャリアステージの対応</SectionTitle>
          <div
            ref={jpView.ref}
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '32px 24px',
              marginBottom: '3rem',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {jpLevels.map((lv, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      fontSize: '10px',
                      color: lv.tagColor,
                      fontWeight: 600,
                      textAlign: 'center',
                      maxWidth: '80px',
                      lineHeight: 1.3,
                      minHeight: '26px',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                    }}
                  >
                    {lv.tag}
                  </div>
                  <div
                    style={{
                      width: '48px',
                      backgroundColor: '#f1f5f9',
                      borderRadius: '6px 6px 0 0',
                      display: 'flex',
                      alignItems: 'flex-end',
                      justifyContent: 'center',
                      height: '210px',
                    }}
                  >
                    <div
                      style={{
                        width: '100%',
                        height: jpView.inView ? `${lv.height}px` : '0px',
                        backgroundColor: lv.color,
                        borderRadius: '6px 6px 0 0',
                        transition: `height 0.8s cubic-bezier(0.4,0,0.2,1) ${i * 0.12}s`,
                      }}
                    />
                  </div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: navy }}>{lv.level}</div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: textSub, textAlign: 'center', lineHeight: 1.6 }}>
              N3は多くの分野で2号試験の受験前提となる実質ライン。N2以上があると技人国への変更も視野に入ります。
            </p>
          </div>

          {/* Section 7: PR Checklist */}
          <SectionTitle>永住申請サポートチェックリスト</SectionTitle>
          <div
            ref={checkView.ref}
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '3rem',
            }}
          >
            {prChecklist.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '10px 0',
                  borderBottom: i < prChecklist.length - 1 ? `1px solid ${border}` : 'none',
                  opacity: checkView.inView ? 1 : 0,
                  transition: `opacity 0.4s ease ${i * 0.08}s`,
                }}
              >
                <div
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: `2px solid ${border}`,
                    flexShrink: 0,
                    marginTop: '1px',
                  }}
                />
                <span style={{ fontSize: '13px', color: textMain, lineHeight: 1.6 }}>{item}</span>
              </div>
            ))}
          </div>

          {/* Summary Box */}
          <div
            style={{
              background: `linear-gradient(135deg, ${navy}, #2d5a9e)`,
              color: '#fff',
              borderRadius: '12px',
              padding: '32px 28px',
              marginBottom: '2rem',
            }}
          >
            <h2 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '16px', color: gold }}>
              まとめ
            </h2>
            <ul style={{ fontSize: '14px', lineHeight: 2, paddingLeft: '1.2em', margin: 0 }}>
              <li>育成就労 → 特定技能1号 → 2号 → 永住の一貫したキャリアパスが制度化</li>
              <li>2号取得者は現在1,047人と少数だが、制度拡大で急増が見込まれる</li>
              <li>業種ごとに2号試験の要件が異なるため、個別の戦略が必要</li>
              <li>逆算スケジュール・リーダー経験・日本語支援の3つが企業の打ち手</li>
              <li>永住許可は特定技能2号から最短3年で申請可能</li>
            </ul>
          </div>

          {/* Note */}
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '3rem' }}>
            ※ 制度情報は2025年10月施行の改正入管法に基づいています。
            試験日程・合格率は分野・時期により変動します。最新情報は出入国在留管理庁の公式サイトをご確認ください。
          </p>

          {/* Footer Nav */}
          <FooterNav />
        </article>
      </main>
    </div>
  );
}

// ─── Sub Components ──────────────────────────────────────────────

function CountUp({ target, inView }: { target: number; inView: boolean }) {
  const [count, setCount] = useState(0);

  const animate = useCallback(() => {
    if (!inView) return;
    const duration = 1800;
    const step = Math.ceil(target / (duration / 16));
    let current = 0;
    const timer = setInterval(() => {
      current = Math.min(current + step, target);
      setCount(current);
      if (current >= target) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  useEffect(() => {
    return animate();
  }, [animate]);

  return (
    <div style={{ fontSize: 'clamp(2.5rem, 8vw, 3.5rem)', fontWeight: 700, color: teal, lineHeight: 1 }}>
      {count.toLocaleString()}
      <span style={{ fontSize: '0.4em', marginLeft: '4px' }}>人</span>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2
      style={{
        fontSize: '18px',
        fontWeight: 700,
        color: navy,
        marginBottom: '16px',
        paddingBottom: '10px',
        borderBottom: `2px solid ${gold}`,
      }}
    >
      {children}
    </h2>
  );
}

function FooterNav() {
  return (
    <div style={{ paddingTop: '24px', borderTop: `1px solid ${border}`, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
      <Link href="/business/existing-users" style={{ fontSize: '14px', fontWeight: 500, color: navy, textDecoration: 'none' }}>
        &larr; 外国人スタッフを活かす
      </Link>
      <Link href="/business" style={{ fontSize: '14px', fontWeight: 500, color: navy, textDecoration: 'none' }}>
        企業向けトップ &rarr;
      </Link>
    </div>
  );
}
