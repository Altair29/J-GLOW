'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Alert, Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import type { SimulationCardWithEffects, SimulationConfig, GaugeType } from '@/types/database';

type Props = {
  cards: SimulationCardWithEffects[];
  configs: SimulationConfig[];
};

const GAUGE_OPTIONS: GaugeType[] = ['operation', 'morale', 'compliance'];
const GAUGE_LABELS: Record<string, string> = {
  operation: '稼働力',
  morale: '士気',
  compliance: 'コンプライアンス',
};

type CardFormData = {
  turn_order: number;
  situation: string;
  yes_label: string;
  no_label: string;
  is_active: boolean;
};

type EffectFormData = {
  id?: string;
  choice: 'yes' | 'no';
  gauge: GaugeType;
  delta: number;
  delay_turn: number | null;
  delay_delta: number | null;
  delay_gauge: string | null;
  delay_message: string | null;
};

function ConfigEditor({ configs: initConfigs }: { configs: SimulationConfig[] }) {
  const [configs, setConfigs] = useState(initConfigs);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const updateConfig = async (id: string, value: string) => {
    setSaving(true);
    const supabase = createClient();
    let parsed: unknown = value;
    try { parsed = JSON.parse(value); } catch { parsed = value; }
    await supabase.from('simulation_config').update({ value: parsed }).eq('id', id);
    setConfigs(configs.map((c) => c.id === id ? { ...c, value: parsed } : c));
    setSaving(false);
    setMessage('設定を更新しました');
    setTimeout(() => setMessage(''), 3000);
  };

  const configLabels: Record<string, string> = {
    initial_gauges: '初期ゲージ値 (JSON)',
    guest_max_turns: 'ゲスト最大ターン数',
    total_turns: '総ターン数',
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>シミュレーション設定</CardTitle>
      </CardHeader>
      <CardContent>
        {message && <Alert variant="success" className="mb-4">{message}</Alert>}
        <div className="space-y-4">
          {configs.map((c) => (
            <div key={c.id}>
              <Input
                label={configLabels[c.key] || c.key}
                defaultValue={typeof c.value === 'object' ? JSON.stringify(c.value) : String(c.value)}
                onBlur={(e) => updateConfig(c.id, e.target.value)}
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

function EffectRow({ effect, onUpdate, onDelete }: {
  effect: EffectFormData & { id?: string };
  onUpdate: (data: EffectFormData) => void;
  onDelete: () => void;
}) {
  return (
    <div className="grid grid-cols-12 gap-2 items-end border-b border-gray-100 pb-2">
      <div className="col-span-2">
        <label className="text-xs text-gray-500">選択</label>
        <select
          value={effect.choice}
          onChange={(e) => onUpdate({ ...effect, choice: e.target.value as 'yes' | 'no' })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        >
          <option value="yes">YES</option>
          <option value="no">NO</option>
        </select>
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-500">ゲージ</label>
        <select
          value={effect.gauge}
          onChange={(e) => onUpdate({ ...effect, gauge: e.target.value as GaugeType })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        >
          {GAUGE_OPTIONS.map((g) => (
            <option key={g} value={g}>{GAUGE_LABELS[g]}</option>
          ))}
        </select>
      </div>
      <div className="col-span-1">
        <label className="text-xs text-gray-500">変動</label>
        <input
          type="number"
          value={effect.delta}
          onChange={(e) => onUpdate({ ...effect, delta: Number(e.target.value) })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="col-span-1">
        <label className="text-xs text-gray-500">遅延T</label>
        <input
          type="number"
          value={effect.delay_turn ?? ''}
          onChange={(e) => onUpdate({ ...effect, delay_turn: e.target.value ? Number(e.target.value) : null })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="col-span-1">
        <label className="text-xs text-gray-500">遅延値</label>
        <input
          type="number"
          value={effect.delay_delta ?? ''}
          onChange={(e) => onUpdate({ ...effect, delay_delta: e.target.value ? Number(e.target.value) : null })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-500">遅延ゲージ</label>
        <select
          value={effect.delay_gauge ?? ''}
          onChange={(e) => onUpdate({ ...effect, delay_gauge: e.target.value || null })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        >
          <option value="">-</option>
          {GAUGE_OPTIONS.map((g) => (
            <option key={g} value={g}>{GAUGE_LABELS[g]}</option>
          ))}
        </select>
      </div>
      <div className="col-span-2">
        <label className="text-xs text-gray-500">遅延メッセージ</label>
        <input
          type="text"
          value={effect.delay_message ?? ''}
          onChange={(e) => onUpdate({ ...effect, delay_message: e.target.value || null })}
          className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm"
        />
      </div>
      <div className="col-span-1">
        <button onClick={onDelete} className="text-red-500 hover:text-red-700 text-xs py-1.5">
          削除
        </button>
      </div>
    </div>
  );
}

function CardEditor({ card, onSaved, onDeleted }: {
  card: SimulationCardWithEffects;
  onSaved: (c: SimulationCardWithEffects) => void;
  onDeleted: (id: string) => void;
}) {
  const [form, setForm] = useState<CardFormData>({
    turn_order: card.turn_order,
    situation: card.situation,
    yes_label: card.yes_label,
    no_label: card.no_label,
    is_active: card.is_active,
  });
  const [effects, setEffects] = useState<EffectFormData[]>(
    card.simulation_effects.map((e) => ({
      id: e.id,
      choice: e.choice,
      gauge: e.gauge,
      delta: e.delta,
      delay_turn: e.delay_turn,
      delay_delta: e.delay_delta,
      delay_gauge: e.delay_gauge,
      delay_message: e.delay_message,
    }))
  );
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  const save = async () => {
    setSaving(true);
    const supabase = createClient();

    // Update card
    await supabase.from('simulation_cards').update({
      turn_order: form.turn_order,
      situation: form.situation,
      yes_label: form.yes_label,
      no_label: form.no_label,
      is_active: form.is_active,
    }).eq('id', card.id);

    // Delete existing effects and re-insert
    await supabase.from('simulation_effects').delete().eq('card_id', card.id);
    if (effects.length > 0) {
      await supabase.from('simulation_effects').insert(
        effects.map((e) => ({
          card_id: card.id,
          choice: e.choice,
          gauge: e.gauge,
          delta: e.delta,
          delay_turn: e.delay_turn,
          delay_delta: e.delay_delta,
          delay_gauge: e.delay_gauge,
          delay_message: e.delay_message,
        }))
      );
    }

    // Re-fetch
    const { data } = await supabase
      .from('simulation_cards')
      .select('*, simulation_effects(*)')
      .eq('id', card.id)
      .single();

    if (data) onSaved(data);
    setSaving(false);
    setMessage('保存しました');
    setTimeout(() => setMessage(''), 3000);
  };

  const deleteCard = async () => {
    if (!confirm('このカードを削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('simulation_cards').delete().eq('id', card.id);
    onDeleted(card.id);
  };

  const addEffect = () => {
    setEffects([...effects, {
      choice: 'yes',
      gauge: 'operation',
      delta: 0,
      delay_turn: null,
      delay_delta: null,
      delay_gauge: null,
      delay_message: null,
    }]);
  };

  return (
    <div className="border border-gray-200 rounded-lg">
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-50"
      >
        <div className="flex items-center gap-3">
          <span className="text-sm font-mono text-gray-400">#{form.turn_order}</span>
          <span className="text-sm font-medium text-gray-900 line-clamp-1">{form.situation.slice(0, 60)}...</span>
          {!form.is_active && (
            <span className="text-xs bg-gray-200 text-gray-600 px-2 py-0.5 rounded">無効</span>
          )}
        </div>
        <span className="text-gray-400">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100">
          {message && <Alert variant="success" className="mt-3">{message}</Alert>}

          <div className="grid grid-cols-2 gap-4 mt-3">
            <Input
              label="ターン順"
              type="number"
              value={form.turn_order}
              onChange={(e) => setForm({ ...form, turn_order: Number(e.target.value) })}
            />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  className="rounded"
                />
                有効
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">シチュエーション</label>
            <textarea
              value={form.situation}
              onChange={(e) => setForm({ ...form, situation: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="YES ラベル"
              value={form.yes_label}
              onChange={(e) => setForm({ ...form, yes_label: e.target.value })}
            />
            <Input
              label="NO ラベル"
              value={form.no_label}
              onChange={(e) => setForm({ ...form, no_label: e.target.value })}
            />
          </div>

          {/* Effects */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-sm font-medium text-gray-700">ゲージ効果</h4>
              <button onClick={addEffect} className="text-xs text-blue-600 hover:text-blue-800">+ 追加</button>
            </div>
            <div className="space-y-2">
              {effects.map((eff, i) => (
                <EffectRow
                  key={i}
                  effect={eff}
                  onUpdate={(data) => {
                    const next = [...effects];
                    next[i] = data;
                    setEffects(next);
                  }}
                  onDelete={() => setEffects(effects.filter((_, j) => j !== i))}
                />
              ))}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <Button onClick={save} loading={saving} size="sm">保存</Button>
            <Button onClick={deleteCard} variant="danger" size="sm">削除</Button>
          </div>
        </div>
      )}
    </div>
  );
}

function NewCardForm({ onCreated }: { onCreated: (c: SimulationCardWithEffects) => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<CardFormData>({
    turn_order: 1,
    situation: '',
    yes_label: '',
    no_label: '',
    is_active: true,
  });
  const [saving, setSaving] = useState(false);

  const create = async () => {
    if (!form.situation || !form.yes_label || !form.no_label) return;
    setSaving(true);
    const supabase = createClient();
    const { data } = await supabase
      .from('simulation_cards')
      .insert({
        turn_order: form.turn_order,
        situation: form.situation,
        yes_label: form.yes_label,
        no_label: form.no_label,
        is_active: form.is_active,
      })
      .select('*, simulation_effects(*)')
      .single();

    if (data) {
      onCreated(data);
      setForm({ turn_order: 1, situation: '', yes_label: '', no_label: '', is_active: true });
      setOpen(false);
    }
    setSaving(false);
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)} variant="outline" size="sm">
        + 新規カード追加
      </Button>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>新規カード追加</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Input
            label="ターン順"
            type="number"
            value={form.turn_order}
            onChange={(e) => setForm({ ...form, turn_order: Number(e.target.value) })}
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">シチュエーション</label>
            <textarea
              value={form.situation}
              onChange={(e) => setForm({ ...form, situation: e.target.value })}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="YES ラベル"
              value={form.yes_label}
              onChange={(e) => setForm({ ...form, yes_label: e.target.value })}
            />
            <Input
              label="NO ラベル"
              value={form.no_label}
              onChange={(e) => setForm({ ...form, no_label: e.target.value })}
            />
          </div>
          <div className="flex gap-2">
            <Button onClick={create} loading={saving} size="sm">作成</Button>
            <Button onClick={() => setOpen(false)} variant="ghost" size="sm">キャンセル</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function SimulationCardAdmin({ cards: initCards, configs }: Props) {
  const [cards, setCards] = useState(initCards);

  const handleSaved = (updated: SimulationCardWithEffects) => {
    setCards(cards.map((c) => c.id === updated.id ? updated : c).sort((a, b) => a.turn_order - b.turn_order));
  };

  const handleDeleted = (id: string) => {
    setCards(cards.filter((c) => c.id !== id));
  };

  const handleCreated = (created: SimulationCardWithEffects) => {
    setCards([...cards, created].sort((a, b) => a.turn_order - b.turn_order));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">外国人雇用シミュレーション管理</h2>
        <span className="text-sm text-gray-500">{cards.length} カード</span>
      </div>

      <ConfigEditor configs={configs} />

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>シナリオカード一覧</CardTitle>
            <NewCardForm onCreated={handleCreated} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {cards.map((card) => (
              <CardEditor
                key={card.id}
                card={card}
                onSaved={handleSaved}
                onDeleted={handleDeleted}
              />
            ))}
            {cards.length === 0 && (
              <p className="text-center text-gray-500 py-8">カードが登録されていません</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
