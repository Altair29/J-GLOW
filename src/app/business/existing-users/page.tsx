import type { Metadata } from 'next';
import { BusinessHubHero } from '@/components/business/BusinessHubHero';
import { ExistingUsersInteractive } from '@/components/business/ExistingUsersInteractive';
import { BusinessHubTimeline } from '@/components/business/BusinessHubTimeline';
import { BusinessHubCTA } from '@/components/business/BusinessHubCTA';

export const metadata: Metadata = {
  title: '外国人雇用 改善サポート | J-GLOW',
  description:
    '外国人材を既に受け入れている企業向けのサポートハブ。人材育成、コミュニケーション改善、制度変更への対応を支援します。',
};

export default function ExistingUsersHubPage() {
  return (
    <div>
      {/* 1. ヒーロー */}
      <BusinessHubHero />

      {/* 2. あるある共感カード + 3. 解決の地図（インタラクティブ） */}
      <ExistingUsersInteractive />

      {/* 4. 制度変更タイムライン */}
      <BusinessHubTimeline />

      {/* 5. 監理団体への相談CTA */}
      <BusinessHubCTA />
    </div>
  );
}
