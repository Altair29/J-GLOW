import Link from 'next/link';
import { Building2, Users, ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';

export default async function HomePage() {
  const supabase = await createClient();
  const [texts, bizTheme, wkrTheme, globalTheme] = await Promise.all([
    getContentBlocks(supabase, 'top'),
    getThemeVars(supabase, 'business'),
    getThemeVars(supabase, 'worker'),
    getThemeVars(supabase, 'global'),
  ]);

  const bizBullets = (texts.biz_card_bullets || '').split('\n').filter(Boolean);
  const wkrBullets = (texts.wkr_card_bullets || '').split('\n').filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">J-GLOW</h1>
          <Link
            href="/login"
            className="text-sm px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
          >
            {texts.login_button || 'ログイン'}
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-4 py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="text-center mb-12 max-w-2xl">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {texts.main_heading || '外国人材と企業をつなぐプラットフォーム'}
          </h2>
          <p className="text-lg text-gray-600">
            {texts.sub_heading || 'あなたに合ったサービスをお選びください'}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl w-full">
          <Link
            href="/business"
            className="group relative text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            style={{ backgroundColor: bizTheme['--biz-primary'] || '#1e3a5f' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Building2 size={32} />
              </div>
              <h3 className="text-2xl font-bold">
                {texts.biz_card_title || '企業の方'}
              </h3>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              {texts.biz_card_desc || ''}
            </p>
            <ul className="space-y-2 text-sm text-white/70 mb-6">
              {bizBullets.map((b, i) => (
                <li key={i}>・ {b}</li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-white/90 font-medium group-hover:gap-3 transition-all">
              {texts.biz_card_cta || '企業向けページへ'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>

          <Link
            href="/worker"
            className="group relative text-white rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
            style={{ backgroundColor: wkrTheme['--wkr-primary'] || '#059669' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 bg-white/10 rounded-xl">
                <Users size={32} />
              </div>
              <h3 className="text-2xl font-bold">
                {texts.wkr_card_title || '働く方'}
              </h3>
            </div>
            <p className="text-white/80 mb-6 leading-relaxed">
              {texts.wkr_card_desc || ''}
            </p>
            <ul className="space-y-2 text-sm text-white/70 mb-6">
              {wkrBullets.map((b, i) => (
                <li key={i}>・ {b}</li>
              ))}
            </ul>
            <div className="flex items-center gap-2 text-white/90 font-medium group-hover:gap-3 transition-all">
              {texts.wkr_card_cta || 'For Workers / サポートページへ'}
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>
      </main>

      <footer style={{ backgroundColor: globalTheme['--color-footer-bg'] || '#111827' }} className="py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm" style={{ color: globalTheme['--color-footer-text'] || '#9ca3af' }}>
          <p>{texts.copyright || '© 2026 J-GLOW All Rights Reserved.'}</p>
        </div>
      </footer>
    </div>
  );
}
