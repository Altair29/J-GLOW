-- ========================================
-- 労働条件通知書ツールをナビゲーションに追加
-- ========================================

INSERT INTO public.navigation_items (section, label, href, icon, sort_order, is_active)
VALUES ('business_header', '労働条件通知書', '/business/tools/labor-notice', 'FileText', 6, true)
ON CONFLICT DO NOTHING;
