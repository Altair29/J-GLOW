'use client';

import { useState } from 'react';
import type { SetupConfig, MsimIndustry, MsimVisaType } from '../lib/types';
import { INDUSTRIES, VISA_TYPES, COMPANY_SIZES, PLAY_MONTHS, HIRE_COUNTS } from '../lib/constants';

type Props = {
  onStart: (setup: SetupConfig) => void;
};

export default function SetupScreen({ onStart }: Props) {
  const [step, setStep] = useState(0);
  const [industry, setIndustry] = useState<MsimIndustry | null>(null);
  const [companySize, setCompanySize] = useState(20);
  const [hireCount, setHireCount] = useState(1);
  const [totalMonths, setTotalMonths] = useState(12);
  const [visaType, setVisaType] = useState<MsimVisaType | null>(null);

  const canProceed = [
    industry !== null,
    true, // Step2 always valid
    visaType !== null,
  ];

  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else if (industry && visaType) {
      onStart({ industry, companySize, hireCount, totalMonths, visaType });
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 rounded-full px-4 py-1.5 mb-4">
          <span className="text-amber-700 text-sm font-bold">経営シミュレーション</span>
        </div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-[#1a2f5e] mb-2">
          外国人雇用を<span className="text-[#c9a84c]">体験</span>しよう
        </h1>
        <p className="text-sm text-gray-500">
          ターン制の経営シミュレーションで、外国人雇用のリアルを学びます
        </p>
      </div>

      {/* ステップインジケータ */}
      <div className="flex items-center justify-center gap-2 mb-8">
        {['業種選択', '会社情報', 'ビザ種別'].map((label, i) => (
          <div key={i} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                i === step
                  ? 'bg-[#1a2f5e] text-white'
                  : i < step
                    ? 'bg-[#c9a84c] text-white'
                    : 'bg-gray-200 text-gray-400'
              }`}
            >
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:inline ${i === step ? 'text-[#1a2f5e] font-bold' : 'text-gray-400'}`}>
              {label}
            </span>
            {i < 2 && <div className="w-8 h-0.5 bg-gray-200" />}
          </div>
        ))}
      </div>

      {/* Step 1: 業種選択 */}
      {step === 0 && (
        <div>
          <h2 className="text-lg font-bold text-[#1a2f5e] mb-1">業種を選択してください</h2>
          <p className="text-sm text-gray-500 mb-6">業種に応じたシナリオが出題されます</p>
          <div className="grid grid-cols-3 gap-3">
            {INDUSTRIES.map((ind) => (
              <button
                key={ind.value}
                onClick={() => setIndustry(ind.value)}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                  industry === ind.value
                    ? 'border-[#c9a84c] bg-amber-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <span className="text-3xl">{ind.emoji}</span>
                <span className={`text-sm font-bold ${industry === ind.value ? 'text-[#1a2f5e]' : 'text-gray-600'}`}>
                  {ind.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: 会社情報 */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-bold text-[#1a2f5e] mb-1">会社情報を設定</h2>
            <p className="text-sm text-gray-500 mb-4">シミュレーションの難易度に影響します</p>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">従業員数</label>
            <div className="flex gap-2">
              {COMPANY_SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setCompanySize(size)}
                  className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    companySize === size
                      ? 'border-[#c9a84c] bg-amber-50 text-[#1a2f5e]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {size}人
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">採用予定人数</label>
            <div className="flex gap-2">
              {HIRE_COUNTS.map((count) => (
                <button
                  key={count}
                  onClick={() => setHireCount(count)}
                  className={`flex-1 py-3 rounded-lg border-2 text-sm font-bold transition-all ${
                    hireCount === count
                      ? 'border-[#c9a84c] bg-amber-50 text-[#1a2f5e]'
                      : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
                >
                  {count}人
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">プレイ期間</label>
            <div className="flex gap-3">
              {PLAY_MONTHS.map((months) => (
                <button
                  key={months}
                  onClick={() => setTotalMonths(months)}
                  className={`flex-1 py-4 rounded-xl border-2 transition-all ${
                    totalMonths === months
                      ? 'border-[#c9a84c] bg-amber-50 shadow-md'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className={`text-2xl font-extrabold ${totalMonths === months ? 'text-[#1a2f5e]' : 'text-gray-400'}`}>
                    {months}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">ヶ月</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 3: ビザ種別 */}
      {step === 2 && (
        <div>
          <h2 className="text-lg font-bold text-[#1a2f5e] mb-1">ビザ種別を選択</h2>
          <p className="text-sm text-gray-500 mb-6">採用する外国人の在留資格を選んでください</p>
          <div className="space-y-3">
            {VISA_TYPES.map((visa) => (
              <button
                key={visa.value}
                onClick={() => setVisaType(visa.value)}
                className={`w-full text-left p-5 rounded-xl border-2 transition-all ${
                  visaType === visa.value
                    ? 'border-[#c9a84c] bg-amber-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
                }`}
              >
                <div className={`text-base font-bold mb-1 ${visaType === visa.value ? 'text-[#1a2f5e]' : 'text-gray-700'}`}>
                  {visa.label}
                </div>
                <div className="text-sm text-gray-500">{visa.description}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ナビゲーションボタン */}
      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={step === 0}
          className={`px-6 py-2.5 rounded-lg text-sm font-bold transition-colors ${
            step === 0
              ? 'text-gray-300 cursor-not-allowed'
              : 'text-gray-600 hover:bg-gray-100'
          }`}
        >
          ← 戻る
        </button>
        <button
          onClick={handleNext}
          disabled={!canProceed[step]}
          className={`px-8 py-2.5 rounded-lg text-sm font-bold transition-all ${
            canProceed[step]
              ? 'bg-[#1a2f5e] text-white hover:bg-[#15254d] shadow-md hover:shadow-lg'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {step === 2 ? 'ゲーム開始 →' : '次へ →'}
        </button>
      </div>
    </div>
  );
}
