import type { Metadata } from 'next';
import { Geist, Geist_Mono, Noto_Sans_JP, Montserrat } from 'next/font/google';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

const notoSansJP = Noto_Sans_JP({
  variable: '--font-noto-sans-jp',
  weight: ['400', '500', '700'],
  subsets: ['latin'],
  preload: false,
});

const montserrat = Montserrat({
  variable: '--font-montserrat',
  weight: ['400', '500', '600', '700'],
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'J-GLOW | 外国人材と企業をつなぐ総合プラットフォーム',
  description:
    '外国人材の適正な受入れを支援する総合プラットフォーム。企業向けコンプライアンス支援と、外国人労働者向け生活サポートを提供します。',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${montserrat.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
