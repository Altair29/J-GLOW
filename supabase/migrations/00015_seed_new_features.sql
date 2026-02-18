-- ========================================
-- 追加3機能のシードデータ
-- (ホワイトペーパー・助成金ナビ・トレンドダッシュボード)
-- ========================================

-- ========================================
-- ナビゲーション追加
-- ========================================

-- 企業ヘッダーナビ (既存の5件に続く sort_order 6〜8)
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('business_header', 'ホワイトペーパー', '/business/whitepapers', 6),
  ('business_header', '助成金ナビ', '/business/subsidies', 7),
  ('business_header', 'トレンド', '/business/trends', 8);

-- フッター企業リンク追加
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('footer_business', 'ホワイトペーパー', '/business/whitepapers', 6),
  ('footer_business', '助成金ナビ', '/business/subsidies', 7),
  ('footer_business', 'トレンド', '/business/trends', 8);

-- 管理サイドバー追加 (既存6件に続く sort_order 7〜9)
INSERT INTO public.navigation_items (section, label, href, icon, sort_order, required_role) VALUES
  ('admin_sidebar', 'ホワイトペーパー管理', '/admin/whitepapers', 'BookOpen', 7, 'admin'),
  ('admin_sidebar', '助成金管理', '/admin/subsidies', 'Banknote', 8, 'admin'),
  ('admin_sidebar', 'トレンド管理', '/admin/trends', 'TrendingUp', 9, 'admin');

-- ========================================
-- 機能カード追加 (企業向け)
-- ========================================

INSERT INTO public.feature_cards (section, title, description, href, icon, color_bg, color_text, color_border, color_icon_bg, sort_order) VALUES
  ('business', '戦略的ホワイトペーパー', '重要分野別ガイドや批判的論評など、外国人雇用に関する専門的な知見を提供します。', '/business/whitepapers', 'BookOpen', '#fef3c7', '#92400e', '#fde68a', '#fef9c3', 5),
  ('business', '助成金活用ナビ', '地域・分野・在留資格を入力するだけで、活用可能な助成金を自動マッチング。申請要件も一覧できます。', '/business/subsidies', 'Banknote', '#d1fae5', '#065f46', '#6ee7b7', '#ecfdf5', 6),
  ('business', '最新トレンドダッシュボード', '外国人労働者数の推移、国籍別・業種別の統計をグラフとインサイト記事で可視化します。', '/business/trends', 'TrendingUp', '#fce7f3', '#9d174d', '#f9a8d4', '#fdf2f8', 7);

-- 管理向け機能カード追加
INSERT INTO public.feature_cards (section, title, description, href, icon, sort_order) VALUES
  ('admin', 'ホワイトペーパー管理', 'カテゴリ、記事、DLリードの管理', '/admin/whitepapers', 'BookOpen', 6),
  ('admin', '助成金管理', '助成金マスタ、適用条件、検索ログの管理', '/admin/subsidies', 'Banknote', 7),
  ('admin', 'トレンド管理', 'データソース、統計データ、ウィジェット、インサイト記事の管理', '/admin/trends', 'TrendingUp', 8);

-- ========================================
-- コンテンツブロック追加
-- ========================================

-- トップページの企業カード箇条書きを更新（7機能を反映）
-- ※ 既存レコードはUPDATEで上書き
UPDATE public.content_blocks
SET content = '適正運営診断（AI分析付き）
戦略的ホワイトペーパー
助成金活用ナビ
採用コストシミュレーション
業界ニュースの一括チェック
育成就労制度の最新情報
最新トレンドダッシュボード'
WHERE page = 'top' AND block_key = 'biz_card_bullets';

-- ホワイトペーパーページ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('business_whitepapers', 'hero_title', '戦略的ホワイトペーパー', 1),
  ('business_whitepapers', 'hero_subtitle', '外国人雇用の実務に役立つ専門コンテンツ', 2),
  ('business_whitepapers', 'section_featured', '注目のホワイトペーパー', 3),
  ('business_whitepapers', 'section_all', 'すべてのホワイトペーパー', 4),
  ('business_whitepapers', 'filter_category', 'カテゴリで絞り込む', 5),
  ('business_whitepapers', 'filter_industry', '業界で絞り込む', 6),
  ('business_whitepapers', 'download_cta', 'ダウンロード', 7),
  ('business_whitepapers', 'read_more', '詳しく読む', 8),
  ('business_whitepapers', 'empty_state', '該当するホワイトペーパーが見つかりませんでした。', 9),
  ('business_whitepapers', 'auth_required', 'この資料の閲覧にはログインが必要です。', 10);

-- 助成金ナビページ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('business_subsidies', 'hero_title', '助成金活用ナビ', 1),
  ('business_subsidies', 'hero_subtitle', '条件を入力するだけで、活用可能な助成金を自動マッチング', 2),
  ('business_subsidies', 'search_heading', '条件を選択してください', 3),
  ('business_subsidies', 'label_region', '地域', 4),
  ('business_subsidies', 'label_field', '分野・業種', 5),
  ('business_subsidies', 'label_visa_type', '在留資格', 6),
  ('business_subsidies', 'label_company_size', '企業規模', 7),
  ('business_subsidies', 'search_button', '検索する', 8),
  ('business_subsidies', 'results_heading', '検索結果', 9),
  ('business_subsidies', 'results_count', '件の助成金が見つかりました', 10),
  ('business_subsidies', 'detail_link', '詳細を見る', 11),
  ('business_subsidies', 'apply_link', '申請ページへ', 12),
  ('business_subsidies', 'empty_state', '条件に合う助成金が見つかりませんでした。条件を変更してお試しください。', 13),
  ('business_subsidies', 'featured_heading', '注目の助成金', 14);

-- トレンドダッシュボードページ
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('business_trends', 'hero_title', '最新トレンドダッシュボード', 1),
  ('business_trends', 'hero_subtitle', '外国人労働者の受入れに関する最新の統計と分析', 2),
  ('business_trends', 'section_stats', '主要統計', 3),
  ('business_trends', 'section_charts', 'グラフ・チャート', 4),
  ('business_trends', 'section_insights', 'インサイト・解説', 5),
  ('business_trends', 'data_source_label', 'データソース', 6),
  ('business_trends', 'last_updated_label', '最終更新', 7),
  ('business_trends', 'read_insight', '解説を読む', 8),
  ('business_trends', 'empty_state', 'データがまだ登録されていません。', 9);

-- メタデータ追加
INSERT INTO public.content_blocks (page, block_key, content, sort_order) VALUES
  ('meta', 'whitepapers_title', 'J-GLOW | 戦略的ホワイトペーパー', 8),
  ('meta', 'whitepapers_description', '外国人雇用に関する専門的な知見を提供するホワイトペーパー', 9),
  ('meta', 'subsidies_title', 'J-GLOW | 助成金活用ナビ', 10),
  ('meta', 'subsidies_description', '外国人材の受入れに活用できる助成金の検索・マッチング', 11),
  ('meta', 'trends_title', 'J-GLOW | 最新トレンドダッシュボード', 12),
  ('meta', 'trends_description', '外国人労働者の受入れに関する最新統計とインサイト', 13);
