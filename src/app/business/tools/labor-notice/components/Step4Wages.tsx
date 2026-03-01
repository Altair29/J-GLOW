'use client';

import { Plus, Trash2, FileText, Info } from 'lucide-react';
import type { Step4Data, PaymentMethod } from '../types';
import { DEDUCTION_TYPE_OPTIONS, RAISE_TIMING_OPTIONS, BONUS_FREQUENCY_OPTIONS, DISMISSAL_SPECIAL_OPTIONS, PAYMENT_METHOD_OPTIONS, formatJPY } from '../types';

interface Props {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
  showErrors?: boolean;
  errors?: string[];
}

function RequiredBadge() {
  return (
    <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-red-50 text-red-600">
      必須
    </span>
  );
}

function ErrorMsg({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-red-500 mt-1">{text}</p>;
}

function YesNoToggle({
  value,
  onChangeVal,
}: {
  value: 'yes' | 'no';
  onChangeVal: (v: 'yes' | 'no') => void;
}) {
  return (
    <div className="flex gap-3">
      <button
        type="button"
        onClick={() => onChangeVal('yes')}
        className={`px-3 py-1.5 rounded-lg border text-sm transition ${
          value === 'yes'
            ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        あり
      </button>
      <button
        type="button"
        onClick={() => onChangeVal('no')}
        className={`px-3 py-1.5 rounded-lg border text-sm transition ${
          value === 'no'
            ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
            : 'border-gray-200 hover:border-gray-300'
        }`}
      >
        なし
      </button>
    </div>
  );
}

const WAGE_TYPE_LABELS: Record<string, string> = {
  monthly: '月給',
  daily: '日給',
  hourly: '時給',
};

/* A-3: Cutoff day & Pay day options */
const DAY_OPTIONS = [
  { value: 'end', label: '末日' },
  ...Array.from({ length: 28 }, (_, i) => ({
    value: String(i + 1),
    label: `${i + 1}日`,
  })),
];

export default function Step4Wages({ data, onChange, showErrors = false, errors = [] }: Props) {
  const set = <K extends keyof Step4Data>(key: K, value: Step4Data[K]) =>
    onChange({ ...data, [key]: value });

  const addAllowance = () =>
    set('allowances', [...data.allowances, { name: '', amount: '' }]);

  const removeAllowance = (idx: number) =>
    set('allowances', data.allowances.filter((_, i) => i !== idx));

  const updateAllowance = (idx: number, field: 'name' | 'amount', value: string) =>
    set(
      'allowances',
      data.allowances.map((a, i) => (i === idx ? { ...a, [field]: value } : a))
    );

  /* B-2: Deduction items */
  const addDeductionItem = () =>
    set('deduction_items', [...data.deduction_items, { type: '', amount: '' }]);

  const removeDeductionItem = (idx: number) =>
    set('deduction_items', data.deduction_items.filter((_, i) => i !== idx));

  const updateDeductionItem = (idx: number, field: 'type' | 'amount', value: string) =>
    set(
      'deduction_items',
      data.deduction_items.map((item, i) => (i === idx ? { ...item, [field]: value } : item))
    );

  const hasErr = (key: string) => showErrors && errors.includes(key);

  const inputCls = (key: string, base?: string) =>
    `${base ?? 'w-full'} rounded-lg border px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none ${
      hasErr(key) ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-8">
      {/* Wages section */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          賃金
          <RequiredBadge />
        </h3>

        {/* Wage type */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            基本給
          </label>
          <div className="flex gap-2 mb-3">
            {(['monthly', 'daily', 'hourly'] as const).map((wt) => (
              <button
                key={wt}
                type="button"
                onClick={() => set('wage_type', wt)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  data.wage_type === wt
                    ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                {WAGE_TYPE_LABELS[wt]}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2" data-error={hasErr('basic_salary') || undefined}>
            <input
              type="text"
              value={data.basic_salary}
              onChange={(e) => set('basic_salary', e.target.value)}
              className={inputCls('basic_salary', 'w-40')}
              placeholder="200,000"
            />
            <span className="text-sm text-gray-600">円</span>
          </div>
          <ErrorMsg show={hasErr('basic_salary')} text="基本給を入力してください" />
          {data.basic_salary && Number(data.basic_salary.replace(/,/g, '')) > 0 && (
            <p className="text-xs text-gray-500 mt-1">→ {formatJPY(data.basic_salary)}</p>
          )}
        </div>

        {/* Allowances */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            手当
          </label>
          {data.allowances.map((a, i) => (
            <div key={i} className="flex gap-2 mb-2 items-center">
              <input
                type="text"
                value={a.name}
                onChange={(e) => updateAllowance(i, 'name', e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                placeholder="手当名"
              />
              <input
                type="text"
                value={a.amount}
                onChange={(e) => updateAllowance(i, 'amount', e.target.value)}
                className="w-32 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                placeholder="金額"
              />
              <span className="text-sm text-gray-500">円</span>
              {a.amount && Number(a.amount.replace(/,/g, '')) > 0 && (
                <span className="text-xs text-gray-400">→ {formatJPY(a.amount)}</span>
              )}
              <button
                type="button"
                onClick={() => removeAllowance(i)}
                className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addAllowance}
            className="flex items-center gap-1.5 text-sm text-[#1a2f5e] hover:underline"
          >
            <Plus size={14} />
            手当を追加
          </button>
        </div>

        {/* Overtime premium rates — 3x2 grid (6 fields) */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            割増賃金率
          </label>
          <div className="grid gap-3 sm:grid-cols-3">
            {/* Row 1 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">法定超月60h以内</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.overtime_rate_normal}
                  onChange={(e) => set('overtime_rate_normal', e.target.value)}
                  min="0"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-600">％</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">法定超月60h超</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.overtime_rate_over60}
                  onChange={(e) => set('overtime_rate_over60', e.target.value)}
                  min="0"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-600">％</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">所定超</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.overtime_rate_prescribed}
                  onChange={(e) => set('overtime_rate_prescribed', e.target.value)}
                  min="0"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-600">％</span>
              </div>
            </div>
            {/* Row 2 */}
            <div>
              <label className="block text-xs text-gray-500 mb-1">法定休日</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.overtime_rate_holiday}
                  onChange={(e) => set('overtime_rate_holiday', e.target.value)}
                  min="0"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-600">％</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">法定外休日</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.overtime_rate_holiday_non_statutory}
                  onChange={(e) => set('overtime_rate_holiday_non_statutory', e.target.value)}
                  min="0"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-600">％</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">深夜22:00-5:00</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.overtime_rate_night}
                  onChange={(e) => set('overtime_rate_night', e.target.value)}
                  min="0"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-600">％</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-gray-500 mt-2">※ 法定の最低割増率が自動設定されています</p>
        </div>

        {/* Deduction agreement */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            賃金控除（労使協定）
          </label>
          <YesNoToggle value={data.deduction_agreement} onChangeVal={(v) => set('deduction_agreement', v)} />
        </div>

        {/* B-2: Deduction items table */}
        {data.deduction_agreement === 'yes' && (
          <div className="mb-4 ml-2 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
            <p className="text-sm font-medium text-gray-700">控除項目の明細</p>
            {data.deduction_items.map((item, i) => (
              <div key={i} className="flex gap-2 items-center">
                <select
                  value={item.type}
                  onChange={(e) => updateDeductionItem(i, 'type', e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                >
                  <option value="">種類を選択</option>
                  {DEDUCTION_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={item.amount}
                  onChange={(e) => updateDeductionItem(i, 'amount', e.target.value)}
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                  placeholder="月額"
                />
                <span className="text-sm text-gray-500">円</span>
                {item.amount && Number(item.amount) > 0 && (
                  <span className="text-xs text-gray-400">→ {formatJPY(item.amount)}</span>
                )}
                <button
                  type="button"
                  onClick={() => removeDeductionItem(i)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addDeductionItem}
              className="flex items-center gap-1.5 text-sm text-[#1a2f5e] hover:underline"
            >
              <Plus size={14} />
              控除項目を追加
            </button>
          </div>
        )}

        {/* Statutory deductions & take-home estimate */}
        <div className="mb-4 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
          <p className="text-sm font-medium text-gray-700">法定控除（概算）</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div>
              <label className="block text-xs text-gray-500 mb-1">所得税</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.deduction_tax_estimate}
                  onChange={(e) => set('deduction_tax_estimate', e.target.value)}
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                  placeholder="0"
                />
                <span className="text-sm text-gray-500">円</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">社会保険料</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.deduction_social_estimate}
                  onChange={(e) => set('deduction_social_estimate', e.target.value)}
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                  placeholder="0"
                />
                <span className="text-sm text-gray-500">円</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">雇用保険料</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.deduction_employment_estimate}
                  onChange={(e) => set('deduction_employment_estimate', e.target.value)}
                  className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                  placeholder="0"
                />
                <span className="text-sm text-gray-500">円</span>
              </div>
            </div>
          </div>
          {/* Take-home pay summary */}
          {(() => {
            const gross = Number(data.basic_salary.replace(/,/g, '') || '0')
              + data.allowances.reduce((sum, a) => sum + Number(a.amount.replace(/,/g, '') || '0'), 0);
            const statutory = Number(data.deduction_tax_estimate || '0')
              + Number(data.deduction_social_estimate || '0')
              + Number(data.deduction_employment_estimate || '0');
            const voluntary = data.deduction_items.reduce((sum, d) => sum + Number(d.amount || '0'), 0);
            const takeHome = gross - statutory - voluntary;
            if (gross <= 0) return null;
            return (
              <div className="p-3 rounded-lg text-white" style={{ background: '#1a2f5e' }}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span>総支給: {formatJPY(gross)}</span>
                  <span>法定控除: {formatJPY(statutory)}</span>
                  {voluntary > 0 && <span>任意控除: {formatJPY(voluntary)}</span>}
                </div>
                <div className="text-base font-bold">
                  手取り概算: {formatJPY(takeHome > 0 ? takeHome : 0)}
                </div>
              </div>
            );
          })()}
        </div>

        {/* A-3: Pay cutoff & pay day — dropdowns */}
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              賃金締切日
            </label>
            <select
              value={data.pay_cutoff_day}
              onChange={(e) => set('pay_cutoff_day', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
            >
              {DAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              賃金支払日
            </label>
            <select
              value={data.pay_day}
              onChange={(e) => set('pay_day', e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
            >
              {DAY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              支払月
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => set('payment_month', 'current')}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm transition ${
                  data.payment_month === 'current'
                    ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                当月
              </button>
              <button
                type="button"
                onClick={() => set('payment_month', 'next')}
                className={`flex-1 px-3 py-2 rounded-lg border text-sm transition ${
                  data.payment_month === 'next'
                    ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                翌月
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Payment method */}
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">賃金支払方法</label>
        <div className="flex gap-3">
          {PAYMENT_METHOD_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => set('payment_method', opt.value as PaymentMethod)}
              className={`px-4 py-2 rounded-lg border text-sm transition ${
                data.payment_method === opt.value
                  ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </section>

      {/* Fixed overtime */}
      <section>
        <label className="block text-sm font-medium text-gray-700 mb-2">固定残業代</label>
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => set('fixed_overtime_enabled', true)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              data.fixed_overtime_enabled
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            あり
          </button>
          <button
            type="button"
            onClick={() => set('fixed_overtime_enabled', false)}
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              !data.fixed_overtime_enabled
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            なし
          </button>
        </div>
        {data.fixed_overtime_enabled && (
          <div className="ml-2 p-4 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">名称</label>
                <input
                  type="text"
                  value={data.fixed_overtime_name}
                  onChange={(e) => set('fixed_overtime_name', e.target.value)}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                  placeholder="例：固定残業手当"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">金額</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={data.fixed_overtime_amount}
                    onChange={(e) => set('fixed_overtime_amount', e.target.value)}
                    className="w-28 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                    placeholder="30000"
                  />
                  <span className="text-sm text-gray-500">円</span>
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">対象時間数</label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={data.fixed_overtime_hours}
                    onChange={(e) => set('fixed_overtime_hours', e.target.value)}
                    className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] outline-none"
                    placeholder="20"
                  />
                  <span className="text-sm text-gray-500">時間分</span>
                </div>
              </div>
            </div>
            <div className="p-2 rounded bg-amber-50 border border-amber-200">
              <p className="text-xs text-amber-800">※ 固定残業代を設ける場合、名称・金額・対象時間数の明示が義務です</p>
            </div>
          </div>
        )}
      </section>

      {/* Raise / Bonus / Retirement allowance */}
      <section>
        <div className="space-y-6">
          {/* Pay raise */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">昇給</label>
            <YesNoToggle value={data.pay_raise} onChangeVal={(v) => set('pay_raise', v)} />
            {data.pay_raise === 'yes' && (
              <div className="mt-3 ml-2 p-3 rounded-lg border border-gray-200 bg-gray-50">
                <label className="block text-sm font-medium text-gray-700 mb-1">昇給時期</label>
                <select
                  value={data.raise_timing}
                  onChange={(e) => set('raise_timing', e.target.value)}
                  className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                >
                  {RAISE_TIMING_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
                {data.raise_timing === 'other' && (
                  <input
                    type="text"
                    value={data.raise_timing_other}
                    onChange={(e) => set('raise_timing_other', e.target.value)}
                    className="w-full max-w-xs mt-2 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                    placeholder="昇給時期を入力"
                  />
                )}
              </div>
            )}
          </div>

          {/* Bonus */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">賞与</label>
            <YesNoToggle value={data.bonus} onChangeVal={(v) => set('bonus', v)} />
            {data.bonus === 'yes' && (
              <div className="mt-3 ml-2 p-3 rounded-lg border border-gray-200 bg-gray-50 space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">支給頻度</label>
                  <select
                    value={data.bonus_frequency}
                    onChange={(e) => set('bonus_frequency', e.target.value)}
                    className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                  >
                    {BONUS_FREQUENCY_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    直近支給額
                    <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
                      任意
                    </span>
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={data.bonus_last_amount}
                      onChange={(e) => set('bonus_last_amount', e.target.value)}
                      className="w-40 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                      placeholder="例：300000"
                    />
                    <span className="text-sm text-gray-600">円</span>
                  </div>
                  {data.bonus_last_amount && Number(data.bonus_last_amount) > 0 && (
                    <p className="text-xs text-gray-500 mt-1">→ {formatJPY(data.bonus_last_amount)}</p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Retirement allowance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">退職金</label>
            <YesNoToggle value={data.retirement_allowance} onChangeVal={(v) => set('retirement_allowance', v)} />
          </div>

          {/* Work stoppage allowance */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">休業手当</label>
            <div className="flex gap-3 mb-3">
              <button
                type="button"
                onClick={() => set('work_stoppage_enabled', true)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  data.work_stoppage_enabled
                    ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                あり
              </button>
              <button
                type="button"
                onClick={() => set('work_stoppage_enabled', false)}
                className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                  !data.work_stoppage_enabled
                    ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                なし
              </button>
            </div>
            {data.work_stoppage_enabled && (
              <div className="flex items-center gap-2 ml-2 text-sm">
                <span className="text-gray-700">平均賃金の</span>
                <input
                  type="number"
                  value={data.work_stoppage_rate}
                  onChange={(e) => set('work_stoppage_rate', e.target.value)}
                  min="0"
                  className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm focus:border-[#1a2f5e] outline-none"
                />
                <span className="text-gray-700">％以上</span>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Retirement section */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          退職に関する事項
        </h3>
        <div className="space-y-6">

          {/* Voluntary resignation procedure */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">自己都合退職の手続</h4>
            <div className="flex items-center gap-2 flex-wrap text-sm">
              <span className="text-gray-700">退職する</span>
              <input
                type="number"
                value={data.voluntary_resignation_notice_days}
                onChange={(e) => set('voluntary_resignation_notice_days', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-gray-700">日前に</span>
              <input
                type="text"
                value={data.voluntary_resignation_to}
                onChange={(e) => set('voluntary_resignation_to', e.target.value)}
                className="w-36 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                placeholder="例：社長、工場長"
              />
              <span className="text-gray-700">に届けること</span>
            </div>
          </div>

          {/* Dismissal notice days */}
          <div>
            <h4 className="text-sm font-semibold text-gray-800 mb-3">解雇予告日数</h4>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.retirement_notice_days}
                onChange={(e) => set('retirement_notice_days', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">日</span>
            </div>
          </div>

          {/* Work rules exist toggle */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-gray-800">就業規則</h4>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => set('work_rules_exist', true)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                    data.work_rules_exist
                      ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  あり
                </button>
                <button
                  type="button"
                  onClick={() => set('work_rules_exist', false)}
                  className={`px-3 py-1.5 rounded-lg border text-sm transition ${
                    !data.work_rules_exist
                      ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  なし
                </button>
              </div>
            </div>

            {data.work_rules_exist ? (
              /* Dismissal article numbers — shown only when work rules exist */
              <div data-error={hasErr('dismissal_article_from') || hasErr('dismissal_article_number') || undefined}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  解雇の事由・手続き
                  <RequiredBadge />
                </label>
                <div className="flex items-center gap-2 text-sm flex-wrap">
                  <span className="text-gray-700">就業規則 第</span>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={data.dismissal_article_from || data.dismissal_article_number}
                    onChange={(e) => {
                      onChange({ ...data, dismissal_article_from: e.target.value, dismissal_article_number: e.target.value });
                    }}
                    className={`w-16 rounded-lg border px-2 py-1.5 text-center text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none ${
                      hasErr('dismissal_article_from') || hasErr('dismissal_article_number') ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                    }`}
                    placeholder="○"
                  />
                  <span className="text-gray-700">条</span>
                  <span className="text-gray-400">〜</span>
                  <span className="text-gray-700">第</span>
                  <input
                    type="number"
                    min={1}
                    max={200}
                    value={data.dismissal_article_to}
                    onChange={(e) => set('dismissal_article_to', e.target.value)}
                    className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                    placeholder="○"
                  />
                  <span className="text-gray-700">条に定める事由による</span>
                </div>
                <ErrorMsg show={hasErr('dismissal_article_from') || hasErr('dismissal_article_number')} text="就業規則の条番号を入力してください" />
                <div className="mt-2 p-2 rounded bg-gray-50 border border-gray-200">
                  <p className="text-xs text-gray-600">解雇は、やむを得ない事由がある場合に限り、少なくとも30日前に予告して行う。（労働基準法第20条）</p>
                </div>
              </div>
            ) : (
              /* Info box when no work rules */
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 border border-blue-200">
                <Info size={16} className="text-blue-600 mt-0.5 shrink-0" />
                <p className="text-xs text-blue-800">
                  従業員10名未満の事業所のため就業規則なし。個別の雇用契約に定める解雇事由による。
                </p>
              </div>
            )}
          </div>

          {/* Dismissal special clauses for foreign workers */}
          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
            <p className="text-xs font-bold text-amber-800 mb-2">
              外国人雇用特有の退職・解雇事由（推奨・自動挿入）
            </p>
            <div className="space-y-2">
              {DISMISSAL_SPECIAL_OPTIONS.map((item) => {
                const checked = data.dismissal_special_clauses.includes(item.key);
                return (
                  <label key={item.key} className="flex items-start gap-2 text-xs text-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) => {
                        const next = e.target.checked
                          ? [...data.dismissal_special_clauses, item.key]
                          : data.dismissal_special_clauses.filter((k) => k !== item.key);
                        set('dismissal_special_clauses', next);
                      }}
                      className="mt-0.5 accent-[#1a2f5e]"
                    />
                    {item.label}
                  </label>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Health checkup */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
          健康診断
        </h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">雇入れ時健診</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.health_check_hire_year}
                onChange={(e) => set('health_check_hire_year', e.target.value)}
                min={2020}
                max={2040}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                placeholder="2026"
              />
              <span className="text-sm text-gray-600">年</span>
              <select
                value={data.health_check_hire_month}
                onChange={(e) => set('health_check_hire_month', e.target.value)}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              >
                <option value="">未定</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}月</option>
                ))}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">定期健診</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.health_check_periodic_year}
                onChange={(e) => set('health_check_periodic_year', e.target.value)}
                min={2020}
                max={2040}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                placeholder="2026"
              />
              <span className="text-sm text-gray-600">年</span>
              <select
                value={data.health_check_periodic_month}
                onChange={(e) => set('health_check_periodic_month', e.target.value)}
                className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              >
                <option value="">未定</option>
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i + 1} value={String(i + 1)}>{i + 1}月</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Insurance — 3x2 grid (6 items) */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
          社会保険
        </h3>
        <div className="grid gap-2 sm:grid-cols-3">
          {([
            { key: 'insurance_pension', label: '厚生年金' },
            { key: 'insurance_health', label: '健康保険' },
            { key: 'insurance_employment', label: '雇用保険' },
            { key: 'insurance_workers_comp', label: '労災保険' },
            { key: 'insurance_national_pension', label: '国民年金' },
            { key: 'insurance_national_health', label: '国民健康保険' },
          ] as const).map(({ key, label }) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-gray-50">
              <input
                type="checkbox"
                checked={data[key]}
                onChange={(e) => set(key, e.target.checked)}
                className="accent-[#1a2f5e] rounded"
              />
              <span className="text-sm">{label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Labor union */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-3">
          労働組合
        </h3>
        <div className="flex gap-3 mb-3">
          <button
            type="button"
            onClick={() => set('labor_union', 'yes')}
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              data.labor_union === 'yes'
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            加入（組合あり）
          </button>
          <button
            type="button"
            onClick={() => set('labor_union', 'no')}
            className={`px-3 py-1.5 rounded-lg border text-sm transition ${
              data.labor_union === 'no'
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            非加入（組合なし / 労働者代表選出）
          </button>
        </div>
        {/* C-2: Union pledge download button */}
        {data.labor_union === 'no' && (
          <div className="space-y-3">
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-sm text-amber-800">
              過半数代表者との書面協定が必要です（労基法第24条）
            </div>
            <a
              href="/business/resources/union-pledge-template.docx"
              download
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition hover:opacity-90"
              style={{ background: '#1a2f5e' }}
            >
              <FileText size={16} />
              誓約書テンプレートをダウンロード
            </a>
          </div>
        )}
      </section>

      {/* Work rules location */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-3">
          就業規則の周知場所
        </h3>
        <input
          type="text"
          value={data.work_rules_location}
          onChange={(e) => set('work_rules_location', e.target.value)}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
          placeholder="例：事務所内の掲示板、社内イントラネット"
        />
      </section>
    </div>
  );
}
