-- ========================================
-- ブログシステムのシードデータ
-- (ナビゲーション・機能カード・コンテンツブロック)
-- ========================================

-- ========================================
-- ナビゲーション追加
-- ========================================

-- 企業ヘッダーナビ
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('business_header', 'ブログ', '/business/blog', 9);

-- フッター企業リンク
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('footer_business', 'ブログ', '/business/blog', 9);

-- 管理サイドバー
INSERT INTO public.navigation_items (section, label, href, icon, sort_order, required_role) VALUES
  ('admin_sidebar', 'ブログ管理', '/admin/blog', 'PenSquare', 10, 'admin');

-- ========================================
-- 機能カード追加
-- ========================================

INSERT INTO public.feature_cards (section, title, description, href, icon, color_bg, color_text, color_border, color_icon_bg, sort_order) VALUES
  ('business', 'ブログ', '外国人材業界の最新情報、コンプライアンス解説、事例紹介などを発信しています。', '/business/blog', 'PenSquare', '#f0fdf4', '#166534', '#86efac', '#dcfce7', 8);

INSERT INTO public.feature_cards (section, title, description, href, icon, sort_order) VALUES
  ('admin', 'ブログ管理', '記事の作成・編集・公開管理、カテゴリ・タグの管理', '/admin/blog', 'PenSquare', 9);

-- ========================================
-- コンテンツブロック追加
-- ========================================

-- ブログ一覧ページ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('business_blog', 'hero_title', 'ブログ', 1),
  ('business_blog', 'hero_subtitle', '外国人材業界の最新情報と専門知識をお届けします', 2),
  ('business_blog', 'filter_all', 'すべて', 3),
  ('business_blog', 'filter_category', 'カテゴリ', 4),
  ('business_blog', 'filter_tag', 'タグ', 5),
  ('business_blog', 'pinned_label', '注目', 6),
  ('business_blog', 'read_more', '続きを読む', 7),
  ('business_blog', 'empty_state', '記事が見つかりませんでした。', 8),
  ('business_blog', 'published_at_label', '公開日', 9),
  ('business_blog', 'author_label', '著者', 10);

-- ブログ記事詳細ページ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('business_blog_detail', 'back_link', '← ブログ一覧に戻る', 1),
  ('business_blog_detail', 'share_label', 'この記事をシェア', 2),
  ('business_blog_detail', 'related_heading', '関連記事', 3),
  ('business_blog_detail', 'category_label', 'カテゴリ', 4),
  ('business_blog_detail', 'tags_label', 'タグ', 5);

-- 管理画面ブログ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('admin_blog', 'page_title', 'ブログ管理', 1),
  ('admin_blog', 'new_post', '新規記事作成', 2),
  ('admin_blog', 'tab_all', 'すべて', 3),
  ('admin_blog', 'tab_draft', '下書き', 4),
  ('admin_blog', 'tab_published', '公開済み', 5),
  ('admin_blog', 'tab_archived', 'アーカイブ', 6),
  ('admin_blog', 'col_title', 'タイトル', 7),
  ('admin_blog', 'col_author', '著者', 8),
  ('admin_blog', 'col_status', 'ステータス', 9),
  ('admin_blog', 'col_published_at', '公開日', 10),
  ('admin_blog', 'col_actions', '操作', 11),
  ('admin_blog', 'btn_edit', '編集', 12),
  ('admin_blog', 'btn_delete', '削除', 13),
  ('admin_blog', 'btn_pin', 'ピン固定', 14),
  ('admin_blog', 'btn_unpin', 'ピン解除', 15),
  ('admin_blog', 'confirm_delete', 'この記事を削除してもよろしいですか？', 16);

-- ブログエディタ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('admin_blog_editor', 'title_label', 'タイトル', 1),
  ('admin_blog_editor', 'slug_label', 'スラッグ (URL)', 2),
  ('admin_blog_editor', 'category_label', 'カテゴリ', 3),
  ('admin_blog_editor', 'tags_label', 'タグ', 4),
  ('admin_blog_editor', 'excerpt_label', '抜粋', 5),
  ('admin_blog_editor', 'body_label', '本文 (Markdown)', 6),
  ('admin_blog_editor', 'preview_tab', 'プレビュー', 7),
  ('admin_blog_editor', 'edit_tab', '編集', 8),
  ('admin_blog_editor', 'cover_label', 'カバー画像', 9),
  ('admin_blog_editor', 'cover_generate', 'AIで自動生成', 10),
  ('admin_blog_editor', 'cover_generating', '画像を生成中...', 11),
  ('admin_blog_editor', 'status_label', 'ステータス', 12),
  ('admin_blog_editor', 'published_at_label', '公開日時', 13),
  ('admin_blog_editor', 'save_draft', '下書き保存', 14),
  ('admin_blog_editor', 'publish', '公開する', 15),
  ('admin_blog_editor', 'update', '更新する', 16),
  ('admin_blog_editor', 'saving', '保存中...', 17);

-- メタデータ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('meta', 'blog_title', 'J-GLOW | ブログ', 14),
  ('meta', 'blog_description', '外国人材業界の最新情報、コンプライアンス解説、事例紹介などを発信', 15);
