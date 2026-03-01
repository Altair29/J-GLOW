"use client"

import { useState, useMemo, useEffect } from "react"
import dynamic from 'next/dynamic'

const CumulativeChart = dynamic(() => import('./CumulativeChart'), { ssr: false, loading: () => <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>グラフ読み込み中...</div> })

// 特定技能2号は既存の特定技能1号経験者が移行するものであり
// 新規採用のおすすめ候補として表示するのは現実的でないため除外
type VisaType = 'ikusei' | 'tokutei' | 'gijinkoku' | 'ryugaku'
type JobCategory = 'factory' | 'construction' | 'agriculture' | 'care' | 'food' | 'office' | 'it' | 'logistics' | 'service' | 'other'
type Duration = 'under1' | '1to3' | '3to5' | 'longterm'
type SkillLevel = 'none' | 'technical' | 'university'
type LeadTime = 'asap' | 'mid' | 'planned'
type JapanExp = 'japan_based' | 'japan_ok' | 'either'
type Employment = 'fulltime' | 'contract' | 'parttime'

function useIsPC() {
  const [isPC, setIsPC] = useState(false)
  useEffect(() => {
    const mql = window.matchMedia('(min-width: 768px)')
    setIsPC(mql.matches)
    const handler = (e: MediaQueryListEvent) => setIsPC(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])
  return isPC
}

const SCORING_RULES = [
  // 育成就労
  { visaType: 'ikusei' as VisaType, points: 40, condition: { duration: ['3to5', 'longterm'] } },
  { visaType: 'ikusei' as VisaType, points: 20, condition: { duration: ['longterm'] } },
  { visaType: 'ikusei' as VisaType, points: 30, condition: { leadTime: ['planned'] } },
  { visaType: 'ikusei' as VisaType, points: 25, condition: { japanExp: ['japan_ok', 'either'] } },
  { visaType: 'ikusei' as VisaType, points: 20, condition: { skillLevel: ['none'] } },
  { visaType: 'ikusei' as VisaType, points: 20, condition: { employment: ['fulltime'] } },
  { visaType: 'ikusei' as VisaType, points: 15, condition: { jobCategory: ['factory', 'construction', 'agriculture', 'care', 'food'] } },
  { visaType: 'ikusei' as VisaType, points: -20, condition: { jobCategory: ['logistics'] } },
  { visaType: 'ikusei' as VisaType, points: -20, condition: { jobCategory: ['service'] } },
  { visaType: 'ikusei' as VisaType, points: -30, condition: { duration: ['under1'] } },
  { visaType: 'ikusei' as VisaType, points: -30, condition: { leadTime: ['asap'] } },
  { visaType: 'ikusei' as VisaType, points: -20, condition: { employment: ['parttime'] } },
  { visaType: 'ikusei' as VisaType, points: -20, condition: { skillLevel: ['university'] } },
  { visaType: 'ikusei' as VisaType, points: -20, condition: { japanExp: ['japan_based'] } },

  // 特定技能
  { visaType: 'tokutei' as VisaType, points: 35, condition: { duration: ['1to3', '3to5'] } },
  { visaType: 'tokutei' as VisaType, points: 20, condition: { duration: ['longterm'] } },
  { visaType: 'tokutei' as VisaType, points: 30, condition: { japanExp: ['japan_based'] } },
  { visaType: 'tokutei' as VisaType, points: 25, condition: { skillLevel: ['none', 'technical'] } },
  { visaType: 'tokutei' as VisaType, points: 25, condition: { leadTime: ['asap'] } },
  { visaType: 'tokutei' as VisaType, points: 20, condition: { employment: ['fulltime', 'contract'] } },
  { visaType: 'tokutei' as VisaType, points: 20, condition: { leadTime: ['mid'] } },
  { visaType: 'tokutei' as VisaType, points: 15, condition: { jobCategory: ['factory', 'construction', 'agriculture', 'care', 'food'] } },
  { visaType: 'tokutei' as VisaType, points: 10, condition: { jobCategory: ['logistics'] } },
  { visaType: 'tokutei' as VisaType, points: 5, condition: { jobCategory: ['service'] } },
  { visaType: 'tokutei' as VisaType, points: 10, condition: { japanExp: ['japan_ok'] } },
  { visaType: 'tokutei' as VisaType, points: -15, condition: { duration: ['under1'] } },
  { visaType: 'tokutei' as VisaType, points: -20, condition: { employment: ['parttime'] } },

  // 技人国
  { visaType: 'gijinkoku' as VisaType, points: 50, condition: { skillLevel: ['university'] } },
  { visaType: 'gijinkoku' as VisaType, points: 35, condition: { jobCategory: ['it', 'office'] } },
  { visaType: 'gijinkoku' as VisaType, points: 5, condition: { jobCategory: ['logistics'] } },
  { visaType: 'gijinkoku' as VisaType, points: 15, condition: { jobCategory: ['service'] } },
  { visaType: 'gijinkoku' as VisaType, points: 25, condition: { duration: ['3to5', 'longterm'] } },
  { visaType: 'gijinkoku' as VisaType, points: 20, condition: { employment: ['fulltime'] } },
  { visaType: 'gijinkoku' as VisaType, points: 20, condition: { japanExp: ['japan_based'] } },
  { visaType: 'gijinkoku' as VisaType, points: 15, condition: { leadTime: ['asap'] } },
  { visaType: 'gijinkoku' as VisaType, points: 15, condition: { leadTime: ['mid'] } },
  { visaType: 'gijinkoku' as VisaType, points: -40, condition: { skillLevel: ['none'] } },
  { visaType: 'gijinkoku' as VisaType, points: -20, condition: { jobCategory: ['factory', 'agriculture'] } },

  // 留学生
  { visaType: 'ryugaku' as VisaType, points: 40, condition: { employment: ['parttime'] } },
  { visaType: 'ryugaku' as VisaType, points: 40, condition: { japanExp: ['japan_based'] } },
  { visaType: 'ryugaku' as VisaType, points: 30, condition: { duration: ['under1', '1to3'] } },
  { visaType: 'ryugaku' as VisaType, points: 30, condition: { leadTime: ['asap'] } },
  { visaType: 'ryugaku' as VisaType, points: 15, condition: { jobCategory: ['food', 'office'] } },
  { visaType: 'ryugaku' as VisaType, points: 15, condition: { jobCategory: ['logistics'] } },
  { visaType: 'ryugaku' as VisaType, points: 15, condition: { jobCategory: ['service'] } },
  { visaType: 'ryugaku' as VisaType, points: -40, condition: { employment: ['fulltime'] } },
  { visaType: 'ryugaku' as VisaType, points: -40, condition: { japanExp: ['japan_ok'] } },
  { visaType: 'ryugaku' as VisaType, points: -30, condition: { duration: ['3to5', 'longterm'] } },
]

const VISA_MASTER = {
  ikusei:    { label: '育成就労', maxStay: '3年（特定技能1号へ移行可）', timeOverseas: '6〜12ヶ月', timeDomestic: '—', conditions: ['フルタイム正社員', '対象職種のみ（製造・建設・農業・介護 等）', '監理支援機関を通じた受入れが必須'], caution: '2027年4月制度開始。海外採用のみ' },
  tokutei:   { label: '特定技能', maxStay: '最大5年（更新可・条件により長期化）', timeOverseas: '4〜6ヶ月', timeDomestic: '3〜4ヶ月', conditions: ['フルタイム', '対象12分野', '技能試験・日本語試験が必要'], caution: '転職が自由。家族帯同は条件による' },
  gijinkoku: { label: '技人国', maxStay: '1〜5年（更新可）', timeOverseas: '2〜4ヶ月', timeDomestic: '1〜2ヶ月', conditions: ['大学・専門学校卒以上', '業務と学歴の一致が必要'], caution: '製造・農業などの現場作業は対象外' },
  ryugaku:   { label: '留学生（資格外活動）', maxStay: '在学中（週28時間以内）', timeOverseas: '—', timeDomestic: '即〜1ヶ月', conditions: ['週28時間以内のみ', '国内在住の留学生限定'], caution: '卒業・退学で継続不可。フルタイム不可' },
}

const TIMELINE_MASTER: Record<VisaType, { domestic: { step: string; duration: string }[]; overseas: { step: string; duration: string }[] }> = {
  ikusei: {
    domestic: [],
    overseas: [
      { step: '求人・面接', duration: '1〜2ヶ月' },
      { step: '送出機関手続き', duration: '1〜2ヶ月' },
      { step: '日本語研修', duration: '2〜4ヶ月' },
      { step: '在留資格申請', duration: '1〜2ヶ月' },
      { step: '入国・就労開始', duration: '' },
    ],
  },
  tokutei: {
    domestic: [
      { step: '求人・面接', duration: '2〜4週' },
      { step: '在留資格変更', duration: '1〜2ヶ月' },
      { step: '就労開始', duration: '' },
    ],
    overseas: [
      { step: '求人・面接', duration: '1〜2ヶ月' },
      { step: '試験対策・受験', duration: '1〜2ヶ月' },
      { step: '在留資格申請', duration: '1〜2ヶ月' },
      { step: '入国・就労開始', duration: '' },
    ],
  },
  gijinkoku: {
    domestic: [
      { step: '求人・面接', duration: '2〜4週' },
      { step: '在留資格変更', duration: '1〜2ヶ月' },
      { step: '就労開始', duration: '' },
    ],
    overseas: [
      { step: '求人・面接', duration: '1〜2ヶ月' },
      { step: '在留資格申請', duration: '1〜2ヶ月' },
      { step: '入国・就労開始', duration: '' },
    ],
  },
  ryugaku: {
    domestic: [
      { step: '求人・面接', duration: '1〜2週' },
      { step: '資格外活動許可', duration: '1〜2週' },
      { step: '就労開始', duration: '' },
    ],
    overseas: [],
  },
}

const COST_MASTER: Record<VisaType, { lump: { label: string; min: number; max: number; note?: string }[]; monthly: { label: string; min: number; max: number; note?: string }[] }> = {
  ikusei:    { lump: [{ label: '送出機関費', min: 10, max: 35, note: '国籍により変動' }, { label: '入国前日本語研修', min: 5, max: 15 }, { label: '在留資格申請費（行政書士）', min: 8, max: 20 }, { label: '渡航・入国費用', min: 5, max: 10 }], monthly: [{ label: '監理支援機関費', min: 2, max: 5 }, { label: '住居費補助', min: 3, max: 8, note: '会社提供の場合' }, { label: '入国後日本語研修', min: 0.5, max: 2 }] },
  tokutei:   { lump: [{ label: '採用費（エージェント等）', min: 10, max: 30, note: '国内採用は低め' }, { label: '在留資格申請費', min: 5, max: 15 }], monthly: [{ label: '登録支援機関委託費', min: 2, max: 4, note: '自社支援なら不要' }, { label: '住居支援費', min: 0, max: 5, note: '任意' }] },
  gijinkoku: { lump: [{ label: '採用エージェント費', min: 30, max: 80, note: '年収の20〜30%が相場' }, { label: '在留資格申請費', min: 5, max: 15 }, { label: 'リロケーション費（海外採用）', min: 0, max: 20 }], monthly: [] },
  ryugaku:   { lump: [{ label: '採用費（ほぼゼロの場合も）', min: 0, max: 5 }], monthly: [{ label: '給与（週28h・最低賃金以上）', min: 8, max: 15, note: '地域最低賃金以上' }] },
}

const MARKET_SIZE: Partial<Record<VisaType, Partial<Record<JobCategory, string>>>> = {
  tokutei: {
    factory: '製造業分野：約6.8万人', construction: '建設分野：約1.3万人', agriculture: '農業分野：約3.6万人',
    care: '介護分野：約3.5万人', food: '飲食料品製造・外食：約8.2万人', office: '対象分野外（特定技能の対象外）',
    it: '対象分野外（特定技能の対象外）', logistics: '運輸・物流分野：対象分野拡大検討中',
    service: '対象分野外（特定技能の対象外）', other: 'お問い合わせください',
  },
  gijinkoku: {
    factory: '技術職：約9万人', construction: '技術職：約2万人', agriculture: '対象外になるケースが多い',
    care: '対象外（介護は別資格）', food: '通訳・国際業務：約5万人', office: '事務・翻訳・営業：約18万人',
    it: 'IT・エンジニア：約12万人', logistics: '技術・管理職：約2万人',
    service: '販売・サービス業：約5万人', other: '要個別確認',
  },
  ryugaku: {
    factory: '製造業アルバイト：広く就労可', construction: '建設業アルバイト：可（現場単純作業は制限あり）',
    agriculture: '農業アルバイト：可', care: '介護アルバイト：条件付きで可',
    food: '飲食アルバイト：約34万人中最多業種', office: '事務アルバイト：可', it: 'ITアルバイト：可',
    logistics: '倉庫・物流アルバイト：広く就労可', service: '販売・サービスアルバイト：広く就労可', other: '業種による',
  },
  ikusei: {
    factory: '製造業：制度移行準備中（2027年〜）', construction: '建設：制度移行準備中（2027年〜）',
    agriculture: '農業：制度移行準備中（2027年〜）', care: '介護：制度移行準備中（2027年〜）',
    food: '飲食料品製造：制度移行準備中（2027年〜）', office: '対象外', it: '対象外',
    logistics: '対象外（2027年時点）', service: '対象外', other: '要確認',
  },
}

const JP_TURNOVER_RATE: Partial<Record<JobCategory, number>> = {
  factory: 0.20, construction: 0.25, agriculture: 0.22, care: 0.27, food: 0.27,
  office: 0.15, it: 0.13, logistics: 0.24, service: 0.25, other: 0.22,
}
const FOREIGN_TURNOVER_RATE: Record<VisaType, { min: number; max: number }> = {
  ikusei:    { min: 0.02, max: 0.03 },
  tokutei:   { min: 0.10, max: 0.15 },
  gijinkoku: { min: 0.10, max: 0.15 },
  ryugaku:   { min: 0.15, max: 0.20 },
}
const AVG_ANNUAL_SALARY: Partial<Record<JobCategory, number>> = {
  factory: 300, construction: 350, agriculture: 270, care: 300, food: 280,
  office: 360, it: 480, logistics: 310, service: 270, other: 300,
}

const HARD_EXCLUSIONS: Partial<Record<VisaType, JobCategory[]>> = {
  ikusei: ['office', 'it', 'logistics', 'service', 'other'],
  tokutei: ['office', 'it', 'service'],
  gijinkoku: ['factory', 'agriculture'],
}

const RULE_LABELS: { visaType: VisaType; condition: Record<string, string[]>; label: string }[] = [
  { visaType: 'ikusei', condition: { duration: ['3to5', 'longterm'] }, label: '長期雇用に最適' },
  { visaType: 'ikusei', condition: { japanExp: ['japan_ok', 'either'] }, label: '海外からの採用向き' },
  { visaType: 'ikusei', condition: { skillLevel: ['none'] }, label: '未経験者の育成OK' },
  { visaType: 'ikusei', condition: { employment: ['fulltime'] }, label: 'フルタイム対応' },
  { visaType: 'ikusei', condition: { jobCategory: ['factory', 'construction', 'agriculture', 'care', 'food'] }, label: '対象職種に該当' },
  { visaType: 'tokutei', condition: { duration: ['1to3', '3to5'] }, label: '中長期雇用に対応' },
  { visaType: 'tokutei', condition: { duration: ['longterm'] }, label: '長期雇用にも対応可' },
  { visaType: 'tokutei', condition: { japanExp: ['japan_based'] }, label: '国内在住者を採用可' },
  { visaType: 'tokutei', condition: { skillLevel: ['none', 'technical'] }, label: '幅広いスキルに対応' },
  { visaType: 'tokutei', condition: { leadTime: ['asap', 'mid'] }, label: '比較的早く採用可能' },
  { visaType: 'tokutei', condition: { jobCategory: ['factory', 'construction', 'agriculture', 'care', 'food'] }, label: '対象分野に該当' },
  { visaType: 'gijinkoku', condition: { skillLevel: ['university'] }, label: '大卒・専門職に最適' },
  { visaType: 'gijinkoku', condition: { jobCategory: ['it', 'office'] }, label: 'IT・事務に最適' },
  { visaType: 'gijinkoku', condition: { duration: ['3to5', 'longterm'] }, label: '長期雇用に対応' },
  { visaType: 'gijinkoku', condition: { japanExp: ['japan_based'] }, label: '国内人材の採用に有利' },
  { visaType: 'ryugaku', condition: { employment: ['parttime'] }, label: 'アルバイト採用に最適' },
  { visaType: 'ryugaku', condition: { japanExp: ['japan_based'] }, label: '国内在住者限定' },
  { visaType: 'ryugaku', condition: { duration: ['under1', '1to3'] }, label: '短期〜中期に対応' },
  { visaType: 'ryugaku', condition: { leadTime: ['asap'] }, label: 'すぐに採用可能' },
]

const DEFAULT_RECOMMENDATION_TEXT = 'この在留資格は、入力された条件に最も適合しています。詳細な受入計画については専門家にご相談ください。'

const RECOMMENDATION_TEMPLATES: { visaType: VisaType; conditions: Record<string, string>; text: string }[] = [
  { visaType: 'ikusei', conditions: { duration: '3to5', skillLevel: 'none', japanExp: 'japan_ok' }, text: '未経験者を海外から招き、3〜5年かけて技能を育成できる制度です。監理支援機関のサポートのもと、計画的な人材育成が可能です。' },
  { visaType: 'ikusei', conditions: { duration: 'longterm', skillLevel: 'none' }, text: '長期的な人材育成を前提とした制度です。育成修了後は特定技能1号へ移行でき、最大8年以上の雇用も見込めます。' },
  { visaType: 'ikusei', conditions: { skillLevel: 'none' }, text: '未経験者でも受入可能な制度です。対象職種であれば、海外から人材を招いて育成できます。' },
  { visaType: 'tokutei', conditions: { japanExp: 'japan_based', leadTime: 'asap' }, text: '国内在住の外国人を比較的短期間で採用できます。技能試験・日本語試験に合格済みの人材であれば、3〜4ヶ月程度で就労開始が見込めます。' },
  { visaType: 'tokutei', conditions: { japanExp: 'japan_based' }, text: '日本在住の人材を採用できるため、文化適応や日本語コミュニケーションがスムーズです。在留資格変更で比較的早く就労開始できます。' },
  { visaType: 'tokutei', conditions: { leadTime: 'asap' }, text: '特定技能は試験合格者を比較的早期に採用できる制度です。国内採用なら3〜4ヶ月、海外採用でも4〜6ヶ月程度で就労開始が見込めます。' },
  { visaType: 'tokutei', conditions: {}, text: '対象12分野で即戦力の外国人材を採用できる制度です。登録支援機関のサポートを活用すれば、受入体制の構築も比較的スムーズです。' },
  { visaType: 'gijinkoku', conditions: { skillLevel: 'university', jobCategory: 'it' }, text: 'IT分野の大卒・専門職人材を採用するのに最適な在留資格です。更新可能で長期雇用にも対応し、家族帯同も認められます。' },
  { visaType: 'gijinkoku', conditions: { skillLevel: 'university', jobCategory: 'office' }, text: '事務・翻訳・営業などホワイトカラー職種で大卒人材を採用できます。業務と学歴の適合性が認められれば、スムーズに在留資格を取得できます。' },
  { visaType: 'gijinkoku', conditions: { skillLevel: 'university' }, text: '大卒・専門学校卒以上の人材を、専門性を活かした業務で雇用できる在留資格です。更新可能で長期雇用にも対応します。' },
  { visaType: 'ryugaku', conditions: { employment: 'parttime', leadTime: 'asap' }, text: '日本在住の留学生をすぐにアルバイトとして採用できます。採用コストがほぼゼロで、最短即日〜1ヶ月で就労開始が可能です。' },
  { visaType: 'ryugaku', conditions: { employment: 'parttime' }, text: '留学生のアルバイト採用は、低コストで手軽に始められます。週28時間以内の勤務制限がありますが、採用・教育コストを抑えられます。' },
]

const PLANNING_POINTS: Record<VisaType, string[]> = {
  ikusei: [
    '監理支援機関の選定（地域・対応言語・サポート体制を比較）',
    '送出機関の選定（国籍・費用・候補者の質を確認）',
    '生活支援体制の整備（住居・日本語・生活オリエンテーション）',
    '3年後の特定技能1号への移行計画を事前に検討',
  ],
  tokutei: [
    '登録支援機関への委託 or 自社支援の判断（コスト vs 工数）',
    '試験合格者の探し方（国内在住者 or 海外からの招聘）',
    '転籍リスクへの対応（定着施策・キャリアパスの提示）',
    '定期面談・相談体制の構築（義務的支援の実施）',
  ],
  gijinkoku: [
    '業務内容と学歴・専攻の適合性の確認（入管審査のポイント）',
    '採用エージェントの選定（年収20〜30%の手数料相場）',
    '在留期間更新の管理体制（期限切れ防止）',
    'キャリアアップ・昇給計画の提示（定着促進）',
  ],
  ryugaku: [
    '週28時間の勤務時間管理（超過は法令違反）',
    '長期休暇中の勤務時間変更（週40時間まで可能）',
    '卒業後の在留資格変更（特定技能 or 技人国への切替）',
    '資格外活動許可の確認・更新管理',
  ],
}

const NATIONALITY_LABELS: Record<string, string> = { vietnam: 'ベトナム', china: '中国', philippines: 'フィリピン', indonesia: 'インドネシア', myanmar: 'ミャンマー', nepal: 'ネパール', other: 'その他' }
const NATIONALITY_OPTIONS = [
  { value: 'vietnam',     label: 'ベトナム',      flag: '🇻🇳', code: 'VN' },
  { value: 'china',       label: '中国',          flag: '🇨🇳', code: 'CN' },
  { value: 'philippines', label: 'フィリピン',     flag: '🇵🇭', code: 'PH' },
  { value: 'indonesia',   label: 'インドネシア',   flag: '🇮🇩', code: 'ID' },
  { value: 'myanmar',     label: 'ミャンマー',     flag: '🇲🇲', code: 'MM' },
  { value: 'nepal',       label: 'ネパール',       flag: '🇳🇵', code: 'NP' },
  { value: 'other',       label: 'その他',         flag: '🌏',  code: '他' },
]
const NATIONALITY_FACTOR: Record<string, number> = { vietnam: 1.0, china: 0.9, philippines: 1.1, indonesia: 1.0, myanmar: 1.2, nepal: 1.1, other: 1.0 }

type Inputs = { jobCategory: JobCategory | null; employment: Employment | null; duration: Duration | null; skillLevel: SkillLevel | null; leadTime: LeadTime | null; japanExp: JapanExp | null; headcount: number; nationality: string }

function calcScores(inputs: Inputs) {
  const visaTypes: VisaType[] = ['ikusei', 'tokutei', 'gijinkoku', 'ryugaku']
  return visaTypes.map(vt => {
    if (inputs.jobCategory && HARD_EXCLUSIONS[vt]?.includes(inputs.jobCategory)) {
      return { visaType: vt, score: -9999 }
    }
    if (inputs.skillLevel === 'university' && (vt === 'ikusei' || vt === 'tokutei')) {
      return { visaType: vt, score: -9999 }
    }
    let score = 0
    for (const rule of SCORING_RULES) {
      if (rule.visaType !== vt) continue
      const c = rule.condition as any
      let match = true
      if (c.jobCategory && inputs.jobCategory && !c.jobCategory.includes(inputs.jobCategory)) match = false
      if (c.employment && inputs.employment && !c.employment.includes(inputs.employment)) match = false
      if (c.duration && inputs.duration && !c.duration.includes(inputs.duration)) match = false
      if (c.skillLevel && inputs.skillLevel && !c.skillLevel.includes(inputs.skillLevel)) match = false
      if (c.leadTime && inputs.leadTime && !c.leadTime.includes(inputs.leadTime)) match = false
      if (c.japanExp && inputs.japanExp && !c.japanExp.includes(inputs.japanExp)) match = false
      if (match) score += rule.points
    }
    return { visaType: vt, score }
  }).filter(r => r.score > 0).sort((a, b) => b.score - a.score)
}

function getMatchingLabels(visaType: VisaType, inputs: Inputs, maxLabels: number): string[] {
  const labels: string[] = []
  for (const rule of RULE_LABELS) {
    if (rule.visaType !== visaType) continue
    const c = rule.condition as Record<string, string[]>
    let match = true
    if (c.jobCategory && inputs.jobCategory && !c.jobCategory.includes(inputs.jobCategory)) match = false
    if (c.employment && inputs.employment && !c.employment.includes(inputs.employment)) match = false
    if (c.duration && inputs.duration && !c.duration.includes(inputs.duration)) match = false
    if (c.skillLevel && inputs.skillLevel && !c.skillLevel.includes(inputs.skillLevel)) match = false
    if (c.leadTime && inputs.leadTime && !c.leadTime.includes(inputs.leadTime)) match = false
    if (c.japanExp && inputs.japanExp && !c.japanExp.includes(inputs.japanExp)) match = false
    if (match) labels.push(rule.label)
    if (labels.length >= maxLabels) break
  }
  return labels
}

function getRecommendationText(visaType: VisaType, inputs: Inputs): string {
  let bestMatch = ''
  let bestCount = -1
  for (const tmpl of RECOMMENDATION_TEMPLATES) {
    if (tmpl.visaType !== visaType) continue
    const entries = Object.entries(tmpl.conditions)
    let allMatch = true
    for (const [key, val] of entries) {
      const inputVal = inputs[key as keyof Inputs]
      if (inputVal !== val) { allMatch = false; break }
    }
    if (allMatch && entries.length > bestCount) {
      bestCount = entries.length
      bestMatch = tmpl.text
    }
  }
  return bestMatch || DEFAULT_RECOMMENDATION_TEXT
}

function parseDurationMonths(duration: string): number {
  if (!duration || duration === '—') return 0
  const mm = duration.match(/(\d+)〜(\d+)ヶ月/)
  if (mm) return parseInt(mm[1])
  const ms = duration.match(/(\d+)ヶ月/)
  if (ms) return parseInt(ms[1])
  const wm = duration.match(/(\d+)〜(\d+)週/)
  if (wm) return parseInt(wm[1]) / 4
  const ws = duration.match(/〜?(\d+)週/)
  if (ws) return parseInt(ws[1]) / 4
  return 0
}

function calcCost(visaType: VisaType, headcount: number, nationality: string, months = 36) {
  const base = COST_MASTER[visaType]
  const f = NATIONALITY_FACTOR[nationality] ?? 1.0
  const lMin = base.lump.reduce((s, i) => s + i.min * f, 0)
  const lMax = base.lump.reduce((s, i) => s + i.max * f, 0)
  const mMin = base.monthly.reduce((s, i) => s + i.min, 0)
  const mMax = base.monthly.reduce((s, i) => s + i.max, 0)
  return {
    lumpMin: Math.round(lMin * headcount), lumpMax: Math.round(lMax * headcount),
    monthlyMin: Math.round(mMin * headcount), monthlyMax: Math.round(mMax * headcount),
    totalMin: Math.round((lMin + mMin * months) * headcount), totalMax: Math.round((lMax + mMax * months) * headcount),
  }
}

function calcTCO(params: {
  recruitCost: number
  monthlyRunning: number
  annualSalary: number
  turnoverRate: number
  months: number
  headcount: number
}) {
  const dailyGrossProfit = params.annualSalary / 12 / 20
  const vacancyDays = 45
  const expectedTurnovers = (params.turnoverRate * params.months / 12) * params.headcount
  const totalRecruitCost = params.recruitCost * params.headcount + params.recruitCost * expectedTurnovers
  const vacancyLoss = dailyGrossProfit * vacancyDays * expectedTurnovers
  const ojtCost = (params.annualSalary / 12) * 0.3 * 1.0 * expectedTurnovers
  const runningCost = params.monthlyRunning * params.months * params.headcount
  return {
    recruitCost: totalRecruitCost,
    vacancyLoss,
    ojtCost,
    runningCost,
    total: totalRecruitCost + vacancyLoss + ojtCost + runningCost,
  }
}

const NB = '#1a2f5e'
const GOLD = '#c9a84c'
const GOAL_COLOR = '#10b981'

function Card({ children, style = {} }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: 'white', borderRadius: 16, padding: 24, boxShadow: '0 1px 12px rgba(0,0,0,0.07)', marginBottom: 14, ...style }}>{children}</div>
}

function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div style={{ display: 'flex', gap: 5, marginBottom: 16 }}>
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} style={{ height: 4, flex: 1, borderRadius: 2, background: i < step ? NB : '#e2e8f0', transition: 'background 0.3s' }} />
      ))}
    </div>
  )
}

function Opt({ label, sub, icon, selected, onClick }: { label: string; sub?: string; icon?: string; selected: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} style={{ border: `2px solid ${selected ? NB : '#e2e8f0'}`, background: selected ? '#eef2f8' : 'white', borderRadius: 10, padding: '12px 14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {icon && <span style={{ fontSize: 18 }}>{icon}</span>}
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 600, color: selected ? NB : '#1e293b', fontSize: 16 }}>{label}</div>
          {sub && <div style={{ fontSize: 13, color: '#94a3b8', marginTop: 2 }}>{sub}</div>}
        </div>
        {selected && <span style={{ color: NB, fontWeight: 700, fontSize: 16 }}>&#10003;</span>}
      </div>
    </button>
  )
}

function Btn({ children, onClick, disabled, variant = 'primary' }: { children: React.ReactNode; onClick?: () => void; disabled?: boolean; variant?: 'primary' | 'secondary' | 'gold' }) {
  const styles: Record<string, React.CSSProperties> = {
    primary: { background: disabled ? '#cbd5e1' : NB, color: 'white' },
    secondary: { background: '#e2e8f0', color: NB },
    gold: { background: GOLD, color: 'white' },
  }
  return <button onClick={onClick} disabled={disabled} style={{ ...styles[variant], border: 'none', borderRadius: 10, padding: '13px 24px', fontWeight: 700, fontSize: 16, cursor: disabled ? 'not-allowed' : 'pointer', transition: 'all 0.15s' }}>{children}</button>
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return <div style={{ fontSize: 13, fontWeight: 700, color: '#94a3b8', letterSpacing: 1, marginBottom: 8, marginTop: 16, textTransform: 'uppercase' }}>{children}</div>
}

function Timeline({ steps }: { steps: { step: string; duration: string }[] }) {
  if (steps.length === 0) return null
  return (
    <div style={{ marginTop: 16, padding: '16px 0 8px', borderTop: '1px solid #e2e8f0' }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: '#94a3b8', marginBottom: 14, letterSpacing: 1, textTransform: 'uppercase' }}>受入までの流れ</div>
      <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 4 }}>
        {steps.map((s, i) => {
          const isLast = i === steps.length - 1
          const dotColor = isLast ? GOAL_COLOR : NB
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 72 }}>
                <div style={{ fontSize: 10, color: '#64748b', marginBottom: 6, textAlign: 'center', lineHeight: 1.3, minHeight: 26 }}>{s.step}</div>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                {s.duration && <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 6, textAlign: 'center', whiteSpace: 'nowrap' }}>{s.duration}</div>}
              </div>
              {!isLast && (
                <div style={{ height: 2, background: '#e2e8f0', flex: 1, minWidth: 20, marginTop: 39 }} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function App({ isLoggedIn = false }: { isLoggedIn?: boolean }) {
  const isPC = useIsPC()
  const [step, setStep] = useState(1)
  const [inputs, setInputs] = useState<Inputs>({ jobCategory: null, employment: null, duration: null, skillLevel: null, leadTime: null, japanExp: null, headcount: 1, nationality: 'vietnam' })
  const [selectedVisa, setSelectedVisa] = useState<VisaType | null>(null)
  const [expandedCards, setExpandedCards] = useState<Record<string, boolean>>({})
  const REQUIRE_AUTH_FOR_STEP4 = false
  const [showAuthModal, setShowAuthModal] = useState(false)
  const set = (k: keyof Inputs) => (v: any) => setInputs(p => ({ ...p, [k]: v }))
  const scored = useMemo(() => calcScores(inputs), [inputs])
  const activeVisa = selectedVisa ?? scored[0]?.visaType ?? null
  const costData = activeVisa ? calcCost(activeVisa, inputs.headcount, inputs.nationality) : null
  const reset = () => { setStep(1); setInputs({ jobCategory: null, employment: null, duration: null, skillLevel: null, leadTime: null, japanExp: null, headcount: 1, nationality: 'vietnam' }); setSelectedVisa(null) }

  const wrap: React.CSSProperties = { fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif", maxWidth: isPC ? 860 : 640, margin: '0 auto', padding: '20px 16px', minHeight: '100vh', background: '#f8fafc', color: '#1e293b' }

  const Header = () => (
    <div style={{ textAlign: 'center', marginBottom: 20 }}>
      <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10 }}>
        <div style={{ width: 36, height: 36, background: NB, borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', color: GOLD, fontWeight: 900, fontSize: 14 }}>JG</div>
        <div>
          <div style={{ fontWeight: 900, color: NB, fontSize: 18, lineHeight: 1.1 }}>外国人採用ナビゲーター</div>
          <div style={{ fontSize: 11, color: '#94a3b8' }}>by J-GLOW</div>
        </div>
      </div>
    </div>
  )

  // STEP 1
  if (step === 1) return (
    <div style={wrap}>
      <Header />
      <Card>
        <ProgressBar step={1} total={4} />
        <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>STEP 1 / 4</div>
        <h2 style={{ fontSize: 24, fontWeight: 800, color: NB, margin: '0 0 16px' }}>どんな仕事をしてもらいたいですか？</h2>
        <div style={{ display: 'grid', gridTemplateColumns: isPC ? '1fr 1fr 1fr 1fr' : '1fr 1fr', gap: 8 }}>
          {([['factory','工場・製造','🏭','製造・加工・組立'], ['construction','建設・土木','🏗️','建設・配管・左官・溶接'], ['agriculture','農業・漁業','🌾','農作業・漁業・畜産'], ['care','介護・福祉','🤝','介護施設・訪問介護・障害者支援'], ['food','飲食・宿泊','🍽️','調理・接客・ホテル清掃'], ['office','事務・通訳','📋','一般事務・翻訳・営業・貿易'], ['it','IT・エンジニア','💻','システム開発・インフラ・設計'], ['logistics','物流・運搬','📦','倉庫作業・ピッキング・配送'], ['service','販売・サービス','🛒','小売販売・美容・クリーニング'], ['other','その他','🔧','上記に当てはまらない']] as [JobCategory,string,string,string][]).map(([v,l,icon,sub]) => (
            <Opt key={v} label={l} sub={sub} icon={icon} selected={inputs.jobCategory === v} onClick={() => set('jobCategory')(v)} />
          ))}
        </div>
        <div style={{ marginTop: 20, display: 'flex', justifyContent: 'flex-end' }}>
          <Btn onClick={() => setStep(2)} disabled={!inputs.jobCategory}>次へ →</Btn>
        </div>
      </Card>
    </div>
  )

  // STEP 2
  if (step === 2) {
    const step2Filled = [inputs.employment, inputs.duration, inputs.skillLevel, inputs.leadTime, inputs.japanExp].filter(Boolean).length
    const step2AllDone = step2Filled === 5
    const step2Remaining = 5 - step2Filled

    const step2Questions: { num: number; label: string; key: keyof Inputs; value: any; grid: string; options: [string, string][] }[] = [
      { num: 1, label: '雇用形態', key: 'employment', value: inputs.employment, grid: '1fr 1fr 1fr', options: [['fulltime', 'フルタイム 正社員'], ['contract', 'フルタイム 契約社員'], ['parttime', 'パート・アルバイト']] },
      { num: 2, label: '何年くらい働いてほしいか', key: 'duration', value: inputs.duration, grid: isPC ? '1fr 1fr 1fr 1fr' : '1fr 1fr', options: [['under1', '1年未満'], ['1to3', '1〜3年'], ['3to5', '3〜5年'], ['longterm', '5年以上（長期定着）']] },
      { num: 3, label: 'スキル・学歴の条件', key: 'skillLevel', value: inputs.skillLevel, grid: isPC ? '1fr 1fr 1fr' : '1fr', options: [['none', '特になし（未経験・学歴不問でOK）'], ['technical', '技能・実務経験がある人がいい'], ['university', '大卒・専門職レベル（ITや事務など）']] },
      { num: 4, label: 'いつ頃から働いてほしいですか？', key: 'leadTime', value: inputs.leadTime, grid: isPC ? '1fr 1fr 1fr' : '1fr', options: [['asap', 'できるだけ早く（1〜3ヶ月以内）'], ['mid', '半年程度で（3〜6ヶ月）'], ['planned', '来年以降でOK（6ヶ月〜1年以上）']] },
      { num: 5, label: '採用したい人の日本経験について', key: 'japanExp', value: inputs.japanExp, grid: isPC ? '1fr 1fr 1fr' : '1fr', options: [['japan_based', 'すでに日本に住んでいる人がいい'], ['japan_ok', '日本経験がなくても問題ない'], ['either', 'どちらでもいい']] },
    ]

    return (
      <div style={wrap}>
        <Header />
        <Card>
          <ProgressBar step={2} total={4} />
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>STEP 2 / 4</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: NB, margin: '0 0 4px' }}>働き方を教えてください</h2>
          <div style={{ fontSize: 14, margin: '0 0 20px', color: step2AllDone ? '#059669' : '#64748b', fontWeight: 600 }}>
            {step2AllDone ? '✅ 5項目すべて選択済み！' : `5項目中 ${step2Filled}項目 選択済み`}
          </div>

          {step2Questions.map(q => {
            const isDone = q.value !== null
            return (
              <div key={q.key} style={{ border: `1px solid ${isDone ? NB : '#e2e8f0'}`, background: isDone ? '#f0f4fa' : 'white', borderRadius: 12, padding: '16px 20px', marginBottom: 12, transition: 'all 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 24, height: 24, borderRadius: '50%', background: isDone ? NB : '#94a3b8', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, flexShrink: 0 }}>{q.num}</div>
                    <div style={{ fontWeight: 700, fontSize: 16, color: '#1e293b' }}>{q.label}</div>
                  </div>
                  <div style={{ fontSize: 13, color: isDone ? '#059669' : '#94a3b8', fontWeight: 600, whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {isDone ? '✅ 選択済み' : '選んでください'}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: q.grid, gap: 8 }}>
                  {q.options.map(([v, l]) => {
                    const optSel = q.value === v
                    return (
                      <button key={v} onClick={() => set(q.key)(v)} style={{ border: `1px solid ${optSel ? NB : '#e2e8f0'}`, background: optSel ? NB : 'white', color: optSel ? 'white' : '#1e293b', borderRadius: 8, padding: '12px 20px', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                        {optSel && <span style={{ fontSize: 14 }}>✓</span>}
                        {l}
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}

          <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'space-between' }}>
            <Btn variant="secondary" onClick={() => setStep(1)}>← 戻る</Btn>
            <Btn onClick={() => setStep(3)} disabled={!step2AllDone}>
              {step2AllDone ? '在留資格を見る →' : `残り${step2Remaining}項目を選んでください`}
            </Btn>
          </div>
        </Card>
      </div>
    )
  }

  // STEP 3
  if (step === 3) {
    const maxScore = scored[0]?.score ?? 1
    return (
      <div style={wrap}>
        <Header />
        <Card>
          <ProgressBar step={3} total={4} />
          <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 4 }}>STEP 3 / 4</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, color: NB, margin: '0 0 4px' }}>おすすめの在留資格</h2>
          <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 16px' }}>入力内容をもとに適合度の高い順に表示しています</p>

          {scored.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px' }}>
              <div style={{ fontSize: 32, marginBottom: 12 }}>🔍</div>
              <div style={{ fontWeight: 700, color: NB, fontSize: 16, marginBottom: 8 }}>この職種・条件では在留資格の特定が難しい場合があります</div>
              <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 20, lineHeight: 1.6 }}>
                選択された条件に適合する在留資格が見つかりませんでした。<br />
                条件を変更するか、専門家にご相談ください。
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <Btn variant="secondary" onClick={() => setStep(2)}>← 条件を変更する</Btn>
                <Btn variant="gold" onClick={() => window.open('https://j-glow.jp', '_blank')}>J-GLOWに相談する</Btn>
              </div>
            </div>
          ) : scored.slice(0, 3).map((r, i) => {
            const visa = VISA_MASTER[r.visaType]
            const pct = Math.round((r.score / maxScore) * 100)
            const isSel = selectedVisa === r.visaType || (!selectedVisa && i === 0)
            const timeStr = inputs.japanExp === 'japan_based' ? visa.timeDomestic : inputs.japanExp === 'japan_ok' ? visa.timeOverseas : `${visa.timeDomestic}〜${visa.timeOverseas}`

            const tlRoute = inputs.japanExp === 'japan_based' ? 'domestic' : 'overseas'
            const tlData = TIMELINE_MASTER[r.visaType]
            let tlSteps = tlData[tlRoute]
            if (tlSteps.length === 0) tlSteps = tlData.overseas

            const reasonLabels = getMatchingLabels(r.visaType, inputs, i === 0 ? 4 : 2)
            const isExpanded = !!expandedCards[r.visaType]

            const MarketBadge = () => {
              if (!inputs.jobCategory || !MARKET_SIZE[r.visaType]?.[inputs.jobCategory]) return null
              const txt = MARKET_SIZE[r.visaType]![inputs.jobCategory]!
              const m = txt.match(/(約[\d.]+万人)/)
              return (
                <div style={{ marginTop: 10 }}>
                  <span style={{ display: 'inline-block', background: '#f1f5f9', borderRadius: 6, padding: '5px 12px', fontSize: 14, color: '#475569' }}>
                    👥 {m ? <>{txt.slice(0, txt.indexOf(m[1]))}<span style={{ fontWeight: 700, color: '#1e293b' }}>{m[1]}</span>{txt.slice(txt.indexOf(m[1]) + m[1].length)}</> : txt}
                  </span>
                </div>
              )
            }

            const InfoColumns = () => isPC ? (
              <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>受入まで</div>
                  <div style={{ fontWeight: 700, fontSize: 22, color: NB }}>{timeStr}</div>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>在留期間</div>
                  <div style={{ fontWeight: 700, fontSize: 22, color: NB }}>{visa.maxStay}</div>
                </div>
                {visa.caution && (
                  <div style={{ flexShrink: 0 }}>
                    <span title={visa.caution} style={{ cursor: 'help', fontSize: 18 }}>⚠️</span>
                  </div>
                )}
              </div>
            ) : (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: visa.caution ? 8 : 0 }}>
                  <div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>受入まで</div>
                    <div style={{ fontWeight: 700, fontSize: 22, color: NB }}>{timeStr}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 13, color: '#94a3b8', marginBottom: 2 }}>在留期間</div>
                    <div style={{ fontWeight: 700, fontSize: 22, color: NB }}>{visa.maxStay}</div>
                  </div>
                </div>
                {visa.caution && (
                  <span title={visa.caution} style={{ cursor: 'help', fontSize: 16 }}>⚠️</span>
                )}
              </div>
            )

            const ReasonTags = () => reasonLabels.length > 0 ? (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                {reasonLabels.map((label, li) => (
                  <span key={li} style={{ background: '#f0fdf4', color: '#166534', borderRadius: 6, padding: '3px 10px', fontSize: 12, fontWeight: 600 }}>{label}</span>
                ))}
              </div>
            ) : null

            return (
              <div key={r.visaType} onClick={() => setSelectedVisa(r.visaType)} style={{ border: `2px solid ${isSel ? NB : '#e2e8f0'}`, borderRadius: 12, padding: 16, marginBottom: 10, cursor: 'pointer', background: isSel ? '#f0f4fa' : 'white', transition: 'all 0.15s' }}>
                {/* Name + Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <div style={{ fontWeight: 700, fontSize: 18, color: NB }}>{visa.label}</div>
                  <div style={{ background: i === 0 ? GOLD : '#f1f5f9', color: i === 0 ? 'white' : '#64748b', borderRadius: 6, padding: '2px 8px', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {i === 0 ? '★ 最もマッチ' : `第${i + 1}候補`}
                  </div>
                </div>

                {/* Fit bar */}
                <div style={{ marginBottom: 12, position: 'relative' }}>
                  <div style={{ position: 'absolute', right: 0, top: -16, fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>{pct}%</div>
                  <div style={{ background: '#e2e8f0', borderRadius: 2, height: 4 }}>
                    <div style={{ background: i === 0 ? NB : '#94a3b8', width: `${pct}%`, height: '100%', borderRadius: 2, transition: 'width 0.6s ease' }} />
                  </div>
                </div>

                {/* Reason tags */}
                <ReasonTags />

                {i === 0 ? (
                  <>
                    <InfoColumns />
                    <MarketBadge />
                    {isSel && <Timeline steps={tlSteps} />}
                    {/* Recommendation text */}
                    <div style={{ marginTop: 14, background: '#f0f4fa', borderRadius: 10, padding: '14px 16px', fontSize: 14, color: '#334155', lineHeight: 1.7 }}>
                      💡 {getRecommendationText(r.visaType, inputs)}
                    </div>
                  </>
                ) : (
                  <>
                    <InfoColumns />
                    {/* Accordion toggle */}
                    <button
                      onClick={(e) => { e.stopPropagation(); setExpandedCards(prev => ({ ...prev, [r.visaType]: !prev[r.visaType] })) }}
                      style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', cursor: 'pointer', padding: '10px 0 4px', fontSize: 13, color: '#64748b', fontWeight: 600 }}
                    >
                      詳細を見る <span style={{ transition: 'transform 0.2s', display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'none' }}>▼</span>
                    </button>
                    {isExpanded && (
                      <div style={{ marginTop: 4 }}>
                        {visa.caution && (
                          <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '8px 12px', fontSize: 13, color: '#c2410c', marginBottom: 10 }}>
                            ⚠️ {visa.caution}
                          </div>
                        )}
                        <MarketBadge />
                        <Timeline steps={tlSteps} />
                      </div>
                    )}
                  </>
                )}
              </div>
            )
          })}
        </Card>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <Btn variant="secondary" onClick={() => setStep(2)}>← 戻る</Btn>
          <Btn onClick={() => { if (REQUIRE_AUTH_FOR_STEP4 && !isLoggedIn) { setShowAuthModal(true) } else { setStep(4) } }}>費用・詳細を見る →</Btn>
        </div>

        {/* 認証ゲートモーダル */}
        {showAuthModal && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 16 }} onClick={() => setShowAuthModal(false)}>
            <div style={{ background: 'white', borderRadius: 16, padding: '32px 28px', maxWidth: 420, width: '100%', boxShadow: '0 8px 32px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>🔒</div>
                <h3 style={{ fontSize: 20, fontWeight: 800, color: NB, margin: '0 0 8px' }}>無料会員登録で詳細レポートを見る</h3>
                <p style={{ fontSize: 14, color: '#64748b', margin: 0, lineHeight: 1.6 }}>費用試算の詳細・比較グラフ・採用計画のアドバイスを確認できます</p>
              </div>
              <div style={{ marginBottom: 24 }}>
                {[
                  ['📊', '在留資格別の詳細な費用内訳'],
                  ['📈', '日本人採用との36ヶ月コスト比較グラフ'],
                  ['📋', '採用・受入計画のアドバイスとタイムライン'],
                ].map(([icon, text], i) => (
                  <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', fontSize: 14, color: '#334155' }}>
                    <span style={{ fontSize: 18 }}>{icon}</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <a href="/register/business" style={{ display: 'block', background: GOLD, color: 'white', border: 'none', borderRadius: 10, padding: '14px 24px', fontWeight: 700, fontSize: 16, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>無料で会員登録する</a>
                <a href="/login" style={{ display: 'block', background: '#f1f5f9', color: NB, border: `1px solid ${NB}`, borderRadius: 10, padding: '12px 24px', fontWeight: 600, fontSize: 14, cursor: 'pointer', textAlign: 'center', textDecoration: 'none' }}>すでにアカウントをお持ちの方</a>
                <button onClick={() => setShowAuthModal(false)} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: 13, cursor: 'pointer', padding: '8px 0', textDecoration: 'underline' }}>閉じる</button>
              </div>
            </div>
          </div>
        )}
      </div>
    )
  }

  // STEP 4
  if (step === 4 && activeVisa && costData) {
    const visa = VISA_MASTER[activeVisa]
    const base = COST_MASTER[activeVisa]
    const f = NATIONALITY_FACTOR[inputs.nationality] ?? 1.0

    // 3年間の管理費合計（ヘッダーKPIカード用）
    const jpTotalFor3y = (() => {
      if (!inputs.jobCategory || !AVG_ANNUAL_SALARY[inputs.jobCategory]) return 0
      const sal = AVG_ANNUAL_SALARY[inputs.jobCategory]!
      const jpRate = JP_TURNOVER_RATE[inputs.jobCategory] ?? 0.22
      const jpNominal = sal * 0.15
      const jpEffective = jpNominal / 0.35
      const vacCost = (sal / 12) * 0.30
      const expTurn = (jpRate * 36 / 12) * inputs.headcount
      return Math.round(jpEffective * inputs.headcount) + Math.round(jpEffective * expTurn) + Math.round(((sal / 12) * 0.3) * expTurn + (sal / 12 / 20) * 45 * expTurn) + Math.round(vacCost * 1.5 * inputs.headcount + vacCost * 1.5 * expTurn)
    })()
    const fgTotalFor3y = (() => {
      const lumpPP = base.lump.reduce((s, i) => s + i.min * f, 0)
      const monthlyPP = base.monthly.reduce((s, i) => s + i.min, 0)
      return Math.round(lumpPP * inputs.headcount + monthlyPP * 36 * inputs.headcount)
    })()

    const CostItem = ({ item, isMontly }: { item: { label: string; min: number; max: number; note?: string }; isMontly: boolean }) => (
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '8px 0', borderBottom: '1px solid #f1f5f9', fontSize: 16 }}>
        <div style={{ flex: 1 }}>
          <div>{item.label}</div>
          {item.note && <div style={{ fontSize: 13, color: '#94a3b8' }}>{item.note}</div>}
        </div>
        <div style={{ fontWeight: 600, color: isMontly ? '#2563eb' : NB, whiteSpace: 'nowrap', marginLeft: 12 }}>
          {isMontly
            ? `${Math.round(item.min * inputs.headcount)}〜${Math.round(item.max * inputs.headcount)}万円/月`
            : `${Math.round(item.min * f * inputs.headcount)}〜${Math.round(item.max * f * inputs.headcount)}万円`}
        </div>
      </div>
    )

    return (
      <div style={wrap}>
        <Header />

        {/* コストサマリー */}
        <div style={{ background: NB, borderRadius: 16, padding: 22, marginBottom: 14, color: 'white' }}>
          <ProgressBar step={4} total={4} />
          <div style={{ fontSize: 13, opacity: 0.7, marginBottom: 4 }}>STEP 4 / 4</div>
          <h2 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 16px', color: 'white' }}>{visa.label}の費用レポート</h2>
          {(() => {
            const monthlySalary = inputs.jobCategory ? Math.round((AVG_ANNUAL_SALARY[inputs.jobCategory] ?? 300) / 12) : 25
            const salary36 = monthlySalary * 36 * inputs.headcount
            const jpMgmt36 = costData.totalMin !== undefined ? (jpTotalFor3y ?? 0) : 0
            const fgMgmt36 = costData.totalMin !== undefined ? (fgTotalFor3y ?? 0) : 0
            const jpGrand = salary36 + jpMgmt36
            const fgGrand = salary36 + fgMgmt36
            const diff36 = jpGrand - fgGrand
            return (
              <>
                {/* カード1: トータルコスト比較 */}
                <div style={{ fontSize: 14, fontWeight: 700, opacity: 0.9, marginBottom: 10 }}>トータルコスト（人件費込み）</div>
                <div style={{ background: 'rgba(255,255,255,0.08)', borderRadius: 12, padding: 16, marginBottom: 10 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: isPC ? '1fr 1fr' : '1fr', gap: 10 }}>
                    <div style={{ background: '#ffffff', borderRadius: 10, padding: '14px 16px', borderLeft: '4px solid #ef4444' }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>日本人採用 3年間トータル</div>
                      <div style={{ fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: '#dc2626' }}>{jpGrand}万円</div>
                    </div>
                    <div style={{ background: '#ffffff', borderRadius: 10, padding: '14px 16px', borderLeft: `4px solid ${NB}` }}>
                      <div style={{ fontSize: 12, color: '#64748b', marginBottom: 4 }}>外国人採用 3年間トータル</div>
                      <div style={{ fontWeight: 800, fontSize: 24, lineHeight: 1.2, color: NB }}>{fgGrand}万円</div>
                    </div>
                  </div>
                </div>
                {diff36 > 0 && (
                  <div style={{ textAlign: 'center', padding: '10px 0 12px' }}>
                    <span style={{ fontSize: 22, fontWeight: 900, color: GOLD }}>外国人採用の方が 約{diff36}万円 お得</span>
                  </div>
                )}
                {/* カード2: 内訳の前提 */}
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: 10, padding: '10px 14px' }}>
                  <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>うち人件費（想定）: 約{monthlySalary}万円/月</div>
                  <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)' }}>※日本人・外国人ともに同水準で計算</div>
                </div>
              </>
            )
          })()}
        </div>

        {/* 条件調整 */}
        <Card>
          <h3 style={{ fontWeight: 700, color: NB, margin: '0 0 14px', fontSize: 16 }}>条件を調整して再計算</h3>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>採用人数</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <button onClick={() => set('headcount')(Math.max(1, inputs.headcount - 1))} style={{ width: 30, height: 30, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', background: 'white', fontWeight: 700, fontSize: 16 }}>−</button>
              <span style={{ fontWeight: 700, fontSize: 20, minWidth: 48, textAlign: 'center' }}>{inputs.headcount}<span style={{ fontSize: 13, fontWeight: 400 }}>人</span></span>
              <button onClick={() => set('headcount')(Math.min(30, inputs.headcount + 1))} style={{ width: 30, height: 30, border: '1px solid #e2e8f0', borderRadius: 6, cursor: 'pointer', background: 'white', fontWeight: 700, fontSize: 16 }}>＋</button>
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, color: '#64748b', marginBottom: 6 }}>国籍（費用に影響）</div>
            <div style={{ display: 'grid', gridTemplateColumns: isPC ? 'repeat(4, 1fr)' : 'repeat(2, 1fr)', gap: 8 }}>
              {NATIONALITY_OPTIONS.map(opt => {
                const sel = inputs.nationality === opt.value
                return (
                  <button key={opt.value} onClick={() => set('nationality')(opt.value)} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2, padding: '8px 6px', height: 80, border: `1.5px solid ${sel ? NB : '#e2e8f0'}`, borderRadius: 8, background: sel ? NB : 'white', color: sel ? 'white' : '#1e293b', cursor: 'pointer', transition: 'all 0.15s', width: '100%' }}>
                    <div style={{ fontSize: 32, lineHeight: 1 }}>{opt.flag}</div>
                    <div style={{ fontSize: 11, color: sel ? 'rgba(255,255,255,0.6)' : '#94a3b8', lineHeight: 1 }}>{opt.code}</div>
                    <div style={{ fontSize: 13, fontWeight: sel ? 700 : 600 }}>{opt.label}</div>
                  </button>
                )
              })}
            </div>
          </div>
        </Card>

        {/* 採用・管理にかかる費用の内訳 */}
        <Card>
          <h3 style={{ fontWeight: 700, color: NB, margin: '0 0 14px', fontSize: 16 }}>採用・管理にかかる費用の内訳（人件費別途）（{inputs.headcount}人・{NATIONALITY_LABELS[inputs.nationality]}）</h3>
          {/* 参考：想定月額給与 */}
          {(() => {
            const monthlySalary = inputs.jobCategory ? Math.round((AVG_ANNUAL_SALARY[inputs.jobCategory] ?? 300) / 12) : 25
            return (
              <div style={{ background: '#f1f5f9', borderRadius: 8, padding: '10px 14px', marginBottom: 16, borderLeft: '3px solid #94a3b8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#94a3b8' }}>参考：想定月額給与</span>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#94a3b8' }}>約{monthlySalary}万円/月</span>
                </div>
                <div style={{ fontSize: 11, color: '#b0b8c4', lineHeight: 1.5 }}>（トータル計算に含む）</div>
              </div>
            )
          })()}
          <div style={{ fontSize: 12, color: '#64748b', marginBottom: 10, fontWeight: 600 }}>以下が追加でかかる費用：</div>
          {isPC ? (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              <div>
                {base.lump.length > 0 && (
                  <>
                    <SectionLabel>一時費用</SectionLabel>
                    {base.lump.map((item, i) => <CostItem key={i} item={item} isMontly={false} />)}
                  </>
                )}
              </div>
              <div>
                {base.monthly.length > 0 && (
                  <>
                    <SectionLabel>月次費用</SectionLabel>
                    {base.monthly.map((item, i) => <CostItem key={i} item={item} isMontly={true} />)}
                  </>
                )}
              </div>
            </div>
          ) : (
            <>
              {base.lump.length > 0 && (
                <>
                  <SectionLabel>一時費用</SectionLabel>
                  {base.lump.map((item, i) => <CostItem key={i} item={item} isMontly={false} />)}
                </>
              )}
              {base.monthly.length > 0 && (
                <>
                  <SectionLabel>月次費用</SectionLabel>
                  {base.monthly.map((item, i) => <CostItem key={i} item={item} isMontly={true} />)}
                </>
              )}
            </>
          )}
        </Card>

        {/* 採用・受入計画の検討ポイント */}
        <Card style={{ borderLeft: `4px solid ${NB}` }}>
          <h3 style={{ fontWeight: 800, color: NB, margin: '0 0 14px', fontSize: 18 }}>{'📋'} 採用・受入計画で検討すべきこと</h3>
          {PLANNING_POINTS[activeVisa].map((point, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 10, fontSize: 15, color: '#334155', lineHeight: 1.6 }}>
              <span style={{ color: NB, fontWeight: 700, flexShrink: 0, marginTop: 2 }}>{i + 1}.</span>
              <span>{point}</span>
            </div>
          ))}
        </Card>

        {/* 受入タイムラインの逆算 */}
        {(() => {
          const tlRoute = inputs.japanExp === 'japan_based' ? 'domestic' : 'overseas'
          let tlSteps = TIMELINE_MASTER[activeVisa][tlRoute]
          if (tlSteps.length === 0) tlSteps = TIMELINE_MASTER[activeVisa].overseas
          if (tlSteps.length === 0) return null

          const offsetDate = new Date()
          offsetDate.setDate(offsetDate.getDate() + 20)
          const startYear = offsetDate.getFullYear()
          const startMonth = offsetDate.getMonth() // 0-indexed
          let cumMonths = 0
          const dateSteps = tlSteps.map(s => {
            const startDate = new Date(startYear, startMonth + Math.round(cumMonths))
            const months = parseDurationMonths(s.duration)
            cumMonths += months
            return { step: s.step, duration: s.duration, months, startDate }
          })
          const arrivalDate = new Date(startYear, startMonth + Math.round(cumMonths))
          const arrivalLabel = `${arrivalDate.getFullYear()}年${arrivalDate.getMonth() + 1}月`

          return (
            <Card>
              <h3 style={{ fontWeight: 800, color: NB, margin: '0 0 6px', fontSize: 18 }}>{'📅'} 今から動くと、いつから働いてもらえるか</h3>
              <p style={{ fontSize: 13, color: '#94a3b8', margin: '0 0 20px' }}>{startYear}年{startMonth + 1}月以降に動き始めた場合のスケジュール目安</p>

              <div style={{ display: 'flex', alignItems: 'flex-start', overflowX: 'auto', paddingBottom: 8, marginBottom: 16 }}>
                {dateSteps.map((s, i) => {
                  const isLast = i === dateSteps.length - 1
                  const dotColor = isLast ? GOAL_COLOR : NB
                  const dateLabel = `${s.startDate.getFullYear()}/${s.startDate.getMonth() + 1}月〜`
                  return (
                    <div key={i} style={{ display: 'flex', alignItems: 'flex-start', flexShrink: 0 }}>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 90 }}>
                        <div style={{ fontSize: 10, color: '#64748b', marginBottom: 4, textAlign: 'center', lineHeight: 1.3, minHeight: 26 }}>{s.step}</div>
                        <div style={{ width: 10, height: 10, borderRadius: '50%', background: dotColor, flexShrink: 0 }} />
                        {s.duration && <div style={{ fontSize: 9, color: '#94a3b8', marginTop: 4, textAlign: 'center', whiteSpace: 'nowrap' }}>{s.duration}</div>}
                        <div style={{ fontSize: 10, color: NB, fontWeight: 600, marginTop: 2, textAlign: 'center', whiteSpace: 'nowrap' }}>{dateLabel}</div>
                      </div>
                      {!isLast && (
                        <div style={{ height: 2, background: '#e2e8f0', flex: 1, minWidth: 24, marginTop: 39 }} />
                      )}
                    </div>
                  )
                })}
              </div>

              <div style={{ background: '#f0f4fa', borderRadius: 10, padding: '14px 18px', textAlign: 'center' }}>
                <span style={{ fontSize: 14, color: '#64748b' }}>最短で </span>
                <span style={{ fontSize: 20, fontWeight: 800, color: NB }}>{arrivalLabel}頃</span>
                <span style={{ fontSize: 14, color: '#64748b' }}> から就労可能</span>
              </div>
            </Card>
          )
        })()}

        {/* 労働力確保にかかる3年間の実質コスト比較 */}
        {inputs.jobCategory && AVG_ANNUAL_SALARY[inputs.jobCategory] && activeVisa && (() => {
          const salary = AVG_ANNUAL_SALARY[inputs.jobCategory]!
          const jpRate = JP_TURNOVER_RATE[inputs.jobCategory] ?? 0.22
          const fgRates = FOREIGN_TURNOVER_RATE[activeVisa]
          const f = NATIONALITY_FACTOR[inputs.nationality] ?? 1.0
          const baseCost = COST_MASTER[activeVisa]
          const months = 36

          // --- 機会損失・採用苦戦シナリオ係数 ---
          const VACANCY_COST_RATE = 0.30
          const JP_HIRE_SUCCESS_RATE = 0.35

          // --- 日本人側の36ヶ月コスト計算 ---
          const jpNominalRecruitPP = salary * 0.15
          const jpEffectiveRecruitPP = jpNominalRecruitPP / JP_HIRE_SUCCESS_RATE
          const vacancyCostPerMonth = (salary / 12) * VACANCY_COST_RATE
          const expectedJpTurnovers = (jpRate * months / 12) * inputs.headcount
          const avgVacancyMonths = 1.5

          const jpRecruitAd = Math.round(jpEffectiveRecruitPP * inputs.headcount)
          const jpReRecruit = Math.round(jpEffectiveRecruitPP * expectedJpTurnovers)
          const jpTurnoverLoss = Math.round(((salary / 12) * 0.3 * 1.0) * expectedJpTurnovers + (salary / 12 / 20) * 45 * expectedJpTurnovers)
          const jpVacancyLoss = Math.round(vacancyCostPerMonth * avgVacancyMonths * inputs.headcount + vacancyCostPerMonth * avgVacancyMonths * expectedJpTurnovers)
          const jpTotal = jpRecruitAd + jpReRecruit + jpTurnoverLoss + jpVacancyLoss

          // --- 外国人側の36ヶ月コスト計算（minベース） ---
          const fgLumpMinPP = baseCost.lump.reduce((s, i) => s + i.min * f, 0)
          const fgMonthlyMinPP = baseCost.monthly.reduce((s, i) => s + i.min, 0)
          const fgInitial = Math.round(fgLumpMinPP * inputs.headcount)
          const fgMonthly = Math.round(fgMonthlyMinPP * months * inputs.headcount)
          const fgTotal = fgInitial + fgMonthly

          const diffAmount = jpTotal - fgTotal

          // --- 年次累積データ（0, 12, 24, 36ヶ月）人件費込み ---
          const monthlySalary = salary / 12
          const yearPoints = [0, 12, 24, 36].map(m => {
            const salaryTotal = Math.round(monthlySalary * m * inputs.headcount)
            const jpTurnM = (jpRate * m / 12) * inputs.headcount
            const jpRecM = Math.round(jpEffectiveRecruitPP * inputs.headcount + jpEffectiveRecruitPP * jpTurnM)
            const jpLossM = Math.round(((salary / 12) * 0.3 * 1.0) * jpTurnM + (salary / 12 / 20) * 45 * jpTurnM)
            const jpVacM = Math.round(vacancyCostPerMonth * avgVacancyMonths * inputs.headcount + vacancyCostPerMonth * avgVacancyMonths * jpTurnM)
            const jpMgmt = jpRecM + jpLossM + jpVacM
            const fgMgmt = Math.round(fgLumpMinPP * inputs.headcount + fgMonthlyMinPP * m * inputs.headcount)
            return { month: m, salary: salaryTotal, jpMgmt, fgMgmt, jpTotal: salaryTotal + jpMgmt, fgTotal: salaryTotal + fgMgmt }
          })

          const chartData = yearPoints.map(p => ({
            label: p.month === 0 ? '初期導入時' : `${p.month / 12}年目末`,
            jp: p.jpTotal,
            fg: p.fgTotal,
          }))

          const jpRiskCost = jpReRecruit + jpTurnoverLoss + jpVacancyLoss

          // --- 外国人リスクコスト計算 ---
          const expectedFgTurnovers = (fgRates.min * months / 12) * inputs.headcount
          const fgReRecruit = Math.round(fgLumpMinPP * expectedFgTurnovers)
          const fgTurnoverLoss = Math.round(((salary / 12) * 0.3) * expectedFgTurnovers + (salary / 12 / 20) * 45 * expectedFgTurnovers)
          const fgRiskCost = fgReRecruit + fgTurnoverLoss
          const riskRatio = jpRiskCost > 0 && fgRiskCost > 0 ? Math.round(jpRiskCost / fgRiskCost) : 0

          const diffPerPerson = Math.round(diffAmount / inputs.headcount)

          return (
            <Card style={{ background: '#f8fafc' }}>
              {/* 【第一階層】メッセージ＋KPIパネル */}
              <h3 style={{ fontWeight: 800, color: NB, margin: '0 0 6px', fontSize: 18, lineHeight: 1.5 }}>
                採用難時代の隠れコストを可視化。<br />
                3年間の安定稼働なら外国人採用が有利です
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: isPC ? '1fr 1fr' : '1fr', gap: 12, margin: '16px 0 24px' }}>
                {/* 左パネル: コスト削減額 */}
                <div style={{ background: NB, borderRadius: 12, padding: '16px 18px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.7)', marginBottom: 6 }}>3年間トータルコスト削減額（1名あたり）</div>
                  <div style={{ fontSize: 26, fontWeight: 800, color: 'white' }}>
                    約{diffPerPerson}万円 <span style={{ fontSize: 16, fontWeight: 600 }}>お得</span>
                  </div>
                </div>
                {/* 右パネル: リスクコスト */}
                <div style={{ background: '#fff1f0', borderRadius: 12, padding: '16px 18px', textAlign: 'center', border: '1px solid #fecaca' }}>
                  <div style={{ fontSize: 12, color: '#991b1b', marginBottom: 6 }}>見えないリスクコスト（離職・欠員損失）</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color: '#dc2626' }}>
                    日本人 {jpRiskCost}万円 <span style={{ fontWeight: 600, color: '#64748b' }}>vs</span> 外国人 約{fgRiskCost}万円
                  </div>
                  {riskRatio > 1 && <div style={{ fontSize: 12, color: '#991b1b', marginTop: 4 }}>（日本人の約{riskRatio}分の1）</div>}
                </div>
              </div>

              {/* 【第二階層】折れ線グラフ */}
              <h4 style={{ fontWeight: 800, color: NB, margin: '0 0 4px', fontSize: 16 }}>💴 労働力確保にかかる3年間の実質コスト比較</h4>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 16px' }}>青＝計画通り支出できるコスト　赤＝予期しない損失・リスクコスト</p>

              <div style={{ width: '100%', height: isPC ? 380 : 300, marginBottom: 16 }}>
                <CumulativeChart data={chartData} />
              </div>

              {/* 年次比較テーブル（人件費込み） */}
              <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 10px', lineHeight: 1.7 }}>※ 人件費は日本人・外国人ともに同水準として計算。差額はすべて採用・管理・離職リスクコストの差から生じます。</p>
              <div style={{ overflowX: 'auto', marginBottom: 20 }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: isPC ? 15 : 12, minWidth: 780 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #cbd5e1' }}>
                      <th rowSpan={2} style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 700, color: '#64748b', verticalAlign: 'bottom', borderBottom: '2px solid #e2e8f0' }}>経過</th>
                      <th colSpan={3} style={{ padding: '8px 16px 2px', textAlign: 'center', fontWeight: 700, color: '#EF4444', borderBottom: 'none', fontSize: 15 }}>日本人採用（累計）</th>
                      <th colSpan={3} style={{ padding: '8px 16px 2px', textAlign: 'center', fontWeight: 700, color: '#2563EB', borderBottom: 'none', fontSize: 15 }}>外国人採用（累計）</th>
                      <th rowSpan={2} style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 700, color: '#2563EB', verticalAlign: 'bottom', borderBottom: '2px solid #e2e8f0', fontSize: 15 }}>差額</th>
                    </tr>
                    <tr style={{ borderBottom: '2px solid #e2e8f0' }}>
                      <th style={{ padding: '2px 16px 10px', textAlign: 'right', fontWeight: 700, color: '#ef4444', fontSize: isPC ? 14 : 11 }}>トータル</th>
                      <th style={{ padding: '2px 16px 10px', textAlign: 'right', fontWeight: 500, color: '#94a3b8', fontSize: isPC ? 12 : 10 }}>うち人件費</th>
                      <th style={{ padding: '2px 16px 10px', textAlign: 'right', fontWeight: 500, color: '#94a3b8', fontSize: isPC ? 12 : 10 }}>うち採用管理費</th>
                      <th style={{ padding: '2px 16px 10px', textAlign: 'right', fontWeight: 700, color: '#2563EB', fontSize: isPC ? 14 : 11 }}>トータル</th>
                      <th style={{ padding: '2px 16px 10px', textAlign: 'right', fontWeight: 500, color: '#94a3b8', fontSize: isPC ? 12 : 10 }}>うち人件費</th>
                      <th style={{ padding: '2px 16px 10px', textAlign: 'right', fontWeight: 500, color: '#94a3b8', fontSize: isPC ? 12 : 10 }}>うち採用管理費</th>
                    </tr>
                  </thead>
                  <tbody>
                    {yearPoints.filter(p => p.month > 0).map(p => {
                      const diff = p.jpTotal - p.fgTotal
                      const is3y = p.month === 36
                      const maxDiff = yearPoints.length > 0 ? yearPoints[yearPoints.length - 1].jpTotal - yearPoints[yearPoints.length - 1].fgTotal : 1
                      const barPct = maxDiff > 0 ? Math.round((diff / maxDiff) * 100) : 0
                      return (
                        <tr key={p.month} style={{ borderBottom: '1px solid #e2e8f0', background: is3y ? '#eff6ff' : 'transparent' }}>
                          <td style={{ padding: '14px 16px', fontWeight: is3y ? 700 : 600, color: '#1e293b', fontSize: 15 }}>{p.month / 12}年目末</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontSize: is3y ? 24 : 22, color: '#1e293b' }}>{p.jpTotal}万円</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', color: '#b0b8c4', fontSize: isPC ? 15 : 12, background: 'rgba(241,245,249,0.4)' }}>{p.salary}万円</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', color: '#b0b8c4', fontSize: isPC ? 15 : 12, background: 'rgba(254,226,226,0.15)' }}>{p.jpMgmt}万円</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 800, fontSize: is3y ? 24 : 22, color: '#1e293b' }}>{p.fgTotal}万円</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', color: '#b0b8c4', fontSize: isPC ? 15 : 12, background: 'rgba(241,245,249,0.4)' }}>{p.salary}万円</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', color: '#b0b8c4', fontSize: isPC ? 15 : 12, background: 'rgba(219,234,254,0.15)' }}>{p.fgMgmt}万円</td>
                          <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                            <div style={{ fontWeight: 800, fontSize: is3y ? 22 : 20, color: diff > 0 ? '#2563EB' : '#ef4444', marginBottom: 4 }}>
                              {diff > 0 ? `${diff}万円削減` : `${Math.abs(diff)}万円増加`}
                            </div>
                            {diff > 0 && <div style={{ height: 14, borderRadius: 7, background: '#2563EB', width: `${Math.max(barPct, 10)}%`, marginLeft: 'auto' }} />}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* 総括テキスト */}
              <div style={{ background: NB, borderRadius: 10, padding: '28px 32px', marginBottom: 20, borderLeft: `4px solid ${GOLD}` }}>
                <div style={{ fontWeight: 800, color: 'white', fontSize: 18, marginBottom: 10 }}>総括：外国人採用は「不安な賭け」ではなく「計算できる投資」です</div>
                <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.8, margin: 0 }}>
                  外国人採用における教育や生活支援のコストは、導入期に集中する<span style={{ color: GOLD, fontWeight: 700 }}>「計画可能な初期投資」</span>です。対して、日本人の離職に伴う再採用費や慢性的な欠員による売上損失は、いつ発生するか分からない<span style={{ color: '#fca5a5', fontWeight: 700 }}>「計画外の損失」</span>です。3年間の安定稼働という視点で見ると、外国人採用は初期の手間を補って余りある事業貢献をもたらします。
                </p>
              </div>

              {/* 【第三階層】内訳テーブル（色付き丸） */}
              <div style={{ background: 'white', borderRadius: 10, padding: '14px 16px', marginBottom: 16, border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#64748b', marginBottom: 8 }}>内訳の詳細（{inputs.headcount}人・36ヶ月）</div>
                <div style={{ display: 'grid', gridTemplateColumns: isPC ? '1fr 1fr' : '1fr', gap: isPC ? 24 : 16 }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>日本人採用: {jpTotal}万円</div>
                    {([
                      ['#1a2f5e', '採用・広告費', jpRecruitAd],
                      ['#fb923c', '再採用費', jpReRecruit],
                      ['#f87171', '離職による損失', jpTurnoverLoss],
                      ['#dc2626', '機会損失（欠員期間）', jpVacancyLoss],
                    ] as [string, string, number][]).map(([color, label, val]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#475569', marginBottom: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                          {label}
                        </span>
                        <span style={{ fontWeight: 600 }}>{val}万円</span>
                      </div>
                    ))}
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#475569', marginBottom: 8 }}>外国人採用: {fgTotal}万円</div>
                    {([
                      ['#1a2f5e', '初期費用', fgInitial],
                      ['#93c5fd', '月次支援費（36ヶ月）', fgMonthly],
                    ] as [string, string, number][]).map(([color, label, val]) => (
                      <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: '#475569', marginBottom: 4 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                          <span style={{ width: 10, height: 10, borderRadius: '50%', background: color, display: 'inline-block', flexShrink: 0 }} />
                          {label}
                        </span>
                        <span style={{ fontWeight: 600 }}>{val}万円</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 免責 */}
              <div style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7 }}>
                ※ 日本人採用コストは有効求人倍率が高い職種（製造・建設・介護等）で採用に苦戦しているケースを想定した試算です。機会損失は欠員1人あたり月次人件費の30%相当で計算しています。実態に合わせてJ-GLOWの専門家にご相談ください。
              </div>
            </Card>
          )
        })()}

        {/* 次のアクション CTA */}
        <Card>
          <h3 style={{ fontWeight: 800, color: NB, margin: '0 0 16px', fontSize: 18 }}>{'🚀'} 次に何をすればいいか</h3>
          <div style={{ display: 'grid', gridTemplateColumns: isPC ? '1fr 1fr' : '1fr', gap: 12 }}>
            {[
              { icon: '💬', title: 'J-GLOWに相談する', desc: 'J-GLOWの専門スタッフが最適な採用プランをご提案', href: '/business/contact' },
              { icon: '📞', title: '監理団体・登録支援機関を探す', desc: '地域の受入支援機関に相談して具体的な費用・サポート内容を確認', href: '/business/partners' },
            ].map((item, i) => (
              <a key={i} href={item.href} style={{ display: 'block', border: `1px solid ${NB}`, borderRadius: 12, padding: '18px 16px', textDecoration: 'none', color: 'inherit', transition: 'background 0.15s', cursor: 'pointer' }} onMouseEnter={e => (e.currentTarget.style.background = '#f0f4fa')} onMouseLeave={e => (e.currentTarget.style.background = 'white')}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{item.icon}</div>
                <div style={{ fontWeight: 700, color: NB, fontSize: 15, marginBottom: 6 }}>{item.title}</div>
                <div style={{ fontSize: 13, color: '#64748b', lineHeight: 1.5 }}>{item.desc}</div>
              </a>
            ))}
          </div>
        </Card>

        {/* 主な条件 */}
        <Card>
          <h3 style={{ fontWeight: 700, color: NB, margin: '0 0 12px', fontSize: 16 }}>{visa.label}の主な条件・注意点</h3>
          {visa.conditions.map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, fontSize: 16 }}>
              <span style={{ color: '#10b981', fontWeight: 700, marginTop: 1 }}>&#10003;</span><span>{c}</span>
            </div>
          ))}
          {visa.caution && (
            <div style={{ marginTop: 10, background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#c2410c' }}>
              ⚠️ {visa.caution}
            </div>
          )}
        </Card>

        <p style={{ fontSize: 13, color: '#94a3b8', lineHeight: 1.7, padding: '0 4px', marginBottom: 16 }}>
          ※ 上記はあくまで概算です。実際の費用は監理支援機関・登録支援機関・地域・個別契約によって大きく異なります。詳細はJ-GLOWの専門家相談またはお近くの支援機関にご確認ください。
        </p>

        <div style={{ display: 'flex', gap: 10, justifyContent: 'space-between' }}>
          <Btn variant="secondary" onClick={() => setStep(3)}>← 戻る</Btn>
          <Btn variant="gold" onClick={reset}>最初からやり直す</Btn>
        </div>
      </div>
    )
  }

  return null
}
