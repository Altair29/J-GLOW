-- ========================================
-- ヒーローコピー更新
-- ========================================
UPDATE content_blocks
SET content = 'グローバル人材の熱量(Glow)を、日本の新たな成長力(Grow)に。',
    updated_at = now()
WHERE page = 'business_home' AND block_key = 'hero_title' AND lang = 'ja';

UPDATE content_blocks
SET content = 'Japan and Global: Talent Glowing and Growing Together',
    updated_at = now()
WHERE page = 'business_home' AND block_key = 'hero_subtitle' AND lang = 'ja';

UPDATE content_blocks
SET content = '無料で適正運営診断を始める',
    updated_at = now()
WHERE page = 'business_home' AND block_key = 'hero_cta' AND lang = 'ja';

UPDATE content_blocks
SET content = 'J-GLOWの主要機能',
    updated_at = now()
WHERE page = 'business_home' AND block_key = 'section_heading' AND lang = 'ja';

-- ========================================
-- テーマ変数追加
-- ========================================
INSERT INTO theme_config (section, css_var, value, label, category, sort_order)
VALUES
  ('business', '--biz-hero-text-dark', '#1e293b', 'ヒーロー濃色テキスト', 'color', 110),
  ('business', '--biz-hero-subtext', '#475569', 'ヒーローサブテキスト', 'color', 111)
ON CONFLICT (section, css_var)
DO UPDATE SET
  value = EXCLUDED.value,
  label = EXCLUDED.label,
  updated_at = now();
