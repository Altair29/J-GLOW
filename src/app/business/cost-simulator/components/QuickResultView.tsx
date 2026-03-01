'use client';

import type { QuickInputs, CostBreakdown } from '../lib/types';
import { VISA_LEAD_TIMES } from '../lib/constants';
import { getMonthsUntilStart, getEarliestStartMonth, isFeasible } from '../lib/calculate';
import type { VisaTypeV2 } from '../lib/types';

type Props = {
  inputs: QuickInputs;
  breakdowns: CostBreakdown[];
  onDetailMode: () => void;
  onRestart: () => void;
};

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

function getVisaTypeV2FromKey(key: string): VisaTypeV2 | null {
  const map: Record<string, VisaTypeV2> = {
    ikusei: 'ikusei',
    tokutei1_kaigai: 'tokutei1_kaigai',
    tokutei1_kokunai: 'tokutei1_kokunai',
    tokutei2: 'tokutei2',
    ginou: 'ginou',
    student: 'student',
  };
  return map[key] ?? null;
}

export function QuickResultView({ inputs, breakdowns, onDetailMode, onRestart }: Props) {
  if (breakdowns.length === 0) return null;

  const primary = breakdowns[0];
  const visaType = getVisaTypeV2FromKey(primary.visaType);
  const leadTime = visaType ? VISA_LEAD_TIMES[visaType] : null;
  const feasible = visaType ? isFeasible(inputs.startDate, visaType) : true;
  const earliestMonth = visaType ? getEarliestStartMonth(visaType) : '';

  return (
    <div className="space-y-8">
      {/* KPI カード */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 最短就労開始 */}
        <div className={`rounded-xl p-5 text-center ${feasible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <p className="text-xs text-gray-500 mb-1">最短就労開始</p>
          <p className={`text-lg font-bold ${feasible ? 'text-green-700' : 'text-red-600'}`}>
            {feasible ? '間に合います' : earliestMonth}
          </p>
          {leadTime && (
            <p className="text-xs text-gray-400 mt-1">
              リードタイム: {leadTime.months}ヶ月
            </p>
          )}
        </div>

        {/* 1人あたり初期費用 */}
        <div className="bg-[#1a2f5e]/5 rounded-xl p-5 text-center border border-[#1a2f5e]/10">
          <p className="text-xs text-gray-500 mb-1">1人あたり初期費用</p>
          <p className="text-lg font-bold text-[#1a2f5e]">
            {formatYen(primary.initialTotal.min)}
            {primary.initialTotal.min !== primary.initialTotal.max && (
              <span className="text-sm"> 〜 {formatYen(primary.initialTotal.max)}</span>
            )}
          </p>
        </div>

        {/* 月次コスト */}
        <div className="bg-[#1a2f5e]/5 rounded-xl p-5 text-center border border-[#1a2f5e]/10">
          <p className="text-xs text-gray-500 mb-1">月次コスト（1人）</p>
          <p className="text-lg font-bold text-[#1a2f5e]">
            {formatYen(primary.monthlyTotal.min)}
            {primary.monthlyTotal.min !== primary.monthlyTotal.max && (
              <span className="text-sm"> 〜 {formatYen(primary.monthlyTotal.max)}</span>
            )}
          </p>
        </div>
      </div>

      {/* 3年間総コスト */}
      <div className="bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] rounded-xl p-6 text-white text-center">
        <p className="text-sm opacity-80 mb-2">
          3年間総コスト（{inputs.headcount}人分）
        </p>
        <p className="text-3xl font-bold">
          {formatYen(primary.threeYearTotal.min)}
          {primary.threeYearTotal.min !== primary.threeYearTotal.max && (
            <span className="text-xl"> 〜 {formatYen(primary.threeYearTotal.max)}</span>
          )}
        </p>
      </div>

      {/* 比較表示（複数ビザ時） */}
      {breakdowns.length > 1 && (
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-[#1a2f5e]">ビザ種別ごとの概算比較</h3>
          <div className="grid gap-3">
            {breakdowns.map((b) => (
              <div key={b.visaType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                <span className="text-sm font-medium text-gray-700">{b.visaLabel}</span>
                <span className="text-sm font-bold text-[#1a2f5e] font-mono">
                  {formatYen(b.threeYearTotal.min)} 〜 {formatYen(b.threeYearTotal.max)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CTAボタン */}
      <div className="space-y-3">
        <button
          onClick={onDetailMode}
          className="w-full px-6 py-4 bg-[#1a2f5e] text-white rounded-xl font-bold text-base hover:bg-[#1a2f5e]/90 transition-all"
        >
          詳細シミュレーションへ &rarr;
        </button>
        <a
          href="/business/partners"
          className="block w-full px-6 py-4 bg-white border-2 border-[#c9a84c] text-[#8a6d2b] rounded-xl font-bold text-base text-center hover:bg-[#c9a84c]/10 transition-all"
        >
          専門家に相談する &rarr;
        </a>
      </div>

      {/* ナビ */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          最初からやり直す
        </button>
      </div>

      {/* 免責 */}
      <p className="text-xs text-gray-400 text-center">
        ※ クイック試算は概算です。より正確な試算は「詳細シミュレーション」をご利用ください。
      </p>
    </div>
  );
}
