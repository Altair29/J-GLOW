export default function SubpageFooterCTA() {
  return (
    <div className="mt-16 rounded-xl bg-[var(--primary)] px-8 py-16 text-center text-white">
      <p className="mb-6 text-sm text-gray-300">次のステップ</p>
      <div className="flex flex-col items-center justify-center gap-6">
        <a
          href="/business/navigator"
          className="inline-flex items-center justify-center rounded-xl bg-[var(--accent)] px-12 py-5 text-xl font-bold text-white transition-all duration-200 hover:opacity-90 hover:shadow-xl"
          aria-label="無料コストシミュレーターで試算する"
        >
          無料コストシミュレーターで試算する
          <span className="ml-3 text-2xl">→</span>
        </a>
        <a
          href="/business/hiring-guide"
          className="inline-flex items-center justify-center rounded-lg border border-white px-6 py-3 font-medium text-white transition-colors hover:bg-white/10"
        >
          <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M11 17l-5-5m0 0l5-5m-5 5h12" />
          </svg>
          完全ガイドに戻る
        </a>
      </div>
    </div>
  );
}
