'use client';

import { useState } from 'react';
import { Button } from '@/components/shared';
import { BlogPostList } from './BlogPostList';
import { BlogPostEditor } from './BlogPostEditor';
import type { BlogCategory, BlogPost } from '@/types/database';

type Props = {
  categories: BlogCategory[];
  listTexts: Record<string, string>;
  editorTexts: Record<string, string>;
};

export function BlogAdmin({ categories, listTexts, editorTexts }: Props) {
  const [view, setView] = useState<'list' | 'editor'>('list');
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleNew = () => {
    setEditingPost(null);
    setView('editor');
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setView('editor');
  };

  const handleBack = () => {
    setView('list');
    setEditingPost(null);
    setRefreshKey((k) => k + 1);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">
          {listTexts.page_title || 'ブログ管理'}
        </h2>
        {view === 'list' ? (
          <Button themeColor="#1d4ed8" onClick={handleNew}>
            {listTexts.new_post || '新規記事作成'}
          </Button>
        ) : (
          <Button variant="outline" onClick={handleBack}>
            ← 一覧に戻る
          </Button>
        )}
      </div>

      {view === 'list' ? (
        <BlogPostList texts={listTexts} onEdit={handleEdit} refreshKey={refreshKey} />
      ) : (
        <BlogPostEditor
          post={editingPost}
          categories={categories}
          texts={editorTexts}
          onSaved={handleBack}
        />
      )}
    </div>
  );
}
