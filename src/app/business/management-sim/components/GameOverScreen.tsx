'use client';

import Link from 'next/link';
import type { MsimGauges, KeyMoment, GameOverReason } from '../lib/types';
import { GAME_OVER_MESSAGES, CATEGORY_CONFIG, GAUGE_CONFIG } from '../lib/constants';
import { formatCurrency, extractLearningPoints } from '../lib/engine';

type Props = {
  reason: GameOverReason;
  gauges: MsimGauges;
  keyMoments: KeyMoment[];
  currentMonth: number;
  onReset: () => void;
};

export default function GameOverScreen({ reason, gauges, keyMoments, currentMonth, onReset }: Props) {
  const msg = GAME_OVER_MESSAGES[reason];
  const learningPoints = extractLearningPoints(keyMoments);

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {/* ゲームオーバーヘッダー */}
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">💥</div>
        <h1 className="text-2xl font-extrabold text-red-600 mb-2">GAME OVER</h1>
        <h2 className="text-xl font-bold text-[#1a2f5e] mb-2">{msg.title}</h2>
        <p className="text-sm text-gray-500">{msg.description}</p>
        <p className="text-xs text-gray-400 mt-2">{currentMonth}ヶ月目でゲームオーバー</p>
      </div>

      {/* 最終ゲージ */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">最終ステータス</h3>
        <div className="grid grid-cols-5 gap-2">
          {(['funds', 'compliance', 'morale', 'productivity', 'retention'] as const).map((key) => {
            const cfg = GAUGE_CONFIG[key];
            const value = gauges[key];
            const isDanger = key === 'funds' ? value <= 0 : value <= 0;
            return (
              <div key={key} className="text-center">
                <div className="text-lg mb-0.5">{cfg.icon}</div>
                <div className={`text-sm font-bold ${isDanger ? 'text-red-600' : 'text-gray-800'}`}>
                  {key === 'funds' ? formatCurrency(value) : value}
                </div>
                <div className="text-xs text-gray-400">{cfg.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Key Moments */}
      {keyMoments.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-5 mb-6 shadow-sm">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">判断の振り返り</h3>
          <div className="space-y-3">
            {keyMoments.slice(-5).map((moment, i) => {
              const cat = CATEGORY_CONFIG[moment.category];
              return (
                <div key={i} className="flex items-start gap-3 text-sm">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                    {moment.month}月
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="text-xs px-1.5 py-0.5 rounded" style={{ backgroundColor: cat.bgColor, color: cat.color }}>
                        {cat.label}
                      </span>
                      <span className="font-bold text-gray-700">{moment.scenarioTitle}</span>
                    </div>
                    <div className="text-xs text-gray-500">→ {moment.choiceLabel}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 学習ポイント */}
      {learningPoints.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-6">
          <h3 className="flex items-center gap-2 text-sm font-bold text-amber-800 mb-3">
            <span>💡</span> 学びのポイント
          </h3>
          <ul className="space-y-2">
            {learningPoints.slice(0, 5).map((point, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-amber-900 leading-relaxed">
                <span className="flex-shrink-0 w-4 h-4 rounded-full bg-amber-200 flex items-center justify-center text-amber-800 font-bold text-[10px] mt-0.5">
                  {i + 1}
                </span>
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* CTA */}
      <div className="space-y-3">
        <button
          onClick={onReset}
          className="w-full py-3 rounded-xl bg-[#1a2f5e] text-white text-sm font-bold hover:bg-[#15254d] transition-colors shadow-md"
        >
          もう一度プレイする
        </button>
        <div className="grid grid-cols-2 gap-3">
          <Link
            href="/business/partners"
            className="block text-center py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            パートナーを探す
          </Link>
          <Link
            href="/business/cost-simulator"
            className="block text-center py-2.5 rounded-xl border-2 border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50 transition-colors"
          >
            コストシミュレーター
          </Link>
        </div>
      </div>
    </div>
  );
}
