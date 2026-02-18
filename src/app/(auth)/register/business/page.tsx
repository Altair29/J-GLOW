import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { BusinessRegisterForm } from './BusinessRegisterForm';

export default async function BusinessRegisterPage() {
  const supabase = await createClient();
  const [texts, theme] = await Promise.all([
    getContentBlocks(supabase, 'register_business'),
    getThemeVars(supabase, 'business'),
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <BusinessRegisterForm texts={texts} theme={theme} />
    </div>
  );
}
