// ========================================
// コストシミュレーター v2 計算ロジック
// ========================================

import type { SimulatorCostItem, SimulatorOrgPreset } from '@/types/database';
import type {
  AllInputs,
  CostBreakdown,
  CostLineItem,
  QuickInputs,
  RiskScenario,
  DiagnosisItem,
  VisaTypeV2,
} from './types';
import { COUNTRY_FEE_DEFAULTS, VISA_LEAD_TIMES, QUICK_ESTIMATE_DEFAULTS, VISA_TYPE_CONFIG } from './constants';

// ========================================
// プリセット適用
// ========================================

export function getEffectiveItems(
  masterItems: SimulatorCostItem[],
  preset: SimulatorOrgPreset | null,
): SimulatorCostItem[] {
  if (!preset) return masterItems;

  const removedKeys = new Set(preset.removed_item_keys);
  const customMap = new Map(preset.custom_items.map((c) => [c.item_key, c]));

  const result: SimulatorCostItem[] = [];

  for (const item of masterItems) {
    if (removedKeys.has(item.item_key)) continue;
    const custom = customMap.get(item.item_key);
    if (custom) {
      result.push({
        ...item,
        label: custom.label,
        amount_min: custom.amount_min,
        amount_max: custom.amount_max,
        is_active: custom.is_active,
        sort_order: custom.sort_order,
      });
      customMap.delete(item.item_key);
    } else {
      result.push(item);
    }
  }

  for (const custom of customMap.values()) {
    if (!custom.is_active) continue;
    result.push({
      id: `custom-${custom.item_key}`,
      category: custom.category,
      visa_type: custom.visa_type,
      item_key: custom.item_key,
      label: custom.label,
      amount_min: custom.amount_min,
      amount_max: custom.amount_max,
      variable_factor: null,
      is_active: true,
      sort_order: custom.sort_order,
      created_at: '',
    });
  }

  return result.filter((i) => i.is_active).sort((a, b) => a.sort_order - b.sort_order);
}

// ========================================
// フィルタリング
// ========================================

export function filterItems(
  items: SimulatorCostItem[],
  visaType: string,
  category: string,
): SimulatorCostItem[] {
  return items.filter(
    (i) => i.category === category && (i.visa_type === visaType || i.visa_type === 'all'),
  );
}

// ========================================
// 金額解決
// ========================================

export function resolveAmount(
  item: SimulatorCostItem,
  inputs: AllInputs,
): { min: number; max: number } {
  const { step0, step2, step3 } = inputs;
  const monthlyWage = step2.monthlyWage ?? 200000;
  const isParttime = step2.employmentType === 'parttime';

  // 監理費: ユーザー入力値
  if (item.item_key === 'management_fee') {
    return { min: step0.managementFee, max: step0.managementFee };
  }
  if (item.item_key === 'enrollment_fee') {
    return { min: step0.enrollmentFee, max: step0.enrollmentFee };
  }

  // 社会保険: 給与×14%(正社員) or 15%(パート)
  if (item.item_key === 'social_insurance') {
    const rate = isParttime ? 0.15 : 0.14;
    const amount = Math.round(monthlyWage * rate);
    return { min: amount, max: amount };
  }

  // 送出機関手数料
  if (item.item_key.startsWith('sending_org_fee')) {
    if (step0.sendingOrgFeeOverride !== null) {
      return { min: step0.sendingOrgFeeOverride, max: step0.sendingOrgFeeOverride };
    }
    return COUNTRY_FEE_DEFAULTS[step2.sendingCountry];
  }

  // 入国後講習給与コスト（育成就労）
  if (item.item_key === 'post_entry_training_wage') {
    const amount = monthlyWage;
    return { min: amount, max: amount };
  }

  // 現地面接渡航費
  if (item.item_key === 'interview_trip') {
    if (step2.interviewTrip === 'none' || !step2.interviewTrip) return { min: 0, max: 0 };
    if (step2.interviewTrip === 'domestic') return { min: 30000, max: 50000 };
    return { min: 100000, max: 200000 }; // overseas
  }

  // 住居
  if (item.item_key.startsWith('housing_initial') || item.item_key.startsWith('housing_monthly')) {
    if (step3.housing === 'none') return { min: 0, max: 0 };
    if (step3.housingMonthlyRent && item.item_key.startsWith('housing_monthly')) {
      return { min: step3.housingMonthlyRent, max: step3.housingMonthlyRent };
    }
    if (step3.housing === 'partial') {
      const mid = Math.round((item.amount_min + item.amount_max) / 2);
      return { min: item.amount_min, max: mid };
    }
    return { min: item.amount_min, max: item.amount_max };
  }

  // 日本語研修
  if (item.item_key.startsWith('jp_training_pre')) {
    if (step3.training === 'inhouse') return { min: 0, max: 0 };
    return { min: item.amount_min, max: item.amount_max };
  }
  if (item.item_key.startsWith('ojt_')) {
    if (step3.training === 'inhouse' || step3.training === 'pre_only') return { min: 0, max: 0 };
    return { min: item.amount_min, max: item.amount_max };
  }

  // 通訳・生活支援
  if (item.item_key.startsWith('support_outsource')) {
    if (step3.support === 'inhouse') return { min: 0, max: 0 };
    if (step3.interpreterStatus === 'existing' || step3.interpreterStatus === 'unnecessary') {
      return { min: 0, max: 0 };
    }
    if (item.amount_min === 0 && item.amount_max === 0) {
      return { min: 10000, max: 30000 };
    }
    return { min: item.amount_min, max: item.amount_max };
  }

  // リスクコスト
  if (item.item_key === 'vacancy_cost') {
    const vacancyMonths = 2;
    const amount = monthlyWage * vacancyMonths;
    return { min: amount, max: amount };
  }
  if (item.item_key === 'rehire_cost') {
    return { min: 0, max: 0 }; // 後で計算
  }

  return { min: item.amount_min, max: item.amount_max };
}

// ========================================
// メインコスト計算
// ========================================

export function calculateCosts(
  items: SimulatorCostItem[],
  inputs: AllInputs,
  preset: SimulatorOrgPreset | null,
): CostBreakdown[] {
  const effectiveItems = getEffectiveItems(items, preset);
  const { step2 } = inputs;
  const planYears = step2.planYears ?? 3;
  const planMonths = planYears * 12;

  const visaTypes: { key: string; label: string }[] = [];

  if (step2.visaChoice === 'ikusei' || step2.visaChoice === 'both' || step2.visaChoice === 'compare') {
    visaTypes.push({ key: 'ikusei', label: '育成就労' });
  }
  if (step2.visaChoice === 'tokutei' || step2.visaChoice === 'both' || step2.visaChoice === 'compare') {
    if (step2.targetChoice === 'kaigai' || step2.targetChoice === 'both') {
      visaTypes.push({ key: 'tokutei1_kaigai', label: '特定技能1号（海外）' });
    }
    if (step2.targetChoice === 'kokunai' || step2.targetChoice === 'both') {
      visaTypes.push({ key: 'tokutei1_kokunai', label: '特定技能1号（国内）' });
    }
  }
  if (step2.visaChoice === 'tokutei2' || step2.visaChoice === 'compare') {
    visaTypes.push({ key: 'tokutei2', label: '特定技能2号' });
  }
  if (step2.visaChoice === 'ginou' || step2.visaChoice === 'compare') {
    visaTypes.push({ key: 'ginou', label: '技術・人文知識・国際業務' });
  }
  if (step2.visaChoice === 'student' || step2.visaChoice === 'compare') {
    visaTypes.push({ key: 'student', label: '留学→就労' });
  }

  // v1互換: tokutei_kaigai / tokutei_kokunai のDBデータも参照
  const mapVisaKey = (dbKey: string): string => {
    if (dbKey === 'tokutei_kaigai') return 'tokutei1_kaigai';
    if (dbKey === 'tokutei_kokunai') return 'tokutei1_kokunai';
    return dbKey;
  };

  return visaTypes.map(({ key, label }) => {
    // v1互換: DB側の旧キー名にもマッチさせる
    const matchVisaType = (itemVisa: string) => {
      const mapped = mapVisaKey(itemVisa);
      return mapped === key || itemVisa === 'all';
    };

    const filterByVisa = (category: string) =>
      effectiveItems.filter((i) => i.category === category && matchVisaType(i.visa_type));

    const initialFiltered = filterByVisa('initial');
    const monthlyFiltered = filterByVisa('monthly');
    const riskFiltered = filterByVisa('risk');

    const mapItem = (item: SimulatorCostItem): CostLineItem => {
      const amt = resolveAmount(item, inputs);
      return { key: item.item_key, label: item.label, min: amt.min, max: amt.max };
    };

    const initialItems = initialFiltered.map(mapItem);
    const monthlyItems = monthlyFiltered.map(mapItem);
    const riskItems = riskFiltered.map(mapItem);

    const sum = (arr: { min: number; max: number }[]) =>
      arr.reduce((acc, v) => ({ min: acc.min + v.min, max: acc.max + v.max }), { min: 0, max: 0 });

    const initialTotal = sum(initialItems);
    const monthlyTotal = sum(monthlyItems);

    // リスクコスト: 欠員 + 採用やり直し
    const rehireMin = Math.round(initialTotal.min * 0.5 * Math.ceil(step2.headcount * 0.1));
    const rehireMax = Math.round(initialTotal.max * 0.5 * Math.ceil(step2.headcount * 0.1));
    const riskMapped = riskItems.map((r) => {
      if (r.key === 'rehire_cost') return { ...r, min: rehireMin, max: rehireMax };
      return r;
    });
    const riskTotal = sum(riskMapped);

    // planYears対応の総コスト
    const threeYearTotal = {
      min: (initialTotal.min + monthlyTotal.min * 36) * step2.headcount + riskTotal.min,
      max: (initialTotal.max + monthlyTotal.max * 36) * step2.headcount + riskTotal.max,
    };

    const planYearsTotal = planYears !== 3 ? {
      min: (initialTotal.min + monthlyTotal.min * planMonths) * step2.headcount + riskTotal.min,
      max: (initialTotal.max + monthlyTotal.max * planMonths) * step2.headcount + riskTotal.max,
    } : undefined;

    return {
      visaType: key,
      visaLabel: label,
      initialItems,
      monthlyItems,
      riskItems: riskMapped,
      initialTotal,
      monthlyTotal,
      threeYearTotal,
      riskTotal,
      planYearsTotal,
    };
  });
}

// ========================================
// Quick概算計算
// ========================================

export function calculateQuickEstimate(inputs: QuickInputs): CostBreakdown[] {
  const { industry, visaChoice, headcount, startDate } = inputs;
  const defaults = QUICK_ESTIMATE_DEFAULTS;

  const visaTypes: { key: string; label: string; multiplier: number }[] = [];

  if (visaChoice === 'ikusei' || visaChoice === 'both' || visaChoice === 'compare') {
    visaTypes.push({ key: 'ikusei', label: '育成就労', multiplier: 1.3 });
  }
  if (visaChoice === 'tokutei' || visaChoice === 'both' || visaChoice === 'compare') {
    visaTypes.push({ key: 'tokutei1_kaigai', label: '特定技能1号（海外）', multiplier: 1.0 });
  }
  if (visaChoice === 'tokutei2' || visaChoice === 'compare') {
    visaTypes.push({ key: 'tokutei2', label: '特定技能2号', multiplier: 0.7 });
  }
  if (visaChoice === 'ginou' || visaChoice === 'compare') {
    visaTypes.push({ key: 'ginou', label: '技術・人文知識・国際業務', multiplier: 0.6 });
  }
  if (visaChoice === 'student' || visaChoice === 'compare') {
    visaTypes.push({ key: 'student', label: '留学→就労', multiplier: 0.4 });
  }

  return visaTypes.map(({ key, label, multiplier }) => {
    const initialTotal = {
      min: Math.round(defaults.initialCost.min * multiplier),
      max: Math.round(defaults.initialCost.max * multiplier),
    };
    const monthlyTotal = {
      min: Math.round(defaults.monthlyCost.min * multiplier),
      max: Math.round(defaults.monthlyCost.max * multiplier),
    };
    const threeYearTotal = {
      min: (initialTotal.min + monthlyTotal.min * 36) * headcount,
      max: (initialTotal.max + monthlyTotal.max * 36) * headcount,
    };

    return {
      visaType: key,
      visaLabel: label,
      initialItems: [{ key: 'estimate_initial', label: '初期費用概算', ...initialTotal }],
      monthlyItems: [{ key: 'estimate_monthly', label: '月次費用概算', ...monthlyTotal }],
      riskItems: [],
      initialTotal,
      monthlyTotal,
      threeYearTotal,
      riskTotal: { min: 0, max: 0 },
    };
  });
}

// ========================================
// リスクコスト計算
// ========================================

export function calcRiskCost(
  headcount: number,
  initialCostPerPerson: { min: number; max: number },
  turnoverRate: number,
): RiskScenario {
  const monthlyWage = 200000;
  const vacancyMonths = 2;
  const lostWorkers = Math.max(1, Math.round(headcount * (turnoverRate / 100)));
  const vacancyCost = lostWorkers * monthlyWage * vacancyMonths;
  const rehireCost = Math.round(lostWorkers * ((initialCostPerPerson.min + initialCostPerPerson.max) / 2) * 0.5);
  const riskTotal = vacancyCost + rehireCost;

  const label = turnoverRate <= 10 ? '楽観' : turnoverRate <= 20 ? '標準' : '悲観';

  return {
    label,
    turnoverRate,
    lostWorkers,
    vacancyCost,
    rehireCost,
    riskTotal,
  };
}

export function calcRiskScenarios(
  headcount: number,
  initialCostPerPerson: { min: number; max: number },
): RiskScenario[] {
  return [
    calcRiskCost(headcount, initialCostPerPerson, 5),
    calcRiskCost(headcount, initialCostPerPerson, 15),
    calcRiskCost(headcount, initialCostPerPerson, 30),
  ];
}

// ========================================
// 受入上限チェック
// ========================================

export function getCapacityLimit(fullTimeStaff: number): number {
  return Math.floor(fullTimeStaff / 20);
}

// ========================================
// リードタイムチェック
// ========================================

export function getMonthsUntilStart(startDate: string): number {
  const [y, m] = startDate.split('-').map(Number);
  const target = new Date(y, m - 1, 1);
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
}

export function getEarliestStartMonth(visaType: VisaTypeV2): string {
  const leadTime = VISA_LEAD_TIMES[visaType].months;
  const now = new Date();
  const earliest = new Date(now.getFullYear(), now.getMonth() + leadTime, 1);
  return `${earliest.getFullYear()}年${earliest.getMonth() + 1}月`;
}

export function isFeasible(startDate: string, visaType: VisaTypeV2): boolean {
  const months = getMonthsUntilStart(startDate);
  return months >= VISA_LEAD_TIMES[visaType].months;
}

// ========================================
// 診断ロジック
// ========================================

export function diagnoseInputs(inputs: AllInputs): DiagnosisItem[] {
  const items: DiagnosisItem[] = [];
  const { step1, step2 } = inputs;

  // 1. 育成就労が間に合わない
  if (
    (step2.visaChoice === 'ikusei' || step2.visaChoice === 'both') &&
    !isFeasible(step2.startDate, 'ikusei')
  ) {
    const earliest = getEarliestStartMonth('ikusei');
    items.push({
      type: 'urgent',
      title: '育成就労が希望時期に間に合いません',
      description: `育成就労には最短9ヶ月必要です。最短で${earliest}就労開始が可能です。特定技能1号（国内切替・最短3ヶ月）との併用を検討してください。`,
      ctaLabel: '特定技能1号について詳しく見る',
      ctaHref: '/business/hiring-guide',
    });
  }

  // 2. 受入上限が少ない
  const limit = getCapacityLimit(step1.fullTimeStaff);
  if (
    (step2.visaChoice === 'ikusei' || step2.visaChoice === 'both') &&
    step2.headcount > limit && limit > 0
  ) {
    items.push({
      type: 'warning',
      title: '育成就労の受入上限を超えています',
      description: `常勤職員${step1.fullTimeStaff}人の場合、育成就労の受入上限は${limit}人です。特定技能（上限なし）と組み合わせた受入戦略をおすすめします。`,
      ctaLabel: 'ビザの組み合わせを比較する',
      ctaHref: '/business/hiring-guide',
    });
  }

  // 3. 過去離職率30%超
  if (step1.pastTurnoverRate === 'high') {
    items.push({
      type: 'warning',
      title: '離職率が高い傾向です',
      description: '過去の離職率30%超の場合、まず定着率改善に取り組むことで、再採用コストを大幅に削減できます。現場指示書ビルダーなどの定着支援ツールをご活用ください。',
      ctaLabel: '現場指示書ビルダーを使う',
      ctaHref: '/business/existing-users/connect/templates',
    });
  }

  // 4. 技人国
  if (step2.visaChoice === 'ginou') {
    items.push({
      type: 'info',
      title: '技術・人文知識・国際業務ビザには行政書士が必要です',
      description: '技人国ビザの在留資格申請は専門知識が必要です。経験豊富な行政書士をパートナー検索から探すことをおすすめします。',
      ctaLabel: '行政書士を探す',
      ctaHref: '/business/partners?type=gyosei',
    });
  }

  // 5. 特定技能2号
  if (step2.visaChoice === 'tokutei2') {
    items.push({
      type: 'opportunity',
      title: '特定技能2号は1号からの移行が前提です',
      description: '特定技能2号は1号で3年以上の経験と試験合格が必要です。まず1号での受入からスタートし、移行計画を立てることをおすすめします。',
      ctaLabel: 'キャリアラダーを確認する',
      ctaHref: '/business/existing-users/ladder',
    });
  }

  // 6. 留学生
  if (step2.visaChoice === 'student') {
    items.push({
      type: 'opportunity',
      title: '留学生の卒業後移行プランを設計しましょう',
      description: '留学生を在学中にアルバイトとして受け入れ、卒業後に特定技能や技人国へ移行する計画を立てると、効率的な人材確保が可能です。',
      ctaLabel: '採用ガイドを見る',
      ctaHref: '/business/hiring-guide',
    });
  }

  return items;
}

// ========================================
// 月候補生成（共通ユーティリティ）
// ========================================

export function generateMonthOptions(monthsAhead = 24): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i <= monthsAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    options.push({ value: val, label });
  }
  return options;
}
