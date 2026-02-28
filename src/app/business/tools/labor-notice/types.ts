export type Lang = 'ja' | 'en' | 'zh' | 'vi' | 'id' | 'tl' | 'km' | 'my';

export type VisaType =
  | 'ikusei'        // 育成就労
  | 'tokutei1'      // 特定技能1号
  | 'tokutei2'      // 特定技能2号
  | 'ginou_jisshu'; // 技能実習（旧制度）

export type ContractType = 'fixed' | 'indefinite';

export type SectorType =
  | 'nursing_care' | 'building_cleaning' | 'manufacturing' | 'construction'
  | 'shipbuilding' | 'auto_maintenance' | 'aviation' | 'accommodation'
  | 'agriculture' | 'fishery' | 'food_beverage' | 'food_service'
  | 'textile' | 'industrial_packaging' | 'printing' | 'auto_transport'
  | 'forestry' | 'railway' | 'timber';

/** @deprecated Use SectorType instead */
export type TokuteiSector = SectorType;

export type PaymentMethod = 'bank_transfer' | 'cash';

export type RenewalType = 'auto' | 'possible' | 'no' | 'other';

export type OvertimeType = 'yes' | 'no';

export type DayOffPattern = 'weekly' | 'other';

export type WageType = 'monthly' | 'daily' | 'hourly';

export type RangeType = 'none' | 'all' | 'custom';

export type PaymentMonth = 'current' | 'next';

export type WorkHourType = 'fixed' | 'shift' | 'flex' | 'variant1' | 'variant1y';

export interface ShiftPattern {
  name: string;
  startTime: string;
  endTime: string;
  breakMinutes: string;
}

/* ── STEP 1: Company & Worker ── */
export interface Step1Data {
  worker_name: string;
  issue_date: string;
  company_name: string;
  company_name_romaji: string;
  company_address: string;
  company_address_romaji: string;
  company_phone: string;
  employer_name: string;
  employer_name_romaji: string;
  consultation_department: string;
  consultation_contact_person: string;
  consultation_contact_info: string;
}

/* ── STEP 2: Contract Period, Workplace & Duties ── */
export interface Step2Data {
  visa_type: VisaType;
  visa_loss_consent: boolean;
  entry_date: string;
  tokutei_sector: SectorType | '';
  tokutei_job_category: string;
  contract_type: ContractType;
  contract_start: string;
  contract_end: string;
  contract_max_period: string; // auto-set by visa_type (readonly)
  renewal_type: RenewalType;
  renewal_other_text: string;
  renewal_criteria_text: string;
  renewal_criteria_items: string[];
  renewal_criteria_other: string;
  renewal_limit_has: boolean;
  renewal_limit_times: string;
  renewal_limit_years: string;
  renewal_limit_reason: string;
  renewal_limit_reason_text: string;
  transfer_clause: boolean;    // 転籍条項（育成就労 & 特定技能のみ）
  workplace_initial: string;
  workplace_change_range_type: RangeType;
  workplace_change_range: string;
  job_description_initial: string;
  job_description_change_range_type: RangeType;
  job_description_change_range: string;
}

/* ── STEP 3: Work Hours, Holidays & Leave ── */
export interface Step3Data {
  work_hour_type: WorkHourType;
  work_start: string;    // HH:mm
  work_end: string;      // HH:mm
  break_minutes: string;
  overtime: OvertimeType;
  prescribed_hours_weekly: string;
  prescribed_hours_monthly: string;
  prescribed_hours_yearly: string;
  prescribed_days_weekly: string;
  prescribed_days_monthly: string;
  prescribed_days_yearly: string;
  overtime_article_number: string;
  days_off_pattern: DayOffPattern;
  days_off_days: string[];
  days_off_weekly: string; // computed from days_off_days: "土・日・祝日"
  days_off_other: string;
  paid_leave_days: string;
  other_leave: string;
  shift_patterns: ShiftPattern[];
  variant_start_date: string;
  variant_by_rules: boolean;
}

/* ── STEP 4: Wages & Retirement ── */
export interface Step4Data {
  wage_type: WageType;
  basic_salary: string;
  allowances: { name: string; amount: string }[];
  overtime_rate_normal: string;
  overtime_rate_over60: string;
  overtime_rate_holiday: string;
  overtime_rate_night: string;
  deduction_agreement: OvertimeType; // 労使協定控除の有無
  deduction_items: { type: string; amount: string }[];
  deduction_tax_estimate: string;
  deduction_social_estimate: string;
  deduction_employment_estimate: string;
  pay_cutoff_day: string;  // 'end' | '1'-'28'
  pay_day: string;         // 'end' | '1'-'28'
  payment_month: PaymentMonth;
  payment_method: PaymentMethod;
  fixed_overtime_enabled: boolean;
  fixed_overtime_name: string;
  fixed_overtime_amount: string;
  fixed_overtime_hours: string;
  pay_raise: OvertimeType;
  raise_timing: string;
  raise_timing_other: string;
  bonus: OvertimeType;
  bonus_frequency: string;
  bonus_last_amount: string;
  retirement_allowance: OvertimeType;
  work_stoppage_enabled: boolean;
  work_stoppage_rate: string;
  retirement_notice_days: string;
  dismissal_procedure: string;
  dismissal_article_number: string;
  dismissal_article_from: string;
  dismissal_article_to: string;
  dismissal_special_clauses: string[];
  health_check_hire_month: string;
  health_check_periodic_month: string;
  insurance_pension: boolean;
  insurance_health: boolean;
  insurance_employment: boolean;
  insurance_workers_comp: boolean;
  labor_union: 'yes' | 'no';
  work_rules_location: string;
}

/* ── All steps combined ── */
export interface FormData {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
}

/* ── Translation helper ── */
export type TranslationKey = string;
export type Translations = Record<TranslationKey, Record<Lang, string>>;

/* ── Visa config ── */
export interface VisaConfig {
  label: string;
  maxPeriod: string;
  contractDefault: ContractType;
  showTransferClause: boolean;
}

export const VISA_CONFIGS: Record<VisaType, VisaConfig> = {
  ikusei: {
    label: '育成就労',
    maxPeriod: '3年',
    contractDefault: 'fixed',
    showTransferClause: true,
  },
  tokutei1: {
    label: '特定技能1号',
    maxPeriod: '1年（更新あり・通算5年上限）',
    contractDefault: 'fixed',
    showTransferClause: true,
  },
  tokutei2: {
    label: '特定技能2号',
    maxPeriod: '制限なし（無期限も可）',
    contractDefault: 'indefinite',
    showTransferClause: false,
  },
  ginou_jisshu: {
    label: '技能実習（旧制度）',
    maxPeriod: '3年（優良なら5年）',
    contractDefault: 'fixed',
    showTransferClause: false,
  },
};

export const LANGUAGES: { code: Lang; label: string; flag: string }[] = [
  { code: 'ja', label: '日本語', flag: '🇯🇵' },
  { code: 'en', label: '英語', flag: '🇬🇧' },
  { code: 'zh', label: '中国語', flag: '🇨🇳' },
  { code: 'vi', label: 'ベトナム語', flag: '🇻🇳' },
  { code: 'id', label: 'インドネシア語', flag: '🇮🇩' },
  { code: 'tl', label: 'タガログ語', flag: '🇵🇭' },
  { code: 'km', label: 'クメール語', flag: '🇰🇭' },
  { code: 'my', label: 'ミャンマー語', flag: '🇲🇲' },
];

/* ── Currency formatter (3-digit comma) ── */
export function formatJPY(value: string | number): string {
  const num = typeof value === 'string' ? Number(value.replace(/,/g, '')) : value;
  if (!num || isNaN(num) || num === 0) return 'なし';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') + ' 円';
}

/* ── Display helpers ── */
export function resolveWorkplaceRange(type: RangeType, customText: string): string {
  switch (type) {
    case 'none': return '変更なし';
    case 'all': return '会社の定める事業所全般';
    case 'custom': return customText;
    default: return customText;
  }
}

export function resolveJobRange(type: RangeType, customText: string): string {
  switch (type) {
    case 'none': return '変更なし';
    case 'all': return '会社の定める業務全般';
    case 'custom': return customText;
    default: return customText;
  }
}

/** Resolve workplace range with translation */
export function resolveWorkplaceRangeTx(
  type: RangeType, customText: string,
  t: Translations, lang: Lang,
): string {
  const tx = (key: string) => t[key]?.[lang] ?? t[key]?.ja ?? '';
  switch (type) {
    case 'none': return tx('value_range_none');
    case 'all': return tx('value_workplace_range_all');
    case 'custom': return customText;
    default: return customText;
  }
}

/** Resolve job range with translation */
export function resolveJobRangeTx(
  type: RangeType, customText: string,
  t: Translations, lang: Lang,
): string {
  const tx = (key: string) => t[key]?.[lang] ?? t[key]?.ja ?? '';
  switch (type) {
    case 'none': return tx('value_range_none');
    case 'all': return tx('value_job_range_all');
    case 'custom': return customText;
    default: return customText;
  }
}

export function formatCutoffDay(value: string, lang: Lang = 'ja'): string {
  if (!value) return lang === 'ja' ? '（要入力）' : '(Required)';
  if (value === 'end') return lang === 'ja' ? '毎月末日' : 'End of each month';
  return lang === 'ja' ? `毎月${value}日` : `${value}th of each month`;
}

export function formatPayDay(value: string, month: PaymentMonth, lang: Lang = 'ja'): string {
  const monthLabel = lang === 'ja'
    ? (month === 'current' ? '当月' : '翌月')
    : (month === 'current' ? 'Same month' : 'Following month');
  if (!value) return lang === 'ja' ? '（要入力）' : '(Required)';
  if (value === 'end') return lang === 'ja' ? `${monthLabel}末日` : `${monthLabel}, end of month`;
  return lang === 'ja' ? `${monthLabel}${value}日` : `${monthLabel}, ${value}th`;
}

export const RENEWAL_LIMIT_REASONS = [
  { value: 'business_end', label: '当該業務が終了する見込みのため' },
  { value: 'visa', label: '在留資格の期限に合わせるため' },
  { value: 'project', label: '特定のプロジェクト完了のため' },
  { value: 'custom', label: 'その他（自由入力）' },
] as const;

/** @deprecated Use RENEWAL_CRITERIA_ITEMS instead */
export const RENEWAL_CRITERIA_OPTIONS = [
  '契約期間満了時の業務量',
  '勤務成績・態度',
  '能力',
  '会社の経営状況',
  '従事している業務の進捗状況',
] as const;

/* ── Sector lists per visa type ── */
export const IKUSEI_SECTORS: { value: SectorType; label: string; tKey: string }[] = [
  { value: 'nursing_care', label: '介護', tKey: 'sector_nursing_care' },
  { value: 'building_cleaning', label: 'ビルクリーニング', tKey: 'sector_building_cleaning' },
  { value: 'manufacturing', label: '素形材・産業機械・電気電子情報関連製造業', tKey: 'sector_manufacturing' },
  { value: 'construction', label: '建設', tKey: 'sector_construction' },
  { value: 'shipbuilding', label: '造船・舶用工業', tKey: 'sector_shipbuilding' },
  { value: 'auto_maintenance', label: '自動車整備', tKey: 'sector_auto_maintenance' },
  { value: 'aviation', label: '航空', tKey: 'sector_aviation' },
  { value: 'accommodation', label: '宿泊', tKey: 'sector_accommodation' },
  { value: 'agriculture', label: '農業', tKey: 'sector_agriculture' },
  { value: 'fishery', label: '漁業', tKey: 'sector_fishery' },
  { value: 'food_beverage', label: '飲食料品製造業', tKey: 'sector_food_beverage' },
  { value: 'food_service', label: '外食業', tKey: 'sector_food_service' },
  { value: 'textile', label: '繊維', tKey: 'sector_textile' },
  { value: 'industrial_packaging', label: '工業包装', tKey: 'sector_industrial_packaging' },
  { value: 'printing', label: '印刷', tKey: 'sector_printing' },
  { value: 'auto_transport', label: '自動車運送業', tKey: 'sector_auto_transport' },
  { value: 'forestry', label: '林業', tKey: 'sector_forestry' },
];

export const TOKUTEI_SECTORS: { value: SectorType; label: string; tKey: string }[] = [
  ...IKUSEI_SECTORS,
  { value: 'railway', label: '鉄道', tKey: 'sector_railway' },
  { value: 'timber', label: '木材産業', tKey: 'sector_timber' },
];

export function getSectorList(visaType: VisaType): { value: SectorType; label: string; tKey: string }[] {
  switch (visaType) {
    case 'ikusei':
    case 'ginou_jisshu':
      return IKUSEI_SECTORS;
    case 'tokutei1':
    case 'tokutei2':
      return TOKUTEI_SECTORS;
    default:
      return TOKUTEI_SECTORS;
  }
}

export const PAYMENT_METHOD_OPTIONS: { value: PaymentMethod; label: string }[] = [
  { value: 'bank_transfer', label: '銀行振込' },
  { value: 'cash', label: '現金払い' },
];

export const DEDUCTION_TYPE_OPTIONS = [
  { value: '社宅費（家賃）', label: '社宅費（家賃）' },
  { value: '食費', label: '食費' },
  { value: '水道光熱費', label: '水道光熱費' },
  { value: 'その他', label: 'その他' },
] as const;

/* ── Default form data ── */
export const DEFAULT_STEP1: Step1Data = {
  worker_name: '',
  issue_date: '',
  company_name: '',
  company_name_romaji: '',
  company_address: '',
  company_address_romaji: '',
  company_phone: '',
  employer_name: '',
  employer_name_romaji: '',
  consultation_department: '',
  consultation_contact_person: '',
  consultation_contact_info: '',
};

export const DEFAULT_STEP2: Step2Data = {
  visa_type: 'tokutei1',
  visa_loss_consent: false,
  entry_date: '',
  tokutei_sector: '',
  tokutei_job_category: '',
  contract_type: 'fixed',
  contract_start: '',
  contract_end: '',
  contract_max_period: '1年（更新あり・通算5年上限）',
  renewal_type: 'possible',
  renewal_other_text: '',
  renewal_criteria_text: '',
  renewal_criteria_items: [],
  renewal_criteria_other: '',
  renewal_limit_has: false,
  renewal_limit_times: '',
  renewal_limit_years: '',
  renewal_limit_reason: '',
  renewal_limit_reason_text: '',
  transfer_clause: false,
  workplace_initial: '',
  workplace_change_range_type: 'none',
  workplace_change_range: '',
  job_description_initial: '',
  job_description_change_range_type: 'none',
  job_description_change_range: '',
};

export const DEFAULT_STEP3: Step3Data = {
  work_hour_type: 'fixed',
  work_start: '08:00',
  work_end: '17:00',
  break_minutes: '60',
  overtime: 'yes',
  prescribed_hours_weekly: '',
  prescribed_hours_monthly: '',
  prescribed_hours_yearly: '',
  prescribed_days_weekly: '',
  prescribed_days_monthly: '',
  prescribed_days_yearly: '',
  overtime_article_number: '',
  days_off_pattern: 'weekly',
  days_off_days: [],
  days_off_weekly: '',
  days_off_other: '',
  paid_leave_days: '10',
  other_leave: '',
  shift_patterns: [],
  variant_start_date: '',
  variant_by_rules: false,
};

export const DEFAULT_STEP4: Step4Data = {
  wage_type: 'monthly',
  basic_salary: '',
  allowances: [],
  overtime_rate_normal: '25',
  overtime_rate_over60: '50',
  overtime_rate_holiday: '35',
  overtime_rate_night: '25',
  deduction_agreement: 'no',
  deduction_items: [],
  deduction_tax_estimate: '',
  deduction_social_estimate: '',
  deduction_employment_estimate: '',
  pay_cutoff_day: 'end',
  pay_day: '25',
  payment_month: 'next',
  payment_method: 'bank_transfer',
  fixed_overtime_enabled: false,
  fixed_overtime_name: '',
  fixed_overtime_amount: '',
  fixed_overtime_hours: '',
  pay_raise: 'yes',
  raise_timing: 'april',
  raise_timing_other: '',
  bonus: 'yes',
  bonus_frequency: 'twice',
  bonus_last_amount: '',
  retirement_allowance: 'no',
  work_stoppage_enabled: false,
  work_stoppage_rate: '60',
  retirement_notice_days: '30',
  dismissal_procedure: '',
  dismissal_article_number: '',
  dismissal_article_from: '',
  dismissal_article_to: '',
  dismissal_special_clauses: [
    'dismissal_visa_loss',
    'dismissal_false_record',
    'dismissal_deportation',
  ],
  health_check_hire_month: '',
  health_check_periodic_month: '',
  insurance_pension: true,
  insurance_health: true,
  insurance_employment: true,
  insurance_workers_comp: true,
  labor_union: 'no',
  work_rules_location: '',
};

/* ── Input sanitization ── */
const NAME_STRIP = /[<>&"'`\\{}[\]|^~$]/g;
const ADDR_STRIP = /[<>&"'`\\{}[\]|^~$]/g;

export function sanitizeName(raw: string): string {
  return raw.replace(NAME_STRIP, '').slice(0, 100);
}

export function sanitizeAddress(raw: string): string {
  return raw.replace(ADDR_STRIP, '').slice(0, 300);
}

/* ── Option arrays with tKey ── */
export const WORK_HOUR_TYPE_OPTIONS = [
  { value: 'fixed', label: '通常勤務（固定時間制）', tKey: 'value_work_hour_fixed' },
  { value: 'shift', label: 'シフト制', tKey: 'value_work_hour_shift' },
  { value: 'flex', label: 'フレックスタイム制', tKey: 'value_work_hour_flex' },
  { value: 'variant1', label: '1ヶ月単位の変形労働時間制', tKey: 'value_work_hour_variant1' },
  { value: 'variant1y', label: '1年単位の変形労働時間制', tKey: 'value_work_hour_variant1y' },
] as const;

export const RAISE_TIMING_OPTIONS = [
  { value: 'april', label: '毎年4月', tKey: 'value_raise_april' },
  { value: 'january', label: '毎年1月', tKey: 'value_raise_january' },
  { value: 'rules', label: '就業規則の定めによる', tKey: 'value_raise_rules' },
  { value: 'other', label: 'その他（自由入力）', tKey: 'value_raise_other' },
] as const;

export const BONUS_FREQUENCY_OPTIONS = [
  { value: 'twice', label: '年2回（6月・12月）', tKey: 'value_bonus_twice' },
  { value: 'once', label: '年1回', tKey: 'value_bonus_once' },
  { value: 'rules', label: '就業規則の定めによる', tKey: 'value_bonus_rules' },
] as const;

export const WORKPLACE_RANGE_OPTIONS = [
  { value: 'none' as RangeType, label: '変更なし', tKey: 'value_range_none' },
  { value: 'all' as RangeType, label: '会社の定める事業所全般', tKey: 'value_workplace_range_all' },
  { value: 'custom' as RangeType, label: 'その他（自由入力）', tKey: 'value_range_custom' },
] as const;

export const JOB_RANGE_OPTIONS = [
  { value: 'none' as RangeType, label: '変更なし', tKey: 'value_range_none' },
  { value: 'all' as RangeType, label: '会社の定める業務全般', tKey: 'value_job_range_all' },
  { value: 'custom' as RangeType, label: 'その他（自由入力）', tKey: 'value_range_custom' },
] as const;

export const RENEWAL_TYPE_OPTIONS = [
  { value: 'auto', label: '自動更新', tKey: 'value_renewal_auto' },
  { value: 'possible', label: '更新する場合があり得る', tKey: 'value_renewal_possible' },
  { value: 'no', label: '更新なし', tKey: 'value_renewal_no' },
  { value: 'other', label: 'その他', tKey: 'value_renewal_other' },
] as const;

export const RENEWAL_CRITERIA_ITEMS = [
  { value: '契約期間満了時の業務量', tKey: 'criteria_workload' },
  { value: '勤務成績・態度', tKey: 'criteria_performance' },
  { value: '能力', tKey: 'criteria_ability' },
  { value: '会社の経営状況', tKey: 'criteria_business_condition' },
  { value: '従事している業務の進捗状況', tKey: 'criteria_progress' },
] as const;

export const WAGE_TYPE_OPTIONS = [
  { value: 'monthly', label: '月給', tKey: 'label_monthly' },
  { value: 'daily', label: '日給', tKey: 'label_daily' },
  { value: 'hourly', label: '時給', tKey: 'label_hourly' },
] as const;

export const DISMISSAL_SPECIAL_OPTIONS = [
  { key: 'dismissal_visa_loss', label: '就労可能な在留資格を喪失したとき（在留期限切れ・更新不許可含む）' },
  { key: 'dismissal_false_record', label: '在留資格申請時に経歴・学歴の虚偽が判明したとき' },
  { key: 'dismissal_deportation', label: '強制退去命令を受けたとき' },
] as const;
