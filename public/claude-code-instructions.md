# タスク: 問い合わせフォーム・サイト検索の実装

## 概要

以下の2機能を J-GLOW（Next.js App Router）に実装してください。

- `/business/contact` — 問い合わせフォーム（3ステップウィザード）
- `/business/search` — サイト検索ページ

ベースとなるコンポーネントファイルは以下に配置済みです。
- `inquiry-form.jsx` → 問い合わせフォームのUIプロトタイプ
- `site-search.jsx` → サイト検索のUIプロトタイプ

これらを Next.js App Router / TypeScript / Supabase に適合した形に変換してください。

---

## 1. 問い合わせフォーム

### ページ作成

**ファイル**: `src/app/business/contact/page.tsx`

プロトタイプ（`inquiry-form.jsx`）の3ステップウィザードUIをそのまま使用してください。
デザイン変更は不要です。

### Supabase テーブル作成

以下のマイグレーションファイルを作成してください。

**ファイル**: `supabase/migrations/00036_create_contact_inquiries.sql`

```sql
create table if not exists contact_inquiries (
  id           uuid primary key default gen_random_uuid(),
  inquiry_type text not null,
  company_name text not null,
  name         text not null,
  email        text not null,
  phone        text,
  company_size text,
  experience   text,
  message      text not null,
  status       text not null default 'new',   -- new / in_progress / done
  created_at   timestamptz not null default now()
);

-- RLS: admin のみ参照可能、INSERT は全員可
alter table contact_inquiries enable row level security;

create policy "anyone can insert"
  on contact_inquiries for insert
  with check (true);

create policy "admin can select"
  on contact_inquiries for select
  using (is_admin());

create policy "admin can update"
  on contact_inquiries for update
  using (is_admin());
```

マイグレーション実行:
```bash
npx supabase db push
```

### フォーム送信処理

フォームの「送信する」ボタン押下時に Supabase クライアントで `contact_inquiries` テーブルへ INSERT してください。

```typescript
// src/app/business/contact/page.tsx 内
import { createClient } from "@/lib/supabase/client";

// handleSubmit 内
const supabase = createClient();
const { error } = await supabase.from("contact_inquiries").insert({
  inquiry_type: form.inquiryType,
  company_name: form.companyName,
  name: form.name,
  email: form.email,
  phone: form.phone || null,
  company_size: form.companySize,
  experience: form.experience,
  message: form.message,
});
if (error) {
  // エラー表示（例: "送信に失敗しました。時間をおいて再度お試しください。"）
  return;
}
setSubmitted(true);
```

送信中は「送信する」ボタンを `loading` 状態（テキスト「送信中...」＋disabled）にしてください。

### 管理画面への追加

**ファイル**: `src/app/admin/contact/page.tsx`（新規作成）

問い合わせ一覧を表示するシンプルな管理ページを作成してください。

- テーブル表示: 受信日時 / 種別 / 会社名 / 担当者名 / メール / ステータス
- ステータスを `new → in_progress → done` に変更できるドロップダウン
- `contact_inquiries` テーブルを `created_at desc` で取得（admin RLS）

管理サイドバーに「問い合わせ管理」リンクを追加してください（既存の `src/app/admin/` のサイドバーコンポーネントを確認して追記）。

---

## 2. サイト検索

### ページ作成

**ファイル**: `src/app/business/search/page.tsx`

プロトタイプ（`site-search.jsx`）をベースに、検索データを Supabase から動的取得する形に変換してください。

### 検索データの取得

モックデータ（`SEARCH_DATA`）を以下のテーブルから動的に取得してください。

```typescript
// 検索対象テーブルと取得フィールド
const [articles, blogPosts] = await Promise.all([
  supabase
    .from("editorial_articles")
    .select("id, title, body, slug, category")
    .eq("published", true),
  supabase
    .from("blog_posts")
    .select("id, title, excerpt, slug, category")
    .eq("status", "published"),
]);
```

取得したデータを `SEARCH_DATA` と同じ形式（`id, category, title, description, path, icon, tags`）に変換してから既存のフィルタリングロジックに渡してください。

テーブルスキーマが不明な場合は `src/types/database.ts` を参照してください。

カテゴリとアイコンのマッピング例:
```typescript
const CATEGORY_ICON: Record<string, string> = {
  "ガイド": "📘",
  "記事": "📝",
  "ツール": "🔍",
};
```

ツール・パートナーリンクは静的データ（プロトタイプの `SEARCH_DATA` から該当部分）をそのまま保持してください。

### ヘッダーへの検索ボタン追加

`src/components/business/BusinessHeader.tsx` に検索ボタンを追加してください。

- 虫眼鏡アイコン（🔍 または SVG）をヘッダー右側の UserArea の左に配置
- クリックで `/business/search` に遷移
- モバイルメニューにも「サイト検索」リンクを追加

---

## ナビゲーション追加

`BusinessHeader.tsx` の `guideItems` に以下を追加してください。

```typescript
{ label: "お問い合わせ", path: "/business/contact" },
{ label: "サイト検索", path: "/business/search" },
```

---

## 実装の注意点

- TypeScript の型エラーをすべて解消してください
- `"use client"` ディレクティブが必要なコンポーネントには必ず付与してください
- Supabase クライアントはクライアントコンポーネントでは `@/lib/supabase/client` を、サーバーコンポーネントでは `@/lib/supabase/server` を使用してください
- スタイルはプロトタイプの inline style をそのまま使用（Tailwind への変換は不要）
- デザイン変更は不要。プロトタイプ通りに実装してください

## 完了確認

実装完了後、以下を確認してください。

- [ ] `http://localhost:3000/business/contact` でフォームが3ステップで動作する
- [ ] フォーム送信後に Supabase の `contact_inquiries` にレコードが挿入される
- [ ] `http://localhost:3000/business/search` で検索・フィルタリングが動作する
- [ ] `http://localhost:3000/admin/contact` で問い合わせ一覧が表示される
- [ ] TypeScript エラーがない（`npx tsc --noEmit` でチェック）
- [ ] `vercel deploy --prod` でデプロイが成功する
