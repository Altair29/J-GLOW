import { createClient } from '@/lib/supabase/server';
import { TranslationsAdmin } from '@/components/admin/TranslationsAdmin';

export default async function TranslationsAdminPage() {
  const supabase = await createClient();

  const [{ data: uiTranslations }, { count: cacheCount }] = await Promise.all([
    supabase.from('ui_translations').select('*').order('key').order('lang'),
    supabase.from('translation_cache').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <TranslationsAdmin
      translations={uiTranslations || []}
      cacheCount={cacheCount || 0}
    />
  );
}
