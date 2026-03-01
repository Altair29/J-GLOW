-- ========================================
-- Migration 00037: シミュレーター v2 拡張
-- ========================================

-- 1. simulator_cost_items の visa_type CHECK制約を拡張
ALTER TABLE simulator_cost_items DROP CONSTRAINT IF EXISTS simulator_cost_items_visa_type_check;
ALTER TABLE simulator_cost_items ADD CONSTRAINT simulator_cost_items_visa_type_check
  CHECK (visa_type IN ('ikusei', 'tokutei_kaigai', 'tokutei_kokunai', 'tokutei1_kaigai', 'tokutei1_kokunai', 'tokutei2', 'ginou', 'student', 'all'));

-- 2. 既存データのビザ種別リネーム（tokutei_* → tokutei1_*）
UPDATE simulator_cost_items SET visa_type = 'tokutei1_kaigai' WHERE visa_type = 'tokutei_kaigai';
UPDATE simulator_cost_items SET visa_type = 'tokutei1_kokunai' WHERE visa_type = 'tokutei_kokunai';

-- 3. 新ビザ用コスト項目INSERT

-- 技術・人文知識・国際業務（ginou）
INSERT INTO simulator_cost_items (category, visa_type, item_key, label, amount_min, amount_max, variable_factor, is_active, sort_order) VALUES
  ('initial', 'ginou', 'gyoseishoshi_fee', '行政書士費用', 100000, 200000, NULL, true, 10),
  ('initial', 'ginou', 'doc_translation', '書類翻訳費', 30000, 80000, NULL, true, 20),
  ('initial', 'ginou', 'recruitment_agent', '採用エージェント費', 300000, 600000, '職種・エージェントによる', true, 30),
  ('initial', 'ginou', 'residence_application', '在留資格申請費', 40000, 60000, NULL, true, 40),
  ('monthly', 'ginou', 'visa_renewal_ginou', 'ビザ更新費用（年按分）', 3000, 5000, '1〜3年更新', true, 50);

-- 特定技能2号（tokutei2）
INSERT INTO simulator_cost_items (category, visa_type, item_key, label, amount_min, amount_max, variable_factor, is_active, sort_order) VALUES
  ('initial', 'tokutei2', 'residence_application_t2', '在留資格変更申請費', 40000, 60000, NULL, true, 10),
  ('initial', 'tokutei2', 'exam_fee_t2', '技能試験費用（2号）', 15000, 30000, '業種による', true, 20),
  ('monthly', 'tokutei2', 'visa_renewal_t2', 'ビザ更新費用（年按分）', 3000, 5000, '1〜3年更新', true, 30);

-- 留学→就労（student）
INSERT INTO simulator_cost_items (category, visa_type, item_key, label, amount_min, amount_max, variable_factor, is_active, sort_order) VALUES
  ('initial', 'student', 'work_permit_fee', '資格外活動許可申請費', 10000, 20000, NULL, true, 10),
  ('initial', 'student', 'post_grad_transition', '卒業後ビザ移行準備費', 50000, 100000, '行政書士費含む', true, 20);

-- 育成就労 追加項目
INSERT INTO simulator_cost_items (category, visa_type, item_key, label, amount_min, amount_max, variable_factor, is_active, sort_order) VALUES
  ('initial', 'ikusei', 'post_entry_training_wage', '入国後講習期間の給与コスト', 200000, 200000, '月給×1ヶ月', true, 55),
  ('initial', 'ikusei', 'interview_trip', '現地面接渡航費', 0, 200000, '渡航なし/国内/海外', true, 56);

-- 4. simulator_sessions にカラム追加
ALTER TABLE simulator_sessions ADD COLUMN IF NOT EXISTS user_type text;
ALTER TABLE simulator_sessions ADD COLUMN IF NOT EXISTS sim_mode text;
ALTER TABLE simulator_sessions ADD COLUMN IF NOT EXISTS visa_type_detail text;

-- 5. simulator_org_presets にカラム追加
ALTER TABLE simulator_org_presets ADD COLUMN IF NOT EXISTS user_type text;

-- 6. 既存セッションのJSONB内visa_type値もマイグレーション
UPDATE simulator_sessions
SET input_params = jsonb_set(
  input_params,
  '{step2,visaChoice}',
  input_params->'step2'->'visaChoice'
)
WHERE input_params->'step2'->'visaChoice' IS NOT NULL;
