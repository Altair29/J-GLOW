'use client';

import { useState, useCallback } from 'react';
import type { SimulatorCostItem, SimulatorOrgPreset, SimulatorCustomItem } from '@/types/database';

type Props = {
  masterItems: SimulatorCostItem[];
  preset: SimulatorOrgPreset;
  onUpdate: (customItems: SimulatorCustomItem[], removedKeys: string[]) => void;
};

export function CustomizePanel({ masterItems, preset, onUpdate }: Props) {
  const [customItems, setCustomItems] = useState<SimulatorCustomItem[]>(preset.custom_items);
  const [removedKeys, setRemovedKeys] = useState<string[]>(preset.removed_item_keys);
  const [addingNew, setAddingNew] = useState(false);
  const [newItem, setNewItem] = useState({
    label: '',
    amount_min: 0,
    amount_max: 0,
    category: 'initial' as SimulatorCustomItem['category'],
    visa_type: 'all' as SimulatorCustomItem['visa_type'],
  });

  const customMap = new Map(customItems.map((c) => [c.item_key, c]));

  // 有効な項目一覧を構築
  const allItems = masterItems
    .filter((i) => !removedKeys.includes(i.item_key))
    .map((item) => {
      const custom = customMap.get(item.item_key);
      if (custom) {
        return {
          ...item,
          label: custom.label,
          amount_min: custom.amount_min,
          amount_max: custom.amount_max,
          is_active: custom.is_active,
          isCustomized: true,
        };
      }
      return { ...item, isCustomized: false };
    });

  // カスタム追加項目（マスタにないもの）
  const addedItems = customItems
    .filter((c) => !masterItems.some((m) => m.item_key === c.item_key))
    .map((c) => ({ ...c, id: `custom-${c.item_key}`, isCustomized: true, isAdded: true }));

  const commitChanges = useCallback(
    (items: SimulatorCustomItem[], removed: string[]) => {
      setCustomItems(items);
      setRemovedKeys(removed);
      onUpdate(items, removed);
    },
    [onUpdate],
  );

  const handleToggle = (itemKey: string, currentActive: boolean) => {
    const existing = customItems.find((c) => c.item_key === itemKey);
    const master = masterItems.find((m) => m.item_key === itemKey);
    if (existing) {
      const updated = customItems.map((c) =>
        c.item_key === itemKey ? { ...c, is_active: !currentActive } : c,
      );
      commitChanges(updated, removedKeys);
    } else if (master) {
      const updated = [
        ...customItems,
        {
          item_key: master.item_key,
          label: master.label,
          amount_min: master.amount_min,
          amount_max: master.amount_max,
          category: master.category as SimulatorCustomItem['category'],
          visa_type: master.visa_type as SimulatorCustomItem['visa_type'],
          is_active: !currentActive,
          sort_order: master.sort_order,
        },
      ];
      commitChanges(updated, removedKeys);
    }
  };

  const handleAmountChange = (itemKey: string, field: 'amount_min' | 'amount_max', value: number) => {
    const existing = customItems.find((c) => c.item_key === itemKey);
    const master = masterItems.find((m) => m.item_key === itemKey);
    if (existing) {
      const updated = customItems.map((c) =>
        c.item_key === itemKey ? { ...c, [field]: value } : c,
      );
      commitChanges(updated, removedKeys);
    } else if (master) {
      const updated = [
        ...customItems,
        {
          item_key: master.item_key,
          label: master.label,
          amount_min: field === 'amount_min' ? value : master.amount_min,
          amount_max: field === 'amount_max' ? value : master.amount_max,
          category: master.category as SimulatorCustomItem['category'],
          visa_type: master.visa_type as SimulatorCustomItem['visa_type'],
          is_active: true,
          sort_order: master.sort_order,
        },
      ];
      commitChanges(updated, removedKeys);
    }
  };

  const handleLabelChange = (itemKey: string, label: string) => {
    const existing = customItems.find((c) => c.item_key === itemKey);
    const master = masterItems.find((m) => m.item_key === itemKey);
    if (existing) {
      const updated = customItems.map((c) =>
        c.item_key === itemKey ? { ...c, label } : c,
      );
      commitChanges(updated, removedKeys);
    } else if (master) {
      const updated = [
        ...customItems,
        {
          item_key: master.item_key,
          label,
          amount_min: master.amount_min,
          amount_max: master.amount_max,
          category: master.category as SimulatorCustomItem['category'],
          visa_type: master.visa_type as SimulatorCustomItem['visa_type'],
          is_active: true,
          sort_order: master.sort_order,
        },
      ];
      commitChanges(updated, removedKeys);
    }
  };

  const handleRemove = (itemKey: string) => {
    const isAdded = !masterItems.some((m) => m.item_key === itemKey);
    if (isAdded) {
      const updated = customItems.filter((c) => c.item_key !== itemKey);
      commitChanges(updated, removedKeys);
    } else {
      commitChanges(customItems, [...removedKeys, itemKey]);
    }
  };

  const handleAddNew = () => {
    if (!newItem.label) return;
    const key = `custom_${Date.now()}`;
    const item: SimulatorCustomItem = {
      item_key: key,
      label: newItem.label,
      amount_min: newItem.amount_min,
      amount_max: newItem.amount_max,
      category: newItem.category,
      visa_type: newItem.visa_type,
      is_active: true,
      sort_order: 999,
    };
    commitChanges([...customItems, item], removedKeys);
    setNewItem({ label: '', amount_min: 0, amount_max: 0, category: 'initial', visa_type: 'all' });
    setAddingNew(false);
  };

  const categoryLabels: Record<string, string> = {
    initial: '初期費用',
    monthly: '月次費用',
    risk: 'リスクコスト',
  };

  const grouped = ['initial', 'monthly', 'risk'].map((cat) => ({
    category: cat,
    label: categoryLabels[cat],
    items: [...allItems, ...addedItems].filter((i) => i.category === cat),
  }));

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">
        金額の上書き・項目の追加/削除・ラベル変更ができます。変更はプリセットに自動保存されます。
      </p>

      {grouped.map(({ category, label, items }) => (
        <div key={category} className="border rounded-lg overflow-hidden">
          <div className="bg-gray-50 px-4 py-2 font-medium text-sm text-[#1a2f5e]">{label}</div>
          <div className="divide-y">
            {items.map((item) => (
              <div key={item.item_key} className={`p-3 flex flex-wrap items-center gap-2 text-sm ${!item.is_active ? 'opacity-50' : ''}`}>
                <button
                  onClick={() => handleToggle(item.item_key, item.is_active)}
                  className={`w-5 h-5 rounded border flex items-center justify-center text-xs ${
                    item.is_active ? 'bg-[#1a2f5e] border-[#1a2f5e] text-white' : 'border-gray-300'
                  }`}
                >
                  {item.is_active ? '✓' : ''}
                </button>
                <input
                  type="text"
                  value={item.label}
                  onChange={(e) => handleLabelChange(item.item_key, e.target.value)}
                  className="flex-1 min-w-[120px] px-2 py-1 border border-gray-200 rounded text-sm"
                />
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-400">¥</span>
                  <input
                    type="number"
                    value={item.amount_min}
                    onChange={(e) => handleAmountChange(item.item_key, 'amount_min', Number(e.target.value))}
                    className="w-24 px-2 py-1 border border-gray-200 rounded text-sm text-right font-mono"
                  />
                  <span className="text-xs text-gray-400">〜</span>
                  <input
                    type="number"
                    value={item.amount_max}
                    onChange={(e) => handleAmountChange(item.item_key, 'amount_max', Number(e.target.value))}
                    className="w-24 px-2 py-1 border border-gray-200 rounded text-sm text-right font-mono"
                  />
                </div>
                <button
                  onClick={() => handleRemove(item.item_key)}
                  className="text-red-400 hover:text-red-600 text-xs px-1"
                  title="削除"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}

      {/* 新規追加 */}
      {addingNew ? (
        <div className="border rounded-lg p-4 space-y-3 bg-blue-50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={newItem.label}
              onChange={(e) => setNewItem((p) => ({ ...p, label: e.target.value }))}
              placeholder="項目名"
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
            <select
              value={newItem.category}
              onChange={(e) => setNewItem((p) => ({ ...p, category: e.target.value as SimulatorCustomItem['category'] }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="initial">初期費用</option>
              <option value="monthly">月次費用</option>
              <option value="risk">リスクコスト</option>
            </select>
            <div className="flex items-center gap-2">
              <span className="text-xs">¥</span>
              <input
                type="number"
                value={newItem.amount_min}
                onChange={(e) => setNewItem((p) => ({ ...p, amount_min: Number(e.target.value) }))}
                placeholder="最小"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
              <span className="text-xs">〜</span>
              <input
                type="number"
                value={newItem.amount_max}
                onChange={(e) => setNewItem((p) => ({ ...p, amount_max: Number(e.target.value) }))}
                placeholder="最大"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
            <select
              value={newItem.visa_type}
              onChange={(e) => setNewItem((p) => ({ ...p, visa_type: e.target.value as SimulatorCustomItem['visa_type'] }))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm bg-white"
            >
              <option value="all">全在留資格共通</option>
              <option value="ikusei">育成就労のみ</option>
              <option value="tokutei_kaigai">特定技能（海外）のみ</option>
              <option value="tokutei_kokunai">特定技能（国内）のみ</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAddNew}
              disabled={!newItem.label}
              className="px-4 py-2 bg-[#1a2f5e] text-white rounded-lg text-sm disabled:opacity-50"
            >
              追加
            </button>
            <button
              onClick={() => setAddingNew(false)}
              className="px-4 py-2 text-gray-500 hover:bg-gray-100 rounded-lg text-sm"
            >
              キャンセル
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAddingNew(true)}
          className="text-sm text-[#1a2f5e] hover:underline font-medium"
        >
          + 項目を追加
        </button>
      )}
    </div>
  );
}
