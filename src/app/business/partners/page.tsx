import { createClient } from '@/lib/supabase/server';
import { PartnersSearch } from '@/components/business/partners/PartnersSearch';

export const revalidate = 60;

export const metadata = {
  title: 'パートナーディレクトリ | J-GLOW',
  description: '外国人雇用に精通した監理団体・登録支援機関・行政書士・弁護士・社労士を一括検索',
};

export default async function PartnersPage() {
  const supabase = await createClient();

  const [{ data: platinum }, { data: gold }, { data: regular }] = await Promise.all([
    supabase.from('partners').select('*').eq('status', 'active').eq('plan_tier', 'platinum').order('display_order'),
    supabase.from('partners').select('*').eq('status', 'active').eq('plan_tier', 'gold').order('display_order'),
    supabase.from('partners').select('*').eq('status', 'active').eq('plan_tier', 'regular').order('updated_at', { ascending: false }),
  ]);

  return (
    <PartnersSearch
      initialPlatinum={platinum ?? []}
      initialGold={gold ?? []}
      initialRegular={regular ?? []}
    />
  );
}
