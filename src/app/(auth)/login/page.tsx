import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { LoginForm } from './LoginForm';

export default async function LoginPage() {
  const supabase = await createClient();
  const [texts, bizTheme, wkrTheme] = await Promise.all([
    getContentBlocks(supabase, 'login'),
    getThemeVars(supabase, 'business'),
    getThemeVars(supabase, 'worker'),
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <LoginForm texts={texts} bizTheme={bizTheme} wkrTheme={wkrTheme} />
    </div>
  );
}
