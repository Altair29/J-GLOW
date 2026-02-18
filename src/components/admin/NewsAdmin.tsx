'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Alert, Badge, Card, CardHeader, CardTitle, CardContent, Modal, ModalFooter, Select } from '@/components/shared';
import type { NewsSource, NewsArticle, EditorialArticle } from '@/types/database';

type Props = {
  sources: NewsSource[];
  articles: NewsArticle[];
  editorials: EditorialArticle[];
};

export function NewsAdmin({ sources: initSources, articles: initArticles, editorials: initEditorials }: Props) {
  const [sources, setSources] = useState(initSources);
  const [articles, setArticles] = useState(initArticles);
  const [editorials, setEditorials] = useState(initEditorials);
  const [activeTab, setActiveTab] = useState<'sources' | 'articles' | 'editorial'>('sources');
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Source form
  const [srcName, setSrcName] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [srcFeedType, setSrcFeedType] = useState('rss');
  const [editingSource, setEditingSource] = useState<NewsSource | null>(null);

  const refresh = async () => {
    const supabase = createClient();
    const [{ data: s }, { data: a }, { data: e }] = await Promise.all([
      supabase.from('news_sources').select('*').order('name'),
      supabase.from('news_articles').select('*').order('fetched_at', { ascending: false }).limit(50),
      supabase.from('editorial_articles').select('*').order('created_at', { ascending: false }),
    ]);
    if (s) setSources(s);
    if (a) setArticles(a);
    if (e) setEditorials(e);
  };

  const openSourceModal = (src?: NewsSource) => {
    if (src) {
      setEditingSource(src);
      setSrcName(src.name); setSrcUrl(src.url); setSrcFeedType(src.feed_type);
    } else {
      setEditingSource(null);
      setSrcName(''); setSrcUrl(''); setSrcFeedType('rss');
    }
    setShowSourceModal(true);
  };

  const saveSource = async () => {
    setSaving(true);
    const supabase = createClient();
    const data = { name: srcName, url: srcUrl, feed_type: srcFeedType };
    if (editingSource) {
      await supabase.from('news_sources').update(data).eq('id', editingSource.id);
    } else {
      await supabase.from('news_sources').insert(data);
    }
    await refresh();
    setShowSourceModal(false);
    setSaving(false);
    setMessage('ソースを保存しました');
  };

  const toggleSourceActive = async (src: NewsSource) => {
    const supabase = createClient();
    await supabase.from('news_sources').update({ is_active: !src.is_active }).eq('id', src.id);
    await refresh();
  };

  const togglePin = async (article: NewsArticle) => {
    const supabase = createClient();
    await supabase.from('news_articles').update({ is_pinned: !article.is_pinned }).eq('id', article.id);
    await refresh();
  };

  const tabs = [
    { key: 'sources' as const, label: `ソース (${sources.length})` },
    { key: 'articles' as const, label: `記事 (${articles.length})` },
    { key: 'editorial' as const, label: `独自記事 (${editorials.length})` },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">ニュース管理</h2>
      {message && <Alert variant="success" className="mb-4">{message}</Alert>}

      <div className="flex gap-1 mb-6 border-b">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'sources' && (
        <div>
          <Button themeColor="#1d4ed8" className="mb-4" onClick={() => openSourceModal()}>ソース追加</Button>
          <div className="space-y-2">
            {sources.map((src) => (
              <div key={src.id} className="flex items-center justify-between bg-white rounded-lg border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge style={{ backgroundColor: src.is_active ? '#d1fae5' : '#e5e7eb', color: src.is_active ? '#065f46' : '#6b7280' }}>
                      {src.is_active ? '有効' : '無効'}
                    </Badge>
                    <span className="font-medium">{src.name}</span>
                    <span className="text-xs text-gray-400">({src.feed_type})</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate max-w-lg">{src.url}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="ghost" onClick={() => toggleSourceActive(src)}>{src.is_active ? '無効化' : '有効化'}</Button>
                  <Button size="sm" variant="outline" onClick={() => openSourceModal(src)}>編集</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'articles' && (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">タイトル</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">ピン</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">取得日</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {articles.map((a) => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline line-clamp-1">{a.title}</a>
                  </td>
                  <td className="px-4 py-3">
                    <Button size="sm" variant={a.is_pinned ? 'primary' : 'ghost'} onClick={() => togglePin(a)}>
                      {a.is_pinned ? 'PIN' : '固定'}
                    </Button>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{new Date(a.fetched_at).toLocaleDateString('ja-JP')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'editorial' && (
        <div className="space-y-2">
          {editorials.map((e) => (
            <div key={e.id} className="bg-white rounded-lg border p-4">
              <div className="flex items-center gap-2 mb-1">
                <Badge style={{ backgroundColor: e.status === 'published' ? '#d1fae5' : '#fef3c7', color: e.status === 'published' ? '#065f46' : '#92400e' }}>
                  {e.status === 'published' ? '公開済み' : e.status}
                </Badge>
                <span className="font-medium">{e.title}</span>
              </div>
              <p className="text-xs text-gray-400">{new Date(e.created_at).toLocaleDateString('ja-JP')}</p>
            </div>
          ))}
        </div>
      )}

      <Modal open={showSourceModal} onClose={() => setShowSourceModal(false)} title={editingSource ? 'ソース編集' : 'ソース追加'}>
        <div className="space-y-4">
          <Input label="ソース名" value={srcName} onChange={(e) => setSrcName(e.target.value)} required />
          <Input label="URL" value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} required />
          <Select label="フィードタイプ" value={srcFeedType} onChange={(e) => setSrcFeedType(e.target.value)}
            options={[{ label: 'RSS', value: 'rss' }, { label: 'Atom', value: 'atom' }, { label: 'スクレイプ', value: 'scrape' }]} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowSourceModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={saveSource}>保存</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
