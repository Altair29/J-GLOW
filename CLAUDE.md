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
ja, en, zh, vi, tl, pt, id, th, my, ne, ko

#### 多言語開発プロトコル（以降の /worker 開発で厳守）
1. **No Hardcoded Strings** — テキスト直書き禁止。辞書JSONまたはSupabase翻訳テーブルから取得
2. **JP-First** — 日本語定義 → Claudeが10言語一括翻訳
3. **可変長テキスト対応** — Flexbox/Gridで柔軟レイアウト（ビルマ語・ネパール語等の長文に対応）
4. **フォントフォールバック** — 各国語フォントのCSS共通スタック
5. **管理者修正導線** — 翻訳データは疎結合、管理パネルから手動修正可能
