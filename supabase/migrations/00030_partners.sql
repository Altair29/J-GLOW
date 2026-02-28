-- ========================================
-- パートナーディレクトリ
-- ========================================

CREATE TABLE partners (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('supervisory', 'admin_scrivener', 'support_org')),
  plan TEXT NOT NULL DEFAULT 'member' CHECK (plan IN ('sponsor', 'member')),
  prefecture TEXT,
  industries TEXT[],
  visas TEXT[],
  languages TEXT[],
  origin_countries TEXT[],
  description TEXT,
  contact_email TEXT,
  website_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 999,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "誰でも閲覧可" ON partners
  FOR SELECT USING (is_active = true);

CREATE POLICY "管理者のみ編集可" ON partners
  FOR ALL USING (is_admin());

CREATE INDEX idx_partners_plan ON partners(plan);
CREATE INDEX idx_partners_prefecture ON partners(prefecture);

-- ========================================
-- テスト用ダミーデータ
-- ========================================

INSERT INTO partners (name, type, plan, prefecture, industries, visas, languages, description, sort_order)
VALUES
('協同組合 東海外国人支援センター', 'supervisory', 'sponsor', '愛知県',
 ARRAY['製造業','建設業','食品加工'], ARRAY['育成就労','技能実習'],
 ARRAY['ベトナム語','インドネシア語'],
 '愛知県内の製造業を中心に15年の実績。育成就労制度への移行支援に特化。', 10),
('行政書士法人 グローバルビザ事務所', 'admin_scrivener', 'sponsor', '大阪府',
 ARRAY['介護','製造業'], ARRAY['特定技能1号','技術・人文知識・国際業務'],
 ARRAY['英語','中国語','ベトナム語'],
 '特定技能ビザ申請の専門事務所。年間200件以上の申請実績。', 20),
('NPO法人 関西外国人労働支援機構', 'support_org', 'member', '大阪府',
 ARRAY['介護','飲食業'], ARRAY['特定技能1号'],
 ARRAY['ベトナム語','ミャンマー語'],
 '特定技能外国人の生活支援・日本語学習支援に強み。', 100);

-- ========================================
-- ナビゲーション追加
-- ========================================

-- Business header
INSERT INTO navigation_items (section, label, href, icon, sort_order, is_active, requires_auth, required_role)
VALUES ('business_header', 'パートナー検索', '/business/partners', 'Users', 60, true, false, NULL)
ON CONFLICT DO NOTHING;

-- Admin sidebar
INSERT INTO navigation_items (section, label, href, icon, sort_order, is_active, requires_auth, required_role)
VALUES ('admin_sidebar', 'パートナー', '/admin/partners', 'Users', 130, true, true, 'admin')
ON CONFLICT DO NOTHING;
