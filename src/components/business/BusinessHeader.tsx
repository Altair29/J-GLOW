'use client';

import Link from 'next/link';
import { useState, useRef, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Menu, X, ChevronDown } from 'lucide-react';
import { getIcon } from '@/lib/icons';
import type { NavigationItem } from '@/types/database';

type Props = {
  navItems: NavigationItem[];
  texts: Record<string, string>;
  theme: Record<string, string>;
};

/* ========================================
   ナビゲーション構造定義
   DB の navItems を href でグルーピング
   ======================================== */
const featureHrefs = ['/business/simulation', '/business/existing-users/ladder#diagnostic', '/business/ikusei', '/business/existing-users', '/business/tools/labor-notice', '/business/cost-simulator'];
const resourceHrefs = ['/business/subsidies', '/business/partners'];

function groupNavItems(items: NavigationItem[]) {
  const features: NavigationItem[] = [];
  const resources: NavigationItem[] = [];
  for (const item of items) {
    if (featureHrefs.includes(item.href)) features.push(item);
    else if (resourceHrefs.includes(item.href)) resources.push(item);
  }

  return { features, resources };
}

/* ========================================
   ドロップダウンコンポーネント
   ======================================== */
function NavDropdown({
  label,
  items,
  theme,
}: {
  label: string;
  items: NavigationItem[];
  theme: Record<string, string>;
}) {
  const [open, setOpen] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const enter = useCallback(() => {
    if (timeout.current) clearTimeout(timeout.current);
    setOpen(true);
  }, []);

  const leave = useCallback(() => {
    timeout.current = setTimeout(() => setOpen(false), 150);
  }, []);

  /* キーボード ESC で閉じる */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    if (open) document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={enter}
      onMouseLeave={leave}
    >
      <button
        className="flex items-center gap-1 px-4 py-2 text-[13px] font-medium tracking-wide text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/50 transition-all"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={14}
          className={`opacity-50 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {/* ドロップダウンパネル */}
      <div
        className={`absolute top-full left-1/2 -translate-x-1/2 pt-2 transition-all duration-200 ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="glass-dropdown rounded-xl py-2 min-w-[240px] shadow-xl">
          {items.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-white/60 transition-colors"
                onClick={() => setOpen(false)}
              >
                {Icon && (
                  <span
                    className="shrink-0 p-1.5 rounded-lg"
                    style={{
                      backgroundColor:
                        theme['--biz-primary']
                          ? `${theme['--biz-primary']}12`
                          : 'rgba(26,47,94,0.07)',
                    }}
                  >
                    <Icon
                      size={16}
                      style={{ color: theme['--biz-primary'] || '#1a2f5e' }}
                    />
                  </span>
                )}
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ========================================
   ヘッダー本体
   ======================================== */
export function BusinessHeader({ navItems, texts, theme }: Props) {
  const { user, profile, loading, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);

  const { features, resources } = groupNavItems(navItems);

  return (
    <header className="sticky top-0 z-50 glass-header">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── ロゴ ── */}
          <Link href="/business" className="flex items-center gap-2.5 mr-10 lg:mr-14 shrink-0">
            <span
              className="font-[family-name:var(--font-heading)] text-xl font-bold tracking-tight"
              style={{ color: theme['--biz-primary'] || '#1a2f5e' }}
            >
              {texts.brand_name || 'J-GLOW'}
            </span>
            <span
              className="text-[10px] font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full border"
              style={{
                color: theme['--biz-primary'] || '#1a2f5e',
                borderColor: theme['--biz-primary'] || '#1a2f5e',
                opacity: 0.5,
              }}
            >
              {texts.brand_badge || 'Business'}
            </span>
          </Link>

          {/* ── デスクトップナビ ── */}
          <nav className="hidden lg:flex items-center gap-1 flex-1">
            {/* サービス概要 */}
            <Link
              href="/business"
              className="px-4 py-2 text-[13px] font-medium tracking-wide text-slate-600 hover:text-slate-900 rounded-lg hover:bg-white/50 transition-all"
            >
              {texts.nav_home || 'サービス概要'}
            </Link>

            {/* 主要機能 ドロップダウン */}
            {features.length > 0 && (
              <NavDropdown
                label={texts.nav_features || '主要機能'}
                items={features}
                theme={theme}
              />
            )}

            {/* リソース ドロップダウン */}
            {resources.length > 0 && (
              <NavDropdown
                label={texts.nav_resources || 'リソース'}
                items={resources}
                theme={theme}
              />
            )}

          </nav>

          {/* ── 右側アクション ── */}
          <div className="hidden lg:flex items-center gap-3 shrink-0 ml-6">
            {loading ? (
              <div className="w-20 h-8 rounded-lg bg-slate-100 animate-pulse" />
            ) : user ? (
              <>
                <span className="text-sm text-slate-500 max-w-[140px] truncate">
                  {profile?.display_name || user.email}
                </span>
                {profile?.role === 'admin' && (
                  <Link
                    href="/admin"
                    className="text-xs font-semibold bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full"
                  >
                    {texts.admin_link || '管理'}
                  </Link>
                )}
                <button
                  onClick={signOut}
                  className="text-[13px] px-3.5 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:text-slate-700 hover:border-slate-300 transition-colors"
                >
                  {texts.logout_button || 'ログアウト'}
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="text-[13px] px-5 py-2 rounded-lg font-semibold text-white shadow-sm hover:shadow-md hover:-translate-y-px transition-all"
                style={{ backgroundColor: theme['--biz-primary'] || '#1a2f5e' }}
              >
                {texts.login_button || 'ログイン'}
              </Link>
            )}
          </div>

          {/* ── モバイルハンバーガー ── */}
          <button
            className="lg:hidden p-2 text-slate-600 rounded-lg hover:bg-white/60 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={texts.menu_label || 'メニュー'}
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {/* ── モバイルメニュー ── */}
        {menuOpen && (
          <div className="lg:hidden pb-4 border-t border-slate-200/60 pt-3 space-y-1">
            {/* サービス概要 */}
            <Link
              href="/business"
              className="block px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-white/60 transition-colors"
              onClick={() => setMenuOpen(false)}
            >
              {texts.nav_home || 'サービス概要'}
            </Link>

            {/* 主要機能 (アコーディオン) */}
            {features.length > 0 && (
              <MobileAccordion
                label={texts.nav_features || '主要機能'}
                items={features}
                expanded={mobileExpanded === 'features'}
                onToggle={() =>
                  setMobileExpanded((v) => (v === 'features' ? null : 'features'))
                }
                onNavigate={() => setMenuOpen(false)}
              />
            )}

            {/* リソース (アコーディオン) */}
            {resources.length > 0 && (
              <MobileAccordion
                label={texts.nav_resources || 'リソース'}
                items={resources}
                expanded={mobileExpanded === 'resources'}
                onToggle={() =>
                  setMobileExpanded((v) => (v === 'resources' ? null : 'resources'))
                }
                onNavigate={() => setMenuOpen(false)}
              />
            )}

            {/* ログイン/ログアウト */}
            <div className="border-t border-slate-200/60 mt-2 pt-2">
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-3 py-2.5 text-sm text-slate-500 hover:text-slate-700 rounded-lg"
                >
                  {texts.logout_button || 'ログアウト'}
                </button>
              ) : (
                <Link
                  href="/login"
                  className="block px-3 py-2.5 text-sm font-semibold rounded-lg"
                  style={{ color: theme['--biz-primary'] || '#1a2f5e' }}
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

/* ========================================
   モバイル用アコーディオン
   ======================================== */
function MobileAccordion({
  label,
  items,
  expanded,
  onToggle,
  onNavigate,
}: {
  label: string;
  items: NavigationItem[];
  expanded: boolean;
  onToggle: () => void;
  onNavigate: () => void;
}) {
  return (
    <div>
      <button
        className="flex items-center justify-between w-full px-3 py-2.5 text-sm font-medium text-slate-700 rounded-lg hover:bg-white/60 transition-colors"
        onClick={onToggle}
      >
        {label}
        <ChevronDown
          size={16}
          className={`text-slate-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
        />
      </button>
      {expanded && (
        <div className="pl-4 space-y-0.5 mt-0.5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="block px-3 py-2 text-sm text-slate-500 hover:text-slate-800 rounded-lg hover:bg-white/50 transition-colors"
              onClick={onNavigate}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
