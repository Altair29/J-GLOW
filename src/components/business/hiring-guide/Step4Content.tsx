import { costCategories } from '@/lib/hiring-guide-data';
import SimulatorCTA from "./SimulatorCTA";

const colorStyles: Record<string, { border: string; bg: string; text: string }> = {
  blue: { border: "border-l-blue-500", bg: "bg-blue-50", text: "text-blue-700" },
  emerald: { border: "border-l-emerald-500", bg: "bg-emerald-50", text: "text-emerald-700" },
  amber: { border: "border-l-amber-500", bg: "bg-amber-50", text: "text-amber-700" },
};

export default function Step4Content() {
  return (
    <>
      <div className="space-y-6">
        {costCategories.map((cat) => {
          const style = colorStyles[cat.color] ?? colorStyles.blue;
          return (
            <div
              key={cat.category}
              className={`rounded-xl border border-[var(--border)] border-l-4 ${style.border} bg-[var(--surface)] p-6`}
            >
              <div className="mb-4 flex items-center gap-2">
                <span className="text-xl">{cat.icon}</span>
                <h3 className="text-lg font-bold text-[var(--foreground)]">
                  {cat.category}
                </h3>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {cat.items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-start justify-between gap-3 rounded-lg bg-[var(--surface-muted)] p-3"
                  >
                    <span className="text-sm text-[var(--foreground)]">
                      {item.name}
                    </span>
                    <span
                      className={`shrink-0 rounded-md px-2.5 py-0.5 text-xs font-bold ${style.bg} ${style.text}`}
                    >
                      {item.range}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <SimulatorCTA />
    </>
  );
}
