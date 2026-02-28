export default function IntroSection() {
  const steps = [
    { num: 1, label: "背景を知る" },
    { num: 2, label: "制度を選ぶ" },
    { num: 3, label: "要件確認" },
    { num: 4, label: "費用試算" },
    { num: 5, label: "パートナー" },
    { num: 6, label: "受入準備" },
    { num: 7, label: "定着支援" },
  ];

  return (
    <>
      <section className="mx-auto max-w-3xl px-6 py-16 text-center">
        <p className="text-base leading-relaxed text-[var(--muted-foreground)] sm:text-lg">
          人手不足が深刻化する中、外国人労働者の採用を検討する企業が増えています。しかし、どの制度を使えばいいのか、費用はどのくらいかかるのか、手続きはどれほど複雑なのか——初めての企業にとって不明点だらけです。このガイドでは、制度の選び方から受け入れ準備・定着支援まで、
          <strong className="text-[var(--foreground)]">採用の全工程を7ステップで解説</strong>
          します。
        </p>
      </section>

      {/* プロセスフロー型ナビゲーション */}
      <nav
        className="bg-[var(--primary)] py-8"
        aria-label="ステップナビゲーション"
      >
        <div className="mx-auto max-w-5xl overflow-x-auto px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex min-w-max items-center justify-between gap-1">
            {steps.map((s, i) => (
              <div key={s.num} className="flex items-center gap-1">
                <a
                  href={`#step-${s.num}`}
                  className="flex cursor-pointer flex-col items-center rounded-lg px-4 py-3 transition-colors hover:bg-white/10"
                >
                  <span className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
                    STEP {s.num}
                  </span>
                  <span className="mt-1 text-sm font-medium text-white">
                    {s.label}
                  </span>
                </a>
                {i < steps.length - 1 && (
                  <span className="text-lg text-[var(--accent)] opacity-60 select-none">
                    ›
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
