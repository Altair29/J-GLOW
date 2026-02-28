'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Input, Textarea, Alert, Badge, Modal, ModalFooter } from '@/components/shared';
import type { Notification } from '@/types/database';

type Props = {
  notifications: Notification[];
};

export function NotificationsAdmin({ notifications: initNotifs }: Props) {
  const [notifications, setNotifications] = useState(initNotifs);
  const [showModal, setShowModal] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  // Form
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [linkUrl, setLinkUrl] = useState('');
  const [targetType, setTargetType] = useState<'all' | 'user'>('all');
  const [targetUserId, setTargetUserId] = useState('');
  const [sendEmail, setSendEmail] = useState(false);

  const refresh = async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(100);
    if (data) setNotifications(data);
  };

  const openModal = () => {
    setTitle('');
    setBody('');
    setLinkUrl('');
    setTargetType('all');
    setTargetUserId('');
    setSendEmail(false);
    setShowModal(true);
  };

  const send = async () => {
    if (!title.trim() || !body.trim()) {
      setMessage('タイトルと本文は必須です');
      return;
    }
    setSaving(true);
    const supabase = createClient();

    const data: Record<string, unknown> = {
      title: title.trim(),
      body: body.trim(),
      link_url: linkUrl.trim() || null,
      send_email: sendEmail,
      user_id: targetType === 'user' && targetUserId.trim() ? targetUserId.trim() : null,
    };

    const { error } = await supabase.from('notifications').insert(data);

    if (error) {
      setMessage(`送信エラー: ${error.message}`);
      setSaving(false);
      return;
    }

    await refresh();
    setShowModal(false);
    setSaving(false);
    setMessage('お知らせを送信しました');
  };

  const deleteNotif = async (id: string) => {
    if (!confirm('このお知らせを削除しますか？')) return;
    const supabase = createClient();
    await supabase.from('notifications').delete().eq('id', id);
    await refresh();
    setMessage('お知らせを削除しました');
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">お知らせ管理</h2>
        <div className="flex items-center gap-3">
          <Badge style={{ backgroundColor: '#e0e7ff', color: '#3730a3' }}>
            {notifications.length} 件
          </Badge>
          <Button themeColor="#1d4ed8" onClick={openModal}>新規送信</Button>
        </div>
      </div>

      {message && (
        <Alert
          variant={message.startsWith('送信エラー') ? 'error' : 'success'}
          className="mb-4"
        >
          {message}
        </Alert>
      )}

      {/* 送信済み一覧 */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">タイトル</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">送信先</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-20">メール</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600 w-28">送信日時</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600 w-20">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {notifications.map((n) => (
              <tr key={n.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div>
                    <span className="font-medium text-gray-900">{n.title}</span>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{n.body}</p>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <Badge style={{
                    backgroundColor: n.user_id ? '#dbeafe' : '#d1fae5',
                    color: n.user_id ? '#1e40af' : '#065f46',
                  }}>
                    {n.user_id ? '個別' : '全員'}
                  </Badge>
                </td>
                <td className="px-4 py-3">
                  {n.send_email ? (
                    <Badge style={{ backgroundColor: '#fef3c7', color: '#92400e' }}>送信</Badge>
                  ) : (
                    <span className="text-xs text-gray-400">—</span>
                  )}
                </td>
                <td className="px-4 py-3 text-xs text-gray-500">
                  {new Date(n.created_at).toLocaleString('ja-JP', {
                    month: 'numeric',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>
                <td className="px-4 py-3 text-right">
                  <Button size="sm" variant="danger" onClick={() => deleteNotif(n.id)}>
                    削除
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {notifications.length === 0 && (
          <p className="text-center text-gray-500 py-8">送信済みのお知らせはありません</p>
        )}
      </div>

      {/* 送信モーダル */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="お知らせを送信" size="lg">
        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          <Input
            label="タイトル"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            placeholder="お知らせのタイトル"
          />
          <Textarea
            label="本文"
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={4}
            required
            placeholder="お知らせの内容を入力..."
          />
          <Input
            label="リンクURL（任意）"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://... or /business/..."
          />

          {/* 送信先 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">送信先</label>
            <div className="flex gap-3">
              <button
                onClick={() => setTargetType('all')}
                className="px-4 py-2 text-sm rounded-lg border transition-all"
                style={
                  targetType === 'all'
                    ? { backgroundColor: '#1a2f5e', color: '#fff', borderColor: '#1a2f5e' }
                    : { backgroundColor: '#fff', color: '#374151', borderColor: '#d1d5db' }
                }
              >
                全員
              </button>
              <button
                onClick={() => setTargetType('user')}
                className="px-4 py-2 text-sm rounded-lg border transition-all"
                style={
                  targetType === 'user'
                    ? { backgroundColor: '#1a2f5e', color: '#fff', borderColor: '#1a2f5e' }
                    : { backgroundColor: '#fff', color: '#374151', borderColor: '#d1d5db' }
                }
              >
                特定ユーザー
              </button>
            </div>
          </div>

          {targetType === 'user' && (
            <Input
              label="ユーザーID (UUID)"
              value={targetUserId}
              onChange={(e) => setTargetUserId(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              required
            />
          )}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={sendEmail}
              onChange={(e) => setSendEmail(e.target.checked)}
            />
            <span className="text-sm">メール通知も送信する（send_emailフラグのみ記録）</span>
          </label>
        </div>
        <ModalFooter>
          <Button variant="outline" onClick={() => setShowModal(false)}>キャンセル</Button>
          <Button themeColor="#1d4ed8" loading={saving} onClick={send}>送信</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}
