'use client';

import type { Step1Data } from './CostSimulatorShell';
import { INDUSTRIES } from './CostSimulatorShell';

type Props = {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onNext: () => void;
  canProceed: boolean;
};

export function Step1Company({ data, onChange, onNext, canProceed }: Props) {
  const update = <K extends keyof Step1Data>(key: K, value: Step1Data[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#1a2f5e] flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2f5e] text-white text-sm font-bold">1</span>
        企業情報
      </h2>

      {/* 企業名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          企業名 <span className="text-gray-400 text-xs">（任意）</span>
        </label>
        <input
          type="text"
          value={data.companyName}
          onChange={(e) => update('companyName', e.target.value)}
          placeholder="例：株式会社◯◯"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
        />
        <p className="text-xs text-gray-400 mt-1">提案書モード時に表紙へ表示されます</p>
      </div>

      {/* 業種 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          業種 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.industry}
          onChange={(e) => update('industry', e.target.value)}
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none bg-white"
        >
          <option value="">選択してください</option>
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* 外国人雇用状況 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          現在の外国人雇用状況 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { value: 'none', label: 'なし', desc: '外国人雇用未経験' },
            { value: 'ginou', label: '技能実習生あり', desc: '現在受入れ中' },
            { value: 'tokutei', label: '特定技能あり', desc: '現在受入れ中' },
          ] as const).map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update('foreignStatus', value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.foreignStatus === value
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

      {/* 常勤職員数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          常勤職員数 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={500}
            value={data.fullTimeStaff}
            onChange={(e) => update('fullTimeStaff', Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a2f5e]"
            aria-valuenow={data.fullTimeStaff}
            aria-valuemin={1}
            aria-valuemax={500}
            aria-label="常勤職員数"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={9999}
              value={data.fullTimeStaff}
              onChange={(e) => update('fullTimeStaff', Math.max(1, Number(e.target.value)))}
              className="w-20 px-2 py-1.5 border border-gray-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
            />
            <span className="text-sm text-gray-600">人</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          育成就労の受入上限: {Math.floor(data.fullTimeStaff / 20)}人（常勤職員数÷20）
        </p>
      </div>

      {/* 次へボタン */}
      <div className="flex justify-end pt-4">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-[#1a2f5e] text-white hover:bg-[#1a2f5e]/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
