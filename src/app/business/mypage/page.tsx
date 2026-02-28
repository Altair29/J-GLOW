import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { BusinessMypage } from './BusinessMypage';
import type { BusinessProfile, UserScore, Bookmark, Notification } from '@/types/database';

export const metadata = {
  title: 'マイページ | J-GLOW Business',
};

export default async function MypagePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login?redirectTo=/business/mypage');
  }

  const [{ data: profile }, { data: bp }, { data: scores }, { data: bookmarks }, { data: notifications }] =
    await Promise.all([
      supabase.from('profiles').select('plan').eq('id', user.id).single(),
      supabase
        .from('business_profiles')
        .select('*')
        .eq('id', user.id)
        .single(),
      supabase
        .from('user_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('bookmarks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(5),
      supabase
        .from('notifications')
        .select('*')
        .or(`user_id.eq.${user.id},user_id.is.null`)
        .order('created_at', { ascending: false })
        .limit(20),
    ]);

  // business_type 未設定ならオンボーディングへ
  if (!bp?.business_type) {
    redirect('/business/onboarding');
  }

  return (
    <BusinessMypage
      businessProfile={bp as BusinessProfile}
      plan={profile?.plan || 'free'}
      scores={(scores as UserScore[]) || []}
      bookmarks={(bookmarks as Bookmark[]) || []}
      notifications={(notifications as Notification[]) || []}
    />
  );
}
