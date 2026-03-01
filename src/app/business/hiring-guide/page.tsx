import type { Metadata } from "next";
import { steps } from "@/lib/hiring-guide-data";
import HeroSection from "@/components/business/hiring-guide/HeroSection";
import IntroSection from "@/components/business/hiring-guide/IntroSection";
import StepHeader from "@/components/business/hiring-guide/StepHeader";
import RelatedArticles from "@/components/business/hiring-guide/RelatedArticles";
import Step1Content from "@/components/business/hiring-guide/Step1Content";
import Step2Content from "@/components/business/hiring-guide/Step2Content";
import Step3Content from "@/components/business/hiring-guide/Step3Content";
import Step4Content from "@/components/business/hiring-guide/Step4Content";
import Step5Content from "@/components/business/hiring-guide/Step5Content";
import Step6Content from "@/components/business/hiring-guide/Step6Content";
import Step7Content from "@/components/business/hiring-guide/Step7Content";
import SummarySection from "@/components/business/hiring-guide/SummarySection";
import DoubleCTASection from "@/components/business/hiring-guide/DoubleCTASection";
import { FadeUp } from "@/components/common/FadeUp";

export const metadata: Metadata = {
  title: "はじめての外国人雇用 完全ガイド【7ステップ】| J-GLOW",
  description:
    "外国人雇用を初めて検討する企業向けに、制度の選び方から費用・受け入れ準備・定着支援まで全工程を解説。育成就労・特定技能・技術人文国際・留学生採用の比較も。",
};

/* 将来的にSupabaseのblog_postsから動的取得に変更予定 */
const stepContentMap: Record<number, React.ReactNode> = {
  1: <Step1Content />,
  2: <Step2Content />,
  3: <Step3Content />,
  4: <Step4Content />,
  5: <Step5Content />,
  6: <Step6Content />,
  7: <Step7Content />,
};

export default function HiringGuidePage() {
  return (
    <main>
      <HeroSection />
      <FadeUp delay={0.1}>
        <IntroSection />
      </FadeUp>

      {/* 7ステップ セクション */}
      {steps.map((step) => (
        <FadeUp key={step.id}>
          <section
            id={step.id}
            className={`py-16 ${step.number % 2 === 0 ? "bg-[var(--surface-muted)]" : ""}`}
          >
            <div className="mx-auto max-w-5xl px-6">
              <StepHeader
                number={step.number}
                title={step.title}
                lead={step.lead}
              />
              {stepContentMap[step.number]}
              <RelatedArticles articles={step.relatedArticles} />
            </div>
          </section>
        </FadeUp>
      ))}

      <FadeUp>
        <SummarySection />
      </FadeUp>
      <FadeUp>
        <DoubleCTASection />
      </FadeUp>
    </main>
  );
}
