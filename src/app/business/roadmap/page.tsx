import { createClient } from '@/lib/supabase/server';
import RoadmapLanding from './RoadmapLanding';

export const metadata = {
  title: '育成就労制度 ロードマップ | J-GLOW',
  description:
    '2027年4月施行の育成就労制度に向けた準備スケジュール・実務記事・チェックリスト。監理団体・受入企業の立場別に情報を整理。',
};

export default async function RoadmapPage() {
  const supabase = await createClient();

  // カテゴリ取得
  const { data: categories } = await supabase
    .from('blog_categories')
    .select('id, slug, name')
    .in('slug', ['ikuseshuro', 'industry-guide']);

  const categoryIds = (categories || []).map((c) => c.id);

  // 記事取得
  const { data: posts } = await supabase
    .from('blog_posts')
    .select('id, slug, title, category_id, is_pinned, published_at')
    .eq('status', 'published')
    .in('category_id', categoryIds)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: true });

  // blog_post_tags + blog_tags でペルソナタグ取得
  const postIds = (posts || []).map((p) => p.id);
  const { data: postTags } = await supabase
    .from('blog_post_tags')
    .select('post_id, tag:blog_tags(name)')
    .in('post_id', postIds);

  // post_id -> tag名の配列マップ
  const tagMap: Record<number, string[]> = {};
  for (const pt of postTags || []) {
    const tagName =
      pt.tag && typeof pt.tag === 'object' && 'name' in pt.tag
        ? (pt.tag as { name: string }).name
        : null;
    if (tagName) {
      if (!tagMap[pt.post_id]) tagMap[pt.post_id] = [];
      tagMap[pt.post_id].push(tagName);
    }
  }

  const serializedPosts = (posts || []).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    categoryId: p.category_id,
    isPinned: p.is_pinned ?? false,
    publishedAt: p.published_at,
    tags: tagMap[p.id] || [],
  }));

  return <RoadmapLanding posts={serializedPosts} />;
}
