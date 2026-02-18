'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Textarea, Select, Alert, Badge, Modal, ModalFooter } from '@/components/shared';
import type { Whitepaper, WhitepaperCategory } from '@/types/database';

type Props = {
  whitepapers: Whitepaper[];
  categories: WhitepaperCategory[];
  downloadCount: number;
};

export function WhitepapersAdmin({ whitepapers: initWPs, categories, downloadCount }: Props) {
  const [whitepapers, setWhitepapers] = useState(initWPs);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Whitepaper | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [summary, setSummary] = useState('');
  const [body, setBody] = useState('');
  const [industry, setIndustry] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [status, setStatus] = useState('draft');
  const [isFeatured, setIsFeatured] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState('');

  const refresh = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('whitepapers').select('*').order('created_at', { ascending: false });
    if (data) setWhitepapers(data);
  };

  const openModal = (wp?: Whitepaper) => {
    if (wp) {
      setEditing(wp);
      setTitle(wp.title); setSlug(wp.slug); setSubtitle(wp.subtitle || '');
      setSummary(wp.summary || ''); setBody(wp.body); setIndustry(wp.industry || '');
      setCategoryId(wp.category_id?.toString() || ''); setStatus(wp.status);
      setIsFeatured(wp.is_featured); setDownloadUrl(wp.download_url || '');
    } else {
      setEditing(null);
      setTitle(''); setSlug(''); setSubtitle(''); setSummary(''); setBody('');
      setIndustry(''); setCategoryId(''); setStatus('draft'); setIsFeatured(false); setDownloadUrl('');
    }
    setShowModal(true);
  };

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const data = {
      title, slug, subtitle: subtitle || null, summary: summary || null, body,
      industry: industry || null, category_id: categoryId ? parseInt(categoryId) : null,
      status, is_featured: isFeatured, download_url: downloadUrl || null,
      published_at: status === 'published' ? new Date().toISOString() : null,
    };
    if (editing) {
      await supabase.from('whitepapers').update(data).eq('id', editing.id);
    } else {
      await supabase.from('whitepapers').insert(data);
    }
    await refresh();
    setShowModal(false);
    setSaving(false);
    setMessage('ホワイトペーパーを保存しました');
  };

  const deleteWP = async (id: number) => {
    if (!confirm('このホワイトペーパーを削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('whitepapers').delete().eq('id', id);
    await refresh();
  };

  const statusColors: Record<string, { bg: string; text: string }> = {
    draft: { bg: '#fef3c7', text: '#92400e' },
    published: { bg: '#d1fae5', text: '#065f46' },
    archived: { bg: '#e5e7eb', text: '#374151' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ホワイトペーパー管理</h2>
        <div className="flex items-center gap-3">
          <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>DL数: {downloadCount}</Badge>
          <Button themeColor="#1d4ed8" onClick={() => openModal()}>新規追加</Button>
        </div>
      </div>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">タイトル</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">ステータス</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">注目</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {whitepapers.map((wp) => {
              const sc = statusColors[wp.status] || statusColors.draft;
              return (
                <tr key={wp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{wp.title}</span>
                    {wp.industry && <span className="text-xs text-gray-400 ml-2">({wp.industry})</span>}
                  </td>
                  <td className="px-4 py-3"><Badge style={{ backgroundColor: sc.bg, color: sc.text }}>{wp.status}</Badge></td>
                  <td className="px-4 py-3">{wp.is_featured ? '★' : '—'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModal(wp)}>編集</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteWP(wp.id)}>削除</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {whitepapers.length === 0 && <p className="text-center text-gray-500 py-8">データがありません</p>}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? 'ホワイトペーパー編集' : 'ホワイトペーパー追加'} size="lg">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Input label="タイトル" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input label="スラッグ" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <Input label="サブタイトル" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          <Textarea label="要約" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} />
          <Textarea label="本文 (Markdown)" value={body} onChange={(e) => setBody(e.target.value)} rows={10} className="font-mono text-sm" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="業界" value={industry} onChange={(e) => setIndustry(e.target.value)} placeholder="建設、介護等" />
            <Select label="カテゴリ" value={categoryId} onChange={(e) => setCategoryId(e.target.value)}
              options={[{ label: '未分類', value: '' }, ...categories.map((c) => ({ label: c.name, value: c.id.toString() }))]} />
            <Select label="ステータス" value={status} onChange={(e) => setStatus(e.target.value)}
              options={[{ label: '下書き', value: 'draft' }, { label: '公開', value: 'published' }, { label: 'アーカイブ', value: 'archived' }]} />
          </div>
          <Input label="ダウンロードURL" value={downloadUrl} onChange={(e) => setDownloadUrl(e.target.value)} placeholder="https://..." />
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <span className="text-sm">注目にピン固定</span>
          </label>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={save}>保存</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
