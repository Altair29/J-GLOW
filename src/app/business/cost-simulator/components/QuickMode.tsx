'use client';

import { useState } from 'react';
import type { QuickInputs, VisaChoice } from '../lib/types';
import { IndustryButtonGrid } from './IndustryButtonGrid';
import { generateMonthOptions } from '../lib/calculate';

type Props = {
  data: QuickInputs;
  onChange: (data: QuickInputs) => void;
  onComplete: () => void;
  onBack: () => void;
};

export function QuickMode({ data, onChange, onComplete, onBack }: Props) {
  const [currentQ, setCurrentQ] = useState(0);
  const totalQ = data.visaChoice === 'ikusei' || data.visaChoice === 'both' || data.visaChoice === 'compare' ? 5 : 4;

  const update = <K extends keyof QuickInputs>(key: K, value: QuickInputs[K]) =>
    onChange({ ...data, [key]: value });

  const monthOptions = generateMonthOptions();

  const visaOptions: { value: VisaChoice; label: string }[] = [
    { value: 'ikusei', label: '育成就労' },
    { value: 'tokutei', label: '特定技能1号' },
    { value: 'tokutei2', label: '特定技能2号' },
    { value: 'ginou', label: '技人国' },
    { value: 'compare', label: '複数比較' },
  ];

  const canNext = () => {
    switch (currentQ) {
      case 0: return data.industry !== '';
      case 1: return true;
      case 2: return data.headcount > 0;
      case 3: return data.startDate !== '';
      case 4: return data.fullTimeStaff !== null && data.fullTimeStaff > 0;
      default: return true;
    }
  };

  const handleNext = () => {
    if (currentQ >= totalQ - 1) {
      onComplete();
      return;
    }
    // Q4（常勤職員数）は育成就労時のみ表示
    let next = currentQ + 1;
    if (next === 4 && !(data.visaChoice === 'ikusei' || data.visaChoice === 'both' || data.visaChoice === 'compare')) {
      onComplete();
      return;
    }
    setCurrentQ(next);
  };

  const handlePrev = () => {
    if (currentQ === 0) {
      onBack();
      return;
    }
    setCurrentQ((q) => q - 1);
  };

  return (
    <div className="space-y-6">
      {/* プログレス */}
      <div className="flex justify-center gap-2">
        {Array.from({ length: totalQ }).map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-colors ${
              i === currentQ
                ? 'bg-[#1a2f5e]'
                : i < currentQ
                  ? 'bg-[#c9a84c]'
                  : 'bg-gray-200'
            }`}
          />
        ))}
      </div>

      {/* Q1: 業種 */}
      {currentQ === 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a2f5e] text-center">
            Q1. 業種を選択してください
          </h3>
          <IndustryButtonGrid
            selected={data.industry}
            onChange={(v) => update('industry', v)}
          />
        </div>
      )}

      {/* Q2: ビザ */}
      {currentQ === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a2f5e] text-center">
            Q2. 検討中の在留資格は？
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-lg mx-auto">
            {visaOptions.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => update('visaChoice', value)}
                className={`p-4 rounded-lg border-2 text-center transition-all ${
                  data.visaChoice === value
                    ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Q3: 人数 */}
      {currentQ === 2 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a2f5e] text-center">
            Q3. 採用希望人数
          </h3>
          <div className="max-w-sm mx-auto space-y-4">
            <input
              type="range"
              min={1}
              max={20}
              value={data.headcount}
              onChange={(e) => update('headcount', Number(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a2f5e]"
            />
            <div className="text-center">
              <span className="text-4xl font-bold text-[#1a2f5e]">{data.headcount}</span>
              <span className="text-lg text-gray-500 ml-1">人</span>
            </div>
          </div>
        </div>
      )}

      {/* Q4: 就労開始希望月 */}
      {currentQ === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a2f5e] text-center">
            Q4. いつから働いてほしいですか？
          </h3>
          <div className="max-w-sm mx-auto">
            <select
              value={data.startDate}
              onChange={(e) => update('startDate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-center text-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none bg-white"
            >
              {monthOptions.map(({ value, label }) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Q5: 常勤職員数（育成就労時のみ） */}
      {currentQ === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-[#1a2f5e] text-center">
            Q5. 御社の常勤職員数は？
          </h3>
          <p className="text-sm text-gray-500 text-center">
            育成就労の受入上限を算出します
          </p>
          <div className="max-w-sm mx-auto space-y-3">
            <div className="grid grid-cols-3 gap-3">
              {[20, 50, 100].map((n) => (
                <button
                  key={n}
                  onClick={() => update('fullTimeStaff', n)}
                  className={`p-3 rounded-lg border-2 text-center transition-all ${
                    data.fullTimeStaff === n
                      ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <span className="font-bold text-lg">{n}</span>
                  <span className="text-sm text-gray-500">人</span>
                </button>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">その他:</span>
              <input
                type="number"
                min={1}
                value={data.fullTimeStaff ?? ''}
                onChange={(e) => update('fullTimeStaff', e.target.value ? Number(e.target.value) : null)}
                placeholder="入力"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-center focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
              />
              <span className="text-sm text-gray-500">人</span>
            </div>
          </div>
        </div>
      )}

      {/* ナビボタン */}
      <div className="flex justify-between pt-4">
        <button
          onClick={handlePrev}
          className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          &larr; 戻る
        </button>
        <button
          onClick={handleNext}
          disabled={!canNext()}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canNext()
              ? 'bg-[#1a2f5e] text-white hover:bg-[#1a2f5e]/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {currentQ >= totalQ - 1 ? '結果を見る' : '次へ'} &rarr;
        </button>
      </div>
    </div>
  );
}
