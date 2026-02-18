-- ========================================
-- 採用シミュレーション
-- ========================================

-- シミュレーション基礎パラメータ
CREATE TABLE public.simulation_params (
  id          SERIAL PRIMARY KEY,
  param_group TEXT NOT NULL,
  key         TEXT NOT NULL,
  label       TEXT NOT NULL,
  value       JSONB NOT NULL,
  conditions  JSONB,
  description TEXT,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(param_group, key)
);

-- シミュレーション実行ログ
CREATE TABLE public.simulation_logs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  input       JSONB NOT NULL,
  result      JSONB NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);

-- RLS
ALTER TABLE public.simulation_params ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_logs ENABLE ROW LEVEL SECURITY;

-- パラメータ: 全ユーザー読み取り
CREATE POLICY "sim_params_select" ON public.simulation_params
  FOR SELECT USING (true);
CREATE POLICY "sim_params_admin" ON public.simulation_params
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ログ: 本人 + admin
CREATE POLICY "sim_logs_own" ON public.simulation_logs
  FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "sim_logs_admin" ON public.simulation_logs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE TRIGGER sim_params_updated_at
  BEFORE UPDATE ON public.simulation_params
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- インデックス
CREATE INDEX idx_sim_logs_user ON public.simulation_logs(user_id);
