import { createClient } from '@/lib/supabase/server';
import { SimulationGame } from './SimulationGame';

export default async function SimulationPage() {
  const supabase = await createClient();

  const [
    { data: cards },
    { data: configRows },
    { data: { user } },
  ] = await Promise.all([
    supabase
      .from('simulation_cards')
      .select('*, simulation_effects(*)')
      .eq('is_active', true)
      .order('turn_order'),
    supabase
      .from('simulation_config')
      .select('*'),
    supabase.auth.getUser(),
  ]);

  const config: Record<string, unknown> = {};
  for (const row of configRows ?? []) {
    config[row.key] = row.value;
  }

  const isGuest = !user;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-4">
      <SimulationGame
        cards={cards ?? []}
        config={config}
        isGuest={isGuest}
      />
    </div>
  );
}
