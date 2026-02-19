import { createClient } from '@/lib/supabase/server';
import { SimulationCardAdmin } from '@/components/admin/SimulationCardAdmin';

export default async function SimulationAdminPage() {
  const supabase = await createClient();

  const [{ data: cards }, { data: configs }] = await Promise.all([
    supabase
      .from('simulation_cards')
      .select('*, simulation_effects(*)')
      .order('turn_order'),
    supabase
      .from('simulation_config')
      .select('*'),
  ]);

  return (
    <SimulationCardAdmin
      cards={cards ?? []}
      configs={configs ?? []}
    />
  );
}
