-- =============================================================
-- insert-article-svgs.sql  (v2 — prepend方式)
-- 各記事のbody先頭にSVG図解を挿入する
-- ※ 既に挿入済みの場合はスキップ（冪等）
-- =============================================================

-- ★ まず診断：対象slugが存在するか確認
SELECT slug, status, LENGTH(body) AS body_len,
       CASE WHEN body LIKE '%/images/articles/%' THEN 'SVG済' ELSE '未挿入' END AS svg
FROM blog_posts
WHERE slug IN (
  'ojt-design-first-3months',
  'arrival-checklist',
  'tokutei-roadmap-3years',
  'exam-support',
  'exam-support-1go',
  'documents-checklist'
)
ORDER BY slug;

-- ① OJT設計
UPDATE blog_posts
SET body = E'![OJT 3ステップ図](/images/articles/article_ojt_steps.svg)\n\n' || body,
    updated_at = NOW()
WHERE slug = 'ojt-design-first-3months'
  AND body NOT LIKE '%article_ojt_steps.svg%';

-- ② 受入れ準備チェックリスト
UPDATE blog_posts
SET body = E'![受入れ準備タイムライン](/images/articles/article_arrival_timeline.svg)\n\n' || body,
    updated_at = NOW()
WHERE slug = 'arrival-checklist'
  AND body NOT LIKE '%article_arrival_timeline.svg%';

-- ③ 3年間ロードマップ
UPDATE blog_posts
SET body = E'![3年間ロードマップ](/images/articles/article_roadmap_3years.svg)\n\n' || body,
    updated_at = NOW()
WHERE slug = 'tokutei-roadmap-3years'
  AND body NOT LIKE '%article_roadmap_3years.svg%';

-- ④ 特定技能2号試験サポート
UPDATE blog_posts
SET body = E'![特定技能2号試験 分野別概要](/images/articles/article_tokutei2_exam.svg)\n\n' || body,
    updated_at = NOW()
WHERE slug = 'exam-support'
  AND body NOT LIKE '%article_tokutei2_exam.svg%';

-- ⑤ 特定技能1号試験サポート
UPDATE blog_posts
SET body = E'![JFT-Basic vs JLPT 比較](/images/articles/article_tokutei1_exam.svg)\n\n' || body,
    updated_at = NOW()
WHERE slug = 'exam-support-1go'
  AND body NOT LIKE '%article_tokutei1_exam.svg%';

-- ⑥ 在留資格変更申請書類
UPDATE blog_posts
SET body = E'![在留資格変更申請フロー](/images/articles/article_status_change_flow.svg)\n\n' || body,
    updated_at = NOW()
WHERE slug = 'documents-checklist'
  AND body NOT LIKE '%article_status_change_flow.svg%';

-- ★ 最終確認
SELECT slug,
       CASE WHEN body LIKE '%/images/articles/%' THEN '✅ SVG挿入済み' ELSE '❌ 未挿入' END AS svg_status
FROM blog_posts
WHERE slug IN (
  'ojt-design-first-3months',
  'arrival-checklist',
  'tokutei-roadmap-3years',
  'exam-support',
  'exam-support-1go',
  'documents-checklist'
)
ORDER BY slug;
