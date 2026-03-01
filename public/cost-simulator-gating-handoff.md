# コストシミュレーター ゲーティング実装 Handoff

## 概要

ゲストユーザーがSTEP1〜4を自由に進められるが、結果画面でPDF出力・保存をしようとした際に
会員登録へ誘導するゲート（ブラー＋モーダル）を実装する。

**目的**: サンクコスト転換（10〜15分の入力投資後にゲート） → 登録率向上

---

## 変更対象ファイル

```
src/app/business/cost-simulator/
├─ components/
│  ├─ ResultView.tsx          ← 主要変更箇所（ブラー＋ゲートオーバーレイ）
│  ├─ SimulatorShell.tsx      ← useAuth追加
│  └─ GateModal.tsx           ← 新規作成
```

---

## 1. GateModal.tsx（新規作成）

`src/app/business/cost-simulator/components/GateModal.tsx`

```tsx
"use client";

import { useRouter } from "next/navigation";

interface GateModalProps {
  onClose: () => void;
}

export default function GateModal({ onClose }: GateModalProps) {
  const router = useRouter();

  return (
    // オーバーレイ背景
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(10, 20, 50, 0.7)",
        backdropFilter: "blur(4px)",
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "16px",
      }}
      onClick={onClose}
    >
      {/* モーダル本体 */}
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "36px 32px",
          maxWidth: "480px",
          width: "100%",
          boxShadow: "0 24px 64px rgba(0,0,0,0.25)",
          textAlign: "center",
          fontFamily: "'Noto Sans JP', sans-serif",
        }}
      >
        {/* アイコン */}
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "50%",
            background: "linear-gradient(135deg, #1a2f5e, #2a4f8e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 20px",
            fontSize: "28px",
          }}
        >
          📄
        </div>

        {/* 見出し */}
        <h2
          style={{
            color: "#1a2f5e",
            fontSize: "20px",
            fontWeight: 700,
            margin: "0 0 10px",
            lineHeight: 1.4,
          }}
        >
          提案書PDFの準備ができました
        </h2>

        {/* サブテキスト */}
        <p
          style={{
            color: "#555",
            fontSize: "14px",
            lineHeight: 1.8,
            margin: "0 0 8px",
          }}
        >
          J-GLOWアカウントを作成すると、以下がすべて無料で利用できます。
        </p>

        {/* 見返りリスト */}
        <div
          style={{
            background: "#f4f7fb",
            borderRadius: "10px",
            padding: "16px 20px",
            margin: "16px 0 24px",
            textAlign: "left",
          }}
        >
          {[
            { icon: "📄", text: "試算結果PDFをダウンロード" },
            { icon: "💾", text: "マイページに試算結果を保存・比較" },
            { icon: "📧", text: "結果をメールで受け取る" },
            { icon: "🔗", text: "URLで社内共有" },
          ].map(({ icon, text }) => (
            <div
              key={text}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                padding: "6px 0",
                fontSize: "14px",
                color: "#1a2f5e",
                fontWeight: 500,
              }}
            >
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>

        {/* 補足テキスト */}
        <p
          style={{
            color: "#888",
            fontSize: "12px",
            margin: "0 0 20px",
          }}
        >
          ※ 入力内容はセッション中保存されています。
          <br />
          登録後すぐにPDFを出力できます。
        </p>

        {/* 登録ボタン（メイン） */}
        <button
          onClick={() => {
            // 現在のURLをreturnUrlとして渡す
            const returnUrl = encodeURIComponent(window.location.href);
            router.push(`/register/business?returnUrl=${returnUrl}&from=simulator`);
          }}
          style={{
            width: "100%",
            padding: "14px",
            background: "linear-gradient(135deg, #1a2f5e, #2a4f8e)",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            fontSize: "15px",
            fontWeight: 700,
            cursor: "pointer",
            marginBottom: "10px",
            letterSpacing: "0.5px",
          }}
        >
          無料アカウントを作成してPDFを受け取る →
        </button>

        {/* ログインリンク */}
        <div style={{ fontSize: "13px", color: "#666" }}>
          すでにアカウントをお持ちの方は{" "}
          <span
            onClick={() => {
              const returnUrl = encodeURIComponent(window.location.href);
              router.push(`/login?returnUrl=${returnUrl}`);
            }}
            style={{
              color: "#1a2f5e",
              fontWeight: 600,
              textDecoration: "underline",
              cursor: "pointer",
            }}
          >
            ログイン
          </span>
        </div>

        {/* 閉じる（小さく） */}
        <div
          style={{
            marginTop: "16px",
            fontSize: "12px",
            color: "#aaa",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          今はやめておく
        </div>
      </div>
    </div>
  );
}
```

---

## 2. ResultView.tsx の変更

### 変更概要
- `useAuth` で認証状態を取得
- ゲストの場合：グラフ・数値はそのまま表示、PDF出力ボタンとURL共有ボタンのみゲート
- ボタンクリック時にGateModalを表示

### 追加するインポート
```tsx
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import GateModal from "./GateModal";
```

### コンポーネント内に追加するstate
```tsx
const { user, loading } = useAuth();
const isGuest = !loading && !user;
const [showGate, setShowGate] = useState(false);
```

### PDF出力ボタンの変更パターン

**変更前:**
```tsx
<button onClick={handlePDFDownload}>
  提案書PDFをダウンロード
</button>
```

**変更後:**
```tsx
<button
  onClick={isGuest ? () => setShowGate(true) : handlePDFDownload}
  style={{
    // 既存スタイル維持
    // ゲストの場合も見た目は同じ（ブラーなし・ボタンは有効に見せる）
  }}
>
  {isGuest ? "📄 提案書PDFをダウンロード（無料登録が必要）" : "📄 提案書PDFをダウンロード"}
</button>
```

### URL共有ボタンの変更パターン
```tsx
<button
  onClick={isGuest ? () => setShowGate(true) : handleShare}
>
  {isGuest ? "🔗 URLで共有（無料登録が必要）" : "🔗 URLで共有"}
</button>
```

### GateModal の配置（JSXの末尾に追加）
```tsx
{showGate && <GateModal onClose={() => setShowGate(false)} />}
```

---

## 3. 結果画面のブラー設計（オプション）

グラフや数値は**ブラーなし**で表示する。理由：
- 数値が見えることで「自分の会社の場合」の実感が高まる
- ブラーは「隠している感」が強く、離脱を招きやすい
- 代わりに**PDF・保存・共有だけをゲート**にする設計の方が転換率が高い

もしブラーを入れたい場合は、月額コスト合計の数値だけをぼかす：
```tsx
<span
  style={{
    filter: isGuest ? "blur(6px)" : "none",
    userSelect: isGuest ? "none" : "auto",
    transition: "filter 0.3s",
  }}
>
  {totalCost.toLocaleString()}円
</span>
```

---

## 4. 登録完了後のreturnUrl処理

`/register/business/page.tsx` にreturnUrl対応を追加：

```tsx
// 登録成功後のリダイレクト
const returnUrl = searchParams.get("returnUrl");
if (returnUrl) {
  router.push(decodeURIComponent(returnUrl));
} else {
  router.push("/business/home");
}
```

---

## 5. Supabase：simulator_sessions テーブルへのゲスト保存（将来対応）

現時点では**セッション内保存のみ**（stateで保持）。
登録後に「入力内容を引き継ぐ」機能が必要になったら以下を追加：

```sql
-- ゲスト試算セッション保存用カラム追加
ALTER TABLE simulator_sessions
  ADD COLUMN guest_token TEXT,
  ADD COLUMN claimed_by UUID REFERENCES auth.users(id);
```

登録時にguest_tokenをuser_idに紐付けるAPIエンドポイント：
`/api/simulator/claim-session`

---

## 実装優先順位

| 優先度 | タスク | 工数目安 |
|---|---|---|
| 🔴 必須 | GateModal.tsx 新規作成 | 30分 |
| 🔴 必須 | ResultView.tsx のボタンゲート | 20分 |
| 🟡 推奨 | register/business にreturnUrl対応 | 20分 |
| 🟢 後回し | ゲストセッションの引き継ぎ（DB） | 2〜3時間 |

---

## チェックリスト

- [ ] GateModal.tsx 作成
- [ ] ResultView.tsx に useAuth インポート
- [ ] PDF/共有ボタンに isGuest 分岐
- [ ] GateModal の表示/非表示state追加
- [ ] register/business に returnUrl 対応
- [ ] 動作確認：ゲストでSTEP4まで進み、PDFボタンを押してモーダルが出ることを確認
- [ ] 動作確認：登録後に元のURLにリダイレクトされることを確認
- [ ] 動作確認：ログイン済みユーザーはモーダルが出ずに直接PDFが出力されることを確認
