'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ThemeConfig } from '@/types/database';

type Props = {
  section: string;
};

export function ThemeEditor({ section }: Props) {
  const [items, setItems] = useState<ThemeConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchTheme = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('theme_config')
        .select('*')
        .eq('section', section)
        .order('sort_order');
      if (data) setItems(data as ThemeConfig[]);
      setLoading(false);
    };
    fetchTheme();
  }, [section]);

  const handleChange = (id: number, value: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, value } : item))
    );
  };

  const handleSave = async (item: ThemeConfig) => {
    setSaving(item.id);
    setMessage('');
    const supabase = createClient();
    const { error } = await supabase
      .from('theme_config')
      .update({ value: item.value })
      .eq('id', item.id);

    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else {
      setMessage(`「${item.label}」を保存しました`);
    }
    setSaving(null);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleSaveAll = async () => {
    setSaving(-1);
    setMessage('');
    const supabase = createClient();

    for (const item of items) {
      const { error } = await supabase
        .from('theme_config')
        .update({ value: item.value })
        .eq('id', item.id);
      if (error) {
        setMessage(`エラー: ${error.message}`);
        setSaving(null);
        return;
      }
    }

    setMessage('全ての設定を保存しました');
    setSaving(null);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) {
    return <div className="text-gray-500 py-4">読み込み中...</div>;
  }

  if (items.length === 0) {
    return <div className="text-gray-400 py-4">設定項目がありません</div>;
  }

  return (
    <div className="space-y-4">
      {message && (
        <div className={`px-4 py-2 rounded-lg text-sm ${message.startsWith('エラー') ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 divide-y">
        {items.map((item) => (
          <div key={item.id} className="p-4 flex items-center gap-4">
            {item.category === 'color' && (
              <div
                className="w-10 h-10 rounded-lg border border-gray-300 flex-shrink-0"
                style={{ backgroundColor: item.value }}
              />
            )}

            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-gray-900">{item.label}</div>
              <div className="text-xs text-gray-400 font-mono">{item.css_var}</div>
            </div>

            <div className="flex items-center gap-2">
              {item.category === 'color' ? (
                <>
                  <input
                    type="color"
                    value={item.value}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    className="w-10 h-10 rounded cursor-pointer border border-gray-300"
                  />
                  <input
                    type="text"
                    value={item.value}
                    onChange={(e) => handleChange(item.id, e.target.value)}
                    className="w-24 px-2 py-1 text-sm border border-gray-300 rounded font-mono"
                  />
                </>
              ) : (
                <input
                  type="text"
                  value={item.value}
                  onChange={(e) => handleChange(item.id, e.target.value)}
                  className="w-48 px-2 py-1 text-sm border border-gray-300 rounded"
                />
              )}

              <button
                onClick={() => handleSave(item)}
                disabled={saving !== null}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving === item.id ? '...' : '保存'}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSaveAll}
          disabled={saving !== null}
          className="px-6 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 disabled:opacity-50 text-sm font-medium"
        >
          {saving === -1 ? '保存中...' : '全て保存'}
        </button>
      </div>
    </div>
  );
}
