import { partnerCheckpoints, partnerWarnings } from '@/lib/hiring-guide-data';

export default function Step5Content() {
  return (
    <>
      {/* 監理団体の必要/不要の整理 */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-100 text-xs text-blue-700">
              要
            </span>
            監理支援機関が必要
          </h3>
          <ul className="space-y-1.5 text-sm text-[var(--muted-foreground)]">
            <li>・育成就労（監理支援機関の支援が必須）</li>
            <li>・技能実習（監理団体を通じた受け入れ）</li>
          </ul>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-[var(--foreground)]">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs text-emerald-700">
              任
            </span>
            任意（登録支援機関の利用可）
          </h3>
          <ul className="space-y-1.5 text-sm text-[var(--muted-foreground)]">
            <li>・特定技能（自社支援 or 登録支援機関に委託）</li>
            <li>・技術・人文知識・国際業務（直接雇用が一般的）</li>
            <li>・留学生採用（直接雇用が一般的）</li>
          </ul>
        </div>
      </div>

      {/* チェックポイント */}
      <h3 className="mb-4 text-lg font-bold text-[var(--foreground)]">
        選定時のチェックポイント
      </h3>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {partnerCheckpoints.map((point, i) => (
          <div
            key={point.title}
            className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-shadow hover:shadow-md"
          >
            <div className="mb-2 flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-muted)] text-xs font-bold text-[var(--accent)] font-countdown">
                {i + 1}
              </span>
              <h4 className="text-sm font-bold text-[var(--foreground)]">
                {point.title}
              </h4>
            </div>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
              {point.description}
            </p>
          </div>
        ))}
      </div>

      {/* 警告パターン */}
      <div className="mt-6 rounded-xl border border-rose-200 bg-rose-50 p-5">
        <h4 className="mb-3 text-sm font-bold text-rose-800">
          避けるべきパターン
        </h4>
        <ul className="space-y-2">
          {partnerWarnings.map((warning) => (
            <li
              key={warning}
              className="flex items-start gap-2 text-sm text-rose-700"
            >
              <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.5c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
              {warning}
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
