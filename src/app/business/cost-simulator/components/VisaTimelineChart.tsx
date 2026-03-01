'use client';

import { useMemo } from 'react';
import { VISA_LEAD_TIMES, VISA_TYPE_CONFIG } from '../lib/constants';
import { getMonthsUntilStart } from '../lib/calculate';
import type { VisaTypeV2 } from '../lib/types';

type Props = {
  startDate: string;
  selectedVisa?: VisaTypeV2 | null;
};

const ALL_VISA_TYPES: VisaTypeV2[] = [
  'ikusei',
  'tokutei1_kaigai',
  'tokutei1_kokunai',
  'tokutei2',
  'ginou',
  'student',
];

export function VisaTimelineChart({ startDate, selectedVisa }: Props) {
  const monthsUntilStart = useMemo(() => getMonthsUntilStart(startDate), [startDate]);
  const maxMonths = 12;

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-[#1a2f5e] text-sm">ビザ別リードタイム比較</h4>
      <div className="space-y-2">
        {ALL_VISA_TYPES.map((vt) => {
          const lead = VISA_LEAD_TIMES[vt];
          const config = VISA_TYPE_CONFIG[vt];
          const feasible = monthsUntilStart >= lead.months;
          const isSelected = selectedVisa === vt;
          const barWidth = Math.min((lead.months / maxMonths) * 100, 100);

          return (
            <div
              key={vt}
              className={`flex items-center gap-3 p-2 rounded-lg transition-all ${
                isSelected ? 'bg-[#1a2f5e]/5 ring-1 ring-[#1a2f5e]/20' : ''
              }`}
            >
              <div className="w-28 md:w-36 text-xs font-medium text-gray-700 shrink-0">
                {config.shortLabel}
              </div>
              <div className="flex-1 relative h-6 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${barWidth}%`,
                    backgroundColor: feasible ? config.color : '#ef4444',
                  }}
                />
                {/* 希望月の縦線 */}
                {monthsUntilStart <= maxMonths && (
                  <div
                    className="absolute top-0 bottom-0 w-0.5 bg-[#c9a84c]"
                    style={{ left: `${(monthsUntilStart / maxMonths) * 100}%` }}
                  />
                )}
              </div>
              <div className="w-20 text-right shrink-0">
                <span className={`text-xs font-bold ${feasible ? 'text-green-600' : 'text-red-500'}`}>
                  {lead.months}ヶ月
                </span>
              </div>
              <div className="w-8 shrink-0 text-center">
                {feasible ? (
                  <span className="text-green-500 text-sm">✓</span>
                ) : (
                  <span className="text-red-500 text-sm">✕</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 text-xs text-gray-500 pt-1">
        <span className="flex items-center gap-1">
          <span className="w-3 h-0.5 bg-[#c9a84c] inline-block" /> 希望開始月
        </span>
        <span className="flex items-center gap-1">
          <span className="text-green-500">✓</span> 間に合う
        </span>
        <span className="flex items-center gap-1">
          <span className="text-red-500">✕</span> 間に合わない
        </span>
      </div>
    </div>
  );
}
