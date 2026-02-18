'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContentBlock } from '@/types/database';

type Props = {
  page: string;
  title?: string;
};

export function ContentBlockEditor({ page, title }: Props) {
  const [items, setItems] = useState<ContentBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('content_blocks')
        .select('*')
        .eq('page', page)
        .order('sort_order');
      if (data) setItems(data as ContentBlock[]);
      setLoading(false);
    };
    fetchData();
  }, [page]);

  const handleChange = (id: number, content: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, content } : item))
    );
  };

  const handleSave = async (item: ContentBlock) => {
    setSaving(item.id);
    setMessage('');
    const supabase = createClient();
    const { error } = await supabase
      .from('content_blocks')
      .update({ content: item.content })
      .eq('id', item.id);

    if (error) {
      setMessage(`エラー: ${error.message}`);
    } else {
      setMessage(`「${item.block_key}」を保存しました`);
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
        .from('content_blocks')
        .update({ content: item.content })
        .eq('id', item.id);
      if (error) {
        setMessage(`エラー: ${error.message}`);
        setSaving(null);
        return;
      }
    }
    setMessage('全てのテキストを保存しました');
    setSaving(null);
    setTimeout(() => setMessage(''), 3000);
  };

  if (loading) return <div className="text-gray-500 py-4">読み込み中...</div>;
  if (items.length === 0) return <div className="text-gray-400 py-4">コンテンツがありません</div>;

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
          <div key={item.id} className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-medium text-gray-900">{item.block_key}</span>
                <span className="ml-2 text-xs text-gray-400">({item.lang})</span>
              </div>
              <button
                onClick={() => handleSave(item)}
                disabled={saving !== null}
                className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {saving === item.id ? '...' : '保存'}
              </button>
            </div>
            {item.content.includes('\n') ? (
              <textarea
                value={item.content}
                onChange={(e) => handleChange(item.id, e.target.value)}
                rows={4}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            ) : (
              <input
                type="text"
                value={item.content}
                onChange={(e) => handleChange(item.id, e.target.value)}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
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
