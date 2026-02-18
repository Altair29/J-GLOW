import { createClient } from '@/lib/supabase/server';
import { NewsAdmin } from '@/components/admin/NewsAdmin';

export default async function NewsAdminPage() {
  const supabase = await createClient();

  const [{ data: sources }, { data: articles }, { data: editorials }] = await Promise.all([
    supabase.from('news_sources').select('*').order('name'),
    supabase.from('news_articles').select('*').order('fetched_at', { ascending: false }).limit(50),
    supabase.from('editorial_articles').select('*').order('created_at', { ascending: false }),
  ]);

  return (
    <NewsAdmin
      sources={sources || []}
      articles={articles || []}
      editorials={editorials || []}
    />
  );
}
