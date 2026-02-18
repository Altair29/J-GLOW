-- ========================================
-- コンテンツブロック (ページ単位の動的テキスト)
-- ========================================

CREATE TABLE public.content_blocks (
  id          SERIAL PRIMARY KEY,
  page        TEXT NOT NULL,          -- 'top', 'business_home', 'worker_home', 'login', 'register_business', 'register_worker'
  block_key   TEXT NOT NULL,          -- 'hero_title', 'hero_subtitle', 'cta_text' 等
  content     TEXT NOT NULL,
  content_type TEXT DEFAULT 'text'
              CHECK (content_type IN ('text', 'richtext', 'html')),
  lang        TEXT DEFAULT 'ja',
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(page, block_key, lang)
);

ALTER TABLE public.content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "content_blocks_select" ON public.content_blocks
  FOR SELECT USING (true);
CREATE POLICY "content_blocks_admin" ON public.content_blocks
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER content_blocks_updated_at
  BEFORE UPDATE ON public.content_blocks
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- トップページ
-- ========================================
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('top', 'main_heading', '外国人材と企業をつなぐプラットフォーム', 1),
  ('top', 'sub_heading', 'あなたに合ったサービスをお選びください', 2),
  ('top', 'biz_card_title', '企業の方', 3),
  ('top', 'biz_card_desc', '監理団体・登録支援機関・受入企業向けのコンプライアンス支援ツール', 4),
  ('top', 'biz_card_bullets', '適正運営診断（AI分析付き）\n業界ニュースの一括チェック\n育成就労制度の最新情報\n採用コストシミュレーション', 5),
  ('top', 'biz_card_cta', '企業向けページへ', 6),
  ('top', 'wkr_card_title', '働く方', 7),
  ('top', 'wkr_card_desc', '日本で働く外国人の方への生活サポート（11ヶ国語対応）', 8),
  ('top', 'wkr_card_bullets', '転籍・転職サポート\n住居・医療・銀行の情報\n労働権利の解説\n多言語対応の相談窓口', 9),
  ('top', 'wkr_card_cta', 'For Workers / サポートページへ', 10),
  ('top', 'copyright', '© 2026 J-GLOW All Rights Reserved.', 11),
  ('top', 'login_button', 'ログイン', 12);

-- ========================================
-- 企業ホーム
-- ========================================
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('business_home', 'hero_title', '外国人材の適正な受入れを支援します', 1),
  ('business_home', 'hero_subtitle', '監理団体・登録支援機関・受入企業のためのコンプライアンス支援プラットフォーム', 2),
  ('business_home', 'hero_cta', '無料で診断を始める', 3),
  ('business_home', 'section_heading', '主要機能', 4),
  ('business_home', 'card_more_label', '詳しく見る', 5);

-- ========================================
-- 労働者ホーム
-- ========================================
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('worker_home', 'hero_title', '日本での生活をサポートします', 1),
  ('worker_home', 'hero_subtitle_en', 'We support your life in Japan', 2),
  ('worker_home', 'hero_note', '11 languages supported', 3),
  ('worker_home', 'section_heading', '生活課題サポート / Life Support Topics', 4),
  ('worker_home', 'section_desc', 'あなたの困りごとを選んでください / Choose your topic', 5);

-- ========================================
-- 企業向け機能カード (DB管理)
-- ========================================
CREATE TABLE public.feature_cards (
  id          SERIAL PRIMARY KEY,
  section     TEXT NOT NULL CHECK (section IN ('business', 'worker', 'admin')),
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  href        TEXT NOT NULL,
  icon        TEXT NOT NULL,           -- lucide-react アイコン名
  color_bg    TEXT DEFAULT '#eff6ff',   -- カード背景色
  color_text  TEXT DEFAULT '#1d4ed8',   -- カード文字色
  color_border TEXT DEFAULT '#bfdbfe',  -- カードボーダー色
  color_icon_bg TEXT DEFAULT '#dbeafe', -- アイコン背景色
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.feature_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "feature_cards_select" ON public.feature_cards
  FOR SELECT USING (true);
CREATE POLICY "feature_cards_admin" ON public.feature_cards
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

INSERT INTO public.feature_cards (section, title, description, href, icon, color_bg, color_text, color_border, color_icon_bg, sort_order) VALUES
  ('business', '適正運営診断', 'アンケートに回答するだけで、AIが運営体制を分析。改善ポイントをレポートで提示します。', '/business/diagnosis', 'ClipboardCheck', '#eff6ff', '#1d4ed8', '#bfdbfe', '#dbeafe', 1),
  ('business', 'ニュースヘッドライン', '外国人材に関する最新ニュースを自動収集。独自解説記事も掲載しています。', '/business/news', 'Newspaper', '#eef2ff', '#4338ca', '#c7d2fe', '#e0e7ff', 2),
  ('business', '育成就労ロードマップ', '新制度の全体像をタイムラインとフローチャートで直感的に把握できます。', '/business/ikusei', 'GitBranch', '#faf5ff', '#7e22ce', '#e9d5ff', '#f3e8ff', 3),
  ('business', '採用シミュレーション', '国籍・分野・時期を入力するだけで、コスト・リスク・注意点を即時試算します。', '/business/simulation', 'Calculator', '#ecfeff', '#0e7490', '#a5f3fc', '#cffafe', 4);

INSERT INTO public.feature_cards (section, title, description, href, icon, sort_order) VALUES
  ('admin', 'サイト設定', 'サイト名、カラー、テキストなどの基本設定を管理', '/admin/settings', 'Settings', 1),
  ('admin', '診断管理', 'カテゴリ、設問、配点、AIプロンプトの管理', '/admin/diagnosis', 'ClipboardCheck', 2),
  ('admin', 'ニュース管理', 'ニュースソース、記事固定、独自記事の管理', '/admin/news', 'Newspaper', 3),
  ('admin', 'シミュレーション管理', 'コスト係数、リスク係数、注意事項テンプレートの管理', '/admin/simulation', 'Calculator', 4),
  ('admin', '翻訳管理', 'UI文言の翻訳、LLMキャッシュの確認・修正', '/admin/translations', 'Globe', 5);

-- ========================================
-- ログイン / 登録ページテキスト
-- ========================================
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('login', 'heading', 'ログイン', 1),
  ('login', 'email_label', 'メールアドレス', 2),
  ('login', 'password_label', 'パスワード', 3),
  ('login', 'submit_button', 'ログイン', 4),
  ('login', 'submit_loading', 'ログイン中...', 5),
  ('login', 'error_invalid', 'メールアドレスまたはパスワードが正しくありません', 6),
  ('login', 'no_account', 'アカウントをお持ちでない方：', 7),
  ('login', 'register_business', '企業として登録', 8),
  ('login', 'register_worker', '個人として登録', 9),
  ('login', 'loading', '読み込み中...', 10);

INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('register_business', 'heading', '企業アカウント登録', 1),
  ('register_business', 'subheading', '監理団体・登録支援機関・受入企業の方向け', 2),
  ('register_business', 'domain_notice', '※ 企業登録には組織のメールアドレスが必要です（Gmail等のフリーメールは使用できません）', 3),
  ('register_business', 'org_label', '組織名', 4),
  ('register_business', 'name_label', '担当者名', 5),
  ('register_business', 'email_label', 'メールアドレス（組織ドメイン）', 6),
  ('register_business', 'password_label', 'パスワード（8文字以上）', 7),
  ('register_business', 'confirm_label', 'パスワード（確認）', 8),
  ('register_business', 'submit_button', '企業アカウントを作成', 9),
  ('register_business', 'submit_loading', '登録処理中...', 10),
  ('register_business', 'error_freemail', 'フリーメールアドレスでは企業登録できません。組織のメールアドレスをご使用ください。', 11),
  ('register_business', 'error_password_mismatch', 'パスワードが一致しません', 12),
  ('register_business', 'error_password_short', 'パスワードは8文字以上で設定してください', 13),
  ('register_business', 'success_title', '登録確認メールを送信しました', 14),
  ('register_business', 'has_account', '既にアカウントをお持ちですか？', 15);

INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('register_worker', 'heading', 'Register / 新規登録', 1),
  ('register_worker', 'subheading', 'For workers in Japan / 日本で働く方向け', 2),
  ('register_worker', 'name_label', 'Name / 名前', 3),
  ('register_worker', 'email_label', 'Email / メールアドレス', 4),
  ('register_worker', 'password_label', 'Password / パスワード（8+）', 5),
  ('register_worker', 'confirm_label', 'Confirm Password / パスワード確認', 6),
  ('register_worker', 'submit_button', 'Create Account / アカウント作成', 7),
  ('register_worker', 'submit_loading', 'Registering... / 登録中...', 8),
  ('register_worker', 'error_password_mismatch', 'パスワードが一致しません / Passwords do not match', 9),
  ('register_worker', 'error_password_short', 'パスワードは8文字以上で設定してください / Password must be at least 8 characters', 10),
  ('register_worker', 'success_title', 'Registration email sent / 登録確認メールを送信しました', 11),
  ('register_worker', 'has_account', 'Already have an account? / アカウントをお持ちの方', 12);

-- ========================================
-- ヘッダー共通テキスト
-- ========================================
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('business_header', 'brand_name', 'J-GLOW', 1),
  ('business_header', 'brand_badge', 'Business', 2),
  ('business_header', 'login_button', 'ログイン', 3),
  ('business_header', 'logout_button', 'ログアウト', 4),
  ('business_header', 'admin_link', '管理', 5),
  ('business_header', 'menu_label', 'メニュー', 6);

INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('worker_header', 'brand_name', 'J-GLOW', 1),
  ('worker_header', 'brand_badge', 'Worker', 2),
  ('worker_header', 'login_button', 'Login', 3),
  ('worker_header', 'logout_button', 'Logout', 4),
  ('worker_header', 'lang_default', '日本語', 5),
  ('worker_header', 'menu_label', 'Menu', 6);

-- ========================================
-- フッターテキスト
-- ========================================
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('footer', 'brand_name', 'J-GLOW', 1),
  ('footer', 'brand_desc', '外国人材と企業をつなぐ総合プラットフォーム', 2),
  ('footer', 'biz_section_title', '企業の方', 3),
  ('footer', 'wkr_section_title', '働く方', 4),
  ('footer', 'cross_link_to_worker', '外国人労働者の方はこちら →', 5),
  ('footer', 'cross_link_to_business', '企業の方はこちら →', 6),
  ('footer', 'copyright', '© 2026 J-GLOW All Rights Reserved.', 7),
  ('footer', 'back_to_site', '← サイトに戻る', 8);

-- ========================================
-- メタデータ (ページタイトル・description)
-- ========================================
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('meta', 'site_title', 'J-GLOW | 外国人材と企業をつなぐ総合プラットフォーム', 1),
  ('meta', 'site_description', '外国人材の適正な受入れを支援する総合プラットフォーム。企業向けコンプライアンス支援と、外国人労働者向け生活サポートを提供します。', 2),
  ('meta', 'business_title', 'J-GLOW | 企業向け', 3),
  ('meta', 'business_description', '監理団体・登録支援機関・受入企業のためのコンプライアンス支援プラットフォーム', 4),
  ('meta', 'worker_title', 'J-GLOW | For Workers', 5),
  ('meta', 'worker_description', 'Support platform for foreign workers in Japan', 6),
  ('meta', 'admin_title', 'J-GLOW | 管理パネル', 7);
