import type {
  SetupConfig,
  MsimGauges,
  MsimScenarioWithChoices,
  MsimChoice,
  MsimDelayedEffect,
  PendingEffect,
  KeyMoment,
  GameOverReason,
  Grade,
  GaugeDelta,
  GameState,
  GameAction,
} from './types';

// ==========================================
// 初期ゲージ算出（50ベースライン）
// ==========================================

export function computeInitialGauges(
  setup: SetupConfig,
  config: Record<string, unknown>
): MsimGauges {
  const fundsMap = (config['initial_funds'] ?? {}) as Record<string, number>;
  const gaugesDefault = (config['initial_gauges'] ?? {}) as Record<string, number>;

  const funds = fundsMap[setup.industry] ?? fundsMap['default'] ?? 5000000;

  return {
    funds,
    compliance: gaugesDefault['compliance'] ?? 50,
    morale: gaugesDefault['morale'] ?? 50,
    productivity: gaugesDefault['productivity'] ?? 50,
    retention: gaugesDefault['retention'] ?? 50,
  };
}

// ==========================================
// 月次収支
// ==========================================

export function getMonthlyRevenue(setup: SetupConfig, config: Record<string, unknown>): number {
  const revenueMap = (config['monthly_revenue_base'] ?? {}) as Record<string, number>;
  const base = revenueMap[setup.industry] ?? revenueMap['default'] ?? 800000;
  return Math.round(base * (setup.companySize / 20) * 0.5);
}

export function getMonthlyCost(setup: SetupConfig, config: Record<string, unknown>): number {
  const costMap = (config['monthly_cost_by_visa'] ?? {}) as Record<string, number>;
  const perPerson = costMap[setup.visaType] ?? 300000;
  return perPerson * setup.hireCount;
}

export function computeMonthlyFinancials(
  gauges: MsimGauges,
  monthlyRevenue: number,
  monthlyCost: number
): { revenue: number; cost: number; net: number } {
  const productivityFactor = 0.5 + (gauges.productivity / 100);
  const revenue = Math.round(monthlyRevenue * productivityFactor);
  return { revenue, cost: monthlyCost, net: revenue - monthlyCost };
}

// ==========================================
// 確率的揺らぎ（不確実性の導入）
// ==========================================

export function applyVariance(value: number, intensity = 0.25): number {
  if (value === 0) return 0;
  const variance = Math.round(value * intensity * (Math.random() * 2 - 1));
  return value + variance;
}

// ==========================================
// 因果関係ドリフト（ゲージ間の連鎖影響）
// ==========================================

function applyCausalDrift(gauges: MsimGauges): MsimGauges {
  const result = { ...gauges };

  // 士気低下 → 生産性が下がる（士気30未満で発動）
  if (result.morale < 30) {
    const impact = Math.round((30 - result.morale) * 0.1);
    result.productivity = clamp(result.productivity - impact, 0, 100);
  }

  // 定着率低下 → 再雇用コスト＋士気低下（定着率25未満で発動）
  if (result.retention < 25) {
    const impact = Math.round((25 - result.retention) * 0.08);
    result.funds -= impact * 50000;
    result.morale = clamp(result.morale - Math.ceil(impact * 0.5), 0, 100);
  }

  // 生産性低下 → 定着率が下がる（生産性25未満で発動）
  if (result.productivity < 25) {
    const impact = Math.round((25 - result.productivity) * 0.06);
    result.retention = clamp(result.retention - impact, 0, 100);
  }

  // コンプラ低下 → 士気低下（コンプラ20未満で発動）
  if (result.compliance < 20) {
    const impact = Math.round((20 - result.compliance) * 0.05);
    result.morale = clamp(result.morale - impact, 0, 100);
  }

  return result;
}

// ==========================================
// シナリオ抽選
// ==========================================

export function drawNextScenario(
  scenarios: MsimScenarioWithChoices[],
  setup: SetupConfig,
  month: number,
  usedIds: string[]
): MsimScenarioWithChoices | null {
  const eligible = scenarios.filter((s) => {
    if (!s.is_active) return false;
    if (usedIds.includes(s.id)) return false;
    if (month < s.phase_min || month > s.phase_max) return false;
    if (s.industries.length > 0 && !s.industries.includes(setup.industry)) return false;
    if (s.visa_types.length > 0 && !s.visa_types.includes(setup.visaType)) return false;
    return true;
  });

  if (eligible.length === 0) {
    const fallback = scenarios.filter((s) => {
      if (!s.is_active) return false;
      if (month < s.phase_min || month > s.phase_max) return false;
      if (s.industries.length > 0 && !s.industries.includes(setup.industry)) return false;
      if (s.visa_types.length > 0 && !s.visa_types.includes(setup.visaType)) return false;
      return true;
    });
    if (fallback.length === 0) return null;
    return weightedRandom(fallback);
  }

  return weightedRandom(eligible);
}

function weightedRandom<T extends { weight: number }>(items: T[]): T {
  const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
  let rand = Math.random() * totalWeight;
  for (const item of items) {
    rand -= item.weight;
    if (rand <= 0) return item;
  }
  return items[items.length - 1];
}

// ==========================================
// 効果適用
// ==========================================

export function applyChoiceEffects(
  gauges: MsimGauges,
  choice: GaugeDelta
): MsimGauges {
  return {
    funds: gauges.funds + choice.cost_delta,
    compliance: clamp(gauges.compliance + choice.compliance_delta, 0, 100),
    morale: clamp(gauges.morale + choice.morale_delta, 0, 100),
    productivity: clamp(gauges.productivity + choice.productivity_delta, 0, 100),
    retention: clamp(gauges.retention + choice.retention_delta, 0, 100),
  };
}

export function applyDelayedEffects(
  gauges: MsimGauges,
  effects: MsimDelayedEffect[]
): MsimGauges {
  let result = { ...gauges };
  for (const effect of effects) {
    result = applyChoiceEffects(result, effect);
  }
  return result;
}

export function applyMonthlyFinancials(
  gauges: MsimGauges,
  monthlyRevenue: number,
  monthlyCost: number
): MsimGauges {
  const { net } = computeMonthlyFinancials(gauges, monthlyRevenue, monthlyCost);
  return { ...gauges, funds: gauges.funds + net };
}

// ==========================================
// ゲームオーバー判定
// ==========================================

export function checkGameOver(gauges: MsimGauges): GameOverReason | null {
  if (gauges.funds <= 0) return 'funds';
  if (gauges.compliance <= 0) return 'compliance';
  if (gauges.morale <= 0) return 'morale';
  if (gauges.retention <= 0) return 'retention';
  return null;
}

// ==========================================
// グレード算出（50ベースライン対応）
// ==========================================

export function computeFinalGrade(
  gauges: MsimGauges,
  config: Record<string, unknown>
): Grade {
  const thresholds = (config['grade_thresholds'] ?? { S: 350, A: 280, B: 200, C: 0 }) as Record<
    string,
    number
  >;

  const fundsScore = clamp(Math.round((gauges.funds / 5000000) * 100), 0, 100);
  const total = fundsScore + gauges.compliance + gauges.morale + gauges.productivity + gauges.retention;

  if (total >= thresholds['S']) return 'S';
  if (total >= thresholds['A']) return 'A';
  if (total >= thresholds['B']) return 'B';
  return 'C';
}

// ==========================================
// 学習ポイント抽出
// ==========================================

export function extractLearningPoints(keyMoments: KeyMoment[]): string[] {
  const seen = new Set<string>();
  const points: string[] = [];
  for (const moment of keyMoments) {
    if (!seen.has(moment.learningPoint)) {
      seen.add(moment.learningPoint);
      points.push(moment.learningPoint);
    }
  }
  return points;
}

// ==========================================
// 遅延効果の収集
// ==========================================

export function collectFiringEffects(
  pendingEffects: PendingEffect[],
  month: number
): { firing: MsimDelayedEffect[]; remaining: PendingEffect[] } {
  const firing: MsimDelayedEffect[] = [];
  const remaining: PendingEffect[] = [];
  for (const pe of pendingEffects) {
    if (pe.triggerMonth <= month) {
      firing.push(pe.effect);
    } else {
      remaining.push(pe);
    }
  }
  return { firing, remaining };
}

export function queueDelayedEffects(
  currentMonth: number,
  effects: MsimDelayedEffect[]
): PendingEffect[] {
  return effects.map((e) => ({
    triggerMonth: currentMonth + e.delay_turns,
    effect: e,
  }));
}

// ==========================================
// デルタ抽出
// ==========================================

export function extractDelta(choice: GaugeDelta): Record<string, number> {
  return {
    funds: choice.cost_delta,
    compliance: choice.compliance_delta,
    morale: choice.morale_delta,
    productivity: choice.productivity_delta,
    retention: choice.retention_delta,
  };
}

// ==========================================
// Reducer
// ==========================================

export function gameReducer(state: GameState, action: GameAction): GameState {
  switch (action.type) {
    case 'START_GAME':
      return {
        ...state,
        phase: 'playing',
        setup: action.setup,
        gauges: action.gauges,
        previousGauges: null,
        lastChoiceDelta: null,
        currentMonth: 1,
        totalMonths: action.setup.totalMonths,
        usedScenarioIds: [],
        currentScenario: null,
        selectedChoice: null,
        pendingEffects: [],
        firingEffects: [],
        keyMoments: [],
        gameOverReason: null,
        grade: null,
        monthlyRevenue: action.monthlyRevenue,
        monthlyCost: action.monthlyCost,
      };

    case 'SET_SCENARIO':
      return { ...state, currentScenario: action.scenario };

    case 'SELECT_CHOICE': {
      const choice = action.choice;

      // 確率的揺らぎを適用（ゲージはまだ変更しない → DISMISS_OUTCOMEで適用）
      const actualDelta: GaugeDelta = {
        cost_delta: applyVariance(choice.cost_delta),
        compliance_delta: applyVariance(choice.compliance_delta),
        morale_delta: applyVariance(choice.morale_delta),
        productivity_delta: applyVariance(choice.productivity_delta),
        retention_delta: applyVariance(choice.retention_delta),
      };

      // 揺らぎ適用後のデルタでChoiceを記録（OutcomeOverlay表示用）
      const actualChoice = { ...choice, ...actualDelta };

      const moment: KeyMoment = {
        month: state.currentMonth,
        scenarioTitle: state.currentScenario?.title ?? '',
        category: state.currentScenario?.category ?? 'compliance',
        choiceLabel: choice.label,
        gaugeDelta: actualDelta,
        learningPoint: choice.learning_point,
        outcomeText: choice.outcome_text,
      };

      const newPending = [
        ...state.pendingEffects,
        ...queueDelayedEffects(state.currentMonth, choice.msim_delayed_effects),
      ];

      return {
        ...state,
        phase: 'outcome',
        // ゲージは変更しない — OutcomeOverlay閉じた後にアニメーション適用
        selectedChoice: actualChoice,
        lastChoiceDelta: actualDelta,
        usedScenarioIds: [...state.usedScenarioIds, state.currentScenario?.id ?? ''],
        keyMoments: [...state.keyMoments, moment],
        pendingEffects: newPending,
      };
    }

    case 'DISMISS_OUTCOME': {
      // ここでゲージ効果を適用（オーバーレイ閉じた後 → ユーザーの目の前でアニメーション）
      if (!state.selectedChoice) {
        return { ...state, phase: 'playing', currentScenario: null };
      }
      const newGauges = applyChoiceEffects(state.gauges, state.selectedChoice);
      const gameOver = checkGameOver(newGauges);
      if (gameOver) {
        return {
          ...state,
          phase: 'game_over',
          previousGauges: state.gauges,
          gauges: newGauges,
          gameOverReason: gameOver,
        };
      }
      return {
        ...state,
        phase: 'playing',
        previousGauges: state.gauges,
        gauges: newGauges,
        selectedChoice: null,
        currentScenario: null,
      };
    }

    case 'FIRE_DELAYED_EFFECTS': {
      const newGauges = applyDelayedEffects(state.gauges, action.effects);
      return {
        ...state,
        phase: 'delayed_effect',
        previousGauges: state.gauges,
        gauges: newGauges,
        firingEffects: action.effects,
      };
    }

    case 'DISMISS_DELAYED': {
      const gameOver = checkGameOver(state.gauges);
      if (gameOver) {
        return { ...state, phase: 'game_over', gameOverReason: gameOver, firingEffects: [] };
      }
      return { ...state, phase: 'playing', firingEffects: [] };
    }

    case 'ADVANCE_MONTH': {
      const nextMonth = state.currentMonth + 1;

      // 月次収支を適用
      let newGauges = applyMonthlyFinancials(state.gauges, state.monthlyRevenue, state.monthlyCost);

      // 因果関係ドリフトを適用（士気→生産性→定着率の連鎖）
      newGauges = applyCausalDrift(newGauges);

      const gameOver = checkGameOver(newGauges);
      if (gameOver) {
        return {
          ...state,
          currentMonth: nextMonth,
          previousGauges: state.gauges,
          gauges: newGauges,
          phase: 'game_over',
          gameOverReason: gameOver,
        };
      }

      if (nextMonth > state.totalMonths) {
        return {
          ...state,
          currentMonth: state.totalMonths,
          previousGauges: state.gauges,
          gauges: newGauges,
          phase: 'cleared',
        };
      }

      return {
        ...state,
        currentMonth: nextMonth,
        previousGauges: state.gauges,
        gauges: newGauges,
      };
    }

    case 'GAME_OVER':
      return { ...state, phase: 'game_over', gameOverReason: action.reason };

    case 'CLEAR_GAME':
      return { ...state, phase: 'cleared', grade: action.grade };

    case 'RESET':
      return initialGameState;

    case 'RESTORE':
      return {
        ...state,
        phase: 'playing',
        setup: action.setup,
        gauges: action.snapshot.gauges,
        previousGauges: null,
        lastChoiceDelta: null,
        currentMonth: action.snapshot.currentMonth,
        totalMonths: action.setup.totalMonths,
        usedScenarioIds: action.snapshot.usedScenarioIds,
        keyMoments: action.snapshot.keyMoments,
        pendingEffects: action.snapshot.pendingEffects,
        monthlyRevenue: action.monthlyRevenue,
        monthlyCost: action.monthlyCost,
        currentScenario: null,
        selectedChoice: null,
        firingEffects: [],
        gameOverReason: null,
        grade: null,
      };

    case 'RESTORE_SESSION': {
      // sessionStorageから復元 — 中間状態を安全なplayingに戻す
      const saved = action.savedState;
      const safePhase = (['outcome', 'delayed_effect'] as string[]).includes(saved.phase)
        ? 'playing' as const
        : saved.phase;
      return {
        ...saved,
        phase: safePhase,
        currentScenario: null,
        selectedChoice: null,
        firingEffects: [],
        previousGauges: null,
      };
    }

    default:
      return state;
  }
}

export const initialGameState: GameState = {
  phase: 'setup',
  setup: { industry: 'seizou', companySize: 20, hireCount: 1, totalMonths: 12, visaType: 'tokutei1' },
  gauges: { funds: 0, compliance: 0, morale: 0, productivity: 0, retention: 0 },
  previousGauges: null,
  lastChoiceDelta: null,
  currentMonth: 0,
  totalMonths: 12,
  usedScenarioIds: [],
  currentScenario: null,
  selectedChoice: null,
  pendingEffects: [],
  firingEffects: [],
  keyMoments: [],
  gameOverReason: null,
  grade: null,
  monthlyRevenue: 0,
  monthlyCost: 0,
};

// ==========================================
// ユーティリティ
// ==========================================

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function formatCurrency(amount: number): string {
  if (amount >= 10000 || amount <= -10000) {
    return `${(amount / 10000).toFixed(0)}万円`;
  }
  return `${amount.toLocaleString()}円`;
}

export function formatDelta(value: number, isCurrency = false): string {
  const sign = value > 0 ? '+' : '';
  if (isCurrency) return `${sign}${formatCurrency(value)}`;
  return `${sign}${value}`;
}
