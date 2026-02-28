import type { Metadata } from 'next';
import TemplateBuilder from '@/components/business/TemplateBuilder';

export const metadata: Metadata = {
  title: '多言語 現場指示書ビルダー | J-GLOW',
  description:
    '5言語対応（日本語・ベトナム語・インドネシア語・英語・ミャンマー語）の現場指示書を業種別にカスタマイズして印刷。安全ルール・緊急時の対応・毎日のルール・よく使う言葉を選んでA4サイズで印刷できます。',
};

export default function TemplatesPage() {
  return <TemplateBuilder />;
}
