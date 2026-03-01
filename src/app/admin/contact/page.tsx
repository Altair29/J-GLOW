import { createClient } from '@/lib/supabase/server';
import { ContactAdmin } from '@/components/admin/ContactAdmin';

export default async function ContactAdminPage() {
  const supabase = await createClient();

  const { data: inquiries } = await supabase
    .from('contact_inquiries')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200);

  return <ContactAdmin inquiries={inquiries || []} />;
}
