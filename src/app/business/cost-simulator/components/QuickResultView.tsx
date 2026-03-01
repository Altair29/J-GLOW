'use client';

import type { QuickInputs, CostBreakdown } from '../lib/types';
import { VISA_LEAD_TIMES } from '../lib/constants';
import { getMonthsUntilStart, getEarliestStartMonth, isFeasible, getOrderDeadline } from '../lib/calculate';
import type { VisaTypeV2 } from '../lib/types';
import { useAuth } from '@/hooks/useAuth';

type Props = {
  inputs: QuickInputs;
  breakdowns: CostBreakdown[];
  onDetailMode: () => void;
  onRestart: () => void;
};

function formatYen(n: number): string {
  return `¥${n.toLocaleString()}`;
}

function formatMidYen(min: number, max: number): string {
  const mid = Math.round((min + max) / 2);
  return formatYen(mid);
}

function getVisaTypeV2FromKey(key: string): VisaTypeV2 | null {
  const map: Record<string, VisaTypeV2> = {
    ikusei: 'ikusei',
    tokutei1_kaigai: 'tokutei1_kaigai',
    tokutei1_kokunai: 'tokutei1_kokunai',
    tokutei2: 'tokutei2',
    ginou: 'ginou',
    student: 'student',
  };
  return map[key] ?? null;
}

export function QuickResultView({ inputs, breakdowns, onDetailMode, onRestart }: Props) {
  const { user, loading: authLoading } = useAuth();
  const isGuest = !authLoading && !user;

  if (breakdowns.length === 0) return null;

  const primary = breakdowns[0];
  const visaType = getVisaTypeV2FromKey(primary.visaType);
  const leadTime = visaType ? VISA_LEAD_TIMES[visaType] : null;
  const feasible = visaType ? isFeasible(inputs.startDate, visaType) : true;
  const earliestMonth = visaType ? getEarliestStartMonth(visaType) : '';
  const hasIkusei = breakdowns.some((b) => b.visaType === 'ikusei');

  // 発注デッドライン算出
  const orderDeadlines = breakdowns.map((b) => {
    const vt = getVisaTypeV2FromKey(b.visaType);
    const deadline = vt ? getOrderDeadline(inputs.startDate, vt) : null;
    return { visaLabel: b.visaLabel, deadline, visaType: b.visaType };
  }).filter((d) => d.deadline !== null);

  return (
    <div className="space-y-8">
      {/* 育成就労の制度注記 */}
      {hasIkusei && (
        <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg">
          <p className="text-amber-800 text-xs">
            育成就労制度は2027年施行予定の新制度です。本試算は概算であり、施行時に費用体系が変更される可能性があります。
          </p>
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

      {/* ゲスト向け: KPIカード含めてぼかし+登録誘導 */}
      <div className={isGuest ? 'relative' : ''}>
        {isGuest && (
          <div className="absolute inset-0 z-30 flex items-start justify-center pt-16">
            <div className="bg-white/95 backdrop-blur-sm border-2 border-[#1a2f5e]/20 rounded-2xl p-6 shadow-xl text-center max-w-sm mx-4">
              <div className="w-10 h-10 mx-auto mb-3 rounded-full bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              </div>
              <h3 className="text-base font-bold text-[#1a2f5e] mb-2">概算結果を確認する</h3>
              <p className="text-sm text-gray-600 mb-4">
                試算結果の確認・詳細シミュレーションは無料登録でご利用いただけます。
              </p>
              <ul className="text-left text-xs text-gray-500 space-y-1.5 mb-5 max-w-xs mx-auto">
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>初期費用・月次コストの概算表示</li>
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>ビザ種別ごとの比較</li>
                <li className="flex items-start gap-2"><span className="text-[#c9a84c] shrink-0">&#10003;</span>詳細シミュレーション・PDF出力</li>
              </ul>
              <a
                href={`/register/business?returnUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '/business/cost-simulator')}&from=simulator`}
                className="inline-block w-full px-5 py-3 rounded-lg font-bold text-sm transition-opacity hover:opacity-90"
                style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
              >
                無料会員登録して結果を見る &rarr;
              </a>
              <p className="text-xs text-gray-400 mt-2">
                <a href={`/login?returnUrl=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '/business/cost-simulator')}`} className="text-[#1a2f5e] hover:underline">
                  ログインはこちら
                </a>
              </p>
            </div>
          </div>
        )}

        <div className={isGuest ? 'blur-[6px] select-none pointer-events-none' : ''} aria-hidden={isGuest}>
          {/* KPI カード（中央値メイン） */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 最短就労開始 */}
            <div className={`rounded-xl p-5 text-center ${feasible ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <p className="text-xs text-gray-500 mb-1">最短就労開始</p>
              <p className={`text-lg font-bold ${feasible ? 'text-green-700' : 'text-red-600'}`}>
                {feasible ? '間に合います' : earliestMonth}
              </p>
              {leadTime && (
                <p className="text-xs text-gray-400 mt-1">
                  リードタイム: {leadTime.months}ヶ月
                </p>
              )}
            </div>

            {/* 1人あたり初期費用（中央値メイン） */}
            <div className="bg-[#1a2f5e]/5 rounded-xl p-5 text-center border border-[#1a2f5e]/10">
              <p className="text-xs text-gray-500 mb-1">1人あたり初期費用</p>
              <p className="text-lg font-bold text-[#1a2f5e]">
                {formatMidYen(primary.initialTotal.min, primary.initialTotal.max)}
              </p>
              {primary.initialTotal.min !== primary.initialTotal.max && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatYen(primary.initialTotal.min)} 〜 {formatYen(primary.initialTotal.max)}
                </p>
              )}
            </div>

            {/* 月次コスト（中央値メイン） */}
            <div className="bg-[#1a2f5e]/5 rounded-xl p-5 text-center border border-[#1a2f5e]/10">
              <p className="text-xs text-gray-500 mb-1">月次コスト（1人）</p>
              <p className="text-lg font-bold text-[#1a2f5e]">
                {formatMidYen(primary.monthlyTotal.min, primary.monthlyTotal.max)}
              </p>
              {primary.monthlyTotal.min !== primary.monthlyTotal.max && (
                <p className="text-xs text-gray-400 mt-1">
                  {formatYen(primary.monthlyTotal.min)} 〜 {formatYen(primary.monthlyTotal.max)}
                </p>
              )}
            </div>
          </div>

          {/* 3年間総コスト（中央値メイン） */}
          <div className="bg-gradient-to-r from-[#1a2f5e] to-[#2a4a8e] rounded-xl p-6 text-white text-center mt-8">
            <p className="text-sm opacity-80 mb-2">
              3年間総コスト（{inputs.headcount}人分）
            </p>
            <p className="text-3xl font-bold">
              {formatMidYen(primary.threeYearTotal.min, primary.threeYearTotal.max)}
            </p>
            {primary.threeYearTotal.min !== primary.threeYearTotal.max && (
              <p className="text-xs opacity-60 mt-1">
                （{formatYen(primary.threeYearTotal.min)} 〜 {formatYen(primary.threeYearTotal.max)}）
              </p>
            )}
          </div>

          {/* 比較表示（複数ビザ時） */}
          {breakdowns.length > 1 && (
            <div className="space-y-3 mt-8">
              <h3 className="text-sm font-bold text-[#1a2f5e]">ビザ種別ごとの概算比較</h3>
              <div className="grid gap-3">
                {breakdowns.map((b) => (
                  <div key={b.visaType} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <span className="text-sm font-medium text-gray-700">{b.visaLabel}</span>
                    <span className="text-sm font-bold text-[#1a2f5e] font-mono">
                      {formatMidYen(b.threeYearTotal.min, b.threeYearTotal.max)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CTAボタン */}
          <div className="space-y-3 mt-6">
            <button
              onClick={onDetailMode}
              className="w-full px-6 py-4 bg-[#1a2f5e] text-white rounded-xl font-bold text-base hover:bg-[#1a2f5e]/90 transition-all"
            >
              詳細シミュレーションへ &rarr;
            </button>
            <a
              href="/business/partners"
              className="block w-full px-6 py-4 bg-white border-2 border-[#c9a84c] text-[#8a6d2b] rounded-xl font-bold text-base text-center hover:bg-[#c9a84c]/10 transition-all"
            >
              専門家に相談する &rarr;
            </a>
          </div>
        </div>
      </div>

      {/* ナビ */}
      <div className="flex justify-center">
        <button
          onClick={onRestart}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          最初からやり直す
        </button>
      </div>

      {/* 免責 */}
      <p className="text-xs text-gray-400 text-center">
        ※ クイック試算は概算です。より正確な試算は「詳細シミュレーション」をご利用ください。
      </p>
    </div>
  );
}
