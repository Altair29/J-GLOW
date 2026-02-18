import { createClient } from '@/lib/supabase/server';
import { getNavItems, getThemeVars, getContentBlocks } from '@/lib/data';
import { WorkerHeader } from '@/components/worker/WorkerHeader';
import { Footer } from '@/components/common/Footer';
import { LangProvider } from '@/contexts/LangContext';

export default async function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const [headerNav, footerBizNav, footerWkrNav, wkrTheme, globalTheme, headerTexts, footerTexts] =
    await Promise.all([
      getNavItems(supabase, 'worker_header'),
      getNavItems(supabase, 'footer_business'),
      getNavItems(supabase, 'footer_worker'),
      getThemeVars(supabase, 'worker'),
      getThemeVars(supabase, 'global'),
      getContentBlocks(supabase, 'worker_header'),
      getContentBlocks(supabase, 'footer'),
    ]);

  const theme = { ...globalTheme, ...wkrTheme };

  /* サーバーサイドで認証状態を取得 */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let serverProfile: { role: string; display_name: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', user.id)
      .single();
    serverProfile = data;
  }

  return (
    <LangProvider>
      <div className="min-h-screen flex flex-col" style={{ backgroundColor: wkrTheme['--wkr-bg'] || '#f9fafb' }}>
        <WorkerHeader
          navItems={headerNav}
          texts={headerTexts}
          theme={theme}
          serverUser={user ? { email: user.email ?? '' } : null}
          serverProfile={serverProfile}
        />
        <main className="flex-1">{children}</main>
        <Footer
          variant="worker"
          bizNavItems={footerBizNav}
          wkrNavItems={footerWkrNav}
          texts={footerTexts}
          theme={theme}
        />
      </div>
    </LangProvider>
  );
}
