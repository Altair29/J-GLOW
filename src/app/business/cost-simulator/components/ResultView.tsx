'use client';

import { useState, useCallback } from 'react';
import dynamic from 'next/dynamic';
import type { CostBreakdown, Step4Data, AllInputs } from '../lib/types';
import type { AllInputsV1 } from '../lib/types';
import { CostTable } from './CostTable';
import { ScheduleTimeline } from './ScheduleTimeline';
import { RiskAnalysis } from './RiskAnalysis';
import { ConsultationPanel } from './ConsultationPanel';
import { useAuth } from '@/hooks/useAuth';
import GateModal from './GateModal';

const PdfDocument = dynamic(() => import('./PdfDocument').then((m) => m.PdfDownloadButton), {
  ssr: false,
  loading: () => (
    <button disabled className="px-6 py-3 bg-gray-200 text-gray-400 rounded-lg text-sm">
      PDF読み込み中...
    </button>
  ),
});

type Props = {
  inputs: AllInputsV1;
  allInputs?: AllInputs;
  breakdowns: CostBreakdown[];
  isOverCapacity: boolean;
  capacityLimit: number;
  isProposalMode: boolean;
  onBack: () => void;
  onShare: () => Promise<void>;
  shareUrl: string | null;
  onSavePreset: (name: string) => Promise<boolean>;
  onRestart: () => void;
  step4: Step4Data;
  isLoggedIn: boolean;
};

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

export function ResultView({
  inputs,
  allInputs,
  breakdowns,
  isOverCapacity,
  capacityLimit,
  isProposalMode,
  onBack,
  onShare,
  shareUrl,
  onSavePreset,
  onRestart,
  step4,
  isLoggedIn,
}: Props) {
  const { user, loading: authLoading } = useAuth();
  const isGuest = !authLoading && !user;
  const [showGate, setShowGate] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showPresetForm, setShowPresetForm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sharing, setSharing] = useState(false);

  const handleShare = useCallback(async () => {
    setSharing(true);
    await onShare();
    setSharing(false);
  }, [onShare]);

  const handleSave = useCallback(async () => {
    if (!presetName.trim()) return;
    setSaving(true);
    const ok = await onSavePreset(presetName.trim());
    setSaving(false);
    if (ok) {
      setShowPresetForm(false);
      setPresetName('');
    }
  }, [presetName, onSavePreset]);

  const maxBreakdown = breakdowns.reduce(
    (a, b) => (b.threeYearTotal.max > a.threeYearTotal.max ? b : a),
    breakdowns[0],
  );

  return (
    <div className="space-y-8">
      {/* 受入上限警告バナー */}
      {isOverCapacity && (
        <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-xl">
          <p className="text-orange-800 font-medium">
            ⚠️ 育成就労の受入上限を超過しています（上限: {capacityLimit}人 / 希望: {inputs.step2.headcount}人）
          </p>
          <p className="text-sm text-orange-600 mt-1">
            常勤職員数を増やすか、特定技能での採用をご検討ください。
          </p>
        </div>
      )}

      {/* KPI Hero Section */}
      <div className="bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] rounded-xl p-6 md:p-8 text-white">
        <div className="text-center space-y-4">
          <p className="text-sm opacity-80">
            3年間総コスト（{inputs.step2.headcount}人分・リスク含む）
          </p>
          <p className="text-3xl md:text-4xl font-bold">
            {formatYen(maxBreakdown.threeYearTotal.min)}
            {maxBreakdown.threeYearTotal.min !== maxBreakdown.threeYearTotal.max && (
              <span> 〜 {formatYen(maxBreakdown.threeYearTotal.max)}</span>
            )}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs opacity-80">1人あたり初期費用</p>
              <p className="text-lg font-bold mt-1">
                {formatYen(maxBreakdown.initialTotal.min)} 〜 {formatYen(maxBreakdown.initialTotal.max)}
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs opacity-80">1人あたり月次費用</p>
              <p className="text-lg font-bold mt-1">
                {formatYen(maxBreakdown.monthlyTotal.min)} 〜 {formatYen(maxBreakdown.monthlyTotal.max)} / 月
              </p>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs opacity-80">リスクコスト</p>
              <p className="text-lg font-bold mt-1">
                {formatYen(maxBreakdown.riskTotal.min)}
                {maxBreakdown.riskTotal.min !== maxBreakdown.riskTotal.max && (
                  <span> 〜 {formatYen(maxBreakdown.riskTotal.max)}</span>
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* コスト比較テーブル */}
      <CostTable breakdowns={breakdowns} headcount={inputs.step2.headcount} />

      {/* 逆算スケジュール */}
      <ScheduleTimeline
        visaChoice={inputs.step2.visaChoice}
        targetChoice={inputs.step2.targetChoice}
        startDate={inputs.step2.startDate}
      />

      {/* リスク分析 */}
      <RiskAnalysis
        headcount={inputs.step2.headcount}
        initialCostPerPerson={maxBreakdown.initialTotal}
      />

      {/* 自動診断 */}
      {allInputs && (
        <ConsultationPanel inputs={allInputs} />
      )}

      {/* アクションボタンエリア */}
      <div className="border-t pt-6 space-y-4">
        <div className="flex flex-wrap gap-3">
          {/* URL共有 */}
          <button
            onClick={isGuest ? () => setShowGate(true) : handleShare}
            disabled={!isGuest && sharing}
            className="px-6 py-3 bg-white border-2 border-[#1a2f5e] text-[#1a2f5e] rounded-lg text-sm font-medium hover:bg-[#1a2f5e]/5 transition-colors disabled:opacity-50"
          >
            {isGuest
              ? '🔗 URLで共有（無料登録が必要）'
              : shareUrl
                ? '✓ コピーしました'
                : sharing
                  ? '共有URL作成中...'
                  : '🔗 URLをコピー'}
          </button>

          {/* PDF出力 */}
          {isGuest ? (
            <button
              onClick={() => setShowGate(true)}
              className="px-6 py-3 bg-[#c9a84c] text-white rounded-lg text-sm font-medium hover:bg-[#c9a84c]/90 transition-colors"
            >
              📄 PDF提案書を作成（無料登録が必要）
            </button>
          ) : (
            <PdfDocument
              inputs={inputs}
              breakdowns={breakdowns}
              step4={step4}
              isProposalMode={isProposalMode}
            />
          )}

          {/* プリセット保存 */}
          {isLoggedIn && (
            <>
              {!showPresetForm ? (
                <button
                  onClick={() => setShowPresetForm(true)}
                  className="px-6 py-3 bg-white border-2 border-[#c9a84c] text-[#8a6d2b] rounded-lg text-sm font-medium hover:bg-[#c9a84c]/10 transition-colors"
                >
                  💾 このプリセットを保存
                </button>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={presetName}
                    onChange={(e) => setPresetName(e.target.value)}
                    placeholder="プリセット名"
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm w-40"
                    autoFocus
                  />
                  <button
                    onClick={handleSave}
                    disabled={!presetName.trim() || saving}
                    className="px-4 py-2 bg-[#c9a84c] text-white rounded-lg text-sm disabled:opacity-50"
                  >
                    {saving ? '保存中...' : '保存'}
                  </button>
                  <button
                    onClick={() => setShowPresetForm(false)}
                    className="px-3 py-2 text-gray-400 hover:text-gray-600 text-sm"
                  >
                    ✕
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        {/* ゲスト向けCTAバナー */}
        {!isLoggedIn && (
          <div className="p-4 bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] rounded-xl text-white">
            <p className="text-sm font-bold mb-1">
              結果の保存・カスタマイズをしたい方へ
            </p>
            <p className="text-xs text-blue-200 mb-3">
              無料会員登録すると、プリセット保存・コスト項目のカスタマイズ・結果のURL共有が使えます。
            </p>
            <a
              href="/register/business"
              className="inline-block text-sm font-bold px-6 py-2 rounded-lg transition-opacity hover:opacity-90"
              style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
            >
              無料会員登録へ &rarr;
            </a>
          </div>
        )}
      </div>

      {/* ナビゲーション */}
      <div className="flex justify-between pt-4 border-t">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg font-medium text-gray-600 hover:bg-gray-100 transition-colors"
        >
          &larr; 入力に戻る
        </button>
        <button
          onClick={onRestart}
          className="px-6 py-3 rounded-lg font-medium text-[#1a2f5e] hover:bg-[#1a2f5e]/5 transition-colors"
        >
          新しい試算を始める
        </button>
      </div>

      {/* 免責 */}
      <p className="text-xs text-gray-400 text-center">
        ※ 表示金額はあくまでも目安です。実際の費用は監理団体・登録支援機関にご確認ください。
      </p>

      {showGate && <GateModal onClose={() => setShowGate(false)} />}
    </div>
  );
}
