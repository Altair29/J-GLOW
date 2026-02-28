CREATE TABLE public.skill_upgrade_steps (
  id           SERIAL PRIMARY KEY,
  visa_from    TEXT NOT NULL,
  industry     TEXT NOT NULL,
  step_order   INT NOT NULL,
  title        TEXT NOT NULL,
  description  TEXT,
  is_company   BOOLEAN DEFAULT true,
  is_active    BOOLEAN DEFAULT true
);

ALTER TABLE public.skill_upgrade_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "全員読み取り可" ON public.skill_upgrade_steps
  FOR SELECT USING (true);

CREATE POLICY "adminのみ操作可" ON public.skill_upgrade_steps
  FOR ALL USING (public.is_admin());