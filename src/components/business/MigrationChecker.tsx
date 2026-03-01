'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, RotateCcw, Check, AlertTriangle, ChevronDown } from 'lucide-react';

/* ============================================================
   Data definitions
   ============================================================ */

const INDUSTRIES = [
  { id: 'manufacturing', label: '製造業', icon: '🏭' },
  { id: 'construction', label: '建設', icon: '🏗️' },
  { id: 'agriculture', label: '農業', icon: '🌾' },
  { id: 'care', label: '介護', icon: '🏥' },
  { id: 'food', label: '飲食料品製造', icon: '🍱' },
  { id: 'cleaning', label: 'ビルクリーニング', icon: '🧹' },
  { id: 'hospitality', label: '宿泊', icon: '🏨' },
  { id: 'other', label: 'その他', icon: '📋' },
];

type VisaPath = 'ikusei' | 'tokutei1' | 'other';

const VISA_STATUS: { id: string; label: string; sub: string; path: VisaPath }[] = [
  { id: 'ikusei_early', label: '育成就労（1〜2年目）', sub: '旧：技能実習1号・2号相当', path: 'ikusei' },
  { id: 'ikusei_late', label: '育成就労（3年目・修了間近）', sub: '特定技能への移行準備段階', path: 'ikusei' },
  { id: 'tokutei1', label: '特定技能1号', sub: '移行済み・2号を目指したい', path: 'tokutei1' },
  { id: 'gijinkoku', label: '技術・人文知識・国際業務', sub: 'いわゆる「技人国」ビザ。事務・IT・通訳など', path: 'other' },
  { id: 'ryugaku', label: '留学生（卒業後の就職を検討）', sub: '卒業後に就労ビザへの変更を検討中', path: 'other' },
  { id: 'specified_activities', label: '特定活動', sub: 'インターンシップ・EPA等', path: 'other' },
  { id: 'unknown', label: 'わからない・確認中', sub: '在留カードを確認してから相談したい', path: 'other' },
];

const YEARS = [
  { id: 'lt1', label: '1年未満', sub: '入国直後〜慣れてきた頃' },
  { id: 'y1_2', label: '1〜2年', sub: 'スキルを積んでいる段階' },
  { id: 'y2_3', label: '2〜3年', sub: '移行準備を始めるタイミング' },
  { id: 'gt3', label: '3年以上', sub: '特定技能移行済みまたは移行可能' },
];

const JAPANESE_LEVELS = [
  { id: 'n5', label: 'N5以下', sub: '日常的な挨拶・簡単な指示のみ' },
  { id: 'n4', label: 'N4相当', sub: '基本的な会話ができる' },
  { id: 'n3', label: 'N3相当', sub: '業務上のやりとりがほぼできる' },
  { id: 'n2', label: 'N2以上', sub: '複雑な内容も理解できる' },
  { id: 'unknown', label: 'わからない', sub: '正確なレベルを把握していない' },
];

const STEP5_IKUSEI = [
  { id: 'not_started', label: '何も始めていない', sub: '試験のことをまだ考えていない・情報収集中' },
  { id: 'japanese_only', label: '日本語試験のみ準備中または合格済み', sub: 'JFT-BasicまたはJLPT N4の学習中・申込済み・合格済み' },
  { id: 'exam_only', label: '技能試験のみ準備中または合格済み', sub: '業種別の技能測定試験の学習中・申込済み・合格済み' },
  { id: 'both_passed', label: '技能試験・日本語試験 両方合格済み', sub: '特定技能1号への在留資格変更申請が可能な状態' },
];

const STEP5_TOKUTEI1 = [
  { id: 'no_plan', label: 'まだ何も始めていない', sub: '2号のことはあまり考えていない・情報収集中' },
  { id: 'leader_assigned', label: 'リーダー・管理業務を担当させている', sub: '辞令や職務命令書はまだ発行していない' },
  { id: 'leader_with_doc', label: 'リーダー業務＋辞令・職務命令書を発行済み', sub: '経験年数のカウントが始まっている状態' },
  { id: 'exam_preparing', label: 'リーダー経験要件を満たし、2号試験の準備中', sub: '受験資格あり・学習中または受験申込済み' },
];

type Step5Pattern = 'ikusei' | 'tokutei1' | 'skip';

function getStep5Pattern(visaStatus: string): Step5Pattern {
  if (visaStatus === 'ikusei_early' || visaStatus === 'ikusei_late') return 'ikusei';
  if (visaStatus === 'tokutei1') return 'tokutei1';
  return 'skip';
}

type StepQuestion = {
  title: string;
  sub: string;
  options: { id: string; label: string; sub?: string; icon?: string }[];
  layout: 'grid' | 'list';
};

const STEPS: StepQuestion[] = [
  { title: 'スタッフの業種を教えてください', sub: '特定技能の対象分野によって試験内容が異なります', options: INDUSTRIES, layout: 'grid' },
  { title: '現在の在留資格は？', sub: '現在のビザの種類を選んでください', options: VISA_STATUS, layout: 'list' },
  { title: '入国からの経過年数は？', sub: '日本に来てからどれくらい経ちますか', options: YEARS, layout: 'list' },
  { title: '日本語レベルは？', sub: 'JLPT（日本語能力試験）やJFT-Basicの結果がある場合はそれを基準に', options: JAPANESE_LEVELS, layout: 'list' },
];

function getStep5Question(pattern: Step5Pattern): StepQuestion {
  if (pattern === 'tokutei1') {
    return { title: '特定技能2号に向けた準備は進んでいますか？', sub: '2号取得にはリーダー・管理業務の経験と2号専用試験への合格が必要です', options: STEP5_TOKUTEI1, layout: 'list' };
  }
  return { title: '特定技能1号の試験準備は進んでいますか？', sub: '技能測定試験（業種別）と日本語試験（JFT-BasicまたはJLPT N4）の状況を教えてください', options: STEP5_IKUSEI, layout: 'list' };
}

/* ============================================================
   Industry exam info
   ============================================================ */

type ExamInfo = {
  examName: string;
  difficulty: '易' | '普通' | '難';
  passRateNote: string;
  frequency: string;
  japaneseNote: string;
};

const INDUSTRY_EXAM_INFO: Record<string, ExamInfo> = {
  manufacturing: { examName: '製造分野特定技能1号技能測定試験', difficulty: '普通', passRateNote: '合格率は概ね50〜70%程度。しっかり準備すれば合格可能', frequency: '年複数回実施', japaneseNote: 'N4が要件だが、実務では指示書を読めるN3レベルがあると安心' },
  construction: { examName: '建設分野特定技能評価試験', difficulty: '難', passRateNote: '合格率は30〜50%程度。受験準備期間を多めに確保することを推奨', frequency: '年数回実施（受験機会が少ない）', japaneseNote: 'N3以上を強く推奨。安全指示を正確に理解できる必要がある' },
  agriculture: { examName: '農業技能測定試験', difficulty: '易', passRateNote: '合格率は比較的高め（70%前後）', frequency: '年複数回実施', japaneseNote: 'N4で実務上も問題ないケースが多い' },
  care: { examName: '介護技能評価試験', difficulty: '難', passRateNote: '合格率40〜60%程度。介護の専門用語・コミュニケーション能力が求められる', frequency: '年複数回実施', japaneseNote: 'N4が要件だが、介護現場では事実上N3以上が求められる。日本語学習支援が定着率に直結する' },
  food: { examName: '飲食料品製造業特定技能1号技能測定試験', difficulty: '普通', passRateNote: '合格率は概ね60%前後', frequency: '年複数回実施', japaneseNote: 'N4で対応可能なケースが多い' },
  cleaning: { examName: 'ビルクリーニング分野特定技能評価試験', difficulty: '普通', passRateNote: '合格率は50〜60%程度', frequency: '年数回実施', japaneseNote: 'N4で対応可能' },
  hospitality: { examName: '宿泊業技能測定試験', difficulty: '普通', passRateNote: '合格率は50〜65%程度', frequency: '年複数回実施', japaneseNote: 'N4が要件。接客業のためコミュニケーション能力も重視される' },
  other: { examName: '各分野の技能測定試験', difficulty: '普通', passRateNote: '業種によって異なる', frequency: '業種によって異なる', japaneseNote: 'N4以上が基本要件' },
};

/* ============================================================
   Strategy by industry (tokutei1 → 2号 path)
   ============================================================ */

type IndustryStrategy = {
  summary: string;
  keyChallenge: string;
  winningStrategy: string[];
  timeline: { year1: string; year2: string; year3: string; year4to5: string };
  successPattern: string;
};

const STRATEGY_BY_INDUSTRY: Record<string, IndustryStrategy> = {
  manufacturing: {
    summary: '「ビジキャリ3級」と日本語力が合否を分ける。現場経験は十分なので試験勉強の環境整備が勝負',
    keyChallenge: 'ビジネスキャリア検定3級（生産管理）という追加資格の取得が必要で、試験はすべて日本語。現場経験があっても試験に落ちるケースが多い。',
    winningStrategy: ['1号取得直後に工程リーダーとして辞令を発行し、3年間のカウントを開始する', 'ビジネスキャリア検定3級のテキストを早期に入手し、業務に関連づけながら学習させる', '月1回程度、日本語の業務文書（指示書・報告書）を作成する機会を設け、読み書き力を鍛える', '試験は年に複数回あるため、「初回は練習」と割り切って早めに受験させる'],
    timeline: { year1: '工程リーダー辞令発行・日本語N3学習開始・ビジキャリ3級テキスト入手', year2: 'N3合格・ビジキャリ3級受験・2号試験の過去問を入手して傾向把握', year3: 'リーダー経験3年達成・2号試験申込・初回受験', year4to5: '合格まで複数回受験・合格後すみやかに在留資格変更申請' },
    successPattern: '合格者の多くは「会社が日本語学習・試験対策を積極的にサポートしている」ケース。個人任せにしている企業は合格が遅くなる傾向がある。',
  },
  construction: {
    summary: '最難関分野。合格率20〜30%。日本語力と安全管理知識の両方を早期から鍛える必要がある',
    keyChallenge: '建設分野の2号試験は最も難しい部類。安全管理・工程管理の専門知識を日本語で答える必要があり、試験対策なしでの合格は困難。',
    winningStrategy: ['「職長・班長」への昇格を1号取得後すぐに辞令で明確にする（JACへの届出も必要）', '建設業の安全教育（職長教育・安全衛生責任者教育）を会社負担で受講させる', '毎日の作業日報を日本語で記録する習慣をつけ、日本語の読み書き力を実務で鍛える', '受験はJAC（建設技能人材機構）経由での申込になるため、担当者に早めに相談する'],
    timeline: { year1: '班長・職長への任命辞令発行・職長教育受講・日本語N3学習開始', year2: 'N3合格・2号試験の参考テキスト（JACウェブサイトに掲載）で学習開始', year3: '職長経験1年達成・2号試験申込・初回受験（合格率低いため複数回前提で計画）', year4to5: '合格まで粘り強く受験継続。特例措置（8割得点で1年延長）も活用' },
    successPattern: '合格者の共通点は「日本語の文章を読む練習を継続していた」こと。専門スキルより日本語力が合否を分けるケースが多い。',
  },
  agriculture: {
    summary: '比較的合格しやすい分野だが、リーダー経験2年の「書類証明」が落とし穴になりやすい',
    keyChallenge: 'リーダー経験2年の証明に必要な書類（辞令・職務命令書）を整備していない農業事業者が多い。試験自体は比較的合格しやすいが、受験資格の書類準備で躓くケースが目立つ。',
    winningStrategy: ['早期に作業指示者として辞令を発行し、書類の日付から経験年数をカウント開始', '農業技能測定試験（1号合格時に使ったもの）と同様のテキストで2号の傾向を把握する', '安全衛生管理の知識（農薬管理・機械操作安全）を業務の中で習得させる', '日本語はN4で対応可能だが、テキストの漢字に慣れるための読書習慣をつける'],
    timeline: { year1: '作業指示者への任命辞令発行・2号テキスト入手', year2: 'リーダー経験2年達成・必要書類の整備確認・2号試験申込', year3: '2号試験受験・合格後の在留資格変更申請', year4to5: '特定技能2号として長期雇用継続' },
    successPattern: '農業分野は試験より「書類準備」が成否を分ける。辞令発行を後回しにした企業で詰まるケースが多い。',
  },
  care: {
    summary: '介護は特定技能2号より「介護」ビザへの移行が本命ルート。介護福祉士国家試験が最終ゴール',
    keyChallenge: '介護福祉士国家試験の合格率は30〜50%程度。年1回（1月）しか実施されないため、不合格の場合1年待つことになる。実務者研修の修了も受験要件のため、早期から計画が必要。',
    winningStrategy: ['実務開始から2年目に実務者研修（通信＋スクーリング）を開始する（修了に6〜12ヶ月）', '介護福祉士の試験対策テキストを会社が購入し、勉強時間を業務内に確保する', '試験はN3以上の日本語力が事実上必要。日本語教育を早期から継続する', '介護業界には学習支援の助成金が充実している。ハローワークや都道府県の補助金を調べる'],
    timeline: { year1: '日本語N3学習開始・介護業務記録（ケア記録）を日本語で書く習慣をつける', year2: '実務者研修開始（できれば2年目の上半期から）', year3: '実務経験3年達成・実務者研修修了・介護福祉士国家試験受験', year4to5: '合格後「介護」ビザへの変更申請。不合格の場合は翌年再受験' },
    successPattern: '合格者の多くは「日本語学習と試験勉強を並行して継続していた」ケース。施設として勉強時間を保障している法人の合格率が高い。',
  },
  food: {
    summary: '管理・指導業務の「書類証明」と日本語力が合否を分ける。試験テキストを早期に入手して学習開始',
    keyChallenge: 'リーダー経験の証明に「管理業務（工程管理・品質管理）」と「指導業務（後輩への技術指導）」の両方が必要。どちらか片方だけでは要件を満たせない。',
    winningStrategy: ['1号取得直後に「工程管理担当兼後輩指導員」として辞令発行（両方の業務を明記）', 'OTAFFが公開している2号試験の学習用テキストを早期に入手・学習開始', 'N4取得済みなら次はN3を目標に。試験は日本語のみで出題されるため、日本語力が重要', '試験は年3回程度あるため、合格率50%程度の分野ではあるが複数回受験を前提に計画'],
    timeline: { year1: '辞令発行（管理＋指導業務の両方を明記）・テキスト入手・N3学習開始', year2: 'リーダー経験2年達成・2号試験申込・初回受験', year3: '合格後の在留資格変更申請', year4to5: '特定技能2号として長期雇用継続' },
    successPattern: '外食業と飲食料品製造は他分野より合格率が高い。テキストを活用した計画的な学習をサポートした企業の合格者が多い。',
  },
  cleaning: {
    summary: '日本語の文章問題が合否を分ける。現場スキルは十分なので、試験対策の日本語学習支援が鍵',
    keyChallenge: '合格率が低い主な原因は日本語の読解力不足。現場で長年働いていても、試験の日本語文章問題に対応できないケースが多い。',
    winningStrategy: ['複数スタッフの指導業務を担当させ、辞令で「現場指導員」として正式に任命する', '試験実施機関（ビルメン協会）が公開しているテキスト・過去問を入手する', '業務指示書・報告書を日本語で作成する業務を与え、日本語の文章に慣れさせる', '試験会場が限られることがあるため、受験申込時に会場・交通手段を早めに確認する'],
    timeline: { year1: '現場指導員として辞令発行・日本語N3学習開始', year2: 'N3合格・リーダー経験2年達成・2号試験テキストで学習', year3: '2号試験申込・受験', year4to5: '合格後の在留資格変更申請・長期雇用' },
    successPattern: '「業務日報を日本語で書かせる」という取り組みをしている事業所の合格率が高い。日常業務での日本語使用が最も効果的な試験対策になっている。',
  },
  hospitality: {
    summary: '接客業のため日本語力が最重要。N3必須。現場でのコミュニケーション能力向上が合格への近道',
    keyChallenge: '宿泊業の2号試験は合格率が低め。試験問題は接客・管理の専門知識を日本語で答える形式で、N4レベルでは解読が困難。またリーダー経験（2年以上）の内容が幅広い（接客・広報・レストランなど）。',
    winningStrategy: ['副支配人・シフトリーダーなどの役職辞令を早期に発行する', '日本人スタッフと同等の接客研修・クレーム対応訓練を受けさせる', 'N3合格を最優先目標にする（N3なしでの2号合格はほぼ困難）', '試験実施機関（宿泊業技能試験センター）の過去問・テキストを活用する'],
    timeline: { year1: 'シフトリーダー辞令発行・日本語N3学習最優先・接客研修参加', year2: 'N3合格・リーダー経験2年達成・2号試験テキスト学習', year3: '2号試験受験（合格率低いため複数回前提）', year4to5: '合格後の在留資格変更申請・長期雇用' },
    successPattern: '日本語学習を会社が積極的にサポートし、実際の接客場面でも日本語を積極的に使わせている宿泊施設で合格者が出ている。',
  },
  other: {
    summary: '業種によって戦略が大きく異なります。まず監理団体または行政書士に自社の業種での2号取得要件を確認してください',
    keyChallenge: '業種・分野によって必要なリーダー経験年数・追加資格・日本語要件が大きく異なります。一般論での準備は遠回りになる可能性があります。',
    winningStrategy: ['まず監理団体または行政書士に「自社の分野での特定技能2号要件」を確認する', '対象分野が特定技能2号の実施分野かどうかを確認する（まだ2号試験が実施されていない分野もある）', 'リーダー・管理業務の辞令だけは今すぐ発行しておく（どの分野でも共通して必要）', '日本語N3を目標に学習支援を始める（ほぼ全分野で高い日本語力が必要）'],
    timeline: { year1: 'リーダー辞令発行・分野別要件の専門家への確認・日本語N3学習開始', year2: '分野別の要件を満たすための計画実行', year3: '受験資格達成次第、試験申込', year4to5: '合格・在留資格変更申請' },
    successPattern: '早めに専門家（監理団体・行政書士）に相談して分野別の正確な要件を把握した企業が、無駄なく2号移行を達成している。',
  },
};

/* ============================================================
   Other visa result data
   ============================================================ */

type TodoDetail = {
  why: string;
  how: string[];
  watch_out?: string;
  timeframe?: string;
};

type TodoItem = {
  text: string;
  priority: 'urgent' | 'normal';
  detail: TodoDetail;
};

type OtherVisaOption = { title: string; desc: string; pros: string; cons: string };

type OtherVisaData = {
  headline: string;
  subheadline: string;
  explanation: string;
  options: OtherVisaOption[];
  companyTodos: TodoItem[];
  consultType: 'kanri' | 'gyosei' | 'both';
};

const OTHER_VISA_RESULT: Record<string, OtherVisaData> = {
  gijinkoku: {
    headline: '技人国ビザの場合、特定技能への移行は限定的です',
    subheadline: '更新・就労継続・状況によっては他ビザへの変更も選択肢になります',
    explanation: '技術・人文知識・国際業務ビザは更新を繰り返すことで長期就労が可能です。特定技能への移行は要件を満たせば可能ですが、多くの場合そのまま技人国を維持する方が本人・企業ともにメリットがあります。',
    options: [
      { title: '技人国ビザを継続更新する', desc: '最もシンプルな選択肢。学歴・職務の一致要件を満たし続けることが条件。', pros: '家族帯同可・職種制限が少ない・更新回数に上限なし', cons: '業務内容の変更時に要注意。製造現場への配置転換等は不可' },
      { title: '特定技能1号への変更を検討', desc: '業種が特定技能の対象分野で、試験に合格すれば変更可能。', pros: '特定技能2号へのステップアップが可能な業種あり', cons: '業種・試験要件あり。技人国より職種の自由度は下がる' },
    ],
    companyTodos: [
      { text: '現在の業務内容が技人国の要件を満たしているか確認する', priority: 'urgent', detail: { why: '技人国ビザは「学歴・専攻と業務内容の一致」が更新要件です。業務内容が変わっていたり、現場作業の比率が高い場合、更新時に不許可になるリスクがあります。', how: ['本人の最終学歴（学部・専攻）を確認する', '現在の業務内容と専攻分野の関連性を書面で整理する', '単純労働（ライン作業等）の比率が高い場合は行政書士に事前相談する'], watch_out: '「現場を手伝ってもらっているだけ」でも、入管は業務比率を厳しく見ます。', timeframe: '次回更新の6ヶ月前までに確認' } },
      { text: '次回の在留期限を確認し、更新申請の準備を始める', priority: 'urgent', detail: { why: '在留期限を過ぎると不法残留になります。更新申請は期限の3ヶ月前から可能で、書類準備に1ヶ月程度かかります。', how: ['在留カードで在留期限を確認する', '更新申請の3ヶ月前を社内カレンダーに登録する', '行政書士への依頼は4ヶ月前を目安に相談開始する'], timeframe: '在留期限の4ヶ月前から準備開始' } },
      { text: '配置転換を検討する場合、事前に行政書士に相談する', priority: 'normal', detail: { why: '技人国ビザは業務内容と学歴の一致が条件です。無断で業務内容を大幅に変更すると在留資格違反になる可能性があります。', how: ['配置転換の内容を行政書士に説明し、在留資格上の問題がないか確認する', '問題がある場合は在留資格変更が必要かどうかを判断してもらう'] } },
    ],
    consultType: 'gyosei',
  },
  ryugaku: {
    headline: '卒業後の在留資格変更が最初のステップです',
    subheadline: '卒業予定時期から逆算して、今から準備を始めることが重要です',
    explanation: '留学生が卒業後に日本で就労するには、在留資格を「留学」から就労ビザに変更する必要があります。主な選択肢は「技術・人文知識・国際業務」または「特定技能」です。',
    options: [
      { title: '技術・人文知識・国際業務へ変更', desc: '大学・専門学校卒業者が最も多く選ぶルート。学んだ分野と業務の関連性が審査される。', pros: '職種の幅が広い・家族帯同可・更新継続可', cons: '学歴と業務内容の一致が必要。製造ラインのみの仕事は原則不可' },
      { title: '特定技能1号へ変更', desc: '対象14分野で技能試験・日本語試験に合格すれば変更可能。学歴不問。', pros: '試験合格のみで取得可能。学歴・業務一致の制約なし', cons: '対象分野が限定的。試験準備が必要' },
    ],
    companyTodos: [
      { text: '卒業予定日を確認し、在留資格変更申請のスケジュールを逆算する', priority: 'urgent', detail: { why: '在留資格変更申請は許可まで約2〜3ヶ月かかります。卒業前から申請を準備しないと、卒業後に就労できない空白期間が生じます。', how: ['本人の卒業予定月を確認する', '卒業の3〜4ヶ月前には行政書士に相談を開始する', '必要書類（雇用契約書・会社概要等）の準備を進める'], timeframe: '卒業の4ヶ月前から準備開始' } },
      { text: '採用予定の業務内容と本人の学歴の一致を確認する', priority: 'urgent', detail: { why: '技人国ビザの審査では「学歴（専攻）と業務内容の関連性」が最も重要な判断基準です。関連性が認められないと不許可になります。', how: ['本人の大学・専門学校の卒業証明書と成績証明書を入手する', '採用予定の業務内容を具体的に書き出す', '学歴と業務の関連性について行政書士に事前確認する'], watch_out: '「現場で一緒に働いてほしい」だけでは不許可になるケースが多い。具体的な専門業務を明示する必要があります。' } },
      { text: '内定を出す前に在留資格取得の見込みを行政書士に確認する', priority: 'normal', detail: { why: '内定を出した後に在留資格が取れないことが分かると、企業・本人双方にとって大きな問題になります。事前確認で防げるリスクです。', how: ['行政書士に本人の学歴・業務内容を伝え、許可の見込みを確認する', '問題がある場合は業務内容の調整や別の在留資格の検討を相談する'] } },
    ],
    consultType: 'gyosei',
  },
  specified_activities: {
    headline: '特定活動の内容によって次のステップが異なります',
    subheadline: '在留カードの「就労制限の有無」欄を確認してください',
    explanation: '特定活動は内容が多様なため、次のステップは個別状況によります。行政書士への相談が最も確実です。',
    options: [
      { title: '行政書士に現状を確認してもらう', desc: '特定活動の種類・期限・就労制限の内容によって、取れる選択肢が変わります。', pros: '最短ルートを個別に提案してもらえる', cons: '相談費用がかかる' },
    ],
    companyTodos: [
      { text: '在留カードの「就労制限の有無」欄と在留期限を確認する', priority: 'urgent', detail: { why: '特定活動の内容によって就労の可否・範囲が全く異なります。在留カードの記載内容が全ての判断の起点になります。', how: ['在留カードの表面「就労制限の有無」欄を確認する', '裏面の「資格外活動許可」の有無も確認する', '在留期限を確認し、残り期間を把握する'], timeframe: '今週中に確認' } },
      { text: '行政書士に現在の特定活動の内容と次のステップを相談する', priority: 'normal', detail: { why: '特定活動は類型が多く、一般的な情報では正確な判断ができません。個別の状況を専門家に確認することが最も効率的です。', how: ['在留カードのコピーと指定書（あれば）を持って行政書士に相談する', '現在の業務内容と今後の希望を伝え、取れる選択肢を聞く'] } },
    ],
    consultType: 'gyosei',
  },
  unknown: {
    headline: 'まず在留カードの確認から始めましょう',
    subheadline: '在留カードに書かれた「在留資格」と「在留期限」が全ての起点になります',
    explanation: '在留資格によって取れる選択肢が全く異なります。まずスタッフの在留カードを確認し、わからない点は監理団体または行政書士に相談することをお勧めします。',
    options: [],
    companyTodos: [
      { text: '全外国人スタッフの在留カードをコピーして保管する', priority: 'urgent', detail: { why: '外国人を雇用する企業には在留カードの確認・保管が法的義務として課されています。未確認の場合、不法就労助長罪に問われるリスクがあります。', how: ['全外国人スタッフの在留カード（表裏）をコピーする', '在留資格・在留期限・就労制限の有無を一覧表にまとめる', 'コピーは人事ファイルに保管し、更新のたびに差し替える'], watch_out: '在留カードの確認は採用時だけでなく、更新のたびに行う必要があります。', timeframe: '今週中に全員分を確認・コピー' } },
      { text: '在留資格の種類と在留期限を一覧表で管理する', priority: 'urgent', detail: { why: '在留期限の管理漏れは不法残留（オーバーステイ）に直結します。企業にも責任が及ぶため、一元管理が必須です。', how: ['Excelまたはスプレッドシートで管理表を作成する（氏名・在留資格・在留期限・次回更新予定）', '在留期限の3ヶ月前にアラートが出るようカレンダー登録する'], timeframe: '今週中に管理表を作成' } },
      { text: '在留期限が3ヶ月以内のスタッフがいないか確認する', priority: 'urgent', detail: { why: '在留期限の3ヶ月前から更新申請が可能です。期限が迫っているスタッフがいる場合、すぐに行政書士または監理団体に連絡する必要があります。', how: ['在留カードの在留期限を全員分確認する', '3ヶ月以内のスタッフがいれば、ただちに行政書士に連絡する'], timeframe: '今日中に確認' } },
    ],
    consultType: 'both',
  },
};

/* ============================================================
   Diagnosis types & logic
   ============================================================ */

type CheckerInput = { industry: string; visaStatus: string; yearsInJapan: string; japaneseLevel: string; examStatus: string };

type RoadmapStep = { id: string; status: 'done' | 'current' | 'next' | 'future'; title: string; detail: string; estimatedMonths?: number };

type TimelinePhase = { label: string; months: number; desc: string };

type CheckerResult = {
  headline: string;
  subheadline: string;
  urgency: 'high' | 'medium' | 'low';
  roadmap: RoadmapStep[];
  companyTodos: TodoItem[];
  consultType: 'kanri' | 'gyosei' | 'both';
  examInfo?: ExamInfo;
  timeline?: { totalMonths: number; phases: TimelinePhase[] };
  warningNote?: string;
  industry: string;
  visaStatus: string;
};

type DiagnosisResult = { kind: 'other'; data: OtherVisaData } | { kind: 'standard'; data: CheckerResult };

function generateDiagnosis(input: CheckerInput): DiagnosisResult {
  const visa = VISA_STATUS.find((v) => v.id === input.visaStatus);
  const path = visa?.path ?? 'other';

  if (path === 'other') {
    return { kind: 'other', data: OTHER_VISA_RESULT[input.visaStatus] ?? OTHER_VISA_RESULT.unknown };
  }

  const roadmap: RoadmapStep[] = [];
  const urgentTodos: TodoItem[] = [];
  const normalTodos: TodoItem[] = [];
  const examInfo = INDUSTRY_EXAM_INFO[input.industry] ?? INDUSTRY_EXAM_INFO.other;
  const industryLabel = INDUSTRIES.find((i) => i.id === input.industry)?.label ?? '業種';

  const ikuseiDone = input.visaStatus === 'ikusei_late' || input.visaStatus === 'tokutei1' || input.yearsInJapan === 'gt3';

  roadmap.push({ id: 'ikusei', status: ikuseiDone ? 'done' : input.visaStatus === 'ikusei_early' ? 'current' : 'done', title: '育成就労期間の修了', detail: '入国から最長3年。基礎スキルと日本語を習得する期間。', estimatedMonths: ikuseiDone ? undefined : input.yearsInJapan === 'y2_3' ? 6 : 18 });

  const isAlreadyTokutei1 = input.visaStatus === 'tokutei1';
  const jpDone = isAlreadyTokutei1 || input.japaneseLevel === 'n3' || input.japaneseLevel === 'n2' || input.examStatus === 'both_passed';
  const jpCurrent = !jpDone && (input.japaneseLevel === 'n4' || input.examStatus === 'japanese_only');

  roadmap.push({ id: 'japanese', status: jpDone ? 'done' : jpCurrent ? 'current' : 'next', title: '日本語試験クリア（N4以上）', detail: '特定技能1号への移行要件。JFT-BasicまたはJLPT N4以上。', estimatedMonths: jpDone ? undefined : input.japaneseLevel === 'n4' ? 3 : 9 });

  const examDone = isAlreadyTokutei1 || input.examStatus === 'both_passed';
  const examCurrent = !examDone && input.examStatus === 'exam_only';

  roadmap.push({ id: 'exam', status: examDone ? 'done' : examCurrent ? 'current' : 'next', title: '技能試験クリア（業種別）', detail: '各分野の技能測定試験に合格する。合格率・試験頻度は業種によって異なる。', estimatedMonths: examDone ? undefined : input.examStatus === 'preparing' ? 3 : 6 });

  const canApply = examDone && jpDone && ikuseiDone;
  roadmap.push({ id: 'application', status: input.visaStatus === 'tokutei1' ? 'done' : canApply ? 'current' : 'future', title: '在留資格変更申請（特定技能1号）', detail: '出入国在留管理局への申請。企業・監理団体が書類を準備する。標準処理期間は約2〜3ヶ月。', estimatedMonths: canApply ? 2 : undefined });
  roadmap.push({ id: 'tokutei1', status: input.visaStatus === 'tokutei1' ? 'done' : 'future', title: '特定技能1号 取得', detail: '最長5年間、更新可能。職種によっては特定技能2号への移行も可能。' });

  // --- ToDo generation (tokutei1 path: 2号向け, ikusei path: 1号向け) ---
  if (input.visaStatus === 'tokutei1') {
    const step5Answer = input.examStatus;

    // 辞令・職務命令書の発行 (no_plan, leader_assigned → urgent)
    if (step5Answer === 'no_plan' || step5Answer === 'leader_assigned') {
      urgentTodos.push({
        text: 'リーダー職の辞令・職務命令書を今すぐ発行する',
        priority: 'urgent',
        detail: {
          why: step5Answer === 'leader_assigned'
            ? '現在リーダー業務を担当していても、正式な辞令がなければ入管審査で「管理・指導の実務経験」として認められません。辞令の発行日が経験年数の起算日になるため、発行が遅れた分だけ2号への道が遠のきます。'
            : '特定技能2号の審査で「管理・指導業務の実務経験」を証明するには、辞令や職務命令書などの書面が必須です。経験年数の起算日は「辞令の発行日」になります。',
          how: ['「〇〇を工程リーダー（または班長・指導担当）に任命する」旨の辞令を会社印付きで発行する', '担当業務を具体的に記載する（例：後輩スタッフへの技術指導、作業工程の進捗管理、安全衛生の指導など）', '発行した辞令のコピーを会社でも保管しておく（将来の審査書類として使用）', '可能であれば毎月の業務日報に指導・管理業務の記録を残す'],
          watch_out: step5Answer === 'leader_assigned'
            ? '実務をしていても書面がなければゼロカウントです。辞令なしの期間は一切加算されません。今日発行すれば今日が起算日になります。'
            : '「やっていた」だけでは審査で認められません。書類の日付が経験年数の起算日になるため、1日でも早く発行することが重要です。',
          timeframe: '今週中に発行する',
        },
      });
    }

    // 日本語N3支援 (N3未満の場合)
    if (input.japaneseLevel !== 'n3' && input.japaneseLevel !== 'n2') {
      urgentTodos.push({
        text: '日本語N3取得に向けた学習支援を始める',
        priority: 'urgent',
        detail: {
          why: '特定技能2号の試験はすべて日本語（ルビなし）で出題されます。N4レベルでは試験問題を正確に読み解くことが難しく、合格率がさらに下がります。N3合格が事実上の必須条件です。',
          how: ['JLPT N3対策テキスト（例：「日本語総まとめN3」）を会社が購入して提供する', '業務時間内に週1〜2時間の学習時間を確保する（残業なしの日に設定するなど）', '近くの日本語学校や地域の日本語教室を調べ、費用補助を検討する', 'JLPTの試験日程を確認し、受験料を会社が負担する（年2回：7月・12月）'],
          watch_out: 'N3合格まで平均9〜12ヶ月かかります。今から始めないと2号試験の受験資格を満たすタイミングで間に合わない可能性があります。',
          timeframe: '今月中に学習環境を整え、来月から開始する',
        },
      });
    }

    // スケジュール管理 (全パターン共通)
    urgentTodos.push({
      text: '在留期限と申請タイミングを逆算してスケジュールを組む',
      priority: 'urgent',
      detail: {
        why: '在留資格変更申請（特定技能2号への変更）は、許可が出るまで約2〜3ヶ月かかります。在留期限が切れた後では申請できなくなります。',
        how: ['在留カードで在留期限を確認する', '在留期限の3ヶ月前を「申請開始リミット」として社内カレンダーに登録する', '2号試験の合格証明書には有効期限がある場合があるため、合格後すみやかに申請準備を開始する', '行政書士に依頼する場合は、申請3〜4ヶ月前から相談を始める'],
        watch_out: '試験合格だけでは2号は取得できません。申請書類の準備に時間がかかるため、合格後すぐに動き始めることが重要です。',
        timeframe: '今月中に在留期限を確認し、カレンダーに登録する',
      },
    });

    // 介護分野 (全パターン共通)
    if (input.industry === 'care') {
      normalTodos.push({
        text: '介護福祉士の受験資格（実務3年＋実務者研修）の達成時期を確認する',
        priority: 'normal',
        detail: {
          why: '介護分野は特定技能2号ではなく「介護」在留資格への移行が長期就労のメインルートです。介護福祉士国家試験に合格することで「介護」ビザが取得でき、更新回数の上限がなくなります。',
          how: ['入社日（または介護業務開始日）から3年後の日付を確認する', '実務者研修（450時間・通信＋スクーリング）のスケジュールと費用を調べる（目安：6〜12ヶ月・15〜25万円程度）', '会社として受講費用の補助制度を検討する（介護分野は補助金・助成金が充実している）', '介護福祉士国家試験は年1回（1月）のため、受験年度の4月時点で実務経験3年が必要'],
          watch_out: '実務者研修の修了には時間がかかります。3年目に受験するためには、実務2年目頃から研修を開始する必要があります。',
          timeframe: '実務開始から2年目までに研修開始が理想',
        },
      });
    }

    // 試験日程確認 (exam_preparing → urgent, 他 → normal)
    const examTodoPriority: 'urgent' | 'normal' = step5Answer === 'exam_preparing' ? 'urgent' : 'normal';
    (examTodoPriority === 'urgent' ? urgentTodos : normalTodos).push({
      text: `${industryLabel}の2号技能試験の試験日程・申込方法を確認する`,
      priority: examTodoPriority,
      detail: {
        why: step5Answer === 'exam_preparing'
          ? '受験資格を満たしている今、確実に次回の試験を受験することが最重要です。申込期限を逃すと数ヶ月待つことになります。'
          : '特定技能2号の試験は年3〜4回程度の実施です。受験資格（リーダー経験）を満たすタイミングで確実に申し込めるよう、スケジュールを今から把握しておく必要があります。',
        how: ['各分野の試験実施機関のウェブサイトをブックマークしておく（試験日程は2〜3ヶ月前に公開されることが多い）', '受験資格（リーダー経験の必要年数）を達成する時期を計算し、その直後の試験回を目標に設定する', '試験は国内のみ実施の分野が多いため、受験地・交通費・宿泊費の準備も必要', '不合格の場合の再受験スケジュールもあらかじめ計画に入れておく'],
        watch_out: '受験資格となるリーダー経験の「証明書類（誓約書・証明書）」の提出が申込時に必要です。申込直前に慌てないよう、書類を事前に準備しておいてください。',
        timeframe: step5Answer === 'exam_preparing' ? '今すぐ次回試験日程を確認し申し込む' : '受験資格達成の6ヶ月前から準備開始',
      },
    });
  } else {
    // ikusei path → 1号向けToDo
    if (input.visaStatus === 'ikusei_late') {
      urgentTodos.push({
        text: '在留期限を確認し、特定技能への変更申請タイミングを今すぐ監理団体に相談する',
        priority: 'urgent',
        detail: {
          why: '育成就労の修了が近づいています。在留期限内に特定技能1号への変更申請を完了させないと、一時帰国が必要になるケースがあります。',
          how: ['在留カードで在留期限を確認する', '監理団体に連絡し、移行スケジュールの相談を予約する', '必要書類の一覧を監理団体から入手し、準備を開始する'],
          watch_out: '変更申請には2〜3ヶ月かかります。在留期限の3ヶ月前には申請を出す必要があります。',
          timeframe: '今週中に監理団体に連絡する',
        },
      });
    }
    if (canApply) {
      urgentTodos.push({
        text: '在留資格変更申請の書類準備を開始する',
        priority: 'urgent',
        detail: {
          why: '技能試験・日本語試験の両方に合格し、変更申請が可能な状態です。申請が遅れると在留期限に間に合わなくなるリスクがあります。',
          how: ['行政書士に在留資格変更申請の依頼を検討する', '雇用契約書・会社概要・納税証明書等の必要書類を準備する', '本人の試験合格証明書を入手する'],
          timeframe: '今月中に行政書士への相談を開始する',
        },
      });
    }
    if (input.japaneseLevel === 'unknown') {
      urgentTodos.push({
        text: 'スタッフの日本語レベルを公式試験で確認する',
        priority: 'urgent',
        detail: {
          why: '日本語レベルが不明では、移行スケジュールの計画が立てられません。公式試験で客観的なレベルを確認することが第一歩です。',
          how: ['JFT-Basic（国際交流基金日本語基礎テスト）はCBT方式で随時受験可能。結果もすぐに出るため最も手軽', 'JLPTは年2回（7月・12月）のため、直近の申込期限を確認する', '受験料は会社が負担する（3,500〜6,500円程度）'],
          timeframe: '今月中にJFT-Basicの受験を申し込む',
        },
      });
    }
    if (!examDone) {
      urgentTodos.push({
        text: `${examInfo.examName}の次回日程を確認し申し込む`,
        priority: 'urgent',
        detail: {
          why: '特定技能1号への移行には業種別の技能測定試験の合格が必要です。試験は年複数回ですが、申込締切を逃すと次の回まで数ヶ月待つことになります。',
          how: ['各分野の試験実施機関ウェブサイトで次回の試験日程・申込期限を確認する', '申込はオンラインが多いため、アカウント登録が必要な場合は事前に準備する', '受験料の領収書を保管する（経費申請・補助金申請に使用する場合がある）', '試験会場へのアクセスを確認し、交通手段・宿泊が必要な場合は手配する'],
          watch_out: input.visaStatus === 'ikusei_late' ? '育成就労3年目の場合、在留期限内に合格し変更申請を完了させる必要があります。申込期限を1回逃すだけで計画全体が3〜6ヶ月ずれます。' : undefined,
          timeframe: '今週中に次回試験日程を確認する',
        },
      });
    }
    if (!jpDone) {
      normalTodos.push({
        text: '日本語学習のサポート環境を整える（教材提供・週3時間以上の学習時間確保）',
        priority: 'normal',
        detail: {
          why: '日本語試験（N4以上）の合格は特定技能1号への移行に必須です。企業がサポートすることで合格率・定着率ともに大幅に向上します。',
          how: ['JLPT対策テキストまたはJFT-Basic対策教材を会社が購入して提供する', '週3時間以上の学習時間を確保する（勤務中の空き時間やシフト調整で対応）', '地域の日本語教室や無料オンライン学習ツールの情報を調べて共有する', '同僚の日本人スタッフに「やさしい日本語」で話すことを促す'],
          timeframe: '今月中に教材を準備し学習計画を立てる',
        },
      });
    }
    normalTodos.push({
      text: '監理団体に現状を共有し、移行スケジュールの相談をする',
      priority: 'normal',
      detail: {
        why: '監理団体は育成就労・技能実習の移行手続きの窓口です。早めに相談することで、必要書類や手続きの漏れを防げます。',
        how: ['スタッフの在留資格・在留期限・試験状況を一覧にして監理団体に共有する', '移行のための必要書類一覧をもらい、準備スケジュールを相談する'],
        timeframe: '今月中に監理団体との面談を設定する',
      },
    });
    normalTodos.push({
      text: '在留期限を確認し、申請タイミングから逆算してスケジュールを組む',
      priority: 'normal',
      detail: {
        why: '在留資格変更申請は許可まで約2〜3ヶ月かかります。在留期限から逆算して試験受験・申請のタイミングを決めておく必要があります。',
        how: ['在留カードで在留期限を確認する', '「在留期限 − 3ヶ月 = 申請リミット」として計算し社内カレンダーに登録する', '試験受験→合格発表→申請書類準備→申請のスケジュールを一本の線で整理する'],
        timeframe: '今月中に逆算スケジュールを作成する',
      },
    });
  }

  // --- Headline ---
  let headline = '';
  let subheadline = '';
  let urgency: 'high' | 'medium' | 'low' = 'medium';

  if (input.visaStatus === 'tokutei1') {
    if (input.examStatus === 'no_plan') {
      headline = '特定技能2号への準備を今すぐ始めてください';
      subheadline = '1号の在留期限（最長5年）は確実に来ます。早期に動き始めることで選択肢が広がります';
      urgency = 'high';
    } else if (input.examStatus === 'leader_assigned') {
      headline = '辞令の未発行が最大のボトルネックです';
      subheadline = 'リーダー業務を担当していても、辞令がなければ経験年数にカウントされていません';
      urgency = 'high';
    } else if (input.examStatus === 'leader_with_doc') {
      headline = '着実に前進しています';
      subheadline = 'リーダー経験を積みながら、2号試験の準備を並行して進めましょう';
      urgency = 'medium';
    } else if (input.examStatus === 'exam_preparing') {
      headline = 'あとは2号試験に合格するのみです';
      subheadline = '受験資格を満たしています。試験対策に集中しましょう';
      urgency = 'low';
    } else {
      headline = '特定技能1号 取得済み';
      subheadline = '次は特定技能2号への移行を視野に入れましょう';
      urgency = 'low';
    }
  } else if (canApply) {
    headline = '特定技能1号への移行申請が可能な状態です';
    subheadline = '今すぐ在留資格変更申請の準備を始めましょう';
    urgency = 'high';
  } else if (input.yearsInJapan === 'y2_3') {
    const remaining = (!jpDone ? 1 : 0) + (!examDone ? 1 : 0);
    headline = `特定技能1号まであと${remaining}ステップ`;
    subheadline = 'このタイミングで準備を始めることで、スムーズな移行が可能です';
    urgency = 'high';
  } else {
    headline = '移行までの道筋が確認できました';
    subheadline = '各ステップを計画的に進めましょう';
    urgency = 'medium';
  }

  const consultType: 'kanri' | 'gyosei' | 'both' =
    input.visaStatus === 'ikusei_early' || input.visaStatus === 'ikusei_late' ? 'kanri' : canApply ? 'gyosei' : 'both';

  // --- Timeline ---
  const phases: TimelinePhase[] = [];
  let totalMonths = 0;
  if (!ikuseiDone) { const m = input.yearsInJapan === 'y2_3' ? 6 : 18; phases.push({ label: '育成就労期間の修了', months: m, desc: '入国から最長3年' }); totalMonths += m; }
  if (!jpDone) { const m = input.japaneseLevel === 'n4' ? 3 : 9; phases.push({ label: '日本語試験の準備・合格', months: m, desc: 'JFT-BasicまたはJLPT N4の受験準備' }); totalMonths += m; }
  if (!examDone) { const m = input.examStatus === 'preparing' ? 3 : 6; phases.push({ label: examInfo.examName, months: m, desc: examInfo.passRateNote }); totalMonths += m; }
  if (input.visaStatus !== 'tokutei1') { phases.push({ label: '在留資格変更申請〜許可', months: 2, desc: '出入国在留管理局の標準処理期間' }); totalMonths += 2; }
  const timeline = phases.length > 1 ? { totalMonths, phases } : undefined;

  let warningNote: string | undefined;
  if (input.visaStatus === 'ikusei_late' && input.examStatus === 'not_started') {
    warningNote = '育成就労の修了が近づいていますが、技能試験がまだ未受験です。在留期限切れ前に移行できない場合、一時帰国が必要になるケースがあります。早急に監理団体に相談してください。';
  } else if (input.visaStatus === 'tokutei1' && input.examStatus === 'leader_assigned') {
    warningNote = 'リーダー業務を実際に担当していても、辞令・職務命令書がなければ入管審査で経験年数として認められません。辞令の発行日が起算日になるため、今すぐ辞令を発行することが最も優先度の高いアクションです。';
  }

  return {
    kind: 'standard',
    data: {
      headline, subheadline, urgency, roadmap,
      companyTodos: [...urgentTodos, ...normalTodos],
      consultType,
      examInfo: input.visaStatus !== 'tokutei1' ? examInfo : undefined,
      timeline, warningNote,
      industry: input.industry,
      visaStatus: input.visaStatus,
    },
  };
}

/* ============================================================
   Consultant CTA constants
   ============================================================ */

const CONSULT_CTA: Record<'kanri' | 'gyosei' | 'both', { title: string; desc: string; href: string; icon: string }> = {
  kanri: { title: '監理団体に相談する', desc: '育成就労・技能実習の手続きは監理団体が窓口です。移行スケジュールの相談から申請サポートまで対応しています。', href: '/business/contact', icon: '🏢' },
  gyosei: { title: '行政書士に相談する', desc: '在留資格変更申請の書類作成・申請代行は行政書士の専門領域です。申請可能な状態になったら早めに相談を。', href: '/business/contact', icon: '⚖️' },
  both: { title: '専門家に相談する', desc: '状況に応じて監理団体・行政書士どちらへの相談が適切か、J-GLOWがご案内します。', href: '/business/contact', icon: '💬' },
};

/* ============================================================
   Animation variants
   ============================================================ */

const stepVariants = { initial: { opacity: 0, x: 20 }, animate: { opacity: 1, x: 0 }, exit: { opacity: 0, x: -20 } };
const staggerContainer = { animate: { transition: { staggerChildren: 0.1 } } };
const staggerItem = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

/* ============================================================
   Sub-components
   ============================================================ */

function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = ((current - 1) / total) * 100;
  return (
    <div className="mb-8">
      <div className="flex justify-between text-xs text-gray-400 mb-2">
        <span>STEP {current} / {total}</span>
        <span>{Math.round(pct)}%</span>
      </div>
      <div className="w-full h-1.5 rounded-full bg-gray-200">
        <div className="h-full rounded-full transition-all duration-500 ease-out" style={{ width: `${pct}%`, backgroundColor: '#1a2f5e' }} />
      </div>
    </div>
  );
}

function RoadmapTimeline({ steps }: { steps: RoadmapStep[] }) {
  const statusStyle = {
    done: { circleBg: '#10b981', circleBorder: '#10b981', icon: <Check size={14} className="text-white" />, textColor: 'text-gray-400', lineColor: '#10b981' },
    current: { circleBg: '#1a2f5e', circleBorder: '#1a2f5e', icon: <span className="w-2 h-2 rounded-full bg-white" />, textColor: 'text-gray-900', lineColor: '#1a2f5e' },
    next: { circleBg: '#ffffff', circleBorder: '#c9a84c', icon: <span className="w-2 h-2 rounded-full" style={{ backgroundColor: '#c9a84c' }} />, textColor: 'text-gray-700', lineColor: '#e2e8f0' },
    future: { circleBg: '#ffffff', circleBorder: '#d1d5db', icon: null, textColor: 'text-gray-400', lineColor: '#e2e8f0' },
  };
  return (
    <motion.div variants={staggerContainer} initial="initial" animate="animate" className="relative">
      {steps.map((step, i) => {
        const s = statusStyle[step.status];
        const isLast = i === steps.length - 1;
        return (
          <motion.div key={step.id} variants={staggerItem} className="relative flex gap-4 pb-6">
            <div className="flex flex-col items-center shrink-0">
              <div className="w-7 h-7 rounded-full flex items-center justify-center border-2 shrink-0" style={{ backgroundColor: s.circleBg, borderColor: s.circleBorder }}>{s.icon}</div>
              {!isLast && <div className="w-0.5 flex-1 mt-1" style={{ backgroundColor: s.lineColor }} />}
            </div>
            <div className={`flex-1 pb-2 ${step.status === 'current' ? 'rounded-xl border-2 p-4 -mt-1' : ''}`} style={step.status === 'current' ? { borderColor: 'rgba(26,47,94,0.2)', backgroundColor: 'rgba(26,47,94,0.02)' } : undefined}>
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <h4 className={`text-sm font-bold ${s.textColor}`}>{step.title}</h4>
                {step.status === 'current' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white" style={{ backgroundColor: '#1a2f5e' }}>現在地</span>}
                {step.status === 'next' && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#fdf8ee', color: '#8a7530' }}>次のステップ</span>}
              </div>
              <p className={`text-xs leading-relaxed ${step.status === 'done' ? 'text-gray-400' : 'text-gray-500'}`}>{step.detail}</p>
              {step.estimatedMonths != null && <span className="inline-block mt-2 text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#eef1f7', color: '#1a2f5e' }}>目安：約{step.estimatedMonths}ヶ月</span>}
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}

function TodoSection({ items }: { items: TodoItem[] }) {
  const [checked, setChecked] = useState<Record<number, boolean>>({});
  const [openTodos, setOpenTodos] = useState<Set<number>>(new Set());

  const toggleOpen = (index: number) => {
    setOpenTodos((prev) => {
      const next = new Set(prev);
      if (next.has(index)) next.delete(index);
      else next.add(index);
      return next;
    });
  };

  const urgent = items.filter((t) => t.priority === 'urgent');
  const normal = items.filter((t) => t.priority === 'normal');

  const renderItem = (item: TodoItem, globalIndex: number) => {
    const isDone = checked[globalIndex] ?? false;
    const isOpen = openTodos.has(globalIndex);
    const isUrgent = item.priority === 'urgent';

    return (
      <div
        key={globalIndex}
        className={`rounded-xl border transition-colors ${isDone ? 'bg-gray-50 border-gray-100' : isUrgent ? 'bg-red-50/50 border-red-200' : 'bg-white border-gray-200'}`}
      >
        {/* Header row */}
        <div className="flex items-start gap-3 p-3">
          <button
            onClick={(e) => { e.stopPropagation(); setChecked((prev) => ({ ...prev, [globalIndex]: !prev[globalIndex] })); }}
            className={`shrink-0 mt-0.5 w-5 h-5 rounded flex items-center justify-center border-2 transition-colors ${isDone ? 'border-green-500 bg-green-500' : isUrgent ? 'border-red-400' : 'border-gray-300'}`}
          >
            {isDone && <Check size={12} className="text-white" />}
          </button>
          <button
            onClick={() => toggleOpen(globalIndex)}
            className="flex-1 flex items-start justify-between gap-2 text-left"
          >
            <span className={`text-sm leading-relaxed ${isDone ? 'line-through text-gray-400' : 'text-gray-700'}`}>
              {item.text}
            </span>
            <ChevronDown
              size={16}
              className={`shrink-0 mt-0.5 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </div>

        {/* Accordion detail */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="px-3 pb-4 pt-0 ml-8 space-y-3">
                {/* なぜ必要か */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">なぜ必要か</span>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.detail.why}</p>
                </div>

                {/* 具体的なやり方 */}
                <div>
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">具体的なやり方</span>
                  <ul className="space-y-1">
                    {item.detail.how.map((step, si) => (
                      <li key={si} className="flex items-start gap-2 text-xs text-gray-600 leading-relaxed">
                        <span className="shrink-0 mt-1.5 w-1 h-1 rounded-full bg-gray-400" />
                        {step}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* 注意点 */}
                {item.detail.watch_out && (
                  <div className="flex items-start gap-2 text-xs leading-relaxed p-2.5 rounded-lg" style={{ backgroundColor: 'rgba(239,68,68,0.06)' }}>
                    <span className="shrink-0">⚠️</span>
                    <span className="text-red-800">{item.detail.watch_out}</span>
                  </div>
                )}

                {/* 期限 */}
                {item.detail.timeframe && (
                  <div className="flex items-center gap-1.5 text-xs text-gray-500">
                    <span>⏱</span>
                    <span>目安：{item.detail.timeframe}</span>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  let idx = 0;
  return (
    <div className="space-y-6">
      {urgent.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={14} className="text-red-500" />
            <span className="text-xs font-bold text-red-600 uppercase tracking-wider">今すぐやること</span>
          </div>
          <div className="space-y-2">{urgent.map((item) => { const gi = idx++; return renderItem(item, gi); })}</div>
        </div>
      )}
      {normal.length > 0 && (
        <div>
          <span className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">計画的に進めること</span>
          <div className="space-y-2">{normal.map((item) => { const gi = idx++; return renderItem(item, gi); })}</div>
        </div>
      )}
    </div>
  );
}

function ExamInfoCard({ info }: { info: ExamInfo }) {
  const diffColor = info.difficulty === '易' ? '#10b981' : info.difficulty === '難' ? '#ef4444' : '#f59e0b';
  return (
    <div className="rounded-2xl border border-gray-200 p-5 md:p-6 bg-white">
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-lg">📝</span>{info.examName}について</h3>
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100">難易度：<span style={{ color: diffColor }}>{info.difficulty}</span></span>
        <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 text-gray-600">{info.frequency}</span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed mb-3">{info.passRateNote}</p>
      <div className="flex items-start gap-2 text-sm leading-relaxed p-3 rounded-lg" style={{ backgroundColor: 'rgba(201,168,76,0.08)' }}>
        <span className="shrink-0 mt-0.5">⚠️</span>
        <span className="text-gray-700"><span className="font-semibold">日本語：</span>{info.japaneseNote}</span>
      </div>
    </div>
  );
}

function TimelineCard({ timeline }: { timeline: { totalMonths: number; phases: TimelinePhase[] } }) {
  return (
    <div className="rounded-2xl border border-gray-200 p-5 md:p-6 bg-white">
      <h3 className="text-base font-bold text-gray-900 mb-1 flex items-center gap-2"><span className="text-lg">📅</span>移行までの逆算スケジュール</h3>
      <p className="text-sm mb-5" style={{ color: '#1a2f5e' }}>合計目安：<span className="font-[family-name:var(--font-number)] font-bold text-base">約{timeline.totalMonths}ヶ月</span></p>
      <div className="space-y-0">
        {timeline.phases.map((phase, i) => {
          const isLast = i === timeline.phases.length - 1;
          return (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center shrink-0">
                <span className="w-1.5 h-1.5 rounded-full mt-2" style={{ backgroundColor: '#1a2f5e' }} />
                {!isLast && <div className="w-px flex-1 bg-gray-200" />}
              </div>
              <div className={`flex-1 ${isLast ? 'pb-0' : 'pb-4'}`}>
                <div className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium text-gray-800">{phase.label}</span>
                  <span className="text-xs font-bold shrink-0" style={{ color: '#1a2f5e' }}>{phase.months}ヶ月</span>
                </div>
                {phase.desc && <p className="text-xs text-gray-400 mt-0.5">{phase.desc}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StrategyCard({ industry, strategy }: { industry: string; strategy: IndustryStrategy }) {
  const label = INDUSTRIES.find((i) => i.id === industry)?.label ?? '業種';
  const isCare = industry === 'care';
  const heading = isCare ? `介護分野で長期就労を実現するための戦略` : `${label}分野で特定技能2号を取得するための戦略`;

  return (
    <div className="rounded-2xl border-2 p-5 md:p-6 mb-8" style={{ borderColor: 'rgba(201,168,76,0.3)', backgroundColor: 'rgba(201,168,76,0.03)' }}>
      <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-lg">🎯</span>
        {heading}
      </h3>

      {/* サマリー */}
      <p className="text-sm font-medium text-gray-800 leading-relaxed mb-5 p-3 rounded-lg" style={{ backgroundColor: 'rgba(26,47,94,0.04)' }}>
        {strategy.summary}
      </p>

      {/* 最大の壁 */}
      <div className="mb-5">
        <span className="block text-[10px] font-bold text-red-600 uppercase tracking-wider mb-2">⚠️ この分野最大の壁</span>
        <p className="text-sm text-gray-600 leading-relaxed">{strategy.keyChallenge}</p>
      </div>

      {/* 合格率を上げる戦略 */}
      <div className="mb-5">
        <span className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#10b981' }}>合格率を上げる戦略</span>
        <ol className="space-y-2">
          {strategy.winningStrategy.map((s, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-600 leading-relaxed">
              <span className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white" style={{ backgroundColor: '#1a2f5e' }}>{i + 1}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      {/* 年別アクションプラン */}
      <div className="mb-5">
        <span className="block text-[10px] font-bold uppercase tracking-wider mb-2" style={{ color: '#1a2f5e' }}>📅 年別アクションプラン</span>
        <div className="space-y-2">
          {(['year1', 'year2', 'year3', 'year4to5'] as const).map((key) => {
            const yearLabel = key === 'year1' ? '1年目' : key === 'year2' ? '2年目' : key === 'year3' ? '3年目' : '4〜5年目';
            return (
              <div key={key} className="flex items-start gap-2 text-sm">
                <span className="shrink-0 text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: '#eef1f7', color: '#1a2f5e' }}>{yearLabel}</span>
                <span className="text-gray-600 leading-relaxed">{strategy.timeline[key]}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 合格者パターン */}
      <div className="p-3 rounded-lg" style={{ backgroundColor: 'rgba(201,168,76,0.08)' }}>
        <span className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: '#8a7530' }}>💡 合格者に共通するパターン</span>
        <p className="text-sm text-gray-700 leading-relaxed">{strategy.successPattern}</p>
      </div>
    </div>
  );
}

/* ============================================================
   Result screens
   ============================================================ */

function ConsultCTA({ consultType }: { consultType: 'kanri' | 'gyosei' | 'both' }) {
  const partnerCards = consultType === 'both'
    ? [CONSULT_CTA.kanri, CONSULT_CTA.gyosei]
    : consultType === 'kanri'
      ? [CONSULT_CTA.kanri, CONSULT_CTA.gyosei]
      : [CONSULT_CTA.gyosei, CONSULT_CTA.kanri];

  return (
    <div className="mb-8 space-y-0">
      {/* J-GLOW相談カード */}
      <div className="rounded-2xl p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #1a2f5e 0%, #0f1e3d 100%)' }}>
        <div className="flex items-start gap-3 mb-4">
          <span className="text-2xl shrink-0">💬</span>
          <h3 className="text-lg font-bold text-white">まずはJ-GLOWに相談する</h3>
        </div>
        <p className="text-sm text-white/80 leading-relaxed mb-5">
          どの専門家に相談すればいいかわからない場合は、J-GLOWが状況をヒアリングして最適な専門家・監理団体・行政書士をご案内します。無料でご利用いただけます。
        </p>
        <Link
          href="/business/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200"
          style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
        >
          J-GLOWに無料相談する<ArrowRight size={15} />
        </Link>
        <p className="text-[11px] mt-4" style={{ color: 'rgba(255,255,255,0.4)' }}>相談内容に応じて最適な専門家をご紹介します</p>
      </div>

      {/* 区切り */}
      <div className="flex items-center gap-4 my-4">
        <div className="flex-1 h-px bg-gray-200" />
        <span className="text-sm text-gray-400">または専門家に直接相談</span>
        <div className="flex-1 h-px bg-gray-200" />
      </div>

      {/* パートナーカード */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {partnerCards.map((cta) => (
          <div key={cta.title} className="rounded-2xl border-2 p-5" style={{ borderColor: 'rgba(26,47,94,0.15)' }}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">{cta.icon}</span>
              <h4 className="text-sm font-bold text-gray-900">{cta.title}</h4>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-4">{cta.desc}</p>
            <Link href={cta.href} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold text-white text-xs hover:-translate-y-0.5 hover:shadow-md transition-all duration-200" style={{ backgroundColor: '#1a2f5e' }}>
              相談する<ArrowRight size={13} />
            </Link>
          </div>
        ))}
      </div>
      <p className="text-[10px] text-gray-400 mt-3 text-right">※ 将来的にJ-GLOW登録パートナーの一覧からご紹介予定</p>
    </div>
  );
}

function BottomButtons({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <button onClick={onReset} className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border-2 border-gray-200 text-gray-700 hover:bg-gray-50 transition-colors"><RotateCcw size={15} />もう一度診断する</button>
      <Link href="/business/existing-users/ladder" className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm border-2 text-[#1a2f5e] hover:bg-[#1a2f5e]/5 transition-colors" style={{ borderColor: 'rgba(26,47,94,0.2)' }}><ArrowLeft size={15} />育てるに戻る</Link>
    </div>
  );
}

function OtherVisaResultScreen({ data, onReset }: { data: OtherVisaData; onReset: () => void }) {
  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ background: '#eef1f7' }}>
          <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-[#1a2f5e] mb-2">{data.headline}</h2>
          <p className="text-sm text-[#1a2f5e]/60">{data.subheadline}</p>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed mb-8">{data.explanation}</p>
        {data.options.length > 0 && (
          <div className="mb-8">
            <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-lg">🔀</span>取りうる選択肢</h3>
            <div className="space-y-4">
              {data.options.map((opt) => (
                <div key={opt.title} className="rounded-2xl border border-gray-200 p-5 bg-white">
                  <h4 className="text-sm font-bold text-gray-900 mb-1">{opt.title}</h4>
                  <p className="text-xs text-gray-500 mb-3">{opt.desc}</p>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#f0fdf4' }}>
                      <span className="block text-[10px] font-bold text-green-700 uppercase mb-1">メリット</span>
                      <p className="text-xs text-green-800 leading-relaxed">{opt.pros}</p>
                    </div>
                    <div className="rounded-lg p-3" style={{ backgroundColor: '#fef2f2' }}>
                      <span className="block text-[10px] font-bold text-red-700 uppercase mb-1">注意点</span>
                      <p className="text-xs text-red-800 leading-relaxed">{opt.cons}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-lg">📋</span>企業がやるべきこと</h3>
          <TodoSection items={data.companyTodos} />
        </div>
        <ConsultCTA consultType={data.consultType} />
        <BottomButtons onReset={onReset} />
      </motion.div>
    </div>
  );
}

function StandardResultScreen({ result, onReset }: { result: CheckerResult; onReset: () => void }) {
  const urgencyStyles = {
    high: { bg: 'linear-gradient(135deg, #1a2f5e 0%, #14254b 100%)', text: 'text-white', sub: 'text-white/70' },
    medium: { bg: '#eef1f7', text: 'text-[#1a2f5e]', sub: 'text-[#1a2f5e]/60' },
    low: { bg: '#f0fdf4', text: 'text-green-800', sub: 'text-green-700/70' },
  };
  const uStyle = urgencyStyles[result.urgency];
  const strategy = STRATEGY_BY_INDUSTRY[result.industry];

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* サマリーカード */}
        <div className="rounded-2xl p-6 md:p-8 mb-8" style={{ background: uStyle.bg }}>
          {result.urgency === 'high' && <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-amber-400 text-amber-900 mb-4">今すぐ行動が必要なタイミングです</span>}
          <h2 className={`font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold ${uStyle.text} mb-2`}>{result.headline}</h2>
          <p className={`text-sm ${uStyle.sub}`}>{result.subheadline}</p>
        </div>

        {result.warningNote && (
          <div className="flex items-start gap-3 rounded-xl p-4 mb-8 border" style={{ backgroundColor: '#fef2f2', borderColor: '#fecaca' }}>
            <AlertTriangle size={18} className="text-red-500 shrink-0 mt-0.5" />
            <p className="text-sm text-red-800 leading-relaxed">{result.warningNote}</p>
          </div>
        )}

        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-5 flex items-center gap-2"><span className="text-lg">🗺️</span>移行ロードマップ</h3>
          <RoadmapTimeline steps={result.roadmap} />
        </div>

        {result.examInfo && <div className="mb-8"><ExamInfoCard info={result.examInfo} /></div>}
        {result.timeline && <div className="mb-8"><TimelineCard timeline={result.timeline} /></div>}

        <div className="mb-8">
          <h3 className="text-base font-bold text-gray-900 mb-4 flex items-center gap-2"><span className="text-lg">📋</span>企業がやるべきこと</h3>
          <TodoSection items={result.companyTodos} />
        </div>

        {/* 分野別2号取得戦略（特定技能1号の結果のみ） */}
        {result.visaStatus === 'tokutei1' && strategy && (
          <StrategyCard industry={result.industry} strategy={strategy} />
        )}

        <ConsultCTA consultType={result.consultType} />
        <BottomButtons onReset={onReset} />
      </motion.div>
    </div>
  );
}

/* ============================================================
   Main component
   ============================================================ */

// ── sessionStorage 永続化 ──
const MC_STORAGE_KEY = 'migration_checker_state';
type McSavedState = { step: number; answers: string[]; pattern: Step5Pattern };
function saveMcState(s: McSavedState): void {
  try { sessionStorage.setItem(MC_STORAGE_KEY, JSON.stringify(s)); } catch { /* ignore */ }
}
function loadMcState(): McSavedState | null {
  try {
    const raw = sessionStorage.getItem(MC_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as McSavedState;
  } catch { return null; }
}
function clearMcState(): void {
  try { sessionStorage.removeItem(MC_STORAGE_KEY); } catch { /* ignore */ }
}

export function MigrationChecker() {
  const [step, setStep] = useState(() => loadMcState()?.step ?? 0);
  const [answers, setAnswers] = useState<string[]>(() => loadMcState()?.answers ?? []);
  const [result, setResult] = useState<DiagnosisResult | null>(null);
  const [step5Pattern, setStep5Pattern] = useState<Step5Pattern>(() => loadMcState()?.pattern ?? 'ikusei');

  // state変更時にsessionStorageへ保存
  useEffect(() => {
    if (step > 0 || answers.length > 0) {
      saveMcState({ step, answers, pattern: step5Pattern });
    }
  }, [step, answers, step5Pattern]);

  const totalSteps = step5Pattern === 'skip' ? 4 : 5;
  const currentQ = step < 4 ? STEPS[step] : getStep5Question(step5Pattern);

  const handleSelect = (optionId: string) => {
    const newAnswers = [...answers];
    newAnswers[step] = optionId;
    setAnswers(newAnswers);

    // STEP2（在留資格選択）でstep5パターンを決定
    if (step === 1) {
      setStep5Pattern(getStep5Pattern(optionId));
    }

    setTimeout(() => {
      if (step === 3) {
        // STEP4（日本語レベル）の次：skipならそのまま結果へ、そうでなければSTEP5へ
        const pattern = getStep5Pattern(newAnswers[1]);
        if (pattern === 'skip') {
          setResult(generateDiagnosis({ industry: newAnswers[0], visaStatus: newAnswers[1], yearsInJapan: newAnswers[2], japaneseLevel: newAnswers[3], examStatus: '' }));
        } else {
          setStep(4);
        }
      } else if (step === 4) {
        // STEP5の後：結果画面へ
        setResult(generateDiagnosis({ industry: newAnswers[0], visaStatus: newAnswers[1], yearsInJapan: newAnswers[2], japaneseLevel: newAnswers[3], examStatus: newAnswers[4] }));
      } else {
        setStep(step + 1);
      }
    }, 300);
  };

  const handleBack = () => { if (step > 0) setStep(step - 1); };
  const handleReset = () => { clearMcState(); setStep(0); setAnswers([]); setResult(null); setStep5Pattern('ikusei'); };

  if (result) {
    if (result.kind === 'other') return <OtherVisaResultScreen data={result.data} onReset={handleReset} />;
    return <StandardResultScreen result={result.data} onReset={handleReset} />;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <ProgressBar current={step + 1} total={totalSteps} />
      <AnimatePresence mode="wait">
        <motion.div key={step} variants={stepVariants} initial="initial" animate="animate" exit="exit" transition={{ duration: 0.25 }}>
          <h2 className="font-[family-name:var(--font-heading)] text-xl md:text-2xl font-bold text-gray-900 mb-2">{currentQ.title}</h2>
          <p className="text-sm text-gray-500 mb-8">{currentQ.sub}</p>
          {currentQ.layout === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {currentQ.options.map((opt) => {
                const selected = answers[step] === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect(opt.id)} className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all duration-200 ${selected ? 'border-[#1a2f5e] bg-[#1a2f5e]/5' : 'border-gray-200 bg-white hover:bg-[rgba(26,47,94,0.03)] hover:border-gray-300'}`}>
                    <span className="text-2xl">{opt.icon}</span>
                    <span className={`text-sm font-medium ${selected ? 'text-[#1a2f5e]' : 'text-gray-700'}`}>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {currentQ.options.map((opt) => {
                const selected = answers[step] === opt.id;
                return (
                  <button key={opt.id} onClick={() => handleSelect(opt.id)} className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${selected ? 'border-[#1a2f5e] bg-[#1a2f5e]/5' : 'border-gray-200 bg-white hover:bg-[rgba(26,47,94,0.03)] hover:border-gray-300'}`}>
                    <span className={`block text-sm font-bold ${selected ? 'text-[#1a2f5e]' : 'text-gray-900'}`}>{opt.label}</span>
                    {opt.sub && <span className="block text-xs text-gray-400 mt-0.5">{opt.sub}</span>}
                  </button>
                );
              })}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {step > 0 && (
        <button onClick={handleBack} className="mt-8 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
          <ArrowLeft size={14} />戻る
        </button>
      )}
    </div>
  );
}
