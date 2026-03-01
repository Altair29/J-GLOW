'use client';

import { useState } from 'react';
import type { MsimChoice, MsimDelayedEffect } from '../lib/types';

type ChoiceWithEffects = MsimChoice & { msim_delayed_effects: MsimDelayedEffect[] };

type Props = {
  choices: ChoiceWithEffects[];
  onChoice: (choice: ChoiceWithEffects) => void;
};

export default function ChoiceButtons({ choices, onChoice }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const handleClick = (choice: ChoiceWithEffects) => {
    if (selected) return; // 二重クリック防止
    setSelected(choice.id);
    setTimeout(() => onChoice(choice), 200);
  };

  const sorted = [...choices].sort((a, b) => a.sort_order - b.sort_order);

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
        あなたの判断は？
      </h4>
      <p className="text-[11px] text-gray-500 leading-relaxed mb-3">
        あなたが本当の経営者ならどうしますか？ 正解はありません。直感で選んでください。
        実際に自分が下す判断を重ねることで、外国人雇用の経営リスクとリターンを事前に体験し、未来を見通す力を養えます。
      </p>
      {sorted.map((choice, i) => {
        const isSelected = selected === choice.id;
        const isDisabled = selected !== null && !isSelected;

        return (
          <button
            key={choice.id}
            onClick={() => handleClick(choice)}
            disabled={isDisabled}
            className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
              isSelected
                ? 'border-[#c9a84c] bg-amber-50 shadow-md scale-[1.01]'
                : isDisabled
                  ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                  : 'border-gray-200 hover:border-[#1a2f5e]/30 hover:shadow-sm hover:bg-slate-50'
            }`}
          >
            <div className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${
                  isSelected
                    ? 'bg-[#c9a84c] text-white'
                    : 'bg-[#1a2f5e]/10 text-[#1a2f5e]'
                }`}
              >
                {String.fromCharCode(65 + i)}
              </div>
              <div>
                <div className={`text-sm font-bold ${isSelected ? 'text-[#1a2f5e]' : 'text-gray-700'}`}>
                  {choice.label}
                </div>
                {choice.description && (
                  <div className="text-xs text-gray-500 mt-0.5">{choice.description}</div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
