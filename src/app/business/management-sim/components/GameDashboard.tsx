'use client';

import type { GameState, MsimChoice, MsimDelayedEffect, KeyMoment } from '../lib/types';
import { CATEGORY_CONFIG } from '../lib/constants';
import GaugePanel from './GaugePanel';
import MonthlyReport from './MonthlyReport';
import EventCard from './EventCard';
import ChoiceButtons from './ChoiceButtons';

type Props = {
  state: GameState;
  onChoice: (choice: MsimChoice & { msim_delayed_effects: MsimDelayedEffect[] }) => void;
};

export default function GameDashboard({ state, onChoice }: Props) {
  const { gauges, previousGauges, lastChoiceDelta, currentMonth, totalMonths, currentScenario, setup, monthlyRevenue, monthlyCost, keyMoments } = state;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* 月表示ヘッダー */}
      <div className="flex items-center justify-center mb-5">
        <div className="flex items-center gap-3 px-5 py-2 bg-[#1a2f5e] rounded-full shadow-md">
          <span className="text-white/60 text-sm">経営</span>
          <span className="text-white text-xl font-extrabold tabular-nums">{currentMonth}</span>
          <span className="text-white/60 text-sm">月目</span>
          <span className="text-white/30 text-sm">/</span>
          <span className="text-white/60 text-sm">{totalMonths}ヶ月</span>
        </div>
      </div>

      {/* 上段: ゲージ + 月次レポート */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <GaugePanel
          gauges={gauges}
          previousGauges={previousGauges}
          lastChoiceDelta={lastChoiceDelta}
        />
        <MonthlyReport
          currentMonth={currentMonth}
          totalMonths={totalMonths}
          gauges={gauges}
          monthlyRevenue={monthlyRevenue}
          monthlyCost={monthlyCost}
          industry={setup.industry}
          visaType={setup.visaType}
        />
      </div>

      {/* 中段: シナリオカード + 選択肢 */}
      {currentScenario ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <EventCard scenario={currentScenario} />
          <ChoiceButtons
            choices={currentScenario.msim_choices}
            onChoice={onChoice}
          />
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-4 border-gray-200 border-t-[#1a2f5e] rounded-full mx-auto mb-4" />
          <p className="text-sm text-gray-400">シナリオを準備中...</p>
        </div>
      )}

      {/* 下段: 意思決定ログ（常時表示） */}
      <ContextLog keyMoments={keyMoments} />
    </div>
  );
}

function ContextLog({ keyMoments }: { keyMoments: KeyMoment[] }) {
  if (keyMoments.length === 0) return null;

  const recent = keyMoments.slice(-4).reverse();

  return (
    <div className="mt-6 bg-slate-50 rounded-xl border border-gray-200 p-4">
      <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
        <span>📋</span> 意思決定ログ
      </h3>
      <div className="space-y-2">
        {recent.map((m, i) => {
          const catCfg = CATEGORY_CONFIG[m.category];
          const isLatest = i === 0;
          return (
            <div
              key={`${m.month}-${i}`}
              className={`text-xs rounded-lg p-2.5 transition-opacity ${
                isLatest
                  ? 'bg-white border border-gray-200 shadow-sm'
                  : 'opacity-60'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold"
                  style={{ backgroundColor: catCfg.bgColor, color: catCfg.color }}
                >
                  {catCfg.emoji} {catCfg.label}
                </span>
                <span className="text-gray-400 font-bold">{m.month}月目</span>
              </div>
              <p className="text-gray-700 font-medium">{m.scenarioTitle}</p>
              <p className="text-gray-500 mt-0.5">
                → <span className="text-gray-700">{m.choiceLabel}</span>
              </p>
              {isLatest && m.outcomeText && (
                <p className="text-gray-500 mt-1 leading-relaxed border-t border-gray-100 pt-1">
                  {m.outcomeText}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
