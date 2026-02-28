import { createClient } from '@/lib/supabase/server'
import CostSimulator from '@/components/business/cost-simulator/CostSimulator'

export const metadata = {
  title: '外国人雇用コストシミュレーター | J-GLOW',
  description: '在留資格別の費用試算・比較ができる無料ツール。4ステップで最適な在留資格とコストがわかります。',
}

export default async function CostSimulatorPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return <CostSimulator isLoggedIn={!!user} />
}
