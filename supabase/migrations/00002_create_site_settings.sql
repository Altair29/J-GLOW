-- ========================================
-- サイト設定 (管理パネル連動)
-- ========================================

CREATE TABLE public.site_settings (
  id          SERIAL PRIMARY KEY,
  section     TEXT NOT NULL CHECK (section IN ('global', 'business', 'worker')),
  key         TEXT NOT NULL,
  value       JSONB NOT NULL,
  value_type  TEXT NOT NULL DEFAULT 'text'
              CHECK (value_type IN ('text','color','number','richtext',
                                     'image_url','boolean','json')),
  label       TEXT NOT NULL,
  description TEXT,
  sort_order  INT DEFAULT 0,
  updated_by  UUID REFERENCES public.profiles(id),
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(section, key)
);

ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- 全ユーザー読み取り可
CREATE POLICY "settings_select_all" ON public.site_settings
  FOR SELECT USING (true);

-- adminのみ書き込み可
CREATE POLICY "settings_admin_write" ON public.site_settings
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ========================================
-- 初期設定データ (グローバル)
-- ========================================
INSERT INTO public.site_settings (section, key, value, value_type, label, description, sort_order) VALUES
  ('global', 'site_name', '"J-GLOW"', 'text', 'サイト名', 'サイト全体の名前', 1),
  ('global', 'site_description', '"外国人材と企業をつなぐ総合プラットフォーム"', 'text', 'サイト説明', 'メタディスクリプション等に使用', 2),
  ('global', 'copyright', '"© 2026 J-GLOW All Rights Reserved."', 'text', 'コピーライト', 'フッターに表示', 3),
  ('global', 'supported_languages', '["ja","en","vi","zh","id","tl","my","km","th","ne","mn"]', 'json', '対応言語', '対応する言語コードのリスト', 4);

-- 企業セクション
INSERT INTO public.site_settings (section, key, value, value_type, label, description, sort_order) VALUES
  ('business', 'primary_color', '"#1e3a5f"', 'color', 'プライマリカラー', 'ネイビー基調のメインカラー', 1),
  ('business', 'secondary_color', '"#2563eb"', 'color', 'セカンダリカラー', 'アクセントカラー', 2),
  ('business', 'hero_title', '"外国人材の適正な受入れを支援します"', 'text', 'ヒーローキャッチコピー', 'トップバナーの見出し', 3),
  ('business', 'hero_subtitle', '"監理団体・登録支援機関・受入企業のためのコンプライアンス支援プラットフォーム"', 'text', 'ヒーローサブテキスト', 'トップバナーの補足文', 4),
  ('business', 'cta_text', '"無料で診断を始める"', 'text', 'CTAボタン文言', '主要なアクションボタンのテキスト', 5);

-- 労働者セクション
INSERT INTO public.site_settings (section, key, value, value_type, label, description, sort_order) VALUES
  ('worker', 'primary_color', '"#059669"', 'color', 'プライマリカラー', '親しみやすいグリーン', 1),
  ('worker', 'accent_color', '"#f59e0b"', 'color', 'アクセントカラー', '温かみのあるオレンジ', 2),
  ('worker', 'welcome_message', '"日本での生活をサポートします"', 'text', 'ウェルカムメッセージ', 'トップの歓迎メッセージ', 3),
  ('worker', 'cta_text', '"サポートを受ける"', 'text', 'CTAボタン文言', 'メインアクションボタン', 4);
