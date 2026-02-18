'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Alert, Badge, Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import type { SimulationParam } from '@/types/database';

type Props = {
  params: SimulationParam[];
  logCount: number;
};

export function SimulationAdmin({ params: initParams, logCount }: Props) {
  const [params, setParams] = useState(initParams);
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  // パラメータをグループ別に整理
  const groups = params.reduce<Record<string, SimulationParam[]>>((acc, p) => {
    if (!acc[p.param_group]) acc[p.param_group] = [];
    acc[p.param_group].push(p);
    return acc;
  }, {});

  const updateParam = async (param: SimulationParam, newValue: string) => {
    setSaving(param.id);
    const supabase = createClient();
    let value: unknown = newValue;
    try { value = JSON.parse(newValue); } catch { value = newValue; }

    await supabase.from('simulation_params').update({ value }).eq('id', param.id);

    setParams(params.map((p) => p.id === param.id ? { ...p, value } : p));
    setSaving(null);
    setMessage(`${param.label} を更新しました`);
  };

  const groupLabels: Record<string, string> = {
    cost: 'コスト係数',
    risk: 'リスク係数',
    timing: '時期パラメータ',
    visa: '在留資格パラメータ',
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">シミュレーション管理</h2>
        <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
          実行回数: {logCount}
        </Badge>
      </div>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}

      <div className="space-y-6">
        {Object.entries(groups).map(([group, groupParams]) => (
          <Card key={group}>
            <CardHeader>
              <CardTitle>{groupLabels[group] || group} ({groupParams.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {groupParams.map((p) => (
                  <div key={p.id} className="flex items-end gap-3">
                    <div className="flex-1">
                      <Input
                        label={`${p.label} (${p.key})`}
                        defaultValue={typeof p.value === 'object' ? JSON.stringify(p.value) : String(p.value)}
                        onBlur={(e) => updateParam(p, e.target.value)}
                      />
                      {p.description && <p className="text-xs text-gray-400 mt-1">{p.description}</p>}
                    </div>
                    {saving === p.id && <span className="text-xs text-blue-500 pb-2">保存中...</span>}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        {params.length === 0 && (
          <p className="text-center text-gray-500 py-12">パラメータが登録されていません。</p>
        )}
      </div>
    </div>
  );
}
