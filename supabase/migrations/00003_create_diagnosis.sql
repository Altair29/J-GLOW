-- ========================================
-- 適正運営診断
-- ========================================

-- 診断カテゴリ
CREATE TABLE public.diagnosis_categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INT DEFAULT 0,
  icon        TEXT,
  is_active   BOOLEAN DEFAULT true
);

-- 診断設問
CREATE TABLE public.diagnosis_questions (
  id            SERIAL PRIMARY KEY,
  category_id   INT REFERENCES public.diagnosis_categories(id) ON DELETE CASCADE,
  question_text TEXT NOT NULL,
  question_type TEXT NOT NULL DEFAULT 'single_choice'
                CHECK (question_type IN ('single_choice','multi_choice','scale','yes_no')),
  options       JSONB,
  weight        NUMERIC DEFAULT 1.0,
  sort_order    INT DEFAULT 0,
  help_text     TEXT,
  is_active     BOOLEAN DEFAULT true
);

-- 診断セッション
CREATE TABLE public.diagnosis_sessions (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  started_at    TIMESTAMPTZ DEFAULT now(),
  completed_at  TIMESTAMPTZ,
  status        TEXT DEFAULT 'in_progress'
                CHECK (status IN ('in_progress','completed','abandoned')),
  answers       JSONB,
  raw_scores    JSONB,
  total_score   NUMERIC
);

-- AI分析レポート
CREATE TABLE public.diagnosis_reports (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id      UUID REFERENCES public.diagnosis_sessions(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  summary         TEXT,
  detail_analysis JSONB,
  risk_level      TEXT CHECK (risk_level IN ('low','medium','high','critical')),
  recommendations JSONB,
  gemini_model    TEXT,
  prompt_tokens   INT,
  generated_at    TIMESTAMPTZ DEFAULT now()
);

-- AIプロンプト設定（管理パネルから編集可能）
CREATE TABLE public.diagnosis_ai_config (
  id              SERIAL PRIMARY KEY,
  system_prompt   TEXT NOT NULL,
  model_name      TEXT DEFAULT 'gemini-2.0-flash',
  temperature     NUMERIC DEFAULT 0.7,
  max_tokens      INT DEFAULT 4096,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 初期AIプロンプト
INSERT INTO public.diagnosis_ai_config (system_prompt) VALUES (
  'あなたは外国人材受入れに関するコンプライアンスの専門家です。以下のアンケート回答結果を分析し、各カテゴリごとの評価と改善提案を日本語で提供してください。リスクレベル（low/medium/high/critical）も判定してください。'
);

-- RLS
ALTER TABLE public.diagnosis_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.diagnosis_ai_config ENABLE ROW LEVEL SECURITY;

-- カテゴリ・設問: 全ユーザー読み取り可
CREATE POLICY "diagnosis_categories_select" ON public.diagnosis_categories
  FOR SELECT USING (true);
CREATE POLICY "diagnosis_questions_select" ON public.diagnosis_questions
  FOR SELECT USING (true);

-- カテゴリ・設問: adminのみ書き込み
CREATE POLICY "diagnosis_categories_admin" ON public.diagnosis_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "diagnosis_questions_admin" ON public.diagnosis_questions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- セッション: 本人のみ読み書き
CREATE POLICY "diagnosis_sessions_own" ON public.diagnosis_sessions
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "diagnosis_sessions_admin" ON public.diagnosis_sessions
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- レポート: 本人のみ読み取り
CREATE POLICY "diagnosis_reports_own" ON public.diagnosis_reports
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "diagnosis_reports_admin" ON public.diagnosis_reports
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- AI設定: adminのみ
CREATE POLICY "diagnosis_ai_config_select" ON public.diagnosis_ai_config
  FOR SELECT USING (true);
CREATE POLICY "diagnosis_ai_config_admin" ON public.diagnosis_ai_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- インデックス
CREATE INDEX idx_diagnosis_questions_category ON public.diagnosis_questions(category_id);
CREATE INDEX idx_diagnosis_sessions_user ON public.diagnosis_sessions(user_id);
CREATE INDEX idx_diagnosis_reports_session ON public.diagnosis_reports(session_id);
