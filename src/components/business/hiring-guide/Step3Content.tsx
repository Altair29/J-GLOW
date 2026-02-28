"use client";

import { useState } from "react";
import { checklistItems } from '@/lib/hiring-guide-data';

function IndustryDetailPanel() {
  return (
    <div className="mt-3 space-y-4 rounded-lg border border-[var(--border)] bg-[var(--surface-muted)] p-5 text-sm">
      <div>
        <h4 className="mb-1.5 font-bold text-[var(--foreground)]">
          育成就労 / 技能実習
        </h4>
        <p className="text-[var(--muted-foreground)]">
          対象は特定の職種（作業）に限定されています。
        </p>
        <p className="mt-1 text-[var(--muted-foreground)]">
          例：溶接、機械加工、農業、漁業、建設、食品製造、介護、ビルクリーニング
          など
        </p>
        <ul className="mt-2 space-y-1 text-xs text-[var(--muted-foreground)]">
          <li className="flex items-start gap-1.5">
            <span className="mt-0.5 text-[var(--accent)]">→</span>
            「自社の作業内容」が対象職種の定義に合致するか確認が必要です
          </li>
          <li className="flex items-start gap-1.5">
            <span className="mt-0.5 text-[var(--accent)]">→</span>
            例：「製造業」でも「設計・管理業務」は対象外
          </li>
        </ul>
      </div>

      <div>
        <h4 className="mb-1.5 font-bold text-[var(--foreground)]">特定技能</h4>
        <p className="text-[var(--muted-foreground)]">
          14の特定産業分野のみ対象。
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          分野例：製造業、建設、農業、漁業、飲食料品製造、外食業、宿泊、介護、ビルクリーニング、素形材・産業機械・電気電子情報関連製造業、造船・舶用工業、自動車整備、航空、港湾運送
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[var(--muted-foreground)]">
          <span className="mt-0.5 text-[var(--accent)]">→</span>
          分野内でも「従事できる業務の範囲」が細かく定められています
        </p>
      </div>

      <div>
        <h4 className="mb-1.5 font-bold text-[var(--foreground)]">
          技術・人文知識・国際業務
        </h4>
        <p className="text-[var(--muted-foreground)]">
          業種の制限はなく、「職種・業務内容」で判断されます。
        </p>
        <p className="mt-1 text-xs text-[var(--muted-foreground)]">
          対象：翻訳・通訳、語学指導、広報、デザイン、IT・システム開発、経理・財務、営業（専門知識を要するもの）など
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[var(--muted-foreground)]">
          <span className="mt-0.5 text-[var(--accent)]">→</span>
          「単純作業」「製造ライン業務」は原則対象外
        </p>
      </div>

      <div>
        <h4 className="mb-1.5 font-bold text-[var(--foreground)]">
          留学生採用（卒業後）
        </h4>
        <p className="text-[var(--muted-foreground)]">
          大学・専門学校の専攻と、就職先の職種の関連性が審査されます。
        </p>
        <p className="mt-2 flex items-start gap-1.5 text-xs text-[var(--muted-foreground)]">
          <span className="mt-0.5 text-[var(--accent)]">→</span>
          専攻と無関係な職種への就職は許可が下りないケースあり
        </p>
      </div>
    </div>
  );
}

export default function Step3Content() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [expandedIndustry, setExpandedIndustry] = useState(false);

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const total = checklistItems.length;
  const allChecked = checkedCount === total;

  function toggle(id: string) {
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <>
      {/* プログレスバー */}
      <div className="mb-6">
        <div className="mb-2 flex items-center justify-between text-sm">
          <span className="text-[var(--muted-foreground)]">確認済み</span>
          <span className="font-countdown font-bold text-[var(--foreground)]">
            {checkedCount} / {total}
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-[var(--surface-muted)]">
          <div
            className="h-full rounded-full bg-[var(--accent)] transition-all duration-500"
            style={{ width: `${(checkedCount / total) * 100}%` }}
          />
        </div>
      </div>

      {/* チェックリスト */}
      <div className="space-y-3">
        {checklistItems.map((item) => {
          const isIndustryItem = item.id === "check-1";
          return (
            <div key={item.id}>
              <label
                className={`flex cursor-pointer gap-4 rounded-xl border p-5 transition-all ${
                  checked[item.id]
                    ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                    : "border-[var(--border)] bg-[var(--surface)] hover:border-[var(--subtle)]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={!!checked[item.id]}
                  onChange={() => toggle(item.id)}
                  className="mt-0.5 h-5 w-5 shrink-0 rounded accent-[var(--accent)]"
                />
                <div className="flex-1">
                  <p className="text-sm font-medium text-[var(--foreground)]">
                    {item.text}
                  </p>
                  {item.detail && (
                    <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                      {item.detail}
                    </p>
                  )}
                  {isIndustryItem && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setExpandedIndustry((prev) => !prev);
                      }}
                      className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-[var(--primary)] hover:text-[var(--primary-light)] hover:underline"
                    >
                      在留資格ごとの対応業種・職種を見る
                      <svg
                        className={`h-3.5 w-3.5 transition-transform duration-200 ${
                          expandedIndustry ? "rotate-180" : ""
                        }`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </button>
                  )}
                </div>
              </label>
              {isIndustryItem && expandedIndustry && <IndustryDetailPanel />}
            </div>
          );
        })}
      </div>

      {/* 完了メッセージ */}
      {allChecked && (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-center text-sm text-emerald-800">
          <p className="font-medium">
            すべての項目を確認しました。次のステップに進みましょう。
          </p>
          <a
            href="#step-4"
            className="mt-2 inline-flex items-center gap-1 font-bold text-emerald-700 hover:underline"
          >
            STEP 4 へ
            <svg
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </a>
        </div>
      )}
    </>
  );
}
