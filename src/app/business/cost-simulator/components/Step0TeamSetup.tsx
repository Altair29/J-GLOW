'use client';

import type { Step0Data } from '../lib/types';
import type { SimulatorOrgPreset } from '@/types/database';
import { PresetManager } from './PresetManager';

type Props = {
  data: Step0Data;
  onChange: (data: Step0Data) => void;
  onNext: () => void;
  onBack: () => void;
  canProceed: boolean;
  presets: SimulatorOrgPreset[];
  onLoadPreset: (preset: SimulatorOrgPreset) => void;
  onDeletePreset: (id: string) => Promise<void>;
  isLoggedIn: boolean;
};

export function Step0TeamSetup({
  data,
  onChange,
  onNext,
  onBack,
  canProceed,
  presets,
  onLoadPreset,
  onDeletePreset,
  isLoggedIn,
}: Props) {
  const update = <K extends keyof Step0Data>(key: K, value: Step0Data[K]) =>
    onChange({ ...data, [key]: value });

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#1a2f5e] flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2f5e] text-white text-sm font-bold">1</span>
        監理団体・登録支援機関の情報
      </h2>

      {/* プリセット（ログイン時のみ） */}
      {isLoggedIn && presets.length > 0 && (
        <PresetManager
          presets={presets}
          onLoad={onLoadPreset}
          onDelete={onDeletePreset}
          activePresetId={null}
        />
      )}

      {/* 団体名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          団体名 <span className="text-gray-400 text-xs">（任意・提案書に表示）</span>
        </label>
        <input
          type="text"
          value={data.orgName}
          onChange={(e) => update('orgName', e.target.value)}
          placeholder="例：◯◯監理協同組合"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
        />
      </div>

      {/* 担当者名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          担当者名 <span className="text-gray-400 text-xs">（任意）</span>
        </label>
        <input
          type="text"
          value={data.staffName}
          onChange={(e) => update('staffName', e.target.value)}
          placeholder="例：田中太郎"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
        />
      </div>

      {/* 月額監理費 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          月額監理費・支援費 <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <span className="text-gray-500">¥</span>
          <input
            type="number"
            min={0}
            value={data.managementFee}
            onChange={(e) => update('managementFee', Math.max(0, Number(e.target.value)))}
            placeholder="例：35000"
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
          />
          <span className="text-sm text-gray-500">/ 月・人</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          コスト試算に反映されます。相場は25,000〜50,000円/月です
        </p>
      </div>

      {/* 詳細設定（トグル） */}
      <details className="border border-gray-200 rounded-lg">
        <summary className="px-4 py-3 text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-50">
          詳細を入力する（入会金・送出機関手数料・ブランドカラー）
        </summary>
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* 入会金 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              入会金 <span className="text-gray-400 text-xs">（任意）</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">¥</span>
              <input
                type="number"
                min={0}
                value={data.enrollmentFee}
                onChange={(e) => update('enrollmentFee', Math.max(0, Number(e.target.value)))}
                placeholder="例：100000"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
              />
            </div>
          </div>

          {/* 送出機関手数料 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              送出機関手数料（上書き） <span className="text-gray-400 text-xs">（任意）</span>
            </label>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">¥</span>
              <input
                type="number"
                min={0}
                value={data.sendingOrgFeeOverride ?? ''}
                onChange={(e) => {
                  const v = e.target.value;
                  update('sendingOrgFeeOverride', v === '' ? null : Math.max(0, Number(v)));
                }}
                placeholder="未入力の場合は送出国別デフォルト"
                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
              />
            </div>
          </div>

          {/* ブランドカラー */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ブランドカラー <span className="text-gray-400 text-xs">（PDF提案書のアクセントカラー）</span>
            </label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={data.brandColor}
                onChange={(e) => update('brandColor', e.target.value)}
                className="w-10 h-10 rounded cursor-pointer border border-gray-300"
              />
              <span className="text-sm text-gray-500 font-mono">{data.brandColor}</span>
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
          disabled={!canProceed}
          className={`px-8 py-3 rounded-lg font-medium transition-all ${
            canProceed
              ? 'bg-[#1a2f5e] text-white hover:bg-[#1a2f5e]/90'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          次へ &rarr;
        </button>
      </div>
    </div>
  );
}
