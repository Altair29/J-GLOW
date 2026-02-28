interface Props {
  number: number;
  title: string;
  lead: string;
}

export default function StepHeader({ number, title, lead }: Props) {
  return (
    <div className="mb-8">
      <div className="mb-3 flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--primary)] font-countdown">
          {number}
        </span>
        <p className="text-xs font-bold uppercase tracking-widest text-[var(--accent)]">
          STEP {number}
        </p>
      </div>
      <h2 className="text-2xl font-bold text-[var(--foreground)] sm:text-3xl">
        {title}
      </h2>
      <p className="mt-3 text-base leading-relaxed text-[var(--muted-foreground)]">
        {lead}
      </p>
    </div>
  );
}
