const stages = [
  {
    id: 'stage1',
    label: 'Stage 1',
    name: '受入れ初期',
    period: '入国〜1年目',
    roleTitle: 'OJT設計・日本語基礎',
    roleDesc:
      '現場に慣れ、基礎スキルを身につける期間。受入れ環境の整備が定着率に直結する。',
    color: '#4a90c4',
  },
  {
    id: 'stage2',
    label: 'Stage 2',
    name: 'スキル習得期',
    period: '2〜3年目',
    roleTitle: '試験対策・移行準備',
    roleDesc:
      '特定技能への移行を見据え、技能試験と日本語試験の対策を並行して進める。',
    color: '#2d6ea8',
  },
  {
    id: 'stage3',
    label: 'Stage 3',
    name: '特定技能1号',
    period: '移行後〜最長5年',
    roleTitle: '戦力化・2号移行',
    roleDesc:
      '自立的に業務を遂行できる段階。特定技能2号や後輩指導へのステップを設計する。',
    color: '#1a4f8c',
  },
  {
    id: 'stage4',
    label: 'Stage 4',
    name: '特定技能2号〜',
    period: '長期定着',
    roleTitle: '長期雇用・戦力化',
    roleDesc:
      '更新回数の上限なし。家族帯同も可能になり、企業の中核人材として長期活躍が期待できる。',
    color: '#c9a84c',
  },
];

export function LadderStageOverview() {
  return (
    <section
      className="py-16 md:py-20"
      style={{
        backgroundColor: '#ffffff',
        borderTop: '1px solid #e2e8f0',
        borderBottom: '1px solid #e2e8f0',
      }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <span
            className="inline-block text-xs font-semibold tracking-widest uppercase mb-4"
            style={{ color: '#c9a84c' }}
          >
            Stage Overview
          </span>
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-gray-900">
            成長ステージと支援の全体像
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
              {/* カラーバー */}
              <div
                className="h-1"
                style={{ backgroundColor: stage.color }}
              />
              <div className="p-6">
                <span
                  className="text-[11px] font-bold tracking-widest uppercase"
                  style={{ color: stage.color }}
                >
                  {stage.label}
                </span>
                <h3 className="text-lg font-bold text-gray-900 mt-1 mb-0.5">
                  {stage.name}
                </h3>
                <p className="text-xs text-gray-400 mb-4">{stage.period}</p>

                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: '#1a2f5e' }}
                >
                  {stage.roleTitle}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {stage.roleDesc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
