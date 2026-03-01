export default function DoubleCTASection() {
  return (
    <section className="bg-[var(--primary)]" aria-label="アクションセクション">
      <div className="mx-auto grid max-w-5xl gap-0 sm:grid-cols-2">
        {/* 左: コストシミュレーター */}
        <div className="flex flex-col items-center justify-center border-b border-white/10 p-10 text-center sm:border-b-0 sm:border-r">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-muted)]">
            <svg className="h-7 w-7 text-[var(--accent)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 15.75V18m-7.5-6.75h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm0 2.25h.008v.008H8.25v-.008zm2.498-6h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008h-.008v-.008zm0 2.25h.008v.008h-.008v-.008zm2.25-4.5h.008v.008H15v-.008zm0 2.25h.008v.008H15v-.008zM4.5 21h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15A2.25 2.25 0 002.25 6.75v12A2.25 2.25 0 004.5 21z" />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-bold text-white">
            最適な在留資格×費用を確認する
          </h3>
          <p className="mb-6 text-sm text-white/60">
            業種・人数・国籍から概算費用を無料で試算
          </p>
          <a
            href="/business/navigator"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-8 py-3.5 text-sm font-bold text-[var(--primary)] transition-colors hover:bg-[var(--accent-light)]"
            aria-label="外国人採用ナビゲーターへ"
          >
            無料で試算する
            <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </a>
        </div>

        {/* 右: 無料登録 */}
        <div className="flex flex-col items-center justify-center p-10 text-center">
          <h3 className="mb-6 text-lg font-bold text-white">
            無料登録でできること
          </h3>
          <div className="mb-8 grid w-full gap-3 sm:grid-cols-1 lg:grid-cols-3">
            <div className="rounded-lg border border-white/15 px-4 py-4">
              <span className="mb-1 block text-2xl">📋</span>
              <p className="text-xs leading-relaxed text-white/80">受け入れ準備チェックリスト（PDF）をダウンロード</p>
            </div>
            <div className="rounded-lg border border-white/15 px-4 py-4">
              <span className="mb-1 block text-2xl">📊</span>
              <p className="text-xs leading-relaxed text-white/80">在留資格別コスト比較表（Excel）をダウンロード</p>
            </div>
            <div className="rounded-lg border border-white/15 px-4 py-4">
              <span className="mb-1 block text-2xl">📩</span>
              <p className="text-xs leading-relaxed text-white/80">制度改正・お役立ち情報をメールで受け取る</p>
            </div>
          </div>
          <a
            href="/register"
            className="inline-flex items-center justify-center rounded-lg bg-[var(--accent)] px-10 py-4 text-lg font-bold text-[var(--primary)] transition-colors hover:bg-[var(--accent-light)]"
            aria-label="J-GLOWに無料登録する"
          >
            無料で登録する
            <span className="ml-2 text-xl">→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
