-- ========================================
-- 戦略的ホワイトペーパー
-- ========================================

-- カテゴリ: 重要分野別ガイド / 批判的論評 等
CREATE TABLE public.whitepaper_categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,       -- 'industry_guide', 'critical_review'
  name        TEXT NOT NULL,              -- '重要分野別ガイド', '「安価・確実」の裏側'
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true
);

-- ホワイトペーパー本体
CREATE TABLE public.whitepapers (
  id              SERIAL PRIMARY KEY,
  category_id     INT REFERENCES public.whitepaper_categories(id) ON DELETE SET NULL,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  subtitle        TEXT,                     -- サブタイトル・キャッチコピー
  body            TEXT NOT NULL,            -- 本文 (Markdown/HTML)
  summary         TEXT,                     -- 一覧表示用の要約
  industry        TEXT,                     -- 対象業界: 'construction','care','manufacturing','transport' 等
  thumbnail_url   TEXT,
  author          TEXT,
  status          TEXT DEFAULT 'draft'
                  CHECK (status IN ('draft','published','archived')),
  is_featured     BOOLEAN DEFAULT false,    -- トップ固定
  download_url    TEXT,                     -- PDF DL リンク (任意)
  requires_auth   BOOLEAN DEFAULT true,     -- 閲覧に認証が必要か
  view_count      INT DEFAULT 0,
  published_at    TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- DLリード管理 (DL時にメール取得)
CREATE TABLE public.whitepaper_downloads (
  id              SERIAL PRIMARY KEY,
  whitepaper_id   INT REFERENCES public.whitepapers(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  email           TEXT,
  organization    TEXT,
  downloaded_at   TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.whitepaper_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitepapers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.whitepaper_downloads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wp_cat_select" ON public.whitepaper_categories FOR SELECT USING (true);
CREATE POLICY "wp_cat_admin" ON public.whitepaper_categories FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- 公開済みは全ユーザー閲覧可
CREATE POLICY "wp_select_published" ON public.whitepapers
  FOR SELECT USING (status = 'published');
CREATE POLICY "wp_admin" ON public.whitepapers FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

-- DLログ: 本人 + admin
CREATE POLICY "wp_dl_own" ON public.whitepaper_downloads
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "wp_dl_admin" ON public.whitepaper_downloads FOR ALL USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE TRIGGER whitepapers_updated_at
  BEFORE UPDATE ON public.whitepapers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE INDEX idx_whitepapers_status ON public.whitepapers(status, published_at DESC);
CREATE INDEX idx_whitepapers_industry ON public.whitepapers(industry);
CREATE INDEX idx_wp_downloads_wp ON public.whitepaper_downloads(whitepaper_id);

-- 初期カテゴリ
INSERT INTO public.whitepaper_categories (slug, name, description, sort_order) VALUES
  ('industry_guide', '重要分野別ガイド', '建設・介護・製造・運輸等の業界動向と採用時の注意点', 1),
  ('critical_review', '「安価・確実」の裏側', '違法リスクを突く批判的論評。安易な外国人雇用の危険性を解説', 2),
  ('compliance', 'コンプライアンス解説', '法令遵守に関する実務的なガイダンス', 3),
  ('case_study', '事例集', '成功・失敗事例から学ぶ外国人雇用の実態', 4);
