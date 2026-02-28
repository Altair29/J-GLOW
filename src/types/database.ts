export type Role = 'admin' | 'business' | 'worker';

export type Plan = 'free' | 'premium';

export type Profile = {
  id: string;
  role: Role;
  display_name: string | null;
  preferred_lang: string;
  plan: Plan;
  plan_expires_at: string | null;
  is_active: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
};

export type BusinessType = 'supervisory' | 'support' | 'accepting_existing' | 'accepting_new';

export const BUSINESS_TYPE_LABELS: Record<BusinessType, string> = {
  supervisory: '監理団体',
  support: '登録支援機関',
  accepting_existing: '受入れ企業（経験あり）',
  accepting_new: '採用検討中の企業',
};

export type BusinessProfile = {
  id: string;
  company_name: string;
  department: string | null;
  position: string | null;
  contact_name: string;
  business_email: string;
  email_domain: string;
  phone: string | null;
  business_type: BusinessType | null;
  industry: string | null;
  created_at: string;
  updated_at: string;
};

export type WorkerProfile = {
  id: string;
  nationality: string;
  residence_status: string | null;
  created_at: string;
  updated_at: string;
};

export type UserSettings = {
  id: string;
  preferences: Record<string, unknown>;
  updated_at: string;
};

export type ScoreCategory = 'diagnosis' | 'simulation' | 'jp_test';

export type UserScore = {
  id: string;
  user_id: string;
  category: ScoreCategory;
  score: number | null;
  max_score: number | null;
  answers: Record<string, unknown>;
  ai_report: string | null;
  created_at: string;
};

export type BookmarkContentType = 'article' | 'job' | 'resource';

export type Bookmark = {
  id: string;
  user_id: string;
  content_type: BookmarkContentType;
  content_id: string;
  created_at: string;
};

export type BillingStatus = 'paid' | 'failed' | 'refunded';

export type BillingHistory = {
  id: string;
  user_id: string;
  amount: number;
  currency: string;
  status: BillingStatus;
  provider: string;
  metadata: Record<string, unknown>;
  created_at: string;
};

export type SettingValueType = 'text' | 'color' | 'number' | 'richtext' | 'image_url' | 'boolean' | 'json';
export type SettingSection = 'global' | 'business' | 'worker';

export type SiteSetting = {
  id: number;
  section: SettingSection;
  key: string;
  value: unknown;
  value_type: SettingValueType;
  label: string;
  description: string | null;
  sort_order: number;
  updated_by: string | null;
  updated_at: string;
};

export type DiagnosisCategory = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  icon: string | null;
  is_active: boolean;
};

export type QuestionType = 'single_choice' | 'multi_choice' | 'scale' | 'yes_no';

export type QuestionOption = {
  label: string;
  value: string;
  score: number;
};

export type DiagnosisQuestion = {
  id: number;
  category_id: number;
  question_text: string;
  question_type: QuestionType;
  options: QuestionOption[] | null;
  weight: number;
  sort_order: number;
  help_text: string | null;
  is_active: boolean;
};

export type SessionStatus = 'in_progress' | 'completed' | 'abandoned';

export type DiagnosisSession = {
  id: string;
  user_id: string;
  started_at: string;
  completed_at: string | null;
  status: SessionStatus;
  answers: Record<string, string> | null;
  raw_scores: Record<string, number> | null;
  total_score: number | null;
};

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export type DiagnosisReport = {
  id: string;
  session_id: string;
  user_id: string;
  summary: string | null;
  detail_analysis: Record<string, unknown> | null;
  risk_level: RiskLevel | null;
  recommendations: unknown[] | null;
  gemini_model: string | null;
  prompt_tokens: number | null;
  generated_at: string;
};

export type FeedType = 'rss' | 'atom' | 'scrape';

export type NewsSource = {
  id: number;
  name: string;
  url: string;
  feed_type: FeedType;
  scrape_config: Record<string, unknown> | null;
  is_active: boolean;
  last_fetched: string | null;
  created_at: string;
};

export type NewsArticle = {
  id: number;
  source_id: number;
  title: string;
  url: string;
  published_at: string | null;
  fetched_at: string;
  summary: string | null;
  thumbnail_url: string | null;
  tags: string[] | null;
  is_pinned: boolean;
  pin_order: number;
};

export type ArticleStatus = 'draft' | 'published' | 'archived';

export type EditorialArticle = {
  id: number;
  title: string;
  slug: string;
  body: string;
  author_id: string;
  status: ArticleStatus;
  is_pinned: boolean;
  pin_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// ========================================
// 外国人雇用シミュレーション（カードスワイプ型）
// ========================================

export type GaugeType = 'operation' | 'morale' | 'compliance';

export type SimulationCard = {
  id: string;
  turn_order: number;
  situation: string;
  yes_label: string;
  no_label: string;
  is_active: boolean;
  created_at: string;
};

export type SimulationEffect = {
  id: string;
  card_id: string;
  choice: 'yes' | 'no';
  gauge: GaugeType;
  delta: number;
  delay_turn: number | null;
  delay_delta: number | null;
  delay_gauge: string | null;
  delay_message: string | null;
};

export type SimulationConfig = {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
};

export type SimulationCardWithEffects = SimulationCard & {
  simulation_effects: SimulationEffect[];
};

export type SimulationParam = {
  id: number;
  param_group: string;
  key: string;
  label: string;
  value: unknown;
  conditions: Record<string, unknown> | null;
  description: string | null;
  updated_at: string;
};

export type SimulationLog = {
  id: string;
  user_id: string;
  input: Record<string, unknown>;
  result: Record<string, unknown>;
  created_at: string;
};

export type WorkerTopic = {
  id: number;
  slug: string;
  title_ja: string;
  title_en: string | null;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
};

export type WorkerTopicContent = {
  id: number;
  topic_id: number;
  lang: string;
  title: string;
  body: string;
  updated_at: string;
};

export type EventType = 'milestone' | 'regulation' | 'deadline';

export type IkuseiTimeline = {
  id: number;
  title: string;
  description: string | null;
  date_label: string | null;
  sort_order: number;
  event_type: EventType;
  is_active: boolean;
};

export type IkuseiFlowchart = {
  id: number;
  title: string;
  mermaid_code: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

// ========================================
// Phase 1: DB駆動テーブル型
// ========================================

export type NavSection =
  | 'business_header'
  | 'worker_header'
  | 'admin_sidebar'
  | 'footer_business'
  | 'footer_worker';

export type NavigationItem = {
  id: number;
  section: NavSection;
  label: string;
  href: string;
  icon: string | null;
  sort_order: number;
  is_active: boolean;
  requires_auth: boolean;
  required_role: Role | null;
  created_at: string;
};

export type ThemeCategory = 'color' | 'font' | 'spacing' | 'other';
export type ThemeSection = 'global' | 'business' | 'worker';

export type ThemeConfig = {
  id: number;
  section: ThemeSection;
  css_var: string;
  value: string;
  label: string;
  category: ThemeCategory;
  sort_order: number;
  updated_at: string;
};

export type ContentBlock = {
  id: number;
  page: string;
  block_key: string;
  content: string;
  content_type: 'text' | 'richtext' | 'html';
  lang: string;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

export type FeatureCard = {
  id: number;
  section: 'business' | 'worker' | 'admin';
  title: string;
  description: string;
  href: string;
  icon: string;
  color_bg: string;
  color_text: string;
  color_border: string;
  color_icon_bg: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

// ========================================
// Phase 1.5: 追加3機能 (ホワイトペーパー・助成金・トレンド)
// ========================================

export type WhitepaperCategory = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
};

export type WhitepaperStatus = 'draft' | 'published' | 'archived';

export type Whitepaper = {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  subtitle: string | null;
  body: string;
  summary: string | null;
  industry: string | null;
  thumbnail_url: string | null;
  author: string | null;
  status: WhitepaperStatus;
  is_featured: boolean;
  download_url: string | null;
  requires_auth: boolean;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type WhitepaperDownload = {
  id: number;
  whitepaper_id: number;
  user_id: string | null;
  email: string | null;
  organization: string | null;
  downloaded_at: string;
};

export type SubsidyStatus = 'active' | 'upcoming' | 'expired' | 'suspended';

export type Subsidy = {
  id: number;
  name: string;
  slug: string;
  provider: string;
  summary: string;
  detail: string | null;
  max_amount: string | null;
  requirements: Record<string, unknown> | null;
  eligible_regions: string[] | null;
  eligible_fields: string[] | null;
  eligible_visa_types: string[] | null;
  company_size: string[] | null;
  application_url: string | null;
  deadline: string | null;
  fiscal_year: string | null;
  status: SubsidyStatus;
  sort_order: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
};

export type SubsidyConditionType =
  | 'region'
  | 'field'
  | 'job_type'
  | 'visa_type'
  | 'company_size'
  | 'employee_count';

export type SubsidyCondition = {
  id: number;
  subsidy_id: number;
  condition_type: SubsidyConditionType;
  condition_value: string;
};

export type SubsidySearchLog = {
  id: string;
  user_id: string | null;
  search_params: Record<string, unknown>;
  results_count: number | null;
  matched_ids: number[] | null;
  created_at: string;
};

export type UpdateFrequency = 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'yearly';

export type TrendSource = {
  id: number;
  name: string;
  source_url: string | null;
  description: string | null;
  update_frequency: UpdateFrequency;
  is_active: boolean;
  last_updated: string | null;
  created_at: string;
};

export type TrendData = {
  id: number;
  source_id: number;
  metric_key: string;
  metric_label: string;
  period: string;
  value: number;
  unit: string;
  category: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
};

export type TrendWidgetType =
  | 'line_chart'
  | 'bar_chart'
  | 'pie_chart'
  | 'stat_card'
  | 'table'
  | 'map';

export type TrendWidget = {
  id: number;
  title: string;
  widget_type: TrendWidgetType;
  metric_keys: string[];
  config: Record<string, unknown> | null;
  sort_order: number;
  is_active: boolean;
  updated_at: string;
};

export type TrendInsightStatus = 'draft' | 'published' | 'archived';

export type TrendInsight = {
  id: number;
  title: string;
  body: string;
  related_metrics: string[] | null;
  author_id: string | null;
  status: TrendInsightStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// ========================================
// ブログシステム
// ========================================

export type BlogCategory = {
  id: number;
  slug: string;
  name: string;
  description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
};

export type BlogPostStatus = 'draft' | 'published' | 'archived';

export type BlogPost = {
  id: number;
  title: string;
  slug: string;
  body: string;
  excerpt: string | null;
  cover_image_url: string | null;
  category_id: number | null;
  author_id: string;
  status: BlogPostStatus;
  is_pinned: boolean;
  pin_order: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

export type BlogTag = {
  id: number;
  name: string;
  slug: string;
};

export type BlogPostTag = {
  post_id: number;
  tag_id: number;
};

// ========================================
// パートナーディレクトリ
// ========================================

export type PartnerType = 'supervisory' | 'admin_scrivener' | 'support_org';
export type PartnerPlan = 'sponsor' | 'member';

export const PARTNER_TYPE_LABELS: Record<PartnerType, string> = {
  supervisory: '監理団体',
  admin_scrivener: '行政書士',
  support_org: '登録支援機関',
};

export const PARTNER_PLAN_LABELS: Record<PartnerPlan, string> = {
  sponsor: 'スポンサー',
  member: 'メンバー',
};

export type Partner = {
  id: string;
  name: string;
  type: PartnerType;
  plan: PartnerPlan;
  prefecture: string | null;
  industries: string[];
  visas: string[];
  languages: string[];
  origin_countries: string[];
  description: string | null;
  contact_email: string | null;
  website_url: string | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
};

// ========================================
// お知らせ・通知
// ========================================

export type Notification = {
  id: string;
  user_id: string | null;
  title: string;
  body: string;
  link_url: string | null;
  is_read: boolean;
  send_email: boolean;
  created_at: string;
};
