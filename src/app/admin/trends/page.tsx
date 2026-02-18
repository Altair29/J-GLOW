import { createClient } from '@/lib/supabase/server';
import { TrendsAdmin } from '@/components/admin/TrendsAdmin';

export default async function TrendsAdminPage() {
  const supabase = await createClient();

  const [{ data: sources }, { data: widgets }, { data: insights }, { count: dataCount }] = await Promise.all([
    supabase.from('trend_sources').select('*').order('name'),
    supabase.from('trend_widgets').select('*').order('sort_order'),
    supabase.from('trend_insights').select('*').order('created_at', { ascending: false }),
    supabase.from('trend_data').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <TrendsAdmin
      sources={sources || []}
      widgets={widgets || []}
      insights={insights || []}
      dataPointCount={dataCount || 0}
    />
  );
}
