import { timelineItems } from '@/lib/hiring-guide-data';

export default function Step6Content() {
  return (
    <div className="relative">
      {/* タイムラインライン */}
      <div className="absolute left-[1.125rem] top-2 bottom-2 w-0.5 bg-[var(--border)] sm:left-[4.5rem]" />

      <div className="space-y-8">
        {timelineItems.map((item, i) => (
          <div key={item.timing} className="relative flex gap-4 sm:gap-6">
            {/* タイミングラベル（デスクトップ） */}
            <div className="hidden w-16 shrink-0 pt-1 text-right sm:block">
              <span className="text-xs font-bold text-[var(--accent)] font-countdown">
                {item.timing}
              </span>
            </div>

            {/* ドット */}
            <div className="relative z-10 flex shrink-0 items-start pt-1.5">
              <div
                className={`h-4 w-4 rounded-full border-2 ${
                  i === timelineItems.length - 1
                    ? "border-[var(--accent)] bg-[var(--accent)]"
                    : "border-[var(--primary)] bg-[var(--surface)]"
                }`}
              />
            </div>

            {/* コンテンツ */}
            <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 transition-shadow hover:shadow-md">
              {/* タイミングラベル（モバイル） */}
              <span className="mb-2 inline-block text-xs font-bold text-[var(--accent)] font-countdown sm:hidden">
                {item.timing}
              </span>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                {item.title}
              </h3>
              <ul className="mt-3 space-y-2">
                {item.tasks.map((task) => (
                  <li
                    key={task}
                    className="flex items-start gap-2 text-sm text-[var(--muted-foreground)]"
                  >
                    <svg className="mt-0.5 h-4 w-4 shrink-0 text-[var(--subtle)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                    {task}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
