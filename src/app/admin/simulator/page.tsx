import { createClient } from '@/lib/supabase/server';
import { SimulatorAdmin } from '@/components/admin/SimulatorCostAdmin';

export const metadata = {
  title: 'シミュレーター管理 | J-GLOW Admin',
};

export default async function AdminSimulatorPage() {
  const supabase = await createClient();
  const { data: items } = await supabase
    .from('simulator_cost_items')
    .select('*')
    .order('category')
    .order('sort_order');

  return (
    <div className="p-6">
      <SimulatorAdmin initialItems={items ?? []} />
    </div>
  );
}
