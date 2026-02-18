import { createClient } from '@/lib/supabase/server';
import { WhitepapersAdmin } from '@/components/admin/WhitepapersAdmin';

export default async function WhitepapersAdminPage() {
  const supabase = await createClient();

  const [{ data: whitepapers }, { data: categories }, { count: dlCount }] = await Promise.all([
    supabase.from('whitepapers').select('*').order('created_at', { ascending: false }),
    supabase.from('whitepaper_categories').select('*').order('sort_order'),
    supabase.from('whitepaper_downloads').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <WhitepapersAdmin
      whitepapers={whitepapers || []}
      categories={categories || []}
      downloadCount={dlCount || 0}
    />
  );
}
