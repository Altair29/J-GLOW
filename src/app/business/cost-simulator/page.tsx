import { createClient } from '@/lib/supabase/server';
import CostSimulator from '@/components/business/cost-simulator/CostSimulator';

export const metadata = {
  title: '外国人採用ナビゲーター | J-GLOW',
  description: '業種・条件から最適な在留資格を提案し、採用コストをシミュレーションします。',
};

export default async function CostSimulatorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <CostSimulator isLoggedIn={!!user} />
  );
}
