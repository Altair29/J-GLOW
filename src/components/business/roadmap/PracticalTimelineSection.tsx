"use client";

import { useState, useEffect } from "react";

// ===== 型定義 =====
type Persona = "管理団体" | "受入企業" | null;

type PracticalItem = {
  id: string;
  year: number;
  month: number;
  actor: "管理団体" | "受入企業" | "両方";
  title: string;
  urgency: "critical" | "warning" | "upcoming" | "target" | "deadline";
  targetDate: Date | null;
  targetDateTo?: Date;
  isContinuation?: boolean;
  lateWarning?: string;
};

const items: PracticalItem[] = [
  { id: "p4a", year: 2026, month: 4, actor: "管理団体", title: "監理支援機関 許可申請 受付開始（4/15〜）", urgency: "upcoming", targetDate: new Date("2026-04-15") },
  { id: "p1", year: 2026, month: 5, actor: "管理団体", title: "定款変更・登記完了", urgency: "critical", targetDate: new Date("2026-05-31"), lateWarning: "定款変更に2〜3ヶ月かかるため今すぐ着手必須" },
  { id: "p2", year: 2026, month: 6, actor: "管理団体", title: "監理支援責任者・外部監査人 選任完了", urgency: "critical", targetDate: new Date("2026-06-30"), lateWarning: "遅れると許可申請が秋以降にずれ込む" },
  { id: "p3", year: 2026, month: 6, actor: "受入企業", title: "技能実習 最終計画認定申請", urgency: "warning", targetDate: new Date("2026-06-30") },
  { id: "p4b", year: 2026, month: 7, actor: "管理団体", title: "★ 許可申請書 提出 締切目安", urgency: "deadline", targetDate: new Date("2026-07-31"), lateWarning: "⚠️ これ以降は2027年4月施行に間に合わない可能性があります" },
  { id: "p0a", year: 2026, month: 7, actor: "受入企業", title: "📌 育成就労 受入要請の締切", urgency: "deadline", targetDate: new Date("2026-07-31"), lateWarning: "⚠️ これ以降の要請は2027年4月配置が困難になります" },
  { id: "p5", year: 2026, month: 8, actor: "受入企業", title: "技能実習 COE申請（最終入国ロット）", urgency: "warning", targetDate: new Date("2026-08-31") },
  { id: "p6", year: 2026, month: 8, actor: "受入企業", title: "送出国機関との面接・候補者選定", urgency: "warning", targetDate: new Date("2026-08-31") },
  { id: "p7a", year: 2026, month: 8, actor: "管理団体", title: "審査中", urgency: "upcoming", targetDate: null, isContinuation: true },
  { id: "p7b", year: 2026, month: 9, actor: "管理団体", title: "審査中", urgency: "upcoming", targetDate: null, isContinuation: true },
  { id: "p7c", year: 2026, month: 10, actor: "管理団体", title: "審査中", urgency: "upcoming", targetDate: null, isContinuation: true },
  { id: "p8a", year: 2026, month: 9, actor: "受入企業", title: "育成就労計画 認定申請 受付開始（9/1〜）", urgency: "upcoming", targetDate: new Date("2026-09-01") },
  { id: "p9", year: 2026, month: 11, actor: "管理団体", title: "監理支援機関 許可取得（想定）", urgency: "upcoming", targetDate: new Date("2026-11-30") },
  { id: "p10", year: 2026, month: 11, actor: "管理団体", title: "育成就労計画 作成指導 開始", urgency: "upcoming", targetDate: new Date("2026-11-30") },
  { id: "p8b", year: 2026, month: 12, actor: "受入企業", title: "★ 育成就労計画 認定申請 締切目安", urgency: "deadline", targetDate: new Date("2026-12-31"), lateWarning: "⚠️ 開始予定日の4ヶ月前が実質的な締切" },
  { id: "p11", year: 2026, month: 12, actor: "受入企業", title: "育成就労計画 認定取得（想定）", urgency: "upcoming", targetDate: new Date("2026-12-31") },
  { id: "p12", year: 2027, month: 1, actor: "管理団体", title: "育成就労計画 認定申請（2027年4月分）", urgency: "warning", targetDate: new Date("2027-01-31"), lateWarning: "⚠️ これを逃すと4月施行時に受入れ不可" },
  { id: "p13", year: 2027, month: 4, actor: "両方", title: "COE交付申請（施行当日から受付開始）", urgency: "target", targetDate: new Date("2027-04-01") },
  { id: "p14", year: 2027, month: 6, actor: "受入企業", title: "育成就労外国人 来日・就労開始", urgency: "target", targetDate: new Date("2027-06-30") },
];

// 月リスト生成（2026年4月〜2027年7月）
type MonthEntry = { year: number; month: number; label: string };
const months: MonthEntry[] = [];
for (let y = 2026, m = 4; !(y === 2027 && m === 8); m++) {
  if (m > 12) { m = 1; y++; }
  const yearLabel = m === 4 ? `${y}年` : "";
  months.push({ year: y, month: m, label: `${yearLabel}${m}月` });
}

const urgencyIcon: Record<string, string> = {
  critical: "🔴",
  warning: "🟠",
  upcoming: "🔵",
  target: "⭐",
};

function formatRemainingTime(targetDate: Date): string | null {
  const today = new Date();
  const diff = targetDate.getTime() - today.getTime();
  if (diff <= 0) return null;

  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  const mo = Math.floor(totalDays / 30);
  const d = totalDays % 30;

  if (mo === 0) return `あと${d}日`;
  if (d === 0) return `あと${mo}ヶ月`;
  return `あと${mo}ヶ月${d}日`;
}

function ItemCell({ item }: { item: PracticalItem }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (item.isContinuation) {
    return (
      <div className="flex items-center gap-1.5 py-1">
        <span className="text-[var(--subtle)]">┃</span>
        <span className="text-xs text-[var(--subtle)] italic">審査中</span>
      </div>
    );
  }

  // deadline タイプは特別なバナー表示
  if (item.urgency === "deadline") {
    const remaining = mounted && item.targetDate ? formatRemainingTime(item.targetDate) : null;
    return (
      <div className="mx-2 my-1 px-3 py-2 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border-2 border-slate-400">
        <span>{item.title}</span>
        {remaining && (
          <span className="ml-2 text-slate-600">{remaining}</span>
        )}
        {item.lateWarning && (
          <p className="text-xs font-normal text-slate-600 mt-0.5">
            {item.lateWarning}
          </p>
        )}
      </div>
    );
  }

  const icon = urgencyIcon[item.urgency];
  const remaining = mounted && item.targetDate ? formatRemainingTime(item.targetDate) : null;

  return (
    <div className="py-1">
      <div className="flex items-start gap-1.5">
        <span className="text-xs shrink-0 leading-5">{icon}</span>
        <span className="text-xs font-medium text-[var(--foreground)] leading-5 flex-1">
          {item.title}
        </span>
        {remaining && (
          <span className="text-[10px] text-amber-600 font-medium whitespace-nowrap shrink-0 leading-5">
            {remaining}
          </span>
        )}
      </div>
      {item.lateWarning && (
        <p className="text-xs text-slate-500 mt-0.5 ml-5">
          {item.lateWarning}
        </p>
      )}
    </div>
  );
}

function GoalLine() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const remaining = mounted ? formatRemainingTime(new Date("2027-04-01")) : null;

  return (
    <div className="bg-amber-100 border-2 border-amber-300 rounded-lg p-3 flex flex-wrap items-center justify-center gap-3 my-1">
      <span className="text-base font-bold text-amber-900">
        🎯 2027年4月1日 育成就労制度 施行
      </span>
      {remaining && (
        <span className="font-countdown text-sm text-amber-800 font-bold">
          {remaining}
        </span>
      )}
    </div>
  );
}

// ===== 警告バナー =====
function WarningBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const remaining = mounted ? formatRemainingTime(new Date("2026-07-31")) : null;

  return (
    <div className="mt-3 mb-6 rounded-lg border-2 border-orange-300 bg-orange-50 px-5 py-4 flex items-start gap-3">
      <span className="text-2xl mt-0.5">⚠️</span>
      <div>
        <p className="text-sm font-bold text-slate-800">
          受入要請から外国人来日まで通常6〜9ヶ月かかります。
        </p>
        <p className="text-sm font-bold text-slate-700 mt-1">
          2027年4月1日に受け入れるには、どんなに遅くても
          <span className="underline decoration-2">2026年7月末までに手続きを開始</span>
          しなければ間に合いません。
        </p>
        {remaining && (
          <p className="text-xs text-orange-600 mt-2 font-mono">
            ⏱ 2026年7月31日まで　{remaining}
          </p>
        )}
      </div>
    </div>
  );
}

// ===== 発注締切ラインバナー =====
function OrderDeadlineBanner() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const remaining = mounted ? formatRemainingTime(new Date("2026-08-31")) : null;

  return (
    <div className="mx-2 my-1 px-3 py-2 rounded-md text-xs font-bold bg-slate-100 text-slate-700 border-2 border-slate-400">
      📌 2027年4月配置を目指すなら<br />
      <span className="text-sm">この月までに発注・面接完了が必要</span>
      {remaining && (
        <span className="ml-2 text-slate-600">{remaining}</span>
      )}
    </div>
  );
}

// ===== 逆算サマリーカード =====
function SummaryCards({ persona }: { persona: Persona }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const showUkeire = persona === null || persona === "受入企業";
  const showKanri = persona === null || persona === "管理団体";

  const iraiRemaining = mounted ? formatRemainingTime(new Date("2026-07-31")) : null;
  const kanriRemaining = mounted ? formatRemainingTime(new Date("2026-07-31")) : null;
  const keikakuRemaining = mounted ? formatRemainingTime(new Date("2026-12-31")) : null;
  const goalRemaining = mounted ? formatRemainingTime(new Date("2027-04-01")) : null;

  const gridClass = persona === null
    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
    : "grid-cols-1 md:grid-cols-3";

  return (
    <div className={`grid ${gridClass} gap-3 mb-6`}>
      {/* カード1: 受入企業 → 管理団体への受入要請締切 */}
      {showUkeire && (
        <div className="rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-600 mb-1">🏭 受入企業</p>
          <p className="text-sm font-bold text-slate-900">
            管理団体への受入要請は2026年7月末まで
          </p>
          <p className="text-xs text-slate-700 mt-1">
            育成就労外国人の受入れを希望する企業は、<br />
            この時期までに管理団体へ受入要請を行う必要があります。<br />
            要請が遅れると育成就労計画の認定申請・許可取得が<br />
            間に合わず、2027年4月の配置ができなくなります。
          </p>
          {iraiRemaining && (
            <p className="text-lg font-mono font-bold text-slate-700 mt-2">
              {iraiRemaining}
            </p>
          )}
        </div>
      )}

      {/* カード2: 管理団体 → 許可申請締切 */}
      {showKanri && (
        <div className="rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
          <p className="text-xs font-bold text-slate-600 mb-1">🏢 管理団体</p>
          <p className="text-sm font-bold text-slate-900">
            許可申請は2026年7月末まで
          </p>
          <p className="text-xs text-slate-700 mt-1">
            受入企業からの依頼を受けても、<br />
            管理支援機関の許可がなければ手続き不可。<br />
            審査に3〜5ヶ月かかるため今すぐ着手が必要。
          </p>
          {kanriRemaining && (
            <p className="text-lg font-mono font-bold text-slate-700 mt-2">
              {kanriRemaining}
            </p>
          )}
        </div>
      )}

      {/* カード3: 育成就労計画 認定申請締切 */}
      <div className="rounded-lg border-2 border-slate-300 bg-slate-50 p-4">
        <p className="text-xs font-bold text-slate-600 mb-1">⚠️ 育成就労計画 認定申請</p>
        <p className="text-sm font-bold text-slate-900">
          計画認定申請は2026年12月末まで
        </p>
        <p className="text-xs text-slate-700 mt-1">
          開始予定日の4ヶ月前が実質的なデッドライン。<br />
          これを過ぎると2027年4月の受入れは不可。<br />
          ※運用要領に明記された締切
        </p>
        {keikakuRemaining && (
          <p className="text-lg font-mono font-bold text-slate-700 mt-2">
            {keikakuRemaining}
          </p>
        )}
      </div>

      {/* カード4: 施行まで */}
      <div className="rounded-lg border-2 border-amber-300 bg-amber-50 p-4">
        <p className="text-xs font-bold text-amber-800 mb-1">🎯 育成就労制度 施行</p>
        <p className="text-sm font-bold text-amber-900">
          2027年4月1日（木）
        </p>
        <p className="text-xs text-amber-800 mt-1">
          この日から育成就労外国人の受入れが開始。<br />
          発注〜来日まで最短9ヶ月。<br />
          今動かなければ4月配置には間に合いません。
        </p>
        {goalRemaining && (
          <p className="text-lg font-mono font-bold text-amber-800 mt-2">
            {goalRemaining}
          </p>
        )}
      </div>
    </div>
  );
}

// ===== デスクトップ表示 =====
function DesktopTimeline({ persona }: { persona: Persona }) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const showKanri = persona === null || persona === "管理団体";
  const showUkeire = persona === null || persona === "受入企業";
  const gridCols = showKanri && showUkeire
    ? "grid-cols-[80px_1fr_1fr]"
    : "grid-cols-[80px_1fr]";

  return (
    <div className="hidden md:block">
      {/* グリッドヘッダー */}
      <div className={`grid ${gridCols} border-b-2 border-[var(--border)] pb-2 mb-1`}>
        <div className="text-xs font-bold text-[var(--muted-foreground)]">月</div>
        {showKanri && (
          <div className="text-xs font-bold text-blue-700 flex items-center gap-1">
            🏢 管理団体
          </div>
        )}
        {showUkeire && (
          <div className="text-xs font-bold text-purple-700 flex items-center gap-1">
            🏭 受入企業
          </div>
        )}
      </div>

      {/* 月ごとの行 */}
      {months.map((me, idx) => {
        const isCurrentMonth = me.year === currentYear && me.month === currentMonth;
        const isGoalMonth = me.year === 2027 && me.month === 4;
        const isEven = idx % 2 === 0;

        const kanriItems = items.filter(
          (i) => i.year === me.year && i.month === me.month && (i.actor === "管理団体" || i.actor === "両方")
        );
        const kigyoItems = items.filter(
          (i) => i.year === me.year && i.month === me.month && (i.actor === "受入企業" || i.actor === "両方")
        );

        const hasVisibleItems =
          (showKanri && kanriItems.length > 0) || (showUkeire && kigyoItems.length > 0);

        if (isGoalMonth) {
          return (
            <div key={`${me.year}-${me.month}`}>
              <GoalLine />
              {hasVisibleItems && (
                <div className={`grid ${gridCols} min-h-[48px] border-b border-[var(--border)]`}>
                  <div />
                  {showKanri && (
                    <div className={`px-2 py-1 ${showUkeire ? "border-r border-[var(--border)]" : ""}`}>
                      {kanriItems.map((item) => (
                        <ItemCell key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                  {showUkeire && (
                    <div className="px-2 py-1">
                      {kigyoItems.map((item) => (
                        <ItemCell key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={`${me.year}-${me.month}`}
            className={`grid ${gridCols} min-h-[48px] border-b border-[var(--border)] ${
              isCurrentMonth
                ? "bg-[var(--primary-muted)] border-l-2 border-l-[var(--primary)]"
                : isEven
                  ? "bg-[var(--surface)]"
                  : "bg-[var(--surface-muted)]/50"
            }`}
          >
            {/* 月ラベル */}
            <div className="px-2 py-2 flex items-start gap-1 border-r border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--foreground)] whitespace-nowrap">
                {me.label}
              </span>
              {isCurrentMonth && (
                <span className="inline-block rounded bg-[var(--primary)] text-white text-[9px] font-bold px-1 py-0.5 leading-none whitespace-nowrap">
                  今ここ
                </span>
              )}
            </div>

            {/* 管理団体列 */}
            {showKanri && (
              <div className={`px-2 py-1 ${showUkeire ? "border-r border-[var(--border)]" : ""}`}>
                {kanriItems.map((item) => (
                  <ItemCell key={item.id} item={item} />
                ))}
              </div>
            )}

            {/* 受入企業列 */}
            {showUkeire && (
              <div className="px-2 py-1">
                {kigyoItems.map((item) => (
                  <ItemCell key={item.id} item={item} />
                ))}
                {me.year === 2026 && me.month === 8 && <OrderDeadlineBanner />}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ===== モバイル表示（タブ切替） =====
function MobileTimeline({ persona }: { persona: Persona }) {
  const [activeTab, setActiveTab] = useState<"管理団体" | "受入企業">(
    persona === "受入企業" ? "受入企業" : "管理団体"
  );
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  // ペルソナ選択時はタブを固定
  const effectiveTab = persona ?? activeTab;

  return (
    <div className="md:hidden">
      {/* ペルソナ未選択時のみタブ表示 */}
      {persona === null && (
        <div className="flex gap-1 mb-3">
          {(["管理団体", "受入企業"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 rounded-lg py-2 text-xs font-bold transition-colors ${
                activeTab === tab
                  ? tab === "管理団体"
                    ? "bg-blue-600 text-white"
                    : "bg-purple-600 text-white"
                  : "bg-[var(--surface-muted)] text-[var(--muted-foreground)]"
              }`}
            >
              {tab === "管理団体" ? "🏢 管理団体" : "🏭 受入企業"}
            </button>
          ))}
        </div>
      )}

      {/* ペルソナ選択時のインジケーター */}
      {persona !== null && (
        <div className="mb-3 text-center">
          <span className={`inline-block text-xs font-bold px-3 py-1 rounded-lg ${
            persona === "管理団体"
              ? "bg-blue-100 text-blue-700"
              : "bg-purple-100 text-purple-700"
          }`}>
            {persona === "管理団体" ? "🏢 管理団体" : "🏭 受入企業"} の予定を表示中
          </span>
        </div>
      )}

      {/* 月ごとの行 */}
      {months.map((me, idx) => {
        const isCurrentMonth = me.year === currentYear && me.month === currentMonth;
        const isGoalMonth = me.year === 2027 && me.month === 4;
        const isEven = idx % 2 === 0;

        const monthItems = items.filter(
          (i) =>
            i.year === me.year &&
            i.month === me.month &&
            (i.actor === effectiveTab || i.actor === "両方")
        );

        if (isGoalMonth) {
          return (
            <div key={`${me.year}-${me.month}`}>
              <GoalLine />
              {monthItems.length > 0 && (
                <div className="grid grid-cols-[60px_1fr] min-h-[40px] border-b border-[var(--border)]">
                  <div />
                  <div className="px-2 py-1">
                    {monthItems.map((item) => (
                      <ItemCell key={item.id} item={item} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        }

        return (
          <div
            key={`${me.year}-${me.month}`}
            className={`grid grid-cols-[60px_1fr] min-h-[40px] border-b border-[var(--border)] ${
              isCurrentMonth
                ? "bg-[var(--primary-muted)] border-l-2 border-l-[var(--primary)]"
                : isEven
                  ? "bg-[var(--surface)]"
                  : "bg-[var(--surface-muted)]/50"
            }`}
          >
            <div className="px-2 py-2 flex flex-col items-start border-r border-[var(--border)]">
              <span className="text-xs font-bold text-[var(--foreground)]">
                {me.label}
              </span>
              {isCurrentMonth && (
                <span className="inline-block rounded bg-[var(--primary)] text-white text-[8px] font-bold px-1 py-0.5 leading-none mt-0.5">
                  今ここ
                </span>
              )}
            </div>

            <div className="px-2 py-1">
              {monthItems.map((item) => (
                <ItemCell key={item.id} item={item} />
              ))}
              {me.year === 2026 && me.month === 8 && effectiveTab === "受入企業" && (
                <OrderDeadlineBanner />
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ===== メインコンポーネント =====
export default function PracticalTimelineSection({ persona = null }: { persona?: Persona }) {
  return (
    <section className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 shadow-sm">
      <div className="border-l-4 border-[var(--primary)] pl-3 mb-4">
        <h2 className="font-sans text-xl font-extrabold text-slate-800 tracking-normal mb-1 flex items-center gap-2">
          📋 実務スケジュール
        </h2>
        <p className="text-sm text-[var(--muted-foreground)]">
          2027年4月1日に受け入れるための逆算スケジュール
        </p>
      </div>
      <WarningBanner />

      <SummaryCards persona={persona} />

      <DesktopTimeline persona={persona} />
      <MobileTimeline persona={persona} />
    </section>
  );
}
