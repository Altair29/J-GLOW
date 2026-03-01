'use client';

import { useState, useEffect, useCallback } from 'react';
import type { MsimGauges } from '../lib/types';
import { computeMonthlyFinancials, formatCurrency } from '../lib/engine';
import { INDUSTRY_LABELS, VISA_LABELS } from '../lib/constants';
import type { MsimIndustry, MsimVisaType } from '../lib/types';

type Props = {
  currentMonth: number;
  totalMonths: number;
  gauges: MsimGauges;
  monthlyRevenue: number;
  monthlyCost: number;
  industry: MsimIndustry;
  visaType: MsimVisaType;
};

export default function MonthlyReport({
  currentMonth,
  totalMonths,
  gauges,
  monthlyRevenue,
  monthlyCost,
  industry,
  visaType,
}: Props) {
  const { revenue, cost, net } = computeMonthlyFinancials(gauges, monthlyRevenue, monthlyCost);
  const isDeficit = net < 0;

  // 月変化時にアニメーション発火
  const [animating, setAnimating] = useState(false);
  const [hasEverChanged, setHasEverChanged] = useState(false);

  const startAnimation = useCallback(() => {
    setAnimating(true);
  }, []);

  useEffect(() => {
    if (currentMonth > 1) {
      setHasEverChanged(true);
      startAnimation();
      const timer = setTimeout(() => setAnimating(false), 700);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentMonth]);

  const showAnim = animating && hasEverChanged;

  return (
    <>
      <style>{`
        @keyframes msim-fin-bounce {
          0% { transform: scale(1); }
          25% { transform: scale(1.12); }
          50% { transform: scale(0.96); }
          75% { transform: scale(1.04); }
          100% { transform: scale(1); }
        }
        @keyframes msim-fin-shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-3px); }
          30% { transform: translateX(3px); }
          45% { transform: translateX(-2px); }
          60% { transform: translateX(2px); }
          75% { transform: translateX(-1px); }
          90% { transform: translateX(1px); }
        }
        .msim-fin-bounce { animation: msim-fin-bounce 0.6s ease-out; }
        .msim-fin-shake { animation: msim-fin-shake 0.5s ease-in-out; }
      `}</style>
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        {/* 月表示 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg">📅</span>
            <div>
              <div className="text-xs text-gray-400">経過月</div>
              <div className="text-lg font-extrabold text-[#1a2f5e]">
                {currentMonth}<span className="text-xs text-gray-400 font-normal">/ {totalMonths}ヶ月</span>
              </div>
            </div>
          </div>
          <div className="flex gap-1.5">
            {Array.from({ length: Math.min(totalMonths, 12) }, (_, i) => (
              <div
                key={i}
                className={`w-1.5 h-4 rounded-full transition-colors duration-300 ${
                  i < currentMonth
                    ? 'bg-[#c9a84c]'
                    : 'bg-gray-200'
                }`}
              />
            ))}
            {totalMonths > 12 && (
              <span className="text-xs text-gray-400 self-end">+{totalMonths - 12}</span>
            )}
          </div>
        </div>

        {/* 業種・ビザ */}
        <div className="flex gap-2 mb-3">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-slate-100 rounded text-xs text-gray-600">
            {INDUSTRY_LABELS[industry]}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 rounded text-xs text-blue-700">
            {VISA_LABELS[visaType]}
          </span>
        </div>

        {/* 月次収支（拡大表示 + アニメーション） */}
        <div className="bg-gray-50 rounded-lg p-3 space-y-2">
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-gray-500">月次収益</span>
            <span className="font-bold text-green-600 tabular-nums">
              +{formatCurrency(revenue)}
            </span>
          </div>
          <div className="flex justify-between items-baseline text-sm">
            <span className="text-gray-500">月次コスト</span>
            <span className="font-bold text-red-600 tabular-nums">
              -{formatCurrency(cost)}
            </span>
          </div>
          <div className="border-t border-gray-200 pt-2">
            <div className="flex justify-between items-baseline">
              <span className="font-bold text-gray-700 text-sm">月次損益</span>
              <span
                className={`font-extrabold text-xl tabular-nums ${
                  isDeficit ? 'text-red-600' : 'text-green-600'
                } ${
                  showAnim
                    ? isDeficit ? 'msim-fin-shake' : 'msim-fin-bounce'
                    : ''
                }`}
              >
                {net >= 0 ? '+' : ''}{formatCurrency(net)}
              </span>
            </div>
            {isDeficit && (
              <p className="text-[10px] text-red-500 mt-1 text-right">
                毎月赤字が続くと資金が枯渇します
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
