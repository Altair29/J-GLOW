-- ========================================
-- RLS 無限再帰修正
--
-- 問題: profiles_admin_all ポリシーが profiles テーブルを
-- 自己参照し、他テーブルの admin ポリシーも profiles を
-- 参照するため、全 SELECT が無限再帰でエラーになる。
--
-- 解決: SECURITY DEFINER 関数 is_admin() を作成し、
-- 全 admin ポリシーをこの関数に置き換える。
-- SECURITY DEFINER は関数オーナー権限で実行されるため
-- RLS をバイパスし、再帰を回避する。
-- ========================================

-- 1. SECURITY DEFINER 関数
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- 2. profiles テーブル自身のポリシー修正
DROP POLICY IF EXISTS "profiles_admin_all" ON public.profiles;
CREATE POLICY "profiles_admin_all" ON public.profiles
  FOR ALL USING (public.is_admin());

-- 3. allowed_email_domains
DROP POLICY IF EXISTS "allowed_domains_admin" ON public.allowed_email_domains;
CREATE POLICY "allowed_domains_admin" ON public.allowed_email_domains
  FOR ALL USING (public.is_admin());

-- 4. blocked_email_domains
DROP POLICY IF EXISTS "blocked_domains_admin" ON public.blocked_email_domains;
CREATE POLICY "blocked_domains_admin" ON public.blocked_email_domains
  FOR ALL USING (public.is_admin());

-- 5. diagnosis
DROP POLICY IF EXISTS "diagnosis_categories_admin" ON public.diagnosis_categories;
CREATE POLICY "diagnosis_categories_admin" ON public.diagnosis_categories
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "diagnosis_questions_admin" ON public.diagnosis_questions;
CREATE POLICY "diagnosis_questions_admin" ON public.diagnosis_questions
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "diagnosis_sessions_admin" ON public.diagnosis_sessions;
CREATE POLICY "diagnosis_sessions_admin" ON public.diagnosis_sessions
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "diagnosis_reports_admin" ON public.diagnosis_reports;
CREATE POLICY "diagnosis_reports_admin" ON public.diagnosis_reports
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "diagnosis_ai_config_admin" ON public.diagnosis_ai_config;
CREATE POLICY "diagnosis_ai_config_admin" ON public.diagnosis_ai_config
  FOR ALL USING (public.is_admin());

-- 6. news
DROP POLICY IF EXISTS "news_sources_admin" ON public.news_sources;
CREATE POLICY "news_sources_admin" ON public.news_sources
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "news_articles_admin" ON public.news_articles;
CREATE POLICY "news_articles_admin" ON public.news_articles
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "editorial_admin" ON public.editorial_articles;
CREATE POLICY "editorial_admin" ON public.editorial_articles
  FOR ALL USING (public.is_admin());

-- 7. simulation
DROP POLICY IF EXISTS "sim_params_admin" ON public.simulation_params;
CREATE POLICY "sim_params_admin" ON public.simulation_params
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "sim_logs_admin" ON public.simulation_logs;
CREATE POLICY "sim_logs_admin" ON public.simulation_logs
  FOR ALL USING (public.is_admin());

-- 8. worker content
DROP POLICY IF EXISTS "worker_topics_admin" ON public.worker_topics;
CREATE POLICY "worker_topics_admin" ON public.worker_topics
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "worker_topic_contents_admin" ON public.worker_topic_contents;
CREATE POLICY "worker_topic_contents_admin" ON public.worker_topic_contents
  FOR ALL USING (public.is_admin());

-- 9. translations
DROP POLICY IF EXISTS "translation_cache_admin" ON public.translation_cache;
CREATE POLICY "translation_cache_admin" ON public.translation_cache
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "ui_translations_admin" ON public.ui_translations;
CREATE POLICY "ui_translations_admin" ON public.ui_translations
  FOR ALL USING (public.is_admin());

-- 10. ikusei
DROP POLICY IF EXISTS "ikusei_timeline_admin" ON public.ikusei_timeline;
CREATE POLICY "ikusei_timeline_admin" ON public.ikusei_timeline
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "ikusei_flowcharts_admin" ON public.ikusei_flowcharts;
CREATE POLICY "ikusei_flowcharts_admin" ON public.ikusei_flowcharts
  FOR ALL USING (public.is_admin());

-- 11. navigation
DROP POLICY IF EXISTS "nav_admin_write" ON public.navigation_items;
CREATE POLICY "nav_admin_write" ON public.navigation_items
  FOR ALL USING (public.is_admin());

-- 12. theme_config
DROP POLICY IF EXISTS "theme_admin_write" ON public.theme_config;
CREATE POLICY "theme_admin_write" ON public.theme_config
  FOR ALL USING (public.is_admin());

-- 13. content_blocks & feature_cards
DROP POLICY IF EXISTS "content_blocks_admin" ON public.content_blocks;
CREATE POLICY "content_blocks_admin" ON public.content_blocks
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "feature_cards_admin" ON public.feature_cards;
CREATE POLICY "feature_cards_admin" ON public.feature_cards
  FOR ALL USING (public.is_admin());

-- 14. whitepapers
DROP POLICY IF EXISTS "wp_cat_admin" ON public.whitepaper_categories;
CREATE POLICY "wp_cat_admin" ON public.whitepaper_categories
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "wp_admin" ON public.whitepapers;
CREATE POLICY "wp_admin" ON public.whitepapers
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "wp_dl_admin" ON public.whitepaper_downloads;
CREATE POLICY "wp_dl_admin" ON public.whitepaper_downloads
  FOR ALL USING (public.is_admin());

-- 15. subsidies
DROP POLICY IF EXISTS "subsidies_admin" ON public.subsidies;
CREATE POLICY "subsidies_admin" ON public.subsidies
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "subsidy_cond_admin" ON public.subsidy_conditions;
CREATE POLICY "subsidy_cond_admin" ON public.subsidy_conditions
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "subsidy_logs_admin" ON public.subsidy_search_logs;
CREATE POLICY "subsidy_logs_admin" ON public.subsidy_search_logs
  FOR ALL USING (public.is_admin());

-- 16. trends
DROP POLICY IF EXISTS "trend_src_admin" ON public.trend_sources;
CREATE POLICY "trend_src_admin" ON public.trend_sources
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "trend_data_admin" ON public.trend_data;
CREATE POLICY "trend_data_admin" ON public.trend_data
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "trend_wid_admin" ON public.trend_widgets;
CREATE POLICY "trend_wid_admin" ON public.trend_widgets
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "trend_ins_admin" ON public.trend_insights;
CREATE POLICY "trend_ins_admin" ON public.trend_insights
  FOR ALL USING (public.is_admin());

-- 17. blog
DROP POLICY IF EXISTS "blog_cat_admin" ON public.blog_categories;
CREATE POLICY "blog_cat_admin" ON public.blog_categories
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "blog_tags_admin" ON public.blog_tags;
CREATE POLICY "blog_tags_admin" ON public.blog_tags
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "blog_pt_admin" ON public.blog_post_tags;
CREATE POLICY "blog_pt_admin" ON public.blog_post_tags
  FOR ALL USING (public.is_admin());

DROP POLICY IF EXISTS "blog_posts_admin" ON public.blog_posts;
CREATE POLICY "blog_posts_admin" ON public.blog_posts
  FOR ALL USING (public.is_admin());
