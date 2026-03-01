// ==========================================
// 経営シミュレーション 型定義
// ==========================================

/** シナリオカテゴリ（9種） */
export type MsimCategory =
  | 'compliance'
  | 'cost'
  | 'field_issue'
  | 'life_support'
  | 'relations'
  | 'neighbor'
  | 'positive'
  | 'government'
  | 'retention';

/** 業種 */
export type MsimIndustry =
  | 'kensetsu'
  | 'seizou'
  | 'kaigo'
  | 'gaishoku'
  | 'nogyo'
  | 'shukuhaku'
  | 'gyogyo'
  | 'biru'
  | 'other';

/** ビザ種別 */
export type MsimVisaType = 'ikusei' | 'tokutei1' | 'tokutei2';

/** ゲームフェーズ */
export type GamePhase =
  | 'setup'
  | 'playing'
  | 'outcome'         // 選択結果表示中
  | 'delayed_effect'  // 遅延効果発動表示中
  | 'game_over'
  | 'cleared';

/** セッションステータス */
export type SessionStatus = 'in_progress' | 'cleared' | 'game_over';

/** グレード */
export type Grade = 'S' | 'A' | 'B' | 'C';

/** ゲームオーバー理由 */
export type GameOverReason = 'funds' | 'compliance' | 'morale' | 'retention';

// ==========================================
// セットアップ
// ==========================================

export type SetupConfig = {
  industry: MsimIndustry;
  companySize: number;
  hireCount: number;
  totalMonths: number;
  visaType: MsimVisaType;
};

// ==========================================
// ゲージ
// ==========================================

export type MsimGauges = {
  funds: number;         // 実額（円）
  compliance: number;    // 0-100
  morale: number;        // 0-100
  productivity: number;  // 0-100
  retention: number;     // 0-100
};

export type GaugeKey = keyof MsimGauges;

export type GaugeDelta = {
  cost_delta: number;
  compliance_delta: number;
  morale_delta: number;
  productivity_delta: number;
  retention_delta: number;
};

// ==========================================
// DB 行型
// ==========================================

export type MsimScenario = {
  id: string;
  category: MsimCategory;
  title: string;
  situation: string;
  detail: string | null;
  icon: string | null;
  industries: string[];
  visa_types: string[];
  phase_min: number;
  phase_max: number;
  weight: number;
  is_active: boolean;
  sort_order: number;
};

export type MsimChoice = {
  id: string;
  scenario_id: string;
  sort_order: number;
  label: string;
  description: string | null;
  cost_delta: number;
  compliance_delta: number;
  morale_delta: number;
  productivity_delta: number;
  retention_delta: number;
  outcome_text: string;
  learning_point: string;
};

export type MsimDelayedEffect = {
  id: string;
  choice_id: string;
  delay_turns: number;
  cost_delta: number;
  compliance_delta: number;
  morale_delta: number;
  productivity_delta: number;
  retention_delta: number;
  message: string;
};

export type MsimScenarioWithChoices = MsimScenario & {
  msim_choices: (MsimChoice & {
    msim_delayed_effects: MsimDelayedEffect[];
  })[];
};

export type MsimConfig = {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
};

export type MsimSession = {
  id: string;
  user_id: string;
  industry: string;
  visa_type: string;
  company_size: number;
  hire_count: number;
  total_months: number;
  current_month: number;
  status: SessionStatus;
  game_over_reason: string | null;
  final_gauges: MsimGauges | null;
  grade: string | null;
  snapshot: GameSnapshot;
  created_at: string;
  updated_at: string;
};

// ==========================================
// ゲーム状態
// ==========================================

/** キーモーメント（判断の振り返り用） */
export type KeyMoment = {
  month: number;
  scenarioTitle: string;
  category: MsimCategory;
  choiceLabel: string;
  gaugeDelta: GaugeDelta;
  learningPoint: string;
  outcomeText?: string;
};

/** 遅延効果キュー */
export type PendingEffect = {
  triggerMonth: number;
  effect: MsimDelayedEffect;
};

/** ゲームスナップショット（セッション保存用） */
export type GameSnapshot = {
  gauges: MsimGauges;
  currentMonth: number;
  usedScenarioIds: string[];
  keyMoments: KeyMoment[];
  pendingEffects: PendingEffect[];
};

/** ゲーム全体状態 */
export type GameState = {
  phase: GamePhase;
  setup: SetupConfig;
  gauges: MsimGauges;
  previousGauges: MsimGauges | null;
  lastChoiceDelta: GaugeDelta | null;
  currentMonth: number;
  totalMonths: number;
  usedScenarioIds: string[];
  currentScenario: MsimScenarioWithChoices | null;
  selectedChoice: (MsimChoice & { msim_delayed_effects: MsimDelayedEffect[] }) | null;
  pendingEffects: PendingEffect[];
  firingEffects: MsimDelayedEffect[];
  keyMoments: KeyMoment[];
  gameOverReason: GameOverReason | null;
  grade: Grade | null;
  monthlyRevenue: number;
  monthlyCost: number;
};

// ==========================================
// Reducer アクション
// ==========================================

export type GameAction =
  | { type: 'START_GAME'; setup: SetupConfig; gauges: MsimGauges; monthlyRevenue: number; monthlyCost: number }
  | { type: 'SET_SCENARIO'; scenario: MsimScenarioWithChoices }
  | { type: 'SELECT_CHOICE'; choice: MsimChoice & { msim_delayed_effects: MsimDelayedEffect[] } }
  | { type: 'DISMISS_OUTCOME' }
  | { type: 'FIRE_DELAYED_EFFECTS'; effects: MsimDelayedEffect[] }
  | { type: 'DISMISS_DELAYED' }
  | { type: 'ADVANCE_MONTH' }
  | { type: 'GAME_OVER'; reason: GameOverReason }
  | { type: 'CLEAR_GAME'; grade: Grade }
  | { type: 'RESET' }
  | { type: 'RESTORE'; snapshot: GameSnapshot; setup: SetupConfig; monthlyRevenue: number; monthlyCost: number }
  | { type: 'RESTORE_SESSION'; savedState: GameState };
