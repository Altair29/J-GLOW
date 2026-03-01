'use client';

import type { Step3Data } from '../lib/types';

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
            { value: 'full', label: 'あり（全額負担）', desc: '寮の初期費用・月額を企業負担', impact: '初期20〜50万円 + 月2〜5万円', icon: '🏠' },
            { value: 'partial', label: '補助のみ', desc: '家賃の一部を補助', impact: '月1〜3万円', icon: '🔑' },
            { value: 'none', label: 'なし', desc: '住居は本人負担', impact: '住居費0円', icon: '—' },
          ] as const).map(({ value, label, desc, impact, icon }) => (
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
              <div className="text-xs text-[#1a2f5e]/60 mt-1 font-mono">{impact}</div>
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
            { value: 'outsource', label: '外注する', desc: '入国前・後ともに外注', impact: '初期10〜30万 + 月1〜3万', icon: '📚' },
            { value: 'inhouse', label: '内製する', desc: '自社スタッフが研修実施', impact: '外部研修費0円', icon: '👩‍🏫' },
            { value: 'pre_only', label: '入国前のみ外注', desc: '入国後は自社対応', impact: '初期のみ10〜30万', icon: '✈️' },
          ] as const).map(({ value, label, desc, impact, icon }) => (
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
              <div className="text-xs text-[#1a2f5e]/60 mt-1 font-mono">{impact}</div>
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
            { value: 'outsource', label: '外部委託', desc: '通訳・生活支援を外部に委託', impact: '月1〜3万円/人', icon: '🤝' },
            { value: 'inhouse', label: '自社対応', desc: '社内スタッフが対応', impact: '外部委託費0円', icon: '👥' },
          ] as const).map(({ value, label, desc, impact, icon }) => (
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
              <div className="text-xs text-[#1a2f5e]/60 mt-1 font-mono">{impact}</div>
            </button>
          ))}
        </div>
      </div>

      {/* v2: もっと詳しく入力する */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
          もっと詳しく入力する
        </summary>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* 住居月額 */}
          {data.housing !== 'none' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                寮の月額家賃（実費入力）
              </label>
              <div className="flex items-center gap-2">
                <span className="text-gray-500">¥</span>
                <input
                  type="number"
                  min={0}
                  value={data.housingMonthlyRent ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    update('housingMonthlyRent', v === '' ? null : Math.max(0, Number(v)));
                  }}
                  placeholder="未入力時はデフォルト値で試算"
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
                />
                <span className="text-sm text-gray-500">/ 月</span>
              </div>
            </div>
          )}

          {/* 通訳状況 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              社内通訳の状況
            </label>
            <div className="grid grid-cols-3 gap-3">
              {([
                { value: 'needed', label: '必要', desc: '外部通訳が必要' },
                { value: 'existing', label: '社内にいる', desc: '対応可能スタッフ在籍' },
                { value: 'unnecessary', label: '不要', desc: '母語対応不要' },
              ] as const).map(({ value, label, desc }) => (
                <button
                  key={value}
                  onClick={() => update('interpreterStatus', data.interpreterStatus === value ? null : value)}
                  className={`p-3 rounded-lg border-2 text-left transition-all text-sm ${
                    data.interpreterStatus === value
                      ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="font-medium">{label}</div>
                  <div className="text-xs text-gray-500">{desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </details>

      {/* ナビボタン */}
      <div className="flex justify-between pt-4">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          &larr; 戻る
        </button>
        <button
          onClick={onNext}
          className="px-8 py-3 rounded-lg font-medium bg-[#1a2f5e] text-white hover:bg-[#1a2f5e]/90 transition-all"
        >
          結果を見る &rarr;
        </button>
      </div>
    </div>
  );
}
