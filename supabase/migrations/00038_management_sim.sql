-- ==========================================
-- 00038: 経営シミュレーション (management-sim)
-- ==========================================

-- シナリオマスタ
CREATE TABLE IF NOT EXISTS msim_scenarios (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category    TEXT NOT NULL CHECK (category IN (
    'compliance','cost','field_issue','life_support',
    'relations','neighbor','positive','government','retention'
  )),
  title       TEXT NOT NULL,
  situation   TEXT NOT NULL,
  detail      TEXT,
  icon        TEXT,
  industries  TEXT[] NOT NULL DEFAULT '{}',
  visa_types  TEXT[] NOT NULL DEFAULT '{}',
  phase_min   INT NOT NULL DEFAULT 1,
  phase_max   INT NOT NULL DEFAULT 24,
  weight      INT NOT NULL DEFAULT 10,
  is_active   BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order  INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 選択肢（各シナリオ2〜4択）
CREATE TABLE IF NOT EXISTS msim_choices (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id         UUID NOT NULL REFERENCES msim_scenarios(id) ON DELETE CASCADE,
  sort_order          INT NOT NULL DEFAULT 0,
  label               TEXT NOT NULL,
  description         TEXT,
  cost_delta          INT NOT NULL DEFAULT 0,
  compliance_delta    INT NOT NULL DEFAULT 0,
  morale_delta        INT NOT NULL DEFAULT 0,
  productivity_delta  INT NOT NULL DEFAULT 0,
  retention_delta     INT NOT NULL DEFAULT 0,
  outcome_text        TEXT NOT NULL,
  learning_point      TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 遅延効果
CREATE TABLE IF NOT EXISTS msim_delayed_effects (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  choice_id           UUID NOT NULL REFERENCES msim_choices(id) ON DELETE CASCADE,
  delay_turns         INT NOT NULL DEFAULT 1,
  cost_delta          INT NOT NULL DEFAULT 0,
  compliance_delta    INT NOT NULL DEFAULT 0,
  morale_delta        INT NOT NULL DEFAULT 0,
  productivity_delta  INT NOT NULL DEFAULT 0,
  retention_delta     INT NOT NULL DEFAULT 0,
  message             TEXT NOT NULL,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ゲーム設定（key-value JSONB）
CREATE TABLE IF NOT EXISTS msim_config (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key         TEXT NOT NULL UNIQUE,
  value       JSONB NOT NULL DEFAULT '{}',
  description TEXT,
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- プレイセッション保存
CREATE TABLE IF NOT EXISTS msim_sessions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  industry        TEXT NOT NULL,
  visa_type       TEXT NOT NULL,
  company_size    INT NOT NULL,
  hire_count      INT NOT NULL DEFAULT 1,
  total_months    INT NOT NULL DEFAULT 12,
  current_month   INT NOT NULL DEFAULT 1,
  status          TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','cleared','game_over')),
  game_over_reason TEXT,
  final_gauges    JSONB,
  grade           TEXT,
  snapshot        JSONB NOT NULL DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS
ALTER TABLE msim_scenarios     ENABLE ROW LEVEL SECURITY;
ALTER TABLE msim_choices        ENABLE ROW LEVEL SECURITY;
ALTER TABLE msim_delayed_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE msim_config         ENABLE ROW LEVEL SECURITY;
ALTER TABLE msim_sessions       ENABLE ROW LEVEL SECURITY;

-- 全員SELECT（マスタデータ）
CREATE POLICY "msim_scenarios_select" ON msim_scenarios FOR SELECT USING (true);
CREATE POLICY "msim_choices_select"   ON msim_choices   FOR SELECT USING (true);
CREATE POLICY "msim_delayed_select"   ON msim_delayed_effects FOR SELECT USING (true);
CREATE POLICY "msim_config_select"    ON msim_config    FOR SELECT USING (true);

-- admin全操作
CREATE POLICY "msim_scenarios_admin" ON msim_scenarios FOR ALL USING (is_admin());
CREATE POLICY "msim_choices_admin"   ON msim_choices   FOR ALL USING (is_admin());
CREATE POLICY "msim_delayed_admin"   ON msim_delayed_effects FOR ALL USING (is_admin());
CREATE POLICY "msim_config_admin"    ON msim_config    FOR ALL USING (is_admin());

-- sessions: 本人のみ
CREATE POLICY "msim_sessions_select" ON msim_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "msim_sessions_insert" ON msim_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "msim_sessions_update" ON msim_sessions FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "msim_sessions_admin"  ON msim_sessions FOR ALL USING (is_admin());

-- インデックス
CREATE INDEX IF NOT EXISTS idx_msim_scenarios_category ON msim_scenarios(category);
CREATE INDEX IF NOT EXISTS idx_msim_scenarios_active   ON msim_scenarios(is_active);
CREATE INDEX IF NOT EXISTS idx_msim_choices_scenario   ON msim_choices(scenario_id);
CREATE INDEX IF NOT EXISTS idx_msim_delayed_choice     ON msim_delayed_effects(choice_id);
CREATE INDEX IF NOT EXISTS idx_msim_sessions_user      ON msim_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_msim_sessions_status    ON msim_sessions(status);

-- 初期設定データ
INSERT INTO msim_config (key, value, description) VALUES
  ('initial_funds', '{"default": 5000000, "kensetsu": 6000000, "kaigo": 4000000, "seizou": 5500000, "gaishoku": 4000000, "nogyo": 4500000, "shukuhaku": 4500000, "gyogyo": 5000000, "biru": 4000000, "other": 5000000}', '業種別初期資金（円）'),
  ('monthly_revenue_base', '{"default": 800000, "kensetsu": 1000000, "kaigo": 700000, "seizou": 900000, "gaishoku": 650000, "nogyo": 750000, "shukuhaku": 700000, "gyogyo": 850000, "biru": 600000, "other": 800000}', '業種別月次収益基準（従業員1人あたり）'),
  ('monthly_cost_by_visa', '{"ikusei": 350000, "tokutei1": 300000, "tokutei2": 280000}', 'ビザ別月次コスト（1人あたり：給与+支援費等）'),
  ('grade_thresholds', '{"S": 400, "A": 320, "B": 240, "C": 0}', '5ゲージ合計でのグレード閾値'),
  ('initial_gauges', '{"compliance": 80, "morale": 70, "productivity": 60, "retention": 75}', '初期ゲージ値（資金以外）'),
  ('guest_month_limit', '6', 'ゲストプレイ制限月数')
ON CONFLICT (key) DO NOTHING;

-- Admin サイドバーにナビゲーション項目追加
INSERT INTO navigation_items (section, label, href, icon, sort_order, is_active, requires_auth, required_role)
VALUES ('admin_sidebar', '経営シミュレーション', '/admin/management-sim', 'Gamepad2', 86, true, true, 'admin')
ON CONFLICT DO NOTHING;

-- シードデータ: 20シナリオ
-- SC-001: ビザ更新期限の接近
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000001', 'compliance', 'ビザ更新期限の接近',
  '外国人スタッフの在留資格の更新期限が1ヶ月後に迫っています。まだ更新手続きを始めていません。',
  '在留資格の更新を怠ると不法就労となり、企業にも罰則が及びます。余裕を持った手続きが重要です。',
  '📋', '{}', '{}', 1, 24, 12, 1);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000001', 1, '行政書士に依頼', '専門家に在留資格更新を委託する', -80000, 15, 5, 0, 5,
 '行政書士がスムーズに更新手続きを完了。スタッフも安心して業務に集中できるようになりました。',
 'ビザ更新は期限の3ヶ月前から可能です。専門家への早期依頼で確実な更新と、スタッフの安心感を両立できます。'),
('a0000001-0001-0001-0001-000000000001', 2, '自力で申請準備', '社内で書類を揃えて申請する', 0, 5, -5, -10, 0,
 '慣れない書類作成に時間がかかり、業務にも影響が出ましたが、なんとか期限内に申請できました。',
 '入管への申請は複雑で、書類不備があると受理されないことも。初回は専門家に依頼し、ノウハウを蓄積するのが賢明です。'),
('a0000001-0001-0001-0001-000000000001', 3, '登録支援機関に相談', '支援機関を通じて更新をサポート', -50000, 10, 5, -5, 5,
 '支援機関のアドバイスで必要書類を効率的に準備。更新も問題なく完了しました。',
 '登録支援機関は在留資格の更新支援も業務の一つ。契約内容を確認し、活用しましょう。');

-- SC-002: 住居トラブル
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000002', 'life_support', '住居トラブル',
  '外国人スタッフの寮でゴミ出しルールが守られず、近隣住民から苦情が入りました。',
  '生活支援は受入企業の重要な責務。文化の違いを理解した上で、丁寧な説明が求められます。',
  '🏠', '{}', '{}', 1, 12, 10, 2);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000002', 1, '多言語ゴミ出しガイドを作成', '写真付きの分かりやすいルール表を作る', -15000, 5, 10, 0, 10,
 'イラスト付きガイドが好評。ルールが守られるようになり、近隣関係も改善しました。',
 '外国人の生活支援では「言葉で伝える」だけでなく、視覚的な資料が効果的です。J-GLOWの現場指示書ビルダーも活用できます。'),
('a0000001-0001-0001-0001-000000000002', 2, '口頭で注意する', '日本語で直接注意する', 0, 0, -10, 0, -5,
 '言葉の壁もあり、十分に伝わりませんでした。スタッフは萎縮し、苦情は続いています。',
 '言語の壁がある中での「口頭注意」は誤解を生みやすく、信頼関係を損なうリスクがあります。'),
('a0000001-0001-0001-0001-000000000002', 3, '寮の管理会社に任せる', '管理会社に対応を一任', -30000, -5, -5, 0, -5,
 '管理会社が一律に厳しいルールを適用。スタッフの居住環境が窮屈になってしまいました。',
 '住居問題は受入企業として関与すべき事項です。丸投げは問題の根本解決につながりません。');

-- SC-003: 賃金未払い疑惑
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000003', 'compliance', '賃金計算の誤り',
  '外国人スタッフから「給与明細の残業代がおかしい」と相談がありました。確認すると、計算方法に誤りがある可能性があります。',
  '賃金の適正な支払いは法令遵守の基本。特に残業代の計算ミスは労基署の指導対象になります。',
  '💰', '{}', '{}', 2, 24, 12, 3);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000003', 1, '即座に再計算して差額を支払う', '過去分も含めて正確に再計算', -200000, 15, 15, 0, 10,
 '迅速な対応にスタッフは感謝。信頼関係が強化され、他のスタッフの安心感にもつながりました。',
 '賃金の誤りは発覚次第、速やかに是正することが重要です。放置すると労基署の指導や訴訟リスクにつながります。'),
('a0000001-0001-0001-0001-000000000003', 2, '社労士に確認を依頼', '専門家に計算方法を検証してもらう', -100000, 10, 5, -5, 5,
 '社労士の指摘で計算方法の誤りが判明。適切に修正し、今後の再発防止策も整備できました。',
 '給与計算は専門知識が必要です。社労士との顧問契約で、法令違反リスクを最小化しましょう。'),
('a0000001-0001-0001-0001-000000000003', 3, '「計算は合っている」と説明', 'スタッフに問題ないと伝える', 0, -20, -15, -5, -15,
 '不信感が広がり、スタッフが監理団体に相談。調査の結果、未払いが発覚し指導を受けました。',
 '賃金に関する相談を軽視してはいけません。外国人スタッフには母国語での相談窓口があり、問題は必ず表面化します。');

-- SC-004: 日本語能力の壁
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000004', 'field_issue', '日本語能力の壁',
  '現場で外国人スタッフへの指示が正確に伝わらず、作業ミスが増えています。安全面でも不安が出てきました。',
  '日本語能力は安全管理に直結します。多言語対応と視覚的な指示の併用が効果的です。',
  '🗣️', '{"kensetsu","seizou"}', '{}', 1, 12, 12, 4);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000004', 1, '多言語マニュアルを整備', '作業手順を写真・イラスト付きで多言語化', -120000, 10, 10, 15, 10,
 '視覚的なマニュアルで指示の伝達が正確に。ミスが減り、生産性も向上しました。',
 '多言語マニュアルは初期投資がかかりますが、安全性と生産性の両方を改善する最も効果的な方法です。'),
('a0000001-0001-0001-0001-000000000004', 2, 'ミスを厳しく叱責する', '日本語で厳しく注意し、緊張感を持たせる', 0, -5, -20, -5, -15,
 'スタッフは委縮して質問もできなくなり、さらにミスが増加。退職を考え始める人も出てきました。',
 '叱責は逆効果です。言葉の壁がある中で強い口調は「理解できない恐怖」を生み、問題を悪化させます。'),
('a0000001-0001-0001-0001-000000000004', 3, 'バディ制度を導入', '日本人スタッフとペアで作業させる', -30000, 5, 10, 5, 10,
 'ペアワークで自然な日本語習得も進み、チームワークも向上。双方にとってプラスの結果に。',
 'バディ制度は低コストで効果的な方法です。日本人スタッフの異文化理解も深まり、職場全体の雰囲気改善につながります。');

-- SC-005: 突然の体調不良
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000005', 'life_support', '突然の体調不良',
  '外国人スタッフが体調不良を訴えていますが、日本の医療制度に不慣れで病院に行けていないようです。',
  '健康管理は受入企業の重要な責務の一つ。医療アクセスの支援体制を事前に整えておくことが大切です。',
  '🏥', '{}', '{}', 1, 24, 10, 5);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000005', 1, '通訳同行で病院へ', '多言語対応の医療機関を手配し同行', -20000, 5, 15, -5, 15,
 'スタッフは適切な治療を受けて回復。会社への信頼感が大きく高まりました。',
 '多言語対応の医療機関リストを事前に作成しておくと、緊急時にも迅速に対応できます。'),
('a0000001-0001-0001-0001-000000000005', 2, '市販薬を渡して様子見', '薬を渡して経過を見守る', -3000, -5, -5, -10, -5,
 '症状が悪化し、結局救急搬送に。早期受診していれば軽症で済んだはずでした。',
 '体調不良の放置は、症状の重篤化だけでなく、安全配慮義務違反のリスクもあります。'),
('a0000001-0001-0001-0001-000000000005', 3, '医療通訳サービスを契約', '多言語医療通訳の定期契約を結ぶ', -60000, 10, 10, 0, 10,
 '通訳サービスの導入で、スタッフが安心して医療を受けられる環境が整いました。',
 '医療通訳サービスは月額数千円〜。従業員の安心感と企業のリスク軽減を考えれば、投資対効果の高い施策です。');

-- SC-006: 日本人スタッフからの不満
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000006', 'relations', '日本人スタッフからの不満',
  '「なぜ外国人ばかり特別扱いするのか」と日本人スタッフから不満の声が上がっています。',
  '外国人雇用の成功には日本人スタッフの理解と協力が不可欠です。適切な説明と巻き込みが重要です。',
  '👥', '{}', '{}', 2, 24, 12, 6);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000006', 1, '全体説明会を開催', '外国人雇用の背景と意義を全社で共有', -30000, 5, 15, 5, 10,
 '法制度や文化の違いについて理解が深まり、「特別扱い」ではなく「必要な支援」だと認識が変わりました。',
 '日本人スタッフへの事前説明は外国人受入の成功に最も重要な要素の一つです。受入前の説明会開催を強く推奨します。'),
('a0000001-0001-0001-0001-000000000006', 2, '異文化理解研修を実施', '外部講師による研修を行う', -80000, 5, 10, 5, 10,
 '専門家による研修で、異文化コミュニケーションのスキルが向上。職場の雰囲気が改善しました。',
 '異文化理解研修は助成金の対象になる場合も。人材確保等支援助成金などを活用すればコストを抑えられます。'),
('a0000001-0001-0001-0001-000000000006', 3, '外国人向け支援を縮小', '不満解消のため、支援内容を見直す', 50000, -15, -5, -10, -20,
 '支援縮小で外国人スタッフのモチベーションが低下。離職の兆候が見え始めました。',
 '法定の支援義務を下回ると法令違反になります。日本人の不満には「支援削減」ではなく「理解促進」で対応しましょう。');

-- SC-007: 文化的摩擦（宗教・食事）
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000007', 'relations', '文化的摩擦（宗教・食事）',
  '外国人スタッフが礼拝の時間を確保したいと申し出ています。他のスタッフからは戸惑いの声も。',
  '宗教・文化の多様性への配慮は、グローバルな職場環境づくりの基本です。',
  '🙏', '{}', '{}', 1, 24, 8, 7);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000007', 1, '休憩時間内で対応', '休憩時間の柔軟な運用で礼拝時間を確保', 0, 5, 15, 0, 15,
 'スタッフは会社の配慮に深く感謝。他のスタッフも多様性を受け入れる雰囲気が生まれました。',
 '宗教的配慮は「特別扱い」ではなく「合理的配慮」です。休憩時間の柔軟な運用で対応できるケースがほとんどです。'),
('a0000001-0001-0001-0001-000000000007', 2, '「全員同じルール」を貫く', '公平性を理由に一律対応', 0, 0, -15, 0, -10,
 '帰属意識が低下し、スタッフの離職リスクが高まっています。',
 '形式的な平等が実質的な不平等を生むことがあります。多様なバックグラウンドに応じた合理的配慮を検討しましょう。');

-- SC-008: 近隣住民からのクレーム（騒音）
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000008', 'neighbor', '近隣住民からのクレーム',
  '外国人スタッフの寮の近隣住民から「深夜の騒音がうるさい」と苦情が来ました。',
  '地域との共生は長期的な受入体制の基盤。初期対応が重要です。',
  '🏘️', '{}', '{}', 1, 18, 10, 8);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000008', 1, 'スタッフと住民の間に入る', '直接謝罪し、スタッフにも丁寧に説明', -10000, 5, 5, 0, 5,
 '迅速な対応で住民の理解を得られました。スタッフも日本の生活マナーを学ぶ良い機会に。',
 '近隣トラブルは放置すると「外国人だから」という偏見を助長します。企業として責任を持って仲介しましょう。'),
('a0000001-0001-0001-0001-000000000008', 2, 'スタッフに厳しく注意', '一方的にスタッフを叱責', 0, 0, -15, -5, -10,
 'スタッフは「自分たちだけ悪者にされた」と感じ、職場への不信感が募りました。',
 '一方的な叱責は信頼関係を壊します。文化の違いを理解した上で、双方の立場に配慮した対応が必要です。'),
('a0000001-0001-0001-0001-000000000008', 3, '地域交流会を企画', '住民とスタッフの交流イベントを開催', -50000, 10, 15, 0, 10,
 '交流会を通じて相互理解が深まり、むしろ好意的な関係が築けました。',
 '地域交流は先進企業が積極的に取り組む施策です。地域の理解を得ることで、長期的な受入環境が安定します。');

-- SC-009: 台風・災害への対応
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000009', 'life_support', '台風・災害への対応',
  '大型台風が接近中。外国人スタッフは日本の災害対応に不慣れで、不安が広がっています。',
  '災害時の外国人支援は安全配慮義務の一環。多言語での情報提供が求められます。',
  '🌀', '{}', '{}', 4, 18, 8, 9);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000009', 1, '多言語防災マニュアルを配布', '避難場所・行動指針を母国語で共有', -25000, 10, 15, 0, 10,
 '全員が安全に避難完了。事前準備の重要性が社内に浸透しました。',
 '多言語防災マニュアルは自治体が無料で提供しているケースも多いです。受入時に必ず配布しましょう。'),
('a0000001-0001-0001-0001-000000000009', 2, '日本人と同じ対応のみ', '全社的な防災対応に含めるだけ', 0, -5, -10, -10, -5,
 '日本語が十分でないスタッフが避難に遅れ、危険な状態に。安全配慮の不備を指摘されました。',
 '災害時、言語の壁は命に関わります。多言語での情報提供は「配慮」ではなく「義務」と考えましょう。');

-- SC-010: スタッフからの改善提案
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000010', 'positive', 'スタッフからの改善提案',
  '外国人スタッフから作業工程の改善提案がありました。母国での経験を活かしたアイデアのようです。',
  '外国人スタッフの知見や経験を活かすことで、イノベーションが生まれることがあります。',
  '💡', '{"seizou","kensetsu"}', '{}', 3, 24, 10, 10);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000010', 1, '試験的に導入', '小規模にテストして効果を検証', -50000, 0, 15, 15, 15,
 '提案が実際に効率化につながり、社内で高く評価されました。本人のモチベーションも大幅アップ。',
 '外国人スタッフの声に耳を傾けることで、思わぬ改善や気づきが得られます。心理的安全性の高い職場づくりが定着の鍵です。'),
('a0000001-0001-0001-0001-000000000010', 2, '次の機会に検討', '良い提案だが今は時期が悪いと伝える', 0, 0, -5, 0, -5,
 'スタッフは「結局聞いてもらえない」と感じ、以後提案が出なくなりました。',
 '「検討します」で終わらせると、提案意欲を削ぎます。すぐに実行できなくても、具体的な検討スケジュールを示しましょう。'),
('a0000001-0001-0001-0001-000000000010', 3, '見送り', '現行のやり方を変える必要はないと判断', 0, 0, -10, -5, -10,
 'スタッフの意欲が低下。「自分の経験は評価されない」という諦めが広がっています。',
 '改善提案の却下は、理由を丁寧に説明しないとモチベーション低下に直結します。');

-- SC-011: 行政機関の立入検査
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000011', 'government', '行政機関の立入検査',
  '入管庁（出入国在留管理局）から事業所への立入検査の通知がありました。',
  '立入検査は定期的に実施されます。日頃からの書類整備と適正な労務管理が重要です。',
  '🏛️', '{}', '{"ikusei","tokutei1"}', 3, 24, 10, 11);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000011', 1, '書類を総点検', '雇用契約書・賃金台帳・出勤簿を全て確認', -20000, 15, 5, -10, 5,
 '検査では軽微な指摘のみ。日頃の管理体制が評価されました。',
 '立入検査で確認されるのは①雇用契約書②賃金台帳③出勤簿④安全衛生管理⑤生活支援状況です。日頃の整備が最大の対策です。'),
('a0000001-0001-0001-0001-000000000011', 2, '急いで書類を整備', '検査日までに不足書類を作成', -50000, 5, -5, -15, 0,
 '急造の書類に不整合があり、再検査が入ることに。根本的な管理体制の見直しを求められました。',
 '付け焼き刃の対応は逆効果です。日頃から書類を適切に管理する仕組み（月次チェックリスト等）を整えましょう。'),
('a0000001-0001-0001-0001-000000000011', 3, '特に準備せず当日を迎える', '通常通りで問題ないと判断', 0, -20, -10, -5, -10,
 '複数の不備が指摘され、改善命令を受けました。最悪の場合、受入停止のリスクも。',
 '立入検査を軽視すると、改善命令→受入停止→事業許可取消という最悪のシナリオにつながります。');

-- SC-012: ホームシック
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000012', 'retention', 'ホームシック',
  '入社3ヶ月目の外国人スタッフが、ホームシックで元気がありません。業務パフォーマンスにも影響が出始めています。',
  '海外から来た人材のメンタルケアは定着率に直結する重要な課題です。',
  '😢', '{}', '{}', 2, 8, 10, 12);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000012', 1, '同国人コミュニティを紹介', '地域の国際交流団体や同国人グループとつなぐ', -10000, 0, 15, 5, 15,
 '同郷の仲間との交流で心が安定。仕事にも前向きに取り組めるようになりました。',
 '同国人コミュニティとのつながりはメンタルヘルスの安定に非常に効果的。地域の国際交流協会に相談してみましょう。'),
('a0000001-0001-0001-0001-000000000012', 2, '個別面談を実施', '悩みを聞いて一緒に解決策を考える', 0, 0, 10, 0, 10,
 '話を聞いてもらえたことで気持ちが楽になったようです。定期面談の仕組みも導入しました。',
 '定期的な面談は問題の早期発見に有効です。月1回15分でも、「気にかけてもらえている」という安心感が生まれます。'),
('a0000001-0001-0001-0001-000000000012', 3, '「仕事に集中するように」と伝える', '個人的な問題は自分で解決するべきと突き放す', 0, -5, -20, -10, -20,
 'スタッフの孤立感が深刻化。退職を決意してしまいました。',
 'ホームシックを「甘え」と捉えてはいけません。異国での生活は想像以上のストレス。企業の支援が定着の分かれ目です。');

-- SC-013: 技能評価試験
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000013', 'compliance', '技能評価試験の準備',
  '外国人スタッフの技能評価試験（特定技能移行要件）が近づいています。業務の合間に勉強時間を確保する必要があります。',
  '技能評価試験の合格は在留資格移行の必須条件。企業としての学習支援が求められます。',
  '📝', '{}', '{"ikusei","tokutei1"}', 6, 24, 10, 13);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000013', 1, '学習時間と教材を提供', '勤務時間内の学習時間確保と教材費を支援', -80000, 10, 15, -5, 15,
 '手厚い支援の結果、見事合格。スタッフの忠誠心が高まり、長期定着への意欲も向上しました。',
 '技能評価試験の合格支援は投資です。合格→特定技能移行で長期在留が可能になり、育成コストの回収につながります。'),
('a0000001-0001-0001-0001-000000000013', 2, '自主学習に任せる', '業務外の時間で自分で勉強してもらう', 0, 0, -5, 0, -5,
 '十分な準備ができず不合格に。再受験までの期間、在留資格の問題が発生するリスクも。',
 '試験対策を個人任せにすると合格率が下がります。企業の支援は「投資」と捉え、積極的にサポートしましょう。');

-- SC-014: 労災事故
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000014', 'field_issue', '労災事故',
  '外国人スタッフが作業中に軽い怪我をしました。労災保険の手続きが必要です。',
  '外国人も日本人と同様に労災保険の対象です。適切な手続きと再発防止が重要です。',
  '⚠️', '{"kensetsu","seizou","nogyo"}', '{}', 1, 24, 10, 14);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000014', 1, '労災申請 + 安全研修実施', '正式に労災申請し、全員向けの安全研修を実施', -100000, 15, 10, -10, 10,
 '適切な対応で信頼を維持。安全研修により職場全体の安全意識が向上しました。',
 '労災隠しは犯罪です。適切に申請し、再発防止のための安全研修を行うことが企業の義務です。'),
('a0000001-0001-0001-0001-000000000014', 2, '労災申請のみ', '手続きは行うが、特別な対応はしない', -20000, 5, 0, -5, 0,
 '手続きは完了しましたが、再発防止策が不十分。同様の事故リスクが残っています。',
 '労災申請は最低限の対応です。再発防止まで含めて初めて安全配慮義務を果たしたことになります。'),
('a0000001-0001-0001-0001-000000000014', 3, '「大したことない」と労災申請せず', '軽い怪我だから大丈夫だと判断', 0, -25, -15, 0, -10,
 '後日症状が悪化。労災隠しとして通報され、企業が処分を受けました。',
 '労災隠しは送検・罰金の対象です。「軽い怪我」でも必ず報告・申請してください。在留資格への影響はありません。');

-- SC-015: 送出機関からの過大請求
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000015', 'cost', '送出機関からの過大請求',
  '送出機関から当初の見積もりにない追加費用を請求されています。スタッフが負担させられている可能性も。',
  '送出機関の不正な費用徴収は国際的な問題です。企業として適正な取引を確保する責任があります。',
  '💸', '{}', '{"ikusei"}', 1, 12, 8, 15);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000015', 1, '監理団体に報告・調査依頼', '正式に問題を報告し、調査を求める', -30000, 15, 10, 0, 10,
 '調査の結果、不正な費用徴収が発覚。送出機関の変更を含む改善が行われました。',
 '送出機関の不正は受入企業にも責任が問われる場合があります。疑わしい請求には毅然と対応しましょう。'),
('a0000001-0001-0001-0001-000000000015', 2, '追加費用を支払う', '波風を立てたくないので支払う', -300000, -10, 0, 0, 0,
 '一度支払うと追加請求がエスカレート。コストが膨らみ続けています。',
 '不透明な追加費用に応じると、エスカレートの一途です。契約書に基づいた適正な取引を求めましょう。'),
('a0000001-0001-0001-0001-000000000015', 3, 'スタッフに確認', '本人に送出機関への支払い状況を確認', 0, 5, 5, 0, 5,
 'スタッフから過大な保証金を取られていたことが判明。是正に向けて動き出せました。',
 'スタッフへの過大な費用徴収（保証金等）は技能実習法・入管法で禁止されています。定期的な確認が重要です。');

-- SC-016: 繁忙期の人手不足
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000016', 'cost', '繁忙期の人手不足',
  '繁忙期に入りましたが、想定以上の受注で人手が足りません。外国人スタッフに残業を増やすか検討中です。',
  '外国人スタッフの残業時間には法的な上限があります。36協定の遵守が必要です。',
  '📊', '{}', '{}', 4, 20, 10, 16);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000016', 1, '36協定の範囲内で残業', '法定上限を守りながら対応', -150000, 5, -5, 10, 0,
 '法令を守りながら繁忙期を乗り切りました。残業手当の適切な支払いもスタッフに評価されています。',
 '36協定の上限は原則月45時間・年360時間。外国人も日本人も同じ基準です。上限を超えると法令違反になります。'),
('a0000001-0001-0001-0001-000000000016', 2, '上限を超えた残業を指示', '納期優先で上限を超えて残業させる', -200000, -25, -15, 15, -15,
 '短期的には乗り切りましたが、後日労基署の調査が入り、是正勧告を受けました。',
 '残業上限違反は罰則（6ヶ月以下の懲役または30万円以下の罰金）の対象。外国人の場合、在留資格にも影響し得ます。'),
('a0000001-0001-0001-0001-000000000016', 3, '効率化で対応', '作業工程を見直して生産性を上げる', -60000, 5, 5, 15, 5,
 '工程の見直しで無駄を削減。残業を抑えながら繁忙期を乗り切れました。',
 '人手不足の解決策は「残業増」だけではありません。工程改善・IT化・外注活用など多角的なアプローチを検討しましょう。');

-- SC-017: スタッフの家族呼び寄せ相談
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000017', 'retention', '家族の呼び寄せ相談',
  '長期勤務の外国人スタッフから「家族を日本に呼びたい」と相談がありました。',
  '家族帯同は在留資格によって可否が異なります。スタッフのキャリアパスと合わせた助言が重要です。',
  '👨‍👩‍👧', '{}', '{"tokutei2"}', 8, 24, 8, 17);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000017', 1, '行政書士に相談して手続き支援', '家族帯同の要件確認と手続きをサポート', -80000, 5, 20, 5, 20,
 '家族帯同が実現。スタッフのモチベーションと定着意欲が大幅に向上しました。',
 '特定技能2号は家族帯同が可能です。この「将来展望」を示すことで、育成就労・1号段階から高いモチベーションを維持できます。'),
('a0000001-0001-0001-0001-000000000017', 2, '制度を説明して待つよう伝える', '現在の在留資格では難しいと説明', 0, 0, -5, 0, 0,
 '制度上の制約は理解してもらえましたが、長期的なキャリアパスを示す必要性を感じました。',
 '家族帯同ができない在留資格でも、将来の移行計画を具体的に示すことで、モチベーション維持につなげられます。');

-- SC-018: コミュニケーションの成功体験
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000018', 'positive', 'コミュニケーションの成功体験',
  '外国人スタッフが日本語スピーチコンテストで入賞しました。会社としてどう対応しますか？',
  'スタッフの成長を認め、褒めることは組織全体のモチベーション向上につながります。',
  '🏆', '{}', '{}', 4, 24, 8, 18);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000018', 1, '社内で表彰・報奨金', '朝礼で紹介し、報奨金を支給', -30000, 0, 20, 5, 15,
 '本人はもちろん、他のスタッフにも「頑張れば認めてもらえる」という好循環が生まれました。',
 'スタッフの成長を「見える化」することで、組織全体のモチベーションが向上します。小さな成功体験の積み重ねが定着の鍵です。'),
('a0000001-0001-0001-0001-000000000018', 2, '「よかったね」と声かけ', '個人的に褒める', 0, 0, 5, 0, 5,
 '本人は嬉しそうでしたが、組織全体への波及効果は限定的でした。',
 '個人的な声かけも大切ですが、公式な場での表彰はチーム全体の一体感を高めます。');

-- SC-019: 転職希望の相談
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000019', 'retention', '転職希望の相談',
  '外国人スタッフから「他の会社に移りたい」と相談がありました。条件面での不満があるようです。',
  '転職（転籍）の制度は在留資格によって異なります。まずは本人の不満を正確に把握することが重要です。',
  '🔄', '{}', '{}', 6, 24, 12, 19);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000019', 1, '面談で不満を聴取し改善', '丁寧に話を聞き、改善可能な点を対応', -100000, 5, 15, 5, 20,
 '不満の根本原因が判明し、改善策を実施。スタッフは残留を決意しました。',
 '転職希望の背景には「待遇」「人間関係」「キャリア」など様々な要因があります。まず聞くことから始めましょう。'),
('a0000001-0001-0001-0001-000000000019', 2, '引き止めずに手続き', '本人の意思を尊重し、円満退職を支援', -50000, 10, -5, -15, -10,
 '円満な退職で、会社の評判は守られました。しかし人材の損失と再採用コストが発生します。',
 '円満退職は悪いことではありませんが、退職理由の分析→改善のサイクルを回すことで、次の人材の定着率を上げられます。'),
('a0000001-0001-0001-0001-000000000019', 3, '「転職は認めない」と拒否', '育成就労の制約を盾に引き留め', 0, -20, -25, -10, -25,
 '強引な引き留めが問題化。監理団体を通じて労働局に報告される事態に発展しました。',
 '2027年施行の育成就労制度では一定期間後の転籍が認められます。不当な引き留めは法令違反となります。');

-- SC-020: 資金繰りの悪化
INSERT INTO msim_scenarios (id, category, title, situation, detail, icon, industries, visa_types, phase_min, phase_max, weight, sort_order)
VALUES ('a0000001-0001-0001-0001-000000000020', 'cost', '資金繰りの悪化',
  '売上が落ち込み、外国人雇用に関する経費の見直しが必要になっています。',
  '経費削減は必要ですが、法定義務を下回る支援削減は法令違反のリスクがあります。',
  '📉', '{}', '{}', 6, 24, 10, 20);

INSERT INTO msim_choices (scenario_id, sort_order, label, description, cost_delta, compliance_delta, morale_delta, productivity_delta, retention_delta, outcome_text, learning_point) VALUES
('a0000001-0001-0001-0001-000000000020', 1, '助成金を活用', '利用可能な助成金を調査・申請', 300000, 5, 5, 0, 5,
 '人材確保等支援助成金の活用で、コストを抑えながら支援体制を維持できました。',
 '外国人雇用に関連する助成金は複数あります。J-GLOWの助成金検索ツールで自社に合った制度を見つけましょう。'),
('a0000001-0001-0001-0001-000000000020', 2, '支援費用を削減', '義務的でない支援を一時停止', 200000, -10, -10, -5, -10,
 '短期的にはコスト削減できましたが、スタッフの不満が蓄積しています。',
 '支援削減は「やむを得ない」と思いがちですが、定着率低下→再採用コストのほうが高くつくケースがほとんどです。'),
('a0000001-0001-0001-0001-000000000020', 3, '人員削減を検討', '外国人スタッフの契約を見直す', 400000, -5, -20, -15, -25,
 '人員削減で短期的な資金は確保しましたが、残ったスタッフの不安も大きく、生産性が低下しています。',
 '安易な人員削減は組織全体のモチベーションを破壊します。まずは助成金活用や業務効率化を検討しましょう。');
