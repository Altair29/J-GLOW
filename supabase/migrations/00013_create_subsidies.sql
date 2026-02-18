-- ========================================
-- 助成金活用ナビ
-- ========================================

-- 助成金マスタ
CREATE TABLE public.subsidies (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,              -- 助成金名
  slug            TEXT NOT NULL UNIQUE,
  provider        TEXT NOT NULL,              -- 提供元 (厚労省, 都道府県 等)
  summary         TEXT NOT NULL,              -- 概要
  detail          TEXT,                       -- 詳細説明 (Markdown)
  max_amount      TEXT,                       -- 最大金額 (表示用テキスト)
  requirements    JSONB,                      -- 申請要件 (構造化データ)
  eligible_regions TEXT[],                    -- 対象地域
  eligible_fields  TEXT[],                    -- 対象分野 (建設,介護,製造 等)
  eligible_visa_types TEXT[],                 -- 対象在留資格
  company_size    TEXT[],                     -- 対象企業規模 ('small','medium','large')
  application_url TEXT,                       -- 申請先URL
  deadline        TEXT,                       -- 申請期限 (表示用)
  fiscal_year     TEXT,                       -- 対象年度
  status          TEXT DEFAULT 'active'
                  CHECK (status IN ('active','upcoming','expired','suspended')),
  sort_order      INT DEFAULT 0,
  is_featured     BOOLEAN DEFAULT false,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- 助成金の適用条件テーブル (掛け合わせ検索用)
CREATE TABLE public.subsidy_conditions (
  id              SERIAL PRIMARY KEY,
  subsidy_id      INT REFERENCES public.subsidies(id) ON DELETE CASCADE,
  condition_type  TEXT NOT NULL
                  CHECK (condition_type IN ('region','field','job_type','visa_type','company_size','employee_count')),
  condition_value TEXT NOT NULL,
  UNIQUE(subsidy_id, condition_type, condition_value)
);

-- 助成金シミュレーション実行ログ
CREATE TABLE public.subsidy_search_logs (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  search_params   JSONB NOT NULL,             -- {region, field, job_type, visa_type, company_size}
  results_count   INT,
  matched_ids     INT[],                      -- マッチした助成金ID配列
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.subsidies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsidy_conditions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subsidy_search_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "subsidies_select" ON public.subsidies FOR SELECT USING (true);
CREATE POLICY "subsidies_admin" ON public.subsidies FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "subsidy_cond_select" ON public.subsidy_conditions FOR SELECT USING (true);
CREATE POLICY "subsidy_cond_admin" ON public.subsidy_conditions FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "subsidy_logs_own" ON public.subsidy_search_logs
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "subsidy_logs_admin" ON public.subsidy_search_logs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TRIGGER subsidies_updated_at
  BEFORE UPDATE ON public.subsidies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_subsidies_status ON public.subsidies(status);
CREATE INDEX idx_subsidy_cond_type ON public.subsidy_conditions(condition_type, condition_value);
CREATE INDEX idx_subsidy_cond_sub ON public.subsidy_conditions(subsidy_id);
