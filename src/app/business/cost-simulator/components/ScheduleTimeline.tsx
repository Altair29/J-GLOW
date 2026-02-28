'use client';

import { useMemo } from 'react';
import type { VisaChoice, TargetChoice } from './CostSimulatorShell';

type TimelineStep = {
  label: string;
  monthOffset: number; // T-X
  durationText: string;
};

const IKUSEI_TIMELINE: TimelineStep[] = [
  { label: '監理団体との契約・加入手続き', monthOffset: -9, durationText: 'T-8〜9ヶ月' },
  { label: '受入要請', monthOffset: -8, durationText: 'T-7〜8ヶ月' },
  { label: '送出機関との契約・求人票作成', monthOffset: -7, durationText: 'T-6〜7ヶ月' },
  { label: '現地面接・内定', monthOffset: -6, durationText: 'T-5〜6ヶ月' },
  { label: '育成就労計画 認定申請', monthOffset: -4, durationText: 'T-3〜4ヶ月' },
  { label: '在留資格認定証明書 交付・査証取得', monthOffset: -2, durationText: 'T-1〜2ヶ月' },
  { label: '就労開始', monthOffset: 0, durationText: 'T（就労開始）' },
];

const TOKUTEI_KAIGAI_TIMELINE: TimelineStep[] = [
  { label: '候補者探し（人材エージェント・海外ハローワーク）', monthOffset: -6, durationText: 'T-5〜6ヶ月' },
  { label: '現地面接・内定', monthOffset: -5, durationText: 'T-4〜5ヶ月' },
  { label: '雇用契約・技能試験・日本語試験 確認', monthOffset: -4, durationText: 'T-3〜4ヶ月' },
  { label: '在留資格認定証明書 申請・入国前オリエンテーション', monthOffset: -3, durationText: 'T-2〜3ヶ月' },
  { label: '在留資格認定証明書 交付・査証申請・渡航', monthOffset: -2, durationText: 'T-1〜2ヶ月' },
  { label: '就労開始', monthOffset: 0, durationText: 'T（就労開始）' },
];

const TOKUTEI_KOKUNAI_TIMELINE: TimelineStep[] = [
  { label: '候補者探し・面接（ハローワーク・人材エージェント）', monthOffset: -3, durationText: 'T-3ヶ月' },
  { label: '雇用契約・在留資格 変更申請', monthOffset: -2, durationText: 'T-2ヶ月' },
  { label: '変更許可・就労前オリエンテーション', monthOffset: -1, durationText: 'T-1ヶ月' },
  { label: '就労開始（最短ここまで3ヶ月）', monthOffset: 0, durationText: 'T（就労開始）' },
];

type Props = {
  visaChoice: VisaChoice;
  targetChoice: TargetChoice;
  startDate: string; // YYYY-MM
};

function getMonthDiff(startYM: string): number {
  const [y, m] = startYM.split('-').map(Number);
  const target = new Date(y, m - 1, 1);
  const now = new Date();
  now.setDate(1);
  now.setHours(0, 0, 0, 0);
  return (target.getFullYear() - now.getFullYear()) * 12 + (target.getMonth() - now.getMonth());
}

function formatMonth(startDate: string, offset: number): string {
  const [y, m] = startDate.split('-').map(Number);
  const d = new Date(y, m - 1 + offset, 1);
  return `${d.getFullYear()}年${d.getMonth() + 1}月`;
}

function TimelineView({
  title,
  steps,
  startDate,
}: {
  title: string;
  steps: TimelineStep[];
  startDate: string;
}) {
  const monthsUntilStart = getMonthDiff(startDate);
  const firstStepOffset = steps[0].monthOffset;
  const isFeasible = monthsUntilStart >= Math.abs(firstStepOffset);

  // 最短開始可能月
  const earliestDate = useMemo(() => {
    const now = new Date();
    const earliest = new Date(now.getFullYear(), now.getMonth() + Math.abs(firstStepOffset), 1);
    return `${earliest.getFullYear()}年${earliest.getMonth() + 1}月`;
  }, [firstStepOffset]);

  return (
    <div className="space-y-3">
      <h4 className="font-bold text-[#1a2f5e] text-sm">{title}</h4>

      {/* 間に合うか判定 */}
      {isFeasible ? (
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-sm text-green-700">
            ✓ {formatMonth(startDate, 0)}に就労開始できます
          </p>
        </div>
      ) : (
        <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
          <p className="text-sm text-orange-700">
            ⚠️ ご希望の時期には間に合いません。最短で<strong>{earliestDate}</strong>就労開始が可能です
          </p>
        </div>
      )}

      {/* タイムライン */}
      <div className="relative pl-6">
        <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-gray-200" />
        {steps.map((step, i) => {
          const actualMonth = formatMonth(startDate, step.monthOffset);
          const stepMonthsFromNow = monthsUntilStart + step.monthOffset;
          const isCurrent = stepMonthsFromNow === 0;
          const isPast = stepMonthsFromNow < 0;
          const isGoal = step.monthOffset === 0;

          return (
            <div key={i} className={`relative pb-4 ${isPast && !isGoal ? 'opacity-40' : ''}`}>
              <div
                className={`absolute left-[-14px] w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs ${
                  isGoal
                    ? 'bg-[#c9a84c] border-[#c9a84c] text-white'
                    : isCurrent
                      ? 'bg-red-500 border-red-500 text-white'
                      : isPast
                        ? 'bg-gray-300 border-gray-300 text-white'
                        : 'bg-white border-[#1a2f5e] text-[#1a2f5e]'
                }`}
              >
                {isGoal ? '★' : isCurrent ? '!' : isPast ? '—' : i + 1}
              </div>
              <div className="ml-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full font-mono ${
                      isCurrent
                        ? 'bg-red-100 text-red-700'
                        : isGoal
                          ? 'bg-[#c9a84c]/20 text-[#8a6d2b]'
                          : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {actualMonth}
                  </span>
                  <span className="text-xs text-gray-400">{step.durationText}</span>
                </div>
                <p
                  className={`text-sm mt-1 ${
                    isPast && !isGoal ? 'line-through text-gray-400' : 'text-gray-700'
                  }`}
                >
                  {step.label}
                </p>
                {isCurrent && (
                  <span className="text-xs text-red-600 font-medium">⚠️ 今月このステップです</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ScheduleTimeline({ visaChoice, targetChoice, startDate }: Props) {
  const timelines: { title: string; steps: TimelineStep[] }[] = [];

  if (visaChoice === 'ikusei' || visaChoice === 'both') {
    timelines.push({ title: '育成就労', steps: IKUSEI_TIMELINE });
  }
  if (visaChoice === 'tokutei' || visaChoice === 'both') {
    if (targetChoice === 'kaigai' || targetChoice === 'both') {
      timelines.push({ title: '特定技能1号（海外在住）', steps: TOKUTEI_KAIGAI_TIMELINE });
    }
    if (targetChoice === 'kokunai' || targetChoice === 'both') {
      timelines.push({ title: '特定技能1号（国内在籍）', steps: TOKUTEI_KOKUNAI_TIMELINE });
    }
  }

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-bold text-[#1a2f5e]">逆算スケジュール</h3>
      <div className={`grid gap-8 ${timelines.length > 1 ? 'lg:grid-cols-2' : ''}`}>
        {timelines.map((t) => (
          <TimelineView key={t.title} title={t.title} steps={t.steps} startDate={startDate} />
        ))}
      </div>
    </div>
  );
}
