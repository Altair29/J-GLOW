import type { Metadata } from 'next';
import { LadderHeroSection } from '@/components/business/LadderHeroSection';
import { LadderStageOverview } from '@/components/business/LadderStageOverview';
import { LadderDiagnosticBanner } from '@/components/business/LadderDiagnosticBanner';
import { LadderContentGrid } from '@/components/business/LadderContentGrid';
import { LadderFooterCTA } from '@/components/business/LadderFooterCTA';
import { FadeUp } from '@/components/common/FadeUp';

export const metadata: Metadata = {
  title: '外国人材を育てる | J-GLOW',
  description:
    '入国直後から特定技能2号まで。在籍中の外国人スタッフのキャリアアップを支援する情報と診断ツールを提供します。',
};

export default function LadderHubPage() {
  return (
    <div>
      <LadderHeroSection />
      <FadeUp>
        <LadderStageOverview />
      </FadeUp>
      <FadeUp>
        <LadderDiagnosticBanner />
      </FadeUp>
      <FadeUp>
        <LadderContentGrid />
      </FadeUp>
      <FadeUp>
        <LadderFooterCTA />
      </FadeUp>
    </div>
  );
}
