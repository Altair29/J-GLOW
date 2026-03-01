'use client';

import { Plus, Trash2 } from 'lucide-react';
import type { Step3Data, WorkHourType, ShiftPattern } from '../types';
import { WORK_HOUR_TYPE_OPTIONS } from '../types';

interface Props {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
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

function OptionalBadge() {
  return (
    <span className="ml-2 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">
      任意
    </span>
  );
}

function ErrorMsg({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return <p className="text-xs text-red-500 mt-1">{text}</p>;
}

const DAY_OPTIONS = ['月', '火', '水', '木', '金', '土', '日', '祝日'] as const;

export default function Step3WorkHours({ data, onChange, showErrors = false, errors = [] }: Props) {
  const set = <K extends keyof Step3Data>(key: K, value: Step3Data[K]) =>
    onChange({ ...data, [key]: value });

  const toggleDay = (day: string) => {
    const current = data.days_off_days;
    const next = current.includes(day)
      ? current.filter((d) => d !== day)
      : [...current, day];
    const ordered = DAY_OPTIONS.filter((d) => next.includes(d));
    onChange({
      ...data,
      days_off_days: ordered as unknown as string[],
      days_off_weekly: ordered.join('・'),
    });
  };

  /* Shift pattern helpers */
  const addShiftPattern = () =>
    set('shift_patterns', [
      ...data.shift_patterns,
      { name: '', startTime: '', endTime: '', breakMinutes: '60' },
    ]);

  const removeShiftPattern = (idx: number) =>
    set('shift_patterns', data.shift_patterns.filter((_, i) => i !== idx));

  const updateShiftPattern = (idx: number, field: keyof ShiftPattern, value: string) =>
    set(
      'shift_patterns',
      data.shift_patterns.map((p, i) => (i === idx ? { ...p, [field]: value } : p))
    );

  const isShift = data.work_hour_type === 'shift';
  const isVariant = data.work_hour_type === 'variant1' || data.work_hour_type === 'variant1y';
  const isFixed = data.work_hour_type === 'fixed';

  const hasErr = (key: string) => showErrors && errors.includes(key);

  const inputCls = (key: string, base?: string) =>
    `${base ?? 'w-full'} rounded-lg border px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none ${
      hasErr(key) ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
    }`;

  return (
    <div className="space-y-8">
      {/* Work hour type selection */}
      <section>
        <h3 className="text-lg font-bold text-[#1a2f5e] mb-4">
          労働時間制
          <RequiredBadge />
        </h3>
        <div className="space-y-2 mb-6">
          {WORK_HOUR_TYPE_OPTIONS.map((opt) => (
            <label key={opt.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="work_hour_type"
                checked={data.work_hour_type === opt.value}
                onChange={() => set('work_hour_type', opt.value as WorkHourType)}
                className="accent-[#1a2f5e]"
              />
              <span className="text-sm">{opt.label}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Fixed / Flex: Start / End / Break */}
      {(isFixed || data.work_hour_type === 'flex') && (
        <section>
          <div className="grid gap-4 sm:grid-cols-3">
            <div data-error={hasErr('work_start') || undefined}>
              <label className="block text-sm font-medium text-gray-700 mb-1">始業</label>
              <input
                type="time"
                value={data.work_start}
                onChange={(e) => set('work_start', e.target.value)}
                className={inputCls('work_start')}
              />
              <ErrorMsg show={hasErr('work_start')} text="始業時間を入力してください" />
            </div>
            <div data-error={hasErr('work_end') || undefined}>
              <label className="block text-sm font-medium text-gray-700 mb-1">終業</label>
              <input
                type="time"
                value={data.work_end}
                onChange={(e) => set('work_end', e.target.value)}
                className={inputCls('work_end')}
              />
              <ErrorMsg show={hasErr('work_end')} text="終業時間を入力してください" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">休憩時間</label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={data.break_minutes}
                  onChange={(e) => set('break_minutes', e.target.value)}
                  min="0"
                  className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-600">分</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shift patterns */}
      {isShift && (
        <section data-error={hasErr('shift_patterns') || undefined}>
          <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
            シフトパターン
          </h3>
          <div className="space-y-3">
            {data.shift_patterns.map((pattern, i) => (
              <div key={i} className="flex flex-wrap gap-2 items-center p-3 rounded-lg border border-gray-200 bg-gray-50">
                <input
                  type="text"
                  value={pattern.name}
                  onChange={(e) => updateShiftPattern(i, 'name', e.target.value)}
                  className="w-24 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-[#1a2f5e] outline-none"
                  placeholder="早番"
                />
                <input
                  type="time"
                  value={pattern.startTime}
                  onChange={(e) => updateShiftPattern(i, 'startTime', e.target.value)}
                  className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-[#1a2f5e] outline-none"
                />
                <span className="text-gray-400">〜</span>
                <input
                  type="time"
                  value={pattern.endTime}
                  onChange={(e) => updateShiftPattern(i, 'endTime', e.target.value)}
                  className="rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-[#1a2f5e] outline-none"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    value={pattern.breakMinutes}
                    onChange={(e) => updateShiftPattern(i, 'breakMinutes', e.target.value)}
                    min="0"
                    className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm focus:border-[#1a2f5e] outline-none"
                  />
                  <span className="text-xs text-gray-500">分休憩</span>
                </div>
                <button
                  type="button"
                  onClick={() => removeShiftPattern(i)}
                  className="p-1.5 rounded-lg text-red-400 hover:bg-red-50 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addShiftPattern}
              className="flex items-center gap-1.5 text-sm text-[#1a2f5e] hover:underline"
            >
              <Plus size={14} />
              パターンを追加
            </button>
          </div>
          {data.shift_patterns.length === 0 && (
            <p className={`text-xs mt-2 ${hasErr('shift_patterns') ? 'text-red-500' : 'text-gray-400'}`}>
              ※ シフトパターンを1つ以上追加してください（例：早番・遅番・夜勤）
            </p>
          )}
        </section>
      )}

      {/* Variant labor time */}
      {isVariant && (
        <section>
          <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
            変形労働時間制の詳細
          </h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                対象期間の起算日
              </label>
              <input
                type="date"
                value={data.variant_start_date}
                onChange={(e) => set('variant_start_date', e.target.value)}
                className="w-full max-w-xs rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.variant_by_rules}
                onChange={(e) => set('variant_by_rules', e.target.checked)}
                className="accent-[#1a2f5e] rounded"
              />
              <span className="text-sm text-gray-700">
                就業規則の別表による（シフト詳細入力を省略）
              </span>
            </label>
            {!data.variant_by_rules && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">基本の勤務時間</p>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div data-error={hasErr('work_start') || undefined}>
                    <label className="block text-xs text-gray-500 mb-1">始業</label>
                    <input
                      type="time"
                      value={data.work_start}
                      onChange={(e) => set('work_start', e.target.value)}
                      className={inputCls('work_start')}
                    />
                  </div>
                  <div data-error={hasErr('work_end') || undefined}>
                    <label className="block text-xs text-gray-500 mb-1">終業</label>
                    <input
                      type="time"
                      value={data.work_end}
                      onChange={(e) => set('work_end', e.target.value)}
                      className={inputCls('work_end')}
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">休憩</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        value={data.break_minutes}
                        onChange={(e) => set('break_minutes', e.target.value)}
                        min="0"
                        className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                      />
                      <span className="text-sm text-gray-600">分</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Prescribed working hours */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">所定労働時間</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">週</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.prescribed_hours_weekly}
                onChange={(e) => set('prescribed_hours_weekly', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">時間</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">月</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.prescribed_hours_monthly}
                onChange={(e) => set('prescribed_hours_monthly', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">時間</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">年</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.prescribed_hours_yearly}
                onChange={(e) => set('prescribed_hours_yearly', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">時間</span>
            </div>
          </div>
        </div>
      </section>

      {/* Prescribed working days */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">所定労働日数</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs text-gray-500 mb-1">週</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.prescribed_days_weekly}
                onChange={(e) => set('prescribed_days_weekly', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">日</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">月</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.prescribed_days_monthly}
                onChange={(e) => set('prescribed_days_monthly', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">日</span>
            </div>
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">年</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.prescribed_days_yearly}
                onChange={(e) => set('prescribed_days_yearly', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">日</span>
            </div>
          </div>
        </div>
      </section>

      {/* Overtime */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
          時間外労働
        </h3>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => set('overtime', 'yes')}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              data.overtime === 'yes'
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            あり
          </button>
          <button
            type="button"
            onClick={() => set('overtime', 'no')}
            className={`px-4 py-2 rounded-lg border text-sm transition ${
              data.overtime === 'no'
                ? 'border-[#1a2f5e] bg-[#1a2f5e] text-white'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            なし
          </button>
        </div>
        {data.overtime === 'yes' && (
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              根拠条文
            </label>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-700">36協定・就業規則第</span>
              <input
                type="number"
                min={1}
                max={200}
                value={data.overtime_article_number}
                onChange={(e) => set('overtime_article_number', e.target.value)}
                className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-center text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                placeholder="○"
              />
              <span className="text-gray-700">条</span>
            </div>
          </div>
        )}
      </section>

      {/* A-2: Days off — checkbox grid */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
          休日
          <RequiredBadge />
        </h3>
        <div className="space-y-3">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              checked={data.days_off_pattern === 'weekly'}
              onChange={() => set('days_off_pattern', 'weekly')}
              className="accent-[#1a2f5e]"
            />
            毎週
          </label>
          {data.days_off_pattern === 'weekly' && (
            <div
              className={`flex flex-wrap gap-2 ml-6 ${hasErr('days_off_days') ? 'p-2 rounded-lg border border-red-300 bg-red-50/30' : ''}`}
              data-error={hasErr('days_off_days') || undefined}
            >
              {DAY_OPTIONS.map((day) => {
                const checked = data.days_off_days.includes(day);
                return (
                  <label
                    key={day}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm cursor-pointer transition ${
                      checked
                        ? 'border-[#1a2f5e] bg-[#1a2f5e]/5 ring-1 ring-[#1a2f5e] font-medium'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleDay(day)}
                      className="accent-[#1a2f5e] rounded"
                    />
                    {day}
                  </label>
                );
              })}
            </div>
          )}
          {data.days_off_pattern === 'weekly' && (
            <>
              {data.days_off_days.length > 0 && (
                <p className="ml-6 text-sm text-gray-500">
                  選択中：{data.days_off_weekly}
                </p>
              )}
              <ErrorMsg show={hasErr('days_off_days')} text="休日を1日以上選択してください" />
            </>
          )}
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input
              type="radio"
              checked={data.days_off_pattern === 'other'}
              onChange={() => set('days_off_pattern', 'other')}
              className="accent-[#1a2f5e]"
            />
            その他
          </label>
          {data.days_off_pattern === 'other' && (
            <div data-error={hasErr('days_off_other') || undefined}>
              <textarea
                value={data.days_off_other}
                onChange={(e) => set('days_off_other', e.target.value)}
                rows={2}
                className={`w-full rounded-lg border px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none resize-y ${
                  hasErr('days_off_other') ? 'border-red-400 bg-red-50/30' : 'border-gray-300'
                }`}
                placeholder="休日の詳細を記入"
              />
              <ErrorMsg show={hasErr('days_off_other')} text="休日の詳細を入力してください" />
            </div>
          )}
        </div>

        {/* Annual holiday days */}
        <div className="mt-5">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            年間合計休日日数
            <OptionalBadge />
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={data.annual_holiday_days}
              onChange={(e) => set('annual_holiday_days', e.target.value)}
              min="0"
              max="365"
              className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              placeholder="105"
            />
            <span className="text-sm text-gray-600">日</span>
          </div>
          <p className="text-xs text-gray-400 mt-1">※ 所定休日の年間合計日数を入力してください</p>
        </div>
      </section>

      {/* Leave */}
      <section>
        <h3 className="text-base font-bold text-[#1a2f5e] mb-4">
          年次有給休暇
        </h3>
        <div className="space-y-4">
          <div>
            <div className="p-3 rounded-lg bg-gray-50 text-sm text-gray-600 mb-2">
              6ヶ月継続勤務し全労働日の8割以上出勤した場合に付与（労基法第39条）
            </div>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={data.paid_leave_days}
                onChange={(e) => set('paid_leave_days', e.target.value)}
                min="0"
                className="w-20 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-600">日</span>
            </div>
          </div>

          {/* Pre-6-month leave */}
          <div className="rounded-lg border border-gray-200 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">
                継続勤務6か月未満の年次有給休暇
              </span>
              <div className="flex gap-3">
                <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="pre_6month_leave_enabled"
                    checked={data.pre_6month_leave_enabled === true}
                    onChange={() => set('pre_6month_leave_enabled', true)}
                    className="accent-[#1a2f5e]"
                  />
                  あり
                </label>
                <label className="flex items-center gap-1.5 cursor-pointer text-sm">
                  <input
                    type="radio"
                    name="pre_6month_leave_enabled"
                    checked={data.pre_6month_leave_enabled === false}
                    onChange={() => set('pre_6month_leave_enabled', false)}
                    className="accent-[#1a2f5e]"
                  />
                  なし
                </label>
              </div>
            </div>
            {data.pre_6month_leave_enabled && (
              <div className="flex items-center gap-2 flex-wrap pt-1">
                <input
                  type="number"
                  value={data.pre_6month_leave_months}
                  onChange={(e) => set('pre_6month_leave_months', e.target.value)}
                  min="1"
                  max="5"
                  placeholder="3"
                  className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-700">か月経過で</span>
                <input
                  type="number"
                  value={data.pre_6month_leave_days}
                  onChange={(e) => set('pre_6month_leave_days', e.target.value)}
                  min="1"
                  placeholder="5"
                  className="w-16 rounded-lg border border-gray-300 px-2 py-1.5 text-sm text-center focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-700">日</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              その他の休暇
              <OptionalBadge />
            </label>
            <textarea
              value={data.other_leave}
              onChange={(e) => set('other_leave', e.target.value)}
              rows={2}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-[#1a2f5e] focus:ring-1 focus:ring-[#1a2f5e] outline-none resize-y"
              placeholder="例：夏季休暇、年末年始休暇、慶弔休暇"
            />
          </div>

          {/* Temporary return leave (info box, auto-inserted in PDF) */}
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs font-bold text-blue-800 mb-1">一時帰国休暇（PDF自動挿入）</p>
            <p className="text-xs text-blue-700">
              一時帰国を希望する場合、必要な有給休暇日数又は無給の休暇を付与することがある。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
