export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-[var(--primary)] text-white">
      {/* 背景装飾 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute -top-24 -right-24 h-96 w-96 rounded-full bg-[var(--accent)]" />
        <div className="absolute -bottom-32 -left-16 h-80 w-80 rounded-full bg-[var(--accent)]" />
      </div>

      <div className="relative mx-auto max-w-5xl px-6 py-20 sm:py-28">
        <p className="mb-4 text-sm font-medium tracking-wider text-[var(--accent)] uppercase">
          J-GLOW for Business
        </p>
        <h1 className="text-3xl font-bold leading-tight sm:text-4xl lg:text-5xl">
          はじめての外国人雇用
          <br />
          <span className="text-[var(--accent)]">完全ガイド</span>
        </h1>
        <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/80 sm:text-lg">
          制度の選び方から費用・準備まで、採用担当者と経営者のために全工程を解説
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row">
          <a
            href="/business/cost-simulator"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--accent-light)]"
            aria-label="最適な在留資格×費用を確認する - コストシミュレーターページへ"
          >
            最適な在留資格×費用を確認する
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
          <a
            href="#step-2"
            className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-3.5 text-sm font-bold text-white transition-colors hover:border-white/60 hover:bg-white/10"
            aria-label="まず制度を比較する - STEP2へスクロール"
          >
            まず制度を比較する
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
