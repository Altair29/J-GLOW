'use client';

import { useState, useCallback, useMemo } from 'react';
import dynamic from 'next/dynamic';
import type { CostBreakdown, Step4Data, AllInputs } from '../lib/types';
import type { AllInputsV1 } from '../lib/types';
import { CostTable } from './CostTable';
import { ScheduleTimeline } from './ScheduleTimeline';
import { RiskAnalysis } from './RiskAnalysis';
import { ConsultationPanel } from './ConsultationPanel';
import { useAuth } from '@/hooks/useAuth';
import GateModal from './GateModal';
import { JP_HIRING_BENCHMARKS, INDUSTRY_COST_BENCHMARKS } from '../lib/constants';
import { generateActionPlan, getIndustryBenchmarkComparison, getOrderDeadline } from '../lib/calculate';
import type { VisaTypeV2 } from '../lib/types';

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

function formatMidYen(min: number, max: number): string {
  const mid = Math.round((min + max) / 2);
  return formatYen(mid);
}

function formatManYen(n: number): string {
  return `${Math.round(n / 10000)}万円`;
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

  // 育成就労かどうかの判定
  const hasIkusei = breakdowns.some((b) => b.visaType === 'ikusei');

  // 発注デッドライン算出
  const orderDeadlines = useMemo(() => {
    const startDate = allInputs?.step2.startDate ?? inputs.step2.startDate;
    const country = allInputs?.step2.sendingCountry ?? inputs.step2.sendingCountry;
    if (!startDate) return [];
    return breakdowns.map((b) => {
      const visaType = b.visaType as VisaTypeV2;
      const deadline = getOrderDeadline(startDate, visaType, country);
      return { visaLabel: b.visaLabel, deadline, visaType };
    });
  }, [breakdowns, allInputs, inputs]);

  // 日本人採用比較データ
  const industry = allInputs?.step1.industry ?? inputs.step1.industry;
  const jpBenchmark = JP_HIRING_BENCHMARKS[industry];

  // 業種別ベンチマーク比較
  const benchmarkComparison = useMemo(() => {
    if (!industry || breakdowns.length === 0) return null;
    return getIndustryBenchmarkComparison(
      industry,
      breakdowns[0].initialTotal,
      breakdowns[0].monthlyTotal,
    );
  }, [industry, breakdowns]);

  // アクションプラン
  const actionPlan = useMemo(() => {
    if (!allInputs) return null;
    return generateActionPlan(allInputs);
  }, [allInputs]);

  return (
    <div className="space-y-8">
      {/* 育成就労の制度注記バナー */}
      {hasIkusei && (
        <div className="p-4 bg-amber-50 border border-amber-300 rounded-xl">
          <p className="text-amber-800 text-sm font-medium">
            育成就労制度は2027年施行予定の新制度です。本試算は現時点で公表されている情報に基づいていますが、施行時に費用体系・受入条件が変更される可能性があります。
          </p>
          <a
            href="https://www.moj.go.jp/isa/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-amber-700 hover:underline mt-1 inline-block"
          >
            最新情報は出入国在留管理庁のサイトでご確認ください
          </a>
        </div>
      )}

      {/* 発注デッドラインバナー */}
      {orderDeadlines.length > 0 && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl">
          <h4 className="text-sm font-bold text-blue-800 mb-2">
            発注・契約のタイムリミット
          </h4>
          <div className="space-y-1.5">
            {orderDeadlines.map((d) => (
              <div key={d.visaType} className="flex items-center gap-2 text-sm">
                <span className="text-blue-600 shrink-0">&#9200;</span>
                <span className="text-blue-800">
                  <strong>{d.visaLabel}</strong>：<strong>{d.deadline}</strong>までに発注が必要です
                </span>
              </div>
            ))}
          </div>
          <p className="text-xs text-blue-500 mt-2">
            ※ 希望就労開始月から逆算したリードタイムに基づく目安です
          </p>
        </div>
      )}

      {/* 受入上限警告バナー */}
      {isOverCapacity && (
        <div className="p-4 bg-orange-50 border-2 border-orange-300 rounded-xl">
          <p className="text-orange-800 font-medium">
            育成就労の受入上限を超過しています（上限: {capacityLimit}人 / 希望: {inputs.step2.headcount}人）
          </p>
          <p className="text-sm text-orange-600 mt-1">
            常勤職員数を増やすか、特定技能での採用をご検討ください。
          </p>
        </div>
      )}

      {/* KPI Hero Section（中央値メイン表示） */}
      <div className="bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] rounded-xl p-6 md:p-8 text-white">
        <div className="text-center space-y-4">
          <p className="text-sm opacity-80">
            3年間総コスト（{inputs.step2.headcount}人分・リスク含む）
          </p>
          <p className="text-3xl md:text-4xl font-bold">
            {formatMidYen(maxBreakdown.threeYearTotal.min, maxBreakdown.threeYearTotal.max)}
          </p>
          {maxBreakdown.threeYearTotal.min !== maxBreakdown.threeYearTotal.max && (
            <p className="text-xs opacity-60">
              （{formatYen(maxBreakdown.threeYearTotal.min)} 〜 {formatYen(maxBreakdown.threeYearTotal.max)}）
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs opacity-80">1人あたり初期費用</p>
              <p className="text-lg font-bold mt-1">
                {formatMidYen(maxBreakdown.initialTotal.min, maxBreakdown.initialTotal.max)}
              </p>
              {maxBreakdown.initialTotal.min !== maxBreakdown.initialTotal.max && (
                <p className="text-xs opacity-50">
                  {formatYen(maxBreakdown.initialTotal.min)} 〜 {formatYen(maxBreakdown.initialTotal.max)}
                </p>
              )}
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs opacity-80">1人あたり月次費用</p>
              <p className="text-lg font-bold mt-1">
                {formatMidYen(maxBreakdown.monthlyTotal.min, maxBreakdown.monthlyTotal.max)} / 月
              </p>
              {maxBreakdown.monthlyTotal.min !== maxBreakdown.monthlyTotal.max && (
                <p className="text-xs opacity-50">
                  {formatYen(maxBreakdown.monthlyTotal.min)} 〜 {formatYen(maxBreakdown.monthlyTotal.max)}
                </p>
              )}
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <p className="text-xs opacity-80">リスクコスト</p>
              <p className="text-lg font-bold mt-1">
                {formatMidYen(maxBreakdown.riskTotal.min, maxBreakdown.riskTotal.max)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ゲスト向け: ぼかしオーバーレイで詳細を隠す */}
      <div className={isGuest ? 'relative' : ''}>
        {isGuest && (
          <div className="sticky top-20 z-30 flex flex-col items-center justify-center py-8 -mb-8">
            <div className="bg-white/95 backdrop-blur-sm border-2 border-[#1a2f5e]/20 rounded-2xl p-6 md:p-8 shadow-xl text-center max-w-md">
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-lg font-bold text-[#1a2f5e] mb-2">詳細な試算結果を確認する</h3>
              <p className="text-sm text-gray-600 mb-4">
                コスト内訳・日本人採用比較・リスク分析・アクションプランなどの詳細は、無料会員登録でご覧いただけます。
              </p>
              <ul className="text-left text-xs text-gray-500 space-y-1.5 mb-5 max-w-xs mx-auto">
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>コスト内訳の完全表示</li>
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>日本人採用との比較表</li>
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>リスク分析・診断</li>
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>PDF提案書ダウンロード</li>
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>結果のURL共有・保存</li>
              </ul>
              <a
                href={`/register/business?returnUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '/business/cost-simulator')}&from=simulator`}
                className="inline-block w-full px-6 py-3 rounded-lg font-bold text-base transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
              >
                無料会員登録して詳細を見る &rarr;
              </a>
              <p className="text-xs text-gray-400 mt-3">
                <a href={`/login?returnUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '/business/cost-simulator')}`} className="text-[#1a2f5e] hover:underline">
                  すでにアカウントをお持ちの方はログイン
                </a>
              </p>
            </div>
          </div>
        )}

        <div className={isGuest ? 'blur-[6px] select-none pointer-events-none' : ''} aria-hidden={isGuest}>
          {/* 業種別ベンチマーク比較 */}
          {benchmarkComparison && (
            <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
              <h3 className="text-sm font-bold text-[#1a2f5e] mb-3">業界平均との比較</h3>
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  benchmarkComparison.initialDiff <= -10
                    ? 'bg-green-100 text-green-700'
                    : benchmarkComparison.initialDiff <= 10
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-orange-100 text-orange-700'
                }`}>
                  {benchmarkComparison.label}
                </span>
                <span className="text-sm text-gray-600">
                  初期費用: 業界平均比 {benchmarkComparison.initialDiff > 0 ? '+' : ''}{benchmarkComparison.initialDiff}%
                  ／月次費用: {benchmarkComparison.monthlyDiff > 0 ? '+' : ''}{benchmarkComparison.monthlyDiff}%
                </span>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                ※ 業界平均は各種調査データに基づく参考値です
              </p>
            </div>
          )}

          {/* コスト比較テーブル */}
          <div className="mt-8">
            <CostTable breakdowns={breakdowns} headcount={inputs.step2.headcount} />
          </div>

          {/* 日本人採用との比較 */}
          {jpBenchmark && (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-[#1a2f5e]">日本人採用との比較（参考）</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#1a2f5e] text-white">
                      <th className="px-4 py-3 text-left">比較項目</th>
                      <th className="px-4 py-3 text-right">外国人採用（今回の試算）</th>
                      <th className="px-4 py-3 text-right">日本人採用（業種平均）</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">採用初期費用 / 人</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#1a2f5e]">
                        {formatMidYen(maxBreakdown.initialTotal.min, maxBreakdown.initialTotal.max)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {formatYen(jpBenchmark.adCostPerHire.min)} 〜 {formatYen(jpBenchmark.adCostPerHire.max)}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">月次給与（企業負担込み）</td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-[#1a2f5e]">
                        {formatMidYen(maxBreakdown.monthlyTotal.min, maxBreakdown.monthlyTotal.max)}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        {formatYen(Math.round(jpBenchmark.averageMonthlyWage * 1.165))}
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">有効求人倍率</td>
                      <td className="px-4 py-3 text-right text-green-600 font-bold">
                        監理団体/機関経由で高い採用成功率
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-orange-600">
                        {jpBenchmark.effectiveJobOpeningsRatio}倍
                      </td>
                    </tr>
                    <tr className="border-b border-gray-100">
                      <td className="px-4 py-3 text-gray-700">紹介手数料率</td>
                      <td className="px-4 py-3 text-right font-mono text-[#1a2f5e]">
                        送出機関費（定額）
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        年収の{Math.round(jpBenchmark.agencyFeeRate * 100)}%
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-gray-400">
                ※ 日本人採用データは厚生労働省 一般職業紹介状況、リクルートワークス研究所等の業種別平均に基づく参考値です。
                有効求人倍率が高い業種ほど日本人の採用が困難であり、外国人採用の合理性が高まります。
              </p>
            </div>
          )}

          {/* 逆算スケジュール */}
          <div className="mt-8">
            <ScheduleTimeline
              visaChoice={inputs.step2.visaChoice}
              targetChoice={inputs.step2.targetChoice}
              startDate={inputs.step2.startDate}
            />
          </div>

          {/* リスク分析 */}
          <div className="mt-8">
            <RiskAnalysis
              headcount={inputs.step2.headcount}
              initialCostPerPerson={maxBreakdown.initialTotal}
              visaChoice={allInputs?.step2.visaChoice}
            />
          </div>

          {/* 自動診断 */}
          {allInputs && (
            <div className="mt-8">
              <ConsultationPanel inputs={allInputs} breakdowns={breakdowns} />
            </div>
          )}

          {/* アクションプラン */}
          {actionPlan && actionPlan.length > 0 && (
            <div className="space-y-4 mt-8">
              <h3 className="text-lg font-bold text-[#1a2f5e]">推奨アクションプラン</h3>
              <div className="space-y-4">
                {actionPlan.map((step, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#1a2f5e] text-white text-xs font-bold shrink-0">
                        {i + 1}
                      </span>
                      <h4 className="font-bold text-sm text-[#1a2f5e]">{step.phase}</h4>
                    </div>
                    <ul className="space-y-2 pl-10">
                      {step.tasks.map((task, j) => (
                        <li key={j} className="flex items-start gap-2">
                          <span className="text-gray-400 mt-0.5 shrink-0">&#9744;</span>
                          <div>
                            <span className="text-sm text-gray-700">{task.label}</span>
                            {task.ctaHref && (
                              <a
                                href={task.ctaHref}
                                className="inline-flex items-center gap-1 ml-2 text-xs font-medium text-[#1a2f5e] hover:text-[#c9a84c] transition-colors"
                              >
                                {task.ctaLabel} &rarr;
                              </a>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

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
              ? 'URLで共有（無料登録が必要）'
              : shareUrl
                ? '✓ コピーしました'
                : sharing
                  ? '共有URL作成中...'
                  : 'URLをコピー'}
          </button>

          {/* PDF出力 */}
          {isGuest ? (
            <button
              onClick={() => setShowGate(true)}
              className="px-6 py-3 bg-[#c9a84c] text-white rounded-lg text-sm font-medium hover:bg-[#c9a84c]/90 transition-colors"
            >
              PDF提案書を作成（無料登録が必要）
            </button>
          ) : (
            <PdfDocument
              inputs={inputs}
              allInputs={allInputs}
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
                  このプリセットを保存
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

        {/* ゲスト向けCTAバナー（ログイン済みだが非会員の場合用） */}
        {!isLoggedIn && !isGuest && (
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
