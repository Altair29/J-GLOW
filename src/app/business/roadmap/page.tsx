"use client";

import { useState } from "react";
import CountdownSection from "@/components/business/roadmap/CountdownSection";
import TimelineSection from "@/components/business/roadmap/TimelineSection";
import PracticalTimelineSection from "@/components/business/roadmap/PracticalTimelineSection";
import ChecklistSection from "@/components/business/roadmap/ChecklistSection";
import {
  TARGET_DATE,
  TARGET_LABEL,
  TARGET_DISPLAY,
  milestones,
  initialChecklist,
} from "@/components/business/roadmap/data";

export default function RoadmapPage() {
  const [persona, setPersona] = useState<"管理団体" | "受入企業" | null>(null);

  return (
    <div className="min-h-screen bg-[var(--background)]">
      {/* ヘッダー */}
      <header className="border-b border-[var(--border)] bg-[var(--surface)] no-print">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-4 sm:px-6">
          <div>
            <h1 className="text-xl font-bold text-[var(--primary)]">
              J-GLOW
            </h1>
            <p className="text-xs text-[var(--muted-foreground)]">
              育成就労制度ロードマップ
            </p>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 space-y-6">

        {/* ペルソナ選択バナー */}
        <div className="rounded-xl border-2 border-slate-200 bg-slate-50 p-6 no-print">
          <p className="text-center text-base font-bold text-slate-700 mb-4">
            あなたの立場を選んでください
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

            {/* 管理団体 */}
            <button
              onClick={() => setPersona("管理団体")}
              className={`rounded-lg border-2 p-5 text-left transition-all cursor-pointer
                ${persona === "管理団体"
                  ? "border-blue-500 bg-blue-50"
                  : "border-slate-200 bg-white hover:border-blue-300"}`}
            >
              <p className="text-lg font-bold text-blue-800 mb-1">
                🏢 管理団体・監理支援機関
              </p>
              <p className="text-sm text-slate-600">
                技能実習の監理団体として活動中、または
                監理支援機関の許可取得を検討している
              </p>
            </button>

            {/* 受入企業 */}
            <button
              onClick={() => setPersona("受入企業")}
              className={`rounded-lg border-2 p-5 text-left transition-all cursor-pointer
                ${persona === "受入企業"
                  ? "border-purple-500 bg-purple-50"
                  : "border-slate-200 bg-white hover:border-purple-300"}`}
            >
              <p className="text-lg font-bold text-purple-800 mb-1">
                🏭 受入企業
              </p>
              <p className="text-sm text-slate-600">
                技能実習生を受け入れている、または
                育成就労外国人の受け入れを検討している
              </p>
            </button>

          </div>

          {/* 選択後のメッセージ */}
          {persona === "管理団体" && (
            <div className="mt-4 rounded-lg bg-blue-50 border border-blue-300 px-4 py-3">
              <p className="text-sm font-bold text-blue-800 mb-1">
                📋 管理団体向けの情報を表示しています
              </p>
              <p className="text-sm text-blue-700">
                監理支援機関の許可申請受付が
                <span className="font-bold underline">2026年4月15日から開始</span>
                されます。準備チェックリストで現状を確認してください。
              </p>
            </div>
          )}

          {persona === "受入企業" && (
            <div className="mt-4 rounded-lg bg-purple-50 border border-purple-300 px-4 py-3">
              <p className="text-sm font-bold text-purple-800 mb-1">
                📋 受入企業向けの情報を表示しています
              </p>
              <p className="text-sm text-purple-700">
                2027年4月に外国人を配置するには
                <span className="font-bold underline">2026年7月末までに管理団体へ受入要請</span>
                が必要です。実務スケジュールで締切を確認してください。
              </p>
            </div>
          )}

          {/* リセットボタン */}
          {persona !== null && (
            <button
              onClick={() => setPersona(null)}
              className="mt-3 text-xs text-slate-400 underline hover:text-slate-600 cursor-pointer"
            >
              ← 全ての情報を表示する
            </button>
          )}
        </div>

        {/* 1. カウントダウン */}
        <div className="no-print">
          <CountdownSection
            targetDate={TARGET_DATE}
            targetLabel={TARGET_LABEL}
            targetDisplay={TARGET_DISPLAY}
          />
        </div>

        {/* 2. タイムライン：管理団体のみ表示 */}
        {(persona === null || persona === "管理団体") && (
          <div className="no-print">
            <TimelineSection milestones={milestones} />
          </div>
        )}

        {/* 3. 実務スケジュール：両方表示（列をペルソナで切替） */}
        <div className="no-print">
          <PracticalTimelineSection persona={persona} />
        </div>

        {/* 4. 受入企業向け3ステップ：受入企業のみ表示 */}
        {persona === "受入企業" && (
          <section className="rounded-2xl bg-[var(--surface)] border border-[var(--border)] p-8 shadow-sm no-print">
            <div className="border-l-4 border-purple-400 pl-3 mb-6">
              <h2 className="font-sans text-xl font-extrabold text-slate-800">
                ✅ 受入企業がやるべき3ステップ
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  step: 1,
                  deadline: "2026年7月末まで",
                  urgency: "critical" as const,
                  title: "管理団体へ受入要請",
                  detail: "育成就労外国人の受入れを希望する旨を管理団体（監理支援機関）に伝え、受入要請を行う。これが全手続きのスタートとなる。",
                  cta: "管理団体を探す →",
                  ctaPath: "/business/partners",
                },
                {
                  step: 2,
                  deadline: "2026年9〜12月",
                  urgency: "warning" as const,
                  title: "育成就労計画の認定申請",
                  detail: "管理団体の指導のもと育成就労計画を作成し、外国人育成就労機構（OTIT）に認定申請を行う。開始予定日の4ヶ月前が締切目安。",
                  cta: "計画作成の流れを見る →",
                  ctaPath: "/business/articles",
                },
                {
                  step: 3,
                  deadline: "2027年4月1日以降",
                  urgency: "normal" as const,
                  title: "COE申請・外国人来日",
                  detail: "計画認定後、在留資格認定証明書（COE）を申請。取得後に外国人が来日し就労開始。COE申請から来日まで通常2〜3ヶ月。",
                  cta: "COE申請の流れを見る →",
                  ctaPath: "/business/articles",
                },
              ].map((item) => (
                <div
                  key={item.step}
                  className={`rounded-lg border-2 p-4 ${
                    item.urgency === "critical"
                      ? "border-red-300 bg-red-50"
                      : item.urgency === "warning"
                        ? "border-orange-300 bg-orange-50"
                        : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-7 h-7 rounded-full bg-purple-600 text-white text-sm font-bold flex items-center justify-center">
                      {item.step}
                    </span>
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded ${
                        item.urgency === "critical"
                          ? "bg-red-100 text-red-700"
                          : item.urgency === "warning"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {item.deadline}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 mb-1">{item.title}</h3>
                  <p className="text-xs text-slate-600 mb-3">{item.detail}</p>
                  <a
                    href={item.ctaPath}
                    className="text-xs font-bold text-purple-600 hover:underline"
                  >
                    {item.cta}
                  </a>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. チェックリスト：管理団体のみ表示 */}
        {(persona === null || persona === "管理団体") && (
          <div className="print-section">
            <ChecklistSection initialItems={initialChecklist} persona={persona} />
          </div>
        )}

        {/* フッター */}
        <footer className="text-center text-xs text-[var(--subtle)] pb-4 no-print">
          <p>J-GLOW Business Dashboard</p>
        </footer>
      </main>
    </div>
  );
}
