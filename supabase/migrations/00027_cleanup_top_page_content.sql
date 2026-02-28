-- ========================================
-- トップページ content_blocks 整理
-- 旧ポータルカード（企業/働く方）のデータを削除し、
-- 新レイアウト（Hero + 3本柱）に合わせたデータに更新
-- ========================================

-- 1. 旧ポータルカード用の不要エントリを削除
DELETE FROM public.content_blocks
WHERE page = 'top' AND block_key IN (
  'main_heading',
  'sub_heading',
  'section_heading',
  'section_sub',
  'hero_cta_biz',
  'hero_cta_wkr',
  'biz_card_title',
  'biz_card_desc',
  'biz_card_bullets',
  'biz_card_cta',
  'wkr_card_title',
  'wkr_card_desc',
  'wkr_card_bullets',
  'wkr_card_cta'
);

-- 2. 新Heroテキストを登録
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('top', 'hero_heading', 'グローバル人材の熱量(Glow)を、日本の新たな成長力(Grow)に。', 1),
  ('top', 'hero_sub_en', 'Japan and Global: Talent Glowing and Growing Together', 2),
  ('top', 'hero_guide', 'あなたの状況を選んでください', 3),
  ('top', 'pillars_heading', 'あなたの状況に合わせてお選びください', 4),
  ('top', 'tools_heading', '活用できるツール', 5),
  ('top', 'articles_heading', 'もっと詳しく知りたい方へ', 6)
ON CONFLICT (page, block_key, lang)
DO UPDATE SET
  content = EXCLUDED.content,
  sort_order = EXCLUDED.sort_order,
  updated_at = now();
