'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X } from 'lucide-react';
import type { NavigationItem } from '@/types/database';

type Props = {
  navItems: NavigationItem[];
  texts: Record<string, string>;
  theme: Record<string, string>;
};

export function BusinessHeader({ navItems, texts, theme }: Props) {
  const { user, profile, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header
      className="text-white shadow-lg"
      style={{ backgroundColor: theme['--biz-primary'] || '#1e3a5f' }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/business" className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight">
              {texts.brand_name || 'J-GLOW'}
            </span>
            <span className="text-xs bg-white/20 px-2 py-0.5 rounded">
              {texts.brand_badge || 'Business'}
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="px-3 py-2 text-sm rounded-md hover:bg-white/10 transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-white/70">
                  {profile?.display_name || user.email}
                </span>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-xs bg-amber-500 text-white px-2 py-1 rounded"
                  >
                    {texts.admin_link || '管理'}
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-sm px-3 py-1.5 border border-white/30 rounded-md hover:bg-white/10 transition-colors"
                >
                  {texts.logout_button || 'ログアウト'}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-sm px-4 py-1.5 bg-white rounded-md hover:bg-gray-100 transition-colors font-medium"
                style={{ color: theme['--biz-primary'] || '#1e3a5f' }}
              >
                {texts.login_button || 'ログイン'}
              </Link>
            )}
          </div>

          <button
            className="md:hidden p-2"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={texts.menu_label || 'メニュー'}
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block px-3 py-2 text-sm rounded-md hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
            <div className="border-t border-white/20 mt-2 pt-2">
              {user ? (
                <button
                  onClick={() => { signOut(); setMenuOpen(false); }}
                  className="block w-full text-left px-3 py-2 text-sm hover:bg-white/10 rounded-md"
                >
                  {texts.logout_button || 'ログアウト'}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2 text-sm hover:bg-white/10 rounded-md"
                  onClick={() => setMenuOpen(false)}
                >
                  {texts.login_button || 'ログイン'}
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
