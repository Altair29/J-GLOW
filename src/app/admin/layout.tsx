import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getNavItems, getContentBlocks } from '@/lib/data';
import { getIcon } from '@/lib/icons';
import type { NavigationItem } from '@/types/database';

// editor が表示できるサイドバー項目のパス
const EDITOR_ALLOWED_HREFS = ['/admin', '/admin/blog'];

function isEditorAllowed(item: NavigationItem): boolean {
  return EDITOR_ALLOWED_HREFS.some(
    (p) => item.href === p || item.href.startsWith(p + '/')
  );
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const [sidebarItems, footerTexts, { data: { user } }] = await Promise.all([
    getNavItems(supabase, 'admin_sidebar'),
    getContentBlocks(supabase, 'footer'),
    supabase.auth.getUser(),
  ]);

  // ロール取得
  let role = 'admin';
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();
    role = profile?.role ?? 'admin';
  }

  const isEditor = role === 'editor';
  const visibleItems = isEditor
    ? sidebarItems.filter(isEditorAllowed)
    : sidebarItems;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-64 bg-gray-900 text-white flex-shrink-0">
        <div className="p-4 border-b border-gray-700">
          <Link href="/admin" className="text-lg font-bold">
            J-GLOW Admin
          </Link>
          {/* ロールバッジ */}
          <span
            className="ml-2 inline-block text-[10px] font-bold px-2 py-0.5 rounded"
            style={{
              backgroundColor: isEditor ? '#c9a84c' : '#3b82f6',
              color: '#fff',
            }}
          >
            {isEditor ? 'EDITOR' : 'ADMIN'}
          </span>
        </div>
        <nav className="p-4 space-y-1">
          {visibleItems.map((item) => {
            const Icon = getIcon(item.icon);
            return (
              <Link
                key={item.id}
                href={item.href}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-gray-800 transition-colors"
              >
                {Icon && <Icon size={16} />}
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-gray-700 mt-auto">
          <Link
            href="/"
            className="block text-sm text-gray-400 hover:text-white transition-colors"
          >
            {footerTexts.back_to_site || '← サイトに戻る'}
          </Link>
        </div>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <h1 className="text-lg font-semibold text-gray-900">管理パネル</h1>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
