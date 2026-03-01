'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { nanoid } from 'nanoid';
import type { SimulatorCostItem, SimulatorOrgPreset, SimulatorSession } from '@/types/database';

// v2: lib から型・定数・計算ロジックをインポート
import type {
  SimulatorUserType,
  SimulatorMode,
  ShellPhase,
  AllInputs,
  CostBreakdown,
  QuickInputs,
  Step0Data,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  VisaChoice,
  TargetChoice,
  HousingChoice,
  TrainingChoice,
  SupportChoice,
  SendingCountry,
} from '../lib/types';
import {
  INDUSTRIES,
  COUNTRY_FEE_DEFAULTS,
  defaultStep0,
  defaultStep1,
  defaultStep2,
  defaultStep3,
} from '../lib/constants';
import {
  calculateCosts,
  calculateQuickEstimate,
  getCapacityLimit,
} from '../lib/calculate';

// コンポーネント
import { StepNavigation } from './StepNavigation';
import { LandingGate } from './LandingGate';
import { Step0TeamSetup } from './Step0TeamSetup';
import { Step1Company } from './Step1Company';
import { Step2Plan } from './Step2Plan';
import { Step3Environment } from './Step3Environment';
import { Step4Organization } from './Step4Organization';
import { QuickMode } from './QuickMode';
import { QuickResultView } from './QuickResultView';
import { ResultView } from './ResultView';

// v1互換: 外部から型をインポートしているコンポーネント用のre-export
export type {
  VisaChoice,
  TargetChoice,
  HousingChoice,
  TrainingChoice,
  SupportChoice,
  SendingCountry,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
  AllInputs,
  CostBreakdown,
};
export { INDUSTRIES, COUNTRY_FEE_DEFAULTS, calculateCosts };

/* ========================================
   Shell コンポーネント v2
   ======================================== */

type Props = {
  costItems: SimulatorCostItem[];
  presets: SimulatorOrgPreset[];
  userId: string | null;
  isLoggedIn: boolean;
  sharedSession: SimulatorSession | null;
};

export function CostSimulatorShell({ costItems, presets: initialPresets, userId, isLoggedIn, sharedSession }: Props) {
  // v2: フェーズベースの状態管理
  const [phase, setPhase] = useState<ShellPhase>(sharedSession ? 'result' : 'landing');
  const [userType, setUserType] = useState<SimulatorUserType>('company');
  const [mode, setMode] = useState<SimulatorMode>('detail');

  // Step状態
  const [step0, setStep0] = useState<Step0Data>(defaultStep0);
  const [step1, setStep1] = useState<Step1Data>(
    sharedSession
      ? { ...defaultStep1, ...(sharedSession.input_params as Record<string, unknown>).step1 as Partial<Step1Data> }
      : defaultStep1,
  );
  const [step2, setStep2] = useState<Step2Data>(
    sharedSession
      ? { ...defaultStep2, ...(sharedSession.input_params as Record<string, unknown>).step2 as Partial<Step2Data> }
      : defaultStep2,
  );
  const [step3, setStep3] = useState<Step3Data>(
    sharedSession
      ? { ...defaultStep3, ...(sharedSession.input_params as Record<string, unknown>).step3 as Partial<Step3Data> }
      : defaultStep3,
  );

  // v1互換: step4 → step0マッピング
  useEffect(() => {
    if (sharedSession) {
      const sp = sharedSession.input_params as Record<string, unknown>;
      if (sp.step4) {
        const s4 = sp.step4 as Record<string, unknown>;
        setStep0({
          orgName: (s4.orgName as string) ?? '',
          staffName: (s4.orgContact as string) ?? '',
          managementFee: (s4.managementFee as number) ?? 0,
          enrollmentFee: (s4.enrollmentFee as number) ?? 0,
          sendingOrgFeeOverride: (s4.sendingOrgFeeOverride as number | null) ?? null,
          brandColor: (s4.brandColor as string) ?? '#1a2f5e',
          logoUrl: (s4.logoUrl as string | null) ?? null,
        });
      }
    }
  }, [sharedSession]);

  // プリセット・共有
  const [presets, setPresets] = useState<SimulatorOrgPreset[]>(initialPresets);
  const [activePreset, setActivePreset] = useState<SimulatorOrgPreset | null>(
    sharedSession?.preset_id
      ? initialPresets.find((p) => p.id === sharedSession.preset_id) ?? null
      : null,
  );
  const [shareUrl, setShareUrl] = useState<string | null>(null);

  // Quick mode inputs
  const [quickInputs, setQuickInputs] = useState<QuickInputs>({
    industry: '',
    visaChoice: 'ikusei',
    headcount: 3,
    startDate: defaultStep2.startDate,
    fullTimeStaff: null,
  });

  const supabase = useMemo(
    () =>
      createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      ),
    [],
  );

  // v2: AllInputs 統合
  const inputs: AllInputs = useMemo(() => ({
    step0,
    step1,
    step2,
    step3,
    userType,
    mode,
  }), [step0, step1, step2, step3, userType, mode]);

  // v1互換: step4相当を生成
  const step4Compat: Step4Data = useMemo(() => ({
    orgName: step0.orgName,
    orgContact: step0.staffName,
    managementFee: step0.managementFee,
    enrollmentFee: step0.enrollmentFee,
    sendingOrgFeeOverride: step0.sendingOrgFeeOverride,
    logoUrl: step0.logoUrl,
    brandColor: step0.brandColor,
  }), [step0]);

  // v1互換: AllInputs (step1-4形式)
  const inputsV1 = useMemo(() => ({
    step1: {
      companyName: step1.companyName,
      industry: step1.industry,
      foreignStatus: step1.foreignStatus,
      fullTimeStaff: step1.fullTimeStaff,
    },
    step2: {
      visaChoice: (step2.visaChoice === 'compare' ? 'both' : step2.visaChoice) as 'ikusei' | 'tokutei' | 'both',
      targetChoice: step2.targetChoice,
      headcount: step2.headcount,
      startDate: step2.startDate,
      sendingCountry: step2.sendingCountry,
      jobCategory: step2.jobCategory,
    },
    step3: {
      housing: step3.housing,
      training: step3.training,
      support: step3.support,
    },
    step4: step4Compat,
  }), [step1, step2, step3, step4Compat]);

  const costBreakdowns = useMemo(
    () => calculateCosts(costItems, inputs, activePreset),
    [costItems, inputs, activePreset],
  );

  const quickBreakdowns = useMemo(
    () => phase === 'quickResult' ? calculateQuickEstimate(quickInputs) : [],
    [quickInputs, phase],
  );

  const capacityLimit = useMemo(
    () => getCapacityLimit(step1.fullTimeStaff),
    [step1.fullTimeStaff],
  );

  const isOrgUser = userType === 'kanri' || userType === 'support';
  const isOverCapacity = step2.visaChoice !== 'tokutei' && step2.headcount > capacityLimit && capacityLimit > 0;
  const isProposalMode = isOrgUser && !!(step0.orgName || step0.staffName);

  // ステップバリデーション
  const canProceedStep0 = step0.managementFee > 0;
  const canProceedStep1 = step1.industry !== '' && step1.fullTimeStaff > 0;
  const canProceedStep2 = step2.headcount > 0 && step2.startDate !== '';
  const canProceedStep3 = true;

  // --- LandingGate ハンドラ ---
  const handleStart = useCallback((ut: SimulatorUserType, m: SimulatorMode) => {
    setUserType(ut);
    setMode(m);
    if (m === 'quick') {
      setPhase('quick');
    } else if (ut === 'kanri' || ut === 'support') {
      setPhase('detail-step0');
    } else {
      setPhase('detail-step1');
    }
  }, []);

  // --- ナビゲーション ---
  const getDetailPhases = useCallback((): ShellPhase[] => {
    if (userType === 'kanri' || userType === 'support') {
      return ['detail-step0', 'detail-step1', 'detail-step2', 'detail-step3', 'result'];
    }
    return ['detail-step1', 'detail-step2', 'detail-step3', 'result'];
  }, [userType]);

  const goNextPhase = useCallback(() => {
    const phases = getDetailPhases();
    const idx = phases.indexOf(phase);
    if (idx < phases.length - 1) setPhase(phases[idx + 1]);
  }, [phase, getDetailPhases]);

  const goPrevPhase = useCallback(() => {
    const phases = getDetailPhases();
    const idx = phases.indexOf(phase);
    if (idx > 0) setPhase(phases[idx - 1]);
    else setPhase('landing');
  }, [phase, getDetailPhases]);

  // 現在のステップ番号（StepNavigation用）
  const currentStepNum = useMemo(() => {
    const phases = getDetailPhases();
    const idx = phases.indexOf(phase);
    return idx >= 0 ? idx + 1 : 0;
  }, [phase, getDetailPhases]);

  const stepLabels = useMemo(() => {
    if (userType === 'kanri') {
      return ['団体情報', '企業情報', '採用計画', '自社環境'];
    }
    if (userType === 'support') {
      return ['機関情報', '企業情報', '採用計画', '自社環境'];
    }
    return ['企業情報', '採用計画', '自社環境'];
  }, [userType]);

  const canProceedArray = useMemo(() => {
    if (userType === 'kanri' || userType === 'support') {
      return [true, canProceedStep0, canProceedStep1, canProceedStep2, canProceedStep3];
    }
    return [true, canProceedStep1, canProceedStep2, canProceedStep3];
  }, [userType, canProceedStep0, canProceedStep1, canProceedStep2, canProceedStep3]);

  const goToStepByNum = useCallback((num: number) => {
    const phases = getDetailPhases();
    if (num >= 1 && num <= phases.length) setPhase(phases[num - 1]);
  }, [getDetailPhases]);

  // --- QuickMode → DetailMode 引き継ぎ ---
  const handleQuickToDetail = useCallback(() => {
    setStep1((prev) => ({ ...prev, industry: quickInputs.industry }));
    setStep2((prev) => ({
      ...prev,
      visaChoice: quickInputs.visaChoice,
      headcount: quickInputs.headcount,
      startDate: quickInputs.startDate,
    }));
    if (quickInputs.fullTimeStaff) {
      setStep1((prev) => ({ ...prev, fullTimeStaff: quickInputs.fullTimeStaff! }));
    }
    setMode('detail');
    setPhase((userType === 'kanri' || userType === 'support') ? 'detail-step0' : 'detail-step1');
  }, [quickInputs, userType]);

  // --- DB操作 ---
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
        input_params: inputsV1,
        result_snapshot: resultSnapshot,
        share_token: token,
        user_type: userType,
        sim_mode: mode,
      });

      const url = `${window.location.origin}/business/cost-simulator?token=${token}`;
      await navigator.clipboard.writeText(url);
      setShareUrl(url);
    } else {
      await navigator.clipboard.writeText(window.location.href);
      setShareUrl(window.location.href);
    }
    setTimeout(() => setShareUrl(null), 3000);
  }, [supabase, userId, inputsV1, costBreakdowns, activePreset, userType, mode]);

  const handleSavePreset = useCallback(
    async (name: string) => {
      if (!userId) return false;
      const { data, error } = await supabase
        .from('simulator_org_presets')
        .insert({
          user_id: userId,
          preset_name: name,
          org_name: step0.orgName || null,
          org_contact: step0.staffName || null,
          management_fee: step0.managementFee,
          enrollment_fee: step0.enrollmentFee,
          logo_url: step0.logoUrl,
          brand_color: step0.brandColor,
          custom_items: activePreset?.custom_items ?? [],
          removed_item_keys: activePreset?.removed_item_keys ?? [],
          user_type: userType,
        })
        .select()
        .single();

      if (!error && data) {
        setPresets((prev) => [data as SimulatorOrgPreset, ...prev]);
        setActivePreset(data as SimulatorOrgPreset);
      }
      return !error;
    },
    [supabase, userId, step0, activePreset, userType],
  );

  const handleLoadPreset = useCallback(
    (preset: SimulatorOrgPreset) => {
      setActivePreset(preset);
      setStep0((prev) => ({
        ...prev,
        orgName: preset.org_name ?? '',
        staffName: preset.org_contact ?? '',
        managementFee: preset.management_fee ?? 0,
        enrollmentFee: preset.enrollment_fee ?? 0,
        logoUrl: preset.logo_url,
        brandColor: preset.brand_color,
      }));
    },
    [],
  );

  const handleDeletePreset = useCallback(
    async (presetId: string) => {
      await supabase.from('simulator_org_presets').delete().eq('id', presetId);
      setPresets((prev) => prev.filter((p) => p.id !== presetId));
      if (activePreset?.id === presetId) setActivePreset(null);
    },
    [supabase, activePreset],
  );

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

  // --- レンダリング ---

  const isDetailStep = phase.startsWith('detail-');
  const totalDetailSteps = stepLabels.length;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Landing Gate */}
      {phase === 'landing' && (
        <LandingGate onStart={handleStart} />
      )}

      {/* Quick Mode */}
      {phase === 'quick' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a2f5e] mb-2">
              クイック試算
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              5つの質問で概算コストを確認できます
            </p>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <QuickMode
              data={quickInputs}
              onChange={setQuickInputs}
              onComplete={() => setPhase('quickResult')}
              onBack={() => setPhase('landing')}
            />
          </div>
        </>
      )}

      {/* Quick Result */}
      {phase === 'quickResult' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a2f5e] mb-2">
              概算結果
            </h1>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <QuickResultView
              inputs={quickInputs}
              breakdowns={quickBreakdowns}
              onDetailMode={handleQuickToDetail}
              onRestart={() => setPhase('landing')}
            />
          </div>
        </>
      )}

      {/* Detail Mode */}
      {isDetailStep && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a2f5e] mb-2">
              採用計画コストシミュレーター
            </h1>
            <p className="text-gray-600 text-sm md:text-base">
              在留資格別の採用コストを試算し、逆算スケジュールを確認できます
            </p>
          </div>

          {currentStepNum <= totalDetailSteps && (
            <StepNavigation
              currentStep={currentStepNum}
              onGoToStep={goToStepByNum}
              canProceed={canProceedArray}
              labels={stepLabels}
            />
          )}

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            {phase === 'detail-step0' && (
              <Step0TeamSetup
                data={step0}
                onChange={setStep0}
                onNext={goNextPhase}
                onBack={goPrevPhase}
                canProceed={canProceedStep0}
                presets={presets}
                onLoadPreset={handleLoadPreset}
                onDeletePreset={handleDeletePreset}
                isLoggedIn={isLoggedIn}
                userType={userType}
              />
            )}
            {phase === 'detail-step1' && (
              <Step1Company
                data={step1}
                onChange={setStep1}
                onNext={goNextPhase}
                onBack={goPrevPhase}
                canProceed={canProceedStep1}
              />
            )}
            {phase === 'detail-step2' && (
              <Step2Plan
                data={step2}
                onChange={(d) => {
                  // student選択時はfulltime固定
                  if (d.visaChoice === 'student' && d.employmentType !== 'fulltime') {
                    setStep2({ ...d, employmentType: 'fulltime' });
                  } else {
                    setStep2(d);
                  }
                }}
                onNext={goNextPhase}
                onBack={goPrevPhase}
                canProceed={canProceedStep2}
                capacityLimit={capacityLimit}
                isOverCapacity={isOverCapacity}
                visaChoice={step2.visaChoice}
              />
            )}
            {phase === 'detail-step3' && (
              <Step3Environment
                data={step3}
                onChange={setStep3}
                onNext={() => setPhase('result')}
                onBack={goPrevPhase}
              />
            )}
          </div>
        </>
      )}

      {/* Result */}
      {phase === 'result' && (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#1a2f5e] mb-2">
              試算結果
            </h1>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 md:p-8">
            <ResultView
              inputs={inputsV1}
              allInputs={inputs}
              breakdowns={costBreakdowns}
              isOverCapacity={isOverCapacity}
              capacityLimit={capacityLimit}
              isProposalMode={isProposalMode}
              onBack={() => setPhase('detail-step3')}
              onShare={handleShare}
              shareUrl={shareUrl}
              onSavePreset={handleSavePreset}
              onRestart={() => setPhase('landing')}
              step4={step4Compat}
              isLoggedIn={isLoggedIn}
            />
          </div>
        </>
      )}

      {/* 免責文言 */}
      {phase !== 'landing' && (
        <p className="text-xs text-gray-400 text-center mt-6">
          ※ 表示金額はあくまでも目安です。実際の費用は監理団体・登録支援機関にご確認ください。
        </p>
      )}
    </div>
  );
}
