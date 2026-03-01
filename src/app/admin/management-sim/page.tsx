import { createClient } from '@/lib/supabase/server';
import ManagementSimAdmin from '@/components/admin/ManagementSimAdmin';

export default async function ManagementSimAdminPage() {
  const supabase = await createClient();

  const [
    { data: scenarios },
    { data: configRows },
  ] = await Promise.all([
    supabase
      .from('msim_scenarios')
      .select('*, msim_choices(*, msim_delayed_effects(*))')
      .order('sort_order'),
    supabase
      .from('msim_config')
      .select('*')
      .order('key'),
  ]);

  return (
    <div>
      <h2 className="text-xl font-bold mb-6">経営シミュレーション管理</h2>
      <ManagementSimAdmin
        scenarios={scenarios ?? []}
        configs={configRows ?? []}
      />
    </div>
  );
}
