'use client';

import Link from 'next/link';
import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import type { NavigationItem } from '@/types/database';

type Props = {
  navItems?: NavigationItem[];
  texts: Record<string, string>;
  theme: Record<string, string>;
};

type NavLinkItem = { label: string; href: string };

const toolItems: NavLinkItem[] = [
  { label: '外国人採用ナビゲーター', href: '/business/navigator' },
  { label: '採用計画コストシミュレーター', href: '/business/hiring-guide/cost-simulator' },
  { label: '経営シミュレーション', href: '/business/management-sim' },
  { label: '労働条件通知書 生成ツール', href: '/business/tools/labor-notice' },
  { label: '現場指示書ビルダー', href: '/business/existing-users/connect/templates' },
  { label: '特定技能移行チェッカー', href: '/business/existing-users/ladder/checker' },
  { label: '外国人雇用 適正診断', href: '/business/existing-users/ladder#diagnostic' },
];

const guideItems: NavLinkItem[] = [
  { label: 'はじめての外国人雇用', href: '/business/hiring-guide' },
  { label: '外国人スタッフ活用ハブ', href: '/business/existing-users' },
  { label: '育成就労ロードマップ', href: '/business/roadmap' },
  { label: '全19分野 解説', href: '/business/articles' },
  { label: '19分野 制度比較マップ', href: '/business/articles/industry-overview' },
  { label: '助成金情報', href: '/business/subsidies' },
  { label: 'パートナー検索', href: '/business/partners' },
  { label: 'お問い合わせ', href: '/business/contact' },
];

function truncateName(name: string, max = 8) {
  return name.length > max ? name.slice(0, max) + '…' : name;
}

/* ========================================
   UserArea — ログイン / ユーザードロップダウン
   ======================================== */
function UserArea() {
  const { user, profile, loading, signOut } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  if (loading) {
    return <div className="w-20 h-8 rounded-md bg-white/20 animate-pulse" />;
  }

  if (!user) {
    const loginHref = pathname && pathname !== '/'
      ? `/login?redirectTo=${encodeURIComponent(pathname)}`
      : '/login';
    return (
      <Link
        href={loginHref}
        className="px-4 py-1.5 rounded-md border border-white/80 text-white text-sm font-medium hover:bg-white hover:text-[#1a2f5e] transition-colors whitespace-nowrap"
      >
        ログイン
      </Link>
    );
  }

  const displayName =
    profile?.display_name ??
    user.user_metadata?.display_name ??
    user.user_metadata?.full_name ??
    user.user_metadata?.name ??
    user.email?.split('@')[0] ??
    'ユーザー';

  const handleLogout = () => {
    setOpen(false);
    router.push('/');
    signOut();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-white/40 text-white text-sm hover:bg-white/10 transition-colors"
      >
        <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5.121 17.804A7 7 0 0112 15a7 7 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span className="text-sm">{truncateName(displayName)}</span>
        <ChevronDown size={12} className={`opacity-70 flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-44 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1">
          {profile?.role === 'admin' && (
            <Link
              href="/admin"
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => setOpen(false)}
            >
              管理パネル
            </Link>
          )}
          <Link
            href="/business/mypage"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
            onClick={() => setOpen(false)}
          >
            マイページ
          </Link>
          <hr className="my-1 border-gray-100" />
          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            ログアウト
          </button>
        </div>
      )}
    </div>
  );
}

/* ========================================
   DesktopDropdown — クリック開閉のみ
   ======================================== */
function DesktopDropdown({
  label,
  items,
}: {
  label: string;
  items: NavLinkItem[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        className="flex items-center gap-1 text-white/90 hover:text-white py-2 text-sm transition-colors whitespace-nowrap"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label}
        <ChevronDown
          size={14}
          className={`opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="absolute top-full left-0 pt-1 z-50">
          <div className="w-56 bg-white rounded-lg shadow-xl border border-gray-100 py-1">
            {items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#1a2f5e]/5 hover:text-[#1a2f5e] transition-colors"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ========================================
   ヘッダー本体
   ======================================== */
export function BusinessHeader({ texts, theme }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const primary = theme['--biz-primary'] || '#1a2f5e';
  const accent = theme['--biz-accent'] || '#c9a84c';

  return (
    <header className="sticky top-0 z-50 text-white" style={{ backgroundColor: primary }}>
      <div className="flex items-center justify-between w-full px-4 h-16">
        {/* 左：ロゴ */}
        <Link href="/business" className="font-bold text-lg tracking-wide flex-shrink-0 flex items-center gap-1.5">
          <span style={{ color: accent }}>{texts.brand_name || 'J-GLOW'}</span>
          <span className="text-white/70 text-sm font-normal">{texts.brand_badge || 'Business'}</span>
        </Link>

        {/* 中央：デスクトップナビ（lg以上） */}
        <nav className="hidden lg:flex items-center gap-6 text-sm mx-8">
          <DesktopDropdown label="ツール" items={toolItems} />
          <DesktopDropdown label="ガイド・情報" items={guideItems} />
        </nav>

        {/* 右：検索 + UserArea + ハンバーガー */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/business/search"
            className="p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="サイト検索"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </Link>
          <UserArea />
          <button
            className="lg:hidden p-2 rounded hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'メニューを閉じる' : 'メニューを開く'}
          >
            {menuOpen ? (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── モバイル・タブレットメニュー（lg未満） ── */}
      {menuOpen && (
        <div className="lg:hidden border-t border-white/20 px-4 pb-4" style={{ backgroundColor: primary }}>
          <div className="pt-3">
            <p className="text-xs font-bold uppercase tracking-wider mb-2 px-2" style={{ color: accent }}>
              ツール
            </p>
            <ul className="space-y-0.5">
              {toolItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="pt-3 mt-2 border-t border-white/20">
            <Link
              href="/business/search"
              onClick={() => setMenuOpen(false)}
              className="flex items-center gap-2 py-2 px-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors mb-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              サイト検索
            </Link>
            <p className="text-xs font-bold uppercase tracking-wider mb-2 px-2" style={{ color: accent }}>
              ガイド・情報
            </p>
            <ul className="space-y-0.5">
              {guideItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className="block py-2 px-2 text-sm text-white/80 hover:text-white hover:bg-white/10 rounded transition-colors"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
}
