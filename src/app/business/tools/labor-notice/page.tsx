import type { Metadata } from 'next';
import LaborNoticeWizard from './LaborNoticeWizard';

export const metadata: Metadata = {
  title: '労働条件通知書ウィザード | J-GLOW',
  description:
    '外国人労働者向け労働条件通知書を8言語で自動生成。厚生労働省モデル様式に準拠したバイリンガルPDFを簡単に作成できます。',
};

export default function LaborNoticePage() {
  return <LaborNoticeWizard />;
}
