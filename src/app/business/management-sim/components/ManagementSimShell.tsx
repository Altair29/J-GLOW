'use client';

import { useReducer, useCallback, useEffect, useRef } from 'react';
import type { MsimScenarioWithChoices, SetupConfig, MsimChoice, MsimDelayedEffect, GameState } from '../lib/types';
import {
  gameReducer,
  initialGameState,
  computeInitialGauges,
  getMonthlyRevenue,
  getMonthlyCost,
  drawNextScenario,
  collectFiringEffects,
  computeFinalGrade,
} from '../lib/engine';
import { GUEST_MONTH_LIMIT } from '../lib/constants';
import SetupScreen from './SetupScreen';
import GameDashboard from './GameDashboard';
import OutcomeOverlay from './OutcomeOverlay';
import DelayedEffectAlert from './DelayedEffectAlert';
import GuestGateOverlay from './GuestGateOverlay';
import GameOverScreen from './GameOverScreen';
import ResultsScreen from './ResultsScreen';

// ==========================================
// sessionStorage 永続化（ログイン/登録リダイレクト対応）
// ==========================================
const STORAGE_KEY = 'msim_game_state';

function saveGameState(state: GameState): void {
  try {
    // シリアライズ不可な大きなネストデータを除外して保存
    const toSave: GameState = {
      ...state,
      currentScenario: null,
      selectedChoice: null,
      firingEffects: [],
    };
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
  } catch {
    // sessionStorage使用不可（Private browsing等）
  }
}

function loadGameState(): GameState | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as GameState;
    // 最低限のバリデーション
    if (!parsed.phase || !parsed.setup || !parsed.gauges) return null;
    return parsed;
  } catch {
    return null;
  }
}

function clearGameState(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

type Props = {
  scenarios: MsimScenarioWithChoices[];
  config: Record<string, unknown>;
  isGuest: boolean;
  userId: string | null;
};

export default function ManagementSimShell({ scenarios, config, isGuest, userId }: Props) {
  const [state, dispatch] = useReducer(gameReducer, initialGameState);
  const restoredRef = useRef(false);

  // マウント時にsessionStorageから復元
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;
    const saved = loadGameState();
    if (saved && saved.phase !== 'setup') {
      dispatch({ type: 'RESTORE_SESSION', savedState: saved });
    }
  }, []);

  // state変更時にsessionStorageへ保存（プレイ中のみ）
  useEffect(() => {
    if (state.phase === 'setup') return;
    saveGameState(state);
  }, [state]);

  // ゲーム開始
  const handleStart = useCallback(
    (setup: SetupConfig) => {
      const gauges = computeInitialGauges(setup, config);
      const monthlyRevenue = getMonthlyRevenue(setup, config);
      const monthlyCost = getMonthlyCost(setup, config);
      dispatch({ type: 'START_GAME', setup, gauges, monthlyRevenue, monthlyCost });
    },
    [config]
  );

  // 新ターン開始時にシナリオ抽選
  useEffect(() => {
    if (state.phase !== 'playing' || state.currentScenario) return;

    // 月進行
    if (state.currentMonth > 0) {
      // 遅延効果チェック
      const { firing, remaining } = collectFiringEffects(state.pendingEffects, state.currentMonth);
      if (firing.length > 0) {
        // 遅延効果を発動
        dispatch({ type: 'FIRE_DELAYED_EFFECTS', effects: firing });
        // pendingEffectsから除去 — reducerで直接更新できないので、
        // 残りは次のrenderで処理される
        return;
      }
    }

    // ゲストの月数制限チェック
    if (isGuest && state.currentMonth > GUEST_MONTH_LIMIT) {
      return; // GuestGateOverlayが表示される
    }

    // シナリオ抽選
    const scenario = drawNextScenario(scenarios, state.setup, state.currentMonth, state.usedScenarioIds);
    if (scenario) {
      dispatch({ type: 'SET_SCENARIO', scenario });
    }
  }, [state.phase, state.currentMonth, state.currentScenario, state.pendingEffects, state.setup, state.usedScenarioIds, scenarios, isGuest]);

  // 選択肢クリック
  const handleChoice = useCallback(
    (choice: MsimChoice & { msim_delayed_effects: MsimDelayedEffect[] }) => {
      dispatch({ type: 'SELECT_CHOICE', choice });
    },
    []
  );

  // 結果画面閉じ → ゲージアニメーション → 次月へ
  const handleDismissOutcome = useCallback(() => {
    dispatch({ type: 'DISMISS_OUTCOME' });
    // ゲージアニメーションが完了するまで待ってから月を進める
    setTimeout(() => {
      dispatch({ type: 'ADVANCE_MONTH' });
    }, 1500);
  }, []);

  // 遅延効果閉じ
  const handleDismissDelayed = useCallback(() => {
    dispatch({ type: 'DISMISS_DELAYED' });
  }, []);

  // クリア画面でグレード計算
  useEffect(() => {
    if (state.phase === 'cleared' && !state.grade) {
      const grade = computeFinalGrade(state.gauges, config);
      dispatch({ type: 'CLEAR_GAME', grade });
      clearGameState();
    }
  }, [state.phase, state.grade, state.gauges, config]);

  // ゲームオーバー時もセッションをクリア
  useEffect(() => {
    if (state.phase === 'game_over') {
      clearGameState();
    }
  }, [state.phase]);

  // リセット
  const handleReset = useCallback(() => {
    clearGameState();
    dispatch({ type: 'RESET' });
  }, []);

  // ゲストゲート表示判定
  const showGuestGate = isGuest && state.phase === 'playing' && state.currentMonth > GUEST_MONTH_LIMIT;

  return (
    <>
      {state.phase === 'setup' && (
        <SetupScreen onStart={handleStart} />
      )}

      {(state.phase === 'playing' || state.phase === 'outcome' || state.phase === 'delayed_effect') && (
        <>
          <GameDashboard
            state={state}
            onChoice={handleChoice}
          />

          {state.phase === 'outcome' && state.selectedChoice && (
            <OutcomeOverlay
              choice={state.selectedChoice}
              scenarioTitle={state.currentScenario?.title ?? ''}
              onDismiss={handleDismissOutcome}
            />
          )}

          {state.phase === 'delayed_effect' && state.firingEffects.length > 0 && (
            <DelayedEffectAlert
              effects={state.firingEffects}
              onDismiss={handleDismissDelayed}
            />
          )}

          {showGuestGate && (
            <GuestGateOverlay />
          )}
        </>
      )}

      {state.phase === 'game_over' && (
        <GameOverScreen
          reason={state.gameOverReason!}
          gauges={state.gauges}
          keyMoments={state.keyMoments}
          currentMonth={state.currentMonth}
          onReset={handleReset}
        />
      )}

      {state.phase === 'cleared' && state.grade && (
        <ResultsScreen
          gauges={state.gauges}
          grade={state.grade}
          keyMoments={state.keyMoments}
          totalMonths={state.totalMonths}
          setup={state.setup}
          onReset={handleReset}
          userId={userId}
        />
      )}
    </>
  );
}
