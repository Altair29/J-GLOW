import { redirect } from 'next/navigation';

export const metadata = {
  title: '採用計画コストシミュレーター | J-GLOW',
  description: '在留資格別の採用コストを試算・比較。',
};

export default function HiringGuideCostSimulatorRedirect() {
  redirect('/business/cost-simulator');
}
