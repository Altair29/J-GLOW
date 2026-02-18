/**
 * Feature Label Mapping Layer
 *
 * 内部ID → 表示用ラベルのデフォルト値。
 * 実際の値は content_blocks (page='feature_labels') から取得され、
 * 管理者パネルから動的に変更可能。
 * このファイルはDB未取得時のフォールバックとして機能する。
 */

export type FeatureLabelKey =
  | 'simulation'
  | 'assessment'
  | 'roadmap'
  | 'whitepaper'
  | 'news'
  | 'statistics'
  | 'subsidy';

export const defaultFeatureLabels: Record<FeatureLabelKey, string> = {
  simulation: '初めての外国人雇用',
  assessment: '外国人雇用の無料適正診断',
  roadmap:    '育成就労制度への移行について',
  whitepaper: 'ホワイトペーパー',
  news:       '業界最新動向',
  statistics: '外国人関連統計',
  subsidy:    '助成金活用',
};
