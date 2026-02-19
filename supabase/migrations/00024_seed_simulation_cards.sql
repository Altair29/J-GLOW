-- ========================================
-- 外国人雇用シミュレーション シードデータ
-- ========================================

-- simulation_config 初期値
INSERT INTO public.simulation_config (key, value, description) VALUES
  ('initial_gauges', '{"operation": 30, "morale": 60, "compliance": 70}', '初期ゲージ値'),
  ('guest_max_turns', '3', 'ゲストユーザーの最大ターン数'),
  ('total_turns', '10', 'ログインユーザーの総ターン数')
ON CONFLICT (key) DO NOTHING;

-- ========================================
-- カード & エフェクト投入
-- ========================================

-- カード1
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (1,
    '許可を持たない人材エージェントから「明日から3人すぐ出せます。費用は相場の半額。書類は後で揃えます」と連絡が来た。',
    '費用を優先して契約する',
    '認可を受けた管理団体に相談する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',  20, NULL, NULL, NULL, NULL),
  ('yes', 'morale',      0, NULL, NULL, NULL, NULL),
  ('yes', 'compliance',-25, 4,   -20,  'compliance', '在留資格が不明な労働者が発覚しました'),
  ('no',  'operation',  -5, NULL, NULL, NULL, NULL),
  ('no',  'morale',      5, NULL, NULL, NULL, NULL),
  ('no',  'compliance', 10, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード2
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (2,
    '現場リーダーから「外国人スタッフが日本語の指示書を読めず作業ミスが続いています」と報告が来た。',
    '日本人スタッフに通訳・フォローさせる',
    '多言語マニュアルを外注作成する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',   10),
  ('yes', 'morale',     -20),
  ('yes', 'compliance',   0),
  ('no',  'operation',  -10),
  ('no',  'morale',       5),
  ('no',  'compliance',   5)
) AS t(choice, gauge, delta);

-- カード3
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (3,
    '外国人スタッフから「残業代が給与明細と合わない」と訴えがあった。確認すると経理ミスで実際に少なく払っていた。',
    '「次回の給与で調整する」とこっそり処理する',
    '即座に差額を支払い誠意をもって謝罪する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',    0, NULL, NULL, NULL, NULL),
  ('yes', 'morale',     -15, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -20, 6,   -25,  'compliance', '労働基準監督署に相談されたことが発覚しました'),
  ('no',  'operation',    0, NULL, NULL, NULL, NULL),
  ('no',  'morale',      15, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  10, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード4
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (4,
    '人手不足が深刻。外国人スタッフに法定上限を超える残業をお願いしたい。本人は「お金が必要なのでOK」と言っている。',
    '本人の同意を得て残業させる',
    '残業させず認可エージェントに追加募集をかける')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',   20),
  ('yes', 'morale',       0),
  ('yes', 'compliance', -30),
  ('no',  'operation',  -15),
  ('no',  'morale',       5),
  ('no',  'compliance',  10)
) AS t(choice, gauge, delta);

-- カード5
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (5,
    '外国人スタッフの在留資格の更新期限が来月に迫っている。本人任せにしていた。',
    '「自分で手続きしてください」と本人に伝える',
    '会社として社労士に依頼してサポートする')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',    0, NULL, NULL, NULL, NULL),
  ('yes', 'morale',     -10, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -20, 7,   -30,  'compliance', 'オーバーステイが発覚しました。会社も責任を問われます'),
  ('no',  'operation',    0, NULL, NULL, NULL, NULL),
  ('no',  'morale',      20, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  15, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード6
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (6,
    '近隣住民から「外国人従業員の深夜の騒音がひどい」と会社にクレームが入った。社員寮の問題。',
    '本人たちに口頭注意だけして様子を見る',
    '生活ルールの多言語説明会を開いて明文化する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',    0, NULL, NULL, NULL, NULL),
  ('yes', 'morale',      -5, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -15, 8,   -20,  'compliance', '警察沙汰となり会社名が地域に知れ渡りました'),
  ('no',  'operation',   -5, NULL, NULL, NULL, NULL),
  ('no',  'morale',      10, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  10, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード7
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (7,
    '外国人スタッフの一人が突然来なくなった。連絡もとれない。他のスタッフは原因を知っていそうな様子。',
    '欠員補充を最優先。原因調査は後回し',
    '現場を止めてでもスタッフに丁寧にヒアリングする')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',   10),
  ('yes', 'morale',     -20),
  ('yes', 'compliance',   0),
  ('no',  'operation',  -15),
  ('no',  'morale',      15),
  ('no',  'compliance',   5)
) AS t(choice, gauge, delta);

-- カード8
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (8,
    '取引先から「御社の外国人スタッフの日本語対応が不安」と契約継続を渋られている。',
    '「日本人スタッフが必ず同席します」と約束する',
    '外国人スタッフのスキルと実績を丁寧に説明する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',   15),
  ('yes', 'morale',     -15),
  ('yes', 'compliance',   0),
  ('no',  'operation',   -5),
  ('no',  'morale',      10),
  ('no',  'compliance',   5)
) AS t(choice, gauge, delta);

-- カード9
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (9,
    '外国人スタッフから「母国の家族に仕送りしたいので給与を現金で前払いしてほしい」と全員から要望が出た。',
    '現金で前払いする。記録はつけない',
    '給与規定を多言語で説明し通常支払いを維持する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',    5),
  ('yes', 'morale',      10),
  ('yes', 'compliance', -25),
  ('no',  'operation',    0),
  ('no',  'morale',       0),
  ('no',  'compliance',  15)
) AS t(choice, gauge, delta);

-- カード10
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (10,
    '行政から「外国人雇用状況の届出」について確認の連絡が来た。実は提出を忘れていた。',
    '「担当者が変わって把握できていない」と言い訳する',
    '即座に謝罪・書類を揃えて誠実に提出する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',    0),
  ('yes', 'morale',       0),
  ('yes', 'compliance', -35),
  ('no',  'operation',    0),
  ('no',  'morale',       5),
  ('no',  'compliance',  20)
) AS t(choice, gauge, delta);

-- カード11
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (11,
    '外国人スタッフが職場の日本人社員から心ない言葉をかけられていると管理団体から報告が来た。',
    '「よくあること」として静観する',
    '全社員向けに多様性研修を実施する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',    0, NULL, NULL, NULL, NULL),
  ('yes', 'morale',     -25, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -10, 13,  -20,  'morale', '外国人スタッフが相次いで退職を申し出ました'),
  ('no',  'operation',   -5, NULL, NULL, NULL, NULL),
  ('no',  'morale',      20, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  10, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード12
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (12,
    '外国人スタッフの一人が急病で入院した。健康保険の手続きを会社が適切に行っていなかったことが発覚した。',
    '本人と家族に「自分たちで対応してほしい」と伝える',
    '会社として手続きを代行し医療費を一時立替える')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',    0),
  ('yes', 'morale',     -20),
  ('yes', 'compliance', -25),
  ('no',  'operation',   -5),
  ('no',  'morale',      25),
  ('no',  'compliance',  15)
) AS t(choice, gauge, delta);

-- カード13
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (13,
    '人材エージェントから「もっと安く大量に人員を出せる非公式ルートがある」と提案が来た。',
    'コスト削減のため非公式ルートを使う',
    '断り認可を受けた正規の管理団体のみと取引する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',   25, NULL, NULL, NULL, NULL),
  ('yes', 'morale',       0, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -35, 15,  -25,  'compliance', '非公式ルートの労働者に不法就労が発覚しました'),
  ('no',  'operation',   -5, NULL, NULL, NULL, NULL),
  ('no',  'morale',       5, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  15, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード14
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (14,
    '外国人スタッフから「宗教上の理由で特定の曜日に礼拝に行きたい」と申し出があった。',
    '「業務に支障が出る」として認めない',
    'シフトを調整して配慮する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',    5),
  ('yes', 'morale',     -20),
  ('yes', 'compliance', -10),
  ('no',  'operation',   -5),
  ('no',  'morale',      20),
  ('no',  'compliance',  10)
) AS t(choice, gauge, delta);

-- カード15
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (15,
    'SNSに「XXX会社は外国人を安く使っている」と書き込まれた。事実無根だが拡散している。',
    '無視して放置する',
    '事実関係を整理して公式に声明を出す')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',    0, NULL, NULL, NULL, NULL),
  ('yes', 'morale',     -15, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -15, 17,  -15,  'morale', '拡散が続き優秀な日本人スタッフからも退職の申し出がありました'),
  ('no',  'operation',    0, NULL, NULL, NULL, NULL),
  ('no',  'morale',      10, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  15, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード16
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (16,
    '外国人スタッフ間でのトラブルが発生。同じ国籍同士でグループが分かれて対立している。',
    '当事者同士で解決させる',
    '管理団体と連携して第三者による仲裁を行う')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',    0),
  ('yes', 'morale',     -25),
  ('yes', 'compliance',   0),
  ('no',  'operation',   -5),
  ('no',  'morale',      20),
  ('no',  'compliance',   5)
) AS t(choice, gauge, delta);

-- カード17
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (17,
    '外国人スタッフの技能実習計画と実際の業務内容が乖離していると管理団体から指摘された。',
    '「大した問題ではない」として現状維持する',
    '業務内容を計画通りに修正し管理団体に報告する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',    5, NULL, NULL, NULL, NULL),
  ('yes', 'morale',       0, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -30, 19,  -25,  'compliance', '実習計画違反として行政から改善命令が届きました'),
  ('no',  'operation',  -10, NULL, NULL, NULL, NULL),
  ('no',  'morale',       5, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  20, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード18
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (18,
    '優秀な外国人スタッフから「もっと責任ある仕事をしたい。昇格させてほしい」と申し出があった。',
    '「外国人だから難しい」として断る',
    '実力を評価してリーダー職に登用する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',    0),
  ('yes', 'morale',     -25),
  ('yes', 'compliance', -10),
  ('no',  'operation',   10),
  ('no',  'morale',      25),
  ('no',  'compliance',   5)
) AS t(choice, gauge, delta);

-- カード19
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (19,
    '外国人スタッフの帰国が決まった。後任を管理団体に依頼すると時間がかかる。知人の紹介で無資格の人材を採用する話が浮上している。',
    '急場をしのぐため無資格の人材を採用する',
    '時間がかかっても管理団体の正規ルートで採用する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message)
SELECT id, choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message FROM card,
(VALUES
  ('yes', 'operation',   15, NULL, NULL, NULL, NULL),
  ('yes', 'morale',       0, NULL, NULL, NULL, NULL),
  ('yes', 'compliance', -30, 20,  -20,  'compliance', '無資格採用が発覚し不法就労助長罪の疑いで捜査が入りました'),
  ('no',  'operation',  -15, NULL, NULL, NULL, NULL),
  ('no',  'morale',       5, NULL, NULL, NULL, NULL),
  ('no',  'compliance',  15, NULL, NULL, NULL, NULL)
) AS t(choice, gauge, delta, delay_turn, delay_delta, delay_gauge, delay_message);

-- カード20
WITH card AS (
  INSERT INTO public.simulation_cards (turn_order, situation, yes_label, no_label)
  VALUES (20,
    '決算期に外国人雇用にかかるコストが予算を超過した。役員から「外国人比率を下げろ」と指示が来た。',
    '外国人スタッフを優先的に契約解除する',
    '雇用の安定を守り役員にコスト削減の代替案を提案する')
  RETURNING id
)
INSERT INTO public.simulation_effects (card_id, choice, gauge, delta)
SELECT id, choice, gauge, delta FROM card,
(VALUES
  ('yes', 'operation',    5),
  ('yes', 'morale',     -30),
  ('yes', 'compliance', -20),
  ('no',  'operation',   -5),
  ('no',  'morale',      20),
  ('no',  'compliance',  10)
) AS t(choice, gauge, delta);
