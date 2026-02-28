import type { Metadata } from 'next';
import { ConnectHeroSection } from '@/components/business/ConnectHeroSection';
import { ConnectStageOverview } from '@/components/business/ConnectStageOverview';
import { ConnectContentGrid } from '@/components/business/ConnectContentGrid';
import { ConnectTemplateBanner } from '@/components/business/ConnectTemplateBanner';
import { ConnectFooterCTA } from '@/components/business/ConnectFooterCTA';

export const metadata: Metadata = {
  title: '外国人材とつながる | J-GLOW',
  description:
    '外国人スタッフの日本語力が上がるのを待つより、「伝わる仕組み」を先につくる。コミュニケーション改善のためのコンテンツを提供します。',
};

export default function ConnectHubPage() {
  return (
    <div>
      <ConnectHeroSection />
      <ConnectStageOverview />
      <ConnectContentGrid />
      <ConnectTemplateBanner />
      <ConnectFooterCTA />
    </div>
  );
}
