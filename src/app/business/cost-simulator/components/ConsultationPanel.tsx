'use client';

import { useMemo } from 'react';
import type { AllInputs, DiagnosisItem, DiagnosisType } from '../lib/types';
import { diagnoseInputs } from '../lib/calculate';

type Props = {
  inputs: AllInputs;
};

const TYPE_STYLES: Record<DiagnosisType, { bg: string; border: string; iconBg: string; icon: string }> = {
  urgent: { bg: 'bg-red-50', border: 'border-red-200', iconBg: 'bg-red-100', icon: '🚨' },
  warning: { bg: 'bg-orange-50', border: 'border-orange-200', iconBg: 'bg-orange-100', icon: '⚠️' },
  info: { bg: 'bg-blue-50', border: 'border-blue-200', iconBg: 'bg-blue-100', icon: 'ℹ️' },
  opportunity: { bg: 'bg-green-50', border: 'border-green-200', iconBg: 'bg-green-100', icon: '💡' },
};

export function ConsultationPanel({ inputs }: Props) {
  const items = useMemo(() => diagnoseInputs(inputs), [inputs]);

  if (items.length === 0) return null;

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-bold text-[#1a2f5e]">自動診断・アドバイス</h3>

      <div className="space-y-3">
        {items.map((item, i) => {
          const style = TYPE_STYLES[item.type];
          return (
            <div
              key={i}
              className={`${style.bg} border ${style.border} rounded-xl p-4`}
            >
              <div className="flex items-start gap-3">
                <span className={`${style.iconBg} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
                  {style.icon}
                </span>
                <div className="flex-1 space-y-2">
                  <h4 className="font-bold text-sm text-gray-800">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <a
                    href={item.ctaHref}
                    className="inline-flex items-center gap-1 text-sm font-medium text-[#1a2f5e] hover:text-[#c9a84c] transition-colors"
                  >
                    {item.ctaLabel} &rarr;
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
