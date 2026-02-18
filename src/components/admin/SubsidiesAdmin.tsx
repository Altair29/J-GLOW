'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Textarea, Select, Alert, Badge, Modal, ModalFooter } from '@/components/shared';
import type { Subsidy } from '@/types/database';

type Props = {
  subsidies: Subsidy[];
  searchLogCount: number;
};

export function SubsidiesAdmin({ subsidies: initSubs, searchLogCount }: Props) {
  const [subsidies, setSubsidies] = useState(initSubs);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Subsidy | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [provider, setProvider] = useState('');
  const [summary, setSummary] = useState('');
  const [detail, setDetail] = useState('');
  const [maxAmount, setMaxAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [fiscalYear, setFiscalYear] = useState('');
  const [status, setStatus] = useState('active');
  const [isFeatured, setIsFeatured] = useState(false);
  const [applicationUrl, setApplicationUrl] = useState('');

  const refresh = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('subsidies').select('*').order('sort_order');
    if (data) setSubsidies(data);
  };

  const openModal = (sub?: Subsidy) => {
    if (sub) {
      setEditing(sub);
      setName(sub.name); setSlug(sub.slug); setProvider(sub.provider);
      setSummary(sub.summary); setDetail(sub.detail || ''); setMaxAmount(sub.max_amount || '');
      setDeadline(sub.deadline || ''); setFiscalYear(sub.fiscal_year || '');
      setStatus(sub.status); setIsFeatured(sub.is_featured); setApplicationUrl(sub.application_url || '');
    } else {
      setEditing(null);
      setName(''); setSlug(''); setProvider(''); setSummary(''); setDetail('');
      setMaxAmount(''); setDeadline(''); setFiscalYear(''); setStatus('active');
      setIsFeatured(false); setApplicationUrl('');
    }
    setShowModal(true);
  };

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const data = {
      name, slug, provider, summary, detail: detail || null,
      max_amount: maxAmount || null, deadline: deadline || null,
      fiscal_year: fiscalYear || null, status, is_featured: isFeatured,
      application_url: applicationUrl || null,
    };
    if (editing) {
      await supabase.from('subsidies').update(data).eq('id', editing.id);
    } else {
      await supabase.from('subsidies').insert({ ...data, sort_order: subsidies.length + 1 });
    }
    await refresh();
    setShowModal(false);
    setSaving(false);
    setMessage('助成金を保存しました');
  };

  const deleteSub = async (id: number) => {
    if (!confirm('この助成金を削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('subsidies').delete().eq('id', id);
    await refresh();
  };

  const statusColors: Record<string, { label: string; bg: string; text: string }> = {
    active: { label: '受付中', bg: '#d1fae5', text: '#065f46' },
    upcoming: { label: '受付予定', bg: '#dbeafe', text: '#1e40af' },
    expired: { label: '受付終了', bg: '#e5e7eb', text: '#374151' },
    suspended: { label: '一時停止', bg: '#fee2e2', text: '#991b1b' },
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">助成金管理</h2>
        <div className="flex items-center gap-3">
          <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>検索回数: {searchLogCount}</Badge>
          <Button themeColor="#1d4ed8" onClick={() => openModal()}>新規追加</Button>
        </div>
      </div>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">助成金名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">提供元</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">ステータス</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">最大金額</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-32">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {subsidies.map((sub) => {
              const sc = statusColors[sub.status] || statusColors.active;
              return (
                <tr key={sub.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {sub.is_featured && <span className="text-amber-500">★</span>}
                      <span className="font-medium text-gray-900">{sub.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{sub.provider}</td>
                  <td className="px-4 py-3"><Badge style={{ backgroundColor: sc.bg, color: sc.text }}>{sc.label}</Badge></td>
                  <td className="px-4 py-3 text-gray-600">{sub.max_amount || '—'}</td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModal(sub)}>編集</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteSub(sub.id)}>削除</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {subsidies.length === 0 && <p className="text-center text-gray-500 py-8">データがありません</p>}
      </div>

      <Modal open={showModal} onClose={() => setShowModal(false)} title={editing ? '助成金編集' : '助成金追加'} size="lg">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            <Input label="助成金名" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="スラッグ" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          </div>
          <Input label="提供元" value={provider} onChange={(e) => setProvider(e.target.value)} required placeholder="厚生労働省" />
          <Textarea label="概要" value={summary} onChange={(e) => setSummary(e.target.value)} rows={2} required />
          <Textarea label="詳細 (Markdown)" value={detail} onChange={(e) => setDetail(e.target.value)} rows={6} className="font-mono text-sm" />
          <div className="grid grid-cols-3 gap-4">
            <Input label="最大金額" value={maxAmount} onChange={(e) => setMaxAmount(e.target.value)} placeholder="100万円" />
            <Input label="申請期限" value={deadline} onChange={(e) => setDeadline(e.target.value)} placeholder="2026年3月末" />
            <Input label="対象年度" value={fiscalYear} onChange={(e) => setFiscalYear(e.target.value)} placeholder="2025年度" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="ステータス" value={status} onChange={(e) => setStatus(e.target.value)}
              options={[
                { label: '受付中', value: 'active' },
                { label: '受付予定', value: 'upcoming' },
                { label: '受付終了', value: 'expired' },
                { label: '一時停止', value: 'suspended' },
              ]} />
            <Input label="申請URL" value={applicationUrl} onChange={(e) => setApplicationUrl(e.target.value)} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} />
            <span className="text-sm">注目として表示</span>
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
