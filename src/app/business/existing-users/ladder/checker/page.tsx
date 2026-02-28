import type { Metadata } from 'next';
import { MigrationChecker } from '@/components/business/MigrationChecker';

export const metadata: Metadata = {
  title: '特定技能移行チェッカー | J-GLOW',
  description:
    '外国人スタッフの現状を入力するだけで、特定技能移行までの残りステップと企業側のToDoを確認できます。',
};

export default function CheckerPage() {
  return <MigrationChecker />;
}
