/* ===== 外国人雇用完全ガイド データ定義 ===== */

export interface RelatedArticle {
  title: string;
  slug: string;
}

export interface VisaComparisonCard {
  name: string;
  target: string;
  industries: string;
  duration: string;
  highlight: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  detail?: string;
}

export interface TimelineItem {
  timing: string;
  title: string;
  tasks: string[];
}

export interface StepData {
  number: number;
  id: string;
  title: string;
  purpose: string;
  lead: string;
  relatedArticles: RelatedArticle[];
}

/* ===== 関連記事プレースホルダー ===== */
export const relatedArticles: Record<string, RelatedArticle[]> = {
  step1: [
    { title: "外国人労働者受け入れの現状と2030年問題", slug: "" },
  ],
  step2: [
    { title: "育成就労と特定技能の違いを徹底比較", slug: "" },
    { title: "技術・人文知識・国際業務ビザとは", slug: "" },
    { title: "留学生採用のメリットと注意点", slug: "" },
  ],
  step3: [
    { title: "在留資格ごとの受け入れ要件まとめ", slug: "" },
  ],
  step4: [
    { title: "外国人採用にかかるコスト全解説", slug: "" },
    { title: "監理費の相場と内訳", slug: "" },
  ],
  step5: [
    { title: "監理団体の選び方と比較ポイント", slug: "" },
    { title: "送出機関とは何か", slug: "" },
  ],
  step6: [
    { title: "外国人労働者の住居確保ガイド", slug: "" },
    { title: "入社前に準備すべき書類チェックリスト", slug: "" },
  ],
  step7: [
    { title: "外国人労働者の定着率を上げる5つの方法", slug: "" },
    { title: "在留資格の更新手続き完全ガイド", slug: "" },
  ],
};

/* ===== ステップ基本データ ===== */
export const steps: StepData[] = [
  {
    number: 1,
    id: "step-1",
    title: "なぜ今、外国人採用なのか",
    purpose: "自分ごと化。経営者に「やらないリスク」を伝える。",
    lead: "日本の生産年齢人口は2030年に約600万人減少すると予測されています。人材確保の選択肢として外国人採用が注目される理由と、期待と現実のギャップを整理します。",
    relatedArticles: relatedArticles.step1,
  },
  {
    number: 2,
    id: "step-2",
    title: "どの制度（在留資格）を使うのか",
    purpose: "制度の全体像を一覧で見せ、自社に合う選択肢を絞らせる。",
    lead: "外国人を雇用するには、業務内容に合った在留資格が必要です。主要な4つの制度を比較し、自社に合った選択肢を見つけましょう。",
    relatedArticles: relatedArticles.step2,
  },
  {
    number: 3,
    id: "step-3",
    title: "自社で受け入れできるか確認する",
    purpose: "「うちでも使えるの？」という不安を解消。セルフチェックリスト。",
    lead: "在留資格によって受け入れ条件は異なります。自社が要件を満たしているか、主要なチェックポイントを確認しましょう。",
    relatedArticles: relatedArticles.step3,
  },
  {
    number: 4,
    id: "step-4",
    title: "費用・コストを試算する",
    purpose: "「思ったより高い/安い」の判断材料を提供。",
    lead: "外国人採用には、日本人採用とは異なるコスト構造があります。初期費用・月次費用・隠れコストの3カテゴリで全体像を把握しましょう。",
    relatedArticles: relatedArticles.step4,
  },
  {
    number: 5,
    id: "step-5",
    title: "監理団体・人材エージェントを選ぶ",
    purpose: "パートナー選定で失敗しないための判断軸を提供。",
    lead: "制度によっては監理団体や登録支援機関の利用が必須です。信頼できるパートナーを選ぶためのポイントを解説します。",
    relatedArticles: relatedArticles.step5,
  },
  {
    number: 6,
    id: "step-6",
    title: "受け入れ準備をする",
    purpose: "入国前〜入社初日までの準備タスクを時系列で整理。",
    lead: "採用決定から入社までには多くの準備が必要です。タイムライン形式で主要タスクを確認し、漏れなく進めましょう。",
    relatedArticles: relatedArticles.step6,
  },
  {
    number: 7,
    id: "step-7",
    title: "入国後の支援と長期定着",
    purpose: "「採用して終わり」でなく定着させることの重要性を伝える。",
    lead: "採用はゴールではなくスタートです。在留資格の更新から日常の定着支援まで、長期雇用に必要な取り組みを解説します。",
    relatedArticles: relatedArticles.step7,
  },
];

/* ===== STEP 1: 外国人採用の背景 ===== */
export const step1Cards = [
  {
    title: "2030年問題",
    description:
      "生産年齢人口（15〜64歳）は2030年に約6,900万人まで減少。特に製造・介護・建設分野での人手不足が深刻化します。",
  },
  {
    title: "同業他社の動向",
    description:
      "外国人労働者数は200万人を超え、過去10年で約3倍に増加。業種を問わず外国人材の活用は「特別なこと」から「経営判断」に変わっています。",
  },
  {
    title: "できること・できないこと",
    description:
      "外国人採用で即戦力の確保や多様な視点の獲得が期待できる一方、言語・文化面のサポートコストは必要です。過度な期待は禁物——正しい理解が成功の鍵です。",
  },
];

/* ===== STEP 2: 在留資格比較 ===== */
export const visaComparisonCards: VisaComparisonCard[] = [
  {
    name: "育成就労",
    target: "未経験者をゼロから育てたい企業",
    industries: "製造・農業・建設・介護など",
    duration: "3年",
    highlight: "2027年〜新制度",
  },
  {
    name: "特定技能（1号・2号）",
    target: "即戦力が欲しい、一定の技能がある人材を求める企業",
    industries: "製造・農業・建設・介護・飲食・宿泊など14分野",
    duration: "1号：最長5年、2号：無制限",
    highlight: "即戦力",
  },
  {
    name: "技術・人文知識・国際業務",
    target: "ホワイトカラー職種・通訳・営業などを採用したい企業",
    industries: "業種制限なし（職種による）",
    duration: "制限なし（更新制）",
    highlight: "ホワイトカラー",
  },
  {
    name: "留学生採用（卒業後）",
    target: "日本語・文化理解が高い人材を求める企業",
    industries: "業種制限なし",
    duration: "制限なし",
    highlight: "日本語力◎",
  },
];

/* ===== STEP 3: 受け入れ要件チェックリスト ===== */
export const checklistItems: ChecklistItem[] = [
  {
    id: "check-1",
    text: "受け入れたい業務が、在留資格の対象業種・職種に該当している",
    detail: "育成就労・特定技能は対象分野が限定されています。技人国は職種で判断されます。",
  },
  {
    id: "check-2",
    text: "常勤職員数に対する受け入れ人数枠を確認した",
    detail: "育成就労・特定技能では、常勤職員数に応じた人数枠が設定されています。",
  },
  {
    id: "check-3",
    text: "社会保険・労働保険に適切に加入している",
    detail: "法令遵守は受け入れの大前提です。未加入の場合は許可が下りません。",
  },
  {
    id: "check-4",
    text: "外国人に対して日本人と同等以上の報酬を支払う予定である",
    detail: "同一労働同一賃金の原則は外国人にも適用されます。最低賃金以上かつ同等報酬が必須です。",
  },
  {
    id: "check-5",
    text: "過去に技能実習に関する不正行為を行っていない",
    detail: "不正行為があった場合、一定期間は受け入れができません。",
  },
  {
    id: "check-6",
    text: "受け入れ担当者・生活支援体制を整備できる見込みがある",
    detail: "特定技能では登録支援機関の利用も可能です。育成就労では監理支援機関の支援が必須です。",
  },
];

/* ===== STEP 4: コストカテゴリ ===== */
export const costCategories = [
  {
    category: "初期費用",
    icon: "💰",
    color: "blue" as const,
    items: [
      { name: "送出機関費用", range: "20〜60万円/人" },
      { name: "渡航費（航空券等）", range: "5〜15万円/人" },
      { name: "住居初期費用（敷金・家具等）", range: "15〜40万円/人" },
      { name: "在留資格申請・行政手数料", range: "3〜10万円/人" },
    ],
  },
  {
    category: "月次費用",
    icon: "📅",
    color: "emerald" as const,
    items: [
      { name: "監理費（育成就労の場合）", range: "3〜5万円/人/月" },
      { name: "支援委託費（特定技能の場合）", range: "2〜3万円/人/月" },
      { name: "住居補助・光熱費補助", range: "1〜3万円/人/月" },
      { name: "日本語研修費", range: "1〜3万円/人/月" },
    ],
  },
  {
    category: "隠れコスト",
    icon: "🔍",
    color: "amber" as const,
    items: [
      { name: "通訳・翻訳費用", range: "随時発生" },
      { name: "生活支援の人件費・工数", range: "担当者の稼働時間" },
      { name: "早期離職時の再採用費", range: "初期費用の再発生" },
      { name: "社内研修・安全教育の多言語化", range: "10〜50万円" },
    ],
  },
];

/* ===== STEP 5: パートナー選定 ===== */
export const partnerCheckpoints = [
  {
    title: "実績と専門性",
    description: "自社の業種・地域での受け入れ実績があるか。特定の在留資格に精通しているか。",
  },
  {
    title: "費用の透明性",
    description: "監理費・手数料の内訳が明確か。追加費用が発生する条件を事前に説明しているか。",
  },
  {
    title: "サポート体制",
    description: "母国語対応のスタッフがいるか。緊急時の対応体制は整っているか。",
  },
  {
    title: "法令遵守の姿勢",
    description: "外国人技能実習機構（OTIT）の評価や行政処分歴を確認。コンプライアンス意識が高いか。",
  },
  {
    title: "情報開示の姿勢",
    description: "送出機関の選定基準や手数料を開示しているか。「囲い込み」をしていないか。",
  },
];

export const partnerWarnings = [
  "手数料の内訳を開示しない業者",
  "送出機関を自由に選ばせない「囲い込み型」",
  "実習生・特定技能者との直接連絡を制限する業者",
  "法定費用以外の不明瞭な請求がある業者",
];

/* ===== STEP 6: 受け入れ準備タイムライン ===== */
export const timelineItems: TimelineItem[] = [
  {
    timing: "6ヶ月前",
    title: "住居の確保",
    tasks: [
      "寮・社宅、または賃貸物件の手配",
      "家具・家電・生活必需品の準備",
      "Wi-Fi・携帯電話の手配計画",
    ],
  },
  {
    timing: "4ヶ月前",
    title: "社内体制の整備",
    tasks: [
      "受け入れ担当者・メンターの選定",
      "社内への受け入れ説明会の実施",
      "多言語対応ツール・翻訳資料の準備",
    ],
  },
  {
    timing: "3ヶ月前",
    title: "職場環境の準備",
    tasks: [
      "安全教育資料の多言語化",
      "作業手順書の翻訳・ビジュアル化",
      "社内掲示物の多言語対応",
    ],
  },
  {
    timing: "1ヶ月前",
    title: "書類・手続きの最終確認",
    tasks: [
      "雇用契約書の締結（母国語併記）",
      "在留カード受け取り手続きの確認",
      "空港からの送迎手配",
    ],
  },
  {
    timing: "入社初日",
    title: "生活ガイダンスの実施",
    tasks: [
      "銀行口座の開設サポート",
      "市役所での住民登録の同行",
      "通勤経路・買い物先・医療機関の案内",
    ],
  },
];

/* ===== STEP 7: 定着支援 ===== */
export const retentionPoints = [
  {
    title: "在留資格の更新管理",
    description:
      "在留期限の3ヶ月前には更新手続きを開始。期限管理をシステム化し、担当者任せにしないことが重要です。",
  },
  {
    title: "コミュニケーション支援",
    description:
      "定期面談の実施、相談窓口の設置、やさしい日本語の活用。「困ったことはない？」と聞くだけでは不十分——安心して相談できる仕組みが必要です。",
  },
  {
    title: "キャリアパスの提示",
    description:
      "在留資格のステップアップ（育成就労→特定技能→2号）や、昇給・昇格の基準を明示。将来が見える環境が定着につながります。",
  },
  {
    title: "よくある離職理由への対策",
    description:
      "給与への不満、孤立感、キャリア不安が主な離職理由です。定期的な待遇見直しと、コミュニティ形成の支援が効果的です。",
  },
];
