-- ========================================
-- お知らせ・通知テーブル
-- ========================================

CREATE TABLE notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  body TEXT NOT NULL,
  link_url TEXT,
  is_read BOOLEAN DEFAULT false,
  send_email BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- 本人宛 + 全員宛(user_id IS NULL) + 管理者は全件閲覧
CREATE POLICY "本人と全員向けを閲覧可" ON notifications
  FOR SELECT USING (user_id = auth.uid() OR user_id IS NULL OR is_admin());

-- 管理者のみ作成可
CREATE POLICY "管理者のみ作成可" ON notifications
  FOR INSERT WITH CHECK (is_admin());

-- 本人のみ既読更新可
CREATE POLICY "本人のみ既読更新可" ON notifications
  FOR UPDATE USING (user_id = auth.uid() OR user_id IS NULL);

-- 管理者は削除可
CREATE POLICY "管理者のみ削除可" ON notifications
  FOR DELETE USING (is_admin());

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);

-- ========================================
-- Admin sidebar にお知らせ管理を追加
-- ========================================
INSERT INTO navigation_items (section, label, href, icon, sort_order, is_active, requires_auth, required_role)
VALUES ('admin_sidebar', 'お知らせ', '/admin/notifications', 'Bell', 140, true, true, 'admin')
ON CONFLICT DO NOTHING;
