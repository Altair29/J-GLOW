-- ==========================================
-- 経営シミュレーション リバランス
-- 50ベースライン統一 + グレード閾値調整
-- ==========================================

-- 全ゲージの初期値を50に統一（中立点として判断しやすい）
UPDATE msim_config
SET value = '{"compliance": 50, "morale": 50, "productivity": 50, "retention": 50}'::jsonb
WHERE key = 'initial_gauges';

-- 50ベースラインに合わせたグレード閾値
-- 理論最大: 100*5=500, 初期値: ~100(資金)+50*4=300
-- S=350(平均70), A=280(平均56), B=200(平均40)
UPDATE msim_config
SET value = '{"S": 350, "A": 280, "B": 200, "C": 0}'::jsonb
WHERE key = 'grade_thresholds';
