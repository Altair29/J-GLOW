import { steps } from '@/lib/hiring-guide-data';

export default function SummarySection() {
  return (
    <section className="mx-auto max-w-5xl px-6 py-16">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-8 sm:p-10">
        <h2 className="mb-2 text-center text-2xl font-bold text-[var(--foreground)]">
          まとめ
        </h2>
        <p className="mb-8 text-center text-sm text-[var(--muted-foreground)]">
          どのステップから始めますか？
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <a
              key={step.id}
              href={`#${step.id}`}
              className="group flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface-muted)] p-4 transition-all hover:border-[var(--accent)] hover:shadow-sm"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--primary)] font-countdown transition-transform group-hover:scale-110">
                {step.number}
              </span>
              <span className="text-sm font-medium text-[var(--foreground)]">
                {step.title}
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
