import Link from 'next/link';
import { ArrowRight, Building } from 'lucide-react';

export function BusinessHubCTA() {
  return (
    <section
      className="py-16 md:py-20"
      style={{ backgroundColor: '#f7f8fb' }}
    >
      <div className="max-w-3xl mx-auto px-4 text-center">
        <div
          className="rounded-2xl p-8 md:p-12"
          style={{
            background:
              'linear-gradient(135deg, #1a2f5e 0%, #14254b 100%)',
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'rgba(201, 168, 76, 0.15)' }}
          >
            <Building size={28} strokeWidth={1.5} style={{ color: '#c9a84c' }} />
          </div>

          <h2 className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl font-bold text-white mb-4">
            まずはご相談ください
          </h2>
          <p className="text-white/70 text-sm md:text-base leading-relaxed mb-8 max-w-lg mx-auto">
            制度変更への対応、現場の課題整理、人材の定着戦略まで。
            <br className="hidden md:block" />
            貴社の状況に合わせた具体的なアドバイスを提供します。
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/business/contact"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-[#1a2f5e] text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
              style={{ backgroundColor: '#c9a84c' }}
            >
              相談する
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/business/diagnosis"
              className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white text-base border-2 border-white/30 hover:border-white/60 hover:-translate-y-0.5 transition-all duration-200"
            >
              まず自社診断から始める
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
