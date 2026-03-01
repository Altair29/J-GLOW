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
  ActionStep,
  SendingCountry,
} from './types';
import type { VisaChoice } from './types';
import {
  COUNTRY_FEE_DEFAULTS,
  VISA_LEAD_TIMES,
  QUICK_ESTIMATE_DEFAULTS,
  VISA_TYPE_CONFIG,
  getLeadTimeMonths,
  JP_HIRING_BENCHMARKS,
  INDUSTRY_COST_BENCHMARKS,
  INDUSTRIES_V2,
  IKUSEI_EARLIEST_DATE,
  IKUSEI_START_YEAR,
  IKUSEI_START_MONTH,
} from './constants';

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

  // 社会保険: 健康保険(~10%)+厚生年金(18.3%)+雇用保険(0.6%)+労災(~1%)=約16.5%企業負担
  // パート(週20h以上で適用): やや低めの15.5%
  if (item.item_key === 'social_insurance') {
    const rate = isParttime ? 0.155 : 0.165;
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

export function getEarliestStartMonth(visaType: VisaTypeV2, country?: SendingCountry): string {
  const leadTime = getLeadTimeMonths(visaType, country);
  const now = new Date();
  const earliest = new Date(now.getFullYear(), now.getMonth() + leadTime, 1);
  return `${earliest.getFullYear()}年${earliest.getMonth() + 1}月`;
}

export function isFeasible(startDate: string, visaType: VisaTypeV2, country?: SendingCountry): boolean {
  const months = getMonthsUntilStart(startDate);
  return months >= getLeadTimeMonths(visaType, country);
}

// ========================================
// 診断ロジック
// ========================================

export function diagnoseInputs(inputs: AllInputs, breakdowns?: CostBreakdown[]): DiagnosisItem[] {
  const items: DiagnosisItem[] = [];
  const { step1, step2 } = inputs;
  const country = step2.sendingCountry;

  // 1. 育成就労が間に合わない
  if (
    (step2.visaChoice === 'ikusei' || step2.visaChoice === 'both') &&
    !isFeasible(step2.startDate, 'ikusei', country)
  ) {
    const earliest = getEarliestStartMonth('ikusei', country);
    items.push({
      type: 'urgent',
      title: '育成就労が希望時期に間に合いません',
      description: `育成就労には${getLeadTimeMonths('ikusei', country)}ヶ月必要です。最短で${earliest}就労開始が可能です。特定技能1号（国内切替・最短3ヶ月）との併用を検討してください。`,
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

  // ---- v2追加 診断パターン ----

  // 7. 業種×ビザのミスマッチ
  const industryDef = INDUSTRIES_V2.find((i) => i.id === step1.industry);
  if (industryDef && step2.visaChoice !== 'compare') {
    const visaKey = step2.visaChoice === 'tokutei' ? 'tokutei1_kaigai' : step2.visaChoice;
    if (visaKey !== 'both' && !industryDef.visaTypes.includes(visaKey as any)) {
      items.push({
        type: 'warning',
        title: `${industryDef.label}では${VISA_TYPE_CONFIG[visaKey as keyof typeof VISA_TYPE_CONFIG]?.label ?? visaKey}の利用が困難です`,
        description: `選択された業種と在留資格の組み合わせは制度上の制約があります。この業種で利用可能なビザ種別をご確認ください。`,
        ctaLabel: 'ビザ種別を変更する',
        ctaHref: '#step2',
      });
    }
    // 介護×技人国の特殊ケース
    if (step1.industry === 'nursing' && step2.visaChoice === 'ginou') {
      items.push({
        type: 'info',
        title: '介護分野の技人国は介護福祉士の国家資格が必要です',
        description: '介護分野で技術・人文知識・国際業務ビザを取得するには介護福祉士の国家資格が必要で、実質的に国内在住者からの採用に限られます。特定技能1号が最も一般的です。',
        ctaLabel: '特定技能1号で試算し直す',
        ctaHref: '#step2',
      });
    }
  }

  // 8. 予算と実費の乖離
  if (step1.initialBudget && breakdowns && breakdowns.length > 0) {
    const calcInitial = Math.round((breakdowns[0].initialTotal.min + breakdowns[0].initialTotal.max) / 2);
    const budgetLimit = step1.initialBudget === 'under50' ? 500000 : step1.initialBudget === '50to150' ? 1500000 : Infinity;
    if (calcInitial > budgetLimit * 1.2) {
      items.push({
        type: 'warning',
        title: '試算結果がご予算を超えています',
        description: `ご予算${step1.initialBudget === 'under50' ? '50万円以内' : '50〜150万円'}に対し、試算では1人あたり約${Math.round(calcInitial / 10000)}万円の初期費用が見込まれます。特定技能1号（国内在住者）への切替で初期費用を30〜50%削減できる可能性があります。`,
        ctaLabel: '国内人材で試算する',
        ctaHref: '#step2',
      });
    }
  }

  // 9. 常勤職員数に対する採用人数比率が高い
  if (step1.fullTimeStaff > 0 && step2.headcount / step1.fullTimeStaff > 0.3) {
    items.push({
      type: 'info',
      title: '外国人比率が高めの採用計画です',
      description: `常勤職員${step1.fullTimeStaff}人に対し${step2.headcount}人の採用は、受入体制（住居・日本語支援・通訳）に十分な準備が必要です。段階的な受入（初年度は少数→翌年追加）も検討してください。`,
      ctaLabel: '受入体制の準備ガイド',
      ctaHref: '/business/hiring-guide',
    });
  }

  // 10. 住居なし×育成就労
  if (inputs.step3.housing === 'none' && (step2.visaChoice === 'ikusei' || step2.visaChoice === 'both')) {
    items.push({
      type: 'warning',
      title: '育成就労では住居確保が原則義務です',
      description: '育成就労制度では、受入企業または監理団体が住居の確保を行うことが原則義務とされています。「住居なし」の場合でも、入居先確保の支援が必要です。',
      ctaLabel: '監理団体に相談する',
      ctaHref: '/business/partners?type=kanri',
    });
  }

  // 11. 5名以上の育成就労→複数ビザ併用提案
  if (
    step2.headcount >= 5 &&
    step2.visaChoice === 'ikusei'
  ) {
    items.push({
      type: 'opportunity',
      title: '育成就労と特定技能の併用戦略が有効です',
      description: `${step2.headcount}名の採用であれば、特定技能1号で先行2名を確保し、育成就労で残りを半年後に受入れる「ハイブリッド戦略」が有効です。人手不足の解消を前倒しできます。`,
      ctaLabel: '比較モードで試算する',
      ctaHref: '#step2',
    });
  }

  // 12. 送出国×業種の相性
  if (step2.sendingCountry === 'myanmar' && ['construction', 'welding'].includes(step1.industry)) {
    items.push({
      type: 'info',
      title: 'ミャンマーからの建設・溶接分野は政情リスクに注意',
      description: 'ミャンマーは政情不安定のため、送出手続きの遅延やビザ発給停止のリスクがあります。ベトナム・インドネシアとの並行検討をおすすめします。',
      ctaLabel: '他の送出国も検討する',
      ctaHref: '#step2',
    });
  }
  if (step2.sendingCountry === 'philippines') {
    items.push({
      type: 'info',
      title: 'フィリピンはPOEA/DMW手続きでリードタイムが長めです',
      description: 'フィリピンからの受入は海外雇用庁(DMW)の手続きが必須で、他国より1〜3ヶ月長くかかる傾向があります。早めの準備開始をおすすめします。',
      ctaLabel: 'スケジュールを確認する',
      ctaHref: '#schedule',
    });
  }

  return items;
}

// ========================================
// アクションプラン生成
// ========================================

export function generateActionPlan(inputs: AllInputs): ActionStep[] {
  const { step2, userType } = inputs;
  const isIkusei = step2.visaChoice === 'ikusei' || step2.visaChoice === 'both';
  const isTokutei = step2.visaChoice === 'tokutei' || step2.visaChoice === 'both';
  const isGinou = step2.visaChoice === 'ginou';

  const steps: ActionStep[] = [];

  // STEP 1: 今月中
  const step1Tasks: ActionStep['tasks'] = [];
  if (userType === 'company') {
    if (isIkusei) {
      step1Tasks.push({ label: '監理団体を2〜3社比較・面談する', ctaHref: '/business/partners?type=kanri', ctaLabel: '監理団体を探す' });
    }
    if (isTokutei) {
      step1Tasks.push({ label: '登録支援機関を検討する（委託 or 自社対応）', ctaHref: '/business/partners?type=support', ctaLabel: '登録支援機関を探す' });
    }
    if (isGinou) {
      step1Tasks.push({ label: '行政書士を選定する', ctaHref: '/business/partners?type=gyosei', ctaLabel: '行政書士を探す' });
    }
    step1Tasks.push({ label: '社内の受入体制を確認する（住居・研修担当者の選定）' });
  } else {
    step1Tasks.push({ label: '提案先企業の状況・ニーズをヒアリングする' });
    step1Tasks.push({ label: 'シミュレーション結果をPDF提案書として共有する' });
  }
  steps.push({ phase: '今月中', tasks: step1Tasks });

  // STEP 2: 1〜2ヶ月目
  const step2Tasks: ActionStep['tasks'] = [];
  if (isIkusei || isTokutei) {
    step2Tasks.push({ label: '送出機関の選定・求人票の作成' });
  }
  step2Tasks.push({ label: '就業規則の外国人対応条項を確認する', ctaHref: '/business/partners?type=sharoshi', ctaLabel: '社労士に相談' });
  if (inputs.step3.housing !== 'none') {
    step2Tasks.push({ label: '社宅・寮の手配を開始する' });
  }
  steps.push({ phase: '1〜2ヶ月目', tasks: step2Tasks });

  // STEP 3: 3〜4ヶ月目
  const step3Tasks: ActionStep['tasks'] = [];
  step3Tasks.push({ label: '面接・選考（オンラインまたは現地）' });
  step3Tasks.push({ label: '在留資格申請の準備・提出' });
  if (isIkusei) {
    step3Tasks.push({ label: '育成就労計画の認定申請' });
  }
  steps.push({ phase: '3〜4ヶ月目', tasks: step3Tasks });

  // STEP 4: 入国〜就労開始
  const step4Tasks: ActionStep['tasks'] = [];
  step4Tasks.push({ label: '住居・備品の最終準備' });
  if (isIkusei) {
    step4Tasks.push({ label: '入国後講習の実施（1〜2ヶ月・就労不可期間）' });
  }
  step4Tasks.push({ label: 'OJT開始・多言語指示書の整備', ctaHref: '/business/existing-users/connect/templates', ctaLabel: '現場指示書ビルダー' });
  step4Tasks.push({ label: '生活オリエンテーション（銀行口座・携帯・ゴミ出し等）' });
  steps.push({ phase: '入国〜就労開始', tasks: step4Tasks });

  return steps;
}

// ========================================
// 業種別ベンチマーク比較
// ========================================

export function getIndustryBenchmarkComparison(
  industry: string,
  calculatedInitial: { min: number; max: number },
  calculatedMonthly: { min: number; max: number },
): { initialDiff: number; monthlyDiff: number; label: string } | null {
  const benchmark = INDUSTRY_COST_BENCHMARKS[industry];
  if (!benchmark) return null;

  const calcInitialMid = (calculatedInitial.min + calculatedInitial.max) / 2;
  const calcMonthlyMid = (calculatedMonthly.min + calculatedMonthly.max) / 2;

  const initialDiff = Math.round(((calcInitialMid - benchmark.initialPerPerson) / benchmark.initialPerPerson) * 100);
  const monthlyDiff = Math.round(((calcMonthlyMid - benchmark.monthlyPerPerson) / benchmark.monthlyPerPerson) * 100);

  let label: string;
  if (initialDiff <= -10) label = '業界平均より低コスト';
  else if (initialDiff <= 10) label = '業界平均並み';
  else label = '業界平均より高コスト';

  return { initialDiff, monthlyDiff, label };
}

// ========================================
// 月候補生成（共通ユーティリティ）
// ========================================

/**
 * 月候補を生成。育成就労の場合は2027年4月以降のみ。
 */
export function generateMonthOptions(monthsAhead = 24, visaChoice?: VisaChoice): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  const needIkuseiFilter = visaChoice === 'ikusei' || visaChoice === 'both';

  for (let i = 0; i <= monthsAhead; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    // 育成就労の場合、2027年4月未満はスキップ
    if (needIkuseiFilter && val < IKUSEI_EARLIEST_DATE) continue;
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    options.push({ value: val, label });
  }
  // 育成就労で範囲内に候補がない場合、2027-04〜を追加
  if (needIkuseiFilter && options.length === 0) {
    for (let i = 0; i < 12; i++) {
      const d = new Date(IKUSEI_START_YEAR, IKUSEI_START_MONTH - 1 + i, 1);
      const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const label = `${d.getFullYear()}年${d.getMonth() + 1}月`;
      options.push({ value: val, label });
    }
  }
  return options;
}

/**
 * 育成就労の場合に startDate が制度施行前（2027-04未満）かどうか
 */
export function isBeforeIkuseiStart(startDate: string): boolean {
  return startDate < IKUSEI_EARLIEST_DATE;
}

/**
 * 受入開始日から逆算して「いつまでに発注（監理団体との契約）が必要か」を算出
 */
export function getOrderDeadline(startDate: string, visaType: VisaTypeV2, country?: SendingCountry): string {
  const leadMonths = getLeadTimeMonths(visaType, country);
  const [y, m] = startDate.split('-').map(Number);
  const deadline = new Date(y, m - 1 - leadMonths, 1);
  return `${deadline.getFullYear()}年${deadline.getMonth() + 1}月`;
}
