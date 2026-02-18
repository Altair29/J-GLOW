'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Button, Alert, Badge } from '@/components/shared';
import type { BlogPost } from '@/types/database';

type Props = {
  texts: Record<string, string>;
  onEdit: (post: BlogPost) => void;
  refreshKey?: number;
};

const statusColors: Record<string, { bg: string; text: string }> = {
  draft: { bg: '#fef3c7', text: '#92400e' },
  published: { bg: '#d1fae5', text: '#065f46' },
  archived: { bg: '#e5e7eb', text: '#374151' },
};

const statusLabels: Record<string, string> = {
  draft: '下書き',
  published: '公開済み',
  archived: 'アーカイブ',
};

export function BlogPostList({ texts, onEdit, refreshKey }: Props) {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    let query = supabase
      .from('blog_posts')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('pin_order', { ascending: true })
      .order('created_at', { ascending: false });

    if (filter !== 'all') {
      query = query.eq('status', filter);
    }

    const { data, error: fetchError } = await query;
    if (fetchError) {
      setError(fetchError.message);
    } else {
      setPosts(data || []);
    }
    setLoading(false);
  }, [filter]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts, refreshKey]);

  const handleTogglePin = async (post: BlogPost) => {
    const supabase = createClient();
    await supabase
      .from('blog_posts')
      .update({ is_pinned: !post.is_pinned, pin_order: post.is_pinned ? 0 : 1 })
      .eq('id', post.id);
    fetchPosts();
  };

  const handleDelete = async (postId: number) => {
    if (!confirm(texts.confirm_delete || 'この記事を削除してもよろしいですか？')) return;
    const supabase = createClient();
    await supabase.from('blog_posts').delete().eq('id', postId);
    fetchPosts();
  };

  const tabs = [
    { key: 'all', label: texts.tab_all || 'すべて' },
    { key: 'draft', label: texts.tab_draft || '下書き' },
    { key: 'published', label: texts.tab_published || '公開済み' },
    { key: 'archived', label: texts.tab_archived || 'アーカイブ' },
  ];

  return (
    <div>
      {error && <Alert variant="error" className="mb-4">{error}</Alert>}

      {/* フィルタタブ */}
      <div className="flex gap-1 mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setFilter(tab.key)}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              filter === tab.key
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-8 text-gray-500">読み込み中...</div>
      ) : posts.length === 0 ? (
        <div className="text-center py-8 text-gray-500">記事がありません</div>
      ) : (
        <div className="bg-white rounded-lg border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">
                  {texts.col_title || 'タイトル'}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-24">
                  {texts.col_status || 'ステータス'}
                </th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 w-36">
                  {texts.col_published_at || '公開日'}
                </th>
                <th className="text-right px-4 py-3 font-medium text-gray-600 w-44">
                  {texts.col_actions || '操作'}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {posts.map((post) => {
                const sc = statusColors[post.status] || statusColors.draft;
                return (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {post.is_pinned && (
                          <span className="text-xs px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded">
                            PIN
                          </span>
                        )}
                        <span className="font-medium text-gray-900">{post.title}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <Badge style={{ backgroundColor: sc.bg, color: sc.text }}>
                        {statusLabels[post.status] || post.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {post.published_at
                        ? new Date(post.published_at).toLocaleDateString('ja-JP')
                        : '—'}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(post)}>
                        {texts.btn_edit || '編集'}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleTogglePin(post)}
                      >
                        {post.is_pinned ? (texts.btn_unpin || 'ピン解除') : (texts.btn_pin || 'ピン固定')}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        onClick={() => handleDelete(post.id)}
                      >
                        {texts.btn_delete || '削除'}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
