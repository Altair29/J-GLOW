'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import type { SimulationCardWithEffects, GaugeType } from '@/types/database';

type Gauges = Record<GaugeType, number>;

type DelayedPenalty = {
  triggerTurn: number;
  gauge: GaugeType;
  delta: number;
  message: string;
};

type Props = {
  cards: SimulationCardWithEffects[];
  config: Record<string, unknown>;
  isGuest: boolean;
};

const GAUGE_LABELS: Record<GaugeType, string> = {
  operation: '稼働力',
  morale: '士気',
  compliance: 'コンプライアンス',
};

const GAUGE_COLORS: Record<GaugeType, { bar: string; bg: string }> = {
  operation: { bar: '#3b82f6', bg: '#dbeafe' },
  morale: { bar: '#f59e0b', bg: '#fef3c7' },
  compliance: { bar: '#10b981', bg: '#d1fae5' },
};

const GAME_OVER_MESSAGES: Record<GaugeType, string> = {
  operation: '人手不足が限界を超え、主要取引先への納品が停止しました。',
  morale: '日本人・外国人スタッフが相次いで退職。現場が崩壊しました。',
  compliance: '労働基準監督署の立入調査が入りました。不法就労助長罪の疑いで事業停止命令が出ました。',
};

function GaugeBar({ type, value }: { type: GaugeType; value: number }) {
  const clamped = Math.max(0, Math.min(100, value));
  const color = GAUGE_COLORS[type];
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-1">
        <span className="font-medium text-gray-700">{GAUGE_LABELS[type]}</span>
        <span className="font-bold" style={{ color: clamped <= 20 ? '#ef4444' : color.bar }}>
          {clamped}%
        </span>
      </div>
      <div className="w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: color.bg }}>
        <div
          className="h-full rounded-full transition-all duration-500 ease-out"
          style={{ backgroundColor: color.bar, width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}

function DelayAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-red-600 mb-3">遅延ペナルティ発動</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-[#1a2f5e] text-white rounded-xl font-medium hover:bg-[#14254b] transition-colors"
        >
          確認
        </button>
      </div>
    </div>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">結果を保存するには</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          無料会員登録またはログインすると、シミュレーション結果の保存・詳細レポートの閲覧ができます。
        </p>
        <Link
          href="/register/business"
          className="block w-full py-3 bg-[#1a2f5e] text-white rounded-xl font-medium hover:bg-[#14254b] transition-colors mb-3"
        >
          無料会員登録
        </Link>
        <Link
          href="/login"
          className="block w-full py-3 border-2 border-[#c9a84c]/40 text-[#1a2f5e] rounded-xl font-medium hover:bg-[#1a2f5e]/5 transition-colors mb-3"
        >
          ログイン
        </Link>
        <button
          onClick={onClose}
          className="block w-full text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
        >
          閉じる
        </button>
      </div>
    </div>
  );
}

function GameOverScreen({ zeroGauge, gauges, onSaveRequest }: { zeroGauge: GaugeType; gauges: Gauges; onSaveRequest: () => void }) {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">💥</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">ゲームオーバー</h2>
        <p className="text-gray-700 mb-6 leading-relaxed">
          {GAME_OVER_MESSAGES[zeroGauge]}
        </p>
        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">最終ゲージ</h4>
          {(Object.keys(GAUGE_LABELS) as GaugeType[]).map((g) => (
            <div key={g} className="flex justify-between text-sm py-1">
              <span className="text-gray-600">{GAUGE_LABELS[g]}</span>
              <span className={`font-bold ${gauges[g] <= 0 ? 'text-red-600' : 'text-gray-900'}`}>
                {Math.max(0, gauges[g])}%
              </span>
            </div>
          ))}
        </div>
        <button
          onClick={onSaveRequest}
          className="block w-full py-3 bg-[#1a2f5e] text-white rounded-xl font-medium hover:bg-[#14254b] transition-colors mb-3"
        >
          結果を保存・詳細を見る
        </button>
        <Link
          href="/business/contact"
          className="block w-full py-3 border-2 border-[#c9a84c]/40 text-[#1a2f5e] rounded-xl font-medium hover:bg-[#1a2f5e]/5 transition-colors mb-3"
        >
          実地監査に申し込む
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="block w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          もう一度プレイ
        </button>
      </div>
    </div>
  );
}

function ClearScreen({ gauges, totalTurns, onSaveRequest }: { gauges: Gauges; totalTurns: number; onSaveRequest: () => void }) {
  const total = gauges.operation + gauges.morale + gauges.compliance;
  const maxTotal = 300;
  const grade = total >= 250 ? 'S' : total >= 200 ? 'A' : total >= 150 ? 'B' : 'C';
  const gradeColor = grade === 'S' ? '#c9a84c' : grade === 'A' ? '#1a2f5e' : grade === 'B' ? '#10b981' : '#6b7280';

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-lg max-w-md w-full p-8 text-center">
        <div className="text-6xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">シミュレーション完了</h2>
        <p className="text-gray-500 mb-6">{totalTurns}問すべてに回答しました</p>

        <div className="mb-6">
          <span className="text-sm text-gray-500">総合評価</span>
          <div className="text-6xl font-black mt-1" style={{ color: gradeColor }}>{grade}</div>
          <div className="text-sm text-gray-500 mt-1">{total} / {maxTotal} ポイント</div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-6">
          <h4 className="text-sm font-medium text-gray-500 mb-3">最終ゲージ</h4>
          {(Object.keys(GAUGE_LABELS) as GaugeType[]).map((g) => (
            <GaugeBar key={g} type={g} value={gauges[g]} />
          ))}
        </div>

        <button
          onClick={onSaveRequest}
          className="block w-full py-3 bg-[#1a2f5e] text-white rounded-xl font-medium hover:bg-[#14254b] transition-colors mb-3"
        >
          結果を保存・詳細を見る
        </button>
        <Link
          href="/business/contact"
          className="block w-full py-3 border-2 border-[#c9a84c]/40 text-[#1a2f5e] rounded-xl font-medium hover:bg-[#1a2f5e]/5 transition-colors mb-3"
        >
          実地監査に申し込む
        </Link>
        <button
          onClick={() => window.location.reload()}
          className="block w-full py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
        >
          もう一度プレイ
        </button>
      </div>
    </div>
  );
}

export function SimulationGame({ cards, config, isGuest }: Props) {
  const initialGauges = (config.initial_gauges ?? { operation: 30, morale: 60, compliance: 70 }) as Gauges;
  const totalTurns = Number(config.total_turns ?? 10);

  // Deduplicate by turn_order (keep first per turn_order, discard DB duplicates)
  const activeCards = cards
    .filter((c) => c.is_active)
    .sort((a, b) => a.turn_order - b.turn_order)
    .filter((c, i, arr) => i === 0 || c.turn_order !== arr[i - 1].turn_order)
    .slice(0, totalTurns);

  const [started, setStarted] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gauges, setGauges] = useState<Gauges>({ ...initialGauges });
  const [delayedPenalties, setDelayedPenalties] = useState<DelayedPenalty[]>([]);
  const [pendingAlert, setPendingAlert] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [gameOver, setGameOver] = useState<GaugeType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const currentCard = activeCards[currentIndex];
  const isFinished = currentIndex >= activeCards.length;

  const handleChoice = (choice: 'yes' | 'no') => {
    if (isProcessing || !currentCard || gameOver) return;
    setIsProcessing(true);

    const effects = currentCard.simulation_effects.filter((e) => e.choice === choice);
    const newGauges = { ...gauges };
    const newPenalties = [...delayedPenalties];

    for (const effect of effects) {
      newGauges[effect.gauge] = Math.max(0, Math.min(100, newGauges[effect.gauge] + effect.delta));

      if (effect.delay_turn && effect.delay_delta && effect.delay_gauge && effect.delay_message) {
        newPenalties.push({
          triggerTurn: effect.delay_turn,
          gauge: effect.delay_gauge as GaugeType,
          delta: effect.delay_delta,
          message: effect.delay_message,
        });
      }
    }

    // Game over check
    const zeroGauge = (Object.keys(newGauges) as GaugeType[]).find((g) => newGauges[g] <= 0);
    if (zeroGauge) {
      setGauges(newGauges);
      setGameOver(zeroGauge);
      return;
    }

    // Advance turn
    const nextIndex = currentIndex + 1;
    const nextTurn = nextIndex + 1;

    // Process delayed penalties
    const triggered = newPenalties.filter((p) => p.triggerTurn === nextTurn);
    const remaining = newPenalties.filter((p) => p.triggerTurn !== nextTurn);
    const afterDelay = { ...newGauges };
    const delayMessages: string[] = [];
    for (const penalty of triggered) {
      afterDelay[penalty.gauge] = Math.max(0, Math.min(100, afterDelay[penalty.gauge] + penalty.delta));
      delayMessages.push(penalty.message);
    }

    const zeroAfterDelay = (Object.keys(afterDelay) as GaugeType[]).find((g) => afterDelay[g] <= 0);

    setGauges(afterDelay);
    setDelayedPenalties(remaining);
    setCurrentIndex(nextIndex);
    if (delayMessages.length > 0) setPendingAlert(delayMessages.join('\n'));
    if (zeroAfterDelay) setGameOver(zeroAfterDelay);
    setIsProcessing(false);
  };

  const handleSaveRequest = () => {
    if (isGuest) {
      setShowRegisterModal(true);
    } else {
      alert('結果を保存しました');
    }
  };

  if (!started) {
    return (
      <div className="relative min-h-[100dvh] flex flex-col items-center justify-center overflow-hidden">
        {/* Background image + overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/3.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/85 via-[#1a2f5e]/5 to-white/90" />

        {/* Content */}
        <div className="relative z-10 max-w-xl w-full px-6 py-12 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-[2rem] leading-snug font-bold text-gray-900 mb-10"
          >
            「人手が足りない。でも外国人雇用って
            <br />
            何から始めればいいか分からない」
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="space-y-5 text-[1.25rem] leading-relaxed text-gray-700 mb-12"
          >
            <p>
              どのエージェントが信頼できるのか。
              <br />
              トラブルが起きたらどうすればいいのか。
              <br />
              日本人採用とは違う壁が、確かに存在します。
            </p>

            <p>
              この体験シミュレーションでは
              <br />
              10の経営判断を通じて
              <br />
              外国人雇用のリアルを体感してください。
            </p>
          </motion.div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6 }}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setStarted(true)}
            className="px-10 py-4 bg-[#1a2f5e] text-white rounded-xl font-medium text-[1.25rem] hover:bg-[#14254b] transition-colors shadow-lg shadow-[#1a2f5e]/25"
          >
            シミュレーションを始める
          </motion.button>
        </div>
      </div>
    );
  }

  if (gameOver) {
    return (
      <>
        <GameOverScreen zeroGauge={gameOver} gauges={gauges} onSaveRequest={handleSaveRequest} />
        {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      </>
    );
  }

  if (isFinished) {
    return (
      <>
        <ClearScreen gauges={gauges} totalTurns={activeCards.length} onSaveRequest={handleSaveRequest} />
        {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      </>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 className="text-lg font-bold text-gray-900">外国人雇用シミュレーション</h1>
        <p className="text-sm text-gray-500">
          ターン {currentIndex + 1} / {activeCards.length}
        </p>
      </div>

      {/* Gauges */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6">
        {(Object.keys(GAUGE_LABELS) as GaugeType[]).map((g) => (
          <GaugeBar key={g} type={g} value={gauges[g]} />
        ))}
      </div>

      {/* Card */}
      {currentCard && (
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 mb-6 min-h-[200px] flex flex-col justify-center">
          <div className="text-xs text-[#c9a84c] font-medium mb-3">
            第{currentCard.turn_order}問
          </div>
          <p className="text-gray-800 leading-relaxed text-[15px]">
            {currentCard.situation}
          </p>
        </div>
      )}

      {/* Buttons */}
      {currentCard && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleChoice('no')}
            disabled={isProcessing}
            className="py-4 px-3 bg-[#1a2f5e]/5 border-2 border-[#1a2f5e]/20 text-[#1a2f5e] rounded-xl font-medium text-sm hover:bg-[#1a2f5e]/10 transition-colors disabled:opacity-50 disabled:pointer-events-none leading-snug"
          >
            {currentCard.no_label}
          </button>
          <button
            onClick={() => handleChoice('yes')}
            disabled={isProcessing}
            className="py-4 px-3 bg-[#1a2f5e]/5 border-2 border-[#1a2f5e]/20 text-[#1a2f5e] rounded-xl font-medium text-sm hover:bg-[#1a2f5e]/10 transition-colors disabled:opacity-50 disabled:pointer-events-none leading-snug"
          >
            {currentCard.yes_label}
          </button>
        </div>
      )}

      {/* Delay Alert */}
      {pendingAlert && (
        <DelayAlert
          message={pendingAlert}
          onDismiss={() => setPendingAlert(null)}
        />
      )}
    </div>
  );
}
