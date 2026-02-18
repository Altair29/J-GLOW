-- ========================================
-- 育成就労コンテンツ
-- ========================================

-- タイムラインイベント
CREATE TABLE public.ikusei_timeline (
  id          SERIAL PRIMARY KEY,
  title       TEXT NOT NULL,
  description TEXT,
  date_label  TEXT,
  sort_order  INT DEFAULT 0,
  event_type  TEXT DEFAULT 'milestone'
              CHECK (event_type IN ('milestone','regulation','deadline')),
  is_active   BOOLEAN DEFAULT true
);

-- フローチャート定義
CREATE TABLE public.ikusei_flowcharts (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  mermaid_code  TEXT NOT NULL,
  description   TEXT,
  sort_order    INT DEFAULT 0,
  is_active     BOOLEAN DEFAULT true,
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.ikusei_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ikusei_flowcharts ENABLE ROW LEVEL SECURITY;

-- 全ユーザー読み取り可
CREATE POLICY "ikusei_timeline_select" ON public.ikusei_timeline
  FOR SELECT USING (true);
CREATE POLICY "ikusei_flowcharts_select" ON public.ikusei_flowcharts
  FOR SELECT USING (true);

-- adminのみ書き込み
CREATE POLICY "ikusei_timeline_admin" ON public.ikusei_timeline
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "ikusei_flowcharts_admin" ON public.ikusei_flowcharts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER ikusei_flowcharts_updated_at
  BEFORE UPDATE ON public.ikusei_flowcharts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
