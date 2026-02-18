-- ========================================
-- 高機能ブログシステム (B2B/B2C共通基盤)
-- ========================================

-- profilesのrole制約を拡張 (editor追加)
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'business', 'worker', 'editor'));

-- ========================================
-- ブログカテゴリ
-- ========================================
CREATE TABLE public.blog_categories (
  id          SERIAL PRIMARY KEY,
  slug        TEXT NOT NULL UNIQUE,
  name        TEXT NOT NULL,
  description TEXT,
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- ブログ記事
-- ========================================
CREATE TABLE public.blog_posts (
  id              SERIAL PRIMARY KEY,
  title           TEXT NOT NULL,
  slug            TEXT NOT NULL UNIQUE,
  body            TEXT NOT NULL DEFAULT '',    -- Markdown形式
  excerpt         TEXT,                        -- 一覧用の抜粋
  cover_image_url TEXT,                        -- カバー画像URL (空時にAI自動生成)
  category_id     INT REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  author_id       UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  status          TEXT NOT NULL DEFAULT 'draft'
                  CHECK (status IN ('draft', 'published', 'archived')),
  is_pinned       BOOLEAN DEFAULT false,       -- ピン固定
  pin_order       INT DEFAULT 0,               -- ピン固定時の表示順
  published_at    TIMESTAMPTZ,                 -- 公開日時 (指定可能)
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ========================================
-- タグ (多対多)
-- ========================================
CREATE TABLE public.blog_tags (
  id   SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE
);

CREATE TABLE public.blog_post_tags (
  post_id INT NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
  tag_id  INT NOT NULL REFERENCES public.blog_tags(id) ON DELETE CASCADE,
  PRIMARY KEY (post_id, tag_id)
);

-- ========================================
-- RLS
-- ========================================
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_post_tags ENABLE ROW LEVEL SECURITY;

-- カテゴリ: 全ユーザー読み取り可, admin のみ管理
CREATE POLICY "blog_cat_select" ON public.blog_categories
  FOR SELECT USING (true);
CREATE POLICY "blog_cat_admin" ON public.blog_categories
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- タグ: 全ユーザー読み取り可, admin + editor が管理
CREATE POLICY "blog_tags_select" ON public.blog_tags
  FOR SELECT USING (true);
CREATE POLICY "blog_tags_admin" ON public.blog_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "blog_tags_editor" ON public.blog_tags
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor')
  );

-- 記事ポストタグ中間テーブル: 読み取り全員, 書き込みは admin + 記事の作者
CREATE POLICY "blog_pt_select" ON public.blog_post_tags
  FOR SELECT USING (true);
CREATE POLICY "blog_pt_admin" ON public.blog_post_tags
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "blog_pt_editor" ON public.blog_post_tags
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.blog_posts bp
      WHERE bp.id = blog_post_tags.post_id AND bp.author_id = auth.uid()
    )
  );

-- 記事本体: 公開済み記事は全員閲覧可
CREATE POLICY "blog_posts_select_published" ON public.blog_posts
  FOR SELECT USING (
    status = 'published' AND (published_at IS NULL OR published_at <= now())
  );

-- 記事本体: admin は全記事を全操作可能
CREATE POLICY "blog_posts_admin" ON public.blog_posts
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 記事本体: editor は自分の記事のみ閲覧・編集可能 (下書き含む)
CREATE POLICY "blog_posts_editor_select" ON public.blog_posts
  FOR SELECT USING (
    author_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor')
  );

CREATE POLICY "blog_posts_editor_insert" ON public.blog_posts
  FOR INSERT WITH CHECK (
    author_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor')
  );

CREATE POLICY "blog_posts_editor_update" ON public.blog_posts
  FOR UPDATE USING (
    author_id = auth.uid()
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'editor')
  );

-- editor は削除不可 (adminのみ)

-- ========================================
-- トリガー
-- ========================================
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- インデックス
-- ========================================
CREATE INDEX idx_blog_posts_status_published ON public.blog_posts(status, published_at DESC);
CREATE INDEX idx_blog_posts_pinned ON public.blog_posts(is_pinned DESC, pin_order ASC);
CREATE INDEX idx_blog_posts_author ON public.blog_posts(author_id);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category_id);
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_post_tags_post ON public.blog_post_tags(post_id);
CREATE INDEX idx_blog_post_tags_tag ON public.blog_post_tags(tag_id);
CREATE INDEX idx_blog_categories_slug ON public.blog_categories(slug);

-- ========================================
-- 初期カテゴリ
-- ========================================
INSERT INTO public.blog_categories (slug, name, description, sort_order) VALUES
  ('announcement', 'お知らせ', 'J-GLOWからのお知らせ・プレスリリース', 1),
  ('compliance', 'コンプライアンス', '法令遵守に関する解説・ニュース', 2),
  ('industry', '業界動向', '外国人材業界の最新トレンド', 3),
  ('case_study', '事例紹介', '成功・失敗事例から学ぶ実務知識', 4),
  ('column', 'コラム', '専門家によるコラム・論考', 5);
