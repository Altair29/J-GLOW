'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { nanoid } from 'nanoid';
import type { SimulatorCostItem, SimulatorOrgPreset, SimulatorSession } from '@/types/database';
import { StepNavigation } from './StepNavigation';
import { Step1Company } from './Step1Company';
import { Step2Plan } from './Step2Plan';
import { Step3Environment } from './Step3Environment';
import { Step4Organization } from './Step4Organization';
import { ResultView } from './ResultView';

/* ========================================
   型定義
   ======================================== */

export type VisaChoice = 'ikusei' | 'tokutei' | 'both';
export type TargetChoice = 'kaigai' | 'kokunai' | 'both';
export type HousingChoice = 'full' | 'partial' | 'none';
export type TrainingChoice = 'outsource' | 'inhouse' | 'pre_only';
export type SupportChoice = 'outsource' | 'inhouse';
export type SendingCountry = 'vietnam' | 'indonesia' | 'philippines' | 'myanmar' | 'other';

export type Step1Data = {
  companyName: string;
  industry: string;
  foreignStatus: 'none' | 'ginou' | 'tokutei';
  fullTimeStaff: number;
};

export type Step2Data = {
  visaChoice: VisaChoice;
  targetChoice: TargetChoice;
  headcount: number;
  startDate: string; // YYYY-MM
  sendingCountry: SendingCountry;
  jobCategory: string;
};

export type Step3Data = {
  housing: HousingChoice;
  training: TrainingChoice;
  support: SupportChoice;
};

export type Step4Data = {
  orgName: string;
  orgContact: string;
  managementFee: number;
  enrollmentFee: number;
  sendingOrgFeeOverride: number | null;
  logoUrl: string | null;
  brandColor: string;
};

export type AllInputs = {
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  step4: Step4Data;
};

export type CostBreakdown = {
  visaType: string;
  visaLabel: string;
  initialItems: { key: string; label: string; min: number; max: number }[];
  monthlyItems: { key: string; label: string; min: number; max: number }[];
  riskItems: { key: string; label: string; min: number; max: number }[];
  initialTotal: { min: number; max: number };
  monthlyTotal: { min: number; max: number };
  threeYearTotal: { min: number; max: number };
  riskTotal: { min: number; max: number };
};

/* ========================================
   19業種リスト
   ======================================== */

export const INDUSTRIES = [
  '素形材・産業機械製造業', '電気・電子情報関連産業', '建設',
  '造船・舶用工業', '自動車整備', '航空', '宿泊', '農業', '漁業',
  '飲食料品製造業', '外食業', '介護', 'ビルクリーニング',
  '機械金属加工', '溶接', '工業包装', '印刷', '紡績・繊維製品製造',
  'その他',
];

/* ========================================
   送出国別デフォルト手数料
   ======================================== */

const COUNTRY_FEE_DEFAULTS: Record<SendingCountry, { min: number; max: number }> = {
  vietnam:     { min: 150000, max: 200000 },
  indonesia:   { min: 100000, max: 150000 },
  philippines: { min: 120000, max: 180000 },
  myanmar:     { min: 150000, max: 220000 },
  other:       { min: 100000, max: 200000 },
};

export { COUNTRY_FEE_DEFAULTS };

/* ========================================
   初期値
   ======================================== */

const defaultStep1: Step1Data = {
  companyName: '',
  industry: '',
  foreignStatus: 'none',
  fullTimeStaff: 50,
};

const defaultStep2: Step2Data = {
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
};

const defaultStep3: Step3Data = {
  housing: 'full',
  training: 'outsource',
  support: 'outsource',
};

const defaultStep4: Step4Data = {
  orgName: '',
  orgContact: '',
  managementFee: 0,
  enrollmentFee: 0,
  sendingOrgFeeOverride: null,
  logoUrl: null,
  brandColor: '#1a2f5e',
};

/* ========================================
   コスト計算ロジック
   ======================================== */

function getEffectiveItems(
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

  // カスタム追加項目
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

function filterItems(
  items: SimulatorCostItem[],
  visaType: string,
  category: string,
): SimulatorCostItem[] {
  return items.filter(
    (i) => i.category === category && (i.visa_type === visaType || i.visa_type === 'all'),
  );
}

function resolveAmount(
  item: SimulatorCostItem,
  inputs: AllInputs,
): { min: number; max: number } {
  const { step2, step3, step4 } = inputs;

  // 団体設定項目: ユーザー入力値を使う
  if (item.item_key === 'management_fee') {
    return { min: step4.managementFee, max: step4.managementFee };
  }
  if (item.item_key === 'enrollment_fee') {
    return { min: step4.enrollmentFee, max: step4.enrollmentFee };
  }

  // 社会保険: 給与×15%（業種平均で概算200,000円）
  if (item.item_key === 'social_insurance') {
    const baseSalary = 200000;
    const amount = Math.round(baseSalary * 0.15);
    return { min: amount, max: amount };
  }

  // 送出機関手数料: 国別デフォルト or ユーザー上書き
  if (item.item_key.startsWith('sending_org_fee')) {
    if (step4.sendingOrgFeeOverride !== null) {
      return { min: step4.sendingOrgFeeOverride, max: step4.sendingOrgFeeOverride };
    }
    const countryFee = COUNTRY_FEE_DEFAULTS[step2.sendingCountry];
    return countryFee;
  }

  // 住居: 条件分岐
  if (item.item_key.startsWith('housing_initial') || item.item_key.startsWith('housing_monthly')) {
    if (step3.housing === 'none') return { min: 0, max: 0 };
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
    // 外注時、tokutei_kaigai/kokunai のデフォルト0を上書き
    if (item.amount_min === 0 && item.amount_max === 0) {
      return { min: 10000, max: 30000 };
    }
    return { min: item.amount_min, max: item.amount_max };
  }

  // リスクコスト
  if (item.item_key === 'vacancy_cost') {
    const monthlyWage = 200000;
    const vacancyMonths = 2;
    const amount = monthlyWage * vacancyMonths;
    return { min: amount, max: amount };
  }
  if (item.item_key === 'rehire_cost') {
    return { min: 0, max: 0 }; // 初期費用の50%は後で計算
  }

  return { min: item.amount_min, max: item.amount_max };
}

export function calculateCosts(
  items: SimulatorCostItem[],
  inputs: AllInputs,
  preset: SimulatorOrgPreset | null,
): CostBreakdown[] {
  const effectiveItems = getEffectiveItems(items, preset);
  const { step2 } = inputs;

  const visaTypes: { key: string; label: string }[] = [];

  if (step2.visaChoice === 'ikusei' || step2.visaChoice === 'both') {
    visaTypes.push({ key: 'ikusei', label: '育成就労' });
  }
  if (step2.visaChoice === 'tokutei' || step2.visaChoice === 'both') {
    if (step2.targetChoice === 'kaigai' || step2.targetChoice === 'both') {
      visaTypes.push({ key: 'tokutei_kaigai', label: '特定技能1号（海外）' });
    }
    if (step2.targetChoice === 'kokunai' || step2.targetChoice === 'both') {
      visaTypes.push({ key: 'tokutei_kokunai', label: '特定技能1号（国内）' });
    }
  }

  return visaTypes.map(({ key, label }) => {
    const initialFiltered = filterItems(effectiveItems, key, 'initial');
    const monthlyFiltered = filterItems(effectiveItems, key, 'monthly');
    const riskFiltered = filterItems(effectiveItems, key, 'risk');

    const mapItem = (item: SimulatorCostItem) => {
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

    // リスクコスト: 欠員 + 採用やり直し（初期費用の50% × 離職想定率10%）
    const rehireMin = Math.round(initialTotal.min * 0.5 * Math.ceil(step2.headcount * 0.1));
    const rehireMax = Math.round(initialTotal.max * 0.5 * Math.ceil(step2.headcount * 0.1));
    const riskMapped = riskItems.map((r) => {
      if (r.key === 'rehire_cost') return { ...r, min: rehireMin, max: rehireMax };
      return r;
    });
    const riskTotal = sum(riskMapped);

    const threeYearTotal = {
      min: (initialTotal.min + monthlyTotal.min * 36) * step2.headcount + riskTotal.min,
      max: (initialTotal.max + monthlyTotal.max * 36) * step2.headcount + riskTotal.max,
    };

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
    };
  });
}

/* ========================================
   受入上限チェック
   ======================================== */

function getCapacityLimit(fullTimeStaff: number): number {
  return Math.floor(fullTimeStaff / 20);
}

/* ========================================
   Shell コンポーネント
   ======================================== */

type Props = {
  costItems: SimulatorCostItem[];
  presets: SimulatorOrgPreset[];
  userId: string | null;
  isLoggedIn: boolean;
  sharedSession: SimulatorSession | null;
};

export function CostSimulatorShell({ costItems, presets: initialPresets, userId, isLoggedIn, sharedSession }: Props) {
  const [step, setStep] = useState(sharedSession ? 5 : 1);
  const [step1, setStep1] = useState<Step1Data>(
    sharedSession ? { ...(sharedSession.input_params as Record<string, unknown>).step1 as Step1Data } : defaultStep1,
  );
  const [step2, setStep2] = useState<Step2Data>(
    sharedSession ? { ...(sharedSession.input_params as Record<string, unknown>).step2 as Step2Data } : defaultStep2,
  );
  const [step3, setStep3] = useState<Step3Data>(
    sharedSession ? { ...(sharedSession.input_params as Record<string, unknown>).step3 as Step3Data } : defaultStep3,
  );
  const [step4, setStep4] = useState<Step4Data>(
    sharedSession ? { ...(sharedSession.input_params as Record<string, unknown>).step4 as Step4Data } : defaultStep4,
  );
  const [presets, setPresets] = useState<SimulatorOrgPreset[]>(initialPresets);
  const [activePreset, setActivePreset] = useState<SimulatorOrgPreset | null>(
    sharedSession?.preset_id
      ? initialPresets.find((p) => p.id === sharedSession.preset_id) ?? null
      : null,
  );
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  const inputs: AllInputs = useMemo(() => ({ step1, step2, step3, step4 }), [step1, step2, step3, step4]);

  const costBreakdowns = useMemo(
    () => calculateCosts(costItems, inputs, activePreset),
    [costItems, inputs, activePreset],
  );

  const capacityLimit = useMemo(
    () => getCapacityLimit(step1.fullTimeStaff),
    [step1.fullTimeStaff],
  );

  const isOverCapacity = step2.visaChoice !== 'tokutei' && step2.headcount > capacityLimit && capacityLimit > 0;
  const isProposalMode = !!(step4.orgName || step4.orgContact);

  // ステップバリデーション
  const canProceedStep1 = step1.industry !== '' && step1.fullTimeStaff > 0;
  const canProceedStep2 = step2.headcount > 0 && step2.startDate !== '';
  const canProceedStep3 = true;

  const goToStep = useCallback((s: number) => setStep(s), []);
  const nextStep = useCallback(() => setStep((s) => Math.min(s + 1, 5)), []);
  const prevStep = useCallback(() => setStep((s) => Math.max(s - 1, 1)), []);

  // URL共有（ログインユーザーのみDB保存、ゲストはクリップボードのみ）
  const handleShare = useCallback(async () => {
    if (userId) {
      const token = nanoid(8);
      const resultSnapshot = costBreakdowns.map((b) => ({
        visaType: b.visaType,
        visaLabel: b.visaLabel,
        threeYearTotal: b.threeYearTotal,
        initialTotal: b.initialTotal,
        monthlyTotal: b.monthlyTotal,
      }));

      await supabase.from('simulator_sessions').insert({
        user_id: userId,
        preset_id: activePreset?.id ?? null,
        input_params: inputs,
        result_snapshot: resultSnapshot,
        share_token: token,
      });

      const url = `${window.location.origin}/business/cost-simulator?token=${token}`;
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
    } else {
      // ゲスト: 現在のURLをコピー
      await navigator.clipboard.writeText(window.location.href);
      setShareUrl(window.location.href);
    }
    setTimeout(() => setShareUrl(null), 3000);
  }, [supabase, userId, inputs, costBreakdowns, activePreset]);

  // プリセット保存（ログインユーザーのみ）
  const handleSavePreset = useCallback(
    async (name: string) => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from('simulator_org_presets')
        .insert({
          user_id: userId,
          preset_name: name,
          org_name: step4.orgName || null,
          org_contact: step4.orgContact || null,
          management_fee: step4.managementFee,
          enrollment_fee: step4.enrollmentFee,
          logo_url: step4.logoUrl,
          brand_color: step4.brandColor,
          custom_items: activePreset?.custom_items ?? [],
          removed_item_keys: activePreset?.removed_item_keys ?? [],
        })
        .select()
        .single();

      if (!error && data) {
        setPresets((prev) => [data as SimulatorOrgPreset, ...prev]);
        setActivePreset(data as SimulatorOrgPreset);
      }
      return !error;
    },
    [supabase, userId, step4, activePreset],
  );

  // プリセット読み込み
  const handleLoadPreset = useCallback(
    (preset: SimulatorOrgPreset) => {
      setActivePreset(preset);
      setStep4((prev) => ({
        ...prev,
        orgName: preset.org_name ?? '',
        orgContact: preset.org_contact ?? '',
        managementFee: preset.management_fee ?? 0,
        enrollmentFee: preset.enrollment_fee ?? 0,
        logoUrl: preset.logo_url,
        brandColor: preset.brand_color,
      }));
    },
    [],
  );

  // プリセット削除
  const handleDeletePreset = useCallback(
    async (presetId: string) => {
      await supabase.from('simulator_org_presets').delete().eq('id', presetId);
      setPresets((prev) => prev.filter((p) => p.id !== presetId));
      if (activePreset?.id === presetId) setActivePreset(null);
    },
    [supabase, activePreset],
  );

  // カスタマイズ保存（プリセット更新）
  const handleUpdatePresetCustom = useCallback(
    async (customItems: SimulatorOrgPreset['custom_items'], removedKeys: string[]) => {
      if (!activePreset) return;
      await supabase
        .from('simulator_org_presets')
        .update({
          custom_items: customItems,
          removed_item_keys: removedKeys,
          updated_at: new Date().toISOString(),
        })
        .eq('id', activePreset.id);
      setActivePreset((prev) =>
        prev ? { ...prev, custom_items: customItems, removed_item_keys: removedKeys } : null,
      );
    },
    [supabase, activePreset],
  );

  // 共有セッションから復元した場合、結果画面を表示
  useEffect(() => {
    if (sharedSession) setStep(5);
  }, [sharedSession]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-[#1a2f5e] mb-2">
          採用計画コストシミュレーター
        </h1>
        <p className="text-gray-600 text-sm md:text-base">
          在留資格別の採用コストを試算し、逆算スケジュールを確認できます
        </p>
      </div>

      {/* ステップナビゲーション */}
      {step <= 4 && (
        <StepNavigation
          currentStep={step}
          onGoToStep={goToStep}
          canProceed={[true, canProceedStep1, canProceedStep2, canProceedStep3]}
        />
      )}

      {/* ステップコンテンツ */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
        {step === 1 && (
          <Step1Company
            data={step1}
            onChange={setStep1}
            onNext={nextStep}
            canProceed={canProceedStep1}
          />
        )}
        {step === 2 && (
          <Step2Plan
            data={step2}
            onChange={setStep2}
            onNext={nextStep}
            onBack={prevStep}
            canProceed={canProceedStep2}
            capacityLimit={capacityLimit}
            isOverCapacity={isOverCapacity}
            visaChoice={step2.visaChoice}
          />
        )}
        {step === 3 && (
          <Step3Environment
            data={step3}
            onChange={setStep3}
            onNext={nextStep}
            onBack={prevStep}
          />
        )}
        {step === 4 && (
          <Step4Organization
            data={step4}
            onChange={setStep4}
            onNext={nextStep}
            onBack={prevStep}
            presets={presets}
            onLoadPreset={handleLoadPreset}
            onDeletePreset={handleDeletePreset}
            costItems={costItems}
            activePreset={activePreset}
            onUpdatePresetCustom={handleUpdatePresetCustom}
            isLoggedIn={isLoggedIn}
          />
        )}
        {step === 5 && (
          <ResultView
            inputs={inputs}
            breakdowns={costBreakdowns}
            isOverCapacity={isOverCapacity}
            capacityLimit={capacityLimit}
            isProposalMode={isProposalMode}
            onBack={() => setStep(4)}
            onShare={handleShare}
            shareUrl={shareUrl}
            onSavePreset={handleSavePreset}
            onRestart={() => setStep(1)}
            step4={step4}
            isLoggedIn={isLoggedIn}
          />
        )}
      </div>

      {/* 免責文言 */}
      <p className="text-xs text-gray-400 text-center mt-6">
        ※ 表示金額はあくまでも目安です。実際の費用は監理団体・登録支援機関にご確認ください。
      </p>
    </div>
  );
}
