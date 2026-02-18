-- ========================================
-- 1. feature_labels を content_blocks に登録
--    管理者パネルから編集可能にする
-- ========================================
INSERT INTO content_blocks (page, block_key, content, content_type, lang, sort_order, is_active)
VALUES
  ('feature_labels', 'simulation',  '初めての外国人雇用',             'text', 'ja', 1, true),
  ('feature_labels', 'assessment',  '外国人雇用の無料適正診断',        'text', 'ja', 2, true),
  ('feature_labels', 'roadmap',     '育成就労制度への移行について',      'text', 'ja', 3, true),
  ('feature_labels', 'whitepaper',  'ホワイトペーパー',                'text', 'ja', 4, true),
  ('feature_labels', 'news',        '業界最新動向',                   'text', 'ja', 5, true),
  ('feature_labels', 'statistics',  '外国人関連統計',                  'text', 'ja', 6, true),
  ('feature_labels', 'subsidy',     '助成金活用',                     'text', 'ja', 7, true)
ON CONFLICT (page, block_key, lang)
DO UPDATE SET
  content = EXCLUDED.content,
  updated_at = now();

-- ========================================
-- 2. navigation_items のラベルを更新
--    href でマッチさせ、全セクション一括更新
-- ========================================
UPDATE navigation_items SET label = '初めての外国人雇用'          WHERE href = '/business/simulation';
UPDATE navigation_items SET label = '外国人雇用の無料適正診断'     WHERE href = '/business/diagnosis';
UPDATE navigation_items SET label = '育成就労制度への移行について'   WHERE href = '/business/ikusei';
UPDATE navigation_items SET label = '業界最新動向'                WHERE href = '/business/news';
UPDATE navigation_items SET label = 'ホワイトペーパー'             WHERE href = '/business/whitepapers';
UPDATE navigation_items SET label = '助成金活用'                  WHERE href = '/business/subsidies';
UPDATE navigation_items SET label = '外国人関連統計'               WHERE href = '/business/trends';

-- ========================================
-- 3. feature_cards のタイトルを更新
--    section='business' + sort_order でマッチ
-- ========================================
UPDATE feature_cards SET title = '初めての外国人雇用'           WHERE section = 'business' AND sort_order = 4;
UPDATE feature_cards SET title = '外国人雇用の無料適正診断'      WHERE section = 'business' AND sort_order = 1;
UPDATE feature_cards SET title = '業界最新動向'                 WHERE section = 'business' AND sort_order = 2;
UPDATE feature_cards SET title = '育成就労制度への移行について'    WHERE section = 'business' AND sort_order = 3;
UPDATE feature_cards SET title = 'ホワイトペーパー'              WHERE section = 'business' AND sort_order = 5;
UPDATE feature_cards SET title = '助成金活用'                   WHERE section = 'business' AND sort_order = 6;
UPDATE feature_cards SET title = '外国人関連統計'                WHERE section = 'business' AND sort_order = 7;

-- ========================================
-- 4. 各ページの hero_title を更新
-- ========================================
UPDATE content_blocks
SET content = 'ホワイトペーパー', updated_at = now()
WHERE page = 'business_whitepapers' AND block_key = 'hero_title' AND lang = 'ja';

UPDATE content_blocks
SET content = '助成金活用', updated_at = now()
WHERE page = 'business_subsidies' AND block_key = 'hero_title' AND lang = 'ja';

UPDATE content_blocks
SET content = '外国人関連統計', updated_at = now()
WHERE page = 'business_trends' AND block_key = 'hero_title' AND lang = 'ja';
