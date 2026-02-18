import { createClient } from '@/lib/supabase/server';
import { getNavItems, getThemeVars, getContentBlocks } from '@/lib/data';
import { BusinessHeader } from '@/components/business/BusinessHeader';
import { Footer } from '@/components/common/Footer';

export default async function BusinessLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const [headerNav, footerBizNav, footerWkrNav, bizTheme, globalTheme, headerTexts, footerTexts] =
    await Promise.all([
      getNavItems(supabase, 'business_header'),
      getNavItems(supabase, 'footer_business'),
      getNavItems(supabase, 'footer_worker'),
      getThemeVars(supabase, 'business'),
      getThemeVars(supabase, 'global'),
      getContentBlocks(supabase, 'business_header'),
      getContentBlocks(supabase, 'footer'),
    ]);

  const theme = { ...globalTheme, ...bizTheme };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: bizTheme['--biz-bg'] || '#f8fafc' }}>
      <BusinessHeader navItems={headerNav} texts={headerTexts} theme={theme} />
      <main className="flex-1">{children}</main>
      <Footer
        variant="business"
        bizNavItems={footerBizNav}
        wkrNavItems={footerWkrNav}
        texts={footerTexts}
        theme={theme}
      />
    </div>
  );
}
