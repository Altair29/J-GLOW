-- 00036_partners_extended.sql
-- partnersテーブルの拡張: 5種別 × 3ティア対応

-- ティア管理
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'regular' CHECK (plan_tier IN ('platinum', 'gold', 'regular')),
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 999;

-- 種別（新5種別）
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS partner_type TEXT CHECK (partner_type IN ('kanri', 'support', 'gyosei', 'bengoshi', 'sharoshi'));

-- エリア（配列化）
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS regions TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prefectures TEXT[] DEFAULT '{}';

-- 強み
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS specialty_visas TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specialty_industries TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specialty_countries TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specialty_tags TEXT[] DEFAULT '{}';

-- 表示用データ
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS catch_copy TEXT,
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS founded_year INT,
  ADD COLUMN IF NOT EXISTS permit_type TEXT,
  ADD COLUMN IF NOT EXISTS permit_no TEXT,
  ADD COLUMN IF NOT EXISTS employee_count TEXT;

-- 種別固有データ（JSONB）
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS type_specific JSONB DEFAULT '{}';

-- スペック表示（カードの数値ボックス用）
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS specialties JSONB DEFAULT '{}';

-- 問い合わせ計測
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS monthly_inquiry_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_inquiry_count INT DEFAULT 0;

-- 評価
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0;

-- ステータス
ALTER TABLE partners
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended'));

-- インデックス
CREATE INDEX IF NOT EXISTS idx_partners_tier ON partners(plan_tier, display_order);
CREATE INDEX IF NOT EXISTS idx_partners_partner_type ON partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_regions ON partners USING GIN(regions);
CREATE INDEX IF NOT EXISTS idx_partners_visas ON partners USING GIN(specialty_visas);
CREATE INDEX IF NOT EXISTS idx_partners_industries ON partners USING GIN(specialty_industries);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);

-- 既存シードデータを新スキーマに合わせて更新
UPDATE partners SET
  plan_tier = CASE WHEN plan = 'sponsor' THEN 'gold' ELSE 'regular' END,
  partner_type = CASE
    WHEN type = 'supervisory' THEN 'kanri'
    WHEN type = 'support_org' THEN 'support'
    WHEN type = 'admin_scrivener' THEN 'gyosei'
    ELSE 'kanri'
  END,
  status = CASE WHEN is_active = true THEN 'active' ELSE 'pending' END,
  regions = CASE
    WHEN prefecture ILIKE '%愛知%' OR prefecture ILIKE '%名古屋%' THEN ARRAY['東海']
    WHEN prefecture ILIKE '%大阪%' THEN ARRAY['関西']
    WHEN prefecture ILIKE '%東京%' THEN ARRAY['関東']
    ELSE ARRAY['全国']
  END,
  prefectures = CASE WHEN prefecture IS NOT NULL THEN ARRAY[prefecture] ELSE '{}' END,
  specialty_visas = visas,
  specialty_industries = industries,
  specialty_countries = origin_countries,
  display_order = sort_order
WHERE plan_tier IS NULL OR partner_type IS NULL;
