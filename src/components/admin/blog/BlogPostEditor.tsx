'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Input, Button, Alert, Textarea, Select } from '@/components/shared';
import { MarkdownPreview } from './MarkdownPreview';
import type { BlogCategory, BlogPost } from '@/types/database';

type Props = {
  post?: BlogPost | null;
  categories: BlogCategory[];
  texts: Record<string, string>;
  onSaved?: () => void;
};

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

export function BlogPostEditor({ post, categories, texts, onSaved }: Props) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState(post?.slug || '');
  const [body, setBody] = useState(post?.body || '');
  const [excerpt, setExcerpt] = useState(post?.excerpt || '');
  const [categoryId, setCategoryId] = useState<string>(post?.category_id?.toString() || '');
  const [coverImageUrl, setCoverImageUrl] = useState(post?.cover_image_url || '');
  const [status, setStatus] = useState<string>(post?.status || 'draft');
  const [publishedAt, setPublishedAt] = useState(
    post?.published_at ? new Date(post.published_at).toISOString().slice(0, 16) : ''
  );
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);

  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // タイトル変更時にスラッグ自動生成 (新規のみ)
  useEffect(() => {
    if (!post && title) {
      setSlug(slugify(title));
    }
  }, [title, post]);

  // 既存記事のタグを読み込む
  useEffect(() => {
    if (!post) return;
    const supabase = createClient();
    (async () => {
      const { data } = await supabase
        .from('blog_post_tags')
        .select('tag_id, blog_tags(name)')
        .eq('post_id', post.id);
      if (data) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setTags(data.map((d: any) => d.blog_tags?.name).filter(Boolean));
      }
    })();
  }, [post]);

  const addTag = () => {
    const t = tagInput.trim();
    if (t && !tags.includes(t)) {
      setTags([...tags, t]);
    }
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleGenerateCover = async () => {
    if (!title) { setError('タイトルを入力してからAI生成を実行してください'); return; }
    setGenerating(true);
    setError('');
    try {
      const res = await fetch('/api/blog/generate-cover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error('画像生成に失敗しました');
      const { url } = await res.json();
      setCoverImageUrl(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : '画像生成に失敗しました');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = useCallback(async (targetStatus?: string) => {
    setSaving(true);
    setError('');
    setSuccess('');

    const finalStatus = targetStatus || status;

    try {
      const supabase = createClient();

      // 現在のユーザーを取得
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setError('ログインが必要です'); setSaving(false); return; }

      const postData = {
        title,
        slug,
        body,
        excerpt: excerpt || null,
        cover_image_url: coverImageUrl || null,
        category_id: categoryId ? parseInt(categoryId) : null,
        status: finalStatus,
        published_at: publishedAt ? new Date(publishedAt).toISOString() : (finalStatus === 'published' ? new Date().toISOString() : null),
        author_id: post?.author_id || user.id,
      };

      let postId = post?.id;

      if (post) {
        const { error: updateError } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', post.id);
        if (updateError) throw updateError;
      } else {
        const { data: newPost, error: insertError } = await supabase
          .from('blog_posts')
          .insert(postData)
          .select('id')
          .single();
        if (insertError) throw insertError;
        postId = newPost.id;
      }

      // タグの同期
      if (postId) {
        // 既存タグリレーションを削除
        await supabase.from('blog_post_tags').delete().eq('post_id', postId);

        // タグを作成 or 取得して紐付け
        for (const tagName of tags) {
          const tagSlug = slugify(tagName);
          // upsert tag
          const { data: existingTag } = await supabase
            .from('blog_tags')
            .select('id')
            .eq('name', tagName)
            .single();

          let tagId: number;
          if (existingTag) {
            tagId = existingTag.id;
          } else {
            const { data: newTag } = await supabase
              .from('blog_tags')
              .insert({ name: tagName, slug: tagSlug })
              .select('id')
              .single();
            if (!newTag) continue;
            tagId = newTag.id;
          }

          await supabase
            .from('blog_post_tags')
            .insert({ post_id: postId, tag_id: tagId });
        }
      }

      setSuccess(finalStatus === 'published' ? '記事を公開しました' : '下書きを保存しました');
      onSaved?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : '保存に失敗しました');
    } finally {
      setSaving(false);
    }
  }, [title, slug, body, excerpt, coverImageUrl, categoryId, status, publishedAt, post, tags, onSaved]);

  return (
    <div className="space-y-6">
      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* メインエディタ領域 */}
        <div className="lg:col-span-2 space-y-4">
          <Input
            label={texts.title_label || 'タイトル'}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <Input
            label={texts.slug_label || 'スラッグ (URL)'}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
          />

          <Input
            label={texts.excerpt_label || '抜粋'}
            value={excerpt}
            onChange={(e) => setExcerpt(e.target.value)}
          />

          {/* タブ: 編集 / プレビュー */}
          <div>
            <div className="flex border-b mb-2">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'edit'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('edit')}
              >
                {texts.edit_tab || '編集'}
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'preview'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setActiveTab('preview')}
              >
                {texts.preview_tab || 'プレビュー'}
              </button>
            </div>

            {activeTab === 'edit' ? (
              <Textarea
                label={texts.body_label || '本文 (Markdown)'}
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={20}
                className="font-mono text-sm"
              />
            ) : (
              <div className="min-h-[480px] p-4 border rounded-lg bg-white">
                <MarkdownPreview content={body} />
              </div>
            )}
          </div>
        </div>

        {/* サイドバー設定 */}
        <div className="space-y-4">
          {/* ステータス */}
          <Select
            label={texts.status_label || 'ステータス'}
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            options={[
              { label: '下書き', value: 'draft' },
              { label: '公開', value: 'published' },
              { label: 'アーカイブ', value: 'archived' },
            ]}
          />

          {/* 公開日時 */}
          <Input
            label={texts.published_at_label || '公開日時'}
            type="datetime-local"
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />

          {/* カテゴリ */}
          <Select
            label={texts.category_label || 'カテゴリ'}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            options={[
              { label: '未分類', value: '' },
              ...categories.map((c) => ({ label: c.name, value: c.id.toString() })),
            ]}
          />

          {/* タグ */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {texts.tags_label || 'タグ'}
            </label>
            <div className="flex gap-2 mb-2 flex-wrap">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded"
                >
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-600">
                    &times;
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                className="flex-1 px-3 py-1.5 text-sm border rounded"
                placeholder="タグを入力してEnter"
              />
              <button
                type="button"
                onClick={addTag}
                className="px-3 py-1.5 text-sm bg-gray-200 rounded hover:bg-gray-300"
              >
                追加
              </button>
            </div>
          </div>

          {/* カバー画像 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {texts.cover_label || 'カバー画像'}
            </label>
            <Input
              value={coverImageUrl}
              onChange={(e) => setCoverImageUrl(e.target.value)}
              placeholder="画像URL"
            />
            {coverImageUrl && (
              <img src={coverImageUrl} alt="cover preview" className="mt-2 w-full h-40 object-cover rounded" />
            )}
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 w-full"
              loading={generating}
              onClick={handleGenerateCover}
            >
              {generating
                ? (texts.cover_generating || '画像を生成中...')
                : (texts.cover_generate || 'AIで自動生成')}
            </Button>
          </div>

          {/* アクションボタン */}
          <div className="space-y-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              loading={saving}
              onClick={() => handleSave('draft')}
            >
              {texts.save_draft || '下書き保存'}
            </Button>
            <Button
              type="button"
              themeColor="#1d4ed8"
              className="w-full"
              loading={saving}
              onClick={() => handleSave('published')}
            >
              {post ? (texts.update || '更新する') : (texts.publish || '公開する')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
