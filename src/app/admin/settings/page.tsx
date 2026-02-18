import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ThemeEditor } from '@/components/admin/ThemeEditor';

export default async function AdminSettingsPage() {
  const supabase = await createClient();

  const [{ count: globalCount }, { count: bizCount }, { count: wkrCount }] = await Promise.all([
    supabase.from('theme_config').select('*', { count: 'exact', head: true }).eq('section', 'global'),
    supabase.from('theme_config').select('*', { count: 'exact', head: true }).eq('section', 'business'),
    supabase.from('theme_config').select('*', { count: 'exact', head: true }).eq('section', 'worker'),
  ]);

  const sections = [
    { href: '/admin/settings/business', title: '企業セクション設定', desc: 'テーマカラー、テキスト、ナビゲーション', count: bizCount ?? 0 },
    { href: '/admin/settings/worker', title: '労働者セクション設定', desc: 'テーマカラー、テキスト、ナビゲーション', count: wkrCount ?? 0 },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">サイト設定</h2>

      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">グローバルテーマ ({globalCount ?? 0} 項目)</h3>
        <ThemeEditor section="global" />
      </div>

      <h3 className="text-lg font-semibold text-gray-800 mb-4">セクション別設定</h3>
      <div className="grid md:grid-cols-2 gap-4">
        {sections.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
          >
            <h4 className="font-bold text-gray-900 mb-1">{s.title}</h4>
            <p className="text-sm text-gray-500 mb-2">{s.desc}</p>
            <span className="text-xs text-gray-400">{s.count} テーマ項目</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
