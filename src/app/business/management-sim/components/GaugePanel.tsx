'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import type { MsimGauges, GaugeDelta } from '../lib/types';
import { GAUGE_CONFIG } from '../lib/constants';
import { formatCurrency } from '../lib/engine';

type Props = {
  gauges: MsimGauges;
  previousGauges?: MsimGauges | null;
  lastChoiceDelta?: GaugeDelta | null;
};

/** rAFベースのスムーズカウンター */
function useAnimatedNumber(target: number, duration = 500) {
  const [display, setDisplay] = useState(target);
  const rafRef = useRef<number>(undefined);
  const fromRef = useRef(target);

  useEffect(() => {
    const from = fromRef.current;
    fromRef.current = target;

    if (from === target) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const start = performance.now();
    const step = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);
      setDisplay(Math.round(from + (target - from) * eased));
      if (progress < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };
    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [target, duration]);

  return display;
}

const DELTA_KEY_MAP: Record<string, keyof GaugeDelta> = {
  funds: 'cost_delta',
  compliance: 'compliance_delta',
  morale: 'morale_delta',
  productivity: 'productivity_delta',
  retention: 'retention_delta',
};

export default function GaugePanel({ gauges, previousGauges, lastChoiceDelta }: Props) {
  const gaugeKeys = ['funds', 'compliance', 'morale', 'productivity', 'retention'] as const;

  return (
    <>
      <style>{`
        @keyframes msim-gauge-pulse {
          0% { box-shadow: 0 0 0 0 rgba(26,47,94,0.15); }
          50% { box-shadow: 0 0 0 4px rgba(26,47,94,0.08); }
          100% { box-shadow: 0 0 0 0 rgba(26,47,94,0); }
        }
        @keyframes msim-shake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-2px); }
          40% { transform: translateX(2px); }
          60% { transform: translateX(-1px); }
          80% { transform: translateX(1px); }
        }
        @keyframes msim-delta-pop {
          0% { opacity: 0; transform: translateY(4px) scale(0.7); }
          60% { opacity: 1; transform: translateY(-2px) scale(1.15); }
          100% { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes msim-bar-glow {
          0% { filter: brightness(1); }
          50% { filter: brightness(1.3); }
          100% { filter: brightness(1); }
        }
        .msim-gauge-pulse { animation: msim-gauge-pulse 0.6s ease-out; }
        .msim-shake { animation: msim-shake 0.4s ease-in-out; }
        .msim-delta-pop { animation: msim-delta-pop 0.5s ease-out forwards; }
        .msim-bar-glow { animation: msim-bar-glow 0.8s ease-in-out; }
      `}</style>
      <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">ステータス</h3>
        <div className="space-y-3">
          {gaugeKeys.map((key) => {
            const deltaKey = DELTA_KEY_MAP[key];
            const choiceDelta = lastChoiceDelta ? lastChoiceDelta[deltaKey] : null;
            return (
              <GaugeRow
                key={key}
                gaugeKey={key}
                value={gauges[key]}
                prevValue={previousGauges?.[key] ?? null}
                persistentDelta={choiceDelta}
              />
            );
          })}
        </div>
      </div>
    </>
  );
}

function GaugeRow({
  gaugeKey,
  value,
  prevValue,
  persistentDelta,
}: {
  gaugeKey: string;
  value: number;
  prevValue: number | null;
  persistentDelta: number | null;
}) {
  const cfg = GAUGE_CONFIG[gaugeKey];
  const isCurrency = gaugeKey === 'funds';
  // アニメーション用デルタ（previousGauges由来、変化直後のみ）
  const delta = prevValue != null ? value - prevValue : null;
  const hasChange = delta != null && delta !== 0;
  // 永続デルタ（lastChoiceDelta由来、次の選択まで表示し続ける）
  const showPersistent = persistentDelta != null && persistentDelta !== 0;

  const animatedValue = useAnimatedNumber(value, 600);

  const barPercent = isCurrency
    ? Math.max(0, Math.min(100, (value / 5000000) * 100))
    : Math.max(0, Math.min(100, value));

  const isDanger = isCurrency ? value < 500000 : value < 15;
  const isWarning = isCurrency ? value < 1500000 : value < 30;

  // アニメーション状態管理（effect 経由で安全に更新）
  const [animating, setAnimating] = useState(false);

  const startAnimation = useCallback(() => {
    setAnimating(true);
  }, []);

  useEffect(() => {
    startAnimation();
    const timer = setTimeout(() => setAnimating(false), 800);
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  // 初回レンダーではアニメーション不要
  const [hasEverChanged, setHasEverChanged] = useState(false);
  useEffect(() => {
    if (hasChange) {
      setHasEverChanged(true);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasChange]);

  const showAnim = animating && hasEverChanged;

  return (
    <div className={showAnim ? 'msim-gauge-pulse rounded-lg' : ''}>
      <div className="flex items-center justify-between mb-1">
        <div className="flex items-center gap-1.5">
          <span className="text-sm">{cfg.icon}</span>
          <span className="text-xs font-bold text-gray-600">{cfg.label}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span
            className={`text-sm font-bold tabular-nums transition-colors duration-300 ${
              isDanger ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-800'
            } ${showAnim && isDanger ? 'msim-shake' : ''}`}
          >
            {isCurrency ? formatCurrency(animatedValue) : animatedValue}
            {!isCurrency && cfg.unit}
          </span>
          {showPersistent && (
            <span
              className={`text-xs font-bold inline-flex items-center gap-0.5 ${
                hasChange ? 'msim-delta-pop' : ''
              } ${persistentDelta > 0 ? 'text-green-600' : 'text-red-600'}`}
            >
              <span className="text-[10px]">{persistentDelta > 0 ? '▲' : '▼'}</span>
              {isCurrency ? formatCurrency(Math.abs(persistentDelta)) : Math.abs(persistentDelta)}
            </span>
          )}
        </div>
      </div>

      {/* ゲージバー */}
      <div className="relative h-2.5 bg-gray-100 rounded-full overflow-hidden">
        {/* 50%ベースラインマーカー（資金以外） */}
        {!isCurrency && (
          <div
            className="absolute top-0 bottom-0 w-px z-10"
            style={{ left: '50%', backgroundColor: 'rgba(0,0,0,0.15)' }}
          />
        )}
        <div
          className={showAnim ? 'h-full rounded-full msim-bar-glow' : 'h-full rounded-full'}
          style={{
            width: `${barPercent}%`,
            backgroundColor: isDanger ? '#dc2626' : isWarning ? '#d97706' : cfg.color,
            transition: 'width 700ms cubic-bezier(0.34, 1.56, 0.64, 1), background-color 300ms ease',
            boxShadow: isDanger ? '0 0 6px rgba(220,38,38,0.4)' : 'none',
          }}
        />
      </div>
    </div>
  );
}
