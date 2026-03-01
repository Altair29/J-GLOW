'use client';

import { useState } from 'react';
import { FileDown, ExternalLink, Loader2, CheckCircle } from 'lucide-react';
import type { FormData, Lang, Translations, VisaType } from '../types';
import {
  LANGUAGES,
  VISA_CONFIGS,
  RENEWAL_LIMIT_REASONS,
  WORK_HOUR_TYPE_OPTIONS,
  RAISE_TIMING_OPTIONS,
  BONUS_FREQUENCY_OPTIONS,
  DISMISSAL_SPECIAL_OPTIONS,
  TOKUTEI_SECTORS,
  PAYMENT_METHOD_OPTIONS,
  WAGE_TYPE_OPTIONS,
  TRANSFER_RESTRICTION_OPTIONS,
  getSectorList,
  resolveWorkplaceRange,
  resolveJobRange,
  resolveWorkplaceRangeTx,
  resolveJobRangeTx,
  formatCutoffDay,
  formatPayDay,
  formatJPY,
  getDocumentTitle,
  validateDates,
} from '../types';

interface Props {
  data: FormData;
  lang: Lang;
  t: Translations;
  onLangChange: (lang: Lang) => void;
}

function T({ t, k, lang }: { t: Translations; k: string; lang: Lang }) {
  const text = t[k]?.[lang] ?? t[k]?.ja ?? k;
  const ja = t[k]?.ja ?? '';
  const showJaSub = lang !== 'ja' && ja;
  return (
    <>
      <span>{text}</span>
      {showJaSub && <span className="block text-xs text-gray-400 mt-0.5">{ja}</span>}
    </>
  );
}

function ReviewRow({ label, value }: { label: React.ReactNode; value: React.ReactNode }) {
  return (
    <div className="flex gap-4 py-2 border-b border-gray-100 last:border-b-0">
      <dt className="w-1/3 text-sm text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm text-gray-900 flex-1 whitespace-pre-wrap">{value || '—'}</dd>
    </div>
  );
}

const VISA_TKEY: Record<VisaType, string> = {
  ikusei: 'visa_ikusei',
  tokutei1: 'visa_tokutei1',
  tokutei2: 'visa_tokutei2',
  ginou_jisshu: 'visa_gino',
};

const WAGE_TYPE_TKEY: Record<string, string> = {
  monthly: 'label_monthly',
  daily: 'label_daily',
  hourly: 'label_hourly',
};

function tx(t: Translations, key: string, lang: Lang): string {
  return t[key]?.[lang] ?? t[key]?.ja ?? key;
}

export default function Step5Review({ data, lang, t, onLangChange }: Props) {
  const [pdfGenerating, setPdfGenerating] = useState(false);
  const [pdfGenerated, setPdfGenerated] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handleGeneratePdf = async () => {
    // Final validation — absolute mandatory items (労基法第15条)
    const errors: string[] = [];
    if (!step1.company_name.trim()) errors.push('会社名');
    if (!step1.worker_name.trim()) errors.push('労働者氏名');
    if (!step1.employer_name.trim()) errors.push('使用者氏名');
    if (step2.contract_type === 'fixed' && !step2.contract_start) errors.push('契約開始日');
    if (!step2.workplace_initial.trim()) errors.push('就業場所');
    if (!step2.job_description_initial.trim()) errors.push('業務内容');
    const salaryNum = Number(step4.basic_salary.replace(/,/g, ''));
    if (!step4.basic_salary.trim() || isNaN(salaryNum) || salaryNum <= 0) errors.push('基本給');
    if (!step4.pay_cutoff_day) errors.push('賃金締切日');
    if (!step4.pay_day) errors.push('賃金支払日');
    // 有期契約の場合の追加チェック
    if (step2.contract_type === 'fixed' && step2.renewal_type !== 'no' && step2.renewal_limit_has && !step2.renewal_limit_reason) {
      errors.push('更新上限の理由（2024年4月改正・必須）');
    }
    if (lang === 'ja') errors.push('出力言語（外国語を1つ選択してください）');

    // 日付クロスバリデーション
    const dateErrors = validateDates(step1, step2);
    for (const de of dateErrors) {
      errors.push(de.message);
    }

    setValidationErrors(errors);
    if (errors.length > 0) return;
    setPdfGenerating(true);
    try {
      const [{ pdf }, { default: LaborNoticePDF }, { saveAs }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('../pdf/LaborNoticePDF'),
        import('file-saver'),
      ]);
      const blob = await pdf(
        <LaborNoticePDF form={data} lang={lang} t={t} />
      ).toBlob();
      const workerName = data.step1.worker_name || 'worker';
      const issueDate = data.step1.issue_date || new Date().toISOString().slice(0, 10);
      const docTitle = getDocumentTitle(data.step2.visa_type);
      // Use simplified title for filename (strip form number prefix if present)
      const fileTitle = docTitle.title.includes('雇用条件書') ? '雇用条件書' : '労働条件通知書';
      saveAs(blob, `${fileTitle}_${workerName}_${issueDate}.pdf`);
      setPdfGenerated(true);
    } catch (err) {
      console.error('PDF generation failed:', err);
      alert('PDF生成中にエラーが発生しました。');
    } finally {
      setPdfGenerating(false);
    }
  };

  const { step1, step2, step3, step4 } = data;
  const visaLabel = t[VISA_TKEY[step2.visa_type]]?.[lang] ?? VISA_CONFIGS[step2.visa_type]?.label ?? step2.visa_type;

  const renewalLabel = {
    auto: t.value_renewal_auto?.[lang] ?? '自動更新',
    possible: t.value_renewal_possible?.[lang] ?? '更新する場合があり得る',
    no: t.value_renewal_no?.[lang] ?? '更新なし',
    other: step2.renewal_other_text || (t.value_renewal_other?.[lang] ?? 'その他'),
  }[step2.renewal_type];

  const yesNo = (v: 'yes' | 'no') =>
    v === 'yes' ? (t.label_overtime_yes?.[lang] ?? 'あり') : (t.label_overtime_no?.[lang] ?? 'なし');

  const yen = t.label_yen?.[lang] ?? '円';
  const days = t.label_days?.[lang] ?? '日';

  const workplaceRange = resolveWorkplaceRange(step2.workplace_change_range_type, step2.workplace_change_range);
  const jobRange = resolveJobRange(step2.job_description_change_range_type, step2.job_description_change_range);

  const renewalLimitReasonLabel = step2.renewal_limit_has
    ? (step2.renewal_limit_reason === 'custom'
        ? step2.renewal_limit_reason_text
        : RENEWAL_LIMIT_REASONS.find((r) => r.value === step2.renewal_limit_reason)?.label ?? '')
    : '';

  const cutoffDisplay = formatCutoffDay(step4.pay_cutoff_day, lang);
  const payDayDisplay = formatPayDay(step4.pay_day, step4.payment_month, lang);

  const deductionDisplay = step4.deduction_items.length > 0
    ? step4.deduction_items
        .filter((item) => item.type)
        .map((item) => item.amount ? `${item.type}: ${formatJPY(item.amount)}` : item.type)
        .join('、')
    : (t.label_overtime_yes?.[lang] ?? 'あり');

  // Work hour type label (translated)
  const workHourOpt = WORK_HOUR_TYPE_OPTIONS.find((o) => o.value === step3.work_hour_type);
  const workHourLabel = workHourOpt ? tx(t, workHourOpt.tKey, lang) : step3.work_hour_type;

  // Raise timing label (translated)
  const raiseTimingLabel = step4.pay_raise === 'yes'
    ? (step4.raise_timing === 'other'
        ? step4.raise_timing_other
        : (() => {
            const opt = RAISE_TIMING_OPTIONS.find((o) => o.value === step4.raise_timing);
            return opt ? tx(t, opt.tKey, lang) : '';
          })())
    : '';

  // Bonus frequency label (translated)
  const bonusFreqLabel = step4.bonus === 'yes'
    ? (() => {
        const opt = BONUS_FREQUENCY_OPTIONS.find((o) => o.value === step4.bonus_frequency);
        return opt ? tx(t, opt.tKey, lang) : '';
      })()
    : '';

  // Sector label (translated)
  const sectorOpt = step2.tokutei_sector
    ? getSectorList(step2.visa_type).find((s) => s.value === step2.tokutei_sector) ??
      TOKUTEI_SECTORS.find((s) => s.value === step2.tokutei_sector)
    : null;
  const sectorLabel = sectorOpt ? tx(t, sectorOpt.tKey, lang) : (step2.tokutei_sector || '');

  // Workplace/job range (translated)
  const workplaceRangeTx = resolveWorkplaceRangeTx(step2.workplace_change_range_type, step2.workplace_change_range, t, lang);
  const jobRangeTx = resolveJobRangeTx(step2.job_description_change_range_type, step2.job_description_change_range, t, lang);

  // Payment method (translated)
  const paymentMethodLabel = step4.payment_method === 'bank_transfer'
    ? tx(t, 'value_payment_bank_transfer', lang)
    : tx(t, 'value_payment_cash', lang);

  // Employment type label
  const employmentTypeLabel = step2.employment_type === 'dispatch' ? '派遣雇用' : '直接雇用';

  // Transfer restriction period label (育成就労)
  const transferRestrictionLabel = TRANSFER_RESTRICTION_OPTIONS.find(
    (o) => o.value === step2.transfer_restriction_period
  )?.label ?? `${step2.transfer_restriction_period}年`;

  // Health check display (year+month format)
  const healthCheckHireDisplay = (step4.health_check_hire_year || step4.health_check_hire_month)
    ? [
        step4.health_check_hire_year && `${step4.health_check_hire_year}年`,
        step4.health_check_hire_month && `${step4.health_check_hire_month}月`,
      ].filter(Boolean).join('')
    : '';
  const healthCheckPeriodicDisplay = (step4.health_check_periodic_year || step4.health_check_periodic_month)
    ? [
        step4.health_check_periodic_year && `${step4.health_check_periodic_year}年`,
        step4.health_check_periodic_month && `${step4.health_check_periodic_month}月`,
      ].filter(Boolean).join('')
    : '';

  return (
    <div className="space-y-8">
      {/* Language selector */}
      <div className="mb-6">
        <p className="text-sm font-bold text-[#1a2f5e] mb-3">
          PDFの出力言語を選択してください
        </p>
        <div className="flex flex-wrap gap-2">
          {LANGUAGES.map(({ code, label, flag }) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                onLangChange(code);
                setPdfGenerated(false);
                setValidationErrors([]);
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border-2 text-sm font-medium transition-all ${
                lang === code
                  ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                  : 'border-gray-200 text-gray-600 hover:border-gray-400'
              }`}
            >
              <span>{flag}</span>
              <span>{label}</span>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          ※ 選択した言語でPDFが生成されます。確認プレビューも切り替わります。
        </p>
      </div>

      {/* Disclaimer */}
      <div className="p-4 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
        <T t={t} k="ui_disclaimer" lang={lang} />
      </div>

      {/* STEP 1 review */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-3 pb-2 border-b-2 border-[#c9a84c]">
          <T t={t} k="step1_title" lang={lang} />
        </h3>
        <dl>
          <ReviewRow
            label={<T t={t} k="label_worker_name" lang={lang} />}
            value={step1.worker_name}
          />
          <ReviewRow
            label={<T t={t} k="label_issue_date" lang={lang} />}
            value={step1.issue_date}
          />
          <ReviewRow
            label={<T t={t} k="label_company_name" lang={lang} />}
            value={`${step1.company_name}${step1.company_name_romaji ? ` (${step1.company_name_romaji})` : ''}`}
          />
          <ReviewRow
            label={<T t={t} k="label_company_address" lang={lang} />}
            value={`${step1.company_address}${step1.company_address_romaji ? ` (${step1.company_address_romaji})` : ''}`}
          />
          <ReviewRow
            label={<T t={t} k="label_company_phone" lang={lang} />}
            value={step1.company_phone}
          />
          <ReviewRow
            label={<T t={t} k="label_employer_name" lang={lang} />}
            value={`${step1.employer_name}${step1.employer_name_romaji ? ` (${step1.employer_name_romaji})` : ''}`}
          />
          {(step1.consultation_department || step1.consultation_contact_person || step1.consultation_contact_info) && (
            <ReviewRow
              label={<T t={t} k="label_consultation_desk" lang={lang} />}
              value={[
                step1.consultation_department,
                step1.consultation_contact_person,
                step1.consultation_contact_info,
              ].filter(Boolean).join(' / ')}
            />
          )}
        </dl>
      </section>

      {/* STEP 2 review */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-3 pb-2 border-b-2 border-[#c9a84c]">
          <T t={t} k="step2_title" lang={lang} />
        </h3>
        <dl>
          <ReviewRow
            label={<T t={t} k="label_visa_type" lang={lang} />}
            value={visaLabel}
          />
          {step2.entry_date && (
            <ReviewRow
              label={<T t={t} k="label_entry_date" lang={lang} />}
              value={step2.entry_date}
            />
          )}
          {step2.tokutei_sector && (
            <ReviewRow
              label={<T t={t} k="label_sector" lang={lang} />}
              value={sectorLabel}
            />
          )}
          {step2.tokutei_job_category && (
            <ReviewRow
              label={<T t={t} k="label_job_category" lang={lang} />}
              value={step2.tokutei_job_category}
            />
          )}
          <ReviewRow
            label="雇用形態"
            value={employmentTypeLabel}
          />
          <ReviewRow
            label={<T t={t} k="section_contract" lang={lang} />}
            value={
              step2.contract_type === 'indefinite'
                ? (t.value_contract_indefinite?.[lang] ?? '期間の定めなし')
                : `${step2.contract_start} ～ ${step2.contract_end}`
            }
          />
          {step2.contract_type === 'fixed' && (
            <>
              <ReviewRow
                label={<T t={t} k="label_contract_renewal" lang={lang} />}
                value={renewalLabel}
              />
              {step2.renewal_type !== 'auto' && step2.renewal_criteria_text && (
                <ReviewRow
                  label={<T t={t} k="label_renewal_criteria" lang={lang} />}
                  value={step2.renewal_criteria_text}
                />
              )}
              {step2.renewal_limit_has && (
                <>
                  <ReviewRow
                    label={<T t={t} k="label_renewal_limit" lang={lang} />}
                    value={`${step2.renewal_limit_times ? `${step2.renewal_limit_times}回` : ''}${step2.renewal_limit_times && step2.renewal_limit_years ? ' / ' : ''}${step2.renewal_limit_years ? `${step2.renewal_limit_years}年` : ''}`}
                  />
                  {renewalLimitReasonLabel && (
                    <ReviewRow
                      label={<T t={t} k="label_renewal_limit_reason" lang={lang} />}
                      value={renewalLimitReasonLabel}
                    />
                  )}
                </>
              )}
            </>
          )}
          {step2.transfer_clause && (
            <ReviewRow
              label={<T t={t} k="label_transfer_clause" lang={lang} />}
              value={<T t={t} k="label_transfer_yes" lang={lang} />}
            />
          )}
          {/* 育成就労の転籍詳細 */}
          {step2.visa_type === 'ikusei' && step2.transfer_clause && (
            <>
              <ReviewRow
                label="転籍制限期間"
                value={transferRestrictionLabel}
              />
              {step2.transfer_conditions && (
                <ReviewRow
                  label="やむを得ない事情による転籍条件"
                  value={step2.transfer_conditions}
                />
              )}
              {step2.transfer_voluntary_conditions && (
                <ReviewRow
                  label="本人意向による転籍条件"
                  value={step2.transfer_voluntary_conditions}
                />
              )}
            </>
          )}
          <ReviewRow
            label={<T t={t} k="label_workplace" lang={lang} />}
            value={step2.workplace_initial}
          />
          {step2.workplace_office_name && (
            <ReviewRow
              label="事業所名"
              value={step2.workplace_office_name}
            />
          )}
          {step2.workplace_office_phone && (
            <ReviewRow
              label="事業所連絡先"
              value={step2.workplace_office_phone}
            />
          )}
          {workplaceRangeTx && (
            <ReviewRow
              label={<T t={t} k="label_workplace_range" lang={lang} />}
              value={workplaceRangeTx}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_job_description" lang={lang} />}
            value={step2.job_description_initial}
          />
          {jobRangeTx && (
            <ReviewRow
              label={<T t={t} k="label_job_scope_range" lang={lang} />}
              value={jobRangeTx}
            />
          )}
        </dl>
      </section>

      {/* STEP 3 review */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-3 pb-2 border-b-2 border-[#c9a84c]">
          <T t={t} k="step3_title" lang={lang} />
        </h3>
        <dl>
          <ReviewRow
            label={<T t={t} k="label_work_hour_system" lang={lang} />}
            value={workHourLabel}
          />
          {step3.work_hour_type === 'shift' && step3.shift_patterns.length > 0 && (
            <ReviewRow
              label={<T t={t} k="label_shift_patterns" lang={lang} />}
              value={step3.shift_patterns
                .map((p) => `${p.name}: ${p.startTime}〜${p.endTime}（休憩${p.breakMinutes}分）`)
                .join('\n')}
            />
          )}
          {(step3.work_hour_type === 'variant1' || step3.work_hour_type === 'variant1y') && (
            <>
              {step3.variant_start_date && (
                <ReviewRow
                  label={<T t={t} k="label_start_date_calc" lang={lang} />}
                  value={step3.variant_start_date}
                />
              )}
              {step3.variant_by_rules && (
                <ReviewRow
                  label={<T t={t} k="label_work_hour_system" lang={lang} />}
                  value={t.label_dismissal_work_rules_general?.[lang] ?? 'Per work rules appendix'}
                />
              )}
            </>
          )}
          {step3.work_hour_type !== 'shift' && (
            <ReviewRow
              label={`${t.label_start_time?.[lang] ?? '始業'} / ${t.label_end_time?.[lang] ?? '終業'}`}
              value={`${step3.work_start} ～ ${step3.work_end}`}
            />
          )}
          {step3.work_hour_type !== 'shift' && (
            <ReviewRow
              label={<T t={t} k="label_break_time" lang={lang} />}
              value={`${step3.break_minutes} ${t.label_minutes?.[lang] ?? '分'}`}
            />
          )}
          {(step3.prescribed_hours_weekly || step3.prescribed_hours_monthly || step3.prescribed_hours_yearly) && (
            <ReviewRow
              label={<T t={t} k="label_prescribed_hours" lang={lang} />}
              value={[
                step3.prescribed_hours_weekly && `週${step3.prescribed_hours_weekly}時間`,
                step3.prescribed_hours_monthly && `月${step3.prescribed_hours_monthly}時間`,
                step3.prescribed_hours_yearly && `年${step3.prescribed_hours_yearly}時間`,
              ].filter(Boolean).join(' / ')}
            />
          )}
          {(step3.prescribed_days_weekly || step3.prescribed_days_monthly || step3.prescribed_days_yearly) && (
            <ReviewRow
              label={<T t={t} k="label_prescribed_days" lang={lang} />}
              value={[
                step3.prescribed_days_weekly && `週${step3.prescribed_days_weekly}日`,
                step3.prescribed_days_monthly && `月${step3.prescribed_days_monthly}日`,
                step3.prescribed_days_yearly && `年${step3.prescribed_days_yearly}日`,
              ].filter(Boolean).join(' / ')}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_overtime" lang={lang} />}
            value={yesNo(step3.overtime)}
          />
          {step3.overtime === 'yes' && step3.overtime_article_number && (
            <ReviewRow
              label={<T t={t} k="label_overtime_article" lang={lang} />}
              value={`36協定・就業規則第${step3.overtime_article_number}条`}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_holidays" lang={lang} />}
            value={step3.days_off_pattern === 'weekly' ? step3.days_off_weekly : step3.days_off_other}
          />
          {step3.annual_holiday_days && (
            <ReviewRow
              label="年間合計休日日数"
              value={`${step3.annual_holiday_days}日`}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_paid_leave" lang={lang} />}
            value={`${step3.paid_leave_days} ${days}`}
          />
          {step3.pre_6month_leave_enabled && (
            <ReviewRow
              label="継続勤務6か月未満の有給休暇"
              value={
                step3.pre_6month_leave_months && step3.pre_6month_leave_days
                  ? `あり（${step3.pre_6month_leave_months}か月経過で${step3.pre_6month_leave_days}日）`
                  : 'あり'
              }
            />
          )}
          {step3.other_leave && (
            <ReviewRow
              label={<T t={t} k="label_other_leave" lang={lang} />}
              value={step3.other_leave}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_temporary_return_leave" lang={lang} />}
            value={t.label_temporary_return_leave_body?.[lang] ?? '一時帰国を希望する場合、必要な有給休暇日数又は無給の休暇を付与することがある。'}
          />
        </dl>
      </section>

      {/* STEP 4 review */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-3 pb-2 border-b-2 border-[#c9a84c]">
          <T t={t} k="step4_title" lang={lang} />
        </h3>
        <dl>
          <ReviewRow
            label={<T t={t} k="label_base_wage" lang={lang} />}
            value={`${formatJPY(step4.basic_salary)} (${(() => {
              const wopt = WAGE_TYPE_OPTIONS.find((o) => o.value === step4.wage_type);
              return wopt ? tx(t, wopt.tKey, lang) : step4.wage_type;
            })()})`}
          />
          {step4.allowances.length > 0 && (
            <ReviewRow
              label={<T t={t} k="label_allowances" lang={lang} />}
              value={step4.allowances.map((a) => `${a.name}: ${formatJPY(a.amount)}`).join('\n')}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_overtime_rate" lang={lang} />}
            value={[
              `所定超: ${step4.overtime_rate_prescribed}%`,
              `法定超≤60h: ${step4.overtime_rate_normal}%`,
              `法定超60h超: ${step4.overtime_rate_over60}%`,
              `法定休日: ${step4.overtime_rate_holiday}%`,
              `法定外休日: ${step4.overtime_rate_holiday_non_statutory}%`,
              `深夜: ${step4.overtime_rate_night}%`,
            ].join(' / ')}
          />
          {step4.deduction_agreement === 'yes' && (
            <ReviewRow
              label={<T t={t} k="label_wage_deductions" lang={lang} />}
              value={deductionDisplay}
            />
          )}
          {(step4.deduction_tax_estimate || step4.deduction_social_estimate || step4.deduction_employment_estimate) && (
            <ReviewRow
              label={<T t={t} k="label_deduction_tax" lang={lang} />}
              value={[
                step4.deduction_tax_estimate && `所得税: ${formatJPY(step4.deduction_tax_estimate)}`,
                step4.deduction_social_estimate && `社保: ${formatJPY(step4.deduction_social_estimate)}`,
                step4.deduction_employment_estimate && `雇用保険: ${formatJPY(step4.deduction_employment_estimate)}`,
              ].filter(Boolean).join(' / ')}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_wage_cutoff" lang={lang} />}
            value={cutoffDisplay}
          />
          <ReviewRow
            label={<T t={t} k="label_payment_date" lang={lang} />}
            value={payDayDisplay}
          />
          <ReviewRow
            label={<T t={t} k="label_payment_method" lang={lang} />}
            value={paymentMethodLabel}
          />
          {step4.fixed_overtime_enabled && (
            <ReviewRow
              label={<T t={t} k="label_fixed_overtime" lang={lang} />}
              value={`${step4.fixed_overtime_name}: ${formatJPY(step4.fixed_overtime_amount)}（${step4.fixed_overtime_hours}時間分）`}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_pay_raise" lang={lang} />}
            value={
              step4.pay_raise === 'yes'
                ? `${yesNo('yes')}${raiseTimingLabel ? `（${raiseTimingLabel}）` : ''}`
                : yesNo('no')
            }
          />
          <ReviewRow
            label={<T t={t} k="label_bonus" lang={lang} />}
            value={
              step4.bonus === 'yes'
                ? `${yesNo('yes')}${bonusFreqLabel ? `（${bonusFreqLabel}）` : ''}${step4.bonus_last_amount ? ` ${t.label_recent_amount?.[lang] ?? '直近'}: ${formatJPY(step4.bonus_last_amount)}` : ''}`
                : yesNo('no')
            }
          />
          <ReviewRow
            label={<T t={t} k="label_retirement_pay" lang={lang} />}
            value={yesNo(step4.retirement_allowance)}
          />
          {step4.work_stoppage_enabled && (
            <ReviewRow
              label={<T t={t} k="label_work_stoppage" lang={lang} />}
              value={`平均賃金の${step4.work_stoppage_rate}％以上`}
            />
          )}
          {/* 自己都合退職 */}
          {(step4.voluntary_resignation_notice_days || step4.voluntary_resignation_to) && (
            <ReviewRow
              label="自己都合退職"
              value={[
                step4.voluntary_resignation_notice_days && `${step4.voluntary_resignation_notice_days}日前に`,
                step4.voluntary_resignation_to && `${step4.voluntary_resignation_to}に届出`,
              ].filter(Boolean).join('')}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_notice_days" lang={lang} />}
            value={`${step4.retirement_notice_days} ${days}`}
          />
          <ReviewRow
            label={<T t={t} k="dismissal_section_title" lang={lang} />}
            value={
              !step4.work_rules_exist
                ? '就業規則なし（個別契約による）'
                : (step4.dismissal_article_from || step4.dismissal_article_number)
                  ? step4.dismissal_article_to
                    ? `就業規則第${step4.dismissal_article_from || step4.dismissal_article_number}条〜第${step4.dismissal_article_to}条に定める事由による`
                    : (t.label_dismissal_work_rules?.[lang] ?? '就業規則第{n}条に定める事由による').replace('{n}', step4.dismissal_article_from || step4.dismissal_article_number)
                  : (t.label_dismissal_work_rules_general?.[lang] ?? '就業規則の定める事由による')
            }
          />
          {(healthCheckHireDisplay || healthCheckPeriodicDisplay) && (
            <ReviewRow
              label={<T t={t} k="label_health_check" lang={lang} />}
              value={[
                healthCheckHireDisplay && `雇入れ時: ${healthCheckHireDisplay}`,
                healthCheckPeriodicDisplay && `定期: ${healthCheckPeriodicDisplay}`,
              ].filter(Boolean).join(' / ')}
            />
          )}
          {step4.dismissal_special_clauses.length > 0 && (
            <ReviewRow
              label={<T t={t} k="label_dismissal" lang={lang} />}
              value={step4.dismissal_special_clauses
                .map((key) => DISMISSAL_SPECIAL_OPTIONS.find((o) => o.key === key)?.label ?? key)
                .join('\n')}
            />
          )}
          <ReviewRow
            label={<T t={t} k="label_social_insurance" lang={lang} />}
            value={[
              step4.insurance_pension && (t.label_pension_insurance?.[lang] ?? '厚生年金'),
              step4.insurance_health && (t.label_health_insurance?.[lang] ?? '健康保険'),
              step4.insurance_employment && (t.label_employment_insurance?.[lang] ?? '雇用保険'),
              step4.insurance_workers_comp && (t.label_workers_comp?.[lang] ?? '労災保険'),
              step4.insurance_national_pension && '国民年金',
              step4.insurance_national_health && '国民健康保険',
            ]
              .filter(Boolean)
              .join('、')}
          />
          <ReviewRow
            label={<T t={t} k="label_return_travel_expense" lang={lang} />}
            value={t.label_return_travel_expense_body?.[lang] ?? '帰国旅費が自己負担できない場合、使用者が負担する。'}
          />
        </dl>
      </section>

      {/* Validation errors (inline) */}
      {validationErrors.length > 0 && (
        <div className="bg-red-50 border border-red-300 rounded-xl p-4">
          <p className="text-sm font-bold text-red-700 mb-2">
            以下の必須項目が未入力、または入力内容にエラーがあります。確認してください。
          </p>
          <ul className="text-xs text-red-600 space-y-1">
            {validationErrors.map((e) => (
              <li key={e}>・{e}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Download button */}
      <div className="pt-4">
        {lang === 'ja' && (
          <p className="text-xs text-red-500 text-center mb-2">
            外国語を1つ選択するとPDFを生成できます
          </p>
        )}
        <button
          type="button"
          disabled={pdfGenerating || lang === 'ja'}
          className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white font-bold text-base transition disabled:opacity-60 disabled:cursor-not-allowed"
          style={{ background: pdfGenerated ? 'linear-gradient(135deg, #166534 0%, #22863a 100%)' : 'linear-gradient(135deg, #1a2f5e 0%, #2a4a8e 100%)' }}
          onClick={handleGeneratePdf}
        >
          {pdfGenerating ? (
            <Loader2 size={20} className="animate-spin" />
          ) : pdfGenerated ? (
            <CheckCircle size={20} />
          ) : (
            <FileDown size={20} />
          )}
          {pdfGenerating
            ? 'PDF生成中...'
            : pdfGenerated
              ? 'ダウンロード完了！もう一度生成'
              : <T t={t} k="btn_generate_pdf" lang={lang} />
          }
        </button>
      </div>

      {/* Partner CTA */}
      <div
        className="p-4 rounded-xl border-2 border-[#c9a84c]/30 text-sm"
        style={{ background: 'linear-gradient(135deg, #fefce8 0%, #fff7ed 100%)' }}
      >
        <div className="flex items-start gap-2">
          <ExternalLink size={16} className="text-[#c9a84c] mt-0.5 shrink-0" />
          <div>
            <T t={t} k="cta_partner_title" lang={lang} />
          </div>
        </div>
      </div>

      {/* Legal footer */}
      <div className="text-xs text-gray-400 space-y-2 pt-4 border-t border-gray-100">
        <p><T t={t} k="footer_legal_basis" lang={lang} /></p>
        <p><T t={t} k="footer_retention" lang={lang} /></p>
      </div>
    </div>
  );
}
