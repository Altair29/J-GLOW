import { createClient } from '@/lib/supabase/server';
import { CostSimulatorShell } from './components/CostSimulatorShell';
import type { SimulatorCostItem, SimulatorOrgPreset, SimulatorSession } from '@/types/database';

export const metadata = {
  title: '採用計画コストシミュレーター | J-GLOW',
  description: '在留資格別の採用コストを試算・比較。監理団体・登録支援機関のブランドで提案書PDFを作成できます。',
};

export default async function CostSimulatorNewPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const params = await searchParams;
  const isLoggedIn = !!user;

  // コスト項目マスタ取得
  const { data: costItems } = await supabase
    .from('simulator_cost_items')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');

  // ユーザーのプリセット取得（ログイン時のみ）
  let presets: SimulatorOrgPreset[] = [];
  if (user) {
    const { data } = await supabase
      .from('simulator_org_presets')
      .select('*')
      .eq('user_id', user.id)
      .order('updated_at', { ascending: false });
    presets = (data ?? []) as SimulatorOrgPreset[];
  }

  // 共有トークンからセッション復元
  let sharedSession: SimulatorSession | null = null;
  if (params.token) {
    const { data } = await supabase
      .from('simulator_sessions')
      .select('*')
      .eq('share_token', params.token)
      .single();
    sharedSession = data;
  }

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <CostSimulatorShell
        costItems={(costItems ?? []) as SimulatorCostItem[]}
        presets={presets}
        userId={user?.id ?? null}
        isLoggedIn={isLoggedIn}
        sharedSession={sharedSession}
      />
    </div>
  );
}
