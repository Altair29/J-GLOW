-- ========================================
-- プロファイル & メールドメイン制御
-- ========================================

-- ユーザープロファイル (auth.usersを拡張)
CREATE TABLE public.profiles (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role          TEXT NOT NULL DEFAULT 'worker'
                CHECK (role IN ('admin', 'business', 'worker')),
  display_name  TEXT,
  organization  TEXT,
  email_domain  TEXT,
  preferred_lang TEXT DEFAULT 'ja',
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

-- 企業登録を許可するメールドメイン
CREATE TABLE public.allowed_email_domains (
  id          SERIAL PRIMARY KEY,
  domain      TEXT NOT NULL UNIQUE,
  org_name    TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- ブロック対象のフリーメールドメイン
CREATE TABLE public.blocked_email_domains (
  id      SERIAL PRIMARY KEY,
  domain  TEXT NOT NULL UNIQUE
);

-- 初期ブロックドメインのシード
INSERT INTO public.blocked_email_domains (domain) VALUES
  ('gmail.com'),
  ('yahoo.co.jp'),
  ('yahoo.com'),
  ('hotmail.com'),
  ('outlook.com'),
  ('outlook.jp'),
  ('icloud.com'),
  ('me.com'),
  ('aol.com'),
  ('protonmail.com'),
  ('mail.com');

-- RLS有効化
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_email_domains ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blocked_email_domains ENABLE ROW LEVEL SECURITY;

-- profiles: 本人は自分のデータを読み書き可
CREATE POLICY "profiles_select_own" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles_update_own" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- profiles: adminは全件操作可
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles p
      WHERE p.id = auth.uid() AND p.role = 'admin'
    )
  );

-- allowed_email_domains: 全ユーザー読み取り可, adminのみ書き込み
CREATE POLICY "allowed_domains_select" ON public.allowed_email_domains
  FOR SELECT USING (true);

CREATE POLICY "allowed_domains_admin" ON public.allowed_email_domains
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- blocked_email_domains: 全ユーザー読み取り可, adminのみ書き込み
CREATE POLICY "blocked_domains_select" ON public.blocked_email_domains
  FOR SELECT USING (true);

CREATE POLICY "blocked_domains_admin" ON public.blocked_email_domains
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- 新規ユーザー作成時にprofileを自動作成するトリガー
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, role, email_domain, display_name)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'role', 'worker'),
    split_part(NEW.email, '@', 2),
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- updated_at を自動更新するトリガー
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
