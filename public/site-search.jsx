import { useState, useEffect, useRef } from "react";

// ─── Mock search data ─────────────────────────────────────────────────────────
const SEARCH_DATA = [
  // Tools
  { id: 1, category: "ツール", title: "外国人採用ナビゲーター", description: "ビザ種別・業種・コストを一括シミュレーション。採用計画の第一歩に。", path: "/business/cost-simulator", icon: "🧮", tags: ["コスト", "シミュレーター", "計画"] },
  { id: 2, category: "ツール", title: "労働条件通知書 生成ツール", description: "8言語対応。入管庁様式準拠の通知書をウィザード形式で作成・PDF出力。", path: "/business/tools/labor-notice", icon: "📄", tags: ["労働条件", "PDF", "8言語", "育成就労", "特定技能"] },
  { id: 3, category: "ツール", title: "現場指示書ビルダー", description: "安全・緊急・日常ルールを6言語で作成。印刷対応2カラムレイアウト。", path: "/business/existing-users/connect/templates", icon: "📋", tags: ["現場", "多言語", "安全", "指示書"] },
  { id: 4, category: "ツール", title: "特定技能移行チェッカー", description: "5問のウィザードで技能実習生→特定技能への移行可否を診断。", path: "/business/existing-users/ladder/checker", icon: "✅", tags: ["特定技能", "移行", "チェック", "技能実習"] },
  { id: 5, category: "ツール", title: "外国人雇用 適正診断", description: "会社の状況をヒアリングし、最適な外国人雇用の進め方を提案。", path: "/business/diagnosis", icon: "🔍", tags: ["診断", "適正", "はじめて"] },

  // Guides
  { id: 6, category: "ガイド", title: "はじめての外国人雇用 完全ガイド", description: "採用検討から入社まで7ステップで解説。初めての企業向け入門ガイド。", path: "/business/hiring-guide", icon: "📘", tags: ["はじめて", "採用", "ステップ", "入門"] },
  { id: 7, category: "ガイド", title: "育成就労ロードマップ", description: "2027年4月施行の新制度。移行スケジュールと企業の対応事項を網羅。", path: "/business/roadmap", icon: "🗺️", tags: ["育成就労", "2027", "移行", "ロードマップ"] },
  { id: 8, category: "ガイド", title: "外国人スタッフ活用ハブ", description: "雇用中企業向けのキャリアパス・スキルアップ・在留資格変更の情報集約。", path: "/business/existing-users", icon: "👥", tags: ["活用", "キャリア", "在留資格", "既存雇用"] },
  { id: 9, category: "ガイド", title: "19分野 業種別解説", description: "製造・建設・介護など全19分野の受入れ要件・送出国・コストを解説。", path: "/business/articles", icon: "🏭", tags: ["業種", "分野", "製造", "建設", "介護", "農業"] },
  { id: 10, category: "ガイド", title: "助成金情報", description: "外国人雇用に活用できる国・自治体の助成金・補助金をまとめて確認。", path: "/business/subsidies", icon: "💰", tags: ["助成金", "補助金", "コスト削減"] },

  // Partners
  { id: 11, category: "パートナー", title: "監理団体を探す", description: "全国の監理団体をエリア・業種・ビザ種別でフィルタリング検索。", path: "/business/partners?type=監理団体", icon: "🏢", tags: ["監理団体", "技能実習", "育成就労", "検索"] },
  { id: 12, category: "パートナー", title: "行政書士を探す", description: "ビザ申請・在留資格変更手続きを支援する行政書士を全国から検索。", path: "/business/partners?type=行政書士", icon: "⚖️", tags: ["行政書士", "ビザ申請", "在留資格"] },
  { id: 13, category: "パートナー", title: "登録支援機関を探す", description: "特定技能外国人の生活・就労支援を担う登録支援機関を検索。", path: "/business/partners?type=登録支援機関", icon: "🤝", tags: ["登録支援機関", "特定技能", "生活支援"] },

  // Articles
  { id: 14, category: "記事", title: "育成就労制度とは？技能実習との違いを解説", description: "2027年に施行される新制度の概要、技能実習との主な変更点を整理。", path: "/business/roadmap", icon: "📝", tags: ["育成就労", "技能実習", "制度", "違い"] },
  { id: 15, category: "記事", title: "コスト徹底解説：外国人雇用にかかる費用の全貌", description: "ビザ申請費用・監理費・送出費用・給与水準まで具体的な数字で解説。", path: "/business/hiring-guide", icon: "📊", tags: ["コスト", "費用", "給与", "監理費"] },
  { id: 16, category: "記事", title: "正直ガイド：外国人雇用の失敗パターンと対策", description: "よくある採用ミスマッチ・定着率低下・法令違反のリスクと回避法。", path: "/business/hiring-guide/honest-guide", icon: "⚠️", tags: ["失敗", "リスク", "定着", "法令"] },
];

const CATEGORIES = ["すべて", "ツール", "ガイド", "パートナー", "記事"];

const POPULAR_SEARCHES = ["育成就労", "コストシミュレーター", "監理団体", "特定技能", "労働条件通知書"];

function highlight(text, query) {
  if (!query) return text;
  const idx = text.toLowerCase().indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: "#fff3c0", color: "#1a2f5e", borderRadius: "2px", padding: "0 1px" }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

function CategoryTag({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        padding: "6px 14px",
        border: active ? "none" : "1.5px solid #d0dce8",
        borderRadius: "20px",
        fontSize: "12px",
        fontWeight: active ? 700 : 400,
        background: active ? "#1a2f5e" : "#fff",
        color: active ? "#fff" : "#555",
        cursor: "pointer",
        transition: "all 0.15s",
        whiteSpace: "nowrap",
      }}
    >
      {label}
    </button>
  );
}

function ResultCard({ item, query, isSelected }) {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href={item.path}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "block",
        textDecoration: "none",
        padding: "16px 20px",
        borderRadius: "10px",
        border: isSelected
          ? "2px solid #1a2f5e"
          : hovered ? "1.5px solid #c0d0e8" : "1.5px solid #e8eef6",
        background: isSelected ? "#f0f4ff" : hovered ? "#f8fafc" : "#fff",
        transition: "all 0.15s",
        marginBottom: "8px",
      }}
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
        <div style={{
          fontSize: "22px", lineHeight: 1,
          width: "36px", height: "36px",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0,
        }}>{item.icon}</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
            <span style={{
              background: "#e8eef6", color: "#1a2f5e",
              padding: "2px 8px", borderRadius: "4px",
              fontSize: "10px", fontWeight: 600,
              letterSpacing: "0.5px",
            }}>{item.category}</span>
            <span style={{ color: "#1a2f5e", fontWeight: 700, fontSize: "15px" }}>
              {highlight(item.title, query)}
            </span>
          </div>
          <p style={{ color: "#555", fontSize: "13px", lineHeight: 1.6, margin: "0 0 8px" }}>
            {highlight(item.description, query)}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
            {item.tags.slice(0, 4).map(tag => (
              <span key={tag} style={{
                fontSize: "11px", color: "#888",
                background: "#f4f7fb", padding: "2px 8px",
                borderRadius: "3px",
              }}>#{tag}</span>
            ))}
          </div>
        </div>
        <div style={{ color: "#aaa", fontSize: "16px", flexShrink: 0, alignSelf: "center" }}>→</div>
      </div>
    </a>
  );
}

export default function SiteSearch() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("すべて");
  const [focused, setFocused] = useState(false);
  const [selectedIdx, setSelectedIdx] = useState(-1);
  const inputRef = useRef(null);

  const results = SEARCH_DATA.filter(item => {
    const matchCat = category === "すべて" || item.category === category;
    if (!matchCat) return false;
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q) ||
      item.tags.some(t => t.toLowerCase().includes(q))
    );
  });

  const showResults = focused || query.length > 0;

  useEffect(() => {
    setSelectedIdx(-1);
  }, [query, category]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIdx(i => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIdx(i => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && selectedIdx >= 0) {
      window.location.href = results[selectedIdx].path;
    } else if (e.key === "Escape") {
      setFocused(false);
      inputRef.current?.blur();
    }
  };

  const groupedResults = CATEGORIES.slice(1).reduce((acc, cat) => {
    const items = results.filter(r => r.category === cat);
    if (items.length) acc[cat] = items;
    return acc;
  }, {});

  return (
    <div style={{
      fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif",
      background: "#f4f7fb",
      minHeight: "100vh",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a2f5e 0%, #0d1f42 100%)",
        padding: "40px 24px 36px",
        textAlign: "center",
      }}>
        <div style={{
          display: "inline-block",
          background: "rgba(201,168,76,0.2)",
          color: "#c9a84c",
          padding: "4px 14px", borderRadius: "20px",
          fontSize: "11px", fontWeight: 600, letterSpacing: "1px",
          marginBottom: "12px",
        }}>J-GLOW サイト検索</div>
        <h1 style={{
          color: "#fff", margin: "0 0 8px",
          fontSize: "24px", fontWeight: 700,
        }}>知りたい情報を検索</h1>
        <p style={{ color: "rgba(255,255,255,0.65)", margin: "0 0 28px", fontSize: "13px" }}>
          ツール・ガイド・パートナー・記事をまとめて検索できます
        </p>

        {/* Main search bar */}
        <div style={{ maxWidth: "600px", margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "flex", alignItems: "center",
            background: "#fff",
            borderRadius: "12px",
            border: focused ? "2px solid #c9a84c" : "2px solid transparent",
            boxShadow: focused ? "0 4px 24px rgba(0,0,0,0.2)" : "0 4px 16px rgba(0,0,0,0.15)",
            transition: "all 0.2s",
            overflow: "hidden",
          }}>
            <span style={{ padding: "0 14px 0 16px", fontSize: "18px", color: "#888", flexShrink: 0 }}>🔍</span>
            <input
              ref={inputRef}
              type="text"
              placeholder="例: 育成就労、コストシミュレーター、監理団体..."
              value={query}
              onChange={e => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              onKeyDown={handleKeyDown}
              style={{
                flex: 1,
                border: "none", outline: "none",
                fontSize: "15px", color: "#333",
                padding: "16px 0",
                background: "transparent",
                fontFamily: "inherit",
              }}
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                style={{
                  padding: "0 16px",
                  background: "none", border: "none",
                  color: "#aaa", fontSize: "18px",
                  cursor: "pointer", flexShrink: 0,
                }}
              >×</button>
            )}
          </div>
        </div>

        {/* Popular searches */}
        {!query && (
          <div style={{ marginTop: "16px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "12px", alignSelf: "center" }}>よく検索:</span>
            {POPULAR_SEARCHES.map(s => (
              <button
                key={s}
                onClick={() => setQuery(s)}
                style={{
                  background: "rgba(255,255,255,0.1)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: "20px",
                  color: "rgba(255,255,255,0.8)",
                  padding: "5px 14px",
                  fontSize: "12px",
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >{s}</button>
            ))}
          </div>
        )}
      </div>

      <div style={{ maxWidth: "780px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Category filter */}
        <div style={{
          display: "flex", gap: "8px", flexWrap: "wrap",
          marginBottom: "20px",
          overflowX: "auto", paddingBottom: "4px",
        }}>
          {CATEGORIES.map(cat => (
            <CategoryTag
              key={cat}
              label={cat === "すべて" ? `すべて（${results.length}）` : `${cat}（${SEARCH_DATA.filter(d => d.category === cat && (query ? (d.title.toLowerCase().includes(query.toLowerCase()) || d.description.toLowerCase().includes(query.toLowerCase()) || d.tags.some(t => t.toLowerCase().includes(query.toLowerCase()))) : true)).length}）`}
              active={category === cat}
              onClick={() => setCategory(cat)}
            />
          ))}
        </div>

        {/* Results */}
        {results.length === 0 ? (
          <div style={{
            textAlign: "center", padding: "60px 20px",
            background: "#fff", borderRadius: "12px",
          }}>
            <div style={{ fontSize: "40px", marginBottom: "16px" }}>🔎</div>
            <p style={{ color: "#555", fontSize: "15px", marginBottom: "8px" }}>
              「<strong>{query}</strong>」の検索結果が見つかりませんでした
            </p>
            <p style={{ color: "#888", fontSize: "13px" }}>
              キーワードを変えるか、カテゴリを「すべて」にしてお試しください
            </p>
            <div style={{ marginTop: "24px", display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
              {POPULAR_SEARCHES.map(s => (
                <button
                  key={s}
                  onClick={() => setQuery(s)}
                  style={{
                    background: "#f0f4ff", color: "#1a2f5e",
                    border: "1px solid #d0dcf0", borderRadius: "20px",
                    padding: "6px 14px", fontSize: "12px", cursor: "pointer",
                  }}
                >{s}</button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* Grouped by category (only when "すべて") */}
            {category === "すべて" ? (
              Object.entries(groupedResults).map(([cat, items]) => (
                <div key={cat} style={{ marginBottom: "28px" }}>
                  <div style={{
                    display: "flex", alignItems: "center", gap: "10px",
                    marginBottom: "12px",
                  }}>
                    <span style={{
                      background: "#1a2f5e", color: "#fff",
                      padding: "3px 12px", borderRadius: "20px",
                      fontSize: "11px", fontWeight: 700,
                    }}>{cat}</span>
                    <span style={{ color: "#aaa", fontSize: "12px" }}>{items.length}件</span>
                  </div>
                  {items.map((item, i) => (
                    <ResultCard
                      key={item.id}
                      item={item}
                      query={query}
                      isSelected={selectedIdx === SEARCH_DATA.indexOf(item)}
                    />
                  ))}
                </div>
              ))
            ) : (
              <div>
                <div style={{ marginBottom: "12px", color: "#555", fontSize: "13px" }}>
                  <strong style={{ color: "#1a2f5e" }}>{results.length}件</strong>の結果
                  {query && <span>（「<strong>{query}</strong>」）</span>}
                </div>
                {results.map((item, i) => (
                  <ResultCard
                    key={item.id}
                    item={item}
                    query={query}
                    isSelected={selectedIdx === i}
                  />
                ))}
              </div>
            )}
          </>
        )}

        {/* Keyboard shortcuts hint */}
        {results.length > 0 && (
          <div style={{
            textAlign: "center", marginTop: "20px",
            color: "#bbb", fontSize: "12px",
          }}>
            <kbd style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: "3px", fontSize: "11px", color: "#666" }}>↑↓</kbd> で選択　
            <kbd style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: "3px", fontSize: "11px", color: "#666" }}>Enter</kbd> で移動　
            <kbd style={{ background: "#f0f0f0", padding: "2px 6px", borderRadius: "3px", fontSize: "11px", color: "#666" }}>Esc</kbd> で閉じる
          </div>
        )}
      </div>
    </div>
  );
}
