'use client';

import { useState } from 'react';
import type { Step4Data } from './CostSimulatorShell';
import type { SimulatorCostItem, SimulatorOrgPreset } from '@/types/database';
import { CustomizePanel } from './CustomizePanel';
import { PresetManager } from './PresetManager';

type Props = {
  data: Step4Data;
  onChange: (data: Step4Data) => void;
  onNext: () => void;
  onBack: () => void;
  presets: SimulatorOrgPreset[];
  onLoadPreset: (preset: SimulatorOrgPreset) => void;
  onDeletePreset: (id: string) => void;
  costItems: SimulatorCostItem[];
  activePreset: SimulatorOrgPreset | null;
  onUpdatePresetCustom: (
    customItems: SimulatorOrgPreset['custom_items'],
    removedKeys: string[],
  ) => void;
  isLoggedIn: boolean;
};

export function Step4Organization({
  data,
  onChange,
  onNext,
  onBack,
  presets,
  onLoadPreset,
  onDeletePreset,
  costItems,
  activePreset,
  onUpdatePresetCustom,
  isLoggedIn,
}: Props) {
  const [showCustomize, setShowCustomize] = useState(false);

  const update = <K extends keyof Step4Data>(key: K, value: Step4Data[K]) =>
    onChange({ ...data, [key]: value });

  const isProposalMode = !!(data.orgName || data.orgContact);

  return (
    <div className="space-y-6">
      <h2 className="text-lg font-bold text-[#1a2f5e] flex items-center gap-2">
        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-[#1a2f5e] text-white text-sm font-bold">4</span>
        団体情報
        <span className="text-xs text-gray-400 font-normal ml-2">（監理団体・登録支援機関の方向け）</span>
      </h2>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
        <p className="text-sm text-blue-700">
          団体名または担当者名を入力すると「提案書モード」が有効になり、団体のブランドでPDF提案書を出力できます。
          入力しない場合は「J-GLOW 試算レポート」として出力されます。
        </p>
      </div>

      {/* プリセット読み込み（ログインユーザーのみ） */}
      {isLoggedIn && presets.length > 0 && (
        <PresetManager
          presets={presets}
          onLoad={onLoadPreset}
          onDelete={onDeletePreset}
          activePresetId={activePreset?.id ?? null}
        />
      )}

      {/* 団体名 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          団体名 <span className="text-gray-400 text-xs">（任意）</span>
        </label>
        <input
          type="text"
          value={data.orgName}
          onChange={(e) => update('orgName', e.target.value)}
          placeholder="例：◯◯協同組合"
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
          value={data.orgContact}
          onChange={(e) => update('orgContact', e.target.value)}
          placeholder="例：山田太郎"
          className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
        />
      </div>

      {/* 監理費/支援費 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          監理費/支援費（月額・税別） <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={data.managementFee}
            onChange={(e) => update('managementFee', Math.max(0, Number(e.target.value)))}
            placeholder="例：30000"
            className="w-40 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
          />
          <span className="text-sm text-gray-600">円/月</span>
        </div>
      </div>

      {/* 入会金 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          入会金・加入費 <span className="text-gray-400 text-xs">（任意）</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={data.enrollmentFee}
            onChange={(e) => update('enrollmentFee', Math.max(0, Number(e.target.value)))}
            placeholder="0"
            className="w-40 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
          />
          <span className="text-sm text-gray-600">円</span>
        </div>
      </div>

      {/* 送出機関手数料上書き */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          送出機関手数料目安 <span className="text-gray-400 text-xs">（任意・上書き）</span>
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={0}
            value={data.sendingOrgFeeOverride ?? ''}
            onChange={(e) => {
              const v = e.target.value;
              update('sendingOrgFeeOverride', v === '' ? null : Math.max(0, Number(v)));
            }}
            placeholder="送出国デフォルト値を使用"
            className="w-48 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#1a2f5e]/20 focus:border-[#1a2f5e] outline-none"
          />
          <span className="text-sm text-gray-600">円</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">空欄の場合、送出国のデフォルト値が使用されます</p>
      </div>

      {/* ブランドカラー */}
      {isProposalMode && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            PDFアクセントカラー
          </label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={data.brandColor}
              onChange={(e) => update('brandColor', e.target.value)}
              className="w-10 h-10 rounded border border-gray-300 cursor-pointer"
            />
            <input
              type="text"
              value={data.brandColor}
              onChange={(e) => update('brandColor', e.target.value)}
              className="w-28 px-3 py-1.5 border border-gray-300 rounded-lg text-sm font-mono"
            />
          </div>
        </div>
      )}

      {/* カスタマイズセクション（ログインユーザーのみ） */}
      {isLoggedIn && activePreset && (
        <div className="border-t pt-4">
          <button
            onClick={() => setShowCustomize(!showCustomize)}
            className="text-sm text-[#1a2f5e] hover:underline font-medium"
          >
            {showCustomize ? '▼ コスト項目のカスタマイズを閉じる' : '▶ コスト項目をカスタマイズする'}
          </button>
          {showCustomize && (
            <div className="mt-4">
              <CustomizePanel
                masterItems={costItems}
                preset={activePreset}
                onUpdate={onUpdatePresetCustom}
              />
            </div>
          )}
        </div>
      )}

      {/* ゲスト向けカスタマイズCTA */}
      {!isLoggedIn && (
        <div className="border-t pt-4">
          <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
            <p className="text-sm text-gray-600">
              変数をカスタマイズしたい方は
              <a href="/register/business" className="text-[#1a2f5e] font-bold hover:underline mx-1">無料会員登録</a>
              へ
            </p>
            <p className="text-xs text-gray-400 mt-1">
              会員登録すると、コスト項目のカスタマイズ・プリセット保存・結果のURL共有が使えます。
            </p>
          </div>
        </div>
      )}

      {/* 提案書モードバッジ */}
      {isProposalMode && (
        <div className="p-3 bg-[#c9a84c]/10 rounded-lg border border-[#c9a84c]/30">
          <p className="text-sm text-[#8a6d2b] font-medium">
            ✨ 提案書モード ON — PDFに団体名・担当者名が表示されます
          </p>
        </div>
      )}

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
          className="px-8 py-3 rounded-lg font-medium bg-[#c9a84c] text-white hover:bg-[#c9a84c]/90 transition-all"
        >
          結果を見る →
        </button>
      </div>
    </div>
  );
}
