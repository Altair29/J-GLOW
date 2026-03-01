import type { Metadata } from 'next';
import { ContinueHeroSection } from '@/components/business/ContinueHeroSection';
import { ContinueStageOverview } from '@/components/business/ContinueStageOverview';
import { ContinueContentGrid } from '@/components/business/ContinueContentGrid';
import { ContinueFooterCTA } from '@/components/business/ContinueFooterCTA';
import { FadeUp } from '@/components/common/FadeUp';

export const metadata: Metadata = {
  title: '続ける・判断する | J-GLOW',
  description:
    '外国人材の定着と制度対応——給与・キャリア・在留資格管理に向き合い、「この会社で長く働きたい」と思われる職場をつくるためのコンテンツを提供します。',
};

export default function ContinueHubPage() {
  return (
    <div>
      <ContinueHeroSection />
      <FadeUp>
        <ContinueStageOverview />
      </FadeUp>
      <FadeUp>
        <ContinueContentGrid />
      </FadeUp>
      <FadeUp>
        <ContinueFooterCTA />
      </FadeUp>
    </div>
  );
}
