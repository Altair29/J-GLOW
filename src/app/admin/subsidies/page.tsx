import { createClient } from '@/lib/supabase/server';
import { SubsidiesAdmin } from '@/components/admin/SubsidiesAdmin';

export default async function SubsidiesAdminPage() {
  const supabase = await createClient();

  const [{ data: subsidies }, { count: searchCount }] = await Promise.all([
    supabase.from('subsidies').select('*').order('sort_order'),
    supabase.from('subsidy_search_logs').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <SubsidiesAdmin
      subsidies={subsidies || []}
      searchLogCount={searchCount || 0}
    />
  );
}
