"use client";

import { useState, useEffect } from "react";
import type { Milestone } from './data';
import { milestoneTargetDates } from './data';

const statusStyles: Record<
  Milestone["status"],
  { dot: string; line: string; badge: string; badgeText: string }
> = {
  done: {
    dot: "bg-[var(--status-done)] border-emerald-200",
    line: "bg-[var(--status-done)]",
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    badgeText: "完了",
  },
  current: {
    dot: "bg-[var(--status-current)] border-blue-200 ring-4 ring-[var(--primary-muted)]",
    line: "bg-[var(--border)]",
    badge: "bg-[var(--primary-muted)] text-[var(--primary)] border-[var(--primary)]/20",
    badgeText: "進行中",
  },
  upcoming: {
    dot: "bg-[var(--status-upcoming)] border-slate-200",
    line: "bg-[var(--border)]",
    badge: "bg-slate-50 text-slate-500 border-slate-200",
    badgeText: "予定",
  },
  target: {
    dot: "bg-[var(--status-target)] border-amber-200 ring-4 ring-amber-100",
    line: "bg-[var(--border)]",
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    badgeText: "目標",
  },
};

function formatRemainingTime(targetDate: Date): string {
  const today = new Date();
  const diff = targetDate.getTime() - today.getTime();
  if (diff <= 0) return "期限到来";

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;

  if (months === 0) return `あと${days}日`;
  if (days === 0) return `あと${months}ヶ月`;
  return `あと${months}ヶ月${days}日`;
}

function RemainingDays({ label }: { label: string }) {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
  }, []);

  if (!now) return null;

  const target = milestoneTargetDates[label];
  if (!target) return null;

  if (target.to) {
    const fromText = formatRemainingTime(target.from);
    const toText = formatRemainingTime(target.to);
    // Both expired
    if (fromText === "期限到来" && toText === "期限到来") return null;
    return (
      <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
        推定 {fromText}〜{toText}
      </span>
    );
  }

  const text = formatRemainingTime(target.from);
  if (text === "期限到来") return null;
  return (
    <span className="inline-flex items-center gap-1 rounded bg-amber-50 border border-amber-200 px-1.5 py-0.5 text-[11px] font-medium text-amber-700">
      {text}
    </span>
  );
}

function MilestoneItem({
  milestone,
  isLast,
}: {
  milestone: Milestone;
  isLast: boolean;
}) {
  const s = statusStyles[milestone.status];
  const showRemaining =
    milestone.status === "upcoming" || milestone.status === "target";

  return (
    <div className="relative flex gap-4 pb-6 last:pb-0">
      <div className="flex flex-col items-center">
        <div
          className={`h-4 w-4 rounded-full border-2 shrink-0 ${s.dot}`}
        />
        {!isLast && <div className={`w-0.5 flex-1 mt-1 ${s.line}`} />}
      </div>

      <div className="flex-1 -mt-0.5">
        <div className="flex flex-wrap items-center gap-2 mb-0.5">
          <h3 className="text-sm font-bold text-[var(--foreground)]">
            {milestone.label}
          </h3>
          <span
            className={`inline-block rounded-full border px-2 py-0.5 text-[10px] font-medium leading-none ${s.badge}`}
          >
            {s.badgeText}
          </span>
          {showRemaining && <RemainingDays label={milestone.label} />}
        </div>
        <p className="text-[11px] text-[var(--muted-foreground)] mb-0.5">
          {milestone.date}
        </p>
        <p className="text-xs text-[var(--subtle)]">{milestone.detail}</p>
        {milestone.source && (
          <p className="text-[10px] text-[var(--subtle)] mt-0.5">
            出典: {milestone.source}
          </p>
        )}
      </div>
    </div>
  );
}

export default function TimelineSection({
  milestones,
}: {
  milestones: Milestone[];
}) {
  const [showDone, setShowDone] = useState(true);

  const doneItems = milestones.filter((m) => m.status === "done");
  const activeItems = milestones.filter((m) => m.status !== "done");
  const doneCount = doneItems.length;

  return (
    <section className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 shadow-sm">
      <div className="border-l-4 border-[var(--primary)] pl-3 mb-4">
        <h2 className="font-sans text-xl font-extrabold text-slate-800 tracking-normal mb-1 flex items-center gap-2">
          📅 制度施行タイムライン
        </h2>
      </div>

      <div className="relative">
        {/* 完了済み: デフォルト展開・折りたたみ可能 */}
        {doneCount > 0 && (
          <div className="mb-4">
            <button
              onClick={() => setShowDone(!showDone)}
              className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-3 py-2 text-sm font-medium text-emerald-700 transition-colors hover:bg-emerald-100 w-full mb-3"
            >
              <span
                className={`inline-block transition-transform duration-200 ${
                  showDone ? "rotate-90" : ""
                }`}
              >
                ▶
              </span>
              {showDone
                ? `完了済みを折りたたむ`
                : `完了済み ${doneCount}件を展開する`}
            </button>

            {showDone && (
              <div className="ml-1">
                {doneItems.map((m, i) => (
                  <MilestoneItem
                    key={m.id}
                    milestone={m}
                    isLast={i === doneItems.length - 1}
                  />
                ))}
              </div>
            )}

            {/* 折りたたみ時の接続ライン */}
            {!showDone && (
              <div className="flex justify-start ml-[7px] mb-1">
                <div className="w-0.5 h-4 bg-[var(--status-done)]" />
              </div>
            )}
          </div>
        )}

        {/* current / upcoming / target: 常時展開 */}
        {activeItems.map((m, i) => (
          <MilestoneItem
            key={m.id}
            milestone={m}
            isLast={i === activeItems.length - 1}
          />
        ))}
      </div>
    </section>
  );
}
