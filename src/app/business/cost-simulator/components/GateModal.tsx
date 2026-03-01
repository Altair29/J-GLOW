"use client";

import { useRouter } from "next/navigation";

interface GateModalProps {
  onClose: () => void;
}

export default function GateModal({ onClose }: GateModalProps) {
  const router = useRouter();

  return (
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

        {/* 登録ボタン */}
        <button
          onClick={() => {
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
