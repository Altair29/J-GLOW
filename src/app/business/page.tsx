import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getThemeVars } from '@/lib/data';
import { FadeUp } from '@/components/common/FadeUp';
import ToolsSection from './ToolsSection';
import GuidanceSection from './GuidanceSection';
import InsightSection from './InsightSection';
import ProfessionalsSection from './ProfessionalsSection';

export default async function BusinessPage() {
  const supabase = await createClient();

  const theme = await getThemeVars(supabase, 'business');

  return (
    <div>
      {/* ========================================
          [1] ヒーロー（縮小版）
          ======================================== */}
      <section className="relative min-h-[360px] md:min-h-[50vh] flex items-center overflow-hidden">
        <Image
          src="/images/hero-1.png"
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 hero-overlay" />

        <FadeUp duration={0.8} distance={40} className="relative z-10 max-w-5xl mx-auto px-4 py-16 md:py-20 text-center">
          <h1
            className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl font-bold leading-tight max-w-2xl mx-auto mb-4"
            style={{ color: theme['--biz-hero-text-dark'] || '#1a2f5e' }}
          >
            あなたの会社の外国人雇用を、<br className="hidden sm:block" />
            もう一段階先へ。
          </h1>
          <p
            className="font-[family-name:var(--font-heading)] text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto mb-3"
            style={{ color: theme['--biz-hero-text-dark'] || '#1a2f5e', opacity: 0.75 }}
          >
            グローバル人材の熱量(Glow)を、日本の新たな成長力(Grow)に。
          </p>
          <p
            className="text-xs sm:text-sm max-w-2xl mx-auto mb-8"
            style={{ color: theme['--biz-hero-subtext'] || '#4a5568', opacity: 0.5 }}
          >
            Japan and Global: Talent Glowing and Growing Together
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/business/navigator"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-200"
              style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
            >
              自社に合う外国人採用を診断
              <ArrowRight size={14} />
            </Link>
            <Link
              href="/business/hiring-guide"
              className="inline-flex items-center gap-2 px-7 py-3 rounded-lg font-semibold text-sm border-2 hover:-translate-y-0.5 transition-all duration-200 bg-white/30 backdrop-blur-sm"
              style={{ borderColor: '#1a2f5e', color: '#1a2f5e' }}
            >
              採用ガイドを見る
              <ArrowRight size={14} />
            </Link>
          </div>
        </FadeUp>
      </section>

      {/* ========================================
          [2] GUIDANCE — あなたの状況に合わせてお選びください
          ======================================== */}
      <FadeUp>
        <GuidanceSection />
      </FadeUp>

      {/* ========================================
          [3] TOOLS — 外国人雇用の実務を、ゼロコストで効率化
          ======================================== */}
      <FadeUp>
        <ToolsSection />
      </FadeUp>

      {/* ========================================
          [4] INSIGHT — 数字から見る、外国人雇用の今と未来
          ======================================== */}
      <FadeUp>
        <InsightSection />
      </FadeUp>

      {/* ========================================
          [5] 監理団体・士業の方へ
          ======================================== */}
      <FadeUp>
        <ProfessionalsSection />
      </FadeUp>
    </div>
  );
}
