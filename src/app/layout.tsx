import type { Metadata } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { Geist, Geist_Mono, Noto_Sans_JP, Space_Mono } from 'next/font/google';
import { ActivityLogProvider } from '@/components/ActivityLogProvider';
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
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  preload: false,
});

const spaceMono = Space_Mono({
  variable: '--font-space-mono',
  weight: ['400', '700'],
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
        className={`${geistSans.variable} ${geistMono.variable} ${notoSansJP.variable} ${spaceMono.variable} antialiased`}
      >
        <ActivityLogProvider>{children}</ActivityLogProvider>
        <GoogleAnalytics gaId="G-K3J8QS3EQ3" />
      </body>
    </html>
  );
}
