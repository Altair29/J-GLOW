import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import LaborNoticeWizard from './LaborNoticeWizard';
import LeadSection from './components/LeadSection';

export const metadata: Metadata = {
  title: '労働条件通知書ウィザード | J-GLOW',
  description:
    '外国人労働者向け労働条件通知書を8言語で自動生成。厚生労働省モデル様式に準拠したバイリンガルPDFを簡単に作成できます。',
};

export default async function LaborNoticePage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login?redirectTo=/business/tools/labor-notice');

  return (
    <div>
      <LeadSection />
      <LaborNoticeWizard />
    </div>
  );
}
