'use client';

import Link from 'next/link';
import ArticleHeader from '@/components/articles/ArticleHeader';
import StatCard from '@/components/articles/StatCard';
import { useInView } from '@/hooks/useInView';

const navy = '#1a2f5e';
const gold = '#c9a84c';
const teal = '#0d9488';
const textMain = '#1e293b';
const textSub = '#64748b';
const bg = '#f8f9fc';
const border = '#e2e8f0';
const danger = '#dc2626';

// ─── Data ────────────────────────────────────────────────────────

const stats = [
  {
    number: '16.1',
    unit: '%',
    label: '特定技能1号の累計離職率',
    source: '出入国在留管理庁（2023）\n集計期間：2019年4月〜2022年11月末',
  },
  {
    number: '53',
    unit: '%',
    label: '離職せずともモチベーションが低下した割合',
    source: 'ヒューマングローバルホールディングス等\n共同調査（2021年）',
  },
  {
    number: '44',
    unit: '%',
    label: '1年未満で離職意志を持った割合',
    source: 'ウィルテック等3社共同調査（2021年）\n「離職した」＋「したかったができなかった」計',
  },
];

const donutSegments = [
  { pct: 31.4, color: navy, label: '帰国' },
  { pct: 30.3, color: gold, label: '国内転職' },
  { pct: 21.5, color: teal, label: '他資格変更' },
  { pct: 16.8, color: '#94a3b8', label: 'その他' },
];

const barData = [
  { label: '上司のマネジメント・指導への不満', pct: 68, color: navy },
  { label: '業務内容のミスマッチ', pct: 54, color: navy },
  { label: '給料が上がらない', pct: 52, color: gold },
  { label: '職場の人間関係', pct: 45, color: teal },
  { label: '外国人への差別・偏見', pct: 38, color: danger },
  { label: 'キャリアパスが見えない', pct: 35, color: '#64748b' },
];

const visaComparison = [
  {
    name: '育成就労',
    transfer: '同一業種内で可能\n（改正後）',
    period: '最長3年',
    risk: '高',
    riskColor: danger,
    note: '転職解禁で流出増加リスク',
  },
  {
    name: '特定技能1号',
    transfer: '同一分野内で自由',
    period: '最長5年（通算）',
    risk: '最高',
    riskColor: danger,
    note: '最も流動性が高い',
  },
  {
    name: '技術・人文知識・国際業務',
    transfer: '制限なし',
    period: '更新制（無期限）',
    risk: '中',
    riskColor: '#d97706',
    note: '転職先が見つかりやすい',
  },
  {
    name: '留学生（資格外活動）',
    transfer: '就労ではないため—',
    period: '在学中',
    risk: '低',
    riskColor: '#16a34a',
    note: '卒業後の採用が焦点',
  },
];

const earlySigns = [
  { icon: '😶', title: '発言が減る', desc: 'ミーティングや朝礼で急に無口になる。質問をしなくなる。' },
  { icon: '📱', title: 'スマホを頻繁に見る', desc: '勤務中にスマホチェックが増える。転職サイトを閲覧している可能性。' },
  { icon: '🕐', title: '遅刻・早退が増える', desc: '以前は時間に正確だったのに、遅刻や早退が目立つようになる。' },
  { icon: '👥', title: '同国人との会話が増える', desc: '日本語での会話を避け、母国語グループ内に閉じこもる傾向。' },
  { icon: '📉', title: '作業品質の低下', desc: 'ミスが増え、以前はできていた作業の精度が落ちる。' },
  { icon: '🚪', title: '有給取得パターンの変化', desc: '面接のための半休や、まとまった有給取得の申請が出る。' },
];

// ─── Component ───────────────────────────────────────────────────

export default function WhyWorkersLeavePage() {
  const statsView = useInView(0.2);
  const donutView = useInView(0.3);
  const barView = useInView(0.2);
  const signsView = useInView(0.2);

  const circumference = 2 * Math.PI * 70;

  let cumulativePct = 0;
  const donutArcs = donutSegments.map((seg, i) => {
    const offset = circumference * (1 - seg.pct / 100);
    const rotation = -90 + cumulativePct * 3.6;
    cumulativePct += seg.pct;
    return { ...seg, offset, rotation, delay: 0.3 + i * 0.3 };
  });

  return (
    <div style={{ backgroundColor: bg, minHeight: '100vh' }}>
      <ArticleHeader
        category="定着の基礎を知る"
        title="外国人スタッフはなぜ辞めるのか？ — データで見る離職の実態と6つの予兆"
        updatedAt="2026年2月更新"
        readTime="推定読了時間：8分"
        accentChar="離"
        gradientTo="#1e3a6e"
      />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <article>
          {/* Lead */}
          <p
            style={{
              fontSize: '15px',
              lineHeight: 1.9,
              color: textMain,
              marginBottom: '3rem',
            }}
          >
            「突然辞めた」「理由がわからない」——外国人スタッフの離職に直面した企業担当者から、こうした声が多く聞かれます。
            しかしデータを見ると、離職には明確なパターンと予兆があります。
            本記事では、公的統計と業界調査から離職の実態を解き明かし、早期に気づくための6つのサインを紹介します。
          </p>

          {/* Section 1: Stat Cards */}
          <SectionTitle>離職率の現実 — 3つの数字</SectionTitle>
          <div ref={statsView.ref} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '3rem' }}>
            {stats.map((s, i) => (
              <StatCard
                key={i}
                number={s.number}
                unit={s.unit}
                label={s.label}
                source={s.source}
                delay={0.1 + i * 0.15}
                inView={statsView.inView}
                color={i === 0 ? navy : i === 1 ? gold : teal}
              />
            ))}
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.8, color: textSub, marginBottom: '3rem' }}>
            特定技能1号の累計離職率16.1%は、日本人の平均離職率（約15%）とほぼ同水準です。
            しかし注目すべきは「辞めていないが意欲が低下している」層が過半数を超えている点です。
            離職率だけでは見えない「静かな離脱」が現場で進行しています。
          </p>

          {/* Section 2: Donut Chart */}
          <SectionTitle>離職後の行き先</SectionTitle>
          <div
            ref={donutView.ref}
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '32px 24px',
              marginBottom: '3rem',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '24px',
            }}
          >
            <style>{`
              @keyframes donut-draw {
                from { stroke-dashoffset: ${circumference}; }
              }
            `}</style>
            <svg width="200" height="200" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="70" fill="none" stroke="#f1f5f9" strokeWidth="24" />
              {donutArcs.map((arc, i) => (
                <circle
                  key={i}
                  cx="100"
                  cy="100"
                  r="70"
                  fill="none"
                  stroke={arc.color}
                  strokeWidth="24"
                  strokeDasharray={circumference}
                  strokeDashoffset={donutView.inView ? arc.offset : circumference}
                  strokeLinecap="butt"
                  transform={`rotate(${arc.rotation} 100 100)`}
                  style={{
                    transition: `stroke-dashoffset 1s ease ${arc.delay}s`,
                  }}
                />
              ))}
            </svg>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center' }}>
              {donutSegments.map((seg, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: textMain }}>
                  <span style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: seg.color, flexShrink: 0 }} />
                  {seg.label}
                  <span style={{ fontWeight: 700 }}>{seg.pct}%</span>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: textSub, textAlign: 'center', lineHeight: 1.7, maxWidth: '500px' }}>
              離職者の約3割が帰国し、約3割が国内で転職しています。
              つまり離職者の半数以上は日本に留まっており、「日本が嫌になった」のではなく「その職場が合わなかった」ケースが多いことがわかります。
            </p>
          </div>

          {/* Section 3: Visa Comparison Table */}
          <SectionTitle>在留資格別の離職リスク比較</SectionTitle>
          <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
            <table
              style={{
                width: '100%',
                minWidth: '560px',
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
                  {['在留資格', '転職の可否', '在留期間', '離職リスク', '備考'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visaComparison.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: navy }}>{row.name}</td>
                    <td style={{ padding: '12px 14px', whiteSpace: 'pre-line', lineHeight: 1.5 }}>{row.transfer}</td>
                    <td style={{ padding: '12px 14px' }}>{row.period}</td>
                    <td style={{ padding: '12px 14px' }}>
                      <span style={{ display: 'inline-block', padding: '2px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700, backgroundColor: `${row.riskColor}15`, color: row.riskColor }}>
                        {row.risk}
                      </span>
                    </td>
                    <td style={{ padding: '12px 14px', color: textSub, fontSize: '12px' }}>{row.note}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 4: Bar Chart */}
          <SectionTitle>モチベーション低下の要因</SectionTitle>
          <div
            ref={barView.ref}
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '28px 24px',
              marginBottom: '3rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {barData.map((bar, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <span style={{ fontSize: '13px', color: textMain, fontWeight: 500 }}>{bar.label}</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: bar.color }}>{bar.pct}%</span>
                  </div>
                  <div style={{ height: '10px', backgroundColor: '#f1f5f9', borderRadius: '5px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: barView.inView ? `${bar.pct}%` : '0%',
                        backgroundColor: bar.color,
                        borderRadius: '5px',
                        transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.1}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '12px', color: '#94a3b8', marginTop: '16px' }}>
              出典：複数調査を統合（ウィルテック・ヒューマングローバル等、2021-2023年）
            </p>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.8, color: textMain, marginBottom: '3rem' }}>
            最大の要因は「上司のマネジメント・指導への不満」で68%。
            給与よりも、日常のコミュニケーションや指導の質が離職意向を大きく左右します。
            特に「わからないと言えない空気」「質問すると怒られる」という声が目立ちます。
          </p>

          {/* Section 5: Early Signs */}
          <SectionTitle>早期離職の6つのサイン</SectionTitle>
          <div
            ref={signsView.ref}
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '14px',
              marginBottom: '3rem',
            }}
          >
            {earlySigns.map((sign, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: '#fff',
                  border: `1px solid ${border}`,
                  borderRadius: '10px',
                  padding: '20px',
                  opacity: signsView.inView ? 1 : 0,
                  transform: signsView.inView ? 'translateY(0)' : 'translateY(12px)',
                  transition: `opacity 0.5s ease ${i * 0.08}s, transform 0.5s ease ${i * 0.08}s`,
                }}
              >
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{sign.icon}</div>
                <div style={{ fontSize: '14px', fontWeight: 700, color: navy, marginBottom: '6px' }}>{sign.title}</div>
                <div style={{ fontSize: '13px', color: textSub, lineHeight: 1.6 }}>{sign.desc}</div>
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
              <li>特定技能1号の離職率は16.1%だが、モチベーション低下層を含めると過半数が「離脱予備軍」</li>
              <li>離職者の過半数は日本に留まっており、職場環境が原因</li>
              <li>最大の要因は上司のマネジメント（68%）で、給与ではない</li>
              <li>早期サインに気づく仕組み（1on1・定期面談）を整えることが最優先</li>
            </ul>
          </div>

          {/* Note */}
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '3rem' }}>
            ※ 本記事のデータは出入国在留管理庁（2023年公表）、ヒューマングローバルホールディングス等共同調査（2021年）、
            ウィルテック等3社共同調査（2021年）を基に構成しています。調査対象・時期により数値に幅があります。
          </p>

          {/* Footer Nav */}
          <FooterNav />
        </article>
      </main>
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
