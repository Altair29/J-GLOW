-- ========================================
-- 外国人雇用シミュレーション（カードスワイプ型）
-- ========================================

-- シミュレーションカード
CREATE TABLE public.simulation_cards (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  turn_order   INTEGER NOT NULL,
  situation    TEXT NOT NULL,
  yes_label    TEXT NOT NULL,
  no_label     TEXT NOT NULL,
  is_active    BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ DEFAULT now()
);

-- カード選択時のゲージ変動効果
CREATE TABLE public.simulation_effects (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  card_id      UUID REFERENCES public.simulation_cards ON DELETE CASCADE,
  choice       TEXT CHECK (choice IN ('yes', 'no')),
  gauge        TEXT CHECK (gauge IN ('operation', 'morale', 'compliance')),
  delta        INTEGER NOT NULL,
  delay_turn   INTEGER,
  delay_delta  INTEGER,
  delay_gauge  TEXT,
  delay_message TEXT
);

-- シミュレーション設定
CREATE TABLE public.simulation_config (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  key         TEXT UNIQUE NOT NULL,
  value       JSONB NOT NULL,
  description TEXT
);

-- RLS有効化
ALTER TABLE public.simulation_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_effects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_config ENABLE ROW LEVEL SECURITY;

-- SELECT: 全員可
CREATE POLICY "sim_cards_select" ON public.simulation_cards
  FOR SELECT USING (true);
CREATE POLICY "sim_effects_select" ON public.simulation_effects
  FOR SELECT USING (true);
CREATE POLICY "sim_config_select" ON public.simulation_config
  FOR SELECT USING (true);

-- INSERT/UPDATE/DELETE: admin のみ
CREATE POLICY "sim_cards_admin" ON public.simulation_cards
  FOR ALL USING (public.is_admin());
CREATE POLICY "sim_effects_admin" ON public.simulation_effects
  FOR ALL USING (public.is_admin());
CREATE POLICY "sim_config_admin" ON public.simulation_config
  FOR ALL USING (public.is_admin());

-- インデックス
CREATE INDEX idx_sim_cards_turn ON public.simulation_cards(turn_order);
CREATE INDEX idx_sim_effects_card ON public.simulation_effects(card_id);
