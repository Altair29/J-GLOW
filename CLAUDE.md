# J-GLOW Development Log

## 2026-02-19

### 11カ国語多言語対応（/worker セクション）

#### 追加・変更ファイル
- `src/contexts/LangContext.tsx` — 言語切替コンテキスト（11言語対応）
- `src/components/worker/LangSelector.tsx` — 言語セレクターUI
- `src/components/worker/WorkerHeader.tsx` — ヘッダーに言語切替統合
- `src/components/worker/WorkerHomeClient.tsx` — ワーカーホームのクライアントコンポーネント
- `src/app/worker/layout.tsx` — LangProvider ラップ追加
- `src/app/worker/page.tsx` — クライアントコンポーネント分離
- `src/app/page.tsx` — トップページ更新
- `src/components/business/BusinessHeader.tsx` — 軽微修正
- `src/lib/data.ts` — 多言語データ取得関数追加
- `src/types/database.ts` — 型定義追加
- `src/hooks/useAuth.ts` — 軽微修正
- `public/images/hero-top.png` — ヒーロー画像追加
- `supabase/migrations/00021_worker_multilingual.sql` — 多言語テーブル・初期データ

#### 対応言語（11言語）
ja, en, zh, vi, tl, pt, id, th, my, ne, km

#### 多言語開発プロトコル（以降の /worker 開発で厳守）
1. **No Hardcoded Strings** — テキスト直書き禁止。辞書JSONまたはSupabase翻訳テーブルから取得
2. **JP-First** — 日本語定義 → Claudeが10言語一括翻訳
3. **可変長テキスト対応** — Flexbox/Gridで柔軟レイアウト（ビルマ語・ネパール語等の長文に対応）
4. **フォントフォールバック** — 各国語フォントのCSS共通スタック
5. **管理者修正導線** — 翻訳データは疎結合、管理パネルから手動修正可能

---

### 認証・DBシステム再構築

#### マイグレーション `00022_auth_system_rebuild.sql`
- **profiles リファクタリング**: `organization`/`email_domain` 削除、`plan`(free/premium)/`plan_expires_at`/`is_active`/`metadata` 追加
- **business_profiles**: 法人プロフィール（company_name, contact_name, business_email, email_domain 等）
- **worker_profiles**: ワーカープロフィール（nationality, residence_status）
- **user_settings**: ユーザー設定（preferences jsonb）
- **user_scores**: スコア履歴（category: diagnosis/simulation/jp_test）
- **bookmarks**: ブックマーク（content_type: article/job/resource）
- **billing_history**: 課金履歴（status: paid/failed/refunded）
- **handle_new_user() トリガー更新**: admin不可、display_name優先順位（full_name→name→email）、user_settings同時作成、is_active=false
- **blocked_email_domains 追加**: live.com, msn.com, googlemail.com

#### 型定義 `src/types/database.ts`
- `Role`: `'admin' | 'business' | 'worker'`（editor 削除）
- 新型: `BusinessProfile`, `WorkerProfile`, `UserSettings`, `UserScore`, `Bookmark`, `BillingHistory`, `Plan`, `ScoreCategory`, `BookmarkContentType`, `BillingStatus`

#### ルーティング `src/lib/utils/routing.ts`
- `getHomePath(role)`: admin→`/admin`, business→`/business/home`, worker→`/worker/home`
- `useAuth.ts` と `middleware.ts` の両方から共通利用

#### ミドルウェア `src/lib/supabase/middleware.ts`
- `/admin/*` → role=admin 必須
- `/business/*` → role=business 必須（`/business` 自体はランディング公開）
- `/worker/*` → role=worker 必須（`/worker` 自体はランディング公開）
- 判定は `startsWith('/business/')` でサブパスのみガード
- 未認証時は共通 `/login` にリダイレクト（認証ルートは `/(auth)/*` に集約）

#### RLS設計
- 全テーブル共通: `is_admin()` (SECURITY DEFINER) で admin 全件操作可
- business_profiles / worker_profiles: 本人 SELECT/UPDATE
- user_settings / bookmarks: 本人全操作
- user_scores: 本人 SELECT/INSERT
- billing_history: 本人 SELECT のみ

#### 3層アクセスモデル
- guest（未登録）: 触りのみ
- free（無料会員）: ほぼ全機能
- premium（有料会員）: 将来の拡充サービス

#### デプロイ情報
- Vercel: https://j-glow.vercel.app
- Supabase: tckwizynvfiqezjrcedk（ap-southeast-1）
- デプロイ方法: ターミナルで `vercel deploy --prod`（CLIログイン済み環境から）

#### Supabase手動設定（要確認）
- Authentication → Site URL を本番URLに設定
- Authentication → Redirect URLs に `/callback`, `/worker/auth/callback`, `/business/auth/callback` を追加
- メール認証有効化（is_active連動）

### トップページUI改善
- 「For Workers」→「For Foreign Residents」に変更
- ヒーローパネルを中央寄せ
- CTAボタンのサイズ拡大（px-8 py-4 text-base）

---

### コード品質改善

#### getHomePath 共通化
- `src/lib/utils/routing.ts` に切り出し
- `src/hooks/useAuth.ts` と `src/lib/supabase/middleware.ts` の両方から import（重複解消）

#### /business/home・/worker/home ページ追加
- `src/app/business/home/page.tsx` — 企業ホーム（準備中）
- `src/app/worker/home/page.tsx` — ワーカーホーム（準備中）
- ログイン後 `getHomePath` による遷移先の404を解消

#### 言語リスト統一
- 正しい11言語: ja, en, zh, vi, tl, pt, id, th, my, ne, km
- `src/lib/constants.ts`, `src/contexts/LangContext.tsx`, CLAUDE.md を統一
- mn（モンゴル語）・ko（韓国語）を削除、pt（ポルトガル語）を追加

#### 未使用ファイル削除
- `src/hooks/useTranslation.ts` — 未使用（`LangContext` + `useLang` が実使用系統）
- `src/lib/settings.ts` — 未使用（`useSettings.ts` がクライアント側で直接取得）

#### ミドルウェア修正
- PUBLIC_PATHS から存在しないルート（`/business/login` 等）を除去
- 未認証時のリダイレクト先を共通 `/login` に統一（`/business/login`, `/worker/login` は存在しない）

---

### 外国人雇用シミュレーション（/business/simulation）

#### DB テーブル（マイグレーション `00023`, `00024`）
- **simulation_cards**: シナリオカード（turn_order, situation, yes_label, no_label, is_active）
- **simulation_effects**: カード別の選択効果（card_id FK, choice yes/no, gauge, delta, 遅延ペナルティ対応）
- **simulation_config**: ゲーム設定（key/value: initial_gauges, total_turns, guest_max_turns）
- RLS: SELECT は全員、ALL は `is_admin()` のみ
- シードデータ: 20枚のカード（`00024` で投入、`ON CONFLICT (key) DO NOTHING` 付き）

#### 型定義 `src/types/database.ts`
- `GaugeType`: `'operation' | 'morale' | 'compliance'`
- `SimulationCard`, `SimulationEffect`, `SimulationConfig`, `SimulationCardWithEffects`

#### ゲーム画面 `src/app/business/simulation/`
- `page.tsx` — サーバーコンポーネント（cards + config + user認証を取得）
- `SimulationGame.tsx` — クライアントコンポーネント（ゲーム本体）

#### SimulationGame.tsx の構成
- **イントロ画面**: 背景画像(`/images/3.png`) + オーバーレイ + framer-motion fadeIn、「シミュレーションを始める」ボタンでゲーム開始
- **ゲーム画面**: ボタンのみ（YES/NO）で選択、framer-motionのドラッグは削除済み
- **ゲージ**: operation（稼働力）, morale（士気）, compliance（コンプライアンス）— CSS transitionでアニメーション
- **遅延ペナルティ**: 特定ターンで発動するペナルティ（DelayAlertモーダルで通知）
- **ゲームオーバー/クリア画面**: 最終ゲージ表示、総合評価（S/A/B/C）、結果保存・実地監査ボタン
- **ゲスト対応**: 全問プレイ可、「結果を保存」ボタンで RegisterModal（登録/ログイン誘導）
- **重複カード対策**: `turn_order` でソート後、同一 `turn_order` の重複を排除するフィルタ付き

#### 管理画面 `src/app/admin/simulation/`
- `page.tsx` — サーバーコンポーネント
- `src/components/admin/SimulationCardAdmin.tsx` — カード・エフェクト・設定のCRUD

#### ミドルウェア `src/lib/supabase/middleware.ts`
- `/business/simulation` はゲストアクセス可（AUTH_REQUIRED_PATHS に含まれない）
- AUTH_REQUIRED_PATHS: `/business/mypage`, `/worker/mypage`, `/admin` のみ

#### 既知の注意点
- シード SQL（`00024`）を複数回実行すると同一 turn_order のカードが重複する（コード側で排除済みだが、DB側も `DELETE` で清掃推奨）
- framer-motion はイントロ画面のアニメーションのみで使用（ドラッグ/スワイプは削除済み）

---

### 管理画面（CMS）実装状況

#### ページ一覧 `src/app/admin/`

| ページ | パス | コンポーネント | 完成度 |
|---|---|---|---|
| ダッシュボード | `/admin` | DB駆動カードグリッド | ✅ |
| サイドバー | `layout.tsx` | DB駆動ナビ | ✅ |
| グローバル設定 | `/admin/settings` | ThemeEditor | ✅ |
| Business設定 | `/admin/settings/business` | ThemeEditor + NavigationEditor + ContentBlockEditor | ✅ |
| Worker設定 | `/admin/settings/worker` | 同上 | ✅ |
| ブログ | `/admin/blog` | BlogAdmin（一覧+Markdownエディタ+タグ+カテゴリ+ピン+AIカバー画像） | ✅ |
| ニュース | `/admin/news` | NewsAdmin（3タブ: ソースCRUD / 記事閲覧+ピン / 独自記事閲覧） | ⚠️ |
| 診断 | `/admin/diagnosis` | DiagnosisAdmin（カテゴリ+質問フルCRUD） | ✅ |
| 翻訳 | `/admin/translations` | TranslationsAdmin（インライン編集+キャッシュクリア） | ✅ |
| ホワイトペーパー | `/admin/whitepapers` | WhitepapersAdmin（フルCRUD、Markdown本文、DL URL） | ✅ |
| 助成金 | `/admin/subsidies` | SubsidiesAdmin（フルCRUD、ステータス/金額/締切） | ✅ |
| トレンド | `/admin/trends` | TrendsAdmin（3タブ: ソース / ウィジェット / インサイト記事） | ✅ |
| シミュレーション | `/admin/simulation` | SimulationCardAdmin（カード+エフェクト+設定CRUD） | ✅ |

#### コンポーネント `src/components/admin/`
- `ThemeEditor.tsx` — ライブCSS変数エディタ（カラーピッカー+hex入力）
- `ContentBlockEditor.tsx` — テキスト/コンテンツブロック編集
- `NavigationEditor.tsx` — ナビリンク編集（label, href, icon, sort_order, is_active）
- `SimulationCardAdmin.tsx` — シミュレーションカード・エフェクト・設定のCRUD（**現行使用**）
- `SimulationAdmin.tsx` — **デッドコード**（旧 `simulation_params` 用、削除推奨）
- `DiagnosisAdmin.tsx` — 診断カテゴリ+質問CRUD
- `NewsAdmin.tsx` — RSSソース+記事ピン+独自記事（読み取り専用）
- `TranslationsAdmin.tsx` — ui_translationsインライン編集+キャッシュクリア
- `WhitepapersAdmin.tsx` — ホワイトペーパーCRUD
- `SubsidiesAdmin.tsx` — 助成金CRUD
- `TrendsAdmin.tsx` — トレンドソース+ウィジェット+インサイト記事
- `blog/BlogAdmin.tsx` — ブログ管理シェル（一覧/エディタ切替）
- `blog/BlogPostList.tsx` — フィルタ付き記事一覧（ステータス/ピン/削除）
- `blog/BlogPostEditor.tsx` — Markdownエディタ（タグ、カテゴリ、AIカバー画像生成）
- `blog/MarkdownPreview.tsx` — ReactMarkdown + remark-gfm プレビュー（公開ページでも共用）

#### Articles関連テーブル（3系統）

| 系統 | テーブル | 型名 | 管理画面の状態 |
|---|---|---|---|
| ブログ記事 | `blog_posts` + `blog_tags` + `blog_post_tags` + `blog_categories` | `BlogPost`, `BlogTag`, `BlogPostTag`, `BlogCategory` | ✅ フルCRUD |
| ニュース記事 | `news_articles` + `news_sources` | `NewsArticle`, `NewsSource` | ⚠️ 閲覧+ピンのみ（編集不可） |
| 独自記事 | `editorial_articles` | `EditorialArticle` | ❌ 読み取り専用（作成・編集UIなし） |

#### 既知のギャップ（TODO）
1. **`editorial_articles` の作成・編集UIがない** — NewsAdmin の3タブ目は読み取り専用
2. **RSSスクレイパーが未実装** — `/api/news/scrape/route.ts` は TODO プレースホルダー
3. **`/api/blog/generate-cover` が存在しない** — BlogPostEditor が参照しているがAPIルート未作成
4. **`SimulationAdmin.tsx` がデッドコード** — 旧テーブル用、削除推奨
5. **ニュース記事詳細ページがスタブ** — `/business/news/[articleId]/page.tsx` は「開発中」表示

---

## 2026-02-23

### /business トップページ全面リニューアル

#### ページ構成 `src/app/business/page.tsx`
ヒーロー → 数字セクション → 選ばれる理由 → コンサルティングの流れ → 3本柱カード → サポートツール → 深掘り記事 → フッター

#### ヒーローセクション
- 大見出し:「あなたの会社の外国人雇用を、もう一段階先へ。」
- 中見出し:「グローバル人材の熱量(Glow)を、日本の新たな成長力(Grow)に。」
- 英語サブ:「Japan and Global: Talent Glowing and Growing Together」（最小・控えめ）
- 背景画像: `/images/hero-1.png`、テーマカラーはDB(`theme_config`)から取得

#### 数字で語るセクション
- 背景 `#f8fafc`、数字色 `#1a2f5e`（ネイビー）
- 230万人 / 60.5% / 1,100万人

#### 選ばれる理由セクション
- 背景 `#ffffff`、glassカード3枚（制度情報 / ツール / 伴走型サポート）
- リンクなし（クリッカブルにしない）、コンパクトサイズ

#### コンサルティングの流れセクション
- 背景 `#f8fafc`、3ステップ（現状診断 → 課題特定 → 実行支援）
- 矢印付き、ステップラベルはゴールド `#c9a84c`

#### 3本柱カード（メインコンテンツ）
- 見出し:「あなたの状況に合わせてお選びください」
- 背景 `#ffffff`、各カード上部にカバー画像（200px, object-cover, hover時ズーム）
- カードデータ（TSXハードコード）:

| カード | 画像 | リンク | 外部 |
|---|---|---|---|
| はじめての外国人雇用 | `/images/card-hiring.png` | `https://first-foreign-hiring-guide.vercel.app/business/hiring-guide` | ✅ |
| 外国人スタッフをもっと活かすために | `/images/card-existing.png` | `/business/existing-users` | ❌ |
| 育成就労ロードマップ | `/images/card-roadmap.png` | `https://html-lake-rho.vercel.app/` | ✅ |

#### サポートツール
- 背景 `#f8fafc`

| ツール | リンク | 状態 |
|---|---|---|
| 外国人雇用コストシミュレーター | `https://costsimulation.vercel.app/` | 外部リンク |
| 育成就労・特定技能 全19分野 解説 | `https://html-lake-rho.vercel.app/industry` | 外部リンク |
| 助成金活用 | — | グレーアウト（準備中） |

#### 深掘り記事
- 背景 `#ffffff`、3枚の外部リンクカード（すべて `target="_blank"`）
- 日本の労働力不足の現実 / 外国人採用の最新動向 / 外国人雇用の正直ガイド
- リンク先: `https://first-foreign-hiring-guide.vercel.app/business/hiring-guide/*`

#### セクション共通デザインルール
- 背景色は交互: `#f8fafc` → `#ffffff` → `#f8fafc` → ...
- 各セクション上部に `border-top: 1px solid #e2e8f0`
- 外部リンクはすべて `target="_blank" rel="noopener noreferrer"`

#### 画像ファイル
- `public/images/card-hiring.png` — `picture/4.png` からコピー
- `public/images/card-existing.png` — `picture/8.png` からコピー
- `public/images/card-roadmap.png` — `picture/11.png` からコピー

---

### ナビゲーション修正

#### BusinessHeader.tsx `src/components/business/BusinessHeader.tsx`
- **主要機能メニュー** (`featureHrefs`): `/business/simulation`, `/business/diagnosis`, `/business/ikusei`, `/business/existing-users`
- **リソースメニュー** (`resourceHrefs`): `/business/subsidies`, `/business/trends`
- ホワイトペーパー (`/business/whitepapers`) をリソースから削除

#### マイグレーション `00028_update_business_navigation.sql`
- `navigation_items` の `/business/whitepapers` を `is_active=false` に
- `/business/existing-users` を `business_header` セクションに追加
- **Supabase SQL Editorで要実行**

---

### フッター修正 `src/components/common/Footer.tsx`

#### 構成変更
- 2カラム構成（ブランド説明 + 企業の方リンク）
- **働く方列を完全削除**
- **クロスリンク（「外国人労働者の方はこちら →」）を削除**
- リンクはハードコード（DB navigation_items に依存しない）

#### 企業の方リンク一覧
| ラベル | リンク | 外部 |
|---|---|---|
| 企業向けトップ | `/business` | ❌ |
| はじめての外国人雇用 | `https://first-foreign-hiring-guide.vercel.app/business/hiring-guide` | ✅ |
| 外国人スタッフをもっと活かすために | `/business/existing-users` | ❌ |
| 育成就労ロードマップ | `https://html-lake-rho.vercel.app/` | ✅ |
| 外国人雇用コストシミュレーター | `https://costsimulation.vercel.app/` | ✅ |
| 外国人雇用の無料適正診断 | `/business/diagnosis` | ❌ |

---

### トップページ（/）`src/app/page.tsx`
- gitコミット済みの元の状態を維持（`git checkout HEAD` で復元済み）
- 企業向け（/business）と働く方向け（/worker）の2分岐ポータル
- DB駆動: `content_blocks`(page='top') + `theme_config`(business/worker/global)

---

### マイグレーション実行済み
- `00027_cleanup_top_page_content.sql` — content_blocks の旧トップページデータ整理
- `00028_update_business_navigation.sql` — ナビゲーション更新（ホワイトペーパー非表示 + existing-users追加）

---

## 言語対応方針
- /worker 側：11言語対応済み（テキスト直書き禁止・辞書JSON必須）
- /business 側：日本語のみ（テキスト直書きOK）
- /トップページ：日本語のみ

---

## 2026-02-23（追記）

### 特定技能移行チェッカー `/business/existing-users/ladder/checker`

#### 概要
5問のウィザード形式で外国人スタッフの在留資格・業種・経験を診断し、移行ロードマップと企業ToDoを生成するツール。

#### ファイル構成
- `src/app/business/existing-users/ladder/checker/page.tsx` — サーバーコンポーネント（metadata + MigrationChecker呼び出し）
- `src/components/business/MigrationChecker.tsx` — クライアントコンポーネント（全ロジック・UIを内包、DB依存なし）

#### STEP構成（動的5問 or 4問）

| STEP | 質問 | 選択肢数 | 備考 |
|---|---|---|---|
| 1 | 業種 | 8 | グリッド表示 |
| 2 | 在留資格 | 7 | `VisaPath`判定（ikusei/tokutei1/other） |
| 3 | 在日年数 | 4 | リスト表示 |
| 4 | 日本語レベル | 5 | リスト表示 |
| 5 | 試験準備状況 | 4 | **STEP2の回答で動的に変化（3パターン）** |

#### STEP5の動的パターン（`Step5Pattern`）

```typescript
type Step5Pattern = 'ikusei' | 'tokutei1' | 'skip';
```

| パターン | 対象在留資格 | STEP5の質問 | 選択肢 |
|---|---|---|---|
| `ikusei` | 育成就労（早期/後期） | 特定技能1号の試験準備は？ | not_started / japanese_only / exam_only / both_passed |
| `tokutei1` | 特定技能1号 | 特定技能2号に向けた準備は？ | no_plan / leader_assigned / leader_with_doc / exam_preparing |
| `skip` | 技人国/留学生/特定活動/不明 | **STEP5をスキップ** | — （STEP4→結果画面へ直接遷移） |

- `skip`の場合: `totalSteps=4`、進捗バー `STEP 4/4` → 結果画面
- `ikusei`/`tokutei1`の場合: `totalSteps=5`（従来通り）

#### 結果画面の分岐（`DiagnosisResult`）

```typescript
type DiagnosisResult =
  | { kind: 'other'; data: OtherVisaData }    // 技人国・留学生・特定活動・不明
  | { kind: 'standard'; data: CheckerResult }  // 育成就労・特定技能1号
```

**other パス**: 在留資格ごとのオプションカード + 企業ToDo（アコーディオン）
**standard パス**: ロードマップタイムライン + 試験情報 + 逆算スケジュール + 企業ToDo（アコーディオン）+ 業界別戦略カード（tokutei1のみ）

#### tokutei1 × STEP5回答別の結果分岐

| STEP5回答 | urgency | ヘッドライン | 特記事項 |
|---|---|---|---|
| `no_plan` | high | 特定技能2号への準備を今すぐ始めてください | 全ToDo表示 |
| `leader_assigned` | high | 辞令の未発行が最大のボトルネックです | 警告バナー + 辞令発行が最優先ToDo |
| `leader_with_doc` | medium | 着実に前進しています | 試験準備フォーカス |
| `exam_preparing` | low | あとは2号試験に合格するのみです | 試験日程確認がurgent昇格 |

#### ToDoセクション（アコーディオン）
- `TodoItem`型: `{ text, priority: 'urgent'|'normal', detail: { why, how[], watch_out?, timeframe? } }`
- 各Todoをクリックで展開/折り畳み（`AnimatePresence`）
- チェックボックスとアコーディオンは独立した操作

#### 業界別戦略カード（`StrategyCard`）
- `result.visaStatus === 'tokutei1'` の場合のみ表示
- 8業種分のデータ（`STRATEGY_BY_INDUSTRY`）
- 介護は特別見出し「介護分野で長期就労を実現するための戦略」
- 内容: サマリー → 最大の壁 → 合格率を上げる戦略 → 年別アクションプラン → 合格者パターン

#### 相談CTAセクション（`ConsultCTA`）
- **最上部**: J-GLOW相談カード（ネイビーグラデーション背景 + ゴールドボタン「J-GLOWに無料相談する →」）
- **区切り線**:「または専門家に直接相談」
- **パートナーカード**: 監理団体・行政書士の2カラム（`consultType`で表示順を変更）
- **注釈**: 「将来的にJ-GLOW登録パートナーの一覧からご紹介予定」

#### 主要サブコンポーネント
- `ProgressBar` — 動的 totalSteps 対応
- `RoadmapTimeline` — ステータス別スタイル（done/current/next/future）
- `TodoSection` — urgent/normal 分類 + アコーディオン
- `ExamInfoCard` — 業種別試験情報（難易度・合格率・頻度・日本語注意点）
- `TimelineCard` — 逆算スケジュール（フェーズ別月数）
- `StrategyCard` — 業界別2号取得戦略（tokutei1のみ）
- `ConsultCTA` — J-GLOW + パートナー相談導線
- `OtherVisaResultScreen` — other パス結果画面
- `StandardResultScreen` — standard パス結果画面

---

## 2026-02-23（追記2）

### キャリアラダー記事セクション `/business/existing-users/ladder`

#### 概要
外国人材のキャリアステージ（Stage 1〜4）に応じた企業向けコンテンツハブ。`blog_posts` テーブルから記事を取得し、動的 `[slug]` ルートで表示。

#### ファイル構成
- `src/components/business/LadderContentGrid.tsx` — ステージ別コンテンツカード（タブフィルタ付き）
- `src/app/business/existing-users/ladder/[slug]/page.tsx` — 記事詳細ページ（Supabase `blog_posts` から取得）
- `src/components/business/ArticleContent.tsx` — ReactMarkdown + remarkGfm でMarkdown本文をレンダリング
- `scripts/seed-ladder-articles-2.sql` — 記事シードSQL（4記事INSERT + 1記事UPDATE）
- `scripts/insert-article-svgs.sql` — 記事本文にSVG図解を挿入するSQL

#### コンテンツカード一覧（LadderContentGrid.tsx）

| ID | Stage | slug（DB） | 状態 |
|---|---|---|---|
| ojt | Stage 1 | `ojt-design-first-3months` | published（リダイレクト経由） |
| arrival | Stage 1 | `arrival-checklist` | published |
| roadmap | Stage 2 | `tokutei-roadmap-3years` | published（リダイレクト経由） |
| exam | Stage 2 | `exam-support` | published |
| tokutei1-exam | Stage 3 | `exam-support-1go` | published |
| visa-change | Stage 3 | `documents-checklist` | published |
| retention | Stage 4 | `core-talent-management` | published |

#### 記事詳細ページ `[slug]/page.tsx`
- 背景色: `#f8fafc`（白カードなし、直接表示）
- ヒーロー: ネイビーグラデーション（`#1a2f5e` → `#0f1d3d`）
- パンくず: 企業向けトップ / 外国人スタッフを活かす / 育てる / 記事タイトル
- 本文: `.la-body` CSSクラスでスタイリング（h2金線、h3左ボーダー、テーブル、blockquote等）
- フッターナビ: 「コンテンツ一覧に戻る」+「移行チェッカーを使う」

#### SVG図解（`public/images/articles/`）

| ファイル | 対象slug | 内容 |
|---|---|---|
| `article_ojt_steps.svg` | `ojt-design-first-3months` | OJT 3ステップ図 |
| `article_arrival_timeline.svg` | `arrival-checklist` | 受入れ準備タイムライン |
| `article_roadmap_3years.svg` | `tokutei-roadmap-3years` | 3年間ロードマップ |
| `article_tokutei2_exam.svg` | `exam-support` | 特定技能2号試験 分野別概要 |
| `article_tokutei1_exam.svg` | `exam-support-1go` | JFT-Basic vs JLPT 比較 |
| `article_status_change_flow.svg` | `documents-checklist` | 在留資格変更申請フロー |
| `article_career_ladder.svg` | （未使用） | キャリア・処遇ロードマップ |

#### Next.js リダイレクト（`next.config.ts`）

| source | destination | 用途 |
|---|---|---|
| `/business/existing-users/ladder/ojt-design-first-3months` | `/business/existing-users/ladder/ojt-checklist` | 旧slug→新slug |
| `/business/existing-users/ladder/tokutei-roadmap-3years` | `/business/existing-users/ladder/roadmap-y2` | 旧slug→新slug |
| `/business/existing-users/ladder/tokutei2-exam-company-support` | `/business/existing-users/ladder/exam-support` | 旧slug→新slug |

#### シードSQL `scripts/seed-ladder-articles-2.sql`
- `blog_categories` に `sodateru-stage3`, `sodateru-stage4` を追加
- `blog_posts` の `tokutei2-exam-company-support` タイトル変更
- 4記事INSERT（`ON CONFLICT (slug) DO UPDATE SET`）:
  - `arrival-preparation-checklist` — 受入れ準備チェックリスト
  - `tokutei1-exam-company-support` — 特定技能1号試験サポート
  - `status-change-documents-checklist` — 在留資格変更申請書類
  - `tokutei2-core-talent-management` — 中核人材の処遇設計
- PostgreSQL `$body$...$body$` ドル引用符でMarkdown本文を格納

#### SVG挿入SQL `scripts/insert-article-svgs.sql`
- 6記事の `body` に `replace()` / `regexp_replace()` でSVG画像参照を挿入
- 対象slug: `ojt-design-first-3months`, `arrival-checklist`, `tokutei-roadmap-3years`, `exam-support`, `exam-support-1go`, `documents-checklist`
- 確認クエリ付き（SVG挿入済みかどうかチェック）
- **Supabase SQL Editorで要実行**

---

## 2026-02-24

### 多言語現場指示書ビルダー v3 全面更新 `/business/existing-users/connect/templates`

#### 概要
現場指示書ビルダーを全面刷新。8言語→5言語に絞り、業種フィルタ・選択上限5・フレーズ選択式・2カラムレイアウト・ひらがな欄を追加。

#### 変更ファイル
- `src/lib/templateData.ts` — **全面書き換え**（新データ構造）
- `src/components/business/TemplateBuilder.tsx` — **全面書き換え**（2カラムUI）
- `src/app/business/existing-users/connect/templates/page.tsx` — metadata更新（8言語→5言語）
- `src/components/business/ConnectTemplateBanner.tsx` — テキスト更新（7言語→5言語）

#### 対応言語（5言語、旧8言語から絞り込み）
`ja`（日本語）, `vi`（ベトナム語）, `id`（インドネシア語）, `en`（英語）, `my`（ミャンマー語）

- 削除した言語: `tl`（フィリピン語）, `zh`（中国語）, `ne`（ネパール語）

#### データ構造 `src/lib/templateData.ts`

**型定義**:
```typescript
type Language = 'ja' | 'vi' | 'id' | 'en' | 'my';
type Industry = 'all' | 'manufacturing' | 'care' | 'food' | 'retail' | 'logistics' | 'construction';
type RuleItem = {
  id: string;
  industries: Industry[];
  ja: string; vi: string; id_lang: string; en: string; my: string;
  params?: ParamDef[];
  usesSupervisorName?: boolean;
};
```

- `id_lang` キー: インドネシア語（`id` はアイテム識別子と衝突するため）
- `industries[]`: 業種フィルタ用タグ
- `params`: `__key__` プレースホルダー方式（旧 `paramTemplates` 関数を廃止）
- `usesSupervisorName`: `__supervisor__` プレースホルダー

**データ配列**:

| 配列 | 件数 | ID範囲 | 備考 |
|---|---|---|---|
| `SAFETY_RULES` | 16 | S01–S16 | S15: 化学物質、S16: 足場（新規） |
| `EMERGENCY_RULES` | 8 | E01–E08 | E08: 同僚不明（新規） |
| `DAILY_RULES` | 12 | D01–D12 | D11: 道具確認、D12: タイムカード（新規） |
| `PHRASES` | 12 | P01–P12 | 全12フレーズ選択式（旧: 固定4フレーズ） |
| `LANGUAGES` | 5 | — | flag + label |
| `INDUSTRIES` | 7 | — | all含む |
| `UI` | 5言語 | — | 印刷用ラベル（title, section名, 会社欄等） |

**パラメータ付き項目**:
- S05: `__weight__`kg / `__people__`人
- D01: `__minutes__`分
- D02: `__hour__`時

**担当者名付き項目**:
- D07: `__supervisor__` → ふりがな優先、未入力時は「担当者」

#### TemplateBuilder.tsx の構成

**レイアウト**: 2カラム（デスクトップ1024px以上）
- 左: コントロール（STEP 1〜4、no-print）
- 右: ライブプレビュー（sticky、印刷対象）

**STEP構成**:
1. 言語を選ぶ — 5個のフラグボタン（active = navy背景 + 白文字）
2. 業種を選ぶ — 7個のピルボタン（active = ゴールドハイライト）、★ソートに影響
3. 項目を選ぶ — 安全/緊急/毎日（各最大5）+ よく使う言葉（上限なし）
4. 会社情報を入力 — 会社名・担当者漢字・担当者ふりがな・電話番号・緊急連絡先

**業種フィルタのソートロジック**:
- ★ 業種マッチ項目 → 先頭表示
- `'all'` 汎用項目 → 通常表示
- 非マッチ項目 → `opacity: 0.4` で末尾表示

**選択上限**:
- 安全/緊急/毎日: 最大5（カウンター `2/5 選択中`、上限時ゴールド警告バナー）
- フレーズ: 制限なし

**バイリンガル表示**: 非ja選択時、チェックボックス横とプレビュー内に小さいグレーで日本語テキスト表示

**ヘルパー関数**:
- `getLangText(item, lang)` — `id` 言語の場合 `item.id_lang` を返す
- `getItemText(item, lang, paramValues, companyInfo)` — `__key__`/`__supervisor__` を解決
- `sortByIndustry(items, industry)` — ★ 先頭ソート
- `getRelevance(item, industry)` — `'match'`/`'all'`/`'other'` 判定

**印刷CSS**: `@media print` で左カラム非表示、A4 portrait、8mm margins

#### v2 → v3 差分まとめ

| 項目 | v2（旧） | v3（新） |
|---|---|---|
| 言語数 | 8 | 5 |
| 業種フィルタ | なし | 7業種（★ソート） |
| 選択上限 | 4/セクション | 5/セクション |
| フレーズ | 固定4個 | 12個から選択（上限なし） |
| レイアウト | 1カラム | 2カラム（左:操作 / 右:プレビュー） |
| ふりがな欄 | なし | あり（担当者ふりがな） |
| パラメータ方式 | `paramTemplates` 関数 | `__key__` プレースホルダー |
| データ構造 | `translations` ネスト | フラット per-language キー |

---

### ブログ記事システム `/business/blog/[slug]`

#### 概要
`blog_posts` テーブルから記事を取得し、slug ベースの動的ルートで表示。フルHTML記事とMarkdown記事の両方に対応。

#### ファイル構成
- `src/app/business/blog/[slug]/page.tsx` — 記事詳細ページ（レンダリング方式の自動判別）
- `src/components/business/ArticleContent.tsx` — ReactMarkdown + remarkGfm + rehypeRaw でMarkdown/軽量HTML本文をレンダリング
- `scripts/insert-3-articles.mjs` — Node.jsスクリプトでSupabaseにHTML記事を投入

#### レンダリング方式の自動判別
- bodyが `<style>` で始まる → **フルHTML記事**: `dangerouslySetInnerHTML` で直接レンダリング（自前のヘッダー・スタイル・レイアウトを持つ）
- それ以外 → **Markdown/軽量HTML記事**: ブログページのヒーロー＋ `.blog-body` ラッパー内で `ArticleContent`（ReactMarkdown）を使用

#### フルHTML記事（3記事）

| slug | タイトル | HTMLソース | 内容 |
|---|---|---|---|
| `why-workers-leave` | 外国人材が辞める本当の理由——在留資格別に見る離職の構造 | `docs/article_why_workers_leave.html` | 離職率データ・ドーナツチャート・棒グラフ・サインカード |
| `fair-wage-guide` | 外国人材の給与設定ガイド——同等待遇の義務と定着につながる昇給設計の実務 | `docs/article_fair_wage_guide.html` | 賃金比較バーチャート・法的義務タイムライン・昇給ステップフロー |
| `career-ikusei-tokutei` | 育成就労から特定技能1号・2号、そして永住へ——企業が伴走するキャリア支援の全体像と実務 | `docs/article_career_ikusei.html` | キャリアフローSVG・カウントアップ・日本語レベルバー |

#### HTML記事の構造（共通パターン）
- `<style>` ブロック（CSS変数・コンポーネントスタイル・アニメーション定義）
- `.article-header`（ヒーロー: ネイビーグラデーション + カテゴリタグ + タイトル + メタ）
- `.content-wrap`（本文: max-width 820px）
- `.summary-box`（まとめ: ネイビーグラデーション背景）
- `<script>`（IntersectionObserver によるアニメーション: 棒グラフ、カウントアップ等）

#### author_id
- `7bb78a5a-da02-469f-b81c-5d9243b52397`

#### 投入スクリプト `scripts/insert-3-articles.mjs`
- HTMLファイルから `<style>` + `<body>` 内コンテンツを抽出
- Supabase JS client（サービスロールキー）で upsert（`onConflict: 'slug'`）
- 実行: `SUPABASE_SERVICE_ROLE_KEY=... node scripts/insert-3-articles.mjs`

#### ミドルウェア
- `/business/blog/*` はゲスト公開（`AUTH_REQUIRED_PATHS` に含まれない）

#### 依存パッケージ
- `rehype-raw` — HTMLタグをReactMarkdown内でレンダリング（package.json に追加済み）

---

## 2026-02-25

### 「続ける・判断する」記事ルート `/business/existing-users/continue/[slug]`

#### 概要
`/business/blog/[slug]` と同じフルHTML記事を `/business/existing-users/continue/[slug]` でも表示できるように対応。サイト内リンク（ContinueContentGrid等）が `/business/existing-users/continue/*` を向いているため、同一記事を両ルートからアクセス可能にした。

#### 変更ファイル
- `src/app/business/existing-users/continue/[slug]/page.tsx` — フルHTML記事の分岐を追加

#### 変更内容
- bodyが `<style>` で始まる場合、`dangerouslySetInnerHTML` で直接レンダリングする分岐を追加（`/business/blog/[slug]/page.tsx` と同じロジック）
- それ以外のMarkdown記事は従来通り `.la-body` ラッパー + `ArticleContent` でレンダリング

#### 対象記事（フルHTML、`blog_posts` テーブルから取得）

| slug | タイトル | アクセスURL |
|---|---|---|
| `why-workers-leave` | 外国人材が辞める本当の理由 | `/business/existing-users/continue/why-workers-leave` |
| `fair-wage-guide` | 外国人材の給与設定ガイド | `/business/existing-users/continue/fair-wage-guide` |
| `career-ikusei-tokutei` | 育成就労から特定技能1号・2号、そして永住へ | `/business/existing-users/continue/career-ikusei-tokutei` |

#### 記事の表示ルート一覧（同一記事が2ルートからアクセス可能）
- `/business/blog/[slug]` — ブログ記事ルート（汎用）
- `/business/existing-users/continue/[slug]` — 「続ける・判断する」セクションルート（パンくず・フッターナビが異なる）

---

### 「もっと詳しく知りたい方へ」セクション カード型リニューアル

#### 概要
`/business` トップページの「もっと詳しく知りたい方へ」セクションを、テキストリンク3本からグラデーションヘッダー付きカード3枚に変更。

#### 変更ファイル
- `src/app/business/page.tsx` — 深掘り記事セクションをカード型UIに差し替え、不要な `articles` 配列を削除

#### カード構成

| カード | ヘッダー数字 | グラデーション | カテゴリラベル | リンク先 |
|---|---|---|---|---|
| 日本の労働力不足の現実 | 1,100万人 | navy→blue (`#1a2f5e`→`#2a4a8e`) | データで見る | `hiring-guide/labor-shortage` |
| 外国人採用の最新動向 | 284,466人 | green (`#2a6e4e`→`#3a8e6e`) | トレンド | `hiring-guide/trends` |
| 外国人雇用の正直ガイド | 離職率16.1% | brown→gold (`#7a3a1e`→`#c9a84c`) | 正直に書きます | `hiring-guide/honest-guide` |

#### デザイン仕様
- 背景: `#f8fafc`（サポートツールセクションと同系統）
- カード: 白背景 + `border-gray-200` + `rounded-xl` + hover時shadow
- ヘッダー部: h-36、グラデーション背景、中央に数字（白太字）+ サブテキスト
- ボディ部: カテゴリラベル（ゴールド `#c9a84c`）+ タイトル（hover時underline）+ 説明文
- 全カード `target="_blank"` 外部リンク（`first-foreign-hiring-guide.vercel.app`）

---

### 正直ガイドにポジティブコンテンツ追記（外部プロジェクト）

#### 概要
`first-foreign-hiring-guide` プロジェクトの正直ガイドページに、定着成功パターンと企業の声セクションを追加。

#### 変更ファイル（外部プロジェクト）
- `/mnt/c/Users/takak/Claude_code_project/first-foreign-hiring-guide/src/app/business/hiring-guide/honest-guide/page.tsx`

#### 追加位置
「外国人は本当に"すぐ辞める"のか？」セクションの後、「締めセクション」の前

#### 追加コンテンツ

**「定着に成功している企業に共通すること」** — 3カラムカード
1. 入国後3ヶ月に投資する
2. キャリアパスを入社時に見せる
3. 相談できる人を作る

**「長期雇用した企業に起きた変化」** — 3つの企業事例カード
- 製造業（従業員50名・特定技能1号3名）— マニュアル整備の副次効果
- 農業（従業員12名・育成就労2名）— 5年目スタッフが教育側に
- 介護施設（従業員35名・特定技能1号5名）— 利用者との信頼関係

**まとめボックス** — amber背景、「準備した企業にとっては継続的な採用力の強化」

#### デプロイ
- j-glow: https://j-glow.vercel.app
- first-foreign-hiring-guide: https://first-foreign-hiring-guide.vercel.app

---

## 2026-02-26

### 「続ける・判断する」セクション 5記事追加 `/business/existing-users/continue/[slug]`

#### 概要
`/business/existing-users/continue/` セクションにリッチHTML記事を5本追加。既存3記事と合わせて計8記事体制に。

#### 追加ファイル
- `docs/article_position_upgrade.html` — 昇格設計
- `docs/article_career_gijinkoku.html` — 技人国への転換
- `docs/article_career_student.html` — 進学・留学ビザへの転換
- `docs/article_visa_renewal.html` — 在留資格更新と会社の義務
- `docs/article_compliance_violations.html` — コンプライアンス違反の防止
- `scripts/insert-5-continue-articles.mjs` — 投入スクリプト

#### 記事一覧（全8記事）

| slug | テーマ | アニメーション | 新規/既存 |
|---|---|---|---|
| `why-workers-leave` | 離職の構造 | ドーナツチャート・棒グラフ・サインカード | 既存 |
| `fair-wage-guide` | 給与設定ガイド | 賃金比較バーチャート・法的義務タイムライン | 既存 |
| `career-ikusei-tokutei` | キャリア支援の全体像 | カウントアップ・日本語レベルバー | 既存 |
| `position-upgrade` | 職種・ポジション変更・昇格設計 | 5段階昇格フロー（段階点灯） | 新規 |
| `career-gijinkoku` | 技人国への転換 | 3カード転換フロー（スライドイン） | 新規 |
| `career-student` | 進学・留学ビザへの転換 | 5ステップ変更タイムライン | 新規 |
| `visa-renewal-compliance` | 在留資格更新と会社の義務 | 6段階カウントダウン（色分け） | 新規 |
| `compliance-violations` | コンプライアンス違反の防止 | 違反件数カウントアップ + リスクレベル分類 | 新規 |

#### 共通仕様
- フルHTML記事（`<style>`で開始）→ `dangerouslySetInnerHTML` でレンダリング
- IntersectionObserver でスクロール時アニメーション発火
- ブランドカラー: ネイビー `#1a2f5e`、ゴールド `#c9a84c`
- 各記事に表1〜2個、チェックリスト、ハイライトボックス、まとめボックス
- author_id: `7bb78a5a-da02-469f-b81c-5d9243b52397`

#### 投入方法
```bash
SUPABASE_SERVICE_ROLE_KEY=... node scripts/insert-5-continue-articles.mjs
```

---

### 「こんなお悩み」セクション改修 `/business/existing-users`

#### 変更ファイル
- `src/components/business/BusinessHubPainCards.tsx` — 全面書き換え

#### アイコン変更

| お悩み | 旧アイコン | 新アイコン |
|---|---|---|
| 指示が伝わらない | `MessageCircleWarning` | `MessageSquareX` |
| やる気が見えない | `Battery` | `TrendingDown` |
| 在留資格の切替・更新が複雑 | `FileX2` | `FileQuestion` |
| せっかく育てても定着しない | `RotateCcw` | `UserMinus` |
| 管理体制が属人的で見えない | `EyeOff` | `EyeOff`（変更なし） |
| 制度変更でコストが不安 | `CircleDollarSign` | `CircleDollarSign`（変更なし） |

#### デザイン変更
- カード背景: `bg-white` + `border` → `bg-slate-50`（ボーダーなし）
- ホバー効果: `hover:border-[#c9a84c]/40 hover:shadow-lg` → **完全削除**（クリック不可を明示）
- アイコン背景: 角丸四角 → **円形** `rounded-full` + `bg-[#eef2ff]`
- タイトル色: `text-gray-900` → `#1a2f5e`（ネイビー）

#### 感情的訴求の追加（各タイル末尾にゴールド太字 `emphasis` フィールド）

| タイル | 追加フレーズ |
|---|---|
| 指示が伝わらない | 現場の生産性が30%低下するケースも |
| やる気が見えない | 離職の兆候は半年前から現れています |
| 在留資格の切替・更新が複雑 | 更新漏れは不法就労助長罪の対象に |
| せっかく育てても定着しない | 1人あたりの育成コストは平均80〜120万円 |
| 管理体制が属人的で見えない | 担当者の退職で全てが止まるリスク |
| 制度変更でコストが不安 | 2027年の育成就労制度で大幅変更予定 |

---

## 2026-02-27

### 労働条件通知書生成ツール `/business/tools/labor-notice`

#### 概要
外国人労働者向けの労働条件通知書（バイリンガルPDF）を8言語対応で無料生成できるウィザード型ツール。5ステップで入力→プレビュー→PDF生成。ゲスト利用可。

#### 対応言語（8言語）
ja（日本語）, en（英語）, zh（中国語）, vi（ベトナム語）, id（インドネシア語）, tl（タガログ語）, km（クメール語）, my（ミャンマー語）

#### ファイル構成

| ファイル | 役割 |
|---|---|
| `src/app/business/tools/labor-notice/page.tsx` | サーバーコンポーネント（metadata + LaborNoticeWizard呼び出し） |
| `src/app/business/tools/labor-notice/LaborNoticeWizard.tsx` | クライアントコンポーネント（ウィザード本体、ステップ管理） |
| `src/app/business/tools/labor-notice/types.ts` | 型定義 + VISA_CONFIGS + デフォルト値 |
| `src/app/business/tools/labor-notice/components/Step1Basic.tsx` | STEP1: 基本情報（氏名・会社名・住所・電話・使用者名） |
| `src/app/business/tools/labor-notice/components/Step2Contract.tsx` | STEP2: 契約・業務（在留資格・契約期間・更新条件・就業場所・業務内容） |
| `src/app/business/tools/labor-notice/components/Step3Hours.tsx` | STEP3: 勤務時間（始業終業・休憩・残業・休日・有給） |
| `src/app/business/tools/labor-notice/components/Step4Wages.tsx` | STEP4: 賃金・退職（基本給・手当・控除・締日支払日・社会保険） |
| `src/app/business/tools/labor-notice/components/Step5Review.tsx` | STEP5: 確認・PDF生成（全入力プレビュー + PDF生成ボタン） |
| `src/app/business/tools/labor-notice/pdf/LaborNoticePDF.tsx` | PDF生成コンポーネント（@react-pdf/renderer） |
| `src/lib/translations/labor-notice.json` | 翻訳辞書（8言語、全キー） |

#### 在留資格タイプ（`VisaType`）

| キー | ラベル | 契約デフォルト | 最大期間 | 転籍条項表示 |
|---|---|---|---|---|
| `ikusei` | 育成就労 | fixed | 3年 | ✅ |
| `tokutei1` | 特定技能1号 | fixed | 通算5年 | ❌ |
| `tokutei2` | 特定技能2号 | indefinite | 上限なし | ❌ |
| `ginou_jisshu` | 技能実習（経過措置） | fixed | 3年（団体監理型） | ❌ |

#### PDF構成（5条項、順次番号）

| 条項 | タイトル | 内容 | 条件 |
|---|---|---|---|
| 第1条 | 賃金控除に関する協定 | 労使協定に基づく賃金控除の定め | 常に表示 |
| 第2条 | 控除対象項目 | 家賃・食費等の具体的控除項目 | 常に表示 |
| 第3条 | 安全衛生 | 安全配慮義務・健康診断等 | 常に表示 |
| 第4条 | 転籍に関する条項 | 育成就労の転籍条件 | `transfer_clause === true` の場合のみ |
| 第5条 | 準拠法・管轄 | 日本法準拠・管轄裁判所 | 常に表示 |

#### フォントファイル（`public/fonts/`）

| ファイル | サイズ | 対応言語 | ソース |
|---|---|---|---|
| `NotoSansJP-Regular.otf` | 4.5MB | ja, en, vi, tl, pt, id | notofonts/noto-cjk GitHub |
| `NotoSansJP-Bold.otf` | 4.6MB | 同上（太字） | 同上 |
| `NotoSansSC-Regular.otf` | 8.3MB | zh | notofonts/noto-cjk GitHub |
| `NotoSansKhmer-Regular.ttf` | 102KB | km | Google Fonts gstatic |
| `NotoSansKhmer-Bold.ttf` | 103KB | km（太字） | 同上 |
| `NotoSansMyanmar-Regular.ttf` | 178KB | my | 同上 |
| `NotoSansDevanagari-Regular.ttf` | 215KB | ne（将来用） | 同上 |

#### フォント選択ロジック（`getFontFamily(lang)`）

| 言語 | フォントファミリー |
|---|---|
| zh | NotoSansSC |
| km | NotoSansKhmer |
| my | NotoSansMyanmar |
| ne | NotoSansDevanagari |
| その他（ja, en, vi, id, tl） | NotoSansJP |

#### 法的コンプライアンス対応

**絶対的明示事項（労基法第15条）**:
- 業務内容の変更の範囲（`job_description_change_range`）— Step2で入力
- 契約更新条件（`renewal_type`, `renewal_criteria`）— Step2で入力（更新上限回数・年数含む）
- 賃金控除項目（`deduction_rent`, `deduction_food`, `deduction_other`）— Step4で入力

**外国人労働者特有事項**:
- 賃金控除チェックボックス（家賃・食費・その他）— `deduction_agreement === 'yes'` 時に表示
- 無期転換リスク警告バナー — `ginou_jisshu` または `tokutei1` で有期契約の場合に Step2 末尾に表示
- 転籍条項（第4条）— 育成就労（`ikusei`）で `transfer_clause === true` の場合のみPDFに含む

**PDF空値ハンドリング**:
- 基本給が空/0: 「なし / None」表示
- 締日・支払日が空: 「（要入力）/ (Required)」表示
- 手当・控除が空配列: セクション非表示

#### ナビゲーション統合

- `src/components/business/BusinessHeader.tsx` — `featureHrefs` に `/business/tools/labor-notice` 追加
- `supabase/migrations/00029_add_labor_notice_nav.sql` — navigation_items テーブルに追加（**Supabase SQL Editorで要実行**）

#### 依存パッケージ
- `@react-pdf/renderer` — クライアントサイドPDF生成（dynamic import）
- `file-saver` — ブラウザ側blobダウンロード
- PDFファイル名: `労働条件通知書_{氏名}_{発行日}.pdf`

#### ミドルウェア
- `/business/tools/*` はゲスト公開（`AUTH_REQUIRED_PATHS` に含まれない）

---

### マイグレーション実行済み
- `00027` 〜 `00029` — 実行済み

---

## 2026-02-28

### 労働条件通知書 Phase 2 — 入管庁様式準拠 全面アップデート

#### 概要
入管庁の公式雇用条件書（参考様式第１－６号）を基準に、約27個の新フィールド/フィールドグループを追加。types.ts・翻訳JSON・全ステップフォーム・レビュー画面・PDF出力を一括対応。

#### types.ts 主要変更

**新型定義**:
- `SectorType` — 19分野（旧 `TokuteiSector` 12分野 → 拡張、後方互換エイリアス維持）
- `PaymentMethod` — `'bank_transfer' | 'cash'`

**新定数配列**:
- `IKUSEI_SECTORS` (17分野) / `TOKUTEI_SECTORS` (19分野) — `tKey` 付き翻訳対応
- `getSectorList(visaType)` — 在留資格に応じた分野リスト返却
- `WORKPLACE_RANGE_OPTIONS` / `JOB_RANGE_OPTIONS` / `RENEWAL_TYPE_OPTIONS` / `RENEWAL_CRITERIA_ITEMS` / `WAGE_TYPE_OPTIONS` — tKey 付き
- `WORK_HOUR_TYPE_OPTIONS` / `RAISE_TIMING_OPTIONS` / `BONUS_FREQUENCY_OPTIONS` — tKey 追加済み

**ユーティリティ関数**:
- `sanitizeName()` / `sanitizeAddress()` — XSS防止用入力サニタイズ
- `resolveWorkplaceRangeTx()` / `resolveJobRangeTx()` — 翻訳対応の範囲表示

**Step1Data 追加フィールド** (3):
`consultation_department`, `consultation_contact_person`, `consultation_contact_info`

**Step2Data 追加フィールド** (3):
`entry_date`, `tokutei_sector: SectorType | ''`（全在留資格で必須）, `tokutei_job_category`

**Step3Data 追加フィールド** (7):
`prescribed_hours_weekly/monthly/yearly`, `prescribed_days_weekly/monthly/yearly`, `overtime_article_number`

**Step4Data 追加フィールド** (18):
`overtime_rate_normal/over60/holiday/night`, `payment_method`, `fixed_overtime_enabled/name/amount/hours`, `deduction_tax_estimate/social_estimate/employment_estimate`, `work_stoppage_enabled/rate`, `dismissal_article_from/to`, `health_check_hire_month/periodic_month`

#### 翻訳JSON（`labor-notice.json`）
- 約100+キー追加（v4-final）
- 分野名19種、勤務時間タイプ5種、昇給タイミング4種、賞与頻度3種、範囲3種、支払方法2種、賃金タイプ3種、更新基準5種
- 署名欄キー8種（`signature_section_title` 〜 `signature_preset_note`）

#### PDF出力の改善

**中国語フォント対応**:
- `NotoSansSC-Regular.otf` (8.3MB) を追加
- `LANG_FONT` に `zh: 'NotoSansSC'` をマッピング
- 中国語PDF出力の文字化け解消

**BiRow 日本語サブ一律表示**:
- BiRow コンポーネントを `{valueJa ?? (value || '—')}` フォールバック方式に変更
- `lang !== 'ja'` 時、全 BiRow の value 下に日本語テキストが必ず表示される
- 翻訳値を持つ全 BiRow（yesNo、在留資格、分野、契約種別、割増率、支払方法、昇給、賞与、社保、組合 等）に明示的 `valueJa` 追加
- ユーザー入力値（会社名、住所等）はフォールバックで自動処理

**署名欄セクション追加**:
- 全条項・免責事項の後、最終ページ末尾に配置
- 使用者欄（会社名プリセット + 氏名線 + 印鑑丸枠 + 日付線）
- 労働者欄（労働者名プリセット + 氏名線 + 印鑑丸枠 + 日付線）
- 同意文・全ラベル8言語翻訳対応 + 日本語サブ表示
- `wrap={false}` でページ分割防止

**PDF条項構成（更新）**:

| 条項 | タイトル | 条件 |
|---|---|---|
| 第1条 | 在留資格・雇用契約の効力 | 常に表示 |
| 第2条 | 賃金控除 | 常に表示 |
| 第3条 | 退職・転籍時の費用取扱い | 常に表示 |
| 第4条 | 転籍に関する特約（育成就労）/ 転職・転籍事項（特定技能） | `transfer_clause === true` の場合のみ |
| 第5条 | 言語の優先順位 | 常に表示 |
| — | 署名欄 | 常に表示（条項外） |

#### Step2Contract.tsx 分野選択の変更
- 旧: tokutei1/tokutei2 の場合のみ分野選択を表示
- 新: 全在留資格で分野選択を表示（`getSectorList(visaType)` で動的リスト）
- `handleVisaChange` でビザ変更時に分野の有効性を検証

#### バリデーション変更
- `validateStep2`: `tokutei_sector` が全在留資格で必須に
- `validateStep4`: `dismissal_article_from` を代替チェック（`dismissal_article_number` との OR）

#### 入力サニタイズ
- `Step1CompanyWorker.tsx`: worker_name, company_name, company_address, employer_name に `sanitizeName`/`sanitizeAddress` 適用
- `<>&"'` 等の危険文字を除去

---

### 現場指示書ビルダー v4 アップデート `/business/existing-users/connect/templates`

#### 概要
v3（5言語）に中国語を追加して6言語化。印刷レイアウトの最適化、絵文字アイコン追加、緊急連絡先大型表示、フォント自動スケールを実装。

#### 対応言語（6言語、v3の5言語 + zh追加）
`ja`（日本語）, `vi`（ベトナム語）, `id`（インドネシア語）, `en`（英語）, `my`（ミャンマー語）, `zh`（中国語）

#### データ構造の変更 `src/lib/templateData.ts`

**型定義**:
```typescript
type Language = 'ja' | 'vi' | 'id' | 'en' | 'my' | 'zh';
type RuleItem = {
  id: string;
  icon?: string;          // v4で追加
  industries: Industry[];
  ja: string; vi: string; id_lang: string; en: string; my: string; zh: string;  // zhを追加
  params?: ParamDef[];
  usesSupervisorName?: boolean;
  jaRuby?: string;
  context?: Record<Language, string>;
};
```

**中国語追加範囲**:
- 全ルール（S01–S16, E01–E08, D01–D12）に `zh` 翻訳
- 全フレーズ（P01–P12）に `zh` 翻訳 + `context` レコードに `zh` キー
- `LANGUAGES` 配列に `{ code: 'zh', label: '中国語', flag: '🇨🇳' }`
- `UI` レコードに `zh` セクション（全ラベル）

**絵文字アイコン追加**:
- 安全ルール16件: ⚙️🚫🩹🦺🏋️🚜🙌🔪⚠️📍🪝⚡📦🚶☣️🪜
- 緊急ルール8件: 🩹🔧🔥🤒🫨💡☣️📢
- 毎日ルール12件: ⏰📞🙋🧹📵👔📋🗑️🤝🔒✅🕐

#### TemplateBuilder.tsx の変更

**新定数**:
- `FONT_MAP` / `FONT_URLS`: `zh` に `'Noto Sans SC'` + Google Fonts URL 追加
- `SUPERVISOR_GENERIC`: `zh: '负责人'`
- `TITLE_NO_COMPANY` / `TITLE_WITH_COMPANY`: `zh` 翻訳追加
- `EMERGENCY_CONTACT_LABEL`: 6言語の緊急連絡先ラベル
- `PHONE_LABEL`: 6言語の担当者直通ラベル
- `EMERGENCY_PHONE_LABEL`: 6言語の緊急連絡先ラベル

**選択上限の変更**:
- 安全ルール: `MAX_SAFETY = 7`（他セクションは `MAX_PER_SECTION = 5` のまま）

**絵文字アイコン表示**:
- `SectionCheckboxes`: チェックボックス横にアイコン表示
- `PreviewSection`: ナンバーバッジ/矢印の後にアイコン表示（`.rule-icon` クラス）

**緊急連絡先大型表示セクション**:
- 配置: 会社情報セクションの直下・フッター直上
- 表示条件: `companyInfo.phone` または `companyInfo.emergency` が入力済みの場合のみ
- デザイン: 赤枠（`#dc2626`）+ 赤背景（`#fef2f2`）
- 電話番号: 画面 1.3rem / 印刷 16pt、赤色太字
- 📞 / 🆘 アイコン付き

**フォント自動スケール（`handlePrint`）**:
- 選択済み総項目数に応じてフォント倍率を計算:

| 総選択項目数 | フォント倍率 |
|---|---|
| 〜10項目 | 1.4倍（最大） |
| 11〜15項目 | 1.2倍 |
| 16〜20項目 | 1.0倍（基準） |
| 21〜25項目 | 0.9倍 |
| 26項目以上 | 0.85倍（最小） |

- 別ウィンドウ印刷時に `.print-target { font-size: ${fontScale}em }` を動的注入

**印刷CSSの最適化（v3→v4）**:

| 項目 | v3 | v4 |
|---|---|---|
| `@page` margin | 10mm 12mm | 8mm 8mm |
| タイトル | 18pt | 13pt |
| セクション見出し | 10pt | 9pt |
| ルール項目 | 10pt | 9pt |
| 会社情報グリッド | 2列 | 3列 |
| フレーズコンテキスト | 表示 | `display: none`（印刷時非表示） |
| アイコン | — | 9pt |
| 緊急連絡先 | — | 16pt赤字 |

**別ウィンドウ印刷（`handlePrint`）**:
- `window.open()` で別ウィンドウを開き、全CSS + フォント + HTML を注入
- `document.fonts.ready.then()` でフォント読み込み後に `window.print()` → `window.close()`
- ブラウザヘッダー/URL/日時を除去
- ポップアップブロック時は `window.print()` にフォールバック

#### v3 → v4 差分まとめ

| 項目 | v3 | v4 |
|---|---|---|
| 言語数 | 5 | 6（+zh） |
| 絵文字アイコン | なし | 全36ルールに追加 |
| 安全ルール上限 | 5 | 7 |
| 緊急連絡先表示 | 会社情報欄内のみ | 大型赤枠セクション追加 |
| フォントスケール | 固定 | 項目数に応じて0.85〜1.4倍 |
| 印刷CSS | 大きめ | コンパクト（A4 1枚に収まるよう最適化） |
| 印刷方式 | `window.print()` | 別ウィンドウ（ヘッダー/URL除去） |
| ルールレイアウト | 固定2列 | CSS `columns: 2`（自然なフロー） |

---

## 2026-02-28（追記）

### パートナーディレクトリ `/business/partners`

#### 概要
外国人雇用に精通した監理団体・行政書士・登録支援機関を検索できるディレクトリ機能。スポンサー/メンバーの2プラン制。

#### DBテーブル（マイグレーション `00030_partners.sql`）
- **partners**: パートナー情報（name, type, plan, prefecture, industries[], visas[], languages[], origin_countries[], description, contact_email, website_url, is_active, sort_order）
- RLS: SELECT は `is_active=true` の全員、ALL は `is_admin()` のみ
- インデックス: `plan`, `prefecture`
- シードデータ: 3件（スポンサー2件 + メンバー1件）

#### 型定義 `src/types/database.ts`
- `PartnerType`: `'supervisory' | 'admin_scrivener' | 'support_org'`
- `PartnerPlan`: `'sponsor' | 'member'`
- `PARTNER_TYPE_LABELS`: 種別の日本語ラベル
- `PARTNER_PLAN_LABELS`: プランの日本語ラベル
- `Partner`: パートナー型

#### 公開ページ `src/app/business/partners/page.tsx`
- サーバーコンポーネント（partners全件取得 + theme）
- `PartnerDirectory` クライアントコンポーネントでフィルタ処理

#### PartnerDirectory `src/components/business/PartnerDirectory.tsx`
- **フィルター**: 種別（すべて/監理団体/行政書士/登録支援機関）+ 都道府県
- **スポンサーカード**: ゴールド `#c9a84c` の「SPONSOR」バッジ、大きめ2カラム、業種・ビザタグ付き
- **メンバーカード**: ネイビー `#1a2f5e` の「MEMBER」バッジ、コンパクト3カラム
- **問い合わせボタン**: `contact_email` あり → `mailto:`、なし → グレーアウト「準備中」
- **CTA**: ページ下部に掲載お問い合わせセクション

#### 管理画面 `src/app/admin/partners/page.tsx`
- サーバーコンポーネント（partners全件取得）
- `PartnersAdmin` クライアントコンポーネント

#### PartnersAdmin `src/components/admin/PartnersAdmin.tsx`
- パートナー一覧テーブル（法人名・種別・プラン・都道府県・順序・状態・操作）
- 追加・編集モーダル（全フィールド対応、配列はカンマ区切り入力）
- 削除（confirm付き）
- プラン切替（sponsor/member）— テーブル行のバッジクリック
- is_active切替 — テーブル行の状態バッジクリック
- sort_order変更 — モーダル内で編集

#### ナビゲーション
- `BusinessHeader.tsx`: `resourceHrefs` に `/business/partners` 追加
- `00030_partners.sql`: `navigation_items` に business_header + admin_sidebar 追加（**Supabase SQL Editorで要実行**）

#### ミドルウェア
- `/business/partners` はゲスト公開（`AUTH_REQUIRED_PATHS` に含まれない）

---

### ビジネスマイページ・オンボーディング

#### DBマイグレーション `00031_business_type.sql`
- `business_profiles` に `business_type` カラム追加（`supervisory` / `support` / `accepting_existing` / `accepting_new`）
- `business_profiles` に `industry` カラム追加（業種テキスト）

#### 型定義 `src/types/database.ts`
- `BusinessType`: `'supervisory' | 'support' | 'accepting_existing' | 'accepting_new'`
- `BUSINESS_TYPE_LABELS`: 日本語ラベル定数
- `BusinessProfile` に `business_type`, `industry` フィールド追加

#### オンボーディング `/business/onboarding`

**ファイル構成**:
- `src/app/business/onboarding/page.tsx` — サーバーコンポーネント（認証チェック + 既存データ取得）
- `src/app/business/onboarding/OnboardingWizard.tsx` — 2ステップウィザード

**Step1**: 4択カード選択（business_type）
- supervisory: 監理団体
- support: 登録支援機関
- accepting_existing: 受入れ企業（経験あり）
- accepting_new: 採用検討中の企業
- 選択中カードにゴールド `#c9a84c` ボーダー

**Step2**: 会社名（必須）・担当者名（必須）・業種（任意）入力
- `business_profiles` を upsert（`business_type` 同時保存）
- 完了後 `/business/mypage` へリダイレクト

#### /business/home のリダイレクトロジック
- `src/app/business/home/page.tsx` — サーバーコンポーネント
- 未ログイン → `/business` へリダイレクト
- `business_type` 未設定 → `/business/onboarding` へリダイレクト
- 設定済み → `/business/mypage` へリダイレクト

#### マイページ `/business/mypage`

**ファイル構成**:
- `src/app/business/mypage/page.tsx` — サーバーコンポーネント（profiles + business_profiles + user_scores + bookmarks 取得）
- `src/app/business/mypage/BusinessMypage.tsx` — クライアントコンポーネント

**画面構成**:
1. ヒーロー: 会社名 + business_typeバッジ + planバッジ（Premium=ゴールド / Free=半透明）+ 担当者名 + 業種
2. 診断・シミュレーション結果: `user_scores` 新しい順5件をカード表示（カテゴリバッジ + スコア + 日付）
3. 保存済み: `bookmarks` 新しい順5件をリスト表示
4. 将来機能プレースホルダー:
   - supervisory/support → 「加盟企業管理」「支援実績ダッシュボード」
   - accepting系 → 「求人掲載」「雇用管理」

#### ミドルウェア更新
- `AUTH_REQUIRED_PATHS` に `/business/onboarding` 追加
- `/business/onboarding` — businessロール必須チェック追加

---

### お知らせ・通知機能

#### DBテーブル（マイグレーション `00032_notifications.sql`）
- **notifications**: お知らせ（user_id, title, body, link_url, is_read, send_email）
- `user_id` NULL = 全員向け、UUID指定 = 個別送信
- RLS: SELECT=本人+全員向け+admin、INSERT=admin、UPDATE=本人（既読更新）、DELETE=admin
- インデックス: `user_id`, `created_at DESC`
- `navigation_items` に admin_sidebar 追加（Bell アイコン）

#### 型定義 `src/types/database.ts`
- `Notification`: id, user_id, title, body, link_url, is_read, send_email, created_at

#### マイページ通知セクション（/business/mypage）
- `page.tsx`: `notifications` テーブルから本人宛+全員向けを新しい順20件取得
- `BusinessMypage.tsx`:
  - 未読件数を赤バッジで表示（見出し横）
  - 未読は赤ドット + 太字タイトル、既読は通常表示
  - クリックで `is_read = true` に更新 + `link_url` があれば遷移

#### 管理画面 `/admin/notifications`
- `src/app/admin/notifications/page.tsx` — サーバーコンポーネント（全件取得）
- `src/components/admin/NotificationsAdmin.tsx` — 送信・一覧・削除
  - 送信モーダル: タイトル・本文・リンクURL・送信先（全員/特定ユーザー）・メール送信フラグ
  - 一覧テーブル: タイトル・送信先バッジ・メールバッジ・日時・削除ボタン
  - `send_email` フラグは記録のみ（実際のメール送信は将来実装）

---

### プライバシーポリシー・同意フロー

#### DBマイグレーション `00033_privacy_consent.sql`
- `profiles` に `privacy_agreed_at TIMESTAMPTZ` カラム追加
- `profiles` に `privacy_policy_version TEXT` カラム追加

#### プライバシーポリシーページ `/privacy-policy`
- `src/app/privacy-policy/page.tsx` — BusinessHeader + Footer 付きの独立ページ
- ヒーロー（ネイビーグラデーション）+ 白カード内にポリシー本文
- **現在ドラフト版**（第1条・第2条のみ実コンテンツ、第3条〜第14条は「準備中」表示）
- 末尾に「法務確認中」注記
- 正式版は差し替え予定

#### 登録フォーム同意チェックボックス
- `BusinessRegisterForm.tsx`: PP同意チェックボックス追加、未チェック時ボタン非活性化
- `WorkerRegisterForm.tsx`: 同上（バイリンガル表記）
- 登録時に `privacy_agreed_at`（現在時刻ISO文字列）と `privacy_policy_version`（"draft"）を `auth.signUp` の `data` に含める

#### フッター更新
- `src/components/common/Footer.tsx`: コピーライト上部に「プライバシーポリシー」リンク追加

#### ビルド修正
- `tsconfig.json`: `exclude` に `_import` を追加（別プロジェクトの混入によるビルドエラー解消）

#### マイグレーション実行状況
- `00027` 〜 `00033` — **全て実行済み**

---

## 2026-02-28（追記2）

### 4モジュール統合（_import/ → j-glow本体）

#### 概要
外部プロジェクトとして開発していた4モジュールをj-glow本体に統合。`_import/` フォルダは統合完了後に削除済み。

## サイト構成マップ（統合後）

| パス | 説明 | 公開 | 旧URL |
|---|---|---|---|
| /business/cost-simulator | コストシミュレーター | ✅ | costsimulation.vercel.app |
| /business/hiring-guide | 採用完全ガイド | ✅ | first-foreign-hiring-guide.vercel.app |
| /business/hiring-guide/labor-shortage | 労働力不足サブページ | ✅ | first-foreign-hiring-guide.vercel.app/business/hiring-guide/labor-shortage |
| /business/hiring-guide/trends | 採用動向サブページ | ✅ | first-foreign-hiring-guide.vercel.app/business/hiring-guide/trends |
| /business/hiring-guide/honest-guide | 正直ガイドサブページ | ✅ | first-foreign-hiring-guide.vercel.app/business/hiring-guide/honest-guide |
| /business/roadmap | ロードマップダッシュボード | ✅ | ローカルのみ（ikuseshuro-countdown） |
| /business/articles | 記事一覧（blog_posts連動） | ✅ | ikuseshuro-content（HTML静的） |
| /business/articles/[slug] | 記事詳細 | ✅ | ikuseshuro-content（HTML静的） |

## 内部リンク変更履歴

| 変更箇所 | 変更前 | 変更後 | 完了 |
|---|---|---|---|
| HeroSection.tsx CTA | costsimulation.vercel.app | /business/cost-simulator | ✅ |
| SimulatorCTA.tsx | costsimulation.vercel.app | /business/cost-simulator | ✅ |
| DoubleCTASection.tsx | costsimulation.vercel.app | /business/cost-simulator | ✅ |
| SubpageFooterCTA.tsx | costsimulation.vercel.app | /business/cost-simulator | ✅ |
| business/page.tsx コストシミュレーター | costsimulation.vercel.app | /business/cost-simulator | ✅ |
| business/page.tsx 採用ガイド | first-foreign-hiring-guide.vercel.app | /business/hiring-guide | ✅ |
| business/page.tsx ロードマップ | html-lake-rho.vercel.app | /business/roadmap | ✅ |
| business/page.tsx 分野解説 | html-lake-rho.vercel.app/industry | /business/articles | ✅ |
| business/page.tsx 深掘り記事3本 | first-foreign-hiring-guide.vercel.app（target=_blank） | /business/hiring-guide/*（内部リンク） | ✅ |
| Footer.tsx 採用ガイド | first-foreign-hiring-guide.vercel.app | /business/hiring-guide | ✅ |
| Footer.tsx ロードマップ | html-lake-rho.vercel.app | /business/roadmap | ✅ |
| Footer.tsx コストシミュレーター | costsimulation.vercel.app | /business/cost-simulator | ✅ |

#### 作業1: コストシミュレーター統合

**移設ファイル**:
- `src/components/business/cost-simulator/CostSimulator.tsx` — メインコンポーネント（全UI・データ・ロジック内包、インラインスタイル）
- `src/components/business/cost-simulator/CumulativeChart.tsx` — 36ヶ月累積コスト比較グラフ（recharts）
- `src/app/business/cost-simulator/page.tsx` — サーバーコンポーネント（Supabase認証連携）

**認証ゲート連携**:
- `CostSimulator` に `isLoggedIn` props追加（サーバーコンポーネントで `supabase.auth.getUser()` から判定）
- `REQUIRE_AUTH_FOR_STEP4` フラグ（現在 `false`）を `true` にすると STEP4 前に認証モーダル表示
- 認証モーダルのボタンを `/register/business` と `/login` にリンク

#### 作業2: 採用完全ガイド統合

**移設ファイル**:
- `src/components/business/hiring-guide/` — 全24コンポーネント + useInView.ts
- `src/lib/hiring-guide-data.ts` — 型定義・ステップデータ・関連記事（元 `@/lib/data` → 衝突回避のためリネーム）
- `src/app/business/hiring-guide/page.tsx` — メインページ（7ステップ）
- `src/app/business/hiring-guide/labor-shortage/page.tsx` — 労働力不足サブページ
- `src/app/business/hiring-guide/trends/page.tsx` — 採用動向サブページ
- `src/app/business/hiring-guide/honest-guide/page.tsx` — 正直ガイドサブページ
- `public/downloads/` — PDF・Excelダウンロードファイル

**CSS変数追加** (`globals.css`):
- `--surface`, `--surface-muted`, `--border`, `--primary`, `--accent` 等のCSS変数をグローバルに追加
- `@theme inline` ブロックに対応する `--color-*` 変数も追加

#### 作業3: ロードマップダッシュボード統合

**移設ファイル**:
- `src/components/business/roadmap/CountdownSection.tsx` — カウントダウン
- `src/components/business/roadmap/TimelineSection.tsx` — 制度施行タイムライン
- `src/components/business/roadmap/PracticalTimelineSection.tsx` — 実務スケジュール
- `src/components/business/roadmap/ChecklistSection.tsx` — 準備チェックリスト
- `src/components/business/roadmap/data.ts` — マイルストーン・チェックリストデータ
- `src/app/business/roadmap/page.tsx` — ダッシュボードページ（use client）

**CTAリンク修正**:
- 受入企業向け3ステップの外部リンク（`https://j-glow.com/...`）を内部リンク（`/business/partners`, `/business/articles`）に変更

#### 作業4: 記事コンテンツ移行

**移行対象**（計36記事）:
- 通常記事15本（`ikuseshuro-article-001` 〜 `ikuseshuro-article-015`）
- 特別記事2本（`ikuseshuro-special-001`, `ikuseshuro-special-002`）
- 分野別ガイド19本（`kaigo`, `kogyo`, `nogyo` ... `shigen`）

**ファイル**:
- `scripts/migrate-ikuseshuro-articles.mjs` — マイグレーションスクリプト
  - `SUPABASE_SERVICE_ROLE_KEY=... node scripts/migrate-ikuseshuro-articles.mjs` で実行
  - `blog_categories` に `ikuseshuro`・`industry-guide` をupsert
  - 各MarkdownファイルのフロントマターとBodyを読み取って `blog_posts` にupsert
- `src/app/business/articles/page.tsx` — 記事一覧ページ（カテゴリ別表示）
- `src/app/business/articles/[slug]/page.tsx` — 記事詳細ページ（Markdown/HTML自動判別）

**カテゴリ**:
- `ikuseshuro`（育成就労制度）— 通常記事+特別記事
- `industry-guide`（分野別ガイド）— 19分野

#### 作業5: 依存関係統合
- `recharts: ^3.7.0` を `package.json` の `dependencies` に追加（コストシミュレーター・採用ガイドのグラフで使用）

#### 削除済み
- `_import/` フォルダ — 統合完了後に削除
