-- ========================================
-- business_profiles に business_type カラム追加
-- ========================================

ALTER TABLE business_profiles
  ADD COLUMN IF NOT EXISTS business_type TEXT
    CHECK (business_type IN (
      'supervisory', 'support', 'accepting_existing', 'accepting_new'
    ));

-- industry カラムも追加（オンボーディングで使用）
ALTER TABLE business_profiles
  ADD COLUMN IF NOT EXISTS industry TEXT;
