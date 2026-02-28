import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingWizard } from './OnboardingWizard';

export const metadata = {
  title: '初期設定 | J-GLOW Business',
};

export default async function OnboardingPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?redirectTo=/business/home');
  }

  // 既にオンボーディング済みなら mypage へ
  const { data: bp } = await supabase
    .from('business_profiles')
    .select('business_type, company_name, contact_name, industry')
    .eq('id', user.id)
    .single();

  if (bp?.business_type) {
    redirect('/business/mypage');
  }

  return (
    <OnboardingWizard
      userId={user.id}
      existing={{
        companyName: bp?.company_name || '',
        contactName: bp?.contact_name || '',
        industry: bp?.industry || '',
      }}
    />
  );
}
