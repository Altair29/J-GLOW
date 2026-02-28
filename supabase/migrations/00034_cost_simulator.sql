-- ========================================
-- 採用計画コストシミュレーター
-- ========================================

-- コスト項目マスタ
CREATE TABLE simulator_cost_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category TEXT NOT NULL CHECK (category IN ('initial', 'monthly', 'risk')),
  visa_type TEXT NOT NULL CHECK (visa_type IN ('ikusei', 'tokutei_kaigai', 'tokutei_kokunai', 'all')),
  item_key TEXT NOT NULL,
  label TEXT NOT NULL,
  amount_min INTEGER NOT NULL DEFAULT 0,
  amount_max INTEGER NOT NULL DEFAULT 0,
  variable_factor TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Persona A プリセット保存
CREATE TABLE simulator_org_presets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  preset_name TEXT NOT NULL,
  org_name TEXT,
  org_contact TEXT,
  management_fee INTEGER,
  enrollment_fee INTEGER,
  logo_url TEXT,
  brand_color TEXT DEFAULT '#1a2f5e',
  custom_items JSONB NOT NULL DEFAULT '[]',
  removed_item_keys TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 試算結果セッション
CREATE TABLE simulator_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  preset_id UUID REFERENCES simulator_org_presets(id) ON DELETE SET NULL,
  input_params JSONB NOT NULL,
  result_snapshot JSONB NOT NULL,
  share_token TEXT UNIQUE,
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ========================================
-- RLS
-- ========================================

ALTER TABLE simulator_cost_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can read cost items" ON simulator_cost_items FOR SELECT USING (true);
CREATE POLICY "Admin can manage cost items" ON simulator_cost_items FOR ALL USING (is_admin());

ALTER TABLE simulator_org_presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can manage presets" ON simulator_org_presets FOR ALL USING (auth.uid() = user_id);

ALTER TABLE simulator_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner can manage sessions" ON simulator_sessions FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can read shared sessions" ON simulator_sessions FOR SELECT USING (share_token IS NOT NULL);

-- ========================================
-- インデックス
-- ========================================

CREATE INDEX idx_simulator_cost_items_category ON simulator_cost_items(category);
CREATE INDEX idx_simulator_cost_items_visa ON simulator_cost_items(visa_type);
CREATE INDEX idx_simulator_org_presets_user ON simulator_org_presets(user_id);
CREATE INDEX idx_simulator_sessions_token ON simulator_sessions(share_token);
CREATE INDEX idx_simulator_sessions_user ON simulator_sessions(user_id);

-- ========================================
-- ナビゲーション追加
-- ========================================

INSERT INTO navigation_items (section, label, href, icon, sort_order, is_active, requires_auth, required_role)
VALUES
  ('business_header', '採用計画コストシミュレーター', '/business/cost-simulator', 'Calculator', 15, true, true, 'business'),
  ('admin_sidebar', 'シミュレーター', '/admin/simulator', 'Calculator', 85, true, true, 'admin')
ON CONFLICT DO NOTHING;

-- ========================================
-- シードデータ: コスト項目マスタ
-- ========================================

-- 初期費用
INSERT INTO simulator_cost_items (category, visa_type, item_key, label, amount_min, amount_max, variable_factor, sort_order) VALUES
  ('initial', 'ikusei',          'sending_org_fee_ikusei',    '送出機関手数料',          150000, 250000, '送出国',          10),
  ('initial', 'tokutei_kaigai',  'sending_org_fee_kaigai',    '送出機関手数料',          0,      150000, '送出国',          10),
  ('initial', 'ikusei',          'travel_fee_ikusei',         '渡航費（現地→日本）',     30000,  50000,  '国・航路',        20),
  ('initial', 'tokutei_kaigai',  'travel_fee_kaigai',         '渡航費（現地→日本）',     30000,  50000,  '国・航路',        20),
  ('initial', 'ikusei',          'visa_app_ikusei',           '在留資格申請費用',         30000,  50000,  '申請種別',        30),
  ('initial', 'tokutei_kaigai',  'visa_app_kaigai',           '在留資格申請費用',         20000,  40000,  '申請種別',        30),
  ('initial', 'tokutei_kokunai', 'visa_app_kokunai',          '在留資格申請費用',         10000,  20000,  '申請種別',        30),
  ('initial', 'ikusei',          'health_check_ikusei',       '健康診断',                10000,  20000,  '医療機関',        40),
  ('initial', 'tokutei_kaigai',  'health_check_kaigai',       '健康診断',                10000,  20000,  '医療機関',        40),
  ('initial', 'tokutei_kokunai', 'health_check_kokunai',      '健康診断',                10000,  20000,  '医療機関',        40),
  ('initial', 'ikusei',          'jp_training_pre_ikusei',    '入国前日本語研修',         50000,  100000, '外注/内製',       50),
  ('initial', 'tokutei_kaigai',  'jp_training_pre_kaigai',    '入国前日本語研修',         0,      50000,  '外注/内製',       50),
  ('initial', 'ikusei',          'ojt_ikusei',                '入国後研修・OJT',         30000,  80000,  '職種',            60),
  ('initial', 'tokutei_kaigai',  'ojt_kaigai',                '入国後研修・OJT',         20000,  50000,  '職種',            60),
  ('initial', 'tokutei_kokunai', 'ojt_kokunai',               '入国後研修・OJT',         10000,  20000,  '就労経験あり',     60),
  ('initial', 'ikusei',          'housing_initial_ikusei',    '寮初期費用（敷金・備品等）', 100000, 300000, '提供有無',        70),
  ('initial', 'tokutei_kaigai',  'housing_initial_kaigai',    '寮初期費用（敷金・備品等）', 100000, 300000, '提供有無',        70),
  ('initial', 'tokutei_kokunai', 'housing_initial_kokunai',   '寮初期費用（敷金・備品等）', 0,      100000, '提供有無',        70),
  ('initial', 'all',             'enrollment_fee',            '入会金・加入費',           0,      0,      '団体設定（入力値）', 80)
ON CONFLICT DO NOTHING;

-- 月次費用
INSERT INTO simulator_cost_items (category, visa_type, item_key, label, amount_min, amount_max, variable_factor, sort_order) VALUES
  ('monthly', 'all',             'management_fee',            '監理費/支援費',           0,      0,      '団体設定（入力値）', 10),
  ('monthly', 'all',             'social_insurance',          '社会保険料（企業負担分）',  0,      0,      '給与×約15%（別途計算）', 20),
  ('monthly', 'ikusei',          'housing_monthly_ikusei',    '住居補助',                20000,  50000,  '提供形態',        30),
  ('monthly', 'tokutei_kaigai',  'housing_monthly_kaigai',    '住居補助',                20000,  50000,  '提供形態',        30),
  ('monthly', 'tokutei_kokunai', 'housing_monthly_kokunai',   '住居補助',                0,      30000,  '提供形態',        30),
  ('monthly', 'ikusei',          'support_outsource_ikusei',  '生活支援・通訳費',         10000,  30000,  '委託有無',        40),
  ('monthly', 'tokutei_kaigai',  'support_outsource_kaigai',  '生活支援・通訳費',         0,      0,      '外注時のみ',      40),
  ('monthly', 'tokutei_kokunai', 'support_outsource_kokunai', '生活支援・通訳費',         0,      0,      '外注時のみ',      40)
ON CONFLICT DO NOTHING;

-- リスクコスト
INSERT INTO simulator_cost_items (category, visa_type, item_key, label, amount_min, amount_max, variable_factor, sort_order) VALUES
  ('risk', 'all', 'vacancy_cost', '欠員コスト（離職時）',     0, 0, '平均賃金×欠員期間で試算', 10),
  ('risk', 'all', 'rehire_cost',  '採用やり直しコスト',       0, 0, '初期費用の50%想定',       20)
ON CONFLICT DO NOTHING;
