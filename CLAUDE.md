# J-GLOW — プロジェクト構成リファレンス

## デプロイ情報

- **Vercel**: https://j-glow.vercel.app
- **Supabase**: tckwizynvfiqezjrcedk（ap-southeast-1）
- **デプロイ方法**: `vercel deploy --prod`（CLIログイン済み環境）
- **author_id**（記事投入用）: `7bb78a5a-da02-469f-b81c-5d9243b52397`

---

## 技術スタック

- Next.js (App Router) + TypeScript + Tailwind CSS v4
- Supabase（Auth + PostgreSQL + RLS）
- @react-pdf/renderer + file-saver（PDF生成）
- recharts（グラフ）
- framer-motion（アニメーション）
- nanoid（共有トークン生成）
- rehype-raw + remark-gfm（Markdown/HTML記事レンダリング）

---

## ディレクトリ構成

```
src/
├─ app/                              # Next.js App Router（71 page.tsx）
│  ├─ (auth)/                        # 認証（共通login + ロール別register）
│  │  ├─ login/
│  │  └─ register/{business,worker}/
│  ├─ contact/                       # お問い合わせ（スタンドアロン、Header/Footer なし）
│  ├─ business/                      # 企業向け [LAYOUT: BusinessHeader + Footer]
│  │  ├─ cost-simulator/             # コストシミュレーター v2（DB駆動・2モード）
│  │  │  ├─ lib/                     # types.ts, constants.ts, calculate.ts
│  │  │  └─ components/              # Shell, LandingGate, Step0-4, Quick*, Result*, PDF等（20+）
│  │  ├─ hiring-guide/               # 採用完全ガイド + サブ3本
│  │  │  ├─ labor-shortage/
│  │  │  ├─ trends/
│  │  │  ├─ honest-guide/
│  │  │  └─ cost-simulator/          # → /business/cost-simulator にリダイレクト
│  │  ├─ roadmap/                    # 育成就労ロードマップ
│  │  ├─ articles/                   # 19分野ガイド + [slug] + industry-overview
│  │  ├─ existing-users/             # 外国人スタッフ活用ハブ
│  │  │  ├─ ladder/{checker,[slug]}  # キャリアラダー + 移行チェッカー
│  │  │  ├─ continue/[slug]          # 続ける・判断する記事
│  │  │  └─ connect/templates        # 現場指示書ビルダー
│  │  ├─ tools/labor-notice/         # 労働条件通知書生成
│  │  │  ├─ components/Step1-5       # ウィザードステップ
│  │  │  └─ pdf/                     # PDF生成コンポーネント
│  │  ├─ simulation/                 # シミュレーションゲーム
│  │  ├─ diagnosis/                  # 適正診断 + [sessionId] + report/[reportId]
│  │  ├─ blog/[slug]                 # ブログ記事
│  │  ├─ subsidies/[slug]            # 助成金
│  │  ├─ whitepapers/[slug]          # ホワイトペーパー
│  │  ├─ trends/                     # トレンド情報
│  │  ├─ news/[articleId]            # ニュース（スタブ）
│  │  ├─ partners/                   # パートナー検索（5種別×3ティア）
│  │  │  └─ apply/{,complete}        # パートナー申請フォーム + 完了
│  │  ├─ contact/                    # お問い合わせフォーム
│  │  ├─ search/                     # サイト内統合検索
│  │  ├─ {home,onboarding,mypage}/   # 認証後ページ
│  │  └─ ikusei/                     # 育成就労
│  ├─ worker/                        # 労働者向け [LAYOUT: WorkerHeader + LangProvider]
│  │  ├─ {home,mypage}/              # 認証後ページ
│  │  └─ topics/[topicSlug]          # 多言語トピック
│  ├─ admin/                         # 管理画面CMS [LAYOUT: Sidebar]（15セクション）
│  │  ├─ settings/{business,worker}/ # テーマ・ナビ・コンテンツ設定
│  │  ├─ blog/                       # ブログ管理
│  │  ├─ diagnosis/                  # 診断管理
│  │  ├─ simulation/                 # シミュレーション管理
│  │  ├─ simulator/                  # コストシミュレーター設定
│  │  ├─ {news,translations,whitepapers,subsidies,trends}/
│  │  ├─ partners/                   # パートナー管理
│  │  ├─ contact/                    # 問い合わせ管理
│  │  └─ notifications/              # 通知管理
│  └─ privacy-policy/                # PP（ドラフト）
├─ components/
│  ├─ business/                      # 企業向けUI
│  │  ├─ BusinessHeader.tsx          # ソリッドネイビーヘッダー + UserArea
│  │  ├─ cost-simulator/             # 旧コストシミュレーター（デッドコード）
│  │  ├─ hiring-guide/               # 採用ガイド24コンポーネント
│  │  ├─ roadmap/                    # ロードマップ4コンポーネント
│  │  ├─ partners/                   # パートナー検索UI（Phase 3）
│  │  │  ├─ PartnersSearch.tsx       # メイン検索（useMemoフィルタリング・3ティア表示）
│  │  │  ├─ FilterPanel.tsx          # フィルターパネル（種別連動ビザ切替）
│  │  │  ├─ PlatinumCard.tsx         # プラチナカード（design.jsx移植・インラインスタイル）
│  │  │  ├─ GoldCard.tsx             # ゴールドカード
│  │  │  ├─ RegularCard.tsx          # レギュラーカード
│  │  │  ├─ TierBadge.tsx            # ティアバッジ（PLATINUM/GOLD/MEMBER）
│  │  │  ├─ TypeBadge.tsx            # 種別バッジ（5種別アイコン+ラベル）
│  │  │  └─ ApplicationForm.tsx      # 掲載申請フォーム（5ステップ）
│  │  ├─ PartnerDirectory.tsx        # 旧パートナー一覧（Legacy型使用）
│  │  ├─ MigrationChecker.tsx        # 移行チェッカー全ロジック
│  │  ├─ TemplateBuilder.tsx         # 現場指示書ビルダー v4
│  │  └─ ArticleContent.tsx          # Markdownレンダラー
│  ├─ worker/                        # ワーカー向けUI
│  ├─ admin/                         # 管理画面コンポーネント
│  ├─ shared/                        # 汎用UI（Button, Input, Modal, Badge等）
│  ├─ ActivityLogProvider.tsx        # ページ閲覧ログ（layout.tsxで使用）
│  └─ common/Footer.tsx              # 共通フッター（PP + お問い合わせリンク）
├─ lib/
│  ├─ supabase/{client,server,middleware}.ts
│  ├─ utils/routing.ts               # getHomePath()
│  ├─ translations/labor-notice.json  # 8言語翻訳辞書
│  ├─ templateData.ts                # 現場指示書データ（6言語）
│  ├─ hiring-guide-data.ts           # 採用ガイドデータ
│  ├─ partners-config.ts             # パートナー設定（TIER_CONFIG, PARTNER_TYPE_CONFIG, TYPE_VISA_OPTIONS, FORM_FIELDS）
│  ├─ analytics/useActivityLog.ts    # 行動ログフック（page_view イベント）
│  └─ constants.ts, data.ts
├─ hooks/useAuth.ts                  # ハイブリッド認証
├─ contexts/LangContext.tsx          # 11言語切替
└─ types/database.ts                 # 全型定義
public/
├─ fonts/                            # Noto Sans 5系統
├─ images/                           # ヒーロー・カード・SVG図解
│  └─ tools/                         # ツールスクリーンショット（6枚）
└─ downloads/                        # PDF・Excel
supabase/migrations/                 # 00001〜00037（38ファイル）
scripts/                             # DB投入スクリプト
```

---

## 言語対応方針

| セクション | 言語 | ルール |
|---|---|---|
| /worker | 11言語 (ja, en, zh, vi, tl, pt, id, th, my, ne, km) | テキスト直書き禁止・辞書JSON必須 |
| /business | 日本語のみ | テキスト直書きOK |
| / (トップ) | 日本語のみ | テキスト直書きOK |

### 多言語開発プロトコル（/worker 側で厳守）
1. **No Hardcoded Strings** — 辞書JSONまたはSupabase翻訳テーブルから取得
2. **JP-First** — 日本語定義 → 10言語一括翻訳
3. **可変長テキスト対応** — Flexbox/Gridで柔軟レイアウト
4. **フォントフォールバック** — 各国語フォントのCSS共通スタック
5. **管理者修正導線** — 翻訳データは疎結合、管理パネルから手動修正可能

---

## デザインシステム

- **プライマリ**: ネイビー `#1a2f5e` (`var(--biz-primary)`)
- **アクセント**: ゴールド `#c9a84c` (`var(--biz-accent)`)
- **セクション背景交互**: `#f8fafc` ↔ `#ffffff`
- **セクション区切り**: `border-top: 1px solid #e2e8f0`
- **外部リンク**: `target="_blank" rel="noopener noreferrer"`

---

## サイト構成マップ

### 公開ページ（ゲストアクセス可）

| パス | 説明 |
|---|---|
| `/` | トップ — 企業向け/働く方向けの2分岐ポータル（DB駆動） |
| `/business` | 企業向けランディング（ヒーロー→数字→理由→流れ→3本柱→ツール→記事） |
| `/business/simulation` | 外国人雇用シミュレーションゲーム（DB駆動カード20枚） |
| `/business/diagnosis` | 外国人雇用 適正診断 |
| `/business/cost-simulator` | コストシミュレーター v2（LandingGate→Quick/Detail 2モード・6ビザ・3ユーザー種別・PDF提案書） |
| `/business/hiring-guide` | 採用完全ガイド（7ステップ） |
| `/business/hiring-guide/labor-shortage` | 労働力不足サブページ |
| `/business/hiring-guide/trends` | 採用動向サブページ |
| `/business/hiring-guide/honest-guide` | 正直ガイドサブページ |
| `/business/roadmap` | 育成就労ロードマップ（記事一覧+カウントダウン+タイムライン） |
| `/business/articles` | 分野別外国人採用ガイド（19分野） |
| `/business/articles/[slug]` | 記事詳細（Markdown/HTML自動判別） |
| `/business/existing-users` | 外国人スタッフ活用ハブ |
| `/business/existing-users/ladder` | キャリアラダー記事セクション（Stage 1〜4） |
| `/business/existing-users/ladder/[slug]` | キャリアラダー記事詳細 |
| `/business/existing-users/ladder/checker` | 特定技能移行チェッカー（5問ウィザード） |
| `/business/existing-users/connect/templates` | 現場指示書ビルダー v4（6言語対応） |
| `/business/existing-users/continue/[slug]` | 「続ける・判断する」記事（フルHTML対応） |
| `/business/blog/[slug]` | ブログ記事詳細（同一記事が複数ルートからアクセス可能） |
| `/business/tools/labor-notice` | 労働条件通知書生成ツール（8言語・5ステップ・PDF出力） |
| `/business/subsidies` | 助成金情報 |
| `/business/partners` | パートナーディレクトリ（5種別×3ティア） |
| `/business/partners/apply` | パートナー掲載申請フォーム |
| `/business/contact` | お問い合わせフォーム |
| `/business/search` | サイト内統合検索（ツール・ガイド・記事・パートナー） |
| `/business/trends` | トレンド情報 |
| `/business/articles/career-ikusei-tokutei` | 育成就労→特定技能キャリア記事 |
| `/business/articles/fair-wage-guide` | 公正な賃金ガイド記事 |
| `/business/articles/why-workers-leave` | 離職原因分析記事 |
| `/contact` | お問い合わせ（スタンドアロン、種別任意・名前/メール/内容必須） |
| `/privacy-policy` | プライバシーポリシー（現在ドラフト版） |
| `/worker` | 外国人向けランディング |
| `/login` | 共通ログイン |
| `/register/business` | 企業向け登録 |

### 認証必須ページ

| パス | ロール | 説明 |
|---|---|---|
| `/business/mypage` | business | マイページ（スコア・ブックマーク・通知） |
| `/business/onboarding` | business | オンボーディング（business_type + 会社情報） |
| `/business/home` | business | リダイレクトハブ（→ onboarding or mypage） |
| `/worker/mypage` | worker | ワーカーマイページ |
| `/worker/home` | worker | ワーカーホーム |
| `/admin/*` | admin | 管理画面（CMS） |

---

## 認証・認可

### ロール
`'admin' | 'business' | 'worker'`

### 3層アクセスモデル
- **guest**: 未登録。ほとんどのツール・コンテンツを閲覧可能
- **free**: 無料会員。ほぼ全機能
- **premium**: 有料会員（将来拡充）

### ミドルウェア (`src/lib/supabase/middleware.ts`)
- `/admin/*` → role=admin 必須
- `/business/*` サブパス → role=business 必須（`/business` 自体は公開）
- `/worker/*` サブパス → role=worker 必須（`/worker` 自体は公開）
- AUTH_REQUIRED_PATHS: `/business/mypage`, `/business/onboarding`, `/worker/mypage`, `/admin`

### 認証フロー
```
signInWithPassword → Cookie書込 → getSession() → router.push + router.refresh
→ サーバー再レンダリング（middleware Cookie再評価） → useAuth getSession()
```

### useAuth.ts（ハイブリッドアプローチ）
1. マウント時: `getSession()` で初期セッション即座取得
2. その後: `onAuthStateChange` で状態変更監視
3. 安全策: 3秒タイムアウトで loading 強制解除

### ルーティング (`src/lib/utils/routing.ts`)
- `getHomePath(role)`: admin→`/admin`, business→`/business/home`, worker→`/worker/home`

---

## データベース主要テーブル（49テーブル / 38マイグレーション）

### ユーザー系（8テーブル）
- `profiles` — ユーザー基本情報（role, plan, display_name, is_active, privacy_agreed_at）
- `business_profiles` — 法人プロフィール（company_name, contact_name, business_type, industry）
- `worker_profiles` — ワーカープロフィール（nationality, residence_status）
- `user_settings` — ユーザー設定（preferences JSONB）
- `user_scores` — スコア履歴（category: diagnosis/simulation/jp_test）
- `bookmarks` — ブックマーク（content_type: article/job/resource）
- `notifications` — お知らせ（user_id NULL=全員向け）

### コンテンツ系（12テーブル）
- `blog_posts` + `blog_tags` + `blog_post_tags` + `blog_categories` — ブログ記事
- `content_blocks` — ページ動的コンテンツ（多言語対応）
- `feature_cards` — 機能カード（section別、色設定付き）
- `news_articles` + `news_sources` — ニュース記事
- `editorial_articles` — 独自記事
- `whitepapers` + `whitepaper_categories` + `whitepaper_downloads` — ホワイトペーパー

### 診断・ゲーム系（11テーブル）
- `diagnosis_categories` + `diagnosis_questions` + `diagnosis_sessions` + `diagnosis_reports` + `diagnosis_ai_config`

### ツール系
- `simulation_cards` + `simulation_effects` + `simulation_config` — シミュレーションゲーム
- `simulator_cost_items` — コストシミュレーター項目マスタ（v2: 6ビザ種別対応、M00037で拡張）
- `simulator_org_presets` — プリセット保存（v2: user_type カラム追加）
- `simulator_sessions` — 試算結果セッション（v2: user_type, sim_mode, visa_type_detail カラム追加）

### 多言語系（4テーブル）
- `worker_topics` + `worker_topic_contents` — ワーカー向け多言語トピック
- `translation_cache` — LLM翻訳キャッシュ
- `ui_translations` — UI翻訳

### サイト管理系（4テーブル）
- `theme_config` — テーマ設定（CSS変数）
- `navigation_items` — ナビゲーション項目
- `site_settings` — サイト全般設定

### サービス系（10テーブル）
- `partners` — パートナーディレクトリ（5種別×3ティア、M00036で拡張）
- `contact_inquiries` — お問い合わせ（M00036、status: new/in_progress/done）
- `subsidies` + `subsidy_conditions` + `subsidy_search_logs` — 助成金情報
- `trend_sources` + `trend_data` + `trend_widgets` + `trend_insights` — トレンド分析
- `notifications` — お知らせ通知
- `activity_logs` — 行動ログ（M00035、ActivityLogProviderから page_view 記録）
- `ikusei_timeline` + `ikusei_flowcharts` — 育成就労制度参照
- `skill_upgrade_steps` — キャリア段階マスタ

### RLS共通パターン
- `is_admin()` (SECURITY DEFINER) で admin 全件操作可
- ユーザー系テーブル: 本人のみ SELECT/UPDATE
- コンテンツ系: 全員 SELECT、admin のみ管理

---

## ナビゲーション（BusinessHeader）

### ツールメニュー (`toolItems`)
| ラベル | パス |
|---|---|
| コストシミュレーター | `/business/cost-simulator` |
| 労働条件通知書 生成ツール | `/business/tools/labor-notice` |
| 現場指示書ビルダー | `/business/existing-users/connect/templates` |
| 特定技能移行チェッカー | `/business/existing-users/ladder/checker` |
| 外国人雇用 適正診断 | `/business/existing-users/ladder#diagnostic` |

### ガイド・情報メニュー (`guideItems`)
| ラベル | パス |
|---|---|
| はじめての外国人雇用 | `/business/hiring-guide` |
| 外国人スタッフ活用ハブ | `/business/existing-users` |
| 育成就労ロードマップ | `/business/roadmap` |
| 全19分野 解説 | `/business/articles` |
| 19分野 制度比較マップ | `/business/articles/industry-overview` |
| 助成金情報 | `/business/subsidies` |
| パートナー検索 | `/business/partners` |
| お問い合わせ | `/business/contact` |

### ヘッダーデザイン
- ソリッドネイビー背景、sticky top-0 z-50、h-16
- UserArea: 未ログイン→ログインボタン / ログイン中→ドロップダウン
- lg以上: DesktopDropdown × 2 / lg未満: ハンバーガーメニュー

---

## 管理画面（CMS） `/admin/*`

| ページ | パス | 状態 |
|---|---|---|
| ダッシュボード | `/admin` | ✅ |
| グローバル設定 | `/admin/settings` | ✅ |
| Business/Worker設定 | `/admin/settings/business`, `/admin/settings/worker` | ✅ |
| ブログ | `/admin/blog` | ✅ |
| ニュース | `/admin/news` | ⚠️ 閲覧+ピンのみ |
| 診断 | `/admin/diagnosis` | ✅ |
| 翻訳 | `/admin/translations` | ✅ |
| ホワイトペーパー | `/admin/whitepapers` | ✅ |
| 助成金 | `/admin/subsidies` | ✅ |
| トレンド | `/admin/trends` | ✅ |
| シミュレーション | `/admin/simulation` | ✅ |
| コストシミュレーター | `/admin/simulator` | ✅ |
| パートナー | `/admin/partners` | ✅ |
| 問い合わせ | `/admin/contact` | ✅ |
| 通知 | `/admin/notifications` | ✅ |

---

## フッター (`src/components/common/Footer.tsx`)

- 3カラム: ブランド説明 / 企業の方リンク / ツールリンク
- 下部: プライバシーポリシー | お問い合わせ | コピーライト

---

## 記事レンダリング方式

- body が `<style>` で始まる → **フルHTML記事**: `dangerouslySetInnerHTML` で直接レンダリング
- それ以外 → **Markdown記事**: `ArticleContent`（ReactMarkdown + remarkGfm + rehypeRaw）
- 同一記事が複数ルートからアクセス可能（`/business/blog/[slug]`, `/business/existing-users/continue/[slug]` 等）

---

## フォントファイル (`public/fonts/`)

| ファイル | 対応言語 |
|---|---|
| NotoSansJP-Regular/Bold.otf | ja, en, vi, tl, pt, id |
| NotoSansSC-Regular.otf | zh |
| NotoSansKhmer-Regular/Bold.ttf | km |
| NotoSansMyanmar-Regular.ttf | my |
| NotoSansDevanagari-Regular.ttf | ne（将来用） |

---

## 主要ツール仕様概要

### コストシミュレーター v2 (`/business/cost-simulator`)
- DB駆動（simulator_cost_items）、2モード構成 + PDF提案書
- **アーキテクチャ**: ロジック分離済み
  - `lib/types.ts` — 全型定義（Step0-3Data, AllInputs, CostBreakdown, ShellPhase等）
  - `lib/constants.ts` — 20業種、ビザリードタイム、送出国手数料、デフォルト値
  - `lib/calculate.ts` — コスト計算、リスク分析、診断ロジック
- **入口**: LandingGate（UserType→Mode 2段階選択）
  - UserType: kanri（監理団体）/ company（受入企業）/ guest
  - Mode: quick（5問概算）/ detail（多ステップ詳細）、guest→自動quick
- **Detailモード**: phase制御（landing→step0→step1→step2→step3→result）
  - kanri: Step0（団体情報）→Step1→Step2→Step3→Result（4ステップ）
  - company/guest: Step1→Step2→Step3→Result（3ステップ）
- **Quickモード**: 5問カード → QuickResultView → 詳細モード引き継ぎ可
- **6ビザ種別**: ikusei / tokutei1_kaigai / tokutei1_kokunai / tokutei2 / ginou / student（+ compare比較モード）
- **結果画面**: KPIカード + コスト内訳 + VisaTimelineChart + RiskAnalysis + ConsultationPanel（6診断パターン）+ ScheduleTimeline + PDF
- **ゲーティング**: ゲストは結果閲覧可、PDF出力・URL共有はGateModalで会員登録誘導
- **旧パス**: `/business/hiring-guide/cost-simulator` → リダイレクト済み

### 労働条件通知書 (`/business/tools/labor-notice`)
- 8言語対応、5ステップウィザード、入管庁様式準拠
- @react-pdf/renderer でクライアントサイドPDF生成
- 在留資格: ikusei / tokutei1 / tokutei2 / ginou_jisshu

### 現場指示書ビルダー (`/business/existing-users/connect/templates`)
- 6言語 (ja, vi, id, en, my, zh)、7業種フィルタ
- 安全16+緊急8+毎日12ルール + 12フレーズ（絵文字アイコン付き）
- 2カラムレイアウト、別ウィンドウ印刷（フォント自動スケール）

### 特定技能移行チェッカー (`/business/existing-users/ladder/checker`)
- 5問ウィザード（STEP2の回答で動的分岐: ikusei/tokutei1/skip）
- 結果: ロードマップ + 試験情報 + 企業ToDo + 業界別戦略

---

## パートナーディレクトリ

### 型システム（二重型定義）

```
Legacy（PartnersAdmin / PartnerDirectory で使用）:
  PartnerTypeLegacy = 'supervisory' | 'admin_scrivener' | 'support_org'
  PartnerPlanLegacy = 'sponsor' | 'member'

New（partners/ 検索UI・申請フォームで使用）:
  PartnerType = 'kanri' | 'support' | 'gyosei' | 'bengoshi' | 'sharoshi'
  PlanTier    = 'platinum' | 'gold' | 'regular'
  PartnerStatus = 'pending' | 'active' | 'suspended'
```

`Partner` 型は両方のフィールドを持つ（`type: PartnerTypeLegacy | null` + `partner_type: PartnerType`）。
`PARTNER_TYPE_LABELS` は旧・新両方のキーに対応。

### Phase 3 フロントエンド構成

- **page.tsx**: SSRで3ティア別並列クエリ（`Promise.all` × platinum/gold/regular）
- **PartnersSearch**: `useMemo` でクライアントサイドフィルタリング（keyword, type, regions, visas, industries, countries）
- **FilterPanel**: 種別変更でビザ選択肢が動的切替（`TYPE_VISA_OPTIONS`連動）、sharoshi時は「対応サービス」ラベル
- **カード3種**: design.jsx からインラインスタイルで移植（hover shadow/transform付き）
  - PlatinumCard: ヘッダー帯（ネイビーグラデーション）+ スペック数字カード + 左アクセントライン
  - GoldCard: コーナー装飾 + ゴールドボーダー + スペック数字
  - RegularCard: 横並び3カラム（アイコン・情報・タグ+ボタン）
- **ApplicationForm**: 5ステップ（種別選択→基本情報→種別固有→PR→プラン選択）、design.jsx移植
- **定数**: `src/lib/partners-config.ts` に TIER_CONFIG, PARTNER_TYPE_CONFIG, TYPE_VISA_OPTIONS, REGION/INDUSTRY/COUNTRY_OPTIONS, FORM_FIELDS を集約

---

## 既知のギャップ（TODO）

1. `editorial_articles` の作成・編集UIがない（NewsAdmin 3タブ目は読み取り専用）
2. RSSスクレイパー未実装（`/api/news/scrape/route.ts` は TODOプレースホルダー）
3. `/api/blog/generate-cover` が存在しない（BlogPostEditorが参照）
4. `SimulationAdmin.tsx` がデッドコード（旧テーブル用、削除推奨）
5. ニュース記事詳細ページがスタブ（`/business/news/[articleId]` は「開発中」）
6. プライバシーポリシーがドラフト版（第3条〜第14条は「準備中」）
7. 通知のメール送信未実装（`send_email` フラグは記録のみ）
8. 旧コストシミュレーター未削除（`src/components/business/cost-simulator/CostSimulator.tsx` 84KB、参照なし。旧Navigator）
9. コストシミュレーター: register/business の `returnUrl` リダイレクト未実装（GateModal から遷移後の復帰）
10. コストシミュレーター: ゲストセッションのDB引き継ぎ未実装（`guest_token` + `claimed_by` カラム追加が必要）
11. コストシミュレーター v2: M00037 未適用（`supabase db push` or Supabase Dashboard で実行が必要）

---

## マイグレーション実行状況

`00001` 〜 `00037` — **38ファイル全て定義済み**（49テーブル）

- `00035` — activity_logs（行動ログ）
- `00036` — contact_inquiries（お問い合わせ）+ partners 拡張（5種別×3ティア）
- `00037` — simulator_v2（visa_type CHECK拡張、tokutei→tokutei1リネーム、新ビザコスト項目12件INSERT、sessions/presets カラム追加）
