import type { Metadata } from "next";
import Breadcrumb from "@/components/business/hiring-guide/Breadcrumb";
import ForeignWorkerChart from "@/components/business/hiring-guide/ForeignWorkerChart";
import IndustryGrowthChart from "@/components/business/hiring-guide/IndustryGrowthChart";
import CompanySizeChart from "@/components/business/hiring-guide/CompanySizeChart";
import SubpageFooterCTA from "@/components/business/hiring-guide/SubpageFooterCTA";

export const metadata: Metadata = {
  title:
    "外国人採用の現状と中小企業のデータ【2025年最新】| 外国人雇用ガイド",
  description:
    "厚生労働省の最新データで見る外国人労働者257.1万人時代の実態。雇用事業所の63.1%が従業員30人未満の中小企業。業種別伸び率・国籍別推移を図解で解説。",
};

export default function TrendsPage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb
        items={[
          { label: "企業向けトップ", href: "/business" },
          { label: "外国人雇用ガイド", href: "/business/hiring-guide" },
          { label: "外国人採用の現状" },
        ]}
      />

      {/* タイトル */}
      <h1 className="text-2xl font-bold leading-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
        外国人採用は&quot;特別な企業&quot;のことではない
        <br />
        <span className="text-[var(--accent)]">
          数字で見る雇用の現実
        </span>
      </h1>

      {/* リード文 */}
      <div className="mt-8 rounded-xl border-l-4 border-l-[var(--accent)] bg-[var(--surface-muted)] p-6">
        <p className="text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
          &quot;大手だから外国人を使っている&quot;——そんな時代はとっくに終わっている。
          厚生労働省の最新データが示すのは、外国人を雇用する事業所の6割以上が従業員30人未満の中小企業だという現実だ。
          あなたの会社の近くの工場も、農場も、介護施設も、すでに外国人なしでは回らなくなっている。
        </p>
      </div>

      {/* ヒーロー数字 */}
      <div className="mt-12 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="text-3xl font-bold text-[var(--primary)] font-countdown">
            257.1万人
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            2025年10月末時点の外国人労働者数（過去最高）
          </p>
          <p className="mt-1 text-xs text-gray-400">
            出典：厚生労働省
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="text-3xl font-bold text-[var(--accent)] font-countdown">
            +11.7%
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            前年比増加率、増加幅約26万8,000人（268,450人）も過去最大
          </p>
        </div>
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
          <p className="text-3xl font-bold text-[var(--primary)] font-countdown">
            63.1%
          </p>
          <p className="mt-2 text-xs text-[var(--muted-foreground)]">
            外国人を雇う事業所のうち従業員30人未満の割合
          </p>
        </div>
      </div>

      {/* メイングラフ：外国人労働者数の推移 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          外国人労働者数の推移（2012年〜2025年）
        </h2>
        <ForeignWorkerChart />
      </div>

      {/* 業種別前年比伸び率 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          業種別 前年比伸び率（2025年）
        </h2>
        <IndustryGrowthChart />
      </div>

      {/* 事業所規模ドーナツグラフ */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          外国人を雇用する事業所の規模
        </h2>
        <CompanySizeChart />
      </div>

      {/* なぜ今これほど増えているのか */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          なぜ今これほど増えているのか
        </h2>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-[var(--foreground)]">
              制度の整備
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>2019年に特定技能制度が創設、即戦力としての採用が可能に</li>
              <li>特定技能は2025年10月時点で28.6万人（286,225人）、前年比38.3%増と急増</li>
              <li>2027年には育成就労制度がスタート、制度がさらに使いやすくなる</li>
            </ul>
            <p className="mt-2 text-xs text-gray-400">
              出典：厚生労働省
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-[var(--foreground)]">
              人手不足の深刻化
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>製造・介護・建設・農業などで日本人の応募が集まらない状況が常態化</li>
              <li>特に地方・中小企業では外国人なしでは事業継続が困難なケースも増加</li>
            </ul>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5">
            <h3 className="mb-3 text-base font-bold text-[var(--foreground)]">
              企業の意識変化
            </h3>
            <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
              <li>「特別なこと」から「経営判断」へ</li>
              <li>外国人材を活用している企業のほうが採用力・生産性で優位に立ちつつある</li>
            </ul>
          </div>
        </div>
      </div>

      {/* 急増する国籍 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          急増する国籍 — ミャンマー・インドネシアが牽引
        </h2>
        <div className="rounded-xl border-l-4 border-l-[var(--accent)] bg-[var(--surface-muted)] p-6">
          <p className="text-sm leading-relaxed text-[var(--muted-foreground)] sm:text-base">
            国籍別で特に増加が著しいのが東南アジア諸国。
            ミャンマーからの外国人労働者は前年比<span className="font-bold text-[var(--foreground)]">+42.5%</span>（約4万8,700人増）、
            インドネシアは<span className="font-bold text-[var(--foreground)]">+34.6%</span>（約5万8,600人増）と急増しており、
            ベトナムに次ぐ新たな主要送出し国として台頭している。
          </p>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
            <p className="text-2xl font-bold text-[var(--primary)]">60.6万人</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">ベトナム（23.6%・最多）</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">+42.5%</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">ミャンマー（前年比伸び率）</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5 text-center">
            <p className="text-2xl font-bold text-[var(--accent)]">+34.6%</p>
            <p className="mt-1 text-xs text-[var(--muted-foreground)]">インドネシア（前年比伸び率）</p>
          </div>
        </div>
        <p className="mt-3 text-xs text-gray-400">
          出典：厚生労働省「外国人雇用状況」届出状況（2025年10月末時点）
        </p>
      </div>

      {/* 在留資格別の構成 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          在留資格別の構成 — 専門人材が初の最多に
        </h2>
        <div className="mb-4 rounded-xl border-l-4 border-l-[var(--accent)] bg-[var(--surface-muted)] p-4">
          <p className="text-sm font-bold text-[var(--foreground)]">
            「専門的・技術的分野」が初めて在留資格カテゴリ別で最多に。特定技能の急拡大が牽引。
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            { label: "専門的・技術的分野", value: "86.6万人", share: "33.7%", note: "前年比+20.4%", accent: true },
            { label: "身分に基づく在留資格", value: "64.6万人", share: "25.1%", note: "前年比+2.6%", accent: false },
            { label: "技能実習", value: "49.9万人", share: "19.4%", note: "前年比+6.1%", accent: false },
            { label: "うち特定技能", value: "28.6万人", share: "11.1%", note: "前年比+38.3%", accent: true },
          ].map((item) => (
            <div
              key={item.label}
              className={`flex items-center justify-between rounded-xl border p-4 ${
                item.accent
                  ? "border-[var(--accent)] bg-[var(--accent-muted)]"
                  : "border-[var(--border)] bg-[var(--surface)]"
              }`}
            >
              <div>
                <p className="text-sm font-bold text-[var(--foreground)]">{item.label}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{item.note}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-[var(--primary)]">{item.value}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{item.share}</p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-xs text-gray-400">
          出典：厚生労働省「外国人雇用状況」届出状況（2025年10月末時点）
        </p>
      </div>

      {/* 外国人採用のポジティブ効果 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          外国人採用のポジティブ効果
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            {
              icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
              title: "人手不足の解消",
              desc: "事業継続・受注機会の確保",
            },
            {
              icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
              title: "若年・中長期戦力の確保",
              desc: "特定技能2号なら無期限就労も可",
            },
            {
              icon: "M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z",
              title: "職場の多様性",
              desc: "異なる視点が業務改善につながる事例",
            },
            {
              icon: "M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9",
              title: "海外展開・インバウンド対応",
              desc: "語学・文化理解の強み",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex gap-4 rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--accent-muted)]">
                <svg
                  className="h-5 w-5 text-[var(--accent)]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={item.icon}
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-sm font-bold text-[var(--foreground)]">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 出典 */}
      <div className="mt-16 rounded-xl bg-[var(--surface-muted)] p-6">
        <p className="text-xs font-bold text-[var(--muted-foreground)] mb-2">出典・データソース</p>
        <p className="text-xs text-[var(--muted-foreground)] leading-relaxed">
          厚生労働省「外国人雇用状況の届出状況まとめ（令和7年10月末時点）」（2026年1月公表）
        </p>
        <a
          href="https://www.mhlw.go.jp/stf/newpage_68794.html"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block text-xs text-[var(--accent)] hover:underline"
        >
          厚生労働省 公式ページ →
        </a>
      </div>

      <SubpageFooterCTA />
    </main>
  );
}
