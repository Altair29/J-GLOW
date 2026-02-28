"use client";

import { useEffect, useState } from "react";

interface TimeLeft {
  months: number;
  days: number;
  hours: number;
  minutes: number;
}

function calcTimeLeft(target: string): TimeLeft {
  const diff = new Date(target).getTime() - Date.now();
  if (diff <= 0) return { months: 0, days: 0, hours: 0, minutes: 0 };
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const months = Math.floor(totalDays / 30);
  const days = totalDays % 30;
  return {
    months,
    days,
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
  };
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

export default function CountdownSection({
  targetDate,
}: {
  targetDate: string;
  targetLabel?: string;
  targetDisplay?: string;
}) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(calcTimeLeft(targetDate));
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    setTimeLeft(calcTimeLeft(targetDate));
    const id = setInterval(() => setTimeLeft(calcTimeLeft(targetDate)), 60_000);
    return () => clearInterval(id);
  }, [targetDate]);

  return (
    <section className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 shadow-sm">
      {/* 施行日バッジ */}
      <div className="text-center mb-4">
        <span className="inline-block bg-amber-100 text-amber-800 border border-amber-300 rounded-full px-6 py-2 text-lg font-bold tracking-wide">
          2027年4月1日（木）施行
        </span>
      </div>

      {/* 「育成就労制度 施行まで」ラベル */}
      <p className="text-center text-base text-[var(--muted-foreground)] mb-2">
        育成就労制度 施行まで
      </p>

      {/* カウントダウン数字 */}
      <div className="flex justify-center items-end gap-4">
        <div className="text-center">
          <span className="font-countdown text-5xl sm:text-6xl font-bold text-[var(--primary)]">
            {mounted ? timeLeft.months : "--"}
          </span>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">ヶ月</p>
        </div>
        <span className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-3">:</span>
        <div className="text-center">
          <span className="font-countdown text-5xl sm:text-6xl font-bold text-[var(--primary)]">
            {mounted ? timeLeft.days : "--"}
          </span>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">日</p>
        </div>
        <span className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-3">:</span>
        <div className="text-center">
          <span className="font-countdown text-5xl sm:text-6xl font-bold text-[var(--primary)]">
            {mounted ? pad(timeLeft.hours) : "--"}
          </span>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">時間</p>
        </div>
        <span className="text-3xl sm:text-4xl font-bold text-[var(--primary)] mb-3">:</span>
        <div className="text-center">
          <span className="font-countdown text-5xl sm:text-6xl font-bold text-[var(--primary)]">
            {mounted ? pad(timeLeft.minutes) : "--"}
          </span>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">分</p>
        </div>
      </div>
    </section>
  );
}
