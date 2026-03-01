'use client';

import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { ContactInquiry } from '@/types/database';

type Props = {
  inquiries: ContactInquiry[];
};

const STATUS_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  new: { label: '新規', color: '#dc2626', bg: '#fef2f2' },
  in_progress: { label: '対応中', color: '#d97706', bg: '#fffbeb' },
  done: { label: '完了', color: '#16a34a', bg: '#f0fdf4' },
};

const STATUS_OPTIONS = ['new', 'in_progress', 'done'] as const;

export function ContactAdmin({ inquiries: initialInquiries }: Props) {
  const [inquiries, setInquiries] = useState(initialInquiries);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    const supabase = createClient();
    const { error } = await supabase
      .from('contact_inquiries')
      .update({ status: newStatus })
      .eq('id', id);

    if (!error) {
      setInquiries(prev =>
        prev.map(item => item.id === id ? { ...item, status: newStatus } : item)
      );
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const newCount = inquiries.filter(i => i.status === 'new').length;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          問い合わせ管理
          {newCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-red-100 text-red-700">
              {newCount}件 未対応
            </span>
          )}
        </h2>
      </div>

      {inquiries.length === 0 ? (
        <div className="bg-white rounded-lg p-12 text-center text-gray-500">
          問い合わせはまだありません
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">受信日時</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">種別</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">会社名</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">担当者名</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">メール</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">ステータス</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">詳細</th>
                </tr>
              </thead>
              <tbody>
                {inquiries.map(item => {
                  const status = STATUS_LABELS[item.status] || STATUS_LABELS.new;
                  const isExpanded = expandedId === item.id;
                  return (
                    <tr key={item.id} className="border-b hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-gray-500 whitespace-nowrap text-xs">
                        {formatDate(item.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs font-medium px-2 py-0.5 rounded bg-blue-50 text-blue-700 whitespace-nowrap">
                          {item.inquiry_type}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">{item.company_name}</td>
                      <td className="px-4 py-3 text-gray-700 whitespace-nowrap">{item.name}</td>
                      <td className="px-4 py-3">
                        <a href={`mailto:${item.email}`} className="text-blue-600 hover:underline text-xs">
                          {item.email}
                        </a>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value)}
                          className="text-xs font-semibold px-2 py-1 rounded border-0 cursor-pointer"
                          style={{ background: status.bg, color: status.color }}
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{STATUS_LABELS[s].label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => setExpandedId(isExpanded ? null : item.id)}
                          className="text-xs text-blue-600 hover:underline"
                        >
                          {isExpanded ? '閉じる' : '詳細'}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 展開した詳細パネル */}
          {expandedId && (() => {
            const item = inquiries.find(i => i.id === expandedId);
            if (!item) return null;
            return (
              <div className="border-t bg-gray-50 p-6">
                <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                  <div>
                    <span className="text-gray-500">電話番号:</span>{' '}
                    <span className="text-gray-900">{item.phone || '未入力'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">従業員数:</span>{' '}
                    <span className="text-gray-900">{item.company_size || '未入力'}</span>
                  </div>
                  <div>
                    <span className="text-gray-500">外国人雇用経験:</span>{' '}
                    <span className="text-gray-900">{item.experience || '未入力'}</span>
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-500 block mb-1">お問い合わせ内容:</span>
                  <div className="bg-white rounded-lg p-4 border text-sm text-gray-800 whitespace-pre-wrap">
                    {item.message}
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
