// ========================================
// コストシミュレーター v2 定数
// ========================================

import type {
  IndustryDef,
  SendingCountry,
  Step0Data,
  Step1Data,
  Step2Data,
  Step3Data,
  VisaTypeV2,
  JapaneseHiringBenchmark,
  AdditionalRisk,
} from './types';

// --- 20業種リスト ---

export const INDUSTRIES_V2: IndustryDef[] = [
  { id: 'manufacturing_metal', label: '素形材・産業機械製造業', icon: '🏭', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2'] },
  { id: 'electronics', label: '電気・電子情報関連産業', icon: '🔌', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2'] },
  { id: 'construction', label: '建設', icon: '🏗️', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2'] },
  { id: 'shipbuilding', label: '造船・舶用工業', icon: '🚢', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2'] },
  { id: 'automobile', label: '自動車整備', icon: '🚗', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2'] },
  { id: 'aviation', label: '航空', icon: '✈️', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'hospitality', label: '宿泊', icon: '🏨', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'ginou'] },
  { id: 'agriculture', label: '農業', icon: '🌾', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'fishery', label: '漁業', icon: '🐟', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'food_manufacturing', label: '飲食料品製造業', icon: '🍱', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2'] },
  { id: 'food_service', label: '外食業', icon: '🍽️', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2'] },
  { id: 'nursing', label: '介護', icon: '🏥', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'ginou', 'student'] },
  { id: 'cleaning', label: 'ビルクリーニング', icon: '🧹', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'machining', label: '機械金属加工', icon: '⚙️', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'welding', label: '溶接', icon: '🔧', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'packaging', label: '工業包装', icon: '📦', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'printing', label: '印刷', icon: '🖨️', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'textile', label: '紡績・繊維製品製造', icon: '🧵', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai'] },
  { id: 'it_engineering', label: 'IT・エンジニアリング', icon: '💻', visaTypes: ['ginou', 'student'] },
  { id: 'other', label: 'その他', icon: '📋', visaTypes: ['ikusei', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2', 'ginou', 'student'] },
];

/** v1互換: 業種名リスト（Step1Companyのdropdownで使用） */
export const INDUSTRIES = INDUSTRIES_V2.map((i) => i.label);

// --- 特定技能2号対応業種 ---

export const TOKUTEI2_INDUSTRIES = [
  'manufacturing_metal',
  'electronics',
  'construction',
  'shipbuilding',
  'automobile',
  'food_manufacturing',
  'food_service',
];

// --- 送出国別デフォルト手数料 ---

export const COUNTRY_FEE_DEFAULTS: Record<SendingCountry, { min: number; max: number }> = {
  vietnam:     { min: 150000, max: 200000 },
  indonesia:   { min: 100000, max: 150000 },
  philippines: { min: 120000, max: 180000 },
  myanmar:     { min: 150000, max: 220000 },
  other:       { min: 100000, max: 200000 },
};

// --- ビザ別リードタイム（月数） ---
// 基本値（送出国未指定時のフォールバック）
export const VISA_LEAD_TIMES: Record<VisaTypeV2, { months: number; label: string }> = {
  ikusei:           { months: 9, label: '育成就労（海外から）' },
  tokutei1_kaigai:  { months: 6, label: '特定技能1号（海外から）' },
  tokutei1_kokunai: { months: 3, label: '特定技能1号（国内切替）' },
  tokutei2:         { months: 4, label: '特定技能2号（1号からの移行）' },
  ginou:            { months: 3, label: '技術・人文知識・国際業務' },
  student:          { months: 2, label: '留学→就労ビザ変更' },
};

// 送出国別リードタイム（visa × country → 月数）
// 国内切替(tokutei1_kokunai, tokutei2, student)は国に依存しないため省略
export const VISA_LEAD_TIMES_BY_COUNTRY: Partial<Record<VisaTypeV2, Record<SendingCountry, number>>> = {
  ikusei: {
    vietnam: 10,    // 送出機関選定〜入国まで
    indonesia: 8,   // 比較的スムーズ
    philippines: 11, // POEA/DMW手続きが長い
    myanmar: 12,    // 政情不安定で遅延リスク
    other: 10,
  },
  tokutei1_kaigai: {
    vietnam: 5,
    indonesia: 4,
    philippines: 7,  // POEA手続き
    myanmar: 6,
    other: 6,
  },
  ginou: {
    vietnam: 3,
    indonesia: 3,
    philippines: 5,  // POEA手続き
    myanmar: 4,
    other: 3,
  },
};

/** 送出国考慮のリードタイムを返す */
export function getLeadTimeMonths(visaType: VisaTypeV2, country?: SendingCountry): number {
  if (country && VISA_LEAD_TIMES_BY_COUNTRY[visaType]?.[country]) {
    return VISA_LEAD_TIMES_BY_COUNTRY[visaType]![country]!;
  }
  return VISA_LEAD_TIMES[visaType].months;
}

// --- ビザ種別設定 ---

export const VISA_TYPE_CONFIG: Record<VisaTypeV2, { label: string; shortLabel: string; color: string }> = {
  ikusei:           { label: '育成就労', shortLabel: '育成', color: '#2563eb' },
  tokutei1_kaigai:  { label: '特定技能1号（海外）', shortLabel: '特1海外', color: '#059669' },
  tokutei1_kokunai: { label: '特定技能1号（国内）', shortLabel: '特1国内', color: '#10b981' },
  tokutei2:         { label: '特定技能2号', shortLabel: '特2', color: '#7c3aed' },
  ginou:            { label: '技術・人文知識・国際業務', shortLabel: '技人国', color: '#ea580c' },
  student:          { label: '留学→就労', shortLabel: '留学', color: '#0891b2' },
};

// --- 送出国リスト ---

export const SENDING_COUNTRIES: { value: SendingCountry; label: string }[] = [
  { value: 'vietnam', label: 'ベトナム' },
  { value: 'indonesia', label: 'インドネシア' },
  { value: 'philippines', label: 'フィリピン' },
  { value: 'myanmar', label: 'ミャンマー' },
  { value: 'other', label: 'その他' },
];

// --- デフォルト値 ---

export const defaultStep0: Step0Data = {
  orgName: '',
  staffName: '',
  managementFee: 0,
  enrollmentFee: 0,
  sendingOrgFeeOverride: null,
  brandColor: '#1a2f5e',
  logoUrl: null,
};

export const defaultStep1: Step1Data = {
  companyName: '',
  industry: '',
  foreignStatus: 'none',
  fullTimeStaff: 50,
  pastTurnoverRate: null,
  initialBudget: null,
};

export const defaultStep2: Step2Data = {
  visaChoice: 'ikusei',
  targetChoice: 'kaigai',
  headcount: 3,
  startDate: (() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 6);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  })(),
  sendingCountry: 'vietnam',
  jobCategory: '',
  monthlyWage: null,
  employmentType: null,
  planYears: null,
  interviewTrip: null,
};

export const defaultStep3: Step3Data = {
  housing: 'full',
  training: 'outsource',
  support: 'outsource',
  housingMonthlyRent: null,
  interpreterStatus: null,
};

// --- Quick用の業種別概算デフォルト（1人あたり、万円） ---

export const QUICK_ESTIMATE_DEFAULTS = {
  initialCost: { min: 400000, max: 800000 },
  monthlyCost: { min: 50000, max: 80000 },
} as const;

// --- 日本人採用ベンチマーク（業種別） ---
// 出典: 厚生労働省 一般職業紹介状況、リクルートワークス研究所、各種調査

export const JP_HIRING_BENCHMARKS: Record<string, JapaneseHiringBenchmark> = {
  // 製造業系
  manufacturing_metal: { adCostPerHire: { min: 300000, max: 600000 }, agencyFeeRate: 0.20, averageMonthlyWage: 250000, effectiveJobOpeningsRatio: 1.8 },
  electronics:         { adCostPerHire: { min: 300000, max: 600000 }, agencyFeeRate: 0.20, averageMonthlyWage: 260000, effectiveJobOpeningsRatio: 1.7 },
  construction:        { adCostPerHire: { min: 400000, max: 800000 }, agencyFeeRate: 0.25, averageMonthlyWage: 300000, effectiveJobOpeningsRatio: 5.5 },
  shipbuilding:        { adCostPerHire: { min: 400000, max: 700000 }, agencyFeeRate: 0.22, averageMonthlyWage: 280000, effectiveJobOpeningsRatio: 3.2 },
  automobile:          { adCostPerHire: { min: 300000, max: 500000 }, agencyFeeRate: 0.20, averageMonthlyWage: 260000, effectiveJobOpeningsRatio: 2.8 },
  aviation:            { adCostPerHire: { min: 400000, max: 700000 }, agencyFeeRate: 0.22, averageMonthlyWage: 280000, effectiveJobOpeningsRatio: 2.0 },
  // サービス・福祉系
  hospitality:         { adCostPerHire: { min: 250000, max: 500000 }, agencyFeeRate: 0.18, averageMonthlyWage: 220000, effectiveJobOpeningsRatio: 3.8 },
  agriculture:         { adCostPerHire: { min: 200000, max: 400000 }, agencyFeeRate: 0.15, averageMonthlyWage: 210000, effectiveJobOpeningsRatio: 2.5 },
  fishery:             { adCostPerHire: { min: 200000, max: 400000 }, agencyFeeRate: 0.15, averageMonthlyWage: 220000, effectiveJobOpeningsRatio: 3.0 },
  food_manufacturing:  { adCostPerHire: { min: 250000, max: 500000 }, agencyFeeRate: 0.18, averageMonthlyWage: 220000, effectiveJobOpeningsRatio: 2.2 },
  food_service:        { adCostPerHire: { min: 300000, max: 600000 }, agencyFeeRate: 0.20, averageMonthlyWage: 210000, effectiveJobOpeningsRatio: 3.5 },
  nursing:             { adCostPerHire: { min: 400000, max: 800000 }, agencyFeeRate: 0.25, averageMonthlyWage: 260000, effectiveJobOpeningsRatio: 3.8 },
  cleaning:            { adCostPerHire: { min: 200000, max: 400000 }, agencyFeeRate: 0.15, averageMonthlyWage: 200000, effectiveJobOpeningsRatio: 2.5 },
  machining:           { adCostPerHire: { min: 300000, max: 600000 }, agencyFeeRate: 0.20, averageMonthlyWage: 260000, effectiveJobOpeningsRatio: 2.0 },
  welding:             { adCostPerHire: { min: 350000, max: 700000 }, agencyFeeRate: 0.22, averageMonthlyWage: 270000, effectiveJobOpeningsRatio: 4.0 },
  packaging:           { adCostPerHire: { min: 200000, max: 400000 }, agencyFeeRate: 0.15, averageMonthlyWage: 210000, effectiveJobOpeningsRatio: 1.8 },
  printing:            { adCostPerHire: { min: 250000, max: 500000 }, agencyFeeRate: 0.18, averageMonthlyWage: 230000, effectiveJobOpeningsRatio: 1.5 },
  textile:             { adCostPerHire: { min: 200000, max: 400000 }, agencyFeeRate: 0.15, averageMonthlyWage: 200000, effectiveJobOpeningsRatio: 2.0 },
  it_engineering:      { adCostPerHire: { min: 500000, max: 1000000 }, agencyFeeRate: 0.30, averageMonthlyWage: 350000, effectiveJobOpeningsRatio: 6.0 },
  other:               { adCostPerHire: { min: 300000, max: 600000 }, agencyFeeRate: 0.20, averageMonthlyWage: 240000, effectiveJobOpeningsRatio: 2.5 },
};

// --- 業種別外国人採用コストベンチマーク（平均値、出典: 各種業界調査） ---

export const INDUSTRY_COST_BENCHMARKS: Record<string, { initialPerPerson: number; monthlyPerPerson: number }> = {
  manufacturing_metal: { initialPerPerson: 550000, monthlyPerPerson: 58000 },
  electronics:         { initialPerPerson: 530000, monthlyPerPerson: 56000 },
  construction:        { initialPerPerson: 650000, monthlyPerPerson: 65000 },
  shipbuilding:        { initialPerPerson: 620000, monthlyPerPerson: 62000 },
  automobile:          { initialPerPerson: 540000, monthlyPerPerson: 56000 },
  aviation:            { initialPerPerson: 580000, monthlyPerPerson: 60000 },
  hospitality:         { initialPerPerson: 480000, monthlyPerPerson: 52000 },
  agriculture:         { initialPerPerson: 520000, monthlyPerPerson: 55000 },
  fishery:             { initialPerPerson: 540000, monthlyPerPerson: 55000 },
  food_manufacturing:  { initialPerPerson: 500000, monthlyPerPerson: 53000 },
  food_service:        { initialPerPerson: 470000, monthlyPerPerson: 50000 },
  nursing:             { initialPerPerson: 600000, monthlyPerPerson: 60000 },
  cleaning:            { initialPerPerson: 420000, monthlyPerPerson: 48000 },
  machining:           { initialPerPerson: 540000, monthlyPerPerson: 56000 },
  welding:             { initialPerPerson: 560000, monthlyPerPerson: 58000 },
  packaging:           { initialPerPerson: 430000, monthlyPerPerson: 48000 },
  printing:            { initialPerPerson: 460000, monthlyPerPerson: 50000 },
  textile:             { initialPerPerson: 440000, monthlyPerPerson: 48000 },
  it_engineering:      { initialPerPerson: 700000, monthlyPerPerson: 45000 },
  other:               { initialPerPerson: 520000, monthlyPerPerson: 55000 },
};

// --- その他リスク定義 ---

export const ADDITIONAL_RISKS: AdditionalRisk[] = [
  {
    type: 'immigration',
    label: '入管審査の不許可リスク',
    description: '在留資格申請が不許可になった場合、送出機関費・渡航費等が回収不能になります。不許可率は申請内容の質と企業の受入実績に左右されます。',
    severity: 'high',
  },
  {
    type: 'regulatory',
    label: '制度変更リスク',
    description: '育成就労制度は2027年施行予定の新制度であり、施行時に費用体系・受入条件が変更される可能性があります。特定技能の対象分野拡大も継続中です。',
    severity: 'medium',
  },
  {
    type: 'currency',
    label: '為替・送金リスク',
    description: '円安が進行すると、外国人労働者にとっての手取り魅力が下がり、採用競争力や定着率に影響します。送出国への送金コスト増も考慮が必要です。',
    severity: 'medium',
  },
  {
    type: 'compliance',
    label: 'コンプライアンスリスク',
    description: '監理費の不適切な徴収、違法な給与天引き、労働基準法違反等は行政処分（受入停止）につながります。制度理解と適切な運用体制の整備が不可欠です。',
    severity: 'high',
  },
];
