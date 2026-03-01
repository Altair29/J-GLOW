'use client';

import type { MsimChoice } from '../lib/types';
import { GAUGE_CONFIG } from '../lib/constants';
import { formatDelta } from '../lib/engine';

type Props = {
  choice: MsimChoice;
  scenarioTitle: string;
  onDismiss: () => void;
};

export default function OutcomeOverlay({ choice, scenarioTitle, onDismiss }: Props) {
  const effects = [
    { key: 'funds', delta: choice.cost_delta, isCurrency: true },
    { key: 'compliance', delta: choice.compliance_delta },
    { key: 'morale', delta: choice.morale_delta },
    { key: 'productivity', delta: choice.productivity_delta },
    { key: 'retention', delta: choice.retention_delta },
  ].filter((e) => e.delta !== 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
        {/* ヘッダー */}
        <div className="bg-[#1a2f5e] px-6 py-4 rounded-t-2xl">
          <div className="text-xs text-white/60 mb-1">{scenarioTitle}</div>
          <div className="text-white font-bold">「{choice.label}」を選択</div>
        </div>

        <div className="p-6 space-y-5">
          {/* 結果テキスト */}
          <div>
            <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">結果</h4>
            <p className="text-sm text-gray-700 leading-relaxed">{choice.outcome_text}</p>
          </div>

          {/* 効果表示 */}
          {effects.length > 0 && (
            <div>
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">ゲージ変化</h4>
              <div className="flex flex-wrap gap-2">
                {effects.map(({ key, delta, isCurrency }) => {
                  const cfg = GAUGE_CONFIG[key];
                  const isPositive = key === 'funds' ? delta > 0 : delta > 0;
                  return (
                    <div
                      key={key}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                        isPositive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                      }`}
                    >
                      <span>{cfg.icon}</span>
                      <span>{cfg.label}</span>
                      <span>{formatDelta(delta, isCurrency)}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 学習ポイント */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-lg">💡</span>
              <div>
                <h4 className="text-xs font-bold text-amber-800 mb-1">学びのポイント</h4>
                <p className="text-sm text-amber-900 leading-relaxed">{choice.learning_point}</p>
              </div>
            </div>
          </div>

          {/* 次へボタン */}
          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl bg-[#1a2f5e] text-white text-sm font-bold hover:bg-[#15254d] transition-colors shadow-md"
          >
            次の月へ進む →
          </button>
        </div>
      </div>
    </div>
  );
}
