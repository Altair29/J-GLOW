import type { Metadata } from "next";
import Breadcrumb from "@/components/business/hiring-guide/Breadcrumb";
import SubpageFooterCTA from "@/components/business/hiring-guide/SubpageFooterCTA";

export const metadata: Metadata = {
  title:
    "外国人採用でできること・できないこと【正直解説】| 外国人雇用ガイド",
  description:
    "外国人採用は安く使えるは誤解。労働基準法が適用され日本人同等賃金が必須。一方で人手不足解消や若年戦力確保は本当に効果的。正直な情報で正しい期待値を設定。",
};

const evaluationRows = [
  {
    issue: "慢性的な人手不足を補う",
    rating: "✅",
    ratingLabel: "解決できる",
    detail:
      "特に製造・農業・介護・建設・宿泊業で即効性あり。業種・在留資格の対応確認が必要",
    bg: "bg-emerald-50",
    ratingColor: "text-emerald-700",
  },
  {
    issue: "即戦力が欲しい",
    rating: "△",
    ratingLabel: "条件次第",
    detail:
      "特定技能なら一定のスキルと日本語能力あり。育成就労・技能実習は未経験者前提",
    bg: "bg-amber-50",
    ratingColor: "text-amber-700",
  },
  {
    issue: "安く雇いたい",
    rating: "❌",
    ratingLabel: "できない",
    detail:
      "労働基準法第3条により国籍を理由とした賃金差別は禁止。在留資格取得要件として「日本人と同等以上の報酬」が明記されている",
    bg: "bg-red-50",
    ratingColor: "text-red-700",
  },
  {
    issue: "採用してすぐ現場に出したい",
    rating: "❌",
    ratingLabel: "難しい",
    detail:
      "入国後の生活立ち上げ・職場環境への適応に数週間〜1ヶ月程度かかる。育成就労は研修期間が必要",
    bg: "bg-red-50",
    ratingColor: "text-red-700",
  },
  {
    issue: "語学不要の作業を担ってほしい",
    rating: "✅",
    ratingLabel: "解決できる",
    detail:
      "製造ライン・農作業・介護補助など、日本語が限定的でも従事できる業務は多い",
    bg: "bg-emerald-50",
    ratingColor: "text-emerald-700",
  },
  {
    issue: "長く定着してほしい",
    rating: "△",
    ratingLabel: "工夫次第",
    detail:
      "特定技能の3年半以内離職率は16.1%（出典：出入国在留管理庁）。日本人新卒の3年以内離職率30%以上より低い。ただし定着には支援体制の整備が必要",
    bg: "bg-amber-50",
    ratingColor: "text-amber-700",
  },
  {
    issue: "全業種・全職種で使える",
    rating: "❌",
    ratingLabel: "できない",
    detail:
      "在留資格ごとに対応業種・職種が限定されている（STEP2・STEP3参照）",
    bg: "bg-red-50",
    ratingColor: "text-red-700",
  },
];

export default function HonestGuidePage() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-12">
      <Breadcrumb
        items={[
          { label: "企業向けトップ", href: "/business" },
          { label: "外国人雇用ガイド", href: "/business/hiring-guide" },
          { label: "できること・できないこと" },
        ]}
      />

      {/* タイトル */}
      <h1 className="text-2xl font-bold leading-tight text-[var(--foreground)] sm:text-3xl lg:text-4xl">
        外国人採用で解決できること、できないこと
        <br />
        <span className="text-[var(--accent)]">正直に書きます</span>
      </h1>

      {/* 冒頭メッセージ */}
      <div className="mt-8 rounded-xl bg-[var(--primary)] p-6 text-white">
        <p className="text-sm leading-relaxed sm:text-base">
          このページでは、外国人採用について正直に書きます。
          メリットだけを並べた情報より、現実を知った上で始めた企業のほうが、
          うまくいく確率は格段に高いからです。
        </p>
      </div>

      {/* ○△× 評価テーブル */}
      <div className="mt-12">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          期待と現実の一覧
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-sm">
            <thead>
              <tr className="border-b-2 border-[var(--border)]">
                <th className="py-3 pr-4 text-left font-bold text-[var(--foreground)]">
                  課題
                </th>
                <th className="w-24 py-3 px-2 text-center font-bold text-[var(--foreground)]">
                  評価
                </th>
                <th className="py-3 pl-4 text-left font-bold text-[var(--foreground)]">
                  詳細説明
                </th>
              </tr>
            </thead>
            <tbody>
              {evaluationRows.map((row) => (
                <tr key={row.issue} className={row.bg}>
                  <td className="py-4 pr-4 font-medium text-[var(--foreground)]">
                    {row.issue}
                  </td>
                  <td className="py-4 px-2 text-center">
                    <span className={`text-base font-bold ${row.ratingColor}`}>
                      {row.rating} {row.ratingLabel}
                    </span>
                  </td>
                  <td className="py-4 pl-4 text-[var(--muted-foreground)]">
                    {row.detail}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-gray-400">
          ※労働基準法第3条（均等待遇）、在留資格取得における同等報酬要件（出入国管理及び難民認定法関連告示）、2020年4月施行の同一労働同一賃金ルールにより、国籍を理由とした賃金差別は法律で禁じられています。
        </p>
      </div>

      {/* よくある誤解 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          よくある誤解
        </h2>
        <div className="space-y-6">
          {/* 誤解1 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                誤解
              </span>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                「安く使える」
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-[var(--muted-foreground)]">
                  誤解の背景
                </p>
                <p className="text-[var(--foreground)]">
                  「技能実習生は最低賃金でいい」という古い認識
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--muted-foreground)]">
                  現実
                </p>
                <p className="text-[var(--foreground)]">
                  労働基準法・最低賃金法は外国人にも完全適用。不法行為は罰則あり。さらに特定技能では「日本人同等以上」が明示要件
                </p>
              </div>
              <div className="rounded-lg bg-[var(--surface-muted)] p-3">
                <p className="font-medium text-[var(--accent)]">
                  正しい理解
                </p>
                <p className="text-[var(--foreground)]">
                  コスト優位性は「賃金の安さ」ではなく「採用難の解消」と「長期安定就労」にある
                </p>
              </div>
            </div>
          </div>

          {/* 誤解2 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                誤解
              </span>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                「すぐ現場に出せる」
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-[var(--muted-foreground)]">
                  誤解の背景
                </p>
                <p className="text-[var(--foreground)]">
                  「来てくれたらあとは現場に任せればいい」という期待
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--muted-foreground)]">
                  現実
                </p>
                <p className="text-[var(--foreground)]">
                  住居・銀行口座・交通・職場ルールの理解など、日本での生活立ち上げに企業のサポートが必要。最初の1〜3ヶ月が定着の分岐点
                </p>
              </div>
              <div className="rounded-lg bg-[var(--surface-muted)] p-3">
                <p className="font-medium text-[var(--accent)]">
                  正しい理解
                </p>
                <p className="text-[var(--foreground)]">
                  初期投資として準備期間のコストと工数を計画に含める
                </p>
              </div>
            </div>
          </div>

          {/* 誤解3 */}
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-bold text-red-700">
                誤解
              </span>
              <h3 className="text-base font-bold text-[var(--foreground)]">
                「いつでも解雇できる」
              </h3>
            </div>
            <div className="space-y-3 text-sm">
              <div>
                <p className="font-medium text-[var(--muted-foreground)]">
                  誤解の背景
                </p>
                <p className="text-[var(--foreground)]">
                  「契約期間が来れば終わり」という期待
                </p>
              </div>
              <div>
                <p className="font-medium text-[var(--muted-foreground)]">
                  現実
                </p>
                <p className="text-[var(--foreground)]">
                  労働契約法が適用され、合理的理由のない解雇は無効。在留資格と雇用契約が連動しているため、不当解雇は在留問題にも波及するリスクあり
                </p>
              </div>
              <div className="rounded-lg bg-[var(--surface-muted)] p-3">
                <p className="font-medium text-[var(--accent)]">
                  正しい理解
                </p>
                <p className="text-[var(--foreground)]">
                  日本人雇用と同じ労働法規が適用される。「短期で切れる人材」ではなく「育てる人材」として計画する
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 定着率の正直な解説 */}
      <div className="mt-16">
        <h2 className="mb-6 text-xl font-bold text-[var(--foreground)]">
          外国人は本当に&quot;すぐ辞める&quot;のか？
        </h2>

        <div className="mb-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">
              特定技能の3年半以内離職率
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--primary)] font-countdown">
              16.1%
            </p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-6 text-center">
            <p className="text-xs text-[var(--muted-foreground)]">
              日本人新規学卒者の3年以内離職率
            </p>
            <p className="mt-2 text-3xl font-bold text-[var(--muted-foreground)] font-countdown">
              30%以上
            </p>
            <p className="mt-1 text-xs text-gray-400">大卒含む</p>
          </div>
        </div>

        <div className="rounded-xl border-l-4 border-l-[var(--accent)] bg-[var(--surface-muted)] p-5">
          <p className="text-sm text-[var(--foreground)]">
            つまり、適切な受け入れ体制があれば、特定技能の定着率は日本人新卒より高い。
          </p>
        </div>

        <div className="mt-6">
          <h3 className="mb-3 text-base font-bold text-[var(--foreground)]">
            自己都合離職後の進路
          </h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-lg bg-[var(--surface-muted)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--foreground)] font-countdown">
                31.4%
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">帰国</p>
            </div>
            <div className="rounded-lg bg-[var(--surface-muted)] p-4 text-center">
              <p className="text-2xl font-bold text-[var(--foreground)] font-countdown">
                30.3%
              </p>
              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                特定技能で転職
              </p>
            </div>
          </div>
          <p className="mt-3 text-sm text-[var(--muted-foreground)]">
            「逃げる」のではなく「帰国」か「転職」。日本人と同じ行動パターン。
          </p>
          <p className="mt-1 text-xs text-gray-400">
            出典：出入国在留管理庁「技能実習制度及び特定技能制度の在り方に関する有識者会議」資料
          </p>
        </div>

        <div className="mt-8">
          <h3 className="mb-4 text-base font-bold text-[var(--foreground)]">
            離職を防ぐ3つのポイント
          </h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                num: 1,
                title: "生活サポートの充実",
                desc: "住居・通訳・相談窓口",
              },
              {
                num: 2,
                title: "キャリアパスの明示",
                desc: "育成就労→特定技能→特定技能2号の道筋",
              },
              {
                num: 3,
                title: "職場コミュニケーション",
                desc: "多言語での業務説明・定期面談",
              },
            ].map((p) => (
              <div
                key={p.num}
                className="rounded-xl border border-[var(--border)] bg-[var(--surface)] p-5"
              >
                <span className="mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[var(--accent)] text-sm font-bold text-[var(--primary)] font-countdown">
                  {p.num}
                </span>
                <h4 className="mt-2 text-sm font-bold text-[var(--foreground)]">
                  {p.title}
                </h4>
                <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 定着に成功した企業のパターン */}
      <section className="mt-14">
        <h2 className="text-xl font-bold text-[#1a2f5e] mb-2 pb-2 border-b-2 border-[#c9a84c]">
          定着に成功している企業に共通すること
        </h2>
        <p className="text-gray-600 text-sm mb-6">
          離職率が低い企業には、業種・規模を問わず共通するパターンがあります。
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
            <div className="text-2xl font-bold text-[#1a2f5e] mb-1">01</div>
            <h3 className="font-bold text-[#1a2f5e] mb-2">入国後3ヶ月に投資する</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              生活立ち上げサポート・業務OJT・日本語支援を丁寧に行った企業は、その後の定着率が大きく改善する傾向があります。最初の3ヶ月が3年間を決めます。
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
            <div className="text-2xl font-bold text-[#1a2f5e] mb-1">02</div>
            <h3 className="font-bold text-[#1a2f5e] mb-2">キャリアパスを入社時に見せる</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              「育成就労→特定技能1号→2号」という道筋を最初から示した企業では、本人の目標意識が高まり、自発的な学習につながるケースが多く報告されています。
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
            <div className="text-2xl font-bold text-[#1a2f5e] mb-1">03</div>
            <h3 className="font-bold text-[#1a2f5e] mb-2">相談できる人を作る</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              業務の相談先と生活の相談先を明確にしている企業では、問題が表面化する前に対処できるため、突然の退職が少ない傾向があります。
            </p>
          </div>
        </div>

        {/* 長期雇用企業の声 */}
        <h2 className="text-xl font-bold text-[#1a2f5e] mb-6 pb-2 border-b-2 border-[#c9a84c]">
          長期雇用した企業に起きた変化
        </h2>

        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-[#1a2f5e] rounded-full flex items-center justify-center text-white text-sm font-bold">製</div>
              <div>
                <p className="text-sm text-gray-500 mb-1">製造業・従業員50名・特定技能1号を3名採用</p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  「外国人スタッフが入ってから、日本人スタッフの業務マニュアル整備が一気に進みました。教えるためには言語化しないといけないので。結果として日本人の新人教育にも使えるものができました。」
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-[#2a6e4e] rounded-full flex items-center justify-center text-white text-sm font-bold">農</div>
              <div>
                <p className="text-sm text-gray-500 mb-1">農業・従業員12名・育成就労で2名受入れ</p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  「正直、最初は不安でした。でも5年目になったスタッフは今、新しく入った日本人スタッフを教える側になっています。長く続けてくれると、こちらの現場を一番わかってくれる人材になります。」
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-10 h-10 bg-[#7a3a1e] rounded-full flex items-center justify-center text-white text-sm font-bold">介</div>
              <div>
                <p className="text-sm text-gray-500 mb-1">介護施設・従業員35名・特定技能1号を5名採用</p>
                <p className="text-gray-700 leading-relaxed text-sm">
                  「利用者さんが外国人スタッフの名前を呼んで笑顔になっている。それだけで採用してよかったと思います。離職率？うちは外国人スタッフの方が長く続いています。」
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 p-5 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm text-gray-700 leading-relaxed">
            <span className="font-bold text-[#1a2f5e]">まとめると：</span>
            外国人雇用は「リスクを承知で使う手段」ではなく、
            <span className="font-bold">準備した企業にとっては継続的な採用力の強化</span>になります。
            定着率データが示すとおり、正しく始めた企業の多くが「もっと早く始めればよかった」と言います。
          </p>
        </div>
      </section>

      {/* 締めセクション */}
      <div className="mt-16 rounded-xl bg-[var(--primary)] p-8 text-white">
        <p className="text-sm leading-relaxed sm:text-base">
          課題を知った上で取り組む企業が増えている。正しい準備をした企業にとって、
          外国人採用は&quot;リスク&quot;ではなく&quot;継続的な採用力の強化&quot;になる。
          <br />
          大事なのは誤解を持ったまま始めないこと。そして、始めないまま機会を逃さないこと。
        </p>
      </div>

      <SubpageFooterCTA />
    </main>
  );
}
