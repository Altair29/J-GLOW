'use client';

import { useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Alert, Card, CardHeader, CardTitle, CardContent } from '@/components/shared';

// ==========================================
// 型定義
// ==========================================

type MsimCategory =
  | 'compliance' | 'cost' | 'field_issue' | 'life_support'
  | 'relations' | 'neighbor' | 'positive' | 'government' | 'retention';

type DelayedEffect = {
  id?: string;
  delay_turns: number;
  cost_delta: number;
  compliance_delta: number;
  morale_delta: number;
  productivity_delta: number;
  retention_delta: number;
  message: string;
};

type Choice = {
  id?: string;
  sort_order: number;
  label: string;
  description: string;
  cost_delta: number;
  compliance_delta: number;
  morale_delta: number;
  productivity_delta: number;
  retention_delta: number;
  outcome_text: string;
  learning_point: string;
  msim_delayed_effects: DelayedEffect[];
};

type Scenario = {
  id: string;
  category: MsimCategory;
  title: string;
  situation: string;
  detail: string | null;
  icon: string | null;
  industries: string[];
  visa_types: string[];
  phase_min: number;
  phase_max: number;
  weight: number;
  is_active: boolean;
  sort_order: number;
  msim_choices: Choice[];
};

type ConfigRow = {
  id: string;
  key: string;
  value: unknown;
  description: string | null;
};

const CATEGORY_OPTIONS: { value: MsimCategory; label: string }[] = [
  { value: 'compliance', label: 'コンプライアンス' },
  { value: 'cost', label: 'コスト管理' },
  { value: 'field_issue', label: '現場課題' },
  { value: 'life_support', label: '生活支援' },
  { value: 'relations', label: '人間関係' },
  { value: 'neighbor', label: '地域連携' },
  { value: 'positive', label: 'ポジティブ' },
  { value: 'government', label: '行政対応' },
  { value: 'retention', label: '定着・離職' },
];

type Props = {
  scenarios: Scenario[];
  configs: ConfigRow[];
};

// ==========================================
// メインコンポーネント
// ==========================================

export default function ManagementSimAdmin({ scenarios: initScenarios, configs }: Props) {
  const [scenarios, setScenarios] = useState(initScenarios);
  const [tab, setTab] = useState<'scenarios' | 'config'>('scenarios');

  const handleSaved = useCallback((updated: Scenario) => {
    setScenarios((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
  }, []);

  const handleCreated = useCallback((created: Scenario) => {
    setScenarios((prev) => [...prev, created]);
  }, []);

  const handleDeleted = useCallback((id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return (
    <div className="space-y-6">
      {/* タブ切替 */}
      <div className="flex gap-2">
        <button
          onClick={() => setTab('scenarios')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'scenarios' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          シナリオ管理（{scenarios.length}件）
        </button>
        <button
          onClick={() => setTab('config')}
          className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
            tab === 'config' ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
          }`}
        >
          ゲーム設定
        </button>
      </div>

      {tab === 'scenarios' && (
        <div className="space-y-4">
          <NewScenarioForm onCreated={handleCreated} />
          {scenarios
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((scenario) => (
              <ScenarioEditor
                key={scenario.id}
                scenario={scenario}
                onSaved={handleSaved}
                onDeleted={handleDeleted}
              />
            ))}
        </div>
      )}

      {tab === 'config' && <ConfigEditor configs={configs} />}
    </div>
  );
}

// ==========================================
// 設定エディタ
// ==========================================

function ConfigEditor({ configs: initConfigs }: { configs: ConfigRow[] }) {
  const [configs, setConfigs] = useState(initConfigs);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateConfig = async (id: string, value: string) => {
    setSaving(true);
    const supabase = createClient();
    let parsed: unknown = value;
    try { parsed = JSON.parse(value); } catch { parsed = value; }
    await supabase.from('msim_config').update({ value: parsed }).eq('id', id);
    setConfigs(configs.map((c) => (c.id === id ? { ...c, value: parsed } : c)));
    setSaving(false);
    setMessage('設定を更新しました');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <Card>
      <CardHeader><CardTitle>ゲーム設定</CardTitle></CardHeader>
      <CardContent>
        {message && <Alert variant="success" className="mb-4">{message}</Alert>}
        <div className="space-y-4">
          {configs.map((c) => (
            <div key={c.id}>
              <Input
                label={c.key}
                defaultValue={typeof c.value === 'object' ? JSON.stringify(c.value) : String(c.value)}
                onBlur={(e) => updateConfig(c.id, (e.target as HTMLInputElement).value)}
              />
              {c.description && <p className="text-xs text-gray-400 mt-1">{c.description}</p>}
            </div>
          ))}
        </div>
        {saving && <p className="text-xs text-blue-500 mt-2">保存中...</p>}
      </CardContent>
    </Card>
  );
}

// ==========================================
// シナリオエディタ
// ==========================================

function ScenarioEditor({
  scenario,
  onSaved,
  onDeleted,
}: {
  scenario: Scenario;
  onSaved: (s: Scenario) => void;
  onDeleted: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    category: scenario.category,
    title: scenario.title,
    situation: scenario.situation,
    detail: scenario.detail ?? '',
    icon: scenario.icon ?? '',
    industries: scenario.industries.join(', '),
    visa_types: scenario.visa_types.join(', '),
    phase_min: scenario.phase_min,
    phase_max: scenario.phase_max,
    weight: scenario.weight,
    is_active: scenario.is_active,
    sort_order: scenario.sort_order,
  });
  const [choices, setChoices] = useState<Choice[]>(scenario.msim_choices);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setSaving(true);
    setError('');
    const supabase = createClient();

    // シナリオ更新
    const { error: scenarioError } = await supabase
      .from('msim_scenarios')
      .update({
        category: form.category,
        title: form.title,
        situation: form.situation,
        detail: form.detail || null,
        icon: form.icon || null,
        industries: form.industries ? form.industries.split(',').map((s) => s.trim()).filter(Boolean) : [],
        visa_types: form.visa_types ? form.visa_types.split(',').map((s) => s.trim()).filter(Boolean) : [],
        phase_min: form.phase_min,
        phase_max: form.phase_max,
        weight: form.weight,
        is_active: form.is_active,
        sort_order: form.sort_order,
      })
      .eq('id', scenario.id);

    if (scenarioError) {
      setError(scenarioError.message);
      setSaving(false);
      return;
    }

    // 既存選択肢を削除→再挿入
    await supabase.from('msim_choices').delete().eq('scenario_id', scenario.id);

    for (const choice of choices) {
      const { data: inserted } = await supabase
        .from('msim_choices')
        .insert({
          scenario_id: scenario.id,
          sort_order: choice.sort_order,
          label: choice.label,
          description: choice.description || null,
          cost_delta: choice.cost_delta,
          compliance_delta: choice.compliance_delta,
          morale_delta: choice.morale_delta,
          productivity_delta: choice.productivity_delta,
          retention_delta: choice.retention_delta,
          outcome_text: choice.outcome_text,
          learning_point: choice.learning_point,
        })
        .select()
        .single();

      if (inserted && choice.msim_delayed_effects.length > 0) {
        await supabase.from('msim_delayed_effects').insert(
          choice.msim_delayed_effects.map((e) => ({
            choice_id: inserted.id,
            delay_turns: e.delay_turns,
            cost_delta: e.cost_delta,
            compliance_delta: e.compliance_delta,
            morale_delta: e.morale_delta,
            productivity_delta: e.productivity_delta,
            retention_delta: e.retention_delta,
            message: e.message,
          }))
        );
      }
    }

    // 再取得
    const { data: refreshed } = await supabase
      .from('msim_scenarios')
      .select('*, msim_choices(*, msim_delayed_effects(*))')
      .eq('id', scenario.id)
      .single();

    if (refreshed) {
      onSaved(refreshed as Scenario);
      setChoices(refreshed.msim_choices);
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm(`シナリオ「${scenario.title}」を削除しますか？`)) return;
    const supabase = createClient();
    await supabase.from('msim_scenarios').delete().eq('id', scenario.id);
    onDeleted(scenario.id);
  };

  const addChoice = () => {
    setChoices([
      ...choices,
      {
        sort_order: choices.length + 1,
        label: '',
        description: '',
        cost_delta: 0,
        compliance_delta: 0,
        morale_delta: 0,
        productivity_delta: 0,
        retention_delta: 0,
        outcome_text: '',
        learning_point: '',
        msim_delayed_effects: [],
      },
    ]);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${scenario.is_active ? 'bg-green-500' : 'bg-gray-300'}`} />
            <CardTitle className="text-base">
              {scenario.icon} {scenario.title}
            </CardTitle>
            <span className="text-xs text-gray-400">
              ({scenario.msim_choices.length}択 / {scenario.category})
            </span>
          </div>
          <span className="text-gray-400">{open ? '▲' : '▼'}</span>
        </div>
      </CardHeader>

      {open && (
        <CardContent>
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}

          <div className="grid grid-cols-2 gap-4 mb-6">
            <Input
              label="タイトル"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: (e.target as HTMLInputElement).value })}
            />
            <div>
              <label className="text-xs text-gray-500 block mb-1">カテゴリ</label>
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value as MsimCategory })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Input
                label="状況説明"
                value={form.situation}
                onChange={(e) => setForm({ ...form, situation: (e.target as HTMLInputElement).value })}
              />
            </div>
            <Input
              label="アイコン"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: (e.target as HTMLInputElement).value })}
            />
            <Input
              label="重み（抽選）"
              type="number"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: Number((e.target as HTMLInputElement).value) })}
            />
            <Input
              label="業種（カンマ区切り、空=全業種）"
              value={form.industries}
              onChange={(e) => setForm({ ...form, industries: (e.target as HTMLInputElement).value })}
            />
            <Input
              label="ビザ種別（カンマ区切り、空=全ビザ）"
              value={form.visa_types}
              onChange={(e) => setForm({ ...form, visa_types: (e.target as HTMLInputElement).value })}
            />
            <Input
              label="最小月"
              type="number"
              value={form.phase_min}
              onChange={(e) => setForm({ ...form, phase_min: Number((e.target as HTMLInputElement).value) })}
            />
            <Input
              label="最大月"
              type="number"
              value={form.phase_max}
              onChange={(e) => setForm({ ...form, phase_max: Number((e.target as HTMLInputElement).value) })}
            />
            <Input
              label="表示順"
              type="number"
              value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: Number((e.target as HTMLInputElement).value) })}
            />
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              />
              <label className="text-sm">有効</label>
            </div>
          </div>

          {/* 選択肢エディタ */}
          <h4 className="text-sm font-bold text-gray-700 mb-3">選択肢</h4>
          <div className="space-y-4 mb-4">
            {choices.map((choice, ci) => (
              <div key={ci} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold text-gray-400">選択肢 {ci + 1}</span>
                  <button
                    onClick={() => setChoices(choices.filter((_, i) => i !== ci))}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    削除
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="ラベル"
                    value={choice.label}
                    onChange={(e) => {
                      const updated = [...choices];
                      updated[ci] = { ...updated[ci], label: (e.target as HTMLInputElement).value };
                      setChoices(updated);
                    }}
                  />
                  <Input
                    label="説明"
                    value={choice.description}
                    onChange={(e) => {
                      const updated = [...choices];
                      updated[ci] = { ...updated[ci], description: (e.target as HTMLInputElement).value };
                      setChoices(updated);
                    }}
                  />
                </div>
                <div className="grid grid-cols-5 gap-2 mt-2">
                  {(['cost_delta', 'compliance_delta', 'morale_delta', 'productivity_delta', 'retention_delta'] as const).map((key) => (
                    <Input
                      key={key}
                      label={key.replace('_delta', '')}
                      type="number"
                      value={choice[key]}
                      onChange={(e) => {
                        const updated = [...choices];
                        updated[ci] = { ...updated[ci], [key]: Number((e.target as HTMLInputElement).value) };
                        setChoices(updated);
                      }}
                    />
                  ))}
                </div>
                <div className="mt-2">
                  <Input
                    label="結果テキスト"
                    value={choice.outcome_text}
                    onChange={(e) => {
                      const updated = [...choices];
                      updated[ci] = { ...updated[ci], outcome_text: (e.target as HTMLInputElement).value };
                      setChoices(updated);
                    }}
                  />
                </div>
                <div className="mt-2">
                  <Input
                    label="学習ポイント"
                    value={choice.learning_point}
                    onChange={(e) => {
                      const updated = [...choices];
                      updated[ci] = { ...updated[ci], learning_point: (e.target as HTMLInputElement).value };
                      setChoices(updated);
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" size="sm" onClick={addChoice} className="mb-4">
            + 選択肢を追加
          </Button>

          <div className="flex gap-2 pt-4 border-t border-gray-200">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? '保存中...' : '保存'}
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              削除
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}

// ==========================================
// 新規シナリオ作成
// ==========================================

function NewScenarioForm({ onCreated }: { onCreated: (s: Scenario) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<MsimCategory>('compliance');
  const [situation, setSituation] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleCreate = async () => {
    if (!title || !situation) {
      setError('タイトルと状況説明は必須です');
      return;
    }
    setSaving(true);
    setError('');
    const supabase = createClient();
    const { data, error: insertError } = await supabase
      .from('msim_scenarios')
      .insert({
        category,
        title,
        situation,
        industries: [],
        visa_types: [],
      })
      .select('*, msim_choices(*, msim_delayed_effects(*))')
      .single();

    if (insertError) {
      setError(insertError.message);
    } else if (data) {
      onCreated(data as Scenario);
      setTitle('');
      setSituation('');
      setOpen(false);
    }
    setSaving(false);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between cursor-pointer" onClick={() => setOpen(!open)}>
          <CardTitle className="text-base">+ 新規シナリオ作成</CardTitle>
          <span className="text-gray-400">{open ? '▲' : '▼'}</span>
        </div>
      </CardHeader>
      {open && (
        <CardContent>
          {error && <Alert variant="error" className="mb-4">{error}</Alert>}
          <div className="grid grid-cols-2 gap-4">
            <Input label="タイトル" value={title} onChange={(e) => setTitle((e.target as HTMLInputElement).value)} />
            <div>
              <label className="text-xs text-gray-500 block mb-1">カテゴリ</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as MsimCategory)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                {CATEGORY_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <Input label="状況説明" value={situation} onChange={(e) => setSituation((e.target as HTMLInputElement).value)} />
            </div>
          </div>
          <div className="mt-4">
            <Button onClick={handleCreate} disabled={saving}>
              {saving ? '作成中...' : '作成'}
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
