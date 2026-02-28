import { createClient } from '@/lib/supabase/server';
import { PartnersAdmin } from '@/components/admin/PartnersAdmin';

export default async function PartnersAdminPage() {
  const supabase = await createClient();

  const { data: partners } = await supabase
    .from('partners')
    .select('*')
    .order('sort_order');

  return <PartnersAdmin partners={partners || []} />;
}
