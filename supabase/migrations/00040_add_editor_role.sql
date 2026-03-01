-- ========================================
-- editorロール追加
-- profiles.role CHECK制約に 'editor' を追加
-- is_editor() ヘルパー関数作成
-- ========================================

-- 1. CHECK制約の更新
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'business', 'worker', 'editor'));

-- 2. is_editor() 関数（SECURITY DEFINER でRLS回避）
CREATE OR REPLACE FUNCTION public.is_editor()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'editor'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. blog_categories に editor 用ポリシー追加
DO $$ BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'blog_categories' AND policyname = 'blog_cat_editor'
  ) THEN
    CREATE POLICY "blog_cat_editor" ON public.blog_categories
      FOR SELECT USING (public.is_editor());
  END IF;
END $$;

-- 4. blog_posts の editor ポリシーを is_editor() ベースに更新
-- （既存ポリシーは profiles テーブル直接参照なので is_editor() に統一）
DROP POLICY IF EXISTS "blog_posts_editor_select" ON public.blog_posts;
CREATE POLICY "blog_posts_editor_select" ON public.blog_posts
  FOR SELECT USING (public.is_editor());

DROP POLICY IF EXISTS "blog_posts_editor_insert" ON public.blog_posts;
CREATE POLICY "blog_posts_editor_insert" ON public.blog_posts
  FOR INSERT WITH CHECK (
    public.is_editor() AND author_id = auth.uid()
  );

DROP POLICY IF EXISTS "blog_posts_editor_update" ON public.blog_posts;
CREATE POLICY "blog_posts_editor_update" ON public.blog_posts
  FOR UPDATE USING (
    public.is_editor() AND author_id = auth.uid()
  );

-- 5. blog_tags の editor ポリシーを is_editor() ベースに更新
DROP POLICY IF EXISTS "blog_tags_editor" ON public.blog_tags;
CREATE POLICY "blog_tags_editor" ON public.blog_tags
  FOR ALL USING (public.is_editor());

-- 6. blog_post_tags の editor ポリシーを is_editor() ベースに更新
DROP POLICY IF EXISTS "blog_pt_editor" ON public.blog_post_tags;
CREATE POLICY "blog_pt_editor" ON public.blog_post_tags
  FOR ALL USING (public.is_editor());
