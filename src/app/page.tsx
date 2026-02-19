import Link from 'next/link';
import Image from 'next/image';
import { Building2, Users, ArrowRight, LayoutDashboard } from 'lucide-react';
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

  /* 認証状態をサーバーサイドで取得 */
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let profile: { role: string; display_name: string | null } | null = null;
  if (user) {
    const { data } = await supabase
      .from('profiles')
      .select('role, display_name')
      .eq('id', user.id)
      .single();
    profile = data;
  }

  const isAdmin = profile?.role === 'admin';
  const bizBullets = (texts.biz_card_bullets || '').split('\n').filter(Boolean);
  const wkrBullets = (texts.wkr_card_bullets || '').split('\n').filter(Boolean);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ========================================
          Floating Glass Header
          ======================================== */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-header">
        <div className="max-w-7xl mx-auto px-4 lg:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight text-slate-900"
          >
            J-GLOW
          </Link>

          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden sm:inline text-sm text-slate-500 max-w-[160px] truncate">
                  {profile?.display_name || user.email}
                </span>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-[13px] font-semibold px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
                  >
                    <LayoutDashboard size={14} />
                    管理パネル
                  </Link>
                )}
                <Link
                  href="/business"
                  className="text-[13px] font-medium px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-white/60 hover:text-slate-900 transition-all"
                >
                  企業ページへ
                </Link>
              </>
            ) : (
              <Link
                href="/login"
                className="font-[family-name:var(--font-heading)] text-[13px] font-semibold px-5 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                {texts.login_button || 'ログイン'}
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ========================================
          Hero Section — 写真 + グラスモーフィズムパネル
          ======================================== */}
      <section className="relative min-h-[100svh] flex items-end pb-20 sm:pb-24 md:items-center md:pb-0">
        {/* 背景画像 */}
        <Image
          src="/images/hero-top.png"
          alt=""
          fill
          priority
          className="object-cover object-[center_30%] sm:object-[center_35%] md:object-center"
        />

        {/* 薄いブルーグレーオーバーレイ (12%) */}
        <div className="absolute inset-0 bg-slate-700/[0.12]" />

        {/* モバイル下部グラデーション（テキスト可読性確保） */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/25 via-black/10 to-transparent md:hidden" />

        {/* キャッチコピー パネル */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 lg:px-8 md:py-24 flex justify-center">
          <div className="glass rounded-2xl p-8 sm:p-10 md:p-12 max-w-xl animate-fade-in-up text-center">
            <h1 className="font-[family-name:var(--font-heading)] text-2xl sm:text-3xl md:text-[2.5rem] font-bold leading-tight text-slate-900 mb-4">
              {texts.main_heading || '外国人材と企業をつなぐプラットフォーム'}
            </h1>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed mb-8">
              {texts.sub_heading || 'あなたに合ったサービスをお選びください'}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/business"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-[family-name:var(--font-heading)] font-semibold text-white text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: bizTheme['--biz-primary'] || '#1e3a5f' }}
              >
                {texts.hero_cta_biz || '企業の方はこちら'}
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/worker"
                className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-[family-name:var(--font-heading)] font-semibold text-white text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
                style={{ backgroundColor: wkrTheme['--wkr-primary'] || '#059669' }}
              >
                {texts.hero_cta_wkr || 'For Foreign Residents'}
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================
          Portal Cards Section — 企業/働く方 入口
          ======================================== */}
      <section className="py-20 md:py-28 bg-gradient-to-b from-slate-50 to-white">
        <div className="max-w-5xl mx-auto px-4 lg:px-8">
          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-center text-slate-900 mb-3">
            {texts.section_heading || 'あなたに合ったサービスをお選びください'}
          </h2>
          <p className="text-center text-slate-500 text-sm md:text-base mb-16 max-w-lg mx-auto leading-relaxed">
            {texts.section_sub || '企業の方・働く方、それぞれに特化したサポートを提供します。'}
          </p>

          <div className="grid md:grid-cols-2 gap-8 md:gap-10">
            {/* ── 企業向けカード ── */}
            <Link
              href="/business"
              className="group relative text-white rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              style={{ backgroundColor: bizTheme['--biz-primary'] || '#1e3a5f' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Building2 size={28} strokeWidth={1.8} />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                  {texts.biz_card_title || '企業の方'}
                </h3>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed text-sm">
                {texts.biz_card_desc || ''}
              </p>
              {bizBullets.length > 0 && (
                <ul className="space-y-2.5 text-sm text-white/70 mb-8">
                  {bizBullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-2 text-white/90 font-[family-name:var(--font-heading)] font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                {texts.biz_card_cta || '企業向けページへ'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>

            {/* ── 働く方カード ── */}
            <Link
              href="/worker"
              className="group relative text-white rounded-2xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1.5"
              style={{ backgroundColor: wkrTheme['--wkr-primary'] || '#059669' }}
            >
              <div className="flex items-center gap-3 mb-5">
                <div className="p-3 bg-white/10 rounded-xl">
                  <Users size={28} strokeWidth={1.8} />
                </div>
                <h3 className="font-[family-name:var(--font-heading)] text-2xl font-bold">
                  {texts.wkr_card_title || '働く方'}
                </h3>
              </div>
              <p className="text-white/80 mb-6 leading-relaxed text-sm">
                {texts.wkr_card_desc || ''}
              </p>
              {wkrBullets.length > 0 && (
                <ul className="space-y-2.5 text-sm text-white/70 mb-8">
                  {wkrBullets.map((b, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="shrink-0 mt-1.5 w-1.5 h-1.5 rounded-full bg-white/40" />
                      {b}
                    </li>
                  ))}
                </ul>
              )}
              <div className="flex items-center gap-2 text-white/90 font-[family-name:var(--font-heading)] font-semibold text-sm group-hover:gap-3 transition-all mt-auto">
                {texts.wkr_card_cta || 'For Foreign Residents / サポートページへ'}
                <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* ========================================
          Footer
          ======================================== */}
      <footer
        className="py-10"
        style={{ backgroundColor: globalTheme['--color-footer-bg'] || '#111827' }}
      >
        <div
          className="max-w-7xl mx-auto px-4 text-center text-sm"
          style={{ color: globalTheme['--color-footer-text'] || '#9ca3af' }}
        >
          <p className="font-[family-name:var(--font-heading)]">
            {texts.copyright || '© 2026 J-GLOW All Rights Reserved.'}
          </p>
        </div>
      </footer>
    </div>
  );
}
