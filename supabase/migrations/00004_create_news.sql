-- ========================================
-- ニュースアグリゲーション
-- ========================================

-- ニュースソース
CREATE TABLE public.news_sources (
  id            SERIAL PRIMARY KEY,
  name          TEXT NOT NULL,
  url           TEXT NOT NULL,
  feed_type     TEXT DEFAULT 'rss'
                CHECK (feed_type IN ('rss','atom','scrape')),
  scrape_config JSONB,
  is_active     BOOLEAN DEFAULT true,
  last_fetched  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now()
);

-- ニュース記事（スクレイピング結果）
CREATE TABLE public.news_articles (
  id              SERIAL PRIMARY KEY,
  source_id       INT REFERENCES public.news_sources(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  url             TEXT NOT NULL UNIQUE,
  published_at    TIMESTAMPTZ,
  fetched_at      TIMESTAMPTZ DEFAULT now(),
  summary         TEXT,
  thumbnail_url   TEXT,
  tags            TEXT[],
  is_pinned       BOOLEAN DEFAULT false,
  pin_order       INT DEFAULT 0
);

-- 独自解説記事
CREATE TABLE public.editorial_articles (
  id            SERIAL PRIMARY KEY,
  title         TEXT NOT NULL,
  slug          TEXT NOT NULL UNIQUE,
  body          TEXT NOT NULL,
  author_id     UUID REFERENCES public.profiles(id),
  status        TEXT DEFAULT 'draft'
                CHECK (status IN ('draft','published','archived')),
  is_pinned     BOOLEAN DEFAULT false,
  pin_order     INT DEFAULT 0,
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.news_sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.news_articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.editorial_articles ENABLE ROW LEVEL SECURITY;

-- ニュースソース: adminのみ管理
CREATE POLICY "news_sources_select" ON public.news_sources
  FOR SELECT USING (true);
CREATE POLICY "news_sources_admin" ON public.news_sources
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ニュース記事: 全ユーザー読み取り
CREATE POLICY "news_articles_select" ON public.news_articles
  FOR SELECT USING (true);
CREATE POLICY "news_articles_admin" ON public.news_articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 独自記事: 公開済みは全ユーザー読み取り, adminは全操作
CREATE POLICY "editorial_select_published" ON public.editorial_articles
  FOR SELECT USING (status = 'published');
CREATE POLICY "editorial_admin" ON public.editorial_articles
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- インデックス
CREATE INDEX idx_news_articles_published ON public.news_articles(published_at DESC);
CREATE INDEX idx_news_articles_pinned ON public.news_articles(is_pinned, pin_order);
CREATE INDEX idx_editorial_status ON public.editorial_articles(status, published_at DESC);

CREATE TRIGGER editorial_updated_at
  BEFORE UPDATE ON public.editorial_articles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
