-- rehype-raw テスト用記事
INSERT INTO blog_posts (slug, title, body, status, created_at, updated_at)
VALUES (
  'html-test',
  'HTMLテスト',
  '<div style="background:red;padding:20px;color:white;font-size:24px;">rehype-rawテスト成功</div>',
  'published',
  NOW(),
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  body = EXCLUDED.body,
  status = EXCLUDED.status,
  updated_at = NOW();
