-- ========================================
-- 外国人労働者向けコンテンツ
-- ========================================

-- 10大課題トピック
CREATE TABLE public.worker_topics (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  title_ja    TEXT NOT NULL,
  icon        TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- トピックコンテンツ（多言語）
CREATE TABLE public.worker_topic_contents (
  id          SERIAL PRIMARY KEY,
  topic_id    INT REFERENCES public.worker_topics(id) ON DELETE CASCADE,
  lang        TEXT NOT NULL,
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(topic_id, lang)
);

-- RLS
ALTER TABLE public.worker_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.worker_topic_contents ENABLE ROW LEVEL SECURITY;

-- 全ユーザー読み取り可
CREATE POLICY "worker_topics_select" ON public.worker_topics
  FOR SELECT USING (true);
CREATE POLICY "worker_topic_contents_select" ON public.worker_topic_contents
  FOR SELECT USING (true);

-- adminのみ書き込み
CREATE POLICY "worker_topics_admin" ON public.worker_topics
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "worker_topic_contents_admin" ON public.worker_topic_contents
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER worker_topic_contents_updated_at
  BEFORE UPDATE ON public.worker_topic_contents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- インデックス
CREATE INDEX idx_worker_topic_contents_topic_lang ON public.worker_topic_contents(topic_id, lang);

-- 初期10大課題データ
INSERT INTO public.worker_topics (slug, title_ja, icon, sort_order) VALUES
  ('transfer', '転籍・転職', 'ArrowRightLeft', 1),
  ('housing', '住居・賃貸', 'Home', 2),
  ('medical', '医療・健康', 'Heart', 3),
  ('labor_rights', '労働権利', 'Shield', 4),
  ('visa', '在留資格・ビザ', 'FileText', 5),
  ('japanese', '日本語学習', 'BookOpen', 6),
  ('banking', '銀行・金融', 'Wallet', 7),
  ('daily_life', '日常生活', 'Coffee', 8),
  ('emergency', '緊急時対応', 'AlertTriangle', 9),
  ('career', 'キャリアアップ', 'TrendingUp', 10);
