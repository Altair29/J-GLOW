'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { NavigationItem } from '@/types/database';

type Props = {
  section: NavigationItem['section'];
  title?: string;
};

export function NavigationEditor({ section, title }: Props) {
  const [items, setItems] = useState<NavigationItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('navigation_items')
        .select('*')
        .eq('section', section)
        .order('sort_order');
      if (data) setItems(data as NavigationItem[]);
      setLoading(false);
    };
    fetchData();
  }, [section]);

  const handleChange = (id: number, field: string, value: string | boolean | number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: value } : item))
    );
  };

  const handleSaveAll = async () => {
    setSaving(true);
    setMessage('');
    const supabase = createClient();

    for (const item of items) {
      const { error } = await supabase
        .from('navigation_items')
        .update({
          label: item.label,
          href: item.href,
          icon: item.icon,
          sort_order: item.sort_order,
          is_active: item.is_active,
        })
        .eq('id', item.id);

      if (error) {
        setMessage(`エラー: ${error.message}`);
        setSaving(false);
        return;
      }
    }

    setMessage('ナビゲーションを保存しました');
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleAdd = async () => {
    const supabase = createClient();
    const maxOrder = items.reduce((max, i) => Math.max(max, i.sort_order), 0);
    const { data, error } = await supabase
      .from('navigation_items')
      .insert({
        section,
        label: '新しいリンク',
        href: '/',
        sort_order: maxOrder + 1,
      })
      .select()
      .single();

    if (error) {
      setMessage(`エラー: ${error.message}`);
      return;
    }
    if (data) setItems([...items, data as NavigationItem]);
  };

  const handleDelete = async (id: number) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('navigation_items')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage(`エラー: ${error.message}`);
      return;
    }
    setItems(items.filter((i) => i.id !== id));
    setMessage('削除しました');
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="text-gray-500 py-4">読み込み中...</div>;

  return (
    <div className="space-y-4">
      {title && <h4 className="text-md font-semibold text-gray-800">{title}</h4>}

      {message && (
        <div className={`px-4 py-2 rounded-lg text-sm ${message.startsWith('エラー') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-3">
            <input
              type="number"
              value={item.sort_order}
              onChange={(e) => handleChange(item.id, 'sort_order', parseInt(e.target.value) || 0)}
              className="w-14 px-2 py-1 text-sm border border-gray-300 rounded text-center"
              title="並び順"
            />
            <input
              type="text"
              value={item.label}
              onChange={(e) => handleChange(item.id, 'label', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="ラベル"
            />
            <input
              type="text"
              value={item.href}
              onChange={(e) => handleChange(item.id, 'href', e.target.value)}
              className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
              placeholder="パス"
            />
            <input
              type="text"
              value={item.icon || ''}
              onChange={(e) => handleChange(item.id, 'icon', e.target.value)}
              className="w-32 px-2 py-1 text-sm border border-gray-300 rounded"
              placeholder="アイコン名"
            />
            <label className="flex items-center gap-1 text-xs text-gray-600 whitespace-nowrap">
              <input
                type="checkbox"
                checked={item.is_active}
                onChange={(e) => handleChange(item.id, 'is_active', e.target.checked)}
              />
              有効
            </label>
            <button
              onClick={() => handleDelete(item.id)}
              className="px-2 py-1 text-xs text-red-600 hover:bg-red-50 rounded"
            >
              削除
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <button
          onClick={handleAdd}
          className="px-4 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          + 項目を追加
        </button>
        <button
          onClick={handleSaveAll}
          disabled={saving}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium"
        >
          {saving ? '保存中...' : '全て保存'}
        </button>
      </div>
    </div>
  );
}
