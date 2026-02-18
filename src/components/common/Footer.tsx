import Link from 'next/link';
import type { NavigationItem } from '@/types/database';

type Props = {
  variant?: 'business' | 'worker' | 'default';
  bizNavItems: NavigationItem[];
  wkrNavItems: NavigationItem[];
  texts: Record<string, string>;
  theme: Record<string, string>;
};

export function Footer({
  variant = 'default',
  bizNavItems,
  wkrNavItems,
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
              {texts.biz_section_title || '企業の方'}
            </h4>
            <ul className="space-y-2 text-sm">
              {bizNavItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
              {texts.wkr_section_title || '働く方'}
            </h4>
            <ul className="space-y-2 text-sm">
              {wkrNavItems.map((item) => (
                <li key={item.id}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm" style={{ color: theme['--color-footer-text'] || '#6b7280' }}>
          {variant !== 'default' && (
            <div className="mb-4">
              {variant === 'business' ? (
                <Link href="/worker" className="hover:opacity-80 transition-opacity" style={{ color: theme['--wkr-primary'] || '#34d399' }}>
                  {texts.cross_link_to_worker || '外国人労働者の方はこちら →'}
                </Link>
              ) : (
                <Link href="/business" className="hover:opacity-80 transition-opacity" style={{ color: theme['--biz-secondary'] || '#60a5fa' }}>
                  {texts.cross_link_to_business || '企業の方はこちら →'}
                </Link>
              )}
            </div>
          )}
          <p>{texts.copyright || '© 2026 J-GLOW All Rights Reserved.'}</p>
        </div>
      </div>
    </footer>
  );
}
