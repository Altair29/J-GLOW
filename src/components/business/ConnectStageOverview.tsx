const stages = [
  {
    id: 'stage1',
    label: 'Stage 1',
    name: '伝わらない原因を知る',
    period: '理解のギャップを可視化',
    roleTitle: '「はい」の落とし穴・やさしい日本語',
    roleDesc:
      '「はい」が理解のサインではないことを知り、伝わる話し方の基本を身につける。',
    color: '#4a90c4',
  },
  {
    id: 'stage2',
    label: 'Stage 2',
    name: '口頭に頼らない仕組みをつくる',
    period: '情報を形に残す',
    roleTitle: 'マニュアル設計・ビジュアル指示書',
    roleDesc:
      '重要な情報を口頭ではなくマニュアルに書き、読まなくてもわかるビジュアル指示書を作る。',
    color: '#2d6ea8',
  },
  {
    id: 'stage3',
    label: 'Stage 3',
    name: 'すれ違いを構造的に減らす',
    period: '仕組みで解決する',
    roleTitle: '文化ギャップ対処・メンター・日本語支援',
    roleDesc:
      'よくある誤解パターンを共有し、メンター制度と日本語学習支援で構造的に解決する。',
    color: '#1a4f8c',
  },
  {
    id: 'stage4',
    label: 'Stage 4',
    name: '声を上げられる職場にする',
    period: '心理的安全性の確立',
    roleTitle: '「わかりません」が言える環境',
    roleDesc:
      '外国人スタッフが安心して質問・報告できる職場文化をつくり、定着率向上につなげる。',
    color: '#c9a84c',
  },
];

export function ConnectStageOverview() {
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
            コミュニケーション改善の全体像
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
