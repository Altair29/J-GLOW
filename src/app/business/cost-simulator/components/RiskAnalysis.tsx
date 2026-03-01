'use client';

import { useState, useMemo } from 'react';
import { calcRiskScenarios, calcRiskCost } from '../lib/calculate';
import { ADDITIONAL_RISKS } from '../lib/constants';
import type { VisaChoice } from '../lib/types';

type Props = {
  headcount: number;
  initialCostPerPerson: { min: number; max: number };
  visaChoice?: VisaChoice;
};

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

const SEVERITY_STYLES = {
  high: { bg: 'bg-red-50', border: 'border-red-200', badge: 'bg-red-100 text-red-700' },
  medium: { bg: 'bg-yellow-50', border: 'border-yellow-200', badge: 'bg-yellow-100 text-yellow-700' },
  low: { bg: 'bg-green-50', border: 'border-green-200', badge: 'bg-green-100 text-green-700' },
};

const SEVERITY_LABELS = { high: '高', medium: '中', low: '低' };

export function RiskAnalysis({ headcount, initialCostPerPerson, visaChoice }: Props) {
  const [turnoverRate, setTurnoverRate] = useState(15);
  const [showAdditionalRisks, setShowAdditionalRisks] = useState(false);

  const scenarios = useMemo(
    () => calcRiskScenarios(headcount, initialCostPerPerson),
    [headcount, initialCostPerPerson],
  );

  const customScenario = useMemo(
    () => calcRiskCost(headcount, initialCostPerPerson, turnoverRate),
    [headcount, initialCostPerPerson, turnoverRate],
  );

  // 育成就労を含む場合は制度変更リスクを強調
  const hasIkusei = visaChoice === 'ikusei' || visaChoice === 'both' || visaChoice === 'compare';

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#1a2f5e]">リスク分析</h3>

      {/* 離職リスクスライダー */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <label className="block text-sm font-medium text-gray-700">
          想定離職率: <span className="text-[#1a2f5e] font-bold">{turnoverRate}%</span>
        </label>
        <input
          type="range"
          min={0}
          max={50}
          step={5}
          value={turnoverRate}
          onChange={(e) => setTurnoverRate(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a2f5e]"
        />
        <div className="flex justify-between text-xs text-gray-400">
          <span>0%</span>
          <span>25%</span>
          <span>50%</span>
        </div>
      </div>

      {/* カスタムシナリオ結果 */}
      <div className="bg-[#1a2f5e]/5 rounded-lg p-4 border border-[#1a2f5e]/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xs text-gray-500">想定離職人数</p>
            <p className="text-lg font-bold text-[#1a2f5e]">{customScenario.lostWorkers}人</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">欠員コスト</p>
            <p className="text-lg font-bold text-[#1a2f5e]">{formatYen(customScenario.vacancyCost)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">再採用コスト</p>
            <p className="text-lg font-bold text-[#1a2f5e]">{formatYen(customScenario.rehireCost)}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">リスク合計</p>
            <p className="text-lg font-bold text-red-600">{formatYen(customScenario.riskTotal)}</p>
          </div>
        </div>
      </div>

      {/* 3シナリオ比較テーブル */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-3 py-2 text-left text-gray-600">シナリオ</th>
              <th className="px-3 py-2 text-right text-gray-600">離職率</th>
              <th className="px-3 py-2 text-right text-gray-600">離職人数</th>
              <th className="px-3 py-2 text-right text-gray-600">リスクコスト</th>
            </tr>
          </thead>
          <tbody>
            {scenarios.map((s) => (
              <tr key={s.label} className="border-t border-gray-100">
                <td className="px-3 py-2">
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-medium ${
                      s.label === '楽観'
                        ? 'bg-green-100 text-green-700'
                        : s.label === '標準'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {s.label}
                  </span>
                </td>
                <td className="px-3 py-2 text-right font-mono">{s.turnoverRate}%</td>
                <td className="px-3 py-2 text-right font-mono">{s.lostWorkers}人</td>
                <td className="px-3 py-2 text-right font-mono font-bold">{formatYen(s.riskTotal)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 定着支援CTA */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-800 mb-2">
          離職防止は再採用コストの削減に直結します。
        </p>
        <a
          href="/business/existing-users/connect/templates"
          className="inline-flex items-center gap-1 text-sm font-medium text-green-700 hover:text-green-900 transition-colors"
        >
          現場指示書ビルダーで定着率を改善 &rarr;
        </a>
      </div>

      {/* その他のリスク（アコーディオン） */}
      <div className="border border-gray-200 rounded-lg">
        <button
          onClick={() => setShowAdditionalRisks(!showAdditionalRisks)}
          className="w-full px-4 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-between"
        >
          <span>離職以外のリスク要因</span>
          <span className="text-gray-400">{showAdditionalRisks ? '▲' : '▼'}</span>
        </button>
        {showAdditionalRisks && (
          <div className="px-4 pb-4 space-y-3 border-t border-gray-100 pt-3">
            {ADDITIONAL_RISKS.map((risk) => {
              const style = SEVERITY_STYLES[risk.severity];
              // 育成就労以外は制度変更リスクを強調しない
              if (risk.type === 'regulatory' && !hasIkusei) return null;
              return (
                <div key={risk.type} className={`${style.bg} border ${style.border} rounded-lg p-3`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`${style.badge} text-xs px-2 py-0.5 rounded font-medium`}>
                      リスク度: {SEVERITY_LABELS[risk.severity]}
                    </span>
                    <h4 className="text-sm font-bold text-gray-800">{risk.label}</h4>
                  </div>
                  <p className="text-xs text-gray-600">{risk.description}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
