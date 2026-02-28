"use client";

import { useState, useEffect } from "react";
import type { ChecklistItem } from './data';
import { categoryBorderColors } from './data';

function getRemainingTime(target: Date): { months: number; days: number } {
  const today = new Date();
  const diff = target.getTime() - today.getTime();
  if (diff <= 0) return { months: 0, days: 0 };
  const totalDays = Math.floor(diff / (1000 * 60 * 60 * 24));
  return { months: Math.floor(totalDays / 30), days: totalDays % 30 };
}

const taskTypeBadgeStyles: Record<string, string> = {
  管理団体: "bg-blue-100 text-blue-700 border border-blue-200",
  受入企業支援: "bg-purple-100 text-purple-700 border border-purple-200",
};

const deadlineUrgencyStyles: Record<string, string> = {
  critical: "bg-red-100 text-red-700",
  warning: "bg-orange-100 text-orange-700",
  normal: "bg-gray-100 text-gray-600",
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

function DeadlineBadge({ item }: { item: ChecklistItem }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dl = item.deadline;
  if (!dl.urgency) return null;

  const style = deadlineUrgencyStyles[dl.urgency] || deadlineUrgencyStyles.normal;
  const remaining = mounted && dl.date ? ` ${formatRemainingTime(dl.date)}` : "";

  return (
    <span className={`inline-block rounded px-2 py-0.5 text-[10px] font-medium leading-none whitespace-nowrap ${style}`}>
      {dl.label}{remaining}
    </span>
  );
}

function TaskAccordion({ item }: { item: ChecklistItem }) {
  const d = item.detail;
  return (
    <div className="mt-1 mb-1 ml-7 rounded-lg bg-[var(--surface-muted)] border border-[var(--border)] p-4 text-sm space-y-3">
      <p className="text-[var(--foreground)]">{d.overview}</p>

      <div>
        <h4 className="text-xs font-bold text-[var(--primary)] mb-1.5">手順</h4>
        <ol className="list-decimal list-inside space-y-1 text-xs text-[var(--foreground)]">
          {d.steps.map((step, i) => (
            <li key={i}>{step}</li>
          ))}
        </ol>
      </div>

      {d.documents.length > 0 && (
        <div>
          <h4 className="text-xs font-bold text-[var(--primary)] mb-1.5">
            必要書類
          </h4>
          <ul className="list-disc list-inside space-y-0.5 text-xs text-[var(--foreground)]">
            {d.documents.map((doc, i) =>
              doc.url ? (
                <li key={i}>
                  <a
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[var(--primary-light)] underline hover:text-[var(--primary)]"
                  >
                    {doc.name}
                  </a>
                </li>
              ) : (
                <li key={i}>{doc.name}</li>
              )
            )}
          </ul>
        </div>
      )}

      <p className="text-[10px] text-[var(--subtle)]">出典: {d.source}</p>

      {/* CTA リンク */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <a
          href={`https://j-glow.com${item.ctaPath}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm font-bold text-[var(--primary)] hover:underline"
        >
          このステップの詳細・サポートはJ-GLOWで →
        </a>
      </div>
    </div>
  );
}

function CategoryCard({
  category,
  items,
  onToggle,
  expandedId,
  setExpandedId,
  persona,
}: {
  category: string;
  items: ChecklistItem[];
  onToggle: (id: string) => void;
  expandedId: string | null;
  setExpandedId: (id: string | null) => void;
  persona: "管理団体" | "受入企業" | null;
}) {
  const doneCount = items.filter((i) => i.checked).length;
  const pct = items.length > 0 ? Math.round((doneCount / items.length) * 100) : 0;
  const borderColor = categoryBorderColors[category] || "border-l-slate-300";

  return (
    <div
      className={`rounded-lg border border-[var(--border)] border-l-4 ${borderColor} bg-[var(--surface)] p-4`}
    >
      {/* カテゴリヘッダー */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
        <h3 className="text-sm font-bold text-[var(--foreground)]">
          {category}
        </h3>
        <span className="font-countdown text-xs text-[var(--muted-foreground)]">
          {doneCount}/{items.length} ({pct}%)
        </span>
      </div>

      {/* カテゴリ進捗バー */}
      <div className="h-1.5 w-full rounded-full bg-[var(--surface-muted)] mb-3">
        <div
          className="h-1.5 rounded-full bg-[var(--status-done)] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* タスク一覧 */}
      <ul className="space-y-0.5">
        {items.map((item) => {
          const isExpanded = expandedId === item.id;
          const badgeStyle = taskTypeBadgeStyles[item.taskType] || "";

          return (
            <li key={item.id}>
              <div
                className={`flex items-start gap-3 rounded-lg px-3 py-2.5 transition-colors ${
                  isExpanded
                    ? "bg-[var(--primary-muted)]"
                    : "hover:bg-[var(--surface-muted)]"
                }`}
              >
                {/* チェックボックス */}
                <input
                  type="checkbox"
                  checked={item.checked}
                  onChange={() => onToggle(item.id)}
                  className="h-4 w-4 rounded border-[var(--border)] text-[var(--primary)] accent-[var(--primary)] shrink-0 cursor-pointer mt-0.5"
                />

                {/* タスク名・バッジ（クリックで詳細展開） */}
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span
                      className={`text-sm ${
                        item.checked
                          ? "line-through text-[var(--subtle)]"
                          : "text-[var(--foreground)]"
                      }`}
                    >
                      {item.text}
                    </span>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5 mt-1">
                    <span
                      className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-medium leading-none ${badgeStyle}`}
                    >
                      {item.taskType}
                    </span>
                    <DeadlineBadge item={item} />
                  </div>
                </div>

                {/* 展開ボタン */}
                <button
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                  className="shrink-0 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors cursor-pointer mt-0.5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-200 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  >
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                  <span className="hidden sm:inline">
                    {isExpanded ? "閉じる" : "詳細"}
                  </span>
                </button>
              </div>
              {isExpanded && <TaskAccordion item={item} />}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

const categoryConfig: { fullLabel: string; shortLabel: string; color: string }[] = [
  { fullLabel: "🏢 組織・体制整備",       shortLabel: "組織整備", color: "#3b82f6" },
  { fullLabel: "📋 申請書類の準備",       shortLabel: "書類準備", color: "#10b981" },
  { fullLabel: "✅ 申請・審査対応",       shortLabel: "申請対応", color: "#8b5cf6" },
  { fullLabel: "⚙️ 許可後の運用準備",     shortLabel: "運用準備", color: "#f43f5e" },
  { fullLabel: "🤝 受入企業サポート体制", shortLabel: "企業支援", color: "#f59e0b" },
];

export default function ChecklistSection({
  initialItems,
  persona,
}: {
  initialItems: ChecklistItem[];
  persona: "管理団体" | "受入企業" | null;
}) {
  const [items, setItems] = useState<ChecklistItem[]>(initialItems);
  const [filter, setFilter] = useState<string>("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = Array.from(new Set(items.map((i) => i.category)));
  const allCategories = ["all", ...categories];

  const totalCount = items.length;
  const completedCount = items.filter((i) => i.checked).length;
  const totalPercent = Math.floor((completedCount / totalCount) * 100);

  const categoryStats = categoryConfig.map((cfg) => {
    const catItems = items.filter((i) => i.category === cfg.fullLabel);
    const completed = catItems.filter((i) => i.checked).length;
    const total = catItems.length;
    const percent = total > 0 ? Math.floor((completed / total) * 100) : 0;
    return { ...cfg, completed, total, percent };
  });

  function toggle(id: string) {
    setItems((prev) =>
      prev.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i))
    );
  }

  const visibleCategories =
    filter === "all" ? categories : categories.filter((c) => c === filter);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const remaining = mounted ? getRemainingTime(new Date("2027-04-01T00:00:00+09:00")) : null;

  const handleChecklistPrint = () => {
    window.print();
  };

  return (
    <div className="checklist-print-area">
      {/* 印刷時のみ表示するヘッダー */}
      <div className="print-header hidden border-b border-slate-300 pb-3 mb-4">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-base font-bold">
              育成就労制度ロードマップ　準備チェックリスト
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              出力日：{mounted ? new Date().toLocaleDateString("ja-JP") : ""}
              © J-GLOW　https://j-glow.com
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-slate-500">施行まで</p>
            {remaining && (
              <p className="text-sm font-bold font-mono text-[var(--primary)]">
                あと{remaining.months}ヶ月{remaining.days}日
              </p>
            )}
          </div>
        </div>

        {/* 進捗サマリー */}
        <div className="mt-3 p-2 bg-slate-50 rounded text-xs">
          <div className="flex items-center gap-3 mb-2">
            <span className="font-bold">全体進捗</span>
            <div className="flex-1 bg-slate-200 rounded-full h-2">
              <div
                className="h-2 rounded-full bg-[var(--primary)]"
                style={{ width: `${totalPercent}%` }}
              />
            </div>
            <span className="font-bold text-[var(--primary)]">{totalPercent}%</span>
            <span className="text-slate-500">{completedCount}/{totalCount}件完了</span>
          </div>
          <div className="flex gap-4 flex-wrap">
            {categoryStats.map((cat) => (
              <span key={cat.fullLabel}>
                {cat.shortLabel}：{cat.percent}%（{cat.completed}/{cat.total}）
              </span>
            ))}
          </div>
        </div>
      </div>

      <section className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 shadow-sm">
        <div className="border-l-4 border-[var(--primary)] pl-3 mb-4">
          <div className="flex items-center gap-2">
            <h2 className="font-sans text-xl font-extrabold text-slate-800 tracking-normal mb-1 flex items-center gap-2">
              ✅ 準備チェックリスト
            </h2>
            <button
              onClick={handleChecklistPrint}
              className="ml-auto flex items-center gap-2 px-4 py-2 bg-[var(--primary)] text-white text-sm rounded-lg font-bold hover:bg-[var(--primary)]/90 transition-colors print:hidden"
            >
              🖨️ PDF出力 / 印刷
            </button>
          </div>
        </div>

        {/* 対象者の説明 */}
        <div className="flex flex-wrap items-center gap-3 mb-4 text-xs text-[var(--muted-foreground)]">
          <span className="flex items-center gap-1.5">
            <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-blue-100 text-blue-700 border border-blue-200">
              管理団体
            </span>
            管理団体（自社）が行うタスク
          </span>
          <span className="flex items-center gap-1.5">
            <span className="inline-block rounded-full px-2 py-0.5 text-[10px] font-medium bg-purple-100 text-purple-700 border border-purple-200">
              受入企業支援
            </span>
            受入企業を支援するタスク
          </span>
        </div>

        {/* 進捗サマリーエリア */}
        <div className="mb-6">
          {/* 全体進捗バー */}
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm font-bold text-[var(--foreground)] whitespace-nowrap">
              全体進捗
            </span>
            <div className="flex-1 bg-slate-200 rounded-full h-4 overflow-hidden">
              <div
                className="h-4 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-700"
                style={{ width: `${totalPercent}%` }}
              />
            </div>
            <span className="text-2xl font-bold font-mono text-blue-700 whitespace-nowrap">
              {totalPercent}%
            </span>
            <span className="text-sm text-[var(--muted-foreground)] whitespace-nowrap">
              {completedCount}/{totalCount}件完了
            </span>
          </div>

          {/* カテゴリ別進捗バー（5本）*/}
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2">
            {categoryStats.map((cat) => (
              <div key={cat.fullLabel} className="flex flex-col gap-1">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[var(--muted-foreground)] truncate">
                    {cat.shortLabel}
                  </span>
                  <span className="text-xs font-bold" style={{ color: cat.color }}>
                    {cat.percent}%
                  </span>
                </div>
                <div className="bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="h-2 rounded-full transition-all duration-700"
                    style={{
                      width: `${cat.percent}%`,
                      backgroundColor: cat.color,
                    }}
                  />
                </div>
                <span className="text-xs text-[var(--muted-foreground)]">
                  {cat.completed}/{cat.total}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* フィルター */}
        <div className="category-tabs flex flex-wrap gap-1.5 mb-5">
          {allCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filter === cat
                  ? "bg-[var(--primary)] text-white"
                  : "bg-[var(--surface-muted)] text-[var(--muted-foreground)] hover:bg-[var(--border)]"
              }`}
            >
              {cat === "all" ? "すべて" : cat}
            </button>
          ))}
        </div>

        {/* カテゴリごとのカード */}
        <div className="space-y-4">
          {visibleCategories.map((cat) => {
            const catItems = items.filter((i) => i.category === cat);
            return (
              <CategoryCard
                key={cat}
                category={cat}
                items={catItems}
                onToggle={toggle}
                expandedId={expandedId}
                setExpandedId={setExpandedId}
                persona={persona}
              />
            );
          })}
        </div>
      </section>
    </div>
  );
}
