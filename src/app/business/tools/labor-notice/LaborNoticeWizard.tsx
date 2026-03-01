'use client';

import { useState, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';
import Link from 'next/link';

import type {
  Lang,
  FormData,
  Translations,
  Step1Data,
  Step2Data,
  Step3Data,
  Step4Data,
} from './types';
import {
  DEFAULT_STEP1,
  DEFAULT_STEP2,
  DEFAULT_STEP3,
  DEFAULT_STEP4,
  getDocumentTitle,
} from './types';

import Step1CompanyWorker from './components/Step1CompanyWorker';
import Step2Contract from './components/Step2Contract';
import Step3WorkHours from './components/Step3WorkHours';
import Step4Wages from './components/Step4Wages';
import Step5Review from './components/Step5Review';

import translationsJson from '@/lib/translations/labor-notice.json';

const t = translationsJson as unknown as Translations;

const TOTAL_STEPS = 5;

const STEP_TITLES_JA: Record<number, string> = {
  0: '基本情報',
  1: '契約・業務',
  2: '勤務時間',
  3: '賃金・退職',
  4: '確認・PDF生成',
};

/* ── Validation per step ── */
function validateStep1(data: Step1Data): string[] {
  const errors: string[] = [];
  if (!data.worker_name.trim()) errors.push('worker_name');
  if (!data.company_name.trim()) errors.push('company_name');
  if (!data.company_address.trim()) errors.push('company_address');
  if (!data.employer_name.trim()) errors.push('employer_name');
  return errors;
}

function validateStep2(data: Step2Data): string[] {
  const errors: string[] = [];
  if (data.contract_type === 'fixed' && !data.contract_start) errors.push('contract_start');
  if (!data.tokutei_sector) errors.push('tokutei_sector');
  if (!data.workplace_initial.trim()) errors.push('workplace_initial');
  if (!data.job_description_initial.trim()) errors.push('job_description_initial');
  return errors;
}

function validateStep3(data: Step3Data): string[] {
  const errors: string[] = [];
  const isShift = data.work_hour_type === 'shift';
  if (!isShift) {
    if (!data.work_start) errors.push('work_start');
    if (!data.work_end) errors.push('work_end');
  }
  if (isShift && data.shift_patterns.length === 0) {
    errors.push('shift_patterns');
  }
  if (data.days_off_pattern === 'weekly' && data.days_off_days.length === 0) {
    errors.push('days_off_days');
  }
  if (data.days_off_pattern === 'other' && !data.days_off_other.trim()) {
    errors.push('days_off_other');
  }
  return errors;
}

function validateStep4(data: Step4Data): string[] {
  const errors: string[] = [];
  const salaryNum = Number(data.basic_salary.replace(/,/g, ''));
  if (!data.basic_salary.trim() || isNaN(salaryNum) || salaryNum <= 0) {
    errors.push('basic_salary');
  }
  // 就業規則ありの場合のみ条番号必須
  if (data.work_rules_exist && !data.dismissal_article_from && !data.dismissal_article_number) {
    errors.push('dismissal_article_from');
  }
  return errors;
}

function getStepErrors(step: number, form: FormData): string[] {
  switch (step) {
    case 0: return validateStep1(form.step1);
    case 1: return validateStep2(form.step2);
    case 2: return validateStep3(form.step3);
    case 3: return validateStep4(form.step4);
    default: return [];
  }
}

/* ── Progress Bar ── */
function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex gap-1.5">
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className="h-1.5 rounded-full flex-1 transition-all duration-300"
          style={{
            backgroundColor:
              i < current ? '#1a2f5e' : i === current ? '#c9a84c' : '#e2e8f0',
          }}
        />
      ))}
    </div>
  );
}

/* ── Step Navigation Tabs ── */
function StepTabs({
  current,
  onStepClick,
}: {
  current: number;
  onStepClick: (step: number) => void;
}) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
      {Array.from({ length: TOTAL_STEPS }, (_, i) => {
        const label = STEP_TITLES_JA[i];
        const shortLabel = `STEP ${i + 1}`;
        const isActive = i === current;
        const isDone = i < current;
        const isClickable = isDone;

        return (
          <button
            key={i}
            type="button"
            disabled={!isClickable && !isActive}
            onClick={() => {
              if (isClickable) onStepClick(i);
            }}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs whitespace-nowrap transition shrink-0 ${
              isActive
                ? 'bg-[#1a2f5e] text-white font-bold'
                : isDone
                  ? 'bg-[#1a2f5e]/10 text-[#1a2f5e] cursor-pointer hover:bg-[#1a2f5e]/20'
                  : 'bg-gray-100 text-gray-400 cursor-default'
            }`}
          >
            {isDone && <Check size={12} />}
            <span className="sm:hidden">{shortLabel}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Main Wizard ── */
export default function LaborNoticeWizard() {
  const [lang, setLang] = useState<Lang>('ja');
  const [step, setStep] = useState(0);
  const [showErrors, setShowErrors] = useState(false);
  const [form, setForm] = useState<FormData>(() => ({
    step1: { ...DEFAULT_STEP1, issue_date: new Date().toISOString().slice(0, 10) },
    step2: { ...DEFAULT_STEP2 },
    step3: { ...DEFAULT_STEP3 },
    step4: { ...DEFAULT_STEP4 },
  }));

  const updateStep1 = useCallback(
    (data: Step1Data) => setForm((prev) => ({ ...prev, step1: data })),
    []
  );
  const updateStep2 = useCallback(
    (data: Step2Data) => setForm((prev) => ({ ...prev, step2: data })),
    []
  );
  const updateStep3 = useCallback(
    (data: Step3Data) => setForm((prev) => ({ ...prev, step3: data })),
    []
  );
  const updateStep4 = useCallback(
    (data: Step4Data) => setForm((prev) => ({ ...prev, step4: data })),
    []
  );

  const currentErrors = getStepErrors(step, form);

  const goNext = () => {
    if (step >= TOTAL_STEPS - 1) return;
    const errors = getStepErrors(step, form);
    if (errors.length > 0) {
      setShowErrors(true);
      // Scroll to first error
      const el = document.querySelector('[data-error="true"]');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setShowErrors(false);
    setStep(step + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBack = () => {
    if (step > 0) {
      setShowErrors(false);
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const goToStep = (target: number) => {
    if (target < step) {
      setShowErrors(false);
      setStep(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f8fafc' }}>
      {/* Header */}
      <header className="sticky top-0 z-30 glass-header border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <Link
                href="/business"
                className="text-xs text-gray-400 hover:text-[#1a2f5e] transition"
              >
                ← 企業向けトップ
              </Link>
              <h1 className="text-lg font-bold text-[#1a2f5e] leading-tight">
                {getDocumentTitle(form.step2.visa_type).title.replace('参考様式第１－６号　', '')}
              </h1>
              <p className="text-[11px] text-gray-400 mt-0.5">
                外国人労働者向け・バイリンガル対応
              </p>
            </div>
          </div>
          <ProgressBar current={step} total={TOTAL_STEPS} />
        </div>
      </header>

      {/* Step tabs */}
      <div className="max-w-3xl mx-auto px-4 pt-4">
        <StepTabs current={step} onStepClick={goToStep} />
      </div>

      {/* Step content */}
      <main className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          {/* Step title */}
          <h2 className="text-xl font-bold text-[#1a2f5e] mb-6">
            {STEP_TITLES_JA[step]}
          </h2>

          {/* Validation error banner */}
          {showErrors && currentErrors.length > 0 && (
            <div className="mb-6 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2">
              <AlertCircle size={16} className="text-red-500 mt-0.5 shrink-0" />
              <p className="text-sm text-red-700">
                入力必須項目が未入力です。赤枠の項目をご確認ください。
              </p>
            </div>
          )}

          {/* Step body */}
          {step === 0 && (
            <Step1CompanyWorker
              data={form.step1}
              onChange={updateStep1}
              showErrors={showErrors}
              errors={showErrors ? currentErrors : []}
            />
          )}
          {step === 1 && (
            <Step2Contract
              data={form.step2}
              onChange={updateStep2}
              showErrors={showErrors}
              errors={showErrors ? currentErrors : []}
              step1Data={form.step1}
            />
          )}
          {step === 2 && (
            <Step3WorkHours
              data={form.step3}
              onChange={updateStep3}
              showErrors={showErrors}
              errors={showErrors ? currentErrors : []}
            />
          )}
          {step === 3 && (
            <Step4Wages
              data={form.step4}
              onChange={updateStep4}
              showErrors={showErrors}
              errors={showErrors ? currentErrors : []}
            />
          )}
          {step === 4 && (
            <Step5Review
              data={form}
              lang={lang}
              t={t}
              onLangChange={setLang}
            />
          )}
        </div>
      </main>

      {/* Footer nav */}
      <div className="max-w-3xl mx-auto px-4 pb-8">
        <div className="flex items-center justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-lg border border-gray-200 text-sm text-gray-600 hover:border-gray-300 transition"
            >
              <ArrowLeft size={16} />
              戻る
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS - 1 && (
            <button
              type="button"
              onClick={goNext}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-lg text-sm font-bold text-white transition"
              style={{ background: 'linear-gradient(135deg, #1a2f5e 0%, #2a4a8e 100%)' }}
            >
              次へ
              <ArrowRight size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
