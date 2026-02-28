const stages = [
  {
    id: 'stage1',
    label: 'Stage 1',
    name: 'なぜ辞めるのかを知る',
    period: '離職構造の理解',
    roleTitle: '在留資格別の離職要因分析',
    roleDesc:
      '在留資格ごとに異なる離職理由を構造的に理解し、自社の対策優先順位を明確にする。',
    color: '#4a90c4',
  },
  {
    id: 'stage2',
    label: 'Stage 2',
    name: '給与・ポジションで向き合う',
    period: '待遇と評価の整備',
    roleTitle: '同等待遇の義務・昇給設計・等級制度',
    roleDesc:
      '法的義務を満たしつつ、在留資格変更タイミングに合わせた昇給・昇格設計で定着率を上げる。',
    color: '#2d6ea8',
  },
  {
    id: 'stage3',
    label: 'Stage 3',
    name: '在留資格別キャリア支援',
    period: '長期雇用への伴走',
    roleTitle: '育成就労→特定技能→永住 / 技人国 / 留学生',
    roleDesc:
      '在留資格ごとのキャリアラインを企業が描き、日本語支援・試験サポート・永住申請まで伴走する。',
    color: '#1a4f8c',
  },
  {
    id: 'stage4',
    label: 'Stage 4',
    name: '制度対応・コンプライアンス',
    period: 'リスク管理の仕組み化',
    roleTitle: '更新管理・届出・違反防止',
    roleDesc:
      '在留資格の期限管理、届出義務、よくある違反パターンの理解と防止体制を構築する。',
    color: '#c9a84c',
  },
];

export function ContinueStageOverview() {
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
            定着・制度対応の全体像
          </h2>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {stages.map((stage) => (
            <div
              key={stage.id}
              className="bg-white rounded-2xl border border-gray-200 overflow-hidden"
            >
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
