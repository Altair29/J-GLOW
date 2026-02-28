import Link from 'next/link';
import { ArrowRight, ClipboardCheck } from 'lucide-react';

export function BusinessHubHero() {
  return (
    <section className="relative overflow-hidden">
      {/* ネイビーグラデーション背景 */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #1a2f5e 0%, #14254b 50%, #1a2f5e 100%)',
        }}
      />
      {/* 薄いゴールドのアクセントライン */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            'radial-gradient(ellipse at 70% 50%, #c9a84c 0%, transparent 60%)',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-20 md:py-28 text-center">
        <h1 className="font-[family-name:var(--font-heading)] text-3xl sm:text-4xl md:text-5xl font-bold leading-tight text-white mb-6">
          外国人スタッフを、もっと
          <br className="sm:hidden" />
          うまく活かせて
          <br />
          いますか？
        </h1>

        <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
          在留資格の種類を問わず、現場の「困った」を
          <br className="hidden md:block" />
          整理して、次の一手を一緒に考えましょう。
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/business/diagnosis"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-[#1a2f5e] text-base shadow-lg hover:-translate-y-0.5 hover:shadow-xl transition-all duration-200"
            style={{ backgroundColor: '#c9a84c' }}
          >
            <ClipboardCheck size={18} />
            まず現状を診断する
            <ArrowRight size={16} />
          </Link>
          <Link
            href="/business/contact"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-xl font-semibold text-white text-base border-2 border-white/30 hover:border-white/60 hover:-translate-y-0.5 transition-all duration-200"
          >
            まずは相談する
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
