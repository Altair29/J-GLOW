import { createClient } from '@/lib/supabase/server';
import Navigator from '@/components/business/cost-simulator/CostSimulator';

export const metadata = {
  title: '外国人採用ナビゲーター | J-GLOW',
  description: '業種・条件を入力するだけで最適な在留資格を自動提案。コスト目安もその場で確認できます。',
};

export default async function NavigatorPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <Navigator isLoggedIn={!!user} />
    </div>
  );
}
