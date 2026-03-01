'use client';

import type { MsimDelayedEffect } from '../lib/types';
import { GAUGE_CONFIG } from '../lib/constants';
import { formatDelta } from '../lib/engine';

type Props = {
  effects: MsimDelayedEffect[];
  onDismiss: () => void;
};

export default function DelayedEffectAlert({ effects, onDismiss }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full">
        {/* ヘッダー */}
        <div className="bg-amber-500 px-6 py-4 rounded-t-2xl">
          <div className="flex items-center gap-2 text-white">
            <span className="text-xl">⏰</span>
            <span className="font-bold">過去の判断の影響が現れました</span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          {effects.map((effect, i) => {
            const deltas = [
              { key: 'funds', delta: effect.cost_delta, isCurrency: true },
              { key: 'compliance', delta: effect.compliance_delta },
              { key: 'morale', delta: effect.morale_delta },
              { key: 'productivity', delta: effect.productivity_delta },
              { key: 'retention', delta: effect.retention_delta },
            ].filter((d) => d.delta !== 0);

            return (
              <div key={i} className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-700 mb-3">{effect.message}</p>
                <div className="flex flex-wrap gap-2">
                  {deltas.map(({ key, delta, isCurrency }) => {
                    const cfg = GAUGE_CONFIG[key];
                    const isPositive = delta > 0;
                    return (
                      <span
                        key={key}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-bold ${
                          isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {cfg.icon} {cfg.label} {formatDelta(delta, isCurrency)}
                      </span>
                    );
                  })}
                </div>
              </div>
            );
          })}

          <button
            onClick={onDismiss}
            className="w-full py-3 rounded-xl bg-[#1a2f5e] text-white text-sm font-bold hover:bg-[#15254d] transition-colors shadow-md"
          >
            確認して続ける
          </button>
        </div>
      </div>
    </div>
  );
}
