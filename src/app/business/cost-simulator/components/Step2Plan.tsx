'use client';

import type { Step2Data, VisaChoice, SendingCountry } from '../lib/types';
import { SENDING_COUNTRIES } from '../lib/constants';
import { generateMonthOptions } from '../lib/calculate';

type Props = {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  capacityLimit: number;
  isOverCapacity: boolean;
  visaChoice: VisaChoice;
};

export function Step2Plan({
  data,
  onChange,
  onNext,
  onBack,
  canProceed,
  capacityLimit,
  isOverCapacity,
}: Props) {
  const update = <K extends keyof Step2Data>(key: K, value: Step2Data[K]) =>
    onChange({ ...data, [key]: value });

  const monthOptions = generateMonthOptions();

  const visaOptions: { value: VisaChoice; label: string; desc: string }[] = [
    { value: 'ikusei', label: '育成就労', desc: '3年間・海外から' },
    { value: 'tokutei', label: '特定技能1号', desc: '最大5年・国内外' },
    { value: 'tokutei2', label: '特定技能2号', desc: '1号からの移行' },
    { value: 'ginou', label: '技人国', desc: '技術・人文知識' },
    { value: 'student', label: '留学→就労', desc: '卒業後移行' },
    { value: 'compare', label: '複数比較', desc: '並列で比較表示' },
  ];

  const showTargetChoice = data.visaChoice === 'tokutei' || data.visaChoice === 'both' || data.visaChoice === 'compare';
  const showWorkerLocation = data.visaChoice === 'ginou';

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#1a2f5e] flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2f5e] text-white text-sm font-bold">2</span>
        採用計画
      </h2>

      {/* 在留資格 — v2: 6択カード */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          在留資格 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {visaOptions.map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update('visaChoice', value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.visaChoice === value
                  ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 対象者区分（特定技能選択時のみ） */}
      {showTargetChoice && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            対象者区分 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {([
              { value: 'kaigai', label: '海外在住', desc: '現地から採用' },
              { value: 'kokunai', label: '国内在籍', desc: '国内転職・切替' },
              { value: 'both', label: '両方比較', desc: '並列で比較表示' },
            ] as const).map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => update('targetChoice', value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  data.targetChoice === value
                    ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 技人国: 採用ルート */}
      {showWorkerLocation && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            採用ルート
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {([
              { value: 'kaigai', label: '海外から招聘', desc: '在留資格認定証明書申請' },
              { value: 'kokunai', label: '国内在住者', desc: '在留資格変更申請' },
            ] as const).map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => update('targetChoice', value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  data.targetChoice === value
                    ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 採用希望人数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          採用希望人数 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={30}
            value={data.headcount}
            onChange={(e) => update('headcount', Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a2f5e]"
            aria-valuenow={data.headcount}
            aria-valuemin={1}
            aria-valuemax={30}
            aria-label="採用希望人数"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={30}
              value={data.headcount}
              onChange={(e) => update('headcount', Math.max(1, Math.min(30, Number(e.target.value))))}
              className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
            />
            <span className="text-sm text-gray-600">人</span>
          </div>
        </div>

        {isOverCapacity && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">
              ⚠️ 育成就労の受入上限は<strong>{capacityLimit}人</strong>です（常勤職員数÷20）。
              希望人数が上限を超えています。
            </p>
          </div>
        )}
      </div>

      {/* 入国・就労開始希望時期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          入国・就労開始希望時期 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none bg-white"
        >
          {monthOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* 送出国 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          送出国 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.sendingCountry}
          onChange={(e) => update('sendingCountry', e.target.value as SendingCountry)}
          className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none bg-white"
        >
          {SENDING_COUNTRIES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* 職種 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          職種・作業内容 <span className="text-gray-400 text-xs">（任意）</span>
        </label>
        <input
          type="text"
          value={data.jobCategory}
          onChange={(e) => update('jobCategory', e.target.value)}
          placeholder="例：プレス加工、溶接、介護"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
        />
      </div>

      {/* v2: もっと詳しく入力する */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
          もっと詳しく入力する
        </summary>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* 月額給与 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              想定月額給与（総支給）
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">¥</span>
              <input
                type="number"
                min={0}
                value={data.monthlyWage ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  update('monthlyWage', v === '' ? null : Math.max(0, Number(v)));
                }}
                placeholder="200000（未入力時はデフォルト20万円）"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
              />
            </div>
            <p className="text-xs text-gray-400 mt-1">社会保険料の算出に使用します</p>
          </div>

          {/* 雇用形態 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              雇用形態
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'fulltime', label: '正社員' },
                { value: 'parttime', label: 'パート' },
                { value: 'contract', label: '契約社員' },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update('employmentType', data.employmentType === value ? null : value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                    data.employmentType === value
                      ? 'border-[#1a2f5e] bg-[#1a2f5e]/5 text-[#1a2f5e]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 計画期間 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              試算期間
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 1, label: '1年間' },
                { value: 3, label: '3年間' },
                { value: 5, label: '5年間' },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update('planYears', data.planYears === value ? null : value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                    data.planYears === value
                      ? 'border-[#1a2f5e] bg-[#1a2f5e]/5 text-[#1a2f5e]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* 面接渡航 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              現地面接・渡航
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'none', label: 'なし', desc: 'オンライン面接' },
                { value: 'domestic', label: '国内', desc: '国内出張のみ' },
                { value: 'overseas', label: '渡航あり', desc: '現地面接' },
              ] as const).map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => update('interviewTrip', data.interviewTrip === value ? null : value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${
                    data.interviewTrip === value
                      ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* ナビボタン */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          &larr; 戻る
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-[#1a2f5e] text-white hover:bg-[#1a2f5e]/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          次へ &rarr;
        </button>
      </div>
    </div>
  );
}
