import type { Metadata } from "next";
import Breadcrumb from "@/components/business/hiring-guide/Breadcrumb";
import LaborPopulationChart from "@/components/business/hiring-guide/LaborPopulationChart";
import SubpageFooterCTA from "@/components/business/hiring-guide/SubpageFooterCTA";

export const metadata: Metadata = {
  title:
    "日本の労働力不足と2030・2040・2070年問題 | はじめての外国人雇用ガイド",
  description:
    "国立社会保障・人口問題研究所の2023年推計データをもとに、日本の生産年齢人口が2070年に4,535万人まで減少する現実と、企業が今すぐ外国人採用を検討すべき理由を解説。",
};

export default function LaborShortagePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb
        items={[
          { label: "企業向けトップ", href: "/business" },
          { label: "外国人雇用ガイド", href: "/business/hiring-guide" },
          { label: "日本の労働力不足" },
        ]}
      />

      {/* タイトル */}
      <h1 className="text-2xl font-bold leading-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
        日本の労働力はどこへ向かうのか
        <br />
        <span className="text-[var(--accent)]">
          2030・2040・2070年の現実
        </span>
      </h1>

      {/* リード文 */}
      <div className="mt-8 rounded-xl border-l-4 border-l-[var(--accent)] bg-[var(--surface-muted)] p-6">
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          少子高齢化は知っている。でも、それが自社の採用にどう影響するか、具体的に考えたことはあるだろうか。
          国が公表しているデータは想像以上に厳しい。2070年、日本の働き手は今より3,000万人近く減る。
          これはもはや&quot;将来の話&quot;ではなく、採用担当者が今すぐ戦略を変えなければならない現実だ。
        </p>
      </div>

      {/* ヒーロー数字 */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="text-3xl font-bold text-red-600 font-countdown">
            ▼2,974万人
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            2020→2070年の生産年齢人口減少数
          </p>
          <p className="mt-1 text-xs text-gray-400">
            社人研2023年推計
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="text-3xl font-bold text-[var(--accent)] font-countdown">
            1.35人
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            2070年に現役世代1.35人で高齢者1人を支える
          </p>
          <p className="mt-1 text-xs text-gray-400">
            現在は2.08人
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="text-3xl font-bold text-[var(--primary)] font-countdown">
            644万人
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            2030年に不足すると予測される労働者数
          </p>
          <p className="mt-1 text-xs text-gray-400">
            パーソル総合研究所推計（民間調査）
          </p>
        </div>
      </div>

      {/* メイングラフ */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          生産年齢人口の推移（1990年〜2070年）
        </h2>
        <LaborPopulationChart />
      </div>

      {/* これは何を意味するのか */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          これは何を意味するのか
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-[var(--foreground)]">
              採用競争の激化
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>同じ求人に集まる応募者が減る</li>
              <li>特に地方・製造・介護・建設での影響が深刻</li>
              <li>求人倍率は2019年以降、慢性的に高止まり</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-[var(--foreground)]">
              賃金の上昇圧力
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>労働供給が減れば賃金は上がる（経済の基本原理）</li>
              <li>最低賃金は毎年引き上げが続き、2024年に全国加重平均1,055円</li>
              <li>外国人採用も「安く使える」手段ではなく、労働基準法・同一賃金ルールが適用される</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-[var(--foreground)]">
              外国人材の&quot;日本離れ&quot;リスク
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>円安が続き、韓国・台湾との獲得競争が激化</li>
              <li>ベトナムからの労働者の伸びが鈍化し始めている（2024年統計）</li>
              <li>「選んでもらえる職場」づくりが今後の課題</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 高齢者・女性の活躍でカバーできないのか */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          高齢者・女性の活躍でカバーできないのか
        </h2>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="rounded-xl border-l-4 border-l-emerald-500 border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-emerald-700">
              カバーできている部分
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>65歳以上の就業者が2023年に914万人（過去最高）</li>
              <li>女性の労働力率は上昇傾向</li>
              <li>これらの努力により、就業者数は底堅く推移</li>
            </ul>
          </div>
          <div className="rounded-xl border-l-4 border-l-amber-500 border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-amber-700">
              それでも足りない理由
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>生産年齢人口の絶対数減少は避けられない</li>
              <li>介護・医療の需要増で、支える側の人手も必要</li>
              <li>外国人労働者の活用は「代替策」ではなく「組み合わせ策」</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 2040年・2070年の日本はどうなるか */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          2040年・2070年の日本はどうなるか
        </h2>
        <div className="relative">
          <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-[var(--border)]" />
          <div className="space-y-8">
            {[
              {
                year: "2025年",
                text: "高齢者が人口の29.3%。団塊世代が後期高齢者に",
                color: "bg-blue-500",
              },
              {
                year: "2030年",
                text: "生産年齢人口が7,000万人割れ。人材不足644万人規模",
                color: "bg-[var(--accent)]",
              },
              {
                year: "2040年",
                text: "生産年齢人口6,213万人。高齢者比率34.8%。現役世代の社会保険負担が急増",
                color: "bg-orange-500",
              },
              {
                year: "2070年",
                text: "生産年齢人口4,535万人（1995年の約半分）。現役1.35人で高齢者1人を支える",
                color: "bg-red-500",
              },
            ].map((item) => (
              <div key={item.year} className="relative flex gap-4 pl-1">
                <div className="relative z-10 mt-1.5 flex shrink-0">
                  <div
                    className={`h-7 w-7 rounded-full ${item.color} flex items-center justify-center`}
                  >
                    <div className="h-2 w-2 rounded-full bg-white" />
                  </div>
                </div>
                <div className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-4">
                  <p className="text-sm font-bold text-[var(--foreground)] font-countdown">
                    {item.year}
                  </p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <SubpageFooterCTA />
    </main>
  );
}
