'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Textarea, Select, Alert, Badge, Modal, ModalFooter, Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import type { TrendSource, TrendWidget, TrendInsight } from '@/types/database';

type Props = {
  sources: TrendSource[];
  widgets: TrendWidget[];
  insights: TrendInsight[];
  dataPointCount: number;
};

export function TrendsAdmin({ sources: initSources, widgets: initWidgets, insights: initInsights, dataPointCount }: Props) {
  const [sources, setSources] = useState(initSources);
  const [widgets, setWidgets] = useState(initWidgets);
  const [insights, setInsights] = useState(initInsights);
  const [activeTab, setActiveTab] = useState<'sources' | 'widgets' | 'insights'>('sources');
  const [message, setMessage] = useState('');

  // Source modal
  const [showSourceModal, setShowSourceModal] = useState(false);
  const [editingSource, setEditingSource] = useState<TrendSource | null>(null);
  const [srcName, setSrcName] = useState('');
  const [srcUrl, setSrcUrl] = useState('');
  const [srcDesc, setSrcDesc] = useState('');
  const [srcFreq, setSrcFreq] = useState('monthly');

  // Widget modal
  const [showWidgetModal, setShowWidgetModal] = useState(false);
  const [editingWidget, setEditingWidget] = useState<TrendWidget | null>(null);
  const [wTitle, setWTitle] = useState('');
  const [wType, setWType] = useState('stat_card');
  const [wKeys, setWKeys] = useState('');

  // Insight modal
  const [showInsightModal, setShowInsightModal] = useState(false);
  const [editingInsight, setEditingInsight] = useState<TrendInsight | null>(null);
  const [insTitle, setInsTitle] = useState('');
  const [insBody, setInsBody] = useState('');
  const [insStatus, setInsStatus] = useState('draft');

  const [saving, setSaving] = useState(false);

  const refreshAll = async () => {
    const supabase = createClient();
    const [{ data: s }, { data: w }, { data: i }] = await Promise.all([
      supabase.from('trend_sources').select('*').order('name'),
      supabase.from('trend_widgets').select('*').order('sort_order'),
      supabase.from('trend_insights').select('*').order('created_at', { ascending: false }),
    ]);
    if (s) setSources(s);
    if (w) setWidgets(w);
    if (i) setInsights(i);
  };

  // ===== Source CRUD =====
  const openSourceModal = (src?: TrendSource) => {
    if (src) {
      setEditingSource(src); setSrcName(src.name); setSrcUrl(src.source_url || '');
      setSrcDesc(src.description || ''); setSrcFreq(src.update_frequency);
    } else {
      setEditingSource(null); setSrcName(''); setSrcUrl(''); setSrcDesc(''); setSrcFreq('monthly');
    }
    setShowSourceModal(true);
  };

  const saveSource = async () => {
    setSaving(true);
    const supabase = createClient();
    const data = { name: srcName, source_url: srcUrl || null, description: srcDesc || null, update_frequency: srcFreq };
    if (editingSource) {
      await supabase.from('trend_sources').update(data).eq('id', editingSource.id);
    } else {
      await supabase.from('trend_sources').insert(data);
    }
    await refreshAll(); setShowSourceModal(false); setSaving(false);
    setMessage('データソースを保存しました');
  };

  const deleteSource = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('trend_sources').delete().eq('id', id);
    await refreshAll();
  };

  // ===== Widget CRUD =====
  const openWidgetModal = (w?: TrendWidget) => {
    if (w) {
      setEditingWidget(w); setWTitle(w.title); setWType(w.widget_type); setWKeys(w.metric_keys.join(', '));
    } else {
      setEditingWidget(null); setWTitle(''); setWType('stat_card'); setWKeys('');
    }
    setShowWidgetModal(true);
  };

  const saveWidget = async () => {
    setSaving(true);
    const supabase = createClient();
    const keys = wKeys.split(',').map((k) => k.trim()).filter(Boolean);
    const data = { title: wTitle, widget_type: wType, metric_keys: keys };
    if (editingWidget) {
      await supabase.from('trend_widgets').update(data).eq('id', editingWidget.id);
    } else {
      await supabase.from('trend_widgets').insert({ ...data, sort_order: widgets.length + 1 });
    }
    await refreshAll(); setShowWidgetModal(false); setSaving(false);
    setMessage('ウィジェットを保存しました');
  };

  const deleteWidget = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('trend_widgets').delete().eq('id', id);
    await refreshAll();
  };

  // ===== Insight CRUD =====
  const openInsightModal = (ins?: TrendInsight) => {
    if (ins) {
      setEditingInsight(ins); setInsTitle(ins.title); setInsBody(ins.body); setInsStatus(ins.status);
    } else {
      setEditingInsight(null); setInsTitle(''); setInsBody(''); setInsStatus('draft');
    }
    setShowInsightModal(true);
  };

  const saveInsight = async () => {
    setSaving(true);
    const supabase = createClient();
    const data = {
      title: insTitle, body: insBody, status: insStatus,
      published_at: insStatus === 'published' ? new Date().toISOString() : null,
    };
    if (editingInsight) {
      await supabase.from('trend_insights').update(data).eq('id', editingInsight.id);
    } else {
      await supabase.from('trend_insights').insert(data);
    }
    await refreshAll(); setShowInsightModal(false); setSaving(false);
    setMessage('インサイト記事を保存しました');
  };

  const deleteInsight = async (id: number) => {
    if (!confirm('削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('trend_insights').delete().eq('id', id);
    await refreshAll();
  };

  const tabs = [
    { key: 'sources' as const, label: `データソース (${sources.length})` },
    { key: 'widgets' as const, label: `ウィジェット (${widgets.length})` },
    { key: 'insights' as const, label: `インサイト (${insights.length})` },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">トレンド管理</h2>
        <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>データ数: {dataPointCount}</Badge>
      </div>

      {message && <Alert variant="success" className="mb-4">{message}</Alert>}

      <div className="flex gap-1 mb-6 border-b">
        {tabs.map((tab) => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* === Sources === */}
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
                    <span className="text-xs text-gray-400">({src.update_frequency})</span>
                  </div>
                  {src.source_url && <p className="text-xs text-gray-500 mt-1 truncate max-w-lg">{src.source_url}</p>}
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openSourceModal(src)}>編集</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteSource(src.id)}>削除</Button>
                </div>
              </div>
            ))}
            {sources.length === 0 && <p className="text-center text-gray-500 py-8">ソースがありません</p>}
          </div>
        </div>
      )}

      {/* === Widgets === */}
      {activeTab === 'widgets' && (
        <div>
          <Button themeColor="#1d4ed8" className="mb-4" onClick={() => openWidgetModal()}>ウィジェット追加</Button>
          <div className="grid md:grid-cols-2 gap-4">
            {widgets.map((w) => (
              <Card key={w.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{w.title}</CardTitle>
                    <Badge style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{w.widget_type}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-gray-500 mb-3">キー: {w.metric_keys.join(', ')}</p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openWidgetModal(w)}>編集</Button>
                    <Button size="sm" variant="danger" onClick={() => deleteWidget(w.id)}>削除</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          {widgets.length === 0 && <p className="text-center text-gray-500 py-8">ウィジェットがありません</p>}
        </div>
      )}

      {/* === Insights === */}
      {activeTab === 'insights' && (
        <div>
          <Button themeColor="#1d4ed8" className="mb-4" onClick={() => openInsightModal()}>インサイト追加</Button>
          <div className="space-y-2">
            {insights.map((ins) => (
              <div key={ins.id} className="flex items-center justify-between bg-white rounded-lg border p-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Badge style={{
                      backgroundColor: ins.status === 'published' ? '#d1fae5' : '#fef3c7',
                      color: ins.status === 'published' ? '#065f46' : '#92400e',
                    }}>
                      {ins.status === 'published' ? '公開済み' : '下書き'}
                    </Badge>
                    <span className="font-medium">{ins.title}</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{new Date(ins.created_at).toLocaleDateString('ja-JP')}</p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => openInsightModal(ins)}>編集</Button>
                  <Button size="sm" variant="danger" onClick={() => deleteInsight(ins.id)}>削除</Button>
                </div>
              </div>
            ))}
            {insights.length === 0 && <p className="text-center text-gray-500 py-8">インサイトがありません</p>}
          </div>
        </div>
      )}

      {/* Source Modal */}
      <Modal open={showSourceModal} onClose={() => setShowSourceModal(false)} title={editingSource ? 'ソース編集' : 'ソース追加'}>
        <div className="space-y-4">
          <Input label="ソース名" value={srcName} onChange={(e) => setSrcName(e.target.value)} required />
          <Input label="URL" value={srcUrl} onChange={(e) => setSrcUrl(e.target.value)} />
          <Textarea label="説明" value={srcDesc} onChange={(e) => setSrcDesc(e.target.value)} rows={2} />
          <Select label="更新頻度" value={srcFreq} onChange={(e) => setSrcFreq(e.target.value)}
            options={[
              { label: '日次', value: 'daily' }, { label: '週次', value: 'weekly' },
              { label: '月次', value: 'monthly' }, { label: '四半期', value: 'quarterly' },
              { label: '年次', value: 'yearly' },
            ]} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowSourceModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={saveSource}>保存</Button>
        </ModalFooter>
      </Modal>

      {/* Widget Modal */}
      <Modal open={showWidgetModal} onClose={() => setShowWidgetModal(false)} title={editingWidget ? 'ウィジェット編集' : 'ウィジェット追加'}>
        <div className="space-y-4">
          <Input label="タイトル" value={wTitle} onChange={(e) => setWTitle(e.target.value)} required />
          <Select label="ウィジェットタイプ" value={wType} onChange={(e) => setWType(e.target.value)}
            options={[
              { label: '統計カード', value: 'stat_card' }, { label: '折れ線グラフ', value: 'line_chart' },
              { label: '棒グラフ', value: 'bar_chart' }, { label: '円グラフ', value: 'pie_chart' },
              { label: 'テーブル', value: 'table' }, { label: 'マップ', value: 'map' },
            ]} />
          <Input label="メトリクスキー (カンマ区切り)" value={wKeys} onChange={(e) => setWKeys(e.target.value)} placeholder="total_workers, by_nationality_vietnam" />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowWidgetModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={saveWidget}>保存</Button>
        </ModalFooter>
      </Modal>

      {/* Insight Modal */}
      <Modal open={showInsightModal} onClose={() => setShowInsightModal(false)} title={editingInsight ? 'インサイト編集' : 'インサイト追加'} size="lg">
        <div className="space-y-4">
          <Input label="タイトル" value={insTitle} onChange={(e) => setInsTitle(e.target.value)} required />
          <Textarea label="本文 (Markdown)" value={insBody} onChange={(e) => setInsBody(e.target.value)} rows={10} className="font-mono text-sm" />
          <Select label="ステータス" value={insStatus} onChange={(e) => setInsStatus(e.target.value)}
            options={[{ label: '下書き', value: 'draft' }, { label: '公開', value: 'published' }, { label: 'アーカイブ', value: 'archived' }]} />
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowInsightModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={saveInsight}>保存</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
