-- ========================================
-- ナビゲーション管理
-- ========================================

CREATE TABLE public.navigation_items (
  id          SERIAL PRIMARY KEY,
  section     TEXT NOT NULL CHECK (section IN ('business_header', 'worker_header', 'admin_sidebar', 'footer_business', 'footer_worker')),
  label       TEXT NOT NULL,
  href        TEXT NOT NULL,
  icon        TEXT,                   -- lucide-react のアイコン名
  sort_order  INT DEFAULT 0,
  is_active   BOOLEAN DEFAULT true,
  requires_auth BOOLEAN DEFAULT false,
  required_role TEXT CHECK (required_role IS NULL OR required_role IN ('admin', 'business', 'worker')),
  created_at  TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "nav_select_all" ON public.navigation_items
  FOR SELECT USING (true);
CREATE POLICY "nav_admin_write" ON public.navigation_items
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- 企業ヘッダーナビ
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('business_header', 'ホーム', '/business', 1),
  ('business_header', '適正運営診断', '/business/diagnosis', 2),
  ('business_header', 'ニュース', '/business/news', 3),
  ('business_header', '育成就労', '/business/ikusei', 4),
  ('business_header', '採用シミュレーション', '/business/simulation', 5);

-- 労働者ヘッダーナビ
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('worker_header', 'ホーム / Home', '/worker', 1),
  ('worker_header', 'サポート / Support', '/worker/topics', 2);

-- フッター企業リンク
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('footer_business', '企業向けトップ', '/business', 1),
  ('footer_business', '適正運営診断', '/business/diagnosis', 2),
  ('footer_business', 'ニュース', '/business/news', 3),
  ('footer_business', '育成就労', '/business/ikusei', 4),
  ('footer_business', '採用シミュレーション', '/business/simulation', 5);

-- フッター労働者リンク
INSERT INTO public.navigation_items (section, label, href, sort_order) VALUES
  ('footer_worker', 'サポートトップ', '/worker', 1),
  ('footer_worker', '生活課題サポート', '/worker/topics', 2);

-- 管理サイドバー
INSERT INTO public.navigation_items (section, label, href, icon, sort_order, required_role) VALUES
  ('admin_sidebar', 'ダッシュボード', '/admin', 'LayoutDashboard', 1, 'admin'),
  ('admin_sidebar', 'サイト設定', '/admin/settings', 'Settings', 2, 'admin'),
  ('admin_sidebar', '診断管理', '/admin/diagnosis', 'ClipboardCheck', 3, 'admin'),
  ('admin_sidebar', 'ニュース管理', '/admin/news', 'Newspaper', 4, 'admin'),
  ('admin_sidebar', 'シミュレーション管理', '/admin/simulation', 'Calculator', 5, 'admin'),
  ('admin_sidebar', '翻訳管理', '/admin/translations', 'Globe', 6, 'admin');
