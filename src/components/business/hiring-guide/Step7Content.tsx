import { retentionPoints } from '@/lib/hiring-guide-data';

const iconPaths = [
  "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z",
  "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
  "M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
];

export default function Step7Content() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {retentionPoints.map((point, i) => (
        <div
          key={point.title}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 transition-shadow hover:shadow-md"
        >
          <div className="mb-3 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--primary-muted)]">
              <svg className="h-5 w-5 text-[var(--primary)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d={iconPaths[i]} />
              </svg>
            </div>
            <h3 className="text-base font-bold text-[var(--foreground)]">
              {point.title}
            </h3>
          </div>
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)]">
            {point.description}
          </p>
        </div>
      ))}
    </div>
  );
}
