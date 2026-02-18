-- ========================================
-- 最新トレンドダッシュボード
-- ========================================

-- トレンドデータソース定義
CREATE TABLE public.trend_sources (
  id              SERIAL PRIMARY KEY,
  name            TEXT NOT NULL,              -- 'JITCO統計', '入管庁公表データ' 等
  source_url      TEXT,
  description     TEXT,
  update_frequency TEXT DEFAULT 'monthly'
                  CHECK (update_frequency IN ('daily','weekly','monthly','quarterly','yearly')),
  is_active       BOOLEAN DEFAULT true,
  last_updated    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- トレンドデータ (時系列)
CREATE TABLE public.trend_data (
  id              SERIAL PRIMARY KEY,
  source_id       INT REFERENCES public.trend_sources(id) ON DELETE CASCADE,
  metric_key      TEXT NOT NULL,              -- 'total_workers', 'by_nationality_vietnam' 等
  metric_label    TEXT NOT NULL,              -- '外国人労働者総数', 'ベトナム国籍' 等
  period          TEXT NOT NULL,              -- '2025-Q1', '2025-06' 等
  value           NUMERIC NOT NULL,
  unit            TEXT DEFAULT '人',          -- 単位
  category        TEXT,                       -- 'nationality', 'industry', 'visa_type', 'region'
  metadata        JSONB,                      -- 追加属性
  created_at      TIMESTAMPTZ DEFAULT now()
);

-- ダッシュボード表示設定 (管理者が配置・順序を制御)
CREATE TABLE public.trend_widgets (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  widget_type     TEXT NOT NULL
                  CHECK (widget_type IN ('line_chart','bar_chart','pie_chart','stat_card','table','map')),
  metric_keys     TEXT[] NOT NULL,            -- 表示対象のmetric_key配列
  config          JSONB,                      -- チャート設定 (色, ラベル, 軸等)
  sort_order      INT DEFAULT 0,
  is_active       BOOLEAN DEFAULT true,
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- トレンド解説記事 (ダッシュボードに紐づくインサイト)
CREATE TABLE public.trend_insights (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  body            TEXT NOT NULL,              -- Markdown
  related_metrics TEXT[],                     -- 関連するmetric_key配列
  author_id       UUID REFERENCES public.profiles(id),
  status          TEXT DEFAULT 'draft'
                  CHECK (status IN ('draft','published','archived')),
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.trend_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_widgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trend_insights ENABLE ROW LEVEL SECURITY;

-- 全ユーザー読み取り
CREATE POLICY "trend_src_select" ON public.trend_sources FOR SELECT USING (true);
CREATE POLICY "trend_data_select" ON public.trend_data FOR SELECT USING (true);
CREATE POLICY "trend_wid_select" ON public.trend_widgets FOR SELECT USING (true);
CREATE POLICY "trend_ins_select_pub" ON public.trend_insights
  FOR SELECT USING (status = 'published');

-- adminのみ書き込み
CREATE POLICY "trend_src_admin" ON public.trend_sources FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "trend_data_admin" ON public.trend_data FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "trend_wid_admin" ON public.trend_widgets FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
CREATE POLICY "trend_ins_admin" ON public.trend_insights FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TRIGGER trend_widgets_updated_at
  BEFORE UPDATE ON public.trend_widgets
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER trend_insights_updated_at
  BEFORE UPDATE ON public.trend_insights
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_trend_data_metric ON public.trend_data(metric_key, period);
CREATE INDEX idx_trend_data_source ON public.trend_data(source_id);
CREATE INDEX idx_trend_data_category ON public.trend_data(category);
