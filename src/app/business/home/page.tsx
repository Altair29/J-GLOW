import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function BusinessHomePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/business');
  }

  // business_profiles の business_type を確認
  const { data: bp } = await supabase
    .from('business_profiles')
    .select('business_type')
    .eq('id', user.id)
    .single();

  // business_type 未設定 → オンボーディングへ
  if (!bp?.business_type) {
    redirect('/business/onboarding');
  }

  // 設定済み → マイページへ
  redirect('/business/mypage');
}
