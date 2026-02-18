import { createClient } from '@/lib/supabase/server';
import { SimulationAdmin } from '@/components/admin/SimulationAdmin';

export default async function SimulationAdminPage() {
  const supabase = await createClient();

  const [{ data: params }, { count: logCount }] = await Promise.all([
    supabase.from('simulation_params').select('*').order('param_group').order('key'),
    supabase.from('simulation_logs').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <SimulationAdmin
      params={params || []}
      logCount={logCount || 0}
    />
  );
}
