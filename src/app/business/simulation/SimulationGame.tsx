'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { motion, useMotionValue, useTransform, animate, PanInfo } from 'framer-motion';
import Link from 'next/link';
import type { SimulationCardWithEffects, SimulationConfig, GaugeType } from '@/types/database';

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
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: color.bar }}
          initial={false}
          animate={{ width: `${clamped}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

function DelayAlert({ message, onDismiss }: { message: string; onDismiss: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center">
        <div className="text-4xl mb-4">⚠️</div>
        <h3 className="text-lg font-bold text-red-600 mb-3">遅延ペナルティ発動</h3>
        <p className="text-gray-700 mb-6 leading-relaxed">{message}</p>
        <button
          onClick={onDismiss}
          className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
        >
          確認
        </button>
      </div>
    </motion.div>
  );
}

function RegisterModal({ onClose }: { onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 text-center"
      >
        <div className="text-5xl mb-4">📊</div>
        <h3 className="text-xl font-bold text-gray-900 mb-3">結果を保存するには</h3>
        <p className="text-gray-600 mb-6 leading-relaxed">
          無料会員登録またはログインすると、シミュレーション結果の保存・詳細レポートの閲覧ができます。
        </p>
        <Link
          href="/register/business"
          className="block w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mb-3"
        >
          無料会員登録
        </Link>
        <Link
          href="/login"
          className="block w-full py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-colors mb-3"
        >
          ログイン
        </Link>
        <button
          onClick={onClose}
          className="block w-full text-sm text-gray-500 hover:text-gray-700 transition-colors py-2"
        >
          閉じる
        </button>
      </motion.div>
    </motion.div>
  );
}

function GameOverScreen({ zeroGauge, gauges, isGuest, onSaveRequest }: { zeroGauge: GaugeType; gauges: Gauges; isGuest: boolean; onSaveRequest: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center p-4"
    >
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
          className="block w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mb-3"
        >
          結果を保存・詳細を見る
        </button>
        <Link
          href="/business/contact"
          className="block w-full py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-colors mb-3"
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
    </motion.div>
  );
}

function ClearScreen({ gauges, totalTurns, isGuest, onSaveRequest }: { gauges: Gauges; totalTurns: number; isGuest: boolean; onSaveRequest: () => void }) {
  const total = gauges.operation + gauges.morale + gauges.compliance;
  const maxTotal = 300;
  const grade = total >= 250 ? 'S' : total >= 200 ? 'A' : total >= 150 ? 'B' : 'C';
  const gradeColor = grade === 'S' ? '#eab308' : grade === 'A' ? '#3b82f6' : grade === 'B' ? '#10b981' : '#6b7280';

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-[70vh] flex flex-col items-center justify-center p-4"
    >
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
          className="block w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors mb-3"
        >
          結果を保存・詳細を見る
        </button>
        <Link
          href="/business/contact"
          className="block w-full py-3 border-2 border-blue-200 text-blue-700 rounded-xl font-medium hover:bg-blue-50 transition-colors mb-3"
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
    </motion.div>
  );
}

export function SimulationGame({ cards, config, isGuest }: Props) {
  const initialGauges = (config.initial_gauges ?? { operation: 30, morale: 60, compliance: 70 }) as Gauges;
  const totalTurns = Number(config.total_turns ?? 10);

  const activeCards = cards
    .filter((c) => c.is_active)
    .sort((a, b) => a.turn_order - b.turn_order)
    .slice(0, totalTurns);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [gauges, setGauges] = useState<Gauges>({ ...initialGauges });
  const [delayedPenalties, setDelayedPenalties] = useState<DelayedPenalty[]>([]);
  const [pendingAlert, setPendingAlert] = useState<string | null>(null);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [gameOver, setGameOver] = useState<GaugeType | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const x = useMotionValue(0);
  const rotate = useTransform(x, [-200, 200], [-15, 15]);
  const yesOpacity = useTransform(x, [0, 100], [0, 1]);
  const noOpacity = useTransform(x, [-100, 0], [1, 0]);

  const currentTurn = currentIndex + 1;
  const currentCard = activeCards[currentIndex];
  const isFinished = currentIndex >= activeCards.length;

  const processDelays = (turn: number, currentGauges: Gauges, penalties: DelayedPenalty[]) => {
    const triggered = penalties.filter((p) => p.triggerTurn === turn);
    const remaining = penalties.filter((p) => p.triggerTurn !== turn);

    if (triggered.length === 0) return { newGauges: currentGauges, remaining, messages: [] as string[] };

    const newGauges = { ...currentGauges };
    const messages: string[] = [];

    for (const penalty of triggered) {
      newGauges[penalty.gauge] = Math.max(0, Math.min(100, newGauges[penalty.gauge] + penalty.delta));
      messages.push(penalty.message);
    }

    return { newGauges, remaining, messages };
  };

  const handleChoice = (choice: 'yes' | 'no') => {
    if (processingRef.current || !currentCard || gameOver) return;
    processingRef.current = true;
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

    // Check for zero gauge (game over)
    const zeroGauge = (Object.keys(newGauges) as GaugeType[]).find((g) => newGauges[g] <= 0);
    if (zeroGauge) {
      setGauges(newGauges);
      setGameOver(zeroGauge);
      requestAnimationFrame(() => { processingRef.current = false; setIsProcessing(false); });
      return;
    }

    const nextIndex = currentIndex + 1;
    const nextTurn = nextIndex + 1;

    // Process delayed penalties for the next turn
    const { newGauges: afterDelay, remaining, messages } = processDelays(nextTurn, newGauges, newPenalties);

    // Check again after delays
    const zeroAfterDelay = (Object.keys(afterDelay) as GaugeType[]).find((g) => afterDelay[g] <= 0);

    setGauges(afterDelay);
    setDelayedPenalties(remaining);
    setCurrentIndex(nextIndex);

    if (messages.length > 0) {
      setPendingAlert(messages.join('\n'));
    }

    if (zeroAfterDelay) {
      setGameOver(zeroAfterDelay);
    }

    // Re-enable after React re-render
    requestAnimationFrame(() => { processingRef.current = false; setIsProcessing(false); });
  };

  // Stable ref for handlers that need latest handleChoice
  const handleChoiceRef = useRef(handleChoice);
  handleChoiceRef.current = handleChoice;

  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    const threshold = 100;
    if (info.offset.x > threshold) {
      animate(x, 300, { duration: 0.3 });
      setTimeout(() => {
        handleChoiceRef.current('yes');
        x.set(0);
      }, 300);
    } else if (info.offset.x < -threshold) {
      animate(x, -300, { duration: 0.3 });
      setTimeout(() => {
        handleChoiceRef.current('no');
        x.set(0);
      }, 300);
    } else {
      animate(x, 0, { duration: 0.3 });
    }
  }, [x]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleChoiceRef.current('yes');
      if (e.key === 'ArrowLeft') handleChoiceRef.current('no');
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleSaveRequest = useCallback(() => {
    if (isGuest) {
      setShowRegisterModal(true);
    } else {
      // TODO: ログイン済みユーザーの結果保存処理
      alert('結果を保存しました');
    }
  }, [isGuest]);

  if (gameOver) {
    return (
      <>
        <GameOverScreen zeroGauge={gameOver} gauges={gauges} isGuest={isGuest} onSaveRequest={handleSaveRequest} />
        {showRegisterModal && <RegisterModal onClose={() => setShowRegisterModal(false)} />}
      </>
    );
  }

  if (isFinished) {
    return (
      <>
        <ClearScreen gauges={gauges} totalTurns={activeCards.length} isGuest={isGuest} onSaveRequest={handleSaveRequest} />
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
          ターン {currentTurn} / {activeCards.length}
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
        <div className="relative h-[320px] mb-6">
          {/* Swipe hints */}
          <div className="absolute inset-0 flex items-center justify-between pointer-events-none px-2 z-10">
            <motion.div
              style={{ opacity: noOpacity }}
              className="bg-red-500 text-white px-3 py-1 rounded-lg font-bold text-sm"
            >
              NO
            </motion.div>
            <motion.div
              style={{ opacity: yesOpacity }}
              className="bg-green-500 text-white px-3 py-1 rounded-lg font-bold text-sm"
            >
              YES
            </motion.div>
          </div>

          <motion.div
            style={{ x, rotate }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.8}
            onDragEnd={handleDragEnd}
            className="absolute inset-0 bg-white rounded-2xl shadow-lg border border-gray-200 p-6 cursor-grab active:cursor-grabbing flex flex-col justify-center"
          >
            <div className="text-xs text-blue-500 font-medium mb-3">
              第{currentCard.turn_order}問
            </div>
            <p className="text-gray-800 leading-relaxed text-[15px]">
              {currentCard.situation}
            </p>
            <div className="mt-4 text-xs text-gray-400 text-center">
              ← スワイプまたは下のボタンで回答 →
            </div>
          </motion.div>
        </div>
      )}

      {/* Buttons */}
      {currentCard && (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleChoice('no')}
            disabled={isProcessing}
            className="py-4 px-3 bg-white border-2 border-blue-200 text-blue-700 rounded-xl font-medium text-sm hover:bg-blue-50 transition-colors disabled:opacity-50 leading-snug"
          >
            {currentCard.no_label}
          </button>
          <button
            onClick={() => handleChoice('yes')}
            disabled={isProcessing}
            className="py-4 px-3 bg-blue-600 text-white rounded-xl font-medium text-sm hover:bg-blue-700 transition-colors disabled:opacity-50 leading-snug"
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
