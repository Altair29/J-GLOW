import type { PartnerType, PlanTier } from '@/types/database';

export const TIER_CONFIG: Record<PlanTier, {
  label: string;
  badge: string;
  price: string;
  color: string;
  borderColor: string;
  cardBg: string;
  badgeBg: string;
  badgeColor: string;
  shadow: string;
  hoverShadow: string;
}> = {
  platinum: {
    label: 'プラチナ',
    badge: 'PLATINUM',
    price: '¥150,000〜 / 月',
    color: '#8b9ab0',
    borderColor: '#8b9ab0',
    cardBg: 'linear-gradient(145deg, #f0f4ff 0%, #e8edf8 100%)',
    badgeBg: 'linear-gradient(135deg, #8b9ab0, #b8c5d6)',
    badgeColor: '#0f1f45',
    shadow: '0 6px 32px rgba(107,127,163,0.18)',
    hoverShadow: '0 16px 56px rgba(107,127,163,0.3)',
  },
  gold: {
    label: 'ゴールド',
    badge: 'GOLD',
    price: '¥80,000〜 / 月',
    color: '#c9a84c',
    borderColor: '#c9a84c',
    cardBg: 'linear-gradient(145deg, #fffef8 0%, #fffbec 100%)',
    badgeBg: 'linear-gradient(135deg, #c9a84c, #f0d080)',
    badgeColor: '#1a2f5e',
    shadow: '0 3px 16px rgba(201,168,76,0.15)',
    hoverShadow: '0 12px 40px rgba(201,168,76,0.28)',
  },
  regular: {
    label: 'レギュラー',
    badge: 'MEMBER',
    price: '審査費のみ ¥30,000',
    color: '#1a2f5e',
    borderColor: '#dce4ef',
    cardBg: '#ffffff',
    badgeBg: '#e8edf5',
    badgeColor: '#1a2f5e',
    shadow: '0 1px 4px rgba(0,0,0,0.05)',
    hoverShadow: '0 4px 20px rgba(26,47,94,0.1)',
  },
};

export const PARTNER_TYPE_CONFIG: Record<PartnerType, {
  label: string;
  icon: string;
  color: string;
  bgAccent: string;
}> = {
  kanri:    { label: '監理団体',     icon: '🏢', color: '#2d6a4f', bgAccent: '#d8f3dc' },
  support:  { label: '登録支援機関', icon: '🤝', color: '#1d6fa4', bgAccent: '#d0eaf8' },
  gyosei:   { label: '行政書士',     icon: '📋', color: '#6b4226', bgAccent: '#fde8d8' },
  bengoshi: { label: '弁護士',       icon: '⚖️', color: '#5b2333', bgAccent: '#fdd8de' },
  sharoshi: { label: '社労士',       icon: '📊', color: '#4a3580', bgAccent: '#e6e0f8' },
};

// 種別ごとのビザ選択肢（フィルターパネルで使用）
export const TYPE_VISA_OPTIONS: Record<PartnerType | 'all', string[]> = {
  all:      ['育成就労', '技能実習', '特定技能1号', '特定技能2号', '技術・人文・国際', '留学', '経営管理'],
  kanri:    ['育成就労', '技能実習'],
  support:  ['特定技能1号'],
  gyosei:   ['育成就労', '技能実習', '特定技能1号', '特定技能2号', '技術・人文・国際', '経営管理', '留学', '高度人材'],
  bengoshi: ['育成就労', '技能実習', '特定技能1号', '特定技能2号', '技術・人文・国際', '経営管理', '不法就労対応', '異議申立'],
  sharoshi: ['就業規則', '社会保険', '雇用保険', '助成金', '給与計算'],
};

export const REGION_OPTIONS = ['北海道', '東北', '関東', '東海', '関西', '中国・四国', '九州・沖縄', '全国'] as const;
export const INDUSTRY_OPTIONS = ['製造業', '建設業', '農業', '介護', '食品加工', 'IT', 'サービス業', '溶接・溶断', '塗装', '繊維'] as const;
export const COUNTRY_OPTIONS = ['ベトナム', 'インドネシア', 'フィリピン', 'ミャンマー', '中国', 'カンボジア', 'タイ'] as const;

// FilterPanel 用: 種別リスト
export const PARTNER_TYPES_LIST = (Object.entries(PARTNER_TYPE_CONFIG) as [PartnerType, typeof PARTNER_TYPE_CONFIG[PartnerType]][]).map(
  ([id, cfg]) => ({ id, icon: cfg.icon, label: cfg.label })
);

// FilterPanel 用: フィルターオプション集約
export const FILTER_OPTIONS = {
  regions: REGION_OPTIONS,
  visas: TYPE_VISA_OPTIONS.all,
  industries: INDUSTRY_OPTIONS,
  countries: COUNTRY_OPTIONS,
};

// FilterPanel 用: 種別ごとのビザフィルタ
export const TYPE_VISA_FILTER = TYPE_VISA_OPTIONS;

// FilterPanel 用: 送出国フィルタを表示する種別
export const SHOW_COUNTRY_FILTER: PartnerType[] = ['kanri', 'support', 'gyosei'];

type FieldDef = {
  id: string;
  label: string;
  type: 'text' | 'email' | 'tel' | 'number' | 'select' | 'multicheck';
  placeholder?: string;
  options?: readonly string[];
  required: boolean;
};

// ApplicationForm 用: 共通 + 種別固有フィールド定義
export const FORM_FIELDS: Record<'common' | PartnerType, readonly FieldDef[]> = {
  common: [
    { id: 'org_name', label: '法人名・団体名', type: 'text', placeholder: '例: 〇〇協同組合', required: true },
    { id: 'contact_name', label: '担当者名', type: 'text', placeholder: '例: 山田 太郎', required: true },
    { id: 'email', label: 'メールアドレス', type: 'email', placeholder: 'info@example.co.jp', required: true },
    { id: 'tel', label: '電話番号', type: 'tel', placeholder: '03-1234-5678', required: false },
    { id: 'prefecture', label: '所在地（都道府県）', type: 'select', options: REGION_OPTIONS, required: true },
    { id: 'industries', label: '対応業種', type: 'multicheck', options: INDUSTRY_OPTIONS, required: false },
    { id: 'origin_countries', label: '対応送出国', type: 'multicheck', options: COUNTRY_OPTIONS, required: false },
  ],
  kanri: [
    { id: 'permit_type', label: '許可区分', type: 'select', options: ['一般', '特定'] as const, required: true },
    { id: 'permit_no', label: '許可番号', type: 'text', placeholder: '許-XXXX', required: false },
    { id: 'visa_types', label: '対応在留資格', type: 'multicheck', options: TYPE_VISA_OPTIONS.kanri, required: false },
  ],
  support: [
    { id: 'reg_no', label: '登録番号', type: 'text', placeholder: '登-XXXX', required: false },
    { id: 'visa_types', label: '対応在留資格', type: 'multicheck', options: TYPE_VISA_OPTIONS.support, required: false },
  ],
  gyosei: [
    { id: 'bar_no', label: '登録番号', type: 'text', placeholder: '第XXXXX号', required: false },
    { id: 'visa_types', label: '対応在留資格', type: 'multicheck', options: TYPE_VISA_OPTIONS.gyosei, required: false },
  ],
  bengoshi: [
    { id: 'bar_no', label: '登録番号', type: 'text', placeholder: '第XXXXX号', required: false },
    { id: 'visa_types', label: '対応分野', type: 'multicheck', options: TYPE_VISA_OPTIONS.bengoshi, required: false },
  ],
  sharoshi: [
    { id: 'sr_no', label: '登録番号', type: 'text', placeholder: '第XXXXX号', required: false },
    { id: 'visa_types', label: '対応分野', type: 'multicheck', options: TYPE_VISA_OPTIONS.sharoshi, required: false },
  ],
};
