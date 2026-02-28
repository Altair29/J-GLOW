-- ========================================
-- ビジネスナビゲーション整理
-- 1. ホワイトペーパーを business_header から非表示
-- 2. 「外国人スタッフをもっと活かすために」を追加
-- ========================================

-- ホワイトペーパーを非表示にする（削除ではなく is_active=false）
UPDATE public.navigation_items
SET is_active = false, updated_at = now()
WHERE section = 'business_header' AND href = '/business/whitepapers';

-- 「外国人スタッフをもっと活かすために」を主要機能に追加
INSERT INTO public.navigation_items (section, label, href, icon, sort_order, is_active)
VALUES ('business_header', '外国人スタッフをもっと活かすために', '/business/existing-users', 'UserCheck', 5, true)
ON CONFLICT DO NOTHING;
