-- ========================================
-- 多言語翻訳
-- ========================================

-- LLM翻訳キャッシュ
CREATE TABLE public.translation_cache (
  id            SERIAL PRIMARY KEY,
  source_text   TEXT NOT NULL,
  source_lang   TEXT NOT NULL DEFAULT 'ja',
  target_lang   TEXT NOT NULL,
  translated    TEXT NOT NULL,
  context       TEXT,
  is_verified   BOOLEAN DEFAULT false,
  created_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(source_text, source_lang, target_lang)
);

-- UI文言の静的翻訳
CREATE TABLE public.ui_translations (
  id          SERIAL PRIMARY KEY,
  key         TEXT NOT NULL,
  lang        TEXT NOT NULL,
  value       TEXT NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(key, lang)
);

-- RLS
ALTER TABLE public.translation_cache ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ui_translations ENABLE ROW LEVEL SECURITY;

-- 全ユーザー読み取り可
CREATE POLICY "translation_cache_select" ON public.translation_cache
  FOR SELECT USING (true);
CREATE POLICY "ui_translations_select" ON public.ui_translations
  FOR SELECT USING (true);

-- adminのみ書き込み
CREATE POLICY "translation_cache_admin" ON public.translation_cache
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "ui_translations_admin" ON public.ui_translations
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER ui_translations_updated_at
  BEFORE UPDATE ON public.ui_translations
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- インデックス
CREATE INDEX idx_translation_cache_lookup ON public.translation_cache(source_lang, target_lang);
CREATE INDEX idx_ui_translations_lang ON public.ui_translations(lang);

-- 初期UI翻訳データ（日本語ベース）
INSERT INTO public.ui_translations (key, lang, value) VALUES
  ('nav.home', 'ja', 'ホーム'),
  ('nav.business', 'ja', '企業の方'),
  ('nav.worker', 'ja', '働く方'),
  ('nav.login', 'ja', 'ログイン'),
  ('nav.register', 'ja', '新規登録'),
  ('nav.logout', 'ja', 'ログアウト'),
  ('btn.submit', 'ja', '送信'),
  ('btn.next', 'ja', '次へ'),
  ('btn.prev', 'ja', '戻る'),
  ('btn.start', 'ja', '開始'),
  ('common.loading', 'ja', '読み込み中...'),
  ('nav.home', 'en', 'Home'),
  ('nav.business', 'en', 'For Business'),
  ('nav.worker', 'en', 'For Workers'),
  ('nav.login', 'en', 'Login'),
  ('nav.register', 'en', 'Register'),
  ('nav.logout', 'en', 'Logout'),
  ('btn.submit', 'en', 'Submit'),
  ('btn.next', 'en', 'Next'),
  ('btn.prev', 'en', 'Back'),
  ('btn.start', 'en', 'Start'),
  ('common.loading', 'en', 'Loading...');
