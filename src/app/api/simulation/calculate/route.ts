import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const input = await request.json();
  const { nationality, field, period } = input;

  if (!nationality || !field) {
    return NextResponse.json({ error: 'nationality and field are required' }, { status: 400 });
  }

  // パラメータを取得
  const { data: params } = await supabase
    .from('simulation_params')
    .select('*');

  if (!params || params.length === 0) {
    return NextResponse.json(
      { error: 'Simulation parameters not configured' },
      { status: 500 }
    );
  }

  // パラメータをグループ化
  const paramMap: Record<string, Record<string, { value: unknown; conditions: unknown }>> = {};
  for (const p of params) {
    if (!paramMap[p.param_group]) paramMap[p.param_group] = {};
    paramMap[p.param_group][p.key] = { value: p.value, conditions: p.conditions };
  }

  // コスト計算（パラメータに基づく簡易計算）
  const baseCost = (paramMap.cost?.base_cost?.value as number) || 500000;
  const result = {
    total_cost: baseCost,
    breakdown: {
      recruitment: baseCost * 0.4,
      training: baseCost * 0.2,
      support: baseCost * 0.2,
      administrative: baseCost * 0.2,
    },
    risks: [] as string[],
    notes: [] as string[],
    period: period || 12,
    nationality,
    field,
  };

  // ログ保存
  await supabase
    .from('simulation_logs')
    .insert({
      user_id: user.id,
      input,
      result,
    });

  return NextResponse.json(result);
}
