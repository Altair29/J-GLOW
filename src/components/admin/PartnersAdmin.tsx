'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Textarea, Select, Alert, Badge, Modal, ModalFooter } from '@/components/shared';
import { PARTNER_TYPE_LABELS } from '@/types/database';
import type { Partner, PartnerTypeLegacy, PartnerPlanLegacy } from '@/types/database';

type Props = {
  partners: Partner[];
};

const typeOptions = [
  { label: '監理団体', value: 'supervisory' },
  { label: '行政書士', value: 'admin_scrivener' },
  { label: '登録支援機関', value: 'support_org' },
];

const planOptions = [
  { label: 'スポンサー', value: 'sponsor' },
  { label: 'メンバー', value: 'member' },
];

const typeColors: Record<PartnerTypeLegacy, { bg: string; text: string }> = {
  supervisory: { bg: '#dcfce7', text: '#166534' },
  admin_scrivener: { bg: '#dbeafe', text: '#1e40af' },
  support_org: { bg: '#fef3c7', text: '#92400e' },
};

const planColors: Record<PartnerPlanLegacy, { bg: string; text: string }> = {
  sponsor: { bg: '#fdf5e0', text: '#8a7530' },
  member: { bg: '#e5e7eb', text: '#374151' },
};

export function PartnersAdmin({ partners: initPartners }: Props) {
  const [partners, setPartners] = useState(initPartners);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form state
  const [name, setName] = useState('');
  const [type, setType] = useState<string>('supervisory');
  const [plan, setPlan] = useState<string>('member');
  const [prefecture, setPrefecture] = useState('');
  const [industries, setIndustries] = useState('');
  const [visas, setVisas] = useState('');
  const [languages, setLanguages] = useState('');
  const [originCountries, setOriginCountries] = useState('');
  const [description, setDescription] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [sortOrder, setSortOrder] = useState('999');
  const [isActive, setIsActive] = useState(true);

  const refresh = async () => {
    const supabase = createClient();
    const { data } = await supabase.from('partners').select('*').order('sort_order');
    if (data) setPartners(data);
  };

  const csvToArray = (s: string): string[] =>
    s.split(',').map((v) => v.trim()).filter(Boolean);

  const arrayToCsv = (arr: string[] | null | undefined): string =>
    (arr || []).join(', ');

  const openModal = (p?: Partner) => {
    if (p) {
      setEditing(p);
      setName(p.name);
      setType(p.type ?? p.partner_type ?? 'supervisory');
      setPlan(p.plan ?? 'member');
      setPrefecture(p.prefecture || '');
      setIndustries(arrayToCsv(p.industries));
      setVisas(arrayToCsv(p.visas));
      setLanguages(arrayToCsv(p.languages));
      setOriginCountries(arrayToCsv(p.origin_countries));
      setDescription(p.description || '');
      setContactEmail(p.contact_email || '');
      setWebsiteUrl(p.website_url || '');
      setSortOrder(String(p.sort_order));
      setIsActive(p.is_active);
    } else {
      setEditing(null);
      setName(''); setType('supervisory'); setPlan('member'); setPrefecture('');
      setIndustries(''); setVisas(''); setLanguages(''); setOriginCountries('');
      setDescription(''); setContactEmail(''); setWebsiteUrl('');
      setSortOrder('999'); setIsActive(true);
    }
    setShowModal(true);
  };

  const save = async () => {
    setSaving(true);
    const supabase = createClient();
    const data = {
      name,
      type,
      plan,
      prefecture: prefecture || null,
      industries: csvToArray(industries),
      visas: csvToArray(visas),
      languages: csvToArray(languages),
      origin_countries: csvToArray(originCountries),
      description: description || null,
      contact_email: contactEmail || null,
      website_url: websiteUrl || null,
      sort_order: parseInt(sortOrder) || 999,
      is_active: isActive,
    };
    if (editing) {
      await supabase.from('partners').update(data).eq('id', editing.id);
    } else {
      await supabase.from('partners').insert(data);
    }
    await refresh();
    setShowModal(false);
    setSaving(false);
    setMessage(editing ? 'パートナーを更新しました' : 'パートナーを追加しました');
  };

  const deletePartner = async (id: string) => {
    if (!confirm('このパートナーを削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('partners').delete().eq('id', id);
    await refresh();
    setMessage('パートナーを削除しました');
  };

  const toggleActive = async (p: Partner) => {
    const supabase = createClient();
    await supabase.from('partners').update({ is_active: !p.is_active }).eq('id', p.id);
    await refresh();
  };

  const togglePlan = async (p: Partner) => {
    const newPlan: PartnerPlanLegacy = p.plan === 'sponsor' ? 'member' : 'sponsor';
    const supabase = createClient();
    await supabase.from('partners').update({ plan: newPlan }).eq('id', p.id);
    await refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">パートナー管理</h2>
        <div className="flex items-center gap-3">
          <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
            {partners.length} 件
          </Badge>
          <Button themeColor="#1d4ed8" onClick={() => openModal()}>新規追加</Button>
        </div>
      </div>

      {message && (
        <Alert variant="success" className="mb-4">
          {message}
        </Alert>
      )}

      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">法人名</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">種別</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">プラン</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">都道府県</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">順序</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-16">状態</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-40">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {partners.map((p) => {
              const tc = p.type ? typeColors[p.type] : { bg: '#e5e7eb', text: '#374151' };
              const pc = p.plan ? planColors[p.plan] : { bg: '#e5e7eb', text: '#374151' };
              return (
                <tr key={p.id} className={`hover:bg-gray-50 ${!p.is_active ? 'opacity-50' : ''}`}>
                  <td className="px-4 py-3">
                    <span className="font-medium text-gray-900">{p.name}</span>
                  </td>
                  <td className="px-4 py-3">
                    <Badge style={{ backgroundColor: tc.bg, color: tc.text }}>
                      {(p.type && PARTNER_TYPE_LABELS[p.type]) || (p.partner_type && PARTNER_TYPE_LABELS[p.partner_type]) || '—'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button onClick={() => togglePlan(p)} title="クリックで切替">
                      <Badge style={{ backgroundColor: pc.bg, color: pc.text }}>
                        {p.plan === 'sponsor' ? '★ スポンサー' : 'メンバー'}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.prefecture || '—'}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{p.sort_order}</td>
                  <td className="px-4 py-3">
                    <button onClick={() => toggleActive(p)} title="クリックで切替">
                      <Badge style={{
                        backgroundColor: p.is_active ? '#d1fae5' : '#e5e7eb',
                        color: p.is_active ? '#065f46' : '#374151',
                      }}>
                        {p.is_active ? '有効' : '無効'}
                      </Badge>
                    </button>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => openModal(p)}>編集</Button>
                    <Button size="sm" variant="danger" onClick={() => deletePartner(p.id)}>削除</Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {partners.length === 0 && (
          <p className="text-center text-gray-500 py-8">データがありません</p>
        )}
      </div>

      {/* 編集モーダル */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={editing ? 'パートナー編集' : 'パートナー追加'}
        size="lg"
      >
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Input label="法人名" value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="種別" value={type} onChange={(e) => setType(e.target.value)} options={typeOptions} />
            <Select label="プラン" value={plan} onChange={(e) => setPlan(e.target.value)} options={planOptions} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input label="都道府県" value={prefecture} onChange={(e) => setPrefecture(e.target.value)} placeholder="東京都" />
            <Input label="表示順序" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} type="number" />
          </div>
          <Textarea label="紹介文" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} />
          <Input label="対応業種（カンマ区切り）" value={industries} onChange={(e) => setIndustries(e.target.value)} placeholder="製造業, 介護, 建設業" />
          <Input label="対応ビザ（カンマ区切り）" value={visas} onChange={(e) => setVisas(e.target.value)} placeholder="特定技能1号, 育成就労" />
          <Input label="対応言語（カンマ区切り）" value={languages} onChange={(e) => setLanguages(e.target.value)} placeholder="ベトナム語, 英語" />
          <Input label="対応出身国（カンマ区切り）" value={originCountries} onChange={(e) => setOriginCountries(e.target.value)} placeholder="ベトナム, インドネシア" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="メールアドレス" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} type="email" placeholder="info@example.com" />
            <Input label="Webサイト" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} placeholder="https://..." />
          </div>
          <label className="flex items-center gap-2">
            <input type="checkbox" checked={isActive} onChange={(e) => setIsActive(e.target.checked)} />
            <span className="text-sm">有効（公開ページに表示）</span>
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
