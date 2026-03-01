export default function SimulatorCTA() {
  return (
    <div
      className="mt-8 rounded-2xl border-2 border-[var(--accent)] bg-gradient-to-r from-[var(--primary)] to-[var(--primary-light)] px-8 py-16 text-center text-white"
      role="region"
      aria-label="コストシミュレーター案内"
    >
      <p className="text-base font-medium text-[var(--accent)]">
        正確な費用は条件によって大きく異なります
      </p>
      <p className="mt-3 text-xl font-bold sm:text-2xl">
        業種・人数・国籍を入力して試算してみましょう
      </p>
      <a
        href="/business/navigator"
        className="mt-8 inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-12 py-5 text-xl font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl"
        aria-label="無料コストシミュレーターで試算する"
      >
        無料コストシミュレーターで試算する
        <span className="ml-3 text-2xl">→</span>
      </a>
    </div>
  );
}
