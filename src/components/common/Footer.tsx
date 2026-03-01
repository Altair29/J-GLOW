import Link from 'next/link';
import type { NavigationItem } from '@/types/database';

type Props = {
  variant?: 'business' | 'worker' | 'default';
  bizNavItems?: NavigationItem[];
  wkrNavItems?: NavigationItem[];
  texts: Record<string, string>;
  theme: Record<string, string>;
};

const footerBizLinks = [
  { label: '企業向けトップ', href: '/business' },
  { label: 'はじめての外国人雇用', href: '/business/hiring-guide' },
  { label: '外国人スタッフ活用ハブ', href: '/business/existing-users' },
  { label: '育成就労ロードマップ', href: '/business/roadmap' },
];

const footerToolLinks = [
  { label: '外国人採用ナビゲーター', href: '/business/navigator' },
  { label: '採用計画コストシミュレーター', href: '/business/hiring-guide/cost-simulator' },
  { label: '労働条件通知書 生成ツール', href: '/business/tools/labor-notice' },
  { label: '現場指示書ビルダー', href: '/business/existing-users/connect/templates' },
  { label: '特定技能移行チェッカー', href: '/business/existing-users/ladder/checker' },
];

export function Footer({
  texts,
  theme,
}: Props) {
  return (
    <footer
      className="text-gray-300"
      style={{
        backgroundColor: theme['--color-footer-bg'] || '#111827',
        color: theme['--color-footer-text'] || '#9ca3af',
      }}
    >
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white text-lg font-bold mb-4">
              {texts.brand_name || 'J-GLOW'}
            </h3>
            <p className="text-sm" style={{ color: theme['--color-footer-text'] || '#9ca3af' }}>
              {texts.brand_desc || ''}
            </p>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              企業の方
            </h4>
            <ul className="space-y-2 text-sm">
              {footerBizLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              ツール
            </h4>
            <ul className="space-y-2 text-sm">
              {footerToolLinks.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm" style={{ color: theme['--color-footer-text'] || '#6b7280' }}>
          <div className="mb-3 flex items-center justify-center gap-4">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              プライバシーポリシー
            </Link>
            <span style={{ color: '#4b5563' }}>|</span>
            <Link href="/contact" className="hover:text-white transition-colors">
              お問い合わせ
            </Link>
          </div>
          <p>{texts.copyright || '© 2026 J-GLOW All Rights Reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
