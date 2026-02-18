'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Alert, Badge } from '@/components/shared';

type Translation = {
  id: number;
  key: string;
  lang: string;
  value: string;
};

type Props = {
  translations: Translation[];
  cacheCount: number;
};

export function TranslationsAdmin({ translations: initTranslations, cacheCount }: Props) {
  const [translations, setTranslations] = useState(initTranslations);
  const [filter, setFilter] = useState('');
  const [saving, setSaving] = useState<number | null>(null);
  const [message, setMessage] = useState('');

  const filtered = filter
    ? translations.filter((t) => t.key.includes(filter) || t.lang.includes(filter) || t.value.includes(filter))
    : translations;

  // キーでグループ化
  const grouped = filtered.reduce<Record<string, Translation[]>>((acc, t) => {
    if (!acc[t.key]) acc[t.key] = [];
    acc[t.key].push(t);
    return acc;
  }, {});

  const updateTranslation = async (t: Translation, newValue: string) => {
    setSaving(t.id);
    const supabase = createClient();
    await supabase.from('ui_translations').update({ value: newValue }).eq('id', t.id);
    setTranslations(translations.map((tr) => tr.id === t.id ? { ...tr, value: newValue } : tr));
    setSaving(null);
    setMessage(`${t.key} (${t.lang}) を更新しました`);
  };

  const clearCache = async () => {
    if (!confirm('翻訳キャッシュをすべてクリアしますか？')) return;
    const supabase = createClient();
    await supabase.from('translation_cache').delete().neq('id', 0);
    setMessage('キャッシュをクリアしました');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">翻訳管理</h2>
        <div className="flex items-center gap-3">
          <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
            キャッシュ: {cacheCount}件
          </Badge>
          <Button size="sm" variant="outline" onClick={clearCache}>キャッシュクリア</Button>
        </div>
      </div>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}

      <div className="mb-4">
        <Input placeholder="キー・言語・値で検索..." value={filter} onChange={(e) => setFilter(e.target.value)} />
      </div>

      <div className="space-y-4">
        {Object.entries(grouped).map(([key, items]) => (
          <div key={key} className="bg-white rounded-lg border p-4">
            <p className="text-sm font-medium text-gray-900 mb-2 font-mono">{key}</p>
            <div className="space-y-2">
              {items.map((t) => (
                <div key={t.id} className="flex items-center gap-2">
                  <Badge style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{t.lang}</Badge>
                  <input
                    type="text"
                    defaultValue={t.value}
                    onBlur={(e) => {
                      if (e.target.value !== t.value) updateTranslation(t, e.target.value);
                    }}
                    className="flex-1 px-3 py-1.5 text-sm border rounded"
                  />
                  {saving === t.id && <span className="text-xs text-blue-500">保存中...</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
        {Object.keys(grouped).length === 0 && (
          <p className="text-center text-gray-500 py-12">翻訳データがありません。</p>
        )}
      </div>
    </div>
  );
}
