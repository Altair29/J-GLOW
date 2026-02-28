-- ========================================
-- Business テーマカラー統一
-- メインカラー: #1a2f5e（ネイビー）
-- アクセント:   #c9a84c（ゴールド）
-- ========================================

UPDATE public.theme_config SET value = '#1a2f5e', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-primary';

UPDATE public.theme_config SET value = '#14254b', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-primary-hover';

UPDATE public.theme_config SET value = '#c9a84c', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-secondary';

UPDATE public.theme_config SET value = '#c9a84c', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-accent';

UPDATE public.theme_config SET value = '#1a2f5e', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-hero-bg';

-- カード色をネイビー/ゴールド基調に統一
UPDATE public.theme_config SET value = '#eef1f7', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card1-bg';
UPDATE public.theme_config SET value = '#1a2f5e', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card1-text';
UPDATE public.theme_config SET value = '#c5cfe0', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card1-border';

UPDATE public.theme_config SET value = '#fdf8ee', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card2-bg';
UPDATE public.theme_config SET value = '#8a7530', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card2-text';
UPDATE public.theme_config SET value = '#e8d9a0', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card2-border';

UPDATE public.theme_config SET value = '#edf0f6', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card3-bg';
UPDATE public.theme_config SET value = '#2d4a7a', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card3-text';
UPDATE public.theme_config SET value = '#c8d2e4', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card3-border';

UPDATE public.theme_config SET value = '#fdf9f0', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card4-bg';
UPDATE public.theme_config SET value = '#7a6520', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card4-text';
UPDATE public.theme_config SET value = '#e5daa8', updated_at = now()
  WHERE section = 'business' AND css_var = '--biz-card4-border';
