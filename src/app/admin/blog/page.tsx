import { createClient } from '@/lib/supabase/server';
import { getContentBlocks } from '@/lib/data';
import { BlogAdmin } from '@/components/admin/blog/BlogAdmin';

export default async function AdminBlogPage() {
  const supabase = await createClient();

  const [listTexts, editorTexts, { data: categories }] = await Promise.all([
    getContentBlocks(supabase, 'admin_blog'),
    getContentBlocks(supabase, 'admin_blog_editor'),
    supabase
      .from('blog_categories')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  return (
    <BlogAdmin
      categories={categories || []}
      listTexts={listTexts}
      editorTexts={editorTexts}
    />
  );
}
