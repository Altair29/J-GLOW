'use client';

import { useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import type { SimulatorCostItem } from '@/types/database';

type Props = {
  initialItems: SimulatorCostItem[];
};

const CATEGORY_LABELS: Record<string, string> = {
  initial: '初期費用',
  monthly: '月次費用',
  risk: 'リスクコスト',
};

const VISA_LABELS: Record<string, string> = {
  ikusei: '育成就労',
  tokutei_kaigai: '特定技能（海外）[旧]',
  tokutei_kokunai: '特定技能（国内）[旧]',
  tokutei1_kaigai: '特定技能1号（海外）',
  tokutei1_kokunai: '特定技能1号（国内）',
  tokutei2: '特定技能2号',
  ginou: '技術・人文知識・国際業務',
  student: '留学→就労',
  all: '共通',
};

export function SimulatorAdmin({ initialItems }: Props) {
  const [items, setItems] = useState(initialItems);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<SimulatorCostItem>>({});
  const [addingNew, setAddingNew] = useState(false);
  const [newForm, setNewForm] = useState({
    category: 'initial',
    visa_type: 'all',
    item_key: '',
    label: '',
    amount_min: 0,
    amount_max: 0,
    variable_factor: '',
    sort_order: 0,
  });

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

  const handleEdit = (item: SimulatorCostItem) => {
    setEditingId(item.id);
    setEditForm({ ...item });
  };

  const handleSave = useCallback(async () => {
    if (!editingId || !editForm) return;
    const { error } = await supabase
      .from('simulator_cost_items')
      .update({
        label: editForm.label,
        amount_min: editForm.amount_min,
        amount_max: editForm.amount_max,
        variable_factor: editForm.variable_factor,
        is_active: editForm.is_active,
        sort_order: editForm.sort_order,
      })
      .eq('id', editingId);

    if (!error) {
      setItems((prev) =>
        prev.map((i) => (i.id === editingId ? { ...i, ...editForm } as SimulatorCostItem : i)),
      );
      setEditingId(null);
    }
  }, [supabase, editingId, editForm]);

  const handleToggleActive = useCallback(
    async (id: string, currentActive: boolean) => {
      await supabase.from('simulator_cost_items').update({ is_active: !currentActive }).eq('id', id);
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_active: !currentActive } : i)));
    },
    [supabase],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!confirm('この項目を削除しますか？')) return;
      await supabase.from('simulator_cost_items').delete().eq('id', id);
      setItems((prev) => prev.filter((i) => i.id !== id));
    },
    [supabase],
  );

  const handleAddNew = useCallback(async () => {
    if (!newForm.item_key || !newForm.label) return;
    const { data, error } = await supabase
      .from('simulator_cost_items')
      .insert(newForm)
      .select()
      .single();

    if (!error && data) {
      setItems((prev) => [...prev, data as SimulatorCostItem]);
      setAddingNew(false);
      setNewForm({
        category: 'initial',
        visa_type: 'all',
        item_key: '',
        label: '',
        amount_min: 0,
        amount_max: 0,
        variable_factor: '',
        sort_order: 0,
      });
    }
  }, [supabase, newForm]);

  const grouped = ['initial', 'monthly', 'risk'].map((cat) => ({
    category: cat,
    label: CATEGORY_LABELS[cat],
    items: items.filter((i) => i.category === cat),
  }));

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">シミュレーター コスト項目管理</h1>
        <button
          onClick={() => setAddingNew(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700"
        >
          + 新規追加
        </button>
      </div>

      {/* 新規追加フォーム */}
      {addingNew && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
          <h3 className="font-medium text-blue-800">新規コスト項目</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input
              type="text"
              value={newForm.item_key}
              onChange={(e) => setNewForm((p) => ({ ...p, item_key: e.target.value }))}
              placeholder="item_key"
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="text"
              value={newForm.label}
              onChange={(e) => setNewForm((p) => ({ ...p, label: e.target.value }))}
              placeholder="ラベル"
              className="px-3 py-2 border rounded text-sm"
            />
            <select
              value={newForm.category}
              onChange={(e) => setNewForm((p) => ({ ...p, category: e.target.value }))}
              className="px-3 py-2 border rounded text-sm bg-white"
            >
              <option value="initial">初期費用</option>
              <option value="monthly">月次費用</option>
              <option value="risk">リスクコスト</option>
            </select>
            <select
              value={newForm.visa_type}
              onChange={(e) => setNewForm((p) => ({ ...p, visa_type: e.target.value }))}
              className="px-3 py-2 border rounded text-sm bg-white"
            >
              <option value="all">共通</option>
              <option value="ikusei">育成就労</option>
              <option value="tokutei1_kaigai">特定技能1号（海外）</option>
              <option value="tokutei1_kokunai">特定技能1号（国内）</option>
              <option value="tokutei2">特定技能2号</option>
              <option value="ginou">技術・人文知識・国際業務</option>
              <option value="student">留学→就労</option>
            </select>
            <input
              type="number"
              value={newForm.amount_min}
              onChange={(e) => setNewForm((p) => ({ ...p, amount_min: Number(e.target.value) }))}
              placeholder="最小金額"
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="number"
              value={newForm.amount_max}
              onChange={(e) => setNewForm((p) => ({ ...p, amount_max: Number(e.target.value) }))}
              placeholder="最大金額"
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="text"
              value={newForm.variable_factor}
              onChange={(e) => setNewForm((p) => ({ ...p, variable_factor: e.target.value }))}
              placeholder="変動要因"
              className="px-3 py-2 border rounded text-sm"
            />
            <input
              type="number"
              value={newForm.sort_order}
              onChange={(e) => setNewForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
              placeholder="表示順"
              className="px-3 py-2 border rounded text-sm"
            />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAddNew} className="px-4 py-2 bg-blue-600 text-white rounded text-sm">追加</button>
            <button onClick={() => setAddingNew(false)} className="px-4 py-2 text-gray-500 rounded text-sm">キャンセル</button>
          </div>
        </div>
      )}

      {/* カテゴリ別テーブル */}
      {grouped.map(({ category, label, items: catItems }) => (
        <div key={category}>
          <h2 className="text-lg font-bold text-gray-700 mb-3">{label}</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-3 py-2 text-left">item_key</th>
                  <th className="px-3 py-2 text-left">ラベル</th>
                  <th className="px-3 py-2 text-left">在留資格</th>
                  <th className="px-3 py-2 text-right">最小</th>
                  <th className="px-3 py-2 text-right">最大</th>
                  <th className="px-3 py-2 text-left">変動要因</th>
                  <th className="px-3 py-2 text-center">順序</th>
                  <th className="px-3 py-2 text-center">状態</th>
                  <th className="px-3 py-2 text-center">操作</th>
                </tr>
              </thead>
              <tbody>
                {catItems.map((item) => (
                  <tr key={item.id} className={`border-t ${!item.is_active ? 'opacity-40' : ''}`}>
                    {editingId === item.id ? (
                      <>
                        <td className="px-3 py-2 font-mono text-xs">{item.item_key}</td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={editForm.label ?? ''}
                            onChange={(e) => setEditForm((p) => ({ ...p, label: e.target.value }))}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2 text-xs">{VISA_LABELS[item.visa_type]}</td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={editForm.amount_min ?? 0}
                            onChange={(e) => setEditForm((p) => ({ ...p, amount_min: Number(e.target.value) }))}
                            className="w-20 px-2 py-1 border rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={editForm.amount_max ?? 0}
                            onChange={(e) => setEditForm((p) => ({ ...p, amount_max: Number(e.target.value) }))}
                            className="w-20 px-2 py-1 border rounded text-sm text-right"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="text"
                            value={editForm.variable_factor ?? ''}
                            onChange={(e) => setEditForm((p) => ({ ...p, variable_factor: e.target.value }))}
                            className="w-full px-2 py-1 border rounded text-sm"
                          />
                        </td>
                        <td className="px-3 py-2">
                          <input
                            type="number"
                            value={editForm.sort_order ?? 0}
                            onChange={(e) => setEditForm((p) => ({ ...p, sort_order: Number(e.target.value) }))}
                            className="w-16 px-2 py-1 border rounded text-sm text-center"
                          />
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => setEditForm((p) => ({ ...p, is_active: !p.is_active }))}
                            className={`px-2 py-1 rounded text-xs ${editForm.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                          >
                            {editForm.is_active ? 'ON' : 'OFF'}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={handleSave} className="text-blue-600 text-xs mr-2">保存</button>
                          <button onClick={() => setEditingId(null)} className="text-gray-400 text-xs">取消</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-3 py-2 font-mono text-xs">{item.item_key}</td>
                        <td className="px-3 py-2">{item.label}</td>
                        <td className="px-3 py-2 text-xs">{VISA_LABELS[item.visa_type]}</td>
                        <td className="px-3 py-2 text-right font-mono">¥{item.amount_min.toLocaleString()}</td>
                        <td className="px-3 py-2 text-right font-mono">¥{item.amount_max.toLocaleString()}</td>
                        <td className="px-3 py-2 text-xs text-gray-500">{item.variable_factor}</td>
                        <td className="px-3 py-2 text-center">{item.sort_order}</td>
                        <td className="px-3 py-2 text-center">
                          <button
                            onClick={() => handleToggleActive(item.id, item.is_active)}
                            className={`px-2 py-1 rounded text-xs ${item.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                          >
                            {item.is_active ? 'ON' : 'OFF'}
                          </button>
                        </td>
                        <td className="px-3 py-2 text-center">
                          <button onClick={() => handleEdit(item)} className="text-blue-600 text-xs mr-2">編集</button>
                          <button onClick={() => handleDelete(item.id)} className="text-red-400 text-xs">削除</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}
