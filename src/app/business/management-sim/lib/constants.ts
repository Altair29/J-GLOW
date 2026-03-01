import type { MsimIndustry, MsimVisaType, MsimCategory } from './types';

// ==========================================
// 業種
// ==========================================

export const INDUSTRIES: { value: MsimIndustry; label: string; emoji: string }[] = [
  { value: 'kensetsu', label: '建設', emoji: '🏗️' },
  { value: 'seizou', label: '製造', emoji: '🏭' },
  { value: 'kaigo', label: '介護', emoji: '🏥' },
  { value: 'gaishoku', label: '外食', emoji: '🍽️' },
  { value: 'nogyo', label: '農業', emoji: '🌾' },
  { value: 'shukuhaku', label: '宿泊', emoji: '🏨' },
  { value: 'gyogyo', label: '漁業', emoji: '🐟' },
  { value: 'biru', label: 'ビルクリーニング', emoji: '🧹' },
  { value: 'other', label: 'その他', emoji: '🏢' },
];

export const INDUSTRY_LABELS: Record<MsimIndustry, string> = Object.fromEntries(
  INDUSTRIES.map((i) => [i.value, i.label])
) as Record<MsimIndustry, string>;

// ==========================================
// ビザ種別
// ==========================================

export const VISA_TYPES: { value: MsimVisaType; label: string; description: string }[] = [
  {
    value: 'ikusei',
    label: '育成就労',
    description: '2027年施行の新制度。最長3年、転籍可能。',
  },
  {
    value: 'tokutei1',
    label: '特定技能1号',
    description: '即戦力人材。最長5年、家族帯同不可。',
  },
  {
    value: 'tokutei2',
    label: '特定技能2号',
    description: '熟練人材。在留期間更新可能、家族帯同OK。',
  },
];

export const VISA_LABELS: Record<MsimVisaType, string> = {
  ikusei: '育成就労',
  tokutei1: '特定技能1号',
  tokutei2: '特定技能2号',
};

// ==========================================
// 会社規模
// ==========================================

export const COMPANY_SIZES = [10, 20, 30, 50, 100] as const;

// ==========================================
// プレイ期間
// ==========================================

export const PLAY_MONTHS = [12, 24] as const;

// ==========================================
// 採用人数
// ==========================================

export const HIRE_COUNTS = [1, 2, 3, 4, 5] as const;

// ==========================================
// シナリオカテゴリ
// ==========================================

export const CATEGORY_CONFIG: Record<
  MsimCategory,
  { label: string; color: string; bgColor: string; emoji: string }
> = {
  compliance: { label: 'コンプライアンス', color: '#dc2626', bgColor: '#fef2f2', emoji: '⚖️' },
  cost: { label: 'コスト管理', color: '#d97706', bgColor: '#fffbeb', emoji: '💰' },
  field_issue: { label: '現場課題', color: '#2563eb', bgColor: '#eff6ff', emoji: '🔧' },
  life_support: { label: '生活支援', color: '#059669', bgColor: '#ecfdf5', emoji: '🏠' },
  relations: { label: '人間関係', color: '#7c3aed', bgColor: '#f5f3ff', emoji: '👥' },
  neighbor: { label: '地域連携', color: '#0891b2', bgColor: '#ecfeff', emoji: '🏘️' },
  positive: { label: 'ポジティブ', color: '#16a34a', bgColor: '#f0fdf4', emoji: '✨' },
  government: { label: '行政対応', color: '#4338ca', bgColor: '#eef2ff', emoji: '🏛️' },
  retention: { label: '定着・離職', color: '#be185d', bgColor: '#fdf2f8', emoji: '🔄' },
};

// ==========================================
// ゲージ表示設定
// ==========================================

export const GAUGE_CONFIG: Record<
  string,
  { label: string; color: string; icon: string; unit: string; gameOverLabel: string }
> = {
  funds: {
    label: '資金',
    color: '#16a34a',
    icon: '💰',
    unit: '円',
    gameOverLabel: '経営破綻',
  },
  compliance: {
    label: 'コンプライアンス',
    color: '#dc2626',
    icon: '⚖️',
    unit: '',
    gameOverLabel: '事業停止命令',
  },
  morale: {
    label: 'チーム士気',
    color: '#2563eb',
    icon: '💪',
    unit: '',
    gameOverLabel: '全員退職',
  },
  productivity: {
    label: '生産性',
    color: '#d97706',
    icon: '📊',
    unit: '%',
    gameOverLabel: '',
  },
  retention: {
    label: '定着率',
    color: '#7c3aed',
    icon: '🤝',
    unit: '',
    gameOverLabel: '人材流出',
  },
};

// ==========================================
// グレード
// ==========================================

export const GRADE_CONFIG: Record<
  string,
  { label: string; description: string; color: string; bgColor: string }
> = {
  S: {
    label: 'S ランク',
    description: '外国人雇用のプロフェッショナル！',
    color: '#c9a84c',
    bgColor: 'linear-gradient(135deg, #fef3c7, #fde68a)',
  },
  A: {
    label: 'A ランク',
    description: '優秀な雇用管理です。',
    color: '#2563eb',
    bgColor: 'linear-gradient(135deg, #dbeafe, #bfdbfe)',
  },
  B: {
    label: 'B ランク',
    description: '基本はできていますが改善の余地あり。',
    color: '#059669',
    bgColor: 'linear-gradient(135deg, #d1fae5, #a7f3d0)',
  },
  C: {
    label: 'C ランク',
    description: '重大な課題があります。学びを活かしましょう。',
    color: '#dc2626',
    bgColor: 'linear-gradient(135deg, #fee2e2, #fecaca)',
  },
};

// ==========================================
// ゲームオーバーメッセージ
// ==========================================

export const GAME_OVER_MESSAGES: Record<string, { title: string; description: string }> = {
  funds: {
    title: '経営破綻',
    description: '資金が底を突きました。外国人雇用のコスト管理は事前の計画が重要です。',
  },
  compliance: {
    title: '事業停止命令',
    description: 'コンプライアンス違反が重なり、事業停止命令を受けました。法令遵守は最優先事項です。',
  },
  morale: {
    title: '全員退職',
    description: 'チームの士気が崩壊し、全員が退職してしまいました。日頃のコミュニケーションと支援が大切です。',
  },
  retention: {
    title: '人材流出',
    description: '定着率がゼロになり、外国人スタッフが全員離職しました。定着支援は雇用の要です。',
  },
};

// ==========================================
// ゲスト制限
// ==========================================

export const GUEST_MONTH_LIMIT = 6;
