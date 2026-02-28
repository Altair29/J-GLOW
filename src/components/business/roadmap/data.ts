// ===== 育成就労制度 カウントダウン データ =====

export interface Milestone {
  id: string;
  date: string;
  label: string;
  status: "done" | "current" | "upcoming" | "target";
  detail: string;
  source: string | null;
}

export interface TaskDetail {
  overview: string;
  steps: string[];
  documents: { name: string; url?: string }[];
  source: string;
}

export type TaskType = "管理団体" | "受入企業支援";

export interface Deadline {
  date: Date | null;
  label: string;
  urgency: "critical" | "warning" | "normal" | null;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  category: string;
  taskType: TaskType;
  ctaPath: string;
  deadline: Deadline;
  detail: TaskDetail;
}

// ===== Practical Timeline =====
export type PracticalUrgency = "critical" | "warning" | "upcoming" | "target" | "normal";

export interface PracticalTimelineItem {
  id: string;
  period: string;
  targetDate?: Date;
  targetDateFrom?: Date;
  targetDateTo?: Date;
  actor: "管理団体" | "受入企業";
  phase: string;
  phaseColor: "slate" | "blue" | "emerald" | "amber";
  title: string;
  detail: string;
  urgency: PracticalUrgency;
}

// ターゲット日：育成就労制度 全面施行
export const TARGET_DATE = "2027-04-01T00:00:00+09:00";
export const TARGET_LABEL = "育成就労制度 施行まで";
export const TARGET_DISPLAY = "2027年4月1日（木）施行";

// ===== マイルストーン推定日付（残り日数計算用） =====
export const milestoneTargetDates: Record<string, { from: Date; to?: Date }> = {
  "定款変更・送出機関との協定締結": { from: new Date("2026-04-01") },
  "監理支援機関 許可申請 施行日前申請 受付開始": { from: new Date("2026-04-15") },
  "育成就労計画 認定申請 施行日前申請 受付開始": { from: new Date("2026-09-01") },
  "1号技能実習計画 認定申請 受付終了（目安）": { from: new Date("2027-02-28") },
  "監理支援機関 許可取得（想定）": { from: new Date("2026-11-01") },
  "育成就労制度 全面施行・受入開始": { from: new Date("2027-04-01") },
  "育成就労制度 COE交付申請期限": { from: new Date("2027-06-30") },
};

// ===== マイルストーン（16件） =====
export const milestones: Milestone[] = [
  { id: "m1", date: "2023年11月30日", label: "有識者会議 最終報告書", status: "done", detail: "技能実習制度の廃止・育成就労制度創設を提言。", source: null },
  { id: "m2", date: "2023年12月14・21日", label: "与党提言", status: "done", detail: "自民・公明両党が制度設計に関する提言を提出。", source: null },
  { id: "m3", date: "2024年2月9日", label: "政府方針決定", status: "done", detail: "閣議で制度の基本的方向性が決定された。", source: null },
  { id: "m4", date: "2024年3月15日", label: "法案閣議決定", status: "done", detail: "改正法案が閣議決定され、国会に提出された。", source: null },
  { id: "m5", date: "2024年6月14・21日", label: "改正法 成立・公布", status: "done", detail: "令和6年法律第60号が成立・公布。育成就労制度の法的根拠が確立。", source: "令和6年法律第60号" },
  { id: "m6", date: "2025年3月11日", label: "基本方針 閣議決定・試験方針 公表", status: "done", detail: "育成就労制度の適正な実施及び育成就労外国人の保護に関する基本方針（令和7年3月11日閣議決定）。同日、試験方針も公表。", source: "令和7年3月11日 閣議決定" },
  { id: "m7", date: "2025年9月30日", label: "主務省令 公布", status: "done", detail: "育成就労法施行規則（政令第341号等）が公布。申請手続きや基準の詳細が確定。", source: "令和7年政令第341号" },
  { id: "m8", date: "2026年2月", label: "育成就労制度 運用要領 公表", status: "done", detail: "出入国在留管理庁・厚生労働省が運用要領（全16章）を公表。監理支援機関許可申請の準備を本格開始すべき段階。参考様式の一部は準備でき次第追加公表予定。", source: "出入国在留管理庁・厚生労働省編（令和8年2月）" },
  { id: "m8a", date: "2026年2月〜（現在）", label: "監理支援機関 許可申請の準備期間", status: "current", detail: "運用要領公表を受け、許可申請に向けた書類準備・体制整備を進める時期。申請受付開始（2026年4月15日）まで残りわずか。今すぐ着手が必要。", source: "運用要領 第2章第1節「事業開始の3か月前までに申請推奨」" },
  { id: "m9", date: "2026年〜（継続）", label: "分野別運用方針 策定・公表（各分野）", status: "upcoming", detail: "各育成就労産業分野ごとの分野別運用方針が順次策定・公表される。育成就労外国人共同受入事業・職業紹介事業等が追加される可能性が高い。", source: "育成就労法 第7条の2" },
  { id: "m10", date: "2026年4月〜（推定）", label: "定款変更・送出機関との協定締結", status: "upcoming", detail: "監理支援機関として許可申請するには定款の事業目的に「監理支援事業」「育成就労職業紹介事業」等の記載が必要。送出国機関との取次契約締結も並行して進める。", source: "育成就労法施行規則第43条第1項第10号" },
  { id: "m11", date: "2026年4月15日", label: "監理支援機関 許可申請 施行日前申請 受付開始", status: "upcoming", detail: "外国人育成就労機構（本部）審査課での許可申請受付が開始される（施行日前申請）。書類準備に3〜4か月要するため今すぐ着手が必要。", source: "ISA公式Q&A・OTIT公式発表（2026年2月確認）" },
  { id: "m12", date: "2026年9月1日", label: "育成就労計画 認定申請 施行日前申請 受付開始", status: "upcoming", detail: "育成就労法附則第5条により施行日前から認定申請が可能。開始予定日の6か月前から申請可能、4か月前が実質的なデッドライン。この時点で監理支援機関の許可が必要。", source: "ISA公式Q&A（2026年2月確認）" },
  { id: "m13", date: "2026年11月（想定）", label: "監理支援機関 許可取得（想定）", status: "upcoming", detail: "4月15日以降に許可申請した場合、審査期間（3〜5か月）を経て11月頃に許可取得の見通し。11月：許可 → 11〜12月：育成就労計画作成指導 → 2027年1月：計画認定申請。", source: "運用要領 第2章第1節" },
  { id: "m13a", date: "2027年2月", label: "1号技能実習計画 認定申請 受付終了（目安）", status: "upcoming", detail: "OTITより「1号技能実習計画の認定申請は令和9年2月までに行うよう」案内が出ている", source: "OTIT公式サイト（2026年2月確認）" },
  { id: "m14", date: "2027年4月1日", label: "育成就労制度 全面施行・受入開始", status: "target", detail: "令和9年4月1日より育成就労外国人の受入れが正式開始。技能実習制度から育成就労制度への移行が始まる（技能実習制度は段階的廃止〜2032年頃）。", source: "改正法 施行日規定" },
  { id: "m15", date: "2027年6月30日", label: "育成就労制度 COE交付申請期限", status: "target", detail: "育成就労のCOEについては事前申請の受付規定がないため2027年4月1日以降の申請となる。最初の受入れ者に係る在留資格認定証明書交付申請の実質的な締切。", source: "育成就労法附則" },
];

// ===== カテゴリ左ボーダー色マッピング =====
export const categoryBorderColors: Record<string, string> = {
  "🏢 組織・体制整備": "border-l-blue-500",
  "📋 申請書類の準備": "border-l-emerald-500",
  "✅ 申請・審査対応": "border-l-violet-500",
  "⚙️ 許可後の運用準備": "border-l-rose-500",
  "🤝 受入企業サポート体制": "border-l-amber-500",
};

// ===== チェックリスト（5カテゴリ・全21タスク + 詳細データ） =====
export const initialChecklist: ChecklistItem[] = [
  // ==================== 🏢 組織・体制整備（5タスク） ====================
  {
    id: "c1",
    text: "監理支援機関の許可要件の確認・自己診断",
    checked: false,
    category: "🏢 組織・体制整備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/yoken-check",
    deadline: { date: null, label: "今すぐ", urgency: "critical" },
    detail: {
      overview: "監理支援機関として許可を受けるには、育成就労法第25条・第26条に定める許可基準・欠格事由を全て満たす必要がある。申請前に自己診断を行い、不足点を洗い出す。",
      steps: [
        "育成就労法第25条（許可基準）・第26条（欠格事由）を通読する",
        "運用要領第5章第2節・第3節のチェックリストと照合する",
        "財産的基礎（直近2期の財務諸表で確認）を確認する",
        "法人形態（非営利法人であること）を確認する",
        "役員に欠格事由該当者がいないか確認する",
      ],
      documents: [
        { name: "育成就労制度 運用要領（令和8年2月版）", url: "https://www.moj.go.jp/isa/content/001457363.pdf" },
      ],
      source: "育成就労法第25条・第26条、運用要領 第5章第2節・第3節",
    },
  },
  {
    id: "c2",
    text: "定款の事業目的に「監理支援事業」「育成就労職業紹介事業」を追加",
    checked: false,
    category: "🏢 組織・体制整備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/teikan-henko",
    deadline: { date: new Date("2026-05-31"), label: "2026年5月末", urgency: "critical" },
    detail: {
      overview: "監理支援機関として許可を受けるには、法人の定款の事業目的に「監理支援事業」と「育成就労外国人に係る職業紹介事業」の記載が必要。記載がない場合は社員総会・理事会決議による定款変更と法務局への登記が必要。",
      steps: [
        "現行定款の事業目的の記載内容を確認する",
        "「監理支援事業」「育成就労外国人に係る職業紹介事業」の記載があるか確認",
        "記載がない場合、定款変更議案を作成する",
        "総会（理事会）で決議する",
        "法務局に定款変更・登記変更申請をする",
        "新定款と変更後の履歴事項全部証明書を取得する",
      ],
      documents: [
        { name: "現行定款" },
        { name: "履歴事項全部証明書（変更後）" },
      ],
      source: "育成就労法施行規則第43条第1項第10号",
    },
  },
  {
    id: "c3",
    text: "監理支援責任者・監理支援員の選任・講習受講",
    checked: false,
    category: "🏢 組織・体制整備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/sekininsha",
    deadline: { date: new Date("2026-06-30"), label: "2026年6月末", urgency: "critical" },
    detail: {
      overview: "監理支援事業を行うには、監理支援責任者（統括責任者）と監理支援員（個別担当者）を選任し、所定の養成講習を受講させる必要がある。当分の間は技能実習制度の監理責任者講習修了で代替可能（経過措置）。",
      steps: [
        "監理支援責任者の候補者を選定する（常勤役員または職員）",
        "監理支援員の候補者を選定する",
        "機構が実施する養成講習のスケジュールを確認・申込する",
        "または経過措置（技能実習法の講習修了証）の適用可否を確認する",
        "第2-4号様式「就任承諾書・誓約書・履歴書」を作成する",
        "受講証明書を申請書類に添付する",
      ],
      documents: [
        { name: "第2-4号様式（Word）", url: "https://www.moj.go.jp/isa/content/001457346.docx" },
      ],
      source: "育成就労法第40条、令和7年政令第341号第14条経過措置",
    },
  },
  {
    id: "c4",
    text: "外部役員または外部監査人の確保",
    checked: false,
    category: "🏢 組織・体制整備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/gaibu-kansa",
    deadline: { date: new Date("2026-06-30"), label: "2026年6月末", urgency: "warning" },
    detail: {
      overview: "監理支援機関の許可基準として、外部の者（外部役員または外部監査人）による監査体制の整備が必要。役員に利害関係のない第三者（弁護士・社会保険労務士等）が担う。",
      steps: [
        "外部監査の形態（外部役員型または外部監査人型）を選択する",
        "候補者（弁護士・社労士・行政書士等）に打診する",
        "外部監査人の場合、監査業務委託契約書を締結する",
        "第2-5号様式「就任承諾書・誓約書・概要書」を作成・署名する",
        "資格証明書（写し）を取得する",
      ],
      documents: [
        { name: "第2-5号様式（Word）", url: "https://www.moj.go.jp/isa/content/001457347.docx" },
        { name: "監査業務委託契約書" },
      ],
      source: "育成就労法第25条第1項第5号、運用要領 第5章第2節第5",
    },
  },
  {
    id: "c5",
    text: "個人情報保護・コンプライアンス体制の整備",
    checked: false,
    category: "🏢 組織・体制整備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/compliance",
    deadline: { date: new Date("2026-06-30"), label: "2026年6月末", urgency: "warning" },
    detail: {
      overview: "監理支援機関は育成就労外国人の個人情報を大量に取り扱うため、個人情報保護法に基づく体制整備が許可基準の一つ。業務規程・個人情報管理規程・情報セキュリティポリシーの整備が必要。",
      steps: [
        "個人情報保護法の要件を確認する",
        "業務規程（監理支援業務の手順を定めたもの）を新規作成または改定する",
        "個人情報管理規程を作成する",
        "情報セキュリティポリシーを整備する",
        "役職員への研修・周知を行う",
      ],
      documents: [
        { name: "業務規程（内部文書）" },
        { name: "個人情報管理規程（内部文書）" },
      ],
      source: "育成就労法第25条第1項第4号、運用要領 第5章第2節第4",
    },
  },

  // ==================== 📋 申請書類の準備（5タスク） ====================
  {
    id: "c6",
    text: "監理支援機関許可申請書（様式）の入手・記入",
    checked: false,
    category: "📋 申請書類の準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/shinsei-shorui",
    deadline: { date: new Date("2026-07-31"), label: "申請開始4/15〜 締切7月末目安", urgency: "critical" },
    detail: {
      overview: "許可申請書（省令様式）に必要事項を記入する。法人名・所在地・代表者・役員構成・業務内容・体制等を正確に記載。登記事項証明書と完全に一致させる必要がある。",
      steps: [
        "ISAホームページから第2-1号様式（申請者の概要書）をダウンロードする",
        "登記事項証明書（3か月以内）を参照しながら法人情報を入力する",
        "役員全員の情報（氏名・生年月日・役職）を記載する",
        "監理支援体制・業務実施体制を具体的に記述する",
        "代表者が署名・押印する",
      ],
      documents: [
        { name: "第2-1号様式（Word）", url: "https://www.moj.go.jp/isa/content/001457368.docx" },
        { name: "履歴事項全部証明書（3か月以内）" },
      ],
      source: "運用要領 第5章第1節第2",
    },
  },
  {
    id: "c7",
    text: "事業計画書の作成（監理支援事業）",
    checked: false,
    category: "📋 申請書類の準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/jigyou-keikaku",
    deadline: { date: new Date("2026-07-31"), label: "2026年7月末", urgency: "critical" },
    detail: {
      overview: "監理支援事業をどのように行うかの事業計画書を作成する。受入企業数・受入外国人数の見込み、業務実施体制、財務計画等を記載する。",
      steps: [
        "受入企業（組合員等）の見込数・受入外国人数の見通しをまとめる",
        "監理支援業務の実施体制（担当者・訪問頻度等）を記述する",
        "費用・収支計画（監理支援費の設定根拠）を作成する",
        "業務規程と整合していることを確認する",
        "代表者が確認・承認する",
      ],
      documents: [
        { name: "事業計画書（任意様式）" },
        { name: "第2-9号様式 会員・組合員等一覧表（Excel）", url: "https://www.moj.go.jp/isa/content/001457351.xlsx" },
      ],
      source: "運用要領 第5章第1節第2、第5章第5節",
    },
  },
  {
    id: "c8",
    text: "送出国機関との取次契約書の締結",
    checked: false,
    category: "📋 申請書類の準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/soudashi",
    deadline: { date: new Date("2026-07-31"), label: "2026年7月末", urgency: "critical" },
    detail: {
      overview: "海外の送出機関（取次送出機関）との間で取次契約を締結する。二国間取決めに基づき認定された送出機関のみが対象。フィリピンの場合はMWO（旧POEA）の手続きが別途必要。",
      steps: [
        "受入れを予定する国・送出機関を選定する",
        "当該送出機関が機構ホームページに掲載された認定送出機関であることを確認する",
        "取次契約書を締結する（育成就労法の要件を満たした内容であること）",
        "契約書の写しを申請書類に添付する",
      ],
      documents: [
        { name: "取次契約書（写し）" },
        { name: "取次送出機関の認定証（写し）" },
      ],
      source: "育成就労法第9条第1項第12号、運用要領 第4章第2節第13",
    },
  },
  {
    id: "c9",
    text: "財務諸表・納税証明書等の収集",
    checked: false,
    category: "📋 申請書類の準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/zaimu",
    deadline: { date: new Date("2026-07-31"), label: "2026年7月末", urgency: "critical" },
    detail: {
      overview: "財産的基礎（純資産額）の確認のため、直近2期分の財務諸表が必要。債務超過の場合は許可基準不適合となる可能性があるため、事前確認が重要。",
      steps: [
        "直近2事業年度の貸借対照表・損益計算書・附属明細書を準備する",
        "税理士・公認会計士による確認印が入ったもの、または税務申告済みの写しを用意する",
        "未払法人税等の納税証明書を取得する（税務署発行）",
        "直前の決算で純資産が確保されていることを確認する",
      ],
      documents: [
        { name: "貸借対照表・損益計算書（直近2期分）" },
        { name: "納税証明書（税務署発行）" },
        { name: "法人税確定申告書（写し）" },
      ],
      source: "育成就労法第25条第1項第3号、運用要領 第5章第2節第3",
    },
  },
  {
    id: "c10",
    text: "役員の住民票・履歴書・誓約書等の準備",
    checked: false,
    category: "📋 申請書類の準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/yakuin",
    deadline: { date: new Date("2026-07-31"), label: "2026年7月末", urgency: "critical" },
    detail: {
      overview: "役員全員について欠格事由非該当を確認し、住民票・履歴書・誓約書を取得する。役員数が多い場合は時間がかかるため早めに着手する。",
      steps: [
        "役員全員のリストを作成する",
        "各役員から就任承諾書・誓約書（第2-2号様式）に署名・押印を取得する",
        "各役員の履歴書（第2-3号様式）を作成・署名する",
        "住民票の写しを取得する（本籍地記載のもの）",
        "「登記されていないことの証明書」（法務局発行）を取得する",
        "身分証明書（市区町村発行）を取得する",
      ],
      documents: [
        { name: "第2-2号様式 誓約書（Word）", url: "https://www.moj.go.jp/isa/content/001457344.docx" },
        { name: "第2-3号様式 履歴書（Word）", url: "https://www.moj.go.jp/isa/content/001457345.docx" },
        { name: "住民票" },
        { name: "登記されていないことの証明書" },
        { name: "身分証明書" },
      ],
      source: "育成就労法第26条、運用要領 第5章第3節",
    },
  },

  // ==================== ✅ 申請・審査対応（4タスク） ====================
  {
    id: "c11",
    text: "外国人育成就労機構への許可申請書類提出",
    checked: false,
    category: "✅ 申請・審査対応",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/shinsei",
    deadline: { date: new Date("2026-07-31"), label: "2026年7月末★", urgency: "critical" },
    detail: {
      overview: "【最新情報】2026年4月15日より施行日前申請の受付が開始されます。（出入国在留管理庁・OTIT公式発表 2026年2月確認）\n\n準備した申請書類一式を外国人育成就労機構（本部）審査課に提出する。2027年4月の事業開始を目指す場合は遅くとも2027年1月中の提出が必要（事業開始の3か月前推奨）。",
      steps: [
        "「別紙2 監理支援機関許可申請提出書類一覧」で全書類を最終チェックする",
        "書類一式を製本し、インデックスを付ける",
        "書留・レターパックプラス等（対面配達で受領確認できる方法）で郵送する または機構本部事務所に持参する",
        "受付確認の連絡を受け取る",
      ],
      documents: [
        { name: "別紙2 提出書類一覧（PDF）", url: "https://www.moj.go.jp/isa/content/001457264.pdf" },
      ],
      source: "運用要領 第5章第1節第1「事業開始の3か月前までに申請推奨」",
    },
  },
  {
    id: "c12",
    text: "機構による実地調査への対応準備",
    checked: false,
    category: "✅ 申請・審査対応",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/jizen-chosa",
    deadline: { date: null, label: "申請後随時", urgency: "normal" },
    detail: {
      overview: "申請書類受付後、機構による事前調査（書類確認・追加資料要求・訪問調査）が行われる。迅速な対応が審査期間の短縮につながる。対応が遅れると審査が大幅に延長する。",
      steps: [
        "機構からの連絡窓口（担当者・電話・メール）を社内で明確に設定する",
        "申請書類の控えを整理し、追加説明できるよう手元に置く",
        "訪問調査の依頼が来た場合、関係者が揃う日程を迅速に調整する",
        "追加資料の要求には1週間以内を目標に対応する",
      ],
      documents: [
        { name: "申請書類の控え一式" },
      ],
      source: "育成就労法第23条第5項、運用要領 第5章第1節第4",
    },
  },
  {
    id: "c13",
    text: "補正指示への対応・追加書類の提出",
    checked: false,
    category: "✅ 申請・審査対応",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/hossei",
    deadline: { date: null, label: "申請後随時", urgency: "normal" },
    detail: {
      overview: "審査の過程で書類の補正・追加提出が求められることがある。指示内容を正確に理解し、迅速に対応することが重要。補正に応じない場合は申請が却下される可能性がある。",
      steps: [
        "機構・法務省・厚生労働省からの補正指示書を受け取る",
        "指示内容を精読し、不明点は担当官に確認する",
        "必要な書類・説明資料を作成する",
        "指定期限内に補正書類を提出する",
        "補正内容を記録しておく（次回申請の参考のため）",
      ],
      documents: [
        { name: "補正書類（指示内容による）" },
      ],
      source: "育成就労法第24条",
    },
  },
  {
    id: "c14",
    text: "許可証の受領・許可条件の確認",
    checked: false,
    category: "✅ 申請・審査対応",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/kyokasho",
    deadline: { date: null, label: "申請後随時", urgency: "normal" },
    detail: {
      overview: "主務大臣名による許可証が機構を介して交付される。許可証には許可の有効期間・条件が記載されている。条件違反は許可取消しの対象となるため、条件を正確に把握・遵守することが必要。",
      steps: [
        "機構から許可証（正本）を受け取る",
        "許可条件・有効期間を確認する",
        "全事業所の見やすい場所に許可証を掲示する（法第29条）",
        "許可証の写しを保管する",
        "許可番号を社内文書・ホームページ等に記載する",
        "許可番号・条件を全スタッフに周知する",
      ],
      documents: [
        { name: "許可証（正本）" },
        { name: "許可証の写し（保管用）" },
      ],
      source: "育成就労法第29条・第30条",
    },
  },

  // ==================== ⚙️ 許可後の運用準備（4タスク） ====================
  {
    id: "c15",
    text: "育成就労計画の作成指導体制の構築",
    checked: false,
    category: "⚙️ 許可後の運用準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/keikaku-shido",
    deadline: { date: new Date("2026-11-30"), label: "許可取得後（推定2026年11月）", urgency: "normal" },
    detail: {
      overview: "許可取得後、監理支援機関は受入企業（育成就労実施者）が育成就労計画を作成するにあたり指導する義務がある（法第8条第5項）。指導マニュアル・テンプレートを整備する。",
      steps: [
        "育成就労計画の様式（省令様式第1〜3号）をダウンロードし、記載要領を熟読する",
        "受入企業が迷いやすい記載箇所をまとめたFAQ・マニュアルを作成する",
        "育成就労計画のひな形（業種別テンプレート）を作成する",
        "指導担当者（育成就労計画作成指導者）を指定する",
        "指導記録の管理方法を決める",
      ],
      documents: [
        { name: "育成就労計画様式（省令様式第1〜3号）" },
        { name: "作成指導マニュアル（内部文書）" },
      ],
      source: "育成就労法第8条第5項、運用要領 第4章第1節第4",
    },
  },
  {
    id: "c16",
    text: "受入企業への訪問指導・監査計画の策定",
    checked: false,
    category: "⚙️ 許可後の運用準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/kansa-keikaku",
    deadline: { date: new Date("2026-11-30"), label: "許可取得後（推定2026年11月）", urgency: "normal" },
    detail: {
      overview: "監理支援機関は受入企業に対し3か月に1回以上の定期監査を実施する義務がある（法第39条）。監査実施後2か月以内に監査報告書を機構に提出。年間監査スケジュールを事前に策定する。",
      steps: [
        "受入企業（予定）のリストと所在地を確認する",
        "各企業について3か月以内の間隔で監査スケジュールを策定する",
        "監査チェックリスト・監査報告書テンプレート（省令様式第23号）を整備する",
        "監査担当者をアサインする",
        "訪問指導（月1回以上）のスケジュールも別途作成する",
      ],
      documents: [
        { name: "監査報告書（省令様式第23号）" },
        { name: "年間監査計画表（内部文書）" },
      ],
      source: "育成就労法第39条、運用要領 第5章第16節第2（1）",
    },
  },
  {
    id: "c17",
    text: "育成就労外国人向け相談・支援体制の整備",
    checked: false,
    category: "⚙️ 許可後の運用準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/soudan",
    deadline: { date: new Date("2026-11-30"), label: "許可取得後（推定2026年11月）", urgency: "normal" },
    detail: {
      overview: "監理支援機関は育成就労外国人が日本語等で相談できる体制（相談応需体制）の整備が義務づけられている（法第25条・第39条）。多言語対応の相談窓口・生活支援体制を構築する。",
      steps: [
        "相談受付の方法（電話・メール・SNS等）を決定する",
        "対応言語・通訳体制を整備する（受入れ国籍に応じて）",
        "相談対応マニュアルを作成する",
        "相談記録の管理方法を決める",
        "緊急時（深夜・休日）の対応体制を確立する",
      ],
      documents: [
        { name: "相談対応マニュアル（内部文書）" },
        { name: "多言語版相談案内" },
      ],
      source: "育成就労法第25条第1項第2号、運用要領 第5章第2節第2（3）・第5章第16節第3（13）",
    },
  },
  {
    id: "c18",
    text: "帳簿・報告書の管理システムの準備",
    checked: false,
    category: "⚙️ 許可後の運用準備",
    taskType: "管理団体",
    ctaPath: "/kanri-shien/chobo",
    deadline: { date: new Date("2026-11-30"), label: "許可取得後（推定2026年11月）", urgency: "normal" },
    detail: {
      overview: "監理支援機関は法定帳簿（法第41条）の整備と年次事業報告書（法第42条）の提出が義務。育成就労外国人ごとに帳簿を作成・保管する必要がある。",
      steps: [
        "法定帳簿の様式（運用要領 第5章第18節参照）を確認する",
        "帳簿管理システム（Excel・専用ソフト等）を選定・導入する",
        "育成就労外国人ごとの帳簿テンプレートを作成する",
        "事業報告書（省令様式第24号）の作成担当者を決める",
        "毎年4〜5月末の提出を年次カレンダーに登録する",
      ],
      documents: [
        { name: "法定帳簿（省令様式に基づく）" },
        { name: "事業報告書（省令様式第24号）" },
      ],
      source: "育成就労法第41条・第42条、運用要領 第5章第18節・第19節",
    },
  },

  // ==================== 🤝 受入企業サポート体制（3タスク） ====================
  {
    id: "c19",
    text: "受入企業向け制度説明資料の作成",
    checked: false,
    category: "🤝 受入企業サポート体制",
    taskType: "受入企業支援",
    ctaPath: "/ukeire/seido-setumei",
    deadline: { date: null, label: "今すぐ開始推奨", urgency: "warning" },
    detail: {
      overview: "技能実習から育成就労への移行にあたり、受入企業（組合員等）に制度変更点を正確に伝える説明資料を作成する。転籍要件の変化・日本語能力要件・費用負担の変化等の説明が特に重要。",
      steps: [
        "技能実習と育成就労の主な相違点をまとめる（転籍・日本語要件・費用負担等）",
        "受入企業側の新たな義務（育成就労責任者・指導員・生活相談員の選任等）を整理する",
        "Q&A形式の説明資料を作成する",
        "説明会（対面またはオンライン）の資料を準備する",
        "資料は定期的に更新する（分野別運用方針の公表に合わせて）",
      ],
      documents: [
        { name: "制度説明資料（内部作成）" },
        { name: "第1-11号様式（育成就労責任者等 就任承諾書）", url: "https://www.moj.go.jp/isa/content/001457319.docx" },
      ],
      source: "運用要領 第1章、第4章",
    },
  },
  {
    id: "c20",
    text: "育成就労計画 認定申請の支援フローの確立",
    checked: false,
    category: "🤝 受入企業サポート体制",
    taskType: "受入企業支援",
    ctaPath: "/ukeire/keikaku-shinsei",
    deadline: { date: new Date("2026-09-30"), label: "2026年9月末", urgency: "critical" },
    detail: {
      overview: "受入企業が育成就労計画の認定申請をするにあたり、監理支援機関として指導・書類確認・申請同行を行う。2027年4月開始には施行日前申請（2026年9〜11月推定）の活用が必須。開始予定日の4か月前が実質的な締切。",
      steps: [
        "施行日前申請のスケジュール（推定2026年9〜11月）を受入企業と共有する",
        "育成就労計画認定申請チェックリストを作成する",
        "受入企業ごとの計画作成指導スケジュールを立てる",
        "計画書の作成指導（様式・記載要領の説明）を行う",
        "機構地方事務所への申請に同行する",
        "認定通知書を受け取り、次の在留資格認定証明書申請につなげる",
      ],
      documents: [
        { name: "育成就労計画認定申請書（省令様式第1〜3号）" },
        { name: "添付書類一式" },
      ],
      source: "育成就労法附則第5条、運用要領「開始予定日の4か月前を過ぎると超過の可能性あり」",
    },
  },
  {
    id: "c21",
    text: "在留資格認定証明書（COE）交付申請の準備",
    checked: false,
    category: "🤝 受入企業サポート体制",
    taskType: "受入企業支援",
    ctaPath: "/ukeire/coe",
    deadline: { date: new Date("2027-04-01"), label: "2027年4月1日以降", urgency: "normal" },
    detail: {
      overview: "育成就労計画認定後、受入外国人の入国には地方出入国在留管理局からのCOE（在留資格認定証明書）が必要。育成就労のCOEは事前申請不可（施行後2027年4月1日以降）。申請書類・手続きの事前確認が重要。",
      steps: [
        "COE交付申請の手続き・様式（出入国在留管理庁ホームページに公表予定）を確認する",
        "育成就労計画認定通知書を申請書類として準備する",
        "地方出入国在留管理局への申請方法（持参・郵送・オンライン）を確認する",
        "2027年4月1日以降に申請可能となることをスケジュールに反映する",
        "COE受取後の外国人への送付方法・ビザ申請手順を確認する",
      ],
      documents: [
        { name: "COE交付申請書（出入国在留管理庁所定様式）" },
        { name: "育成就労計画認定通知書（写し）" },
      ],
      source: "出入国管理及び難民認定法、育成就労法附則（事前申請不可規定）",
    },
  },
];

// ===== Practical Timeline（実務タイムライン） =====
export const practicalTimeline: PracticalTimelineItem[] = [
  {
    id: "pt1",
    period: "〜2026年6月頃",
    targetDate: new Date("2026-06-30"),
    actor: "受入企業",
    phase: "技能実習 最終対応",
    phaseColor: "slate",
    title: "最終技能実習生の面接・計画認定申請",
    detail: "1年職種など育成就労制度で対象外となる職種については、この時期の技能実習計画認定申請が最後となる可能性が高い。引き続き受け入れる場合は育成就労への切替が必要。",
    urgency: "normal",
  },
  {
    id: "pt2",
    period: "〜2026年8月頃",
    targetDate: new Date("2026-08-31"),
    actor: "受入企業",
    phase: "技能実習 最終受付",
    phaseColor: "slate",
    title: "技能実習 COE申請（最終入国ロット）",
    detail: "政令第341号14条の経過措置により技能実習制度COE交付申請は継続可能。ただし施行後は技能実習制度が段階的に廃止されるため、2026年中の入国が実質的な最終ロットになる可能性が高い。",
    urgency: "normal",
  },
  {
    id: "pt3",
    period: "2026年7月まで",
    targetDate: new Date("2026-07-31"),
    actor: "管理団体",
    phase: "管理団体 許可申請",
    phaseColor: "blue",
    title: "監理支援機関 許可申請書提出（★デッドライン）",
    detail: "2027年4月1日の施行当日から受入れを開始したい場合、審査期間（3〜5ヶ月）を考慮すると2026年7月末までの申請が必要。申請が遅れるほど許可取得が遅れ、育成就労計画認定申請も遅れる。",
    urgency: "critical",
  },
  {
    id: "pt4",
    period: "2026年9〜11月（推定）",
    targetDateFrom: new Date("2026-09-01"),
    targetDateTo: new Date("2026-11-30"),
    actor: "管理団体",
    phase: "管理団体 許可取得",
    phaseColor: "blue",
    title: "監理支援機関 許可取得（想定）",
    detail: "許可取得後、初めて育成就労計画の作成指導と認定申請が可能になる。許可なしに育成就労計画認定申請はできない。",
    urgency: "upcoming",
  },
  {
    id: "pt5",
    period: "2026年7〜8月まで",
    targetDate: new Date("2026-08-31"),
    actor: "受入企業",
    phase: "受入企業 準備",
    phaseColor: "emerald",
    title: "送出国機関との面接・候補者選定",
    detail: "2027年4月入国を目指す場合、現地面接・候補者選定は2026年7〜8月には完了している必要がある。フィリピンはこの時点でMWO（旧POEA）の手続きを完了している必要があるが、遅れる可能性が高く、他国の選択肢も検討を。",
    urgency: "warning",
  },
  {
    id: "pt6",
    period: "2026年9〜10月",
    targetDateFrom: new Date("2026-09-01"),
    targetDateTo: new Date("2026-10-31"),
    actor: "受入企業",
    phase: "受入企業 準備",
    phaseColor: "emerald",
    title: "育成就労計画 認定申請（施行日前申請）★",
    detail: "育成就労法附則第5条に基づく施行日前申請。2027年4月1日の開始予定日に対し、開始予定日の6ヶ月前（2026年10月）から申請可能。4ヶ月前（2026年12月）が実質的なデッドライン。この時点で監理支援機関の許可が必要。",
    urgency: "critical",
  },
  {
    id: "pt7",
    period: "2026年10〜12月",
    targetDateFrom: new Date("2026-10-01"),
    targetDateTo: new Date("2026-12-31"),
    actor: "受入企業",
    phase: "受入企業 準備",
    phaseColor: "emerald",
    title: "育成就労計画 認定取得・COE申請準備",
    detail: "育成就労計画の認定通知書が交付された後、在留資格認定証明書（COE）の交付申請を行う。育成就労のCOEは施行後（2027年4月1日以降）からの申請となるため、認定通知書受取後は4月1日を待って即申請できる準備を整えておく。",
    urgency: "upcoming",
  },
  {
    id: "pt8",
    period: "2027年4月1日以降",
    targetDate: new Date("2027-04-01"),
    actor: "受入企業",
    phase: "施行・COE申請",
    phaseColor: "amber",
    title: "育成就労 COE交付申請（施行当日から受付開始）",
    detail: "育成就労法附則により、育成就労のCOEについては事前申請の受付規定がないため、2027年4月1日からの申請開始。COE取得後、海外でのビザ申請・入国審査を経て来日。COE申請〜来日まで通常2〜3ヶ月。",
    urgency: "target",
  },
  {
    id: "pt9",
    period: "2027年6〜7月（見込み）",
    targetDateFrom: new Date("2027-06-01"),
    targetDateTo: new Date("2027-07-31"),
    actor: "受入企業",
    phase: "育成就労 受入開始",
    phaseColor: "amber",
    title: "育成就労外国人 来日・就労開始（第1号）",
    detail: "最速でも4月1日のCOE申請から2〜3ヶ月後となるため、実際の来日・就労開始は2027年6〜7月頃の見込み。発注から来日まで約9〜12ヶ月を要する計算となる。",
    urgency: "target",
  },
];
