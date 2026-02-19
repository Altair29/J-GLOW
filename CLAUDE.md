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

## 言語対応方針
- /worker 側：11言語対応済み（テキスト直書き禁止・辞書JSON必須）
- /business 側：日本語のみ（テキスト直書きOK）
- /トップページ：日本語のみ
