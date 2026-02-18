'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Textarea, Select, Alert, Badge, Card, CardHeader, CardTitle, CardContent, Modal, ModalFooter } from '@/components/shared';
import type { DiagnosisCategory, DiagnosisQuestion, QuestionOption } from '@/types/database';

type Props = {
  categories: DiagnosisCategory[];
  questions: DiagnosisQuestion[];
  sessionCount: number;
};

export function DiagnosisAdmin({ categories: initCats, questions: initQs, sessionCount }: Props) {
  const [categories, setCategories] = useState(initCats);
  const [questions, setQuestions] = useState(initQs);
  const [activeTab, setActiveTab] = useState<'categories' | 'questions'>('categories');
  const [editingCat, setEditingCat] = useState<DiagnosisCategory | null>(null);
  const [editingQ, setEditingQ] = useState<DiagnosisQuestion | null>(null);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showQModal, setShowQModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // カテゴリ CRUD
  const [catName, setCatName] = useState('');
  const [catSlug, setCatSlug] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // 質問 CRUD
  const [qText, setQText] = useState('');
  const [qType, setQType] = useState('single_choice');
  const [qCatId, setQCatId] = useState('');
  const [qWeight, setQWeight] = useState('1');
  const [qHelp, setQHelp] = useState('');
  const [qOptions, setQOptions] = useState<QuestionOption[]>([]);

  const refresh = async () => {
    const supabase = createClient();
    const [{ data: cats }, { data: qs }] = await Promise.all([
      supabase.from('diagnosis_categories').select('*').order('sort_order'),
      supabase.from('diagnosis_questions').select('*').order('category_id').order('sort_order'),
    ]);
    if (cats) setCategories(cats);
    if (qs) setQuestions(qs);
  };

  const openCatModal = (cat?: DiagnosisCategory) => {
    if (cat) {
      setEditingCat(cat);
      setCatName(cat.name);
      setCatSlug(cat.slug);
      setCatDesc(cat.description || '');
    } else {
      setEditingCat(null);
      setCatName(''); setCatSlug(''); setCatDesc('');
    }
    setShowCatModal(true);
  };

  const saveCat = async () => {
    setSaving(true); setMessage('');
    const supabase = createClient();
    const data = { name: catName, slug: catSlug, description: catDesc || null };
    if (editingCat) {
      await supabase.from('diagnosis_categories').update(data).eq('id', editingCat.id);
    } else {
      await supabase.from('diagnosis_categories').insert({ ...data, sort_order: categories.length + 1 });
    }
    await refresh();
    setShowCatModal(false);
    setSaving(false);
    setMessage('保存しました');
  };

  const deleteCat = async (id: number) => {
    if (!confirm('このカテゴリを削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('diagnosis_categories').delete().eq('id', id);
    await refresh();
  };

  const openQModal = (q?: DiagnosisQuestion) => {
    if (q) {
      setEditingQ(q);
      setQText(q.question_text);
      setQType(q.question_type);
      setQCatId(q.category_id.toString());
      setQWeight(q.weight.toString());
      setQHelp(q.help_text || '');
      setQOptions(q.options || []);
    } else {
      setEditingQ(null);
      setQText(''); setQType('single_choice'); setQCatId(''); setQWeight('1'); setQHelp('');
      setQOptions([{ label: '', value: '', score: 0 }]);
    }
    setShowQModal(true);
  };

  const saveQ = async () => {
    setSaving(true); setMessage('');
    const supabase = createClient();
    const data = {
      question_text: qText,
      question_type: qType,
      category_id: parseInt(qCatId),
      weight: parseFloat(qWeight),
      help_text: qHelp || null,
      options: qOptions.length > 0 ? qOptions : null,
    };
    if (editingQ) {
      await supabase.from('diagnosis_questions').update(data).eq('id', editingQ.id);
    } else {
      const maxOrder = questions.filter((q) => q.category_id === parseInt(qCatId)).length;
      await supabase.from('diagnosis_questions').insert({ ...data, sort_order: maxOrder + 1 });
    }
    await refresh();
    setShowQModal(false);
    setSaving(false);
    setMessage('保存しました');
  };

  const deleteQ = async (id: number) => {
    if (!confirm('この設問を削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('diagnosis_questions').delete().eq('id', id);
    await refresh();
  };

  const toggleQActive = async (q: DiagnosisQuestion) => {
    const supabase = createClient();
    await supabase.from('diagnosis_questions').update({ is_active: !q.is_active }).eq('id', q.id);
    await refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">診断管理</h2>
        <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
          実施回数: {sessionCount}
        </Badge>
      </div>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}

      {/* タブ */}
      <div className="flex gap-1 mb-6 border-b">
        {[
          { key: 'categories' as const, label: `カテゴリ (${categories.length})` },
          { key: 'questions' as const, label: `設問 (${questions.length})` },
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'categories' ? (
        <div>
          <Button themeColor="#1d4ed8" className="mb-4" onClick={() => openCatModal()}>カテゴリ追加</Button>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat.id} className="flex items-center justify-between bg-white rounded-lg border p-4">
                <div>
                  <span className="font-medium text-gray-900">{cat.name}</span>
                  <span className="text-xs text-gray-400 ml-2">({cat.slug})</span>
                  {cat.description && <p className="text-sm text-gray-500 mt-1">{cat.description}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openCatModal(cat)}>編集</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteCat(cat.id)}>削除</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <Button themeColor="#1d4ed8" className="mb-4" onClick={() => openQModal()}>設問追加</Button>
          <div className="space-y-2">
            {categories.map((cat) => {
              const catQs = questions.filter((q) => q.category_id === cat.id);
              if (catQs.length === 0) return null;
              return (
                <Card key={cat.id}>
                  <CardHeader>
                    <CardTitle>{cat.name} ({catQs.length}問)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {catQs.map((q) => (
                        <div key={q.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <Badge style={{ backgroundColor: q.is_active ? '#d1fae5' : '#e5e7eb', color: q.is_active ? '#065f46' : '#6b7280' }}>
                                {q.is_active ? '有効' : '無効'}
                              </Badge>
                              <span className="text-sm">{q.question_text}</span>
                            </div>
                            <span className="text-xs text-gray-400">タイプ: {q.question_type} / 重み: {q.weight}</span>
                          </div>
                          <div className="flex gap-1">
                            <Button size="sm" variant="ghost" onClick={() => toggleQActive(q)}>{q.is_active ? '無効化' : '有効化'}</Button>
                            <Button size="sm" variant="outline" onClick={() => openQModal(q)}>編集</Button>
                            <Button size="sm" variant="danger" onClick={() => deleteQ(q.id)}>削除</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* カテゴリモーダル */}
      <Modal open={showCatModal} onClose={() => setShowCatModal(false)} title={editingCat ? 'カテゴリ編集' : 'カテゴリ追加'}>
        <div className="space-y-4">
          <Input label="カテゴリ名" value={catName} onChange={(e) => setCatName(e.target.value)} required />
          <Input label="スラッグ" value={catSlug} onChange={(e) => setCatSlug(e.target.value)} required />
          <Textarea label="説明" value={catDesc} onChange={(e) => setCatDesc(e.target.value)} rows={3} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowCatModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={saveCat}>保存</Button>
        </ModalFooter>
      </Modal>

      {/* 設問モーダル */}
      <Modal open={showQModal} onClose={() => setShowQModal(false)} title={editingQ ? '設問編集' : '設問追加'} size="lg">
        <div className="space-y-4">
          <Select label="カテゴリ" value={qCatId} onChange={(e) => setQCatId(e.target.value)} options={categories.map((c) => ({ label: c.name, value: c.id.toString() }))} />
          <Textarea label="設問テキスト" value={qText} onChange={(e) => setQText(e.target.value)} rows={3} required />
          <div className="grid grid-cols-2 gap-4">
            <Select label="回答タイプ" value={qType} onChange={(e) => setQType(e.target.value)} options={[
              { label: '単一選択', value: 'single_choice' },
              { label: '複数選択', value: 'multi_choice' },
              { label: 'スケール', value: 'scale' },
              { label: 'はい/いいえ', value: 'yes_no' },
            ]} />
            <Input label="重み" type="number" value={qWeight} onChange={(e) => setQWeight(e.target.value)} />
          </div>
          <Input label="ヘルプテキスト" value={qHelp} onChange={(e) => setQHelp(e.target.value)} />

          {/* 選択肢 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">選択肢</label>
            {qOptions.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <Input placeholder="ラベル" value={opt.label} onChange={(e) => {
                  const updated = [...qOptions];
                  updated[i] = { ...opt, label: e.target.value };
                  setQOptions(updated);
                }} />
                <Input placeholder="値" value={opt.value} onChange={(e) => {
                  const updated = [...qOptions];
                  updated[i] = { ...opt, value: e.target.value };
                  setQOptions(updated);
                }} className="w-24" />
                <Input type="number" placeholder="点数" value={opt.score.toString()} onChange={(e) => {
                  const updated = [...qOptions];
                  updated[i] = { ...opt, score: parseInt(e.target.value) || 0 };
                  setQOptions(updated);
                }} className="w-20" />
                <Button size="sm" variant="danger" onClick={() => setQOptions(qOptions.filter((_, j) => j !== i))}>×</Button>
              </div>
            ))}
            <Button size="sm" variant="outline" onClick={() => setQOptions([...qOptions, { label: '', value: '', score: 0 }])}>
              選択肢を追加
            </Button>
          </div>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowQModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={saveQ}>保存</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
