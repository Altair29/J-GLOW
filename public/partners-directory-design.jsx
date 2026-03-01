import { useState } from "react";

// ============================================================
// DESIGN SYSTEM
// ============================================================
const DS = {
  navy: "#0f1f45",
  navyLight: "#1a2f5e",
  navyMid: "#243a6e",
  gold: "#c9a84c",
  goldLight: "#f0d080",
  goldPale: "#fdf8ec",
  platinum: "#8b9ab0",
  platinumLight: "#e8edf5",
  bg: "#f2f5f9",
  white: "#ffffff",
  text: "#1a1f2e",
  textMid: "#4a5568",
  textLight: "#718096",
  border: "#dce4ef",
};

const TIER_CONFIG = {
  platinum: {
    label: "プラチナ",
    badge: "PLATINUM",
    price: "¥150,000〜 / 月",
    color: "#6b7fa3",
    gradient: "linear-gradient(135deg, #1e3a6e 0%, #0f1f45 50%, #1e3a6e 100%)",
    cardBg: "linear-gradient(145deg, #f8faff 0%, #eef2fb 100%)",
    borderColor: "#8b9ab0",
    shadow: "0 8px 40px rgba(107,127,163,0.25)",
    badgeBg: "linear-gradient(135deg, #8b9ab0, #b8c5d6)",
    badgeColor: "#0f1f45",
    accent: "#6b7fa3",
  },
  gold: {
    label: "ゴールド",
    badge: "GOLD",
    price: "¥80,000〜 / 月",
    color: "#c9a84c",
    gradient: "linear-gradient(135deg, #c9a84c 0%, #f0d080 50%, #c9a84c 100%)",
    cardBg: "linear-gradient(145deg, #fffef8 0%, #fffbec 100%)",
    borderColor: "#c9a84c",
    shadow: "0 8px 40px rgba(201,168,76,0.2)",
    badgeBg: "linear-gradient(135deg, #c9a84c, #f0d080)",
    badgeColor: "#1a2f5e",
    accent: "#c9a84c",
  },
  regular: {
    label: "レギュラー",
    badge: "MEMBER",
    price: "審査費のみ ¥30,000",
    color: "#8ca0bc",
    gradient: "linear-gradient(135deg, #8ca0bc, #aabbd4)",
    cardBg: "#ffffff",
    borderColor: "#dce4ef",
    shadow: "0 2px 12px rgba(0,0,0,0.06)",
    badgeBg: "#e8edf5",
    badgeColor: "#1a2f5e",
    accent: "#1a2f5e",
  },
};

const PARTNER_TYPES = [
  { id: "kanri", label: "監理団体", icon: "🏢", short: "監理" },
  { id: "support", label: "登録支援機関", icon: "🤝", short: "支援" },
  { id: "gyosei", label: "行政書士", icon: "📋", short: "行書" },
  { id: "bengoshi", label: "弁護士", icon: "⚖️", short: "弁護" },
  { id: "sharoshi", label: "社労士", icon: "📊", short: "社労" },
];

// 種別ごとの表示フィールド定義
const TYPE_FIELDS = {
  kanri: {
    highlights: ["対応分野（19分野）", "送出国ネットワーク", "組合員企業数", "許可区分"],
    visaFocus: ["育成就労", "技能実習"],
    tags: ["送出機関直結", "入国前研修対応", "日本語教育", "生活支援"],
    color: "#2d6a4f",
    bgAccent: "#d8f3dc",
  },
  support: {
    highlights: ["対応言語", "担当可能人数", "登録番号", "支援実績"],
    visaFocus: ["特定技能1号"],
    tags: ["生活支援", "住居確保", "役所手続", "定期面談"],
    color: "#1d6fa4",
    bgAccent: "#d0eaf8",
  },
  gyosei: {
    highlights: ["年間申請件数", "許可率", "得意なビザ種別", "オンライン対応"],
    visaFocus: ["技術・人文・国際", "特定技能", "育成就労", "経営管理"],
    tags: ["在留資格申請", "書類作成", "全国対応", "スピード対応"],
    color: "#6b4226",
    bgAccent: "#fde8d8",
  },
  bengoshi: {
    highlights: ["入管案件取扱数", "労働紛争対応", "初回相談", "対応可能な紛争"],
    visaFocus: ["全ビザ種別", "不法就労対応", "異議申立"],
    tags: ["労働紛争", "入管訴訟", "契約審査", "リスク管理"],
    color: "#5b2333",
    bgAccent: "#fdd8de",
  },
  sharoshi: {
    highlights: ["対応可能助成金", "顧問契約実績", "給与計算対応言語", "社保手続"],
    visaFocus: ["就業規則", "助成金", "社会保険", "給与計算"],
    tags: ["助成金申請", "社会保険", "就業規則", "給与計算"],
    color: "#4a3580",
    bgAccent: "#e6e0f8",
  },
};

// ダミーデータ
const SAMPLE_PARTNERS = {
  platinum: [
    {
      id: 1, type: "kanri", tier: "platinum",
      name: "協同組合 東海外国人支援センター",
      catch: "愛知・東海エリア製造業15年の実績。育成就労移行支援に特化。",
      prefecture: "愛知県", regions: ["東海", "中部"],
      industries: ["製造業", "建設業", "食品加工", "溶接・溶断"],
      origin: ["ベトナム", "インドネシア", "フィリピン"],
      visas: ["育成就労", "技能実習"],
      members: 142, founded: 2008,
      permit: "一般監理事業", permitNo: "愛知第12-345678号",
      tags: ["送出機関直結", "日本語教育", "生活支援", "入国前研修"],
      rating: 4.8, reviews: 23, inquiries: 42,
      specialties: { "組合員企業数": "142社", "現在管理中": "380名", "対応分野": "8分野" },
    },
  ],
  gold: [
    {
      id: 2, type: "gyosei", tier: "gold",
      name: "行政書士法人 グローバルビザ事務所",
      catch: "年間200件超の申請実績。許可率98.7%。オンライン全国対応。",
      prefecture: "大阪府", regions: ["関西", "全国"],
      industries: ["IT", "介護", "製造業", "サービス業"],
      origin: ["中国", "フィリピン", "ミャンマー"],
      visas: ["特定技能1号", "技術・人文・国際", "育成就労"],
      members: null, founded: 2012,
      permit: "行政書士法人", permitNo: "大阪府行政書士会 No.12345",
      tags: ["在留資格申請", "書類作成", "オンライン対応", "スピード対応"],
      rating: 4.9, reviews: 41, inquiries: 38,
      specialties: { "年間申請件数": "200件以上", "許可率": "98.7%", "対応ビザ": "8種類" },
    },
  ],
  regular: [
    {
      id: 3, type: "support", tier: "regular",
      name: "NPO法人 関西外国人労働支援機構",
      catch: "特定技能外国人の生活支援・日本語学習支援に特化。",
      prefecture: "大阪府", regions: ["関西"],
      industries: ["介護", "飲食業"],
      origin: ["ベトナム"],
      visas: ["特定技能1号"],
      members: null, founded: 2019,
      permit: "登録支援機関", permitNo: "登20-123456",
      tags: ["生活支援", "住居確保", "日本語支援", "定期面談"],
      rating: 4.5, reviews: 8, inquiries: 12,
      specialties: { "担当可能人数": "50名まで", "対応言語": "3言語", "相談対応": "24時間" },
    },
    {
      id: 4, type: "sharoshi", tier: "regular",
      name: "社会保険労務士 田村人事労務事務所",
      catch: "外国人雇用の社会保険・助成金申請に特化した専門事務所。",
      prefecture: "東京都", regions: ["関東"],
      industries: ["製造業", "IT", "介護"],
      origin: ["ベトナム", "中国", "インドネシア"],
      visas: ["就業規則", "社会保険", "助成金"],
      members: null, founded: 2015,
      permit: "社会保険労務士", permitNo: "東京都社労士会 No.98765",
      tags: ["助成金申請", "社会保険", "就業規則", "給与計算"],
      rating: 4.6, reviews: 14, inquiries: 19,
      specialties: { "対応助成金": "8種類", "顧問先": "35社", "給与計算対応": "4言語" },
    },
  ],
};

// ============================================================
// COMPONENTS
// ============================================================

function TierBadge({ tier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span style={{
      background: cfg.badgeBg,
      color: cfg.badgeColor,
      padding: "3px 10px",
      borderRadius: "20px",
      fontSize: "10px",
      fontWeight: 800,
      letterSpacing: "1.5px",
      whiteSpace: "nowrap",
      fontFamily: "monospace",
    }}>
      {cfg.badge}
    </span>
  );
}

function TypeBadge({ type }) {
  const t = PARTNER_TYPES.find(p => p.id === type);
  const f = TYPE_FIELDS[type];
  return (
    <span style={{
      background: f.bgAccent,
      color: f.color,
      padding: "3px 10px",
      borderRadius: "4px",
      fontSize: "11px",
      fontWeight: 700,
      whiteSpace: "nowrap",
    }}>
      {t?.icon} {t?.label}
    </span>
  );
}

function StarRating({ rating, size = 12 }) {
  return (
    <span style={{ fontSize: `${size}px`, color: DS.gold, letterSpacing: "1px" }}>
      {"★".repeat(Math.round(rating))}{"☆".repeat(5 - Math.round(rating))}
      <span style={{ color: DS.textLight, marginLeft: "4px", fontSize: `${size - 1}px` }}>
        {rating}
      </span>
    </span>
  );
}

// プラチナカード — 横幅フル・リッチ表示
function PlatinumCard({ partner }) {
  const [hovered, setHovered] = useState(false);
  const typeField = TYPE_FIELDS[partner.type];
  const typeInfo = PARTNER_TYPES.find(p => p.id === partner.type);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(145deg, #f0f4ff 0%, #e8edf8 100%)",
        border: "2px solid #8b9ab0",
        borderRadius: "16px",
        padding: "0",
        marginBottom: "20px",
        transition: "all 0.25s ease",
        boxShadow: hovered
          ? "0 16px 56px rgba(107,127,163,0.3)"
          : "0 6px 32px rgba(107,127,163,0.18)",
        transform: hovered ? "translateY(-3px)" : "none",
        overflow: "hidden",
        cursor: "pointer",
        position: "relative",
      }}
    >
      {/* 左アクセントライン */}
      <div style={{
        position: "absolute", left: 0, top: 0, bottom: 0,
        width: "5px",
        background: "linear-gradient(180deg, #8b9ab0, #b8c5d6, #8b9ab0)",
      }} />

      {/* ヘッダー部 */}
      <div style={{
        background: "linear-gradient(135deg, #1e3a6e 0%, #0f1f45 100%)",
        padding: "16px 24px 16px 28px",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: "8px",
      }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <TierBadge tier="platinum" />
          <TypeBadge type={partner.type} />
          <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "12px" }}>
            📍 {partner.prefecture} / {partner.regions.join("・")}
          </span>
        </div>
        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <StarRating rating={partner.rating} size={13} />
          <span style={{ color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
            ({partner.reviews}件)
          </span>
          <span style={{
            background: "rgba(201,168,76,0.25)",
            color: "#f0d080",
            padding: "4px 12px",
            borderRadius: "20px",
            fontSize: "12px",
            fontWeight: 600,
          }}>
            月{partner.inquiries}件問い合わせ
          </span>
        </div>
      </div>

      {/* ボディ */}
      <div style={{ padding: "20px 24px 20px 28px" }}>
        <div style={{ display: "flex", gap: "24px", flexWrap: "wrap" }}>
          {/* 左：基本情報 */}
          <div style={{ flex: "1 1 300px" }}>
            <h3 style={{
              margin: "0 0 6px", color: DS.navy,
              fontSize: "19px", fontWeight: 800, lineHeight: 1.3,
            }}>
              {partner.name}
            </h3>
            <p style={{ color: DS.textMid, fontSize: "13px", lineHeight: 1.7, margin: "0 0 14px" }}>
              {partner.catch}
            </p>

            {/* ビザ・分野タグ */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "12px" }}>
              {partner.visas.map(v => (
                <span key={v} style={{
                  background: "#e8f0ff", color: "#1a2f5e",
                  padding: "3px 10px", borderRadius: "4px",
                  fontSize: "11px", border: "1px solid #c0d0e8", fontWeight: 600,
                }}>{v}</span>
              ))}
              {partner.industries.slice(0, 3).map(i => (
                <span key={i} style={{
                  background: "#f5f5f5", color: "#555",
                  padding: "3px 10px", borderRadius: "4px",
                  fontSize: "11px", border: "1px solid #e0e0e0",
                }}>{i}</span>
              ))}
              {partner.industries.length > 3 && (
                <span style={{ color: DS.textLight, fontSize: "11px", padding: "3px 6px" }}>
                  +{partner.industries.length - 3}
                </span>
              )}
            </div>

            <div style={{ fontSize: "12px", color: DS.textLight }}>
              送出国: {partner.origin.join("・")} ｜ 設立: {partner.founded}年 ｜ {partner.permit}
            </div>
          </div>

          {/* 右：スペック数字 */}
          <div style={{
            display: "flex", gap: "16px", alignItems: "flex-start",
            flexWrap: "wrap",
          }}>
            {Object.entries(partner.specialties).map(([k, v]) => (
              <div key={k} style={{
                textAlign: "center",
                background: "rgba(107,127,163,0.08)",
                border: "1px solid rgba(107,127,163,0.2)",
                borderRadius: "10px",
                padding: "12px 16px",
                minWidth: "90px",
              }}>
                <div style={{ fontSize: "18px", fontWeight: 800, color: DS.navy, lineHeight: 1.2 }}>{v}</div>
                <div style={{ fontSize: "10px", color: DS.textLight, marginTop: "4px" }}>{k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          marginTop: "16px", paddingTop: "16px",
          borderTop: "1px solid rgba(107,127,163,0.2)",
          flexWrap: "wrap", gap: "8px",
        }}>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {partner.tags.map(t => (
              <span key={t} style={{
                background: typeField.bgAccent,
                color: typeField.color,
                padding: "3px 9px", borderRadius: "20px",
                fontSize: "11px", fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button style={{
              background: "transparent", color: DS.navyLight,
              border: "1.5px solid #8b9ab0",
              borderRadius: "8px", padding: "9px 18px",
              fontSize: "13px", fontWeight: 600, cursor: "pointer",
            }}>詳しく見る</button>
            <button style={{
              background: "linear-gradient(135deg, #1a2f5e, #2a4f8e)",
              color: "#fff", border: "none",
              borderRadius: "8px", padding: "9px 20px",
              fontSize: "13px", fontWeight: 700, cursor: "pointer",
            }}>無料で相談する →</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ゴールドカード
function GoldCard({ partner }) {
  const [hovered, setHovered] = useState(false);
  const typeField = TYPE_FIELDS[partner.type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "linear-gradient(145deg, #fffef8 0%, #fffbec 100%)",
        border: "2px solid #c9a84c",
        borderRadius: "14px",
        padding: "20px 22px",
        marginBottom: "16px",
        transition: "all 0.22s ease",
        boxShadow: hovered
          ? "0 12px 40px rgba(201,168,76,0.28)"
          : "0 3px 16px rgba(201,168,76,0.15)",
        transform: hovered ? "translateY(-2px)" : "none",
        cursor: "pointer",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* コーナー装飾 */}
      <div style={{
        position: "absolute", top: 0, right: 0,
        width: "60px", height: "60px",
        background: "linear-gradient(225deg, transparent 50%, rgba(201,168,76,0.12) 50%)",
      }} />

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
        <div style={{ display: "flex", gap: "8px", alignItems: "center", flexWrap: "wrap" }}>
          <TierBadge tier="gold" />
          <TypeBadge type={partner.type} />
          <span style={{ color: DS.textLight, fontSize: "12px" }}>📍 {partner.prefecture}</span>
        </div>
        <span style={{ color: DS.textLight, fontSize: "12px" }}>
          月<strong style={{ color: DS.navy }}>{partner.inquiries}</strong>件問い合わせ
        </span>
      </div>

      <h3 style={{ margin: "0 0 6px", color: DS.navy, fontSize: "16px", fontWeight: 800 }}>
        {partner.name}
      </h3>

      <div style={{ marginBottom: "10px" }}>
        <StarRating rating={partner.rating} />
        <span style={{ color: DS.textLight, fontSize: "12px", marginLeft: "6px" }}>({partner.reviews}件)</span>
      </div>

      <p style={{ color: DS.textMid, fontSize: "13px", lineHeight: 1.7, margin: "0 0 12px" }}>
        {partner.catch}
      </p>

      {/* スペック */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "12px", flexWrap: "wrap" }}>
        {Object.entries(partner.specialties).map(([k, v]) => (
          <div key={k} style={{
            background: "rgba(201,168,76,0.1)",
            border: "1px solid rgba(201,168,76,0.3)",
            borderRadius: "8px", padding: "8px 14px", textAlign: "center",
          }}>
            <div style={{ fontSize: "15px", fontWeight: 800, color: DS.navy }}>{v}</div>
            <div style={{ fontSize: "10px", color: DS.textLight }}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "5px", marginBottom: "14px" }}>
        {partner.visas.map(v => (
          <span key={v} style={{
            background: "#e8f0ff", color: "#1a2f5e",
            padding: "3px 9px", borderRadius: "4px",
            fontSize: "11px", border: "1px solid #c0d0e8", fontWeight: 600,
          }}>{v}</span>
        ))}
        {partner.industries.slice(0, 3).map(i => (
          <span key={i} style={{
            background: "#f5f5f5", color: "#666",
            padding: "3px 9px", borderRadius: "4px",
            fontSize: "11px", border: "1px solid #e0e0e0",
          }}>{i}</span>
        ))}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "8px" }}>
        <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
          {partner.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              background: typeField.bgAccent, color: typeField.color,
              padding: "3px 8px", borderRadius: "20px", fontSize: "11px", fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
        <button style={{
          background: "linear-gradient(135deg, #c9a84c, #f0d080)",
          color: "#1a2f5e", border: "none",
          borderRadius: "8px", padding: "9px 20px",
          fontSize: "13px", fontWeight: 700, cursor: "pointer",
        }}>無料で相談する →</button>
      </div>
    </div>
  );
}

// レギュラーカード — コンパクト
function RegularCard({ partner }) {
  const [hovered, setHovered] = useState(false);
  const typeField = TYPE_FIELDS[partner.type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#fff",
        border: "1px solid",
        borderColor: hovered ? "#aabbd4" : DS.border,
        borderRadius: "10px",
        padding: "16px 18px",
        marginBottom: "10px",
        transition: "all 0.2s ease",
        boxShadow: hovered ? "0 4px 20px rgba(26,47,94,0.1)" : "0 1px 4px rgba(0,0,0,0.05)",
        cursor: "pointer",
        display: "flex", gap: "16px", alignItems: "flex-start",
        flexWrap: "wrap",
      }}
    >
      {/* 左：タイプアイコン */}
      <div style={{
        width: "44px", height: "44px", flexShrink: 0,
        background: typeField.bgAccent,
        borderRadius: "10px",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "20px",
      }}>
        {PARTNER_TYPES.find(p => p.id === partner.type)?.icon}
      </div>

      {/* 中：情報 */}
      <div style={{ flex: "1 1 200px" }}>
        <div style={{ display: "flex", gap: "6px", alignItems: "center", flexWrap: "wrap", marginBottom: "6px" }}>
          <TierBadge tier="regular" />
          <TypeBadge type={partner.type} />
          <span style={{ color: DS.textLight, fontSize: "11px" }}>📍 {partner.prefecture}</span>
        </div>
        <h3 style={{ margin: "0 0 4px", color: DS.navy, fontSize: "14px", fontWeight: 700 }}>
          {partner.name}
        </h3>
        <StarRating rating={partner.rating} size={11} />
        <span style={{ color: DS.textLight, fontSize: "11px", marginLeft: "4px" }}>({partner.reviews}件)</span>
        <p style={{ color: DS.textMid, fontSize: "12px", lineHeight: 1.6, margin: "6px 0 0" }}>
          {partner.catch}
        </p>
      </div>

      {/* 右：タグ + ボタン */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", alignItems: "flex-end", flexShrink: 0 }}>
        <div style={{ display: "flex", gap: "4px", flexWrap: "wrap", justifyContent: "flex-end" }}>
          {partner.tags.slice(0, 2).map(t => (
            <span key={t} style={{
              background: typeField.bgAccent, color: typeField.color,
              padding: "2px 7px", borderRadius: "20px", fontSize: "10px", fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
        <button style={{
          background: DS.navy, color: "#fff", border: "none",
          borderRadius: "6px", padding: "7px 14px",
          fontSize: "12px", fontWeight: 600, cursor: "pointer", whiteSpace: "nowrap",
        }}>相談する →</button>
      </div>
    </div>
  );
}

// ============================================================
// 掲載申し込みフォーム
// ============================================================
const FORM_FIELDS = {
  common: [
    { id: "org_name", label: "法人・事務所名", type: "text", placeholder: "例: 協同組合 東海外国人支援センター", required: true },
    { id: "contact_name", label: "担当者名", type: "text", placeholder: "例: 山田 太郎", required: true },
    { id: "email", label: "メールアドレス", type: "email", placeholder: "例: info@example.com", required: true },
    { id: "tel", label: "電話番号", type: "tel", placeholder: "例: 052-123-4567", required: true },
    { id: "prefecture", label: "所在都道府県", type: "select", options: ["東京都", "大阪府", "愛知県", "神奈川県", "埼玉県", "その他"], required: true },
    { id: "regions", label: "対応エリア（複数選択）", type: "multicheck", options: ["北海道", "東北", "関東", "東海", "関西", "中国・四国", "九州・沖縄", "全国"], required: true },
  ],
  kanri: [
    { id: "permit_type", label: "許可区分", type: "select", options: ["一般監理事業", "特定監理事業"], required: true },
    { id: "permit_no", label: "許可番号", type: "text", placeholder: "例: 愛知第12-345678号", required: true },
    { id: "member_count", label: "組合員企業数", type: "number", placeholder: "例: 142", required: false },
    { id: "managing_count", label: "現在管理中の外国人数", type: "number", placeholder: "例: 380", required: false },
    { id: "industries", label: "対応分野（19分野から選択）", type: "multicheck", options: ["機械加工", "溶接", "塗装", "建設", "農業", "食品製造", "介護", "繊維", "その他"], required: true },
    { id: "origin_countries", label: "主な送出国", type: "multicheck", options: ["ベトナム", "インドネシア", "フィリピン", "ミャンマー", "カンボジア", "中国", "タイ", "その他"], required: true },
    { id: "languages", label: "対応言語", type: "multicheck", options: ["ベトナム語", "インドネシア語", "フィリピン語", "ミャンマー語", "中国語", "英語"], required: false },
  ],
  support: [
    { id: "reg_no", label: "登録番号", type: "text", placeholder: "例: 登20-123456", required: true },
    { id: "max_support", label: "担当可能人数（上限）", type: "number", placeholder: "例: 50", required: false },
    { id: "support_languages", label: "対応言語", type: "multicheck", options: ["ベトナム語", "インドネシア語", "フィリピン語", "英語", "中国語"], required: true },
    { id: "support_menu", label: "支援メニュー", type: "multicheck", options: ["住居確保", "銀行口座開設", "役所手続", "日本語学習", "定期面談", "相談窓口"], required: false },
    { id: "origin_countries", label: "対応国籍", type: "multicheck", options: ["ベトナム", "インドネシア", "フィリピン", "ミャンマー", "中国", "その他"], required: false },
  ],
  gyosei: [
    { id: "reg_no", label: "行政書士会登録番号", type: "text", placeholder: "例: 大阪府行政書士会 No.12345", required: true },
    { id: "annual_cases", label: "年間申請件数", type: "number", placeholder: "例: 200", required: false },
    { id: "approval_rate", label: "許可率（%）", type: "number", placeholder: "例: 98.7", required: false },
    { id: "visa_types", label: "得意なビザ種別", type: "multicheck", options: ["育成就労", "技能実習", "特定技能1号", "特定技能2号", "技術・人文・国際", "経営管理", "高度人材", "留学"], required: true },
    { id: "online_support", label: "オンライン対応", type: "select", options: ["全国オンライン対応可", "一部オンライン対応", "対面のみ"], required: false },
    { id: "languages", label: "対応言語", type: "multicheck", options: ["英語", "中国語", "ベトナム語", "その他"], required: false },
  ],
  bengoshi: [
    { id: "bar_no", label: "弁護士会登録番号", type: "text", placeholder: "例: 第一東京弁護士会 No.XXXXX", required: true },
    { id: "immigration_cases", label: "入管・外国人案件取扱件数（年間）", type: "number", placeholder: "例: 50", required: false },
    { id: "dispute_types", label: "対応可能な紛争類型", type: "multicheck", options: ["労働紛争・解雇", "不法就労・資格外活動", "在留資格申請・異議申立", "入管訴訟", "雇用契約審査", "給与未払い"], required: false },
    { id: "initial_free", label: "初回相談", type: "select", options: ["初回無料（30分）", "初回無料（60分）", "有料"], required: false },
    { id: "languages", label: "対応言語", type: "multicheck", options: ["英語", "中国語", "ベトナム語", "その他"], required: false },
  ],
  sharoshi: [
    { id: "sr_no", label: "社労士会登録番号", type: "text", placeholder: "例: 東京都社労士会 No.XXXXX", required: true },
    { id: "client_count", label: "顧問先企業数", type: "number", placeholder: "例: 35", required: false },
    { id: "subsidies", label: "対応可能な助成金", type: "multicheck", options: ["特定求職者雇用開発助成金", "キャリアアップ助成金", "人材確保等支援助成金", "両立支援助成金", "その他"], required: false },
    { id: "payroll_languages", label: "給与計算対応言語", type: "multicheck", options: ["英語", "中国語", "ベトナム語", "インドネシア語", "その他"], required: false },
    { id: "services", label: "対応サービス", type: "multicheck", options: ["社会保険手続", "雇用保険手続", "就業規則作成", "給与計算", "助成金申請", "労務相談"], required: false },
  ],
};

function FormField({ field }) {
  const inputStyle = {
    width: "100%", padding: "10px 12px",
    border: `1.5px solid ${DS.border}`, borderRadius: "8px",
    fontSize: "13px", color: DS.text, outline: "none",
    background: "#fff", boxSizing: "border-box",
    fontFamily: "inherit",
  };
  const labelStyle = {
    display: "block", marginBottom: "6px",
    fontSize: "13px", fontWeight: 600, color: DS.navyLight,
  };

  if (field.type === "select") return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {field.label} {field.required && <span style={{ color: "#e53e3e", marginLeft: "2px" }}>*</span>}
      </label>
      <select style={{ ...inputStyle, cursor: "pointer" }}>
        <option value="">選択してください</option>
        {field.options.map(o => <option key={o}>{o}</option>)}
      </select>
    </div>
  );

  if (field.type === "multicheck") return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {field.label} {field.required && <span style={{ color: "#e53e3e", marginLeft: "2px" }}>*</span>}
      </label>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
        {field.options.map(o => (
          <label key={o} style={{
            display: "flex", alignItems: "center", gap: "5px",
            background: "#f4f7fb", border: `1px solid ${DS.border}`,
            borderRadius: "6px", padding: "6px 10px",
            fontSize: "12px", cursor: "pointer", fontWeight: 500,
          }}>
            <input type="checkbox" style={{ cursor: "pointer" }} />
            {o}
          </label>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ marginBottom: "16px" }}>
      <label style={labelStyle}>
        {field.label} {field.required && <span style={{ color: "#e53e3e", marginLeft: "2px" }}>*</span>}
      </label>
      <input type={field.type} placeholder={field.placeholder} style={inputStyle} />
    </div>
  );
}

function ApplicationForm({ selectedType, onTypeChange }) {
  const typeInfo = PARTNER_TYPES.find(p => p.id === selectedType);
  const typeFields = FORM_FIELDS[selectedType] || [];

  return (
    <div style={{
      background: "#fff", borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      overflow: "hidden",
    }}>
      {/* フォームヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #0f1f45, #1a2f5e)",
        padding: "24px 28px",
      }}>
        <div style={{
          color: DS.gold, fontSize: "11px", fontWeight: 700,
          letterSpacing: "2px", marginBottom: "6px",
        }}>掲載申し込みフォーム</div>
        <h3 style={{ color: "#fff", margin: 0, fontSize: "18px", fontWeight: 800 }}>
          J-GLOWパートナーに登録する
        </h3>
        <p style={{ color: "rgba(255,255,255,0.65)", margin: "6px 0 0", fontSize: "12px" }}>
          審査後、最短3営業日で掲載開始。初期審査費 ¥30,000〜
        </p>
      </div>

      <div style={{ padding: "24px 28px" }}>

        {/* STEP 1: 種別選択 */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            marginBottom: "14px",
          }}>
            <div style={{
              width: "24px", height: "24px",
              background: "linear-gradient(135deg, #1a2f5e, #2a4f8e)",
              borderRadius: "50%", color: "#fff",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "12px", fontWeight: 800, flexShrink: 0,
            }}>1</div>
            <span style={{ fontWeight: 700, color: DS.navy, fontSize: "14px" }}>
              種別を選択してください
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
            {PARTNER_TYPES.map(pt => (
              <button
                key={pt.id}
                onClick={() => onTypeChange(pt.id)}
                style={{
                  padding: "10px 16px",
                  border: selectedType === pt.id
                    ? `2px solid ${TYPE_FIELDS[pt.id].color}`
                    : `1.5px solid ${DS.border}`,
                  borderRadius: "10px",
                  background: selectedType === pt.id
                    ? TYPE_FIELDS[pt.id].bgAccent
                    : "#fff",
                  color: selectedType === pt.id
                    ? TYPE_FIELDS[pt.id].color
                    : DS.textMid,
                  cursor: "pointer", fontSize: "13px", fontWeight: 700,
                  transition: "all 0.15s",
                  display: "flex", alignItems: "center", gap: "6px",
                }}
              >
                {pt.icon} {pt.label}
              </button>
            ))}
          </div>
          {selectedType && (
            <div style={{
              marginTop: "10px", padding: "10px 14px",
              background: TYPE_FIELDS[selectedType]?.bgAccent,
              borderRadius: "8px", fontSize: "12px",
              color: TYPE_FIELDS[selectedType]?.color,
              fontWeight: 600,
            }}>
              {typeInfo?.icon} {typeInfo?.label}を選択中 — この種別に合わせた入力項目が表示されます
            </div>
          )}
        </div>

        {/* STEP 2: 共通情報 */}
        {selectedType && (
          <>
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                marginBottom: "14px",
              }}>
                <div style={{
                  width: "24px", height: "24px",
                  background: "linear-gradient(135deg, #1a2f5e, #2a4f8e)",
                  borderRadius: "50%", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800, flexShrink: 0,
                }}>2</div>
                <span style={{ fontWeight: 700, color: DS.navy, fontSize: "14px" }}>
                  基本情報
                </span>
              </div>
              {FORM_FIELDS.common.map(f => <FormField key={f.id} field={f} />)}
            </div>

            {/* STEP 3: 種別固有情報 */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                marginBottom: "14px",
              }}>
                <div style={{
                  width: "24px", height: "24px",
                  background: `linear-gradient(135deg, ${TYPE_FIELDS[selectedType]?.color}, ${TYPE_FIELDS[selectedType]?.color}aa)`,
                  borderRadius: "50%", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800, flexShrink: 0,
                }}>3</div>
                <span style={{ fontWeight: 700, color: DS.navy, fontSize: "14px" }}>
                  {typeInfo?.label}固有の情報
                </span>
              </div>
              <div style={{
                background: TYPE_FIELDS[selectedType]?.bgAccent,
                borderRadius: "10px", padding: "16px",
                marginBottom: "16px",
              }}>
                {typeFields.map(f => <FormField key={f.id} field={f} />)}
              </div>
            </div>

            {/* STEP 4: PR・自由記述 */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                marginBottom: "14px",
              }}>
                <div style={{
                  width: "24px", height: "24px",
                  background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                  borderRadius: "50%", color: "#1a2f5e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800, flexShrink: 0,
                }}>4</div>
                <span style={{ fontWeight: 700, color: DS.navy, fontSize: "14px" }}>
                  PRポイント・自己紹介
                </span>
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: DS.navyLight }}>
                  キャッチコピー（40文字以内） <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <input type="text" placeholder="例: 愛知・東海エリア製造業15年の実績。育成就労移行支援に特化。" style={{
                  width: "100%", padding: "10px 12px",
                  border: `1.5px solid ${DS.border}`, borderRadius: "8px",
                  fontSize: "13px", color: DS.text, outline: "none",
                  background: "#fff", boxSizing: "border-box",
                }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: DS.navyLight }}>
                  詳細説明（200文字以内） <span style={{ color: "#e53e3e" }}>*</span>
                </label>
                <textarea rows={4} placeholder="強みや実績、対応できる企業の規模や業種など、企業が知りたい情報を具体的に記載してください。" style={{
                  width: "100%", padding: "10px 12px",
                  border: `1.5px solid ${DS.border}`, borderRadius: "8px",
                  fontSize: "13px", color: DS.text, outline: "none",
                  background: "#fff", boxSizing: "border-box",
                  fontFamily: "inherit", resize: "vertical",
                }} />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 600, color: DS.navyLight }}>
                  強みタグ（自由入力、カンマ区切りで最大6個）
                </label>
                <input type="text" placeholder="例: 送出機関直結, 日本語教育, 全国対応, スピード対応" style={{
                  width: "100%", padding: "10px 12px",
                  border: `1.5px solid ${DS.border}`, borderRadius: "8px",
                  fontSize: "13px", color: DS.text, outline: "none",
                  background: "#fff", boxSizing: "border-box",
                }} />
              </div>
            </div>

            {/* プラン選択 */}
            <div style={{ marginBottom: "24px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                marginBottom: "14px",
              }}>
                <div style={{
                  width: "24px", height: "24px",
                  background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                  borderRadius: "50%", color: "#1a2f5e",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "12px", fontWeight: 800, flexShrink: 0,
                }}>5</div>
                <span style={{ fontWeight: 700, color: DS.navy, fontSize: "14px" }}>
                  掲載プランを選択
                </span>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {Object.entries(TIER_CONFIG).map(([key, cfg]) => (
                  <label key={key} style={{
                    flex: "1 1 160px",
                    border: `2px solid ${cfg.borderColor}`,
                    borderRadius: "10px",
                    padding: "14px",
                    cursor: "pointer",
                    background: key === "platinum" ? "#f0f4ff" : key === "gold" ? "#fffbec" : "#fff",
                  }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                      <input type="radio" name="plan" value={key} defaultChecked={key === "regular"} />
                      <TierBadge tier={key} />
                    </div>
                    <div style={{ fontSize: "13px", fontWeight: 800, color: DS.navy, marginBottom: "2px" }}>
                      {cfg.label}プラン
                    </div>
                    <div style={{ fontSize: "12px", color: cfg.color, fontWeight: 700 }}>
                      {cfg.price}
                    </div>
                    <div style={{ fontSize: "11px", color: DS.textLight, marginTop: "6px", lineHeight: 1.5 }}>
                      {key === "platinum" && "最上部固定表示・バナー枠・優先問い合わせ"}
                      {key === "gold" && "スポンサーセクション優先・強調カード表示"}
                      {key === "regular" && "通常リスト掲載・基本情報表示"}
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* 送信ボタン */}
            <button style={{
              width: "100%",
              background: "linear-gradient(135deg, #1a2f5e, #2a4f8e)",
              color: "#fff", border: "none",
              borderRadius: "10px", padding: "15px",
              fontSize: "15px", fontWeight: 800, cursor: "pointer",
              letterSpacing: "0.5px",
            }}>
              申し込み内容を送信する →
            </button>
            <p style={{
              textAlign: "center", color: DS.textLight,
              fontSize: "11px", marginTop: "10px",
            }}>
              送信後、担当者から3営業日以内にご連絡いたします。審査費のご案内も合わせて送付します。
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// ============================================================
// メインApp
// ============================================================
export default function PartnersDirectoryDesign() {
  const [activeTab, setActiveTab] = useState("cards");
  const [formType, setFormType] = useState("kanri");
  const [cardFilter, setCardFilter] = useState("all");

  const tabStyle = (id) => ({
    padding: "10px 24px",
    border: "none",
    borderBottom: activeTab === id ? "3px solid #c9a84c" : "3px solid transparent",
    background: "transparent",
    color: activeTab === id ? DS.navy : DS.textLight,
    fontWeight: activeTab === id ? 700 : 500,
    cursor: "pointer",
    fontSize: "14px",
    fontFamily: "inherit",
    transition: "all 0.15s",
  });

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', 'Yu Gothic UI', sans-serif",
      background: DS.bg,
      minHeight: "100vh",
    }}>
      {/* ページヘッダー */}
      <div style={{
        background: "linear-gradient(135deg, #0f1f45 0%, #1a2f5e 100%)",
        padding: "32px 24px 24px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          background: "rgba(201,168,76,0.2)",
          color: DS.gold,
          padding: "4px 14px", borderRadius: "20px",
          fontSize: "11px", fontWeight: 700, letterSpacing: "1.5px",
          marginBottom: "10px",
        }}>J-GLOW PARTNER DIRECTORY — 設計デモ</div>
        <h1 style={{ color: "#fff", margin: "0 0 6px", fontSize: "22px", fontWeight: 800 }}>
          カードUI & 掲載フォーム設計
        </h1>
        <p style={{ color: "rgba(255,255,255,0.6)", margin: 0, fontSize: "13px" }}>
          5種別 × 3ティア の表示パターンと申し込みフォーム
        </p>
      </div>

      {/* タブ */}
      <div style={{ background: "#fff", borderBottom: `1px solid ${DS.border}`, display: "flex", paddingLeft: "24px" }}>
        <button style={tabStyle("cards")} onClick={() => setActiveTab("cards")}>カードUI プレビュー</button>
        <button style={tabStyle("form")} onClick={() => setActiveTab("form")}>掲載申し込みフォーム</button>
      </div>

      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 16px" }}>

        {/* ============ カードタブ ============ */}
        {activeTab === "cards" && (
          <>
            {/* 凡例 */}
            <div style={{
              background: "#fff", borderRadius: "12px",
              padding: "16px 20px", marginBottom: "24px",
              border: `1px solid ${DS.border}`,
              display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "center",
            }}>
              <span style={{ fontSize: "13px", fontWeight: 700, color: DS.navy }}>ティア表示ルール:</span>
              {Object.entries(TIER_CONFIG).map(([key, cfg]) => (
                <div key={key} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <TierBadge tier={key} />
                  <span style={{ fontSize: "12px", color: DS.textMid }}>{cfg.price}</span>
                </div>
              ))}
            </div>

            {/* プラチナセクション */}
            <div style={{ marginBottom: "8px" }}>
              <div style={{
                display: "flex", alignItems: "center", gap: "10px",
                marginBottom: "14px",
              }}>
                <span style={{
                  background: "linear-gradient(135deg, #8b9ab0, #b8c5d6)",
                  color: "#0f1f45", padding: "4px 14px",
                  borderRadius: "20px", fontSize: "11px", fontWeight: 800,
                  letterSpacing: "1px", fontFamily: "monospace",
                }}>PLATINUM</span>
                <span style={{ color: DS.textLight, fontSize: "12px" }}>最上部固定表示 ・ フルワイドバナー形式</span>
              </div>
              {SAMPLE_PARTNERS.platinum.map(p => <PlatinumCard key={p.id} partner={p} />)}
            </div>

            {/* ゴールドセクション */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              margin: "28px 0 18px",
            }}>
              <div style={{ flex: 1, height: "1px", background: DS.border }} />
              <span style={{
                background: "linear-gradient(135deg, #c9a84c, #f0d080)",
                color: "#1a2f5e", padding: "4px 14px",
                borderRadius: "20px", fontSize: "11px", fontWeight: 800,
                letterSpacing: "1px", fontFamily: "monospace",
              }}>GOLD SPONSOR</span>
              <div style={{ flex: 1, height: "1px", background: DS.border }} />
            </div>
            {SAMPLE_PARTNERS.gold.map(p => <GoldCard key={p.id} partner={p} />)}

            {/* レギュラーセクション */}
            <div style={{
              display: "flex", alignItems: "center", gap: "12px",
              margin: "28px 0 18px",
            }}>
              <div style={{ flex: 1, height: "1px", background: DS.border }} />
              <span style={{ color: DS.textLight, fontSize: "12px", whiteSpace: "nowrap" }}>掲載会員</span>
              <div style={{ flex: 1, height: "1px", background: DS.border }} />
            </div>
            {SAMPLE_PARTNERS.regular.map(p => <RegularCard key={p.id} partner={p} />)}

            {/* 種別カラー凡例 */}
            <div style={{
              background: "#fff", borderRadius: "12px",
              padding: "16px 20px", marginTop: "28px",
              border: `1px solid ${DS.border}`,
            }}>
              <div style={{ fontSize: "13px", fontWeight: 700, color: DS.navy, marginBottom: "12px" }}>
                種別カラーコード
              </div>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {PARTNER_TYPES.map(pt => {
                  const f = TYPE_FIELDS[pt.id];
                  return (
                    <div key={pt.id} style={{
                      background: f.bgAccent, borderRadius: "8px",
                      padding: "8px 14px", fontSize: "12px",
                      color: f.color, fontWeight: 700,
                    }}>
                      {pt.icon} {pt.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* ============ フォームタブ ============ */}
        {activeTab === "form" && (
          <ApplicationForm selectedType={formType} onTypeChange={setFormType} />
        )}

      </div>
    </div>
  );
}
