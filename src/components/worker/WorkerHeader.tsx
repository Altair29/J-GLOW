'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { LangSelector } from './LangSelector';
import type { NavigationItem } from '@/types/database';

type Props = {
  navItems: NavigationItem[];
  texts: Record<string, string>;
  theme: Record<string, string>;
  serverUser?: { email: string } | null;
  serverProfile?: { role: string; display_name: string | null } | null;
};

export function WorkerHeader({ navItems, texts, theme, serverUser, serverProfile }: Props) {
  const { user: clientUser, profile: clientProfile, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = clientUser ?? (serverUser ? serverUser : null);
  const profile = clientProfile ?? serverProfile ?? null;
  const isAdmin = profile?.role === 'admin';

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── ロゴ ── */}
          <Link href="/worker" className="flex items-center gap-2.5 shrink-0">
            <span
              className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight"
              style={{ color: theme['--wkr-primary'] || '#059669' }}
            >
              {texts.brand_name || 'J-GLOW'}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{
                color: theme['--wkr-primary'] || '#059669',
                borderColor: theme['--wkr-primary'] || '#059669',
                opacity: 0.5,
              }}
            >
              {texts.brand_badge || 'Worker'}
            </span>
          </Link>

          {/* ── デスクトップナビ ── */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="px-4 py-2 text-[13px] font-medium tracking-wide text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/50 transition-all"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* ── 右側アクション ── */}
          <div className="hidden md:flex items-center gap-3 shrink-0">
            <LangSelector />
            {user ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-full"
                    style={{
                      backgroundColor: `${theme['--wkr-primary'] || '#059669'}15`,
                      color: theme['--wkr-primary'] || '#059669',
                    }}
                  >
                    <LayoutDashboard size={13} />
                    {texts.admin_link || '管理'}
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-[13px] px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
                >
                  {texts.logout_button || 'Logout'}
                </button>
              </>
            ) : loading ? (
              <div className="w-16 h-8 rounded-lg bg-slate-100 animate-pulse" />
            ) : (
              <Link
                href="/login"
                className="text-[13px] px-5 py-2 rounded-lg font-semibold text-white shadow-sm hover:shadow-md hover:-translate-y-px transition-all"
                style={{ backgroundColor: theme['--wkr-primary'] || '#059669' }}
              >
                {texts.login_button || 'Login'}
              </Link>
            )}
          </div>

          {/* ── モバイルハンバーガー ── */}
          <button
            className="md:hidden p-2 text-slate-600 rounded-lg hover:bg-white/60 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={texts.menu_label || 'Menu'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── モバイルメニュー ── */}
        {menuOpen && (
          <div className="md:hidden pb-4 border-t border-slate-200/60 pt-3 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-white/60 transition-colors"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="px-3 py-2">
              <LangSelector />
            </div>
            <div className="border-t border-slate-200/60 mt-2 pt-2">
              {user ? (
                <>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      className="flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-white/60"
                      onClick={() => setMenuOpen(false)}
                    >
                      <LayoutDashboard size={15} />
                      {texts.admin_link || '管理パネル'}
                    </Link>
                  )}
                  <button
                    onClick={() => { signOut(); setMenuOpen(false); }}
                    className="block w-full text-left px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 rounded-lg"
                  >
                    {texts.logout_button || 'Logout'}
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2.5 text-sm font-semibold rounded-lg"
                  style={{ color: theme['--wkr-primary'] || '#059669' }}
                  onClick={() => setMenuOpen(false)}
                >
                  {texts.login_button || 'Login'}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
