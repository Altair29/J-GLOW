import Link from 'next/link';
import type { NavigationItem } from '@/types/database';

type Props = {
  variant?: 'business' | 'worker' | 'default';
  bizNavItems: NavigationItem[];
  wkrNavItems: NavigationItem[];
  texts: Record<string, string>;
  theme: Record<string, string>;
};

const footerBizLinks = [
  { label: '企業向けトップ', href: '/business', external: false },
  { label: 'はじめての外国人雇用', href: '/business/hiring-guide', external: false },
  { label: '外国人スタッフをもっと活かすために', href: '/business/existing-users', external: false },
  { label: '育成就労ロードマップ', href: '/business/roadmap', external: false },
  { label: '外国人雇用コストシミュレーター', href: '/business/cost-simulator', external: false },
  { label: '外国人雇用の無料適正診断', href: '/business/existing-users/ladder#diagnostic', external: false },
];

export function Footer({
  variant = 'default',
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
              {texts.biz_section_title || '企業の方'}
            </h4>
            <ul className="space-y-2 text-sm">
              {footerBizLinks.map((item) =>
                item.external ? (
                  <li key={item.href}>
                    <a
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-white transition-colors"
                    >
                      {item.label}
                    </a>
                  </li>
                ) : (
                  <li key={item.href}>
                    <Link href={item.href} className="hover:text-white transition-colors">
                      {item.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm" style={{ color: theme['--color-footer-text'] || '#6b7280' }}>
          <div className="mb-3">
            <Link href="/privacy-policy" className="hover:text-white transition-colors">
              プライバシーポリシー
            </Link>
          </div>
          <p>{texts.copyright || '© 2026 J-GLOW All Rights Reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
