'use client';

import type { Step3Data, HousingChoice, TrainingChoice, SupportChoice } from './CostSimulatorShell';

type Props = {
  data: Step3Data;
  onChange: (data: Step3Data) => void;
  onNext: () => void;
  onBack: () => void;
};

export function Step3Environment({ data, onChange, onNext, onBack }: Props) {
  const update = <K extends keyof Step3Data>(key: K, value: Step3Data[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#1a2f5e] flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2f5e] text-white text-sm font-bold">3</span>
        自社環境
      </h2>

      {/* 寮・住居の提供 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          寮・住居の提供 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { value: 'full', label: 'あり（全額負担）', desc: '寮の初期費用・月額を企業負担', icon: '🏠' },
            { value: 'partial', label: '補助のみ', desc: '家賃の一部を補助', icon: '🔑' },
            { value: 'none', label: 'なし', desc: '住居は本人負担', icon: '—' },
          ] as const).map(({ value, label, desc, icon }) => (
            <button
              key={value}
              onClick={() => update('housing', value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.housing === value
                  ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 日本語研修の実施方式 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          日本語研修の実施方式 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { value: 'outsource', label: '外注する', desc: '入国前・後ともに外注', icon: '📚' },
            { value: 'inhouse', label: '内製する', desc: '自社スタッフが研修実施', icon: '👩‍🏫' },
            { value: 'pre_only', label: '入国前のみ外注', desc: '入国後は自社対応', icon: '✈️' },
          ] as const).map(({ value, label, desc, icon }) => (
            <button
              key={value}
              onClick={() => update('training', value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.training === value
                  ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 通訳・生活支援 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          通訳・生活支援 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {([
            { value: 'outsource', label: '外部委託', desc: '通訳・生活支援を外部に委託', icon: '🤝' },
            { value: 'inhouse', label: '自社対応', desc: '社内スタッフが対応', icon: '👥' },
          ] as const).map(({ value, label, desc, icon }) => (
            <button
              key={value}
              onClick={() => update('support', value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.support === value
                  ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-xl mb-1">{icon}</div>
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ナビボタン */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          ← 戻る
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-lg font-medium bg-[#1a2f5e] text-white hover:bg-[#1a2f5e]/90 transition-all"
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
