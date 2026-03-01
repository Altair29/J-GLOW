'use client';

import { INDUSTRIES_V2 } from '../lib/constants';
import type { VisaTypeV2 } from '../lib/types';

type Props = {
  selected: string;
  onChange: (industry: string) => void;
  visaType?: VisaTypeV2;
  maxSelectable?: number;
};

export function IndustryButtonGrid({ selected, onChange, visaType }: Props) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
      {INDUSTRIES_V2.map((ind) => {
        const isSelected = selected === ind.label;
        const isDisabled = visaType ? !ind.visaTypes.includes(visaType) : false;

        return (
          <button
            key={ind.id}
            onClick={() => !isDisabled && onChange(ind.label)}
            disabled={isDisabled}
            className={`flex items-center gap-2 p-3 rounded-lg border-2 text-left text-sm transition-all ${
              isSelected
                ? 'border-[#1a2f5e] bg-[#1a2f5e]/5 ring-2 ring-[#c9a84c]/30'
                : isDisabled
                  ? 'border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed'
                  : 'border-gray-200 hover:border-gray-300 cursor-pointer'
            }`}
          >
            <span className={`text-lg ${isDisabled ? 'grayscale opacity-30' : ''}`}>
              {ind.icon}
            </span>
            <span className={`font-medium leading-tight ${isSelected ? 'text-[#1a2f5e]' : isDisabled ? 'text-gray-300' : 'text-gray-700'}`}>
              {ind.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
