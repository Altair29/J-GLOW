-- ========================================
-- テーマ設定 (CSS変数として注入)
-- ========================================

CREATE TABLE public.theme_config (
  id          SERIAL PRIMARY KEY,
  section     TEXT NOT NULL CHECK (section IN ('global', 'business', 'worker')),
  css_var     TEXT NOT NULL,          -- CSS変数名 例: '--color-primary'
  value       TEXT NOT NULL,          -- 値 例: '#1a2f5e'
  label       TEXT NOT NULL,          -- 管理画面表示名
  category    TEXT DEFAULT 'color'
              CHECK (category IN ('color', 'font', 'spacing', 'other')),
  sort_order  INT DEFAULT 0,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(section, css_var)
);

ALTER TABLE public.theme_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "theme_select_all" ON public.theme_config
  FOR SELECT USING (true);
CREATE POLICY "theme_admin_write" ON public.theme_config
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER theme_config_updated_at
  BEFORE UPDATE ON public.theme_config
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- グローバルテーマ
INSERT INTO public.theme_config (section, css_var, value, label, category, sort_order) VALUES
  ('global', '--color-background', '#ffffff', '背景色', 'color', 1),
  ('global', '--color-foreground', '#171717', '文字色', 'color', 2),
  ('global', '--color-muted', '#6b7280', 'ミュート文字色', 'color', 3),
  ('global', '--color-border', '#e5e7eb', 'ボーダー色', 'color', 4),
  ('global', '--color-footer-bg', '#111827', 'フッター背景', 'color', 5),
  ('global', '--color-footer-text', '#9ca3af', 'フッター文字色', 'color', 6);

-- 企業テーマ
INSERT INTO public.theme_config (section, css_var, value, label, category, sort_order) VALUES
  ('business', '--biz-primary', '#1a2f5e', 'プライマリ（ネイビー）', 'color', 1),
  ('business', '--biz-primary-hover', '#14254b', 'プライマリホバー', 'color', 2),
  ('business', '--biz-secondary', '#c9a84c', 'セカンダリ（ブルー）', 'color', 3),
  ('business', '--biz-accent', '#c9a84c', 'アクセント', 'color', 4),
  ('business', '--biz-bg', '#f8fafc', 'セクション背景', 'color', 5),
  ('business', '--biz-hero-bg', '#1a2f5e', 'ヒーロー背景', 'color', 6),
  ('business', '--biz-hero-text', '#ffffff', 'ヒーロー文字色', 'color', 7),
  ('business', '--biz-card1-bg', '#eef1f7', 'カード1背景', 'color', 8),
  ('business', '--biz-card1-text', '#1a2f5e', 'カード1文字', 'color', 9),
  ('business', '--biz-card1-border', '#c5cfe0', 'カード1ボーダー', 'color', 10),
  ('business', '--biz-card2-bg', '#fdf8ee', 'カード2背景', 'color', 11),
  ('business', '--biz-card2-text', '#8a7530', 'カード2文字', 'color', 12),
  ('business', '--biz-card2-border', '#e8d9a0', 'カード2ボーダー', 'color', 13),
  ('business', '--biz-card3-bg', '#edf0f6', 'カード3背景', 'color', 14),
  ('business', '--biz-card3-text', '#2d4a7a', 'カード3文字', 'color', 15),
  ('business', '--biz-card3-border', '#c8d2e4', 'カード3ボーダー', 'color', 16),
  ('business', '--biz-card4-bg', '#fdf9f0', 'カード4背景', 'color', 17),
  ('business', '--biz-card4-text', '#7a6520', 'カード4文字', 'color', 18),
  ('business', '--biz-card4-border', '#e5daa8', 'カード4ボーダー', 'color', 19);

-- 労働者テーマ
INSERT INTO public.theme_config (section, css_var, value, label, category, sort_order) VALUES
  ('worker', '--wkr-primary', '#059669', 'プライマリ（エメラルド）', 'color', 1),
  ('worker', '--wkr-primary-hover', '#047857', 'プライマリホバー', 'color', 2),
  ('worker', '--wkr-accent', '#f59e0b', 'アクセント（オレンジ）', 'color', 3),
  ('worker', '--wkr-bg', '#f9fafb', 'セクション背景', 'color', 4),
  ('worker', '--wkr-hero-bg', '#059669', 'ヒーロー背景', 'color', 5),
  ('worker', '--wkr-hero-text', '#ffffff', 'ヒーロー文字色', 'color', 6),
  ('worker', '--wkr-login-text', '#047857', 'ログインボタン文字', 'color', 7);
