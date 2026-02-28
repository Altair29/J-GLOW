'use client';

import type { Step2Data, VisaChoice, TargetChoice, SendingCountry } from './CostSimulatorShell';

type Props = {
  data: Step2Data;
  onChange: (data: Step2Data) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  capacityLimit: number;
  isOverCapacity: boolean;
  visaChoice: VisaChoice;
};

const SENDING_COUNTRIES: { value: SendingCountry; label: string }[] = [
  { value: 'vietnam', label: 'ベトナム' },
  { value: 'indonesia', label: 'インドネシア' },
  { value: 'philippines', label: 'フィリピン' },
  { value: 'myanmar', label: 'ミャンマー' },
  { value: 'other', label: 'その他' },
];

function generateMonthOptions(): { value: string; label: string }[] {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i <= 24; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    const val = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    options.push({ value: val, label });
  }
  return options;
}

export function Step2Plan({
  data,
  onChange,
  onNext,
  onBack,
  canProceed,
  capacityLimit,
  isOverCapacity,
  visaChoice,
}: Props) {
  const update = <K extends keyof Step2Data>(key: K, value: Step2Data[K]) =>
    onChange({ ...data, [key]: value });

  const monthOptions = generateMonthOptions();

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#1a2f5e] flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2f5e] text-white text-sm font-bold">2</span>
        採用計画
      </h2>

      {/* 在留資格 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          在留資格 <span className="text-red-500">*</span>
        </label>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {([
            { value: 'ikusei', label: '育成就労', desc: '3年間・海外から' },
            { value: 'tokutei', label: '特定技能1号', desc: '最大5年・国内外' },
            { value: 'both', label: '両方比較', desc: '並列で比較表示' },
          ] as const).map(({ value, label, desc }) => (
            <button
              key={value}
              onClick={() => update('visaChoice', value)}
              className={`p-4 rounded-lg border-2 text-left transition-all ${
                data.visaChoice === value
                  ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-medium text-sm">{label}</div>
              <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* 対象者区分（特定技能選択時のみ） */}
      {(data.visaChoice === 'tokutei' || data.visaChoice === 'both') && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            対象者区分 <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {([
              { value: 'kaigai', label: '海外在住', desc: '現地から採用' },
              { value: 'kokunai', label: '国内在籍', desc: '国内転職・切替' },
              { value: 'both', label: '両方比較', desc: '並列で比較表示' },
            ] as const).map(({ value, label, desc }) => (
              <button
                key={value}
                onClick={() => update('targetChoice', value)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  data.targetChoice === value
                    ? 'border-[#1a2f5e] bg-[#1a2f5e]/5'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="font-medium text-sm">{label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{desc}</div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 採用希望人数 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          採用希望人数 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-4">
          <input
            type="range"
            min={1}
            max={30}
            value={data.headcount}
            onChange={(e) => update('headcount', Number(e.target.value))}
            className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#1a2f5e]"
            aria-valuenow={data.headcount}
            aria-valuemin={1}
            aria-valuemax={30}
            aria-label="採用希望人数"
          />
          <div className="flex items-center gap-1">
            <input
              type="number"
              min={1}
              max={30}
              value={data.headcount}
              onChange={(e) => update('headcount', Math.max(1, Math.min(30, Number(e.target.value))))}
              className="w-16 px-2 py-1.5 border border-gray-300 rounded-lg text-center text-sm focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
            />
            <span className="text-sm text-gray-600">人</span>
          </div>
        </div>

        {/* 受入上限警告 */}
        {isOverCapacity && (
          <div className="mt-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
            <p className="text-sm text-orange-700">
              ⚠️ 育成就労の受入上限は<strong>{capacityLimit}人</strong>です（常勤職員数÷20）。
              希望人数が上限を超えています。
            </p>
          </div>
        )}
      </div>

      {/* 入国・就労開始希望時期 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          入国・就労開始希望時期 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.startDate}
          onChange={(e) => update('startDate', e.target.value)}
          className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none bg-white"
        >
          {monthOptions.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* 送出国 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          送出国 <span className="text-red-500">*</span>
        </label>
        <select
          value={data.sendingCountry}
          onChange={(e) => update('sendingCountry', e.target.value as SendingCountry)}
          className="w-full md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none bg-white"
        >
          {SENDING_COUNTRIES.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      {/* 職種 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          職種・作業内容 <span className="text-gray-400 text-xs">（任意）</span>
        </label>
        <input
          type="text"
          value={data.jobCategory}
          onChange={(e) => update('jobCategory', e.target.value)}
          placeholder="例：プレス加工、溶接、介護"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
        />
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
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-[#1a2f5e] text-white hover:bg-[#1a2f5e]/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          次へ →
        </button>
      </div>
    </div>
  );
}
