import { createClient } from '@/lib/supabase/server';
import ManagementSimShell from './components/ManagementSimShell';

export const metadata = {
  title: '外国人雇用 経営シミュレーション | J-GLOW',
  description: '外国人雇用の「あるある」をリアルに体験。法令遵守・コスト管理・人間関係・定着率など、ターン制経営シミュレーションで学べます。',
};

export default async function ManagementSimPage() {
  const supabase = await createClient();

  const [
    { data: scenarios },
    { data: configRows },
    { data: { user } },
  ] = await Promise.all([
    supabase
      .from('msim_scenarios')
      .select('*, msim_choices(*, msim_delayed_effects(*))')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('msim_config')
      .select('*'),
    supabase.auth.getUser(),
  ]);

  const config: Record<string, unknown> = {};
  for (const row of configRows ?? []) {
    config[row.key] = row.value;
  }

  const isGuest = !user;
  const userId = user?.id ?? null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <ManagementSimShell
        scenarios={scenarios ?? []}
        config={config}
        isGuest={isGuest}
        userId={userId}
      />
    </div>
  );
}
