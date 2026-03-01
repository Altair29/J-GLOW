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

export const VISA_LEAD_TIMES: Record<VisaTypeV2, { months: number; label: string }> = {
  ikusei:           { months: 9, label: '育成就労（海外から）' },
  tokutei1_kaigai:  { months: 6, label: '特定技能1号（海外から）' },
  tokutei1_kokunai: { months: 3, label: '特定技能1号（国内切替）' },
  tokutei2:         { months: 4, label: '特定技能2号（1号からの移行）' },
  ginou:            { months: 3, label: '技術・人文知識・国際業務' },
  student:          { months: 2, label: '留学→就労ビザ変更' },
};

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
