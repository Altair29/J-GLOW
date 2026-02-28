-- ========================================
-- プライバシーポリシー同意カラム追加
-- ========================================

ALTER TABLE profiles
  ADD COLUMN IF NOT EXISTS privacy_agreed_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS privacy_policy_version TEXT;
