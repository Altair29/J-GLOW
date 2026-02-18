import { createClient } from '@/lib/supabase/server';
import { getNavItems, getThemeVars, getContentBlocks } from '@/lib/data';
import { WorkerHeader } from '@/components/worker/WorkerHeader';
import { Footer } from '@/components/common/Footer';

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

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: wkrTheme['--wkr-bg'] || '#f9fafb' }}>
      <WorkerHeader navItems={headerNav} texts={headerTexts} theme={theme} />
      <main className="flex-1">{children}</main>
      <Footer
        variant="worker"
        bizNavItems={footerBizNav}
        wkrNavItems={footerWkrNav}
        texts={footerTexts}
        theme={theme}
      />
    </div>
  );
}
