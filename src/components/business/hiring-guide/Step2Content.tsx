import { visaComparisonCards } from '@/lib/hiring-guide-data';

const colorMap: Record<
  string,
  { band: string; bandText: string; bandLabel: string }
> = {
  "技能実習 → 育成就労": {
    band: "bg-orange-500",
    bandText: "text-white",
    bandLabel: "移行期間中",
  },
  "特定技能（1号・2号）": {
    band: "bg-blue-600",
    bandText: "text-white",
    bandLabel: "即戦力",
  },
  "技術・人文知識・国際業務": {
    band: "bg-violet-600",
    bandText: "text-white",
    bandLabel: "ホワイトカラー",
  },
  "留学生採用（卒業後）": {
    band: "bg-amber-500",
    bandText: "text-white",
    bandLabel: "日本語力◎",
  },
};

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-[var(--muted-foreground)]">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium text-[var(--foreground)]">
        {value}
      </p>
    </div>
  );
}

export default function Step2Content() {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {/* 技能実習 → 育成就労 統合カード */}
      <div className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-lg">
        <div className="bg-orange-500 px-5 py-2">
          <span className="text-xs font-bold tracking-wider text-white">
            移行期間中
          </span>
        </div>
        <div className="p-6">
          {/* 制度名の移行表示 */}
          <div className="mb-5 flex items-center gap-3">
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--muted-foreground)]">
                技能実習制度
              </p>
              <p className="text-xs text-[var(--subtle)]">〜2027年3月</p>
            </div>
            <svg
              className="h-5 w-5 shrink-0 text-orange-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M13 7l5 5m0 0l-5 5m5-5H6"
              />
            </svg>
            <div className="text-center">
              <p className="text-lg font-bold text-[var(--foreground)]">
                育成就労制度
              </p>
              <p className="text-xs text-orange-600 font-medium">2027年4月〜</p>
            </div>
          </div>

          <div className="space-y-3">
            <InfoRow
              label="向いている企業"
              value="未経験者をゼロから育てたい企業"
            />
            <InfoRow
              label="主な業種"
              value="製造・農業・建設・介護など"
            />
            <InfoRow
              label="雇用期間"
              value="3年（育成就労）/ 最長5年（技能実習）"
            />
          </div>

          <div className="mt-5 rounded-lg border border-orange-200 bg-orange-50 px-4 py-3 text-xs leading-relaxed text-orange-800">
            現在も技能実習での新規受け入れは可能ですが、新規計画は育成就労を前提に準備することを推奨します。
          </div>
        </div>
      </div>

      {/* 残りの3カード */}
      {visaComparisonCards
        .filter((c) => c.name !== "育成就労")
        .map((card) => {
          const colors = colorMap[card.name] ?? {
            band: "bg-gray-500",
            bandText: "text-white",
            bandLabel: card.highlight,
          };
          return (
            <div
              key={card.name}
              className="overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface)] transition-shadow hover:shadow-lg"
            >
              <div className={`${colors.band} px-5 py-2`}>
                <span
                  className={`text-xs font-bold tracking-wider ${colors.bandText}`}
                >
                  {colors.bandLabel}
                </span>
              </div>
              <div className="p-6">
                <h3 className="mb-5 text-xl font-bold text-[var(--foreground)]">
                  {card.name}
                </h3>
                <div className="space-y-3">
                  <InfoRow label="向いている企業" value={card.target} />
                  <InfoRow label="主な業種" value={card.industries} />
                  <InfoRow label="雇用期間" value={card.duration} />
                </div>
              </div>
            </div>
          );
        })}
    </div>
  );
}
