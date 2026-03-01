'use client';

import type { Step1Data } from '../lib/types';
import { INDUSTRIES } from '../lib/constants';
import { IndustryButtonGrid } from './IndustryButtonGrid';

type Props = {
  data: Step1Data;
  onChange: (data: Step1Data) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
};

export function Step1Company({ data, onChange, onNext, onBack, canProceed }: Props) {
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

      {/* 業種 — IndustryButtonGrid */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          業種 <span className="text-red-500">*</span>
        </label>
        <IndustryButtonGrid
          selected={data.industry}
          onChange={(v) => update('industry', v)}
        />
      </div>

      {/* 外国人雇用状況（複数選択可） */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          現在の外国人雇用状況 <span className="text-red-500">*</span>
        </label>
        <p className="text-xs text-gray-400 mb-2">該当するものを全て選択してください</p>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {([
            { value: 'none', label: 'なし', desc: '外国人雇用未経験' },
            { value: 'ginou', label: '技能実習生', desc: '現在受入れ中' },
            { value: 'tokutei', label: '特定技能', desc: '現在受入れ中' },
            { value: 'ikusei', label: '育成就労', desc: '現在受入れ中' },
            { value: 'student', label: '留学生', desc: 'アルバイト等' },
          ] as const).map(({ value, label, desc }) => {
            const isSelected = data.foreignStatus.includes(value);
            const handleClick = () => {
              if (value === 'none') {
                // 「なし」を選ぶ→他をクリア
                update('foreignStatus', ['none']);
              } else {
                // 「なし」以外を選ぶ→「なし」を外す
                const without = data.foreignStatus.filter((v) => v !== 'none' && v !== value);
                if (isSelected) {
                  // 外す。全部外れたら「なし」に戻す
                  update('foreignStatus', without.length > 0 ? without : ['none']);
                } else {
                  update('foreignStatus', [...without, value]);
                }
              }
            };
            return (
              <button
                key={value}
                onClick={handleClick}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  isSelected
                    ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className={`w-4 h-4 rounded border-2 flex items-center justify-center text-xs shrink-0 ${
                    isSelected ? 'bg-[#1a2f5e] border-[#1a2f5e] text-white' : 'border-gray-300'
                  }`}>
                    {isSelected && '✓'}
                  </span>
                  <div>
                    <div className="font-medium text-sm">{label}</div>
                    <div className="text-xs text-gray-500">{desc}</div>
                  </div>
                </div>
              </button>
            );
          })}
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

      {/* v2: もっと詳しく入力する */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
          もっと詳しく入力する
        </summary>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* 過去離職率 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              外国人スタッフの過去離職率
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'low', label: '10%未満', desc: '離職がほぼない' },
                { value: 'mid', label: '10〜30%', desc: '業界平均程度' },
                { value: 'high', label: '30%超', desc: '課題を感じている' },
              ] as const).map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => update('pastTurnoverRate', data.pastTurnoverRate === value ? null : value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${
                    data.pastTurnoverRate === value
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

          {/* 初期予算 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              採用にかけられる初期予算（1人あたり）
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'under50', label: '〜50万円' },
                { value: '50to150', label: '50〜150万円' },
                { value: 'unlimited', label: '制限なし' },
              ] as const).map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => update('initialBudget', data.initialBudget === value ? null : value)}
                  className={`p-3 rounded-lg border-2 text-center transition-all text-sm font-medium ${
                    data.initialBudget === value
                      ? 'border-[#1a2f5e] bg-[#1a2f5e]/5 text-[#1a2f5e]'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  }`}
                >
                  {label}
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
