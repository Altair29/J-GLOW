'use client';

import type { MsimScenarioWithChoices } from '../lib/types';
import { CATEGORY_CONFIG } from '../lib/constants';

type Props = {
  scenario: MsimScenarioWithChoices;
};

export default function EventCard({ scenario }: Props) {
  const cat = CATEGORY_CONFIG[scenario.category];

  return (
    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      {/* カテゴリヘッダー */}
      <div
        className="px-4 py-2 flex items-center gap-2"
        style={{ backgroundColor: cat.bgColor }}
      >
        <span className="text-base">{cat.emoji}</span>
        <span className="text-xs font-bold" style={{ color: cat.color }}>
          {cat.label}
        </span>
      </div>

      {/* コンテンツ */}
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          {scenario.icon && (
            <span className="text-3xl flex-shrink-0">{scenario.icon}</span>
          )}
          <div>
            <h3 className="text-base font-bold text-[#1a2f5e] mb-1">{scenario.title}</h3>
            <p className="text-sm text-gray-600 leading-relaxed">{scenario.situation}</p>
          </div>
        </div>
        {scenario.detail && (
          <p className="text-xs text-gray-400 mt-2 pl-1 border-l-2 border-gray-200 ml-1">
            {scenario.detail}
          </p>
        )}
      </div>
    </div>
  );
}
