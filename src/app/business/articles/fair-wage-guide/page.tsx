'use client';

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
const danger = '#dc2626';
const green = '#16a34a';

// ─── Data ────────────────────────────────────────────────────────

const wageData = [
  { label: '日本人平均', sub: '比較基準', amount: 318300, pct: 100, color: '#94a3b8' },
  { label: '専門・技術的分野', sub: '技人国等', amount: 302200, pct: 95, color: navy },
  { label: '身分に基づく', sub: '永住・定住等', amount: 257000, pct: 81, color: '#2d6a4f' },
  { label: '外国人全体平均', sub: '', amount: 232600, pct: 73, color: gold },
  { label: '技能実習', sub: '最低水準', amount: 161700, pct: 51, color: danger },
];

const legalTimeline = [
  {
    visa: '育成就労',
    obligation: '日本人と同等以上の報酬',
    point: '監理団体の監査対象。最低賃金割れは即時取消し対象。',
    color: navy,
  },
  {
    visa: '特定技能1号',
    obligation: '日本人と同等以上の報酬',
    point: '支援計画に報酬の明記が必要。年1回の届出で確認。',
    color: gold,
  },
  {
    visa: '特定技能2号',
    obligation: '日本人と同等以上の報酬',
    point: '昇給実績がないと更新不許可のリスク。',
    color: teal,
  },
  {
    visa: '技術・人文知識・国際業務',
    obligation: '日本人と同等以上の報酬',
    point: '新卒の初任給以上が目安。ポジションに応じた待遇が求められる。',
    color: '#7c3aed',
  },
];

const benefitsComparison = [
  { item: '賞与（ボーナス）', legal: '法的義務なし', recommended: '寸志でも支給', impact: '離職防止効果：大' },
  { item: '住居手当', legal: '義務なし（技能実習は要提供）', recommended: '一部負担 or 社宅提供', impact: '手取り額への直接的影響' },
  { item: '有給休暇', legal: '労働基準法に準拠', recommended: '帰国時の連続取得を許可', impact: 'モチベーション維持' },
  { item: '健康診断', legal: '年1回義務', recommended: '母語での問診票を用意', impact: '安心感の醸成' },
  { item: '慶弔見舞金', legal: '義務なし', recommended: '日本人と同条件を適用', impact: '「平等に扱われている」実感' },
];

const raiseSteps = [
  { step: 1, title: '現状の賃金テーブルを整理', desc: '在留資格・職種・勤続年数ごとに現在の賃金を一覧化。日本人との差があるか確認。', color: navy },
  { step: 2, title: '同等性の基準を設定', desc: '「同じ職務・同じ経験年数の日本人」と比較する基準を明文化。', color: gold },
  { step: 3, title: '昇給ルールを策定', desc: '年1回の定期昇給、スキル評価による昇給、資格取得による昇給の3パターンを整備。', color: teal },
  { step: 4, title: '本人に母語で説明', desc: '賃金テーブルと昇給ルールを母語で説明。「なぜこの金額か」を理解してもらう。', color: '#7c3aed' },
  { step: 5, title: '年1回の見直しサイクル', desc: '最低賃金改定・業界水準・本人のスキル成長を踏まえて毎年見直す。', color: green },
];

const checklist = [
  '同じ職務の日本人と外国人の賃金に差がないか確認した',
  '最低賃金（地域別・特定最低賃金）を上回っていることを確認した',
  '賃金テーブルを文書化し、本人に母語で説明した',
  '昇給ルール（定期昇給・スキル昇給・資格昇給）を整備した',
  '賞与の支給基準を外国人にも適用している',
  '住居費の控除が適正額（実費の範囲内）であることを確認した',
  '有給休暇の取得を妨げていないか確認した',
  '社会保険・雇用保険に適正に加入している',
  '帰国時の退職金・一時金の規定を確認した',
  '年1回の賃金見直しサイクルを設けている',
];

// ─── Component ───────────────────────────────────────────────────

export default function FairWageGuidePage() {
  const wageView = useInView(0.2);
  const personView = useInView(0.3);
  const stepsView = useInView(0.2);
  const checkView = useInView(0.2);

  return (
    <div style={{ backgroundColor: bg, minHeight: '100vh' }}>
      <ArticleHeader
        category="待遇設計"
        title="外国人スタッフの「適正賃金」完全ガイド — 法的義務から昇給設計まで"
        updatedAt="2026年2月更新"
        readTime="推定読了時間：10分"
        accentChar="賃"
        gradientTo="#2d6a4f"
      />

      <main style={{ maxWidth: '720px', margin: '0 auto', padding: '3rem 1.5rem' }}>
        <article>
          {/* Lead */}
          <p style={{ fontSize: '15px', lineHeight: 1.9, color: textMain, marginBottom: '3rem' }}>
            「同じ仕事をしているのに、なぜ外国人の給料は低いのか？」——
            この疑問は、外国人スタッフ本人だけでなく、制度を監査する行政機関からも問われるものです。
            本記事では、在留資格別の法的義務を整理し、適正な賃金設計と昇給の仕組みを解説します。
          </p>

          {/* Section 1: Wage Bar Chart */}
          <SectionTitle>在留資格別の平均賃金</SectionTitle>
          <div
            ref={wageView.ref}
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '28px 24px',
              marginBottom: '2rem',
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {wageData.map((w, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                    <div>
                      <span style={{ fontSize: '14px', fontWeight: 600, color: textMain }}>{w.label}</span>
                      {w.sub && <span style={{ fontSize: '11px', color: textSub, marginLeft: '8px' }}>{w.sub}</span>}
                    </div>
                    <span style={{ fontSize: '15px', fontWeight: 700, color: w.color }}>
                      {w.amount.toLocaleString()}円
                    </span>
                  </div>
                  <div style={{ height: '12px', backgroundColor: '#f1f5f9', borderRadius: '6px', overflow: 'hidden' }}>
                    <div
                      style={{
                        height: '100%',
                        width: wageView.inView ? `${w.pct}%` : '0%',
                        backgroundColor: w.color,
                        borderRadius: '6px',
                        transition: `width 1.2s cubic-bezier(0.4,0,0.2,1) ${i * 0.15}s`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p style={{ fontSize: '11px', color: '#94a3b8', marginTop: '16px' }}>
              出典：厚生労働省「外国人雇用状況の届出状況」（2023年10月末時点）
            </p>
          </div>

          {/* Section 2: Gap Callout */}
          <div
            style={{
              backgroundColor: '#fff',
              border: `2px solid ${gold}`,
              borderRadius: '12px',
              padding: '28px 24px',
              marginBottom: '3rem',
              textAlign: 'center',
            }}
          >
            <div style={{ fontSize: '12px', color: textSub, marginBottom: '8px' }}>日本人平均との差額</div>
            <div style={{ fontSize: 'clamp(2rem, 5vw, 2.5rem)', fontWeight: 700, color: danger, marginBottom: '4px' }}>
              85,700<span style={{ fontSize: '0.5em' }}>円</span>
            </div>
            <div style={{ fontSize: '13px', color: textSub, marginBottom: '16px' }}>
              外国人全体平均 vs 日本人平均（月額）
            </div>
            <div
              style={{
                display: 'inline-block',
                backgroundColor: `${danger}10`,
                color: danger,
                fontSize: '13px',
                fontWeight: 600,
                padding: '6px 16px',
                borderRadius: '999px',
              }}
            >
              同一条件で比較しても約7%の純粋格差
            </div>
          </div>

          {/* Section 3: Person Comparison */}
          <SectionTitle>7%の格差を可視化する</SectionTitle>
          <div
            ref={personView.ref}
            style={{
              backgroundColor: '#fff',
              border: `1px solid ${border}`,
              borderRadius: '12px',
              padding: '32px 24px',
              marginBottom: '3rem',
              display: 'flex',
              justifyContent: 'center',
              gap: '48px',
              flexWrap: 'wrap',
            }}
          >
            {[
              { label: '日本人', height: 160, color: '#94a3b8', amount: '318,300円' },
              { label: '外国人', height: 149, color: gold, amount: '296,000円' },
            ].map((p, i) => (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '60px',
                    backgroundColor: '#f1f5f9',
                    borderRadius: '6px 6px 0 0',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center',
                    height: '200px',
                  }}
                >
                  <div
                    style={{
                      width: '100%',
                      height: personView.inView ? `${p.height}px` : '0px',
                      backgroundColor: p.color,
                      borderRadius: '6px 6px 0 0',
                      transition: 'height 1s cubic-bezier(0.4,0,0.2,1) 0.3s',
                    }}
                  />
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: textMain }}>{p.label}</div>
                  <div style={{ fontSize: '12px', color: textSub }}>{p.amount}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 4: Legal Timeline */}
          <SectionTitle>在留資格別の法的義務</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '3rem' }}>
            {legalTimeline.map((t, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '16px',
                  position: 'relative',
                  paddingBottom: i < legalTimeline.length - 1 ? '24px' : '0',
                }}
              >
                {/* Timeline line */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '20px', flexShrink: 0 }}>
                  <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: t.color, border: '3px solid #fff', boxShadow: `0 0 0 2px ${t.color}`, zIndex: 1 }} />
                  {i < legalTimeline.length - 1 && (
                    <div style={{ width: '2px', flex: 1, backgroundColor: border }} />
                  )}
                </div>
                {/* Content */}
                <div
                  style={{
                    backgroundColor: '#fff',
                    border: `1px solid ${border}`,
                    borderRadius: '10px',
                    padding: '16px 20px',
                    flex: 1,
                    borderLeft: `3px solid ${t.color}`,
                  }}
                >
                  <div style={{ fontSize: '14px', fontWeight: 700, color: t.color, marginBottom: '4px' }}>{t.visa}</div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: textMain, marginBottom: '6px' }}>{t.obligation}</div>
                  <div style={{ fontSize: '12px', color: textSub, lineHeight: 1.6 }}>{t.point}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 5: Benefits Table */}
          <SectionTitle>給与以外の待遇チェックポイント</SectionTitle>
          <div style={{ overflowX: 'auto', marginBottom: '3rem' }}>
            <table
              style={{
                width: '100%',
                minWidth: '520px',
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
                  {['項目', '法的義務', '推奨対応', '影響度'].map((h) => (
                    <th key={h} style={{ padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '12px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {benefitsComparison.map((row, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${border}` }}>
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: navy }}>{row.item}</td>
                    <td style={{ padding: '12px 14px', color: textSub, fontSize: '12px' }}>{row.legal}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px' }}>{row.recommended}</td>
                    <td style={{ padding: '12px 14px', fontSize: '12px', color: textSub }}>{row.impact}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Section 6: Raise Steps */}
          <SectionTitle>昇給設計の5ステップ</SectionTitle>
          <div
            ref={stepsView.ref}
            style={{ display: 'flex', flexDirection: 'column', gap: '0px', marginBottom: '3rem' }}
          >
            {raiseSteps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '16px',
                  opacity: stepsView.inView ? 1 : 0,
                  transform: stepsView.inView ? 'translateY(0)' : 'translateY(10px)',
                  transition: `opacity 0.5s ease ${i * 0.12}s, transform 0.5s ease ${i * 0.12}s`,
                  paddingBottom: i < raiseSteps.length - 1 ? '20px' : '0',
                }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    backgroundColor: s.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700,
                    fontSize: '14px',
                    flexShrink: 0,
                  }}
                >
                  {s.step}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: textMain, marginBottom: '4px' }}>{s.title}</div>
                  <div style={{ fontSize: '13px', color: textSub, lineHeight: 1.6 }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Section 7: Checklist */}
          <SectionTitle>確認チェックリスト</SectionTitle>
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
            {checklist.map((item, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'flex-start',
                  padding: '10px 0',
                  borderBottom: i < checklist.length - 1 ? `1px solid ${border}` : 'none',
                  opacity: checkView.inView ? 1 : 0,
                  transition: `opacity 0.4s ease ${i * 0.06}s`,
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
              <li>すべての就労資格で「日本人と同等以上の報酬」が法的義務</li>
              <li>同一条件で比較しても約7%（85,700円/月）の格差が存在</li>
              <li>賃金だけでなく、賞与・住居・有給など総合的な待遇設計が重要</li>
              <li>昇給ルールを明文化し、母語で説明することが定着の鍵</li>
              <li>年1回の見直しサイクルで最低賃金改定・市場変化に対応</li>
            </ul>
          </div>

          {/* Note */}
          <p style={{ fontSize: '11px', color: '#94a3b8', lineHeight: 1.7, marginBottom: '3rem' }}>
            ※ 賃金データは厚生労働省「外国人雇用状況の届出状況」（2023年10月末時点）を基に構成。
            法的義務の解釈は一般的な見解であり、個別のケースについては社会保険労務士等にご相談ください。
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
