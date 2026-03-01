// ========================================
// コストシミュレーター v2 型定義
// ========================================

import type { SimulatorCostItem, SimulatorOrgPreset } from '@/types/database';

// --- ユーザー種別・モード ---

export type SimulatorUserType = 'kanri' | 'support' | 'company' | 'guest';
export type SimulatorMode = 'quick' | 'detail';

// --- ビザ種別 ---

/** v2拡張ビザ種別 */
export type VisaTypeV2 =
  | 'ikusei'
  | 'tokutei1_kaigai'
  | 'tokutei1_kokunai'
  | 'tokutei2'
  | 'ginou'
  | 'student';

// --- v1互換型（CostSimulatorShell等で使用） ---

export type VisaChoice = 'ikusei' | 'tokutei' | 'both' | 'tokutei2' | 'ginou' | 'student' | 'compare';
export type TargetChoice = 'kaigai' | 'kokunai' | 'both';
export type HousingChoice = 'full' | 'partial' | 'none';
export type TrainingChoice = 'outsource' | 'inhouse' | 'pre_only';
export type SupportChoice = 'outsource' | 'inhouse';
export type SendingCountry = 'vietnam' | 'indonesia' | 'philippines' | 'myanmar' | 'other';
export type EmploymentType = 'fulltime' | 'parttime' | 'contract';
export type InterviewTrip = 'none' | 'domestic' | 'overseas';
export type TurnoverRate = 'low' | 'mid' | 'high'; // <10%, 10-30%, >30%
export type BudgetRange = 'under50' | '50to150' | 'unlimited';

// --- 業種定義 ---

export type IndustryDef = {
  id: string;
  label: string;
  icon: string;
  visaTypes: VisaTypeV2[];
};

// --- Step データ ---

/** Step0: 監理団体情報（kanriユーザーのみ） */
export type Step0Data = {
  orgName: string;
  staffName: string;
  managementFee: number;
  enrollmentFee: number;
  sendingOrgFeeOverride: number | null;
  brandColor: string;
  logoUrl: string | null;
};

/** Step1: 企業情報 */
export type Step1Data = {
  companyName: string;
  industry: string;
  foreignStatus: 'none' | 'ginou' | 'tokutei' | 'both';
  fullTimeStaff: number;
  // v2拡張（トグル内）
  pastTurnoverRate: TurnoverRate | null;
  initialBudget: BudgetRange | null;
};

/** Step2: 採用計画 */
export type Step2Data = {
  visaChoice: VisaChoice;
  targetChoice: TargetChoice;
  headcount: number;
  startDate: string; // YYYY-MM
  sendingCountry: SendingCountry;
  jobCategory: string;
  // v2拡張（トグル内）
  monthlyWage: number | null;
  employmentType: EmploymentType | null;
  planYears: 1 | 3 | 5 | null;
  interviewTrip: InterviewTrip | null;
};

/** Step3: 自社環境 */
export type Step3Data = {
  housing: HousingChoice;
  training: TrainingChoice;
  support: SupportChoice;
  // v2拡張（トグル内）
  housingMonthlyRent: number | null;
  interpreterStatus: 'needed' | 'existing' | 'unnecessary' | null;
};

/** v1互換: Step4Data（PdfDocument, ResultView等が使用） */
export type Step4Data = {
  orgName: string;
  orgContact: string;
  managementFee: number;
  enrollmentFee: number;
  sendingOrgFeeOverride: number | null;
  logoUrl: string | null;
  brandColor: string;
};

/** 全入力の統合型 */
export type AllInputs = {
  step0: Step0Data;
  step1: Step1Data;
  step2: Step2Data;
  step3: Step3Data;
  userType: SimulatorUserType;
  mode: SimulatorMode;
};

/** v1互換の入力型（既存コンポーネント用） */
export type AllInputsV1 = {
  step1: Omit<Step1Data, 'pastTurnoverRate' | 'initialBudget'>;
  step2: Omit<Step2Data, 'monthlyWage' | 'employmentType' | 'planYears' | 'interviewTrip'>;
  step3: Omit<Step3Data, 'housingMonthlyRent' | 'interpreterStatus'>;
  step4: Step4Data;
};

// --- QuickMode ---

export type QuickInputs = {
  industry: string;
  visaChoice: VisaChoice;
  headcount: number;
  startDate: string;
  fullTimeStaff: number | null; // 育成就労時のみ
};

// --- コスト計算結果 ---

export type CostLineItem = {
  key: string;
  label: string;
  min: number;
  max: number;
};

export type CostBreakdown = {
  visaType: string;
  visaLabel: string;
  initialItems: CostLineItem[];
  monthlyItems: CostLineItem[];
  riskItems: CostLineItem[];
  initialTotal: { min: number; max: number };
  monthlyTotal: { min: number; max: number };
  threeYearTotal: { min: number; max: number };
  riskTotal: { min: number; max: number };
  planYearsTotal?: { min: number; max: number };
};

// --- リスク分析 ---

export type RiskScenario = {
  label: string;
  turnoverRate: number;
  lostWorkers: number;
  vacancyCost: number;
  rehireCost: number;
  riskTotal: number;
};

// --- 診断結果 ---

export type DiagnosisType = 'urgent' | 'warning' | 'info' | 'opportunity';

export type DiagnosisItem = {
  type: DiagnosisType;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
};

// --- アクションプラン ---

export type ActionStep = {
  phase: string; // e.g. "今月中", "1〜2ヶ月目"
  tasks: { label: string; ctaHref?: string; ctaLabel?: string }[];
};

// --- 日本人採用比較 ---

export type JapaneseHiringBenchmark = {
  adCostPerHire: { min: number; max: number };
  agencyFeeRate: number; // 年収の%
  averageMonthlyWage: number;
  effectiveJobOpeningsRatio: number; // 有効求人倍率
};

// --- その他リスク ---

export type AdditionalRisk = {
  type: 'immigration' | 'regulatory' | 'currency' | 'compliance';
  label: string;
  description: string;
  severity: 'high' | 'medium' | 'low';
};

// --- Shell Props ---

export type ShellProps = {
  costItems: SimulatorCostItem[];
  presets: SimulatorOrgPreset[];
  userId: string | null;
  isLoggedIn: boolean;
  sharedSession: import('@/types/database').SimulatorSession | null;
};

// --- Shell Phase ---

export type ShellPhase =
  | 'landing'
  | 'quick'
  | 'detail-step0'
  | 'detail-step1'
  | 'detail-step2'
  | 'detail-step3'
  | 'result'
  | 'quickResult';
