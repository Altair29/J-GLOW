import { createClient } from '@/lib/supabase/server';
import { getThemeVars } from '@/lib/data';
import { PartnerDirectory } from '@/components/business/PartnerDirectory';
import type { Partner } from '@/types/database';

export const metadata = {
  title: 'パートナー検索 | J-GLOW',
  description: '外国人雇用に精通した監理団体・行政書士・登録支援機関を検索',
};

export default async function PartnersPage() {
  const supabase = await createClient();

  const [theme, { data: partners }] = await Promise.all([
    getThemeVars(supabase, 'business'),
    supabase
      .from('partners')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
  ]);

  return (
    <div>
      {/* ヒーロー */}
      <section
        className="py-16"
        style={{
          background: `linear-gradient(135deg, ${theme['--biz-primary'] || '#1a2f5e'} 0%, #0f1d3d 100%)`,
          color: '#ffffff',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">パートナー検索</h1>
          <p className="text-lg opacity-80">
            外国人雇用に精通した専門機関を探す
          </p>
        </div>
      </section>

      <PartnerDirectory partners={(partners as Partner[]) || []} theme={theme} />
    </div>
  );
}
