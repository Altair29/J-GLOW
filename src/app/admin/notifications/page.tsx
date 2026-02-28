import { createClient } from '@/lib/supabase/server';
import { NotificationsAdmin } from '@/components/admin/NotificationsAdmin';

export default async function NotificationsAdminPage() {
  const supabase = await createClient();

  const { data: notifications } = await supabase
    .from('notifications')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);

  return <NotificationsAdmin notifications={notifications || []} />;
}
