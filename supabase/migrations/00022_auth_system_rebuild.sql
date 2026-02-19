-- ========================================
-- 認証・プロファイルシステム再構築
-- profiles リファクタリング + 関連テーブル新規作成
-- ========================================

-- ========================================
-- 1. profiles テーブルリファクタリング
-- ========================================

-- 不要カラム削除
ALTER TABLE public.profiles DROP COLUMN IF EXISTS organization;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS email_domain;

-- role CHECK制約の更新（既存制約を削除して再作成）
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check
  CHECK (role IN ('admin', 'business', 'worker'));

-- 新カラム追加
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'free';
ALTER TABLE public.profiles ADD CONSTRAINT profiles_plan_check
  CHECK (plan IN ('free', 'premium'));

ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT false;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}';

-- 既存adminレコードを is_active=true に更新
UPDATE public.profiles SET is_active = true WHERE role = 'admin';

-- ========================================
-- 2. business_profiles テーブル
-- ========================================

CREATE TABLE public.business_profiles (
  id            UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  company_name  TEXT NOT NULL,
  department    TEXT,
  position      TEXT,
  contact_name  TEXT NOT NULL,
  business_email TEXT NOT NULL,
  email_domain  TEXT NOT NULL,
  phone         TEXT,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.business_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bp_select_own" ON public.business_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "bp_update_own" ON public.business_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "bp_admin_all" ON public.business_profiles
  FOR ALL USING (public.is_admin());

CREATE TRIGGER business_profiles_updated_at
  BEFORE UPDATE ON public.business_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- 3. worker_profiles テーブル
-- ========================================

CREATE TABLE public.worker_profiles (
  id               UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  nationality      TEXT NOT NULL,
  residence_status TEXT,
  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.worker_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "wp_select_own" ON public.worker_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "wp_update_own" ON public.worker_profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "wp_admin_all" ON public.worker_profiles
  FOR ALL USING (public.is_admin());

CREATE TRIGGER worker_profiles_updated_at
  BEFORE UPDATE ON public.worker_profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- 4. user_settings テーブル
-- ========================================

CREATE TABLE public.user_settings (
  id          UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  preferences JSONB DEFAULT '{}',
  updated_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "us_all_own" ON public.user_settings
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "us_admin_all" ON public.user_settings
  FOR ALL USING (public.is_admin());

CREATE TRIGGER user_settings_updated_at
  BEFORE UPDATE ON public.user_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- 5. user_scores テーブル
-- ========================================

CREATE TABLE public.user_scores (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category  TEXT NOT NULL,
  score     INTEGER,
  max_score INTEGER,
  answers   JSONB DEFAULT '{}',
  ai_report TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_user_scores_user_category ON public.user_scores (user_id, category);

ALTER TABLE public.user_scores ENABLE ROW LEVEL SECURITY;

CREATE POLICY "scores_select_own" ON public.user_scores
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "scores_insert_own" ON public.user_scores
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "scores_admin_all" ON public.user_scores
  FOR ALL USING (public.is_admin());

-- ========================================
-- 6. bookmarks テーブル
-- ========================================

CREATE TABLE public.bookmarks (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'job', 'resource')),
  content_id   UUID NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT now(),
  UNIQUE (user_id, content_type, content_id)
);

ALTER TABLE public.bookmarks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "bookmarks_all_own" ON public.bookmarks
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "bookmarks_admin_all" ON public.bookmarks
  FOR ALL USING (public.is_admin());

-- ========================================
-- 7. billing_history テーブル
-- ========================================

CREATE TABLE public.billing_history (
  id        UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id   UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount    INTEGER NOT NULL,
  currency  TEXT DEFAULT 'jpy',
  status    TEXT NOT NULL CHECK (status IN ('paid', 'failed', 'refunded')),
  provider  TEXT DEFAULT 'stripe',
  metadata  JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.billing_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "billing_select_own" ON public.billing_history
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "billing_admin_all" ON public.billing_history
  FOR ALL USING (public.is_admin());

-- ========================================
-- 8. blocked_email_domains 追加エントリ
-- ========================================

INSERT INTO public.blocked_email_domains (domain)
VALUES ('live.com'), ('msn.com'), ('googlemail.com')
ON CONFLICT (domain) DO NOTHING;

-- ========================================
-- 9. on_auth_user_created トリガー更新
-- ========================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  _role TEXT;
  _display_name TEXT;
BEGIN
  -- roleの決定: business/worker以外はworkerにフォールバック
  -- adminはトリガー経由では作成不可
  _role := COALESCE(NEW.raw_user_meta_data->>'role', 'worker');
  IF _role NOT IN ('business', 'worker') THEN
    _role := 'worker';
  END IF;

  -- display_nameの決定: full_name → name → メールのローカル部
  _display_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'name', ''),
    split_part(NEW.email, '@', 1)
  );

  -- profiles INSERT (is_active=false: メール認証完了後にtrueにする設計)
  INSERT INTO public.profiles (id, role, display_name, is_active)
  VALUES (NEW.id, _role, _display_name, false);

  -- user_settings も同時作成
  INSERT INTO public.user_settings (id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー自体は既存のものが関数を参照しているため再作成不要
-- (CREATE OR REPLACE FUNCTION で関数本体が置き換わる)
