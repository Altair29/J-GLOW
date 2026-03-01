# パートナーディレクトリ実装 — Claude Code ハンドオフドキュメント

## 概要
J-GLOWプラットフォームの `/business/partners` ページを全面リニューアルする。
監理団体・登録支援機関・行政書士・弁護士・社労士の5種別 × プラチナ/ゴールド/レギュラーの3ティア表示に対応したパートナーディレクトリを実装する。

## 参照ファイル
- 設計デモ（カードUI・フォーム）: `partners-directory-design.jsx`（Claudeが作成済み）
- 既存パートナー検索: `partners-search.jsx`（現行コード）
- プロジェクト構成: `CLAUDE.md`

---

## Phase 1: DBマイグレーション

### ファイル: `supabase/migrations/00036_partners_extended.sql`

```sql
-- partnersテーブルの拡張（既存テーブルに追加）
ALTER TABLE partners
  -- ティア管理
  ADD COLUMN IF NOT EXISTS plan_tier TEXT DEFAULT 'regular' CHECK (plan_tier IN ('platinum', 'gold', 'regular')),
  ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS display_order INT DEFAULT 999,

  -- 種別
  ADD COLUMN IF NOT EXISTS partner_type TEXT CHECK (partner_type IN ('kanri', 'support', 'gyosei', 'bengoshi', 'sharoshi')),

  -- エリア（配列化）
  ADD COLUMN IF NOT EXISTS regions TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS prefectures TEXT[] DEFAULT '{}',

  -- 強み
  ADD COLUMN IF NOT EXISTS specialty_visas TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specialty_industries TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specialty_countries TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS specialty_tags TEXT[] DEFAULT '{}',

  -- 表示用データ
  ADD COLUMN IF NOT EXISTS catch_copy TEXT,           -- キャッチコピー40文字
  ADD COLUMN IF NOT EXISTS logo_url TEXT,
  ADD COLUMN IF NOT EXISTS founded_year INT,
  ADD COLUMN IF NOT EXISTS permit_type TEXT,          -- 許可区分
  ADD COLUMN IF NOT EXISTS permit_no TEXT,            -- 許可・登録番号
  ADD COLUMN IF NOT EXISTS employee_count TEXT,

  -- 種別固有データ（JSONB）
  ADD COLUMN IF NOT EXISTS type_specific JSONB DEFAULT '{}',
  -- kanri: { member_count, managing_count, industries_19 }
  -- support: { max_support, reg_no, support_menu }
  -- gyosei: { annual_cases, approval_rate, online_support }
  -- bengoshi: { immigration_cases, dispute_types, initial_free }
  -- sharoshi: { client_count, subsidies, payroll_languages, services }

  -- スペック表示（カードの数値ボックス用、最大3つ）
  ADD COLUMN IF NOT EXISTS specialties JSONB DEFAULT '{}',
  -- 例: { "組合員企業数": "142社", "現在管理中": "380名" }

  -- 問い合わせ計測
  ADD COLUMN IF NOT EXISTS monthly_inquiry_count INT DEFAULT 0,
  ADD COLUMN IF NOT EXISTS total_inquiry_count INT DEFAULT 0,

  -- 評価
  ADD COLUMN IF NOT EXISTS rating NUMERIC(3,1) DEFAULT 0,
  ADD COLUMN IF NOT EXISTS review_count INT DEFAULT 0,

  -- ステータス
  ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'suspended'));

-- インデックス
CREATE INDEX IF NOT EXISTS idx_partners_tier ON partners(plan_tier, display_order);
CREATE INDEX IF NOT EXISTS idx_partners_type ON partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_regions ON partners USING GIN(regions);
CREATE INDEX IF NOT EXISTS idx_partners_visas ON partners USING GIN(specialty_visas);
CREATE INDEX IF NOT EXISTS idx_partners_industries ON partners USING GIN(specialty_industries);
CREATE INDEX IF NOT EXISTS idx_partners_status ON partners(status);

-- RLS（既存ポリシーに追加）
-- activeなパートナーは全員閲覧可
CREATE POLICY IF NOT EXISTS "partners_public_read" ON partners
  FOR SELECT USING (status = 'active');
-- adminは全操作可
CREATE POLICY IF NOT EXISTS "partners_admin_all" ON partners
  FOR ALL USING (is_admin());
```

---

## Phase 2: 型定義の更新

### ファイル: `src/types/database.ts` に追加

```typescript
export type PartnerType = 'kanri' | 'support' | 'gyosei' | 'bengoshi' | 'sharoshi';
export type PlanTier = 'platinum' | 'gold' | 'regular';
export type PartnerStatus = 'pending' | 'active' | 'suspended';

export interface Partner {
  id: string;
  name: string;
  catch_copy: string | null;
  description: string | null;
  partner_type: PartnerType;
  plan_tier: PlanTier;
  plan_expires_at: string | null;
  display_order: number;
  status: PartnerStatus;

  // エリア
  regions: string[];
  prefectures: string[];
  prefecture: string | null; // 旧フィールド互換

  // 強み
  specialty_visas: string[];
  specialty_industries: string[];
  specialty_countries: string[];
  specialty_tags: string[];

  // 表示
  logo_url: string | null;
  founded_year: number | null;
  permit_type: string | null;
  permit_no: string | null;
  specialties: Record<string, string>; // {"組合員企業数": "142社"}

  // 種別固有
  type_specific: Record<string, unknown>;

  // 計測
  monthly_inquiry_count: number;
  total_inquiry_count: number;
  rating: number;
  review_count: number;

  created_at: string;
  updated_at: string;
}
```

---

## Phase 3: フロントエンド実装

### 3-1. 定数・設定ファイル

**新規作成: `src/lib/partners-config.ts`**

```typescript
// デザインシステム定数
export const TIER_CONFIG = {
  platinum: {
    label: 'プラチナ',
    price: '¥150,000〜 / 月',
    badgeBg: 'linear-gradient(135deg, #8b9ab0, #b8c5d6)',
    badgeColor: '#0f1f45',
    borderColor: '#8b9ab0',
    cardBg: 'linear-gradient(145deg, #f0f4ff 0%, #e8edf8 100%)',
    shadow: '0 6px 32px rgba(107,127,163,0.18)',
  },
  gold: {
    label: 'ゴールド',
    price: '¥80,000〜 / 月',
    badgeBg: 'linear-gradient(135deg, #c9a84c, #f0d080)',
    badgeColor: '#1a2f5e',
    borderColor: '#c9a84c',
    cardBg: 'linear-gradient(145deg, #fffef8 0%, #fffbec 100%)',
    shadow: '0 3px 16px rgba(201,168,76,0.15)',
  },
  regular: {
    label: 'レギュラー',
    price: '審査費のみ ¥30,000',
    badgeBg: '#e8edf5',
    badgeColor: '#1a2f5e',
    borderColor: '#dce4ef',
    cardBg: '#ffffff',
    shadow: '0 1px 4px rgba(0,0,0,0.05)',
  },
} as const;

// 種別定義
export const PARTNER_TYPE_CONFIG = {
  kanri:     { label: '監理団体',     icon: '🏢', color: '#2d6a4f', bgAccent: '#d8f3dc' },
  support:   { label: '登録支援機関', icon: '🤝', color: '#1d6fa4', bgAccent: '#d0eaf8' },
  gyosei:    { label: '行政書士',     icon: '📋', color: '#6b4226', bgAccent: '#fde8d8' },
  bengoshi:  { label: '弁護士',       icon: '⚖️', color: '#5b2333', bgAccent: '#fdd8de' },
  sharoshi:  { label: '社労士',       icon: '📊', color: '#4a3580', bgAccent: '#e6e0f8' },
} as const;

// 種別固有の表示フィールド定義
export const TYPE_DISPLAY_FIELDS = {
  kanri:    { visaFocus: ['育成就労', '技能実習'],                   highlightKeys: ['組合員企業数', '管理中人数', '対応分野数'] },
  support:  { visaFocus: ['特定技能1号'],                             highlightKeys: ['担当可能人数', '対応言語数', '相談対応'] },
  gyosei:   { visaFocus: ['技術・人文・国際', '特定技能', '育成就労'], highlightKeys: ['年間申請件数', '許可率', '対応ビザ数'] },
  bengoshi: { visaFocus: ['全ビザ種別', '不法就労対応'],              highlightKeys: ['入管案件数', '対応紛争類型', '初回相談'] },
  sharoshi: { visaFocus: ['就業規則', '助成金', '社会保険'],          highlightKeys: ['顧問先企業数', '対応助成金数', '給与計算言語'] },
} as const;

// フィルター選択肢
export const FILTER_OPTIONS = {
  regions: ['北海道', '東北', '関東', '東海', '関西', '中国・四国', '九州・沖縄', '全国'],
  visas: ['育成就労', '技能実習', '特定技能1号', '特定技能2号', '技術・人文・国際', '留学', '経営管理'],
  industries: ['製造業', '建設業', '農業', '介護', '食品加工', 'IT', 'サービス業', '溶接・溶断', '塗装'],
  countries: ['ベトナム', 'インドネシア', 'フィリピン', 'ミャンマー', '中国', 'カンボジア', 'タイ'],
} as const;
```

---

### 3-2. ページ構成

```
src/app/business/partners/
├── page.tsx                    # メイン検索ページ（サーバーコンポーネント）
├── apply/
│   └── page.tsx                # 掲載申し込みページ
└── components/
    ├── PartnersSearch.tsx      # クライアント検索UI（フィルター・一覧）
    ├── PlatinumCard.tsx        # プラチナカード
    ├── GoldCard.tsx            # ゴールドカード
    ├── RegularCard.tsx         # レギュラーカード
    ├── FilterPanel.tsx         # フィルターパネル（種別連動）
    ├── TierBadge.tsx           # ティアバッジ
    ├── TypeBadge.tsx           # 種別バッジ
    └── ApplicationForm.tsx    # 申し込みフォーム（5STEP）
```

---

### 3-3. メインページ `page.tsx`

```typescript
// src/app/business/partners/page.tsx
import { createClient } from '@/lib/supabase/server';
import PartnersSearch from './components/PartnersSearch';

export const revalidate = 60; // 1分キャッシュ

export default async function PartnersPage() {
  const supabase = createClient();

  // ティア別に取得・ソート
  const { data: platinum } = await supabase
    .from('partners')
    .select('*')
    .eq('status', 'active')
    .eq('plan_tier', 'platinum')
    .order('display_order');

  const { data: gold } = await supabase
    .from('partners')
    .select('*')
    .eq('status', 'active')
    .eq('plan_tier', 'gold')
    .order('display_order');

  const { data: regular } = await supabase
    .from('partners')
    .select('*')
    .eq('status', 'active')
    .eq('plan_tier', 'regular')
    .order('updated_at', { ascending: false });

  return (
    <PartnersSearch
      initialPlatinum={platinum ?? []}
      initialGold={gold ?? []}
      initialRegular={regular ?? []}
    />
  );
}
```

---

### 3-4. カードコンポーネントの実装指針

`partners-directory-design.jsx` のデザインをそのままTailwindクラスに変換する。
インラインスタイルの対応表：

| インライン値 | Tailwindクラス |
|---|---|
| `#0f1f45` (navy) | `text-[#0f1f45]` / `bg-[#0f1f45]` |
| `#c9a84c` (gold) | `text-[#c9a84c]` / `border-[#c9a84c]` |
| `#f2f5f9` (bg) | `bg-[#f2f5f9]` |
| `hover: translateY(-3px)` | `hover:-translate-y-1 transition-transform` |

**PlatinumCard の必須要素:**
- 左5pxのプラチナカラー縦線アクセント
- ネイビーグラデーションヘッダー帯（ティアバッジ・種別バッジ・評価・問い合わせ数）
- ボディ：名前 + キャッチコピー + ビザ/業種タグ + `specialties` オブジェクトの数値ボックス
- フッター：強みタグ + 「詳しく見る」「無料で相談する」ボタン

**GoldCard の必須要素:**
- ゴールドボーダー2px + コーナー三角装飾
- ゴールドグラデーションヘッダーなし（カード全体で色付け）
- specialties数値ボックス（ゴールドアクセント）

**RegularCard の必須要素:**
- 横並びレイアウト（左アイコン・中情報・右ボタン）
- コンパクト・情報を絞る
- ホバーでボーダーカラー変化のみ

---

### 3-5. フィルターパネルの動作仕様

```
フィルター項目:
1. キーワード（テキスト入力）
2. 種別（ラジオ: すべて/監理団体/登録支援機関/行政書士/弁護士/社労士）
3. 地域（チェックボックス: 関東/東海/関西... ）
4. ビザ・制度（チェックボックス: 種別選択で動的変化）
   - 監理団体選択時: 育成就労・技能実習のみ表示
   - 登録支援機関選択時: 特定技能1号のみ
   - 行政書士・弁護士選択時: 全ビザ種別
   - 社労士選択時: 助成金・就業規則・社会保険
5. 分野（チェックボックス: 19分野から主要8個 + その他）
6. 送出国（チェックボックス: 監理団体・登録支援機関選択時のみ表示）
```

フィルタリングはクライアントサイドで実施（初期データはSSRで取得済み）。
`useMemo`でパフォーマンス最適化。

---

### 3-6. 掲載申し込みページ `apply/page.tsx`

`ApplicationForm.tsx` を実装。フォーム送信時の処理：

```typescript
// フォーム送信時
const handleSubmit = async (formData: PartnerFormData) => {
  // 1. Supabaseのpartnersテーブルにstatus='pending'で挿入
  const { data, error } = await supabase
    .from('partners')
    .insert({
      ...formData,
      status: 'pending',
      plan_tier: formData.selectedPlan,
    });

  // 2. Zoho Mail経由で管理者に通知メール送信
  //    （現時点ではconsole.logでスキップ可、TODO コメント残す）

  // 3. 完了画面に遷移
  router.push('/business/partners/apply/complete');
};
```

---

## Phase 4: 管理画面 `/admin/partners`

### 既存管理画面に追加する機能

```
/admin/partners/
├── page.tsx        # 一覧（既存）に以下を追加:
│                   # - ティア変更ボタン（pending→active、plan_tier変更）
│                   # - 有効期限設定
│                   # - 表示順ドラッグ&ドロップ（@dnd-kit/sortable）
│                   # - ステータスバッジ（pending/active/suspended）
└── [id]/
    └── page.tsx    # 詳細編集（既存フォームに新フィールド追加）
```

### 一覧テーブルの追加カラム

| カラム | 内容 |
|---|---|
| ティア | プラチナ/ゴールド/レギュラー バッジ |
| 種別 | 監理団体等 バッジ |
| ステータス | pending/active/suspended |
| 有効期限 | plan_expires_at（期限切れは赤表示） |
| 月間問い合わせ | monthly_inquiry_count |
| アクション | 承認・ティア変更・停止 |

---

## Phase 5: 問い合わせカウント

**新規: `src/app/api/partners/[id]/inquiry/route.ts`**

```typescript
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const supabase = createClient();
  await supabase.rpc('increment_partner_inquiry', { partner_id: params.id });
  return Response.json({ ok: true });
}
```

```sql
-- supabase/migrations/00037_partner_inquiry_function.sql
CREATE OR REPLACE FUNCTION increment_partner_inquiry(partner_id UUID)
RETURNS void AS $$
  UPDATE partners
  SET
    monthly_inquiry_count = monthly_inquiry_count + 1,
    total_inquiry_count = total_inquiry_count + 1
  WHERE id = partner_id;
$$ LANGUAGE sql SECURITY DEFINER;
```

「無料で相談する」ボタンクリック時にこのエンドポイントを叩いてからモーダル or 別ページに遷移。

---

## 実装優先順位

```
1. [必須・最初] マイグレーション 00036 実行
2. [必須]       src/lib/partners-config.ts 作成
3. [必須]       PlatinumCard / GoldCard / RegularCard コンポーネント
4. [必須]       FilterPanel（種別連動フィルター）
5. [必須]       /business/partners/page.tsx リニューアル
6. [次フェーズ] /business/partners/apply フォームページ
7. [次フェーズ] /admin/partners ティア管理UI追加
8. [後回し]     問い合わせカウントAPI
```

---

## デザイントークン（必ず守る）

```css
--navy:      #0f1f45   /* 最深ネイビー（プラチナヘッダー等） */
--navy-mid:  #1a2f5e   /* メインネイビー（biz-primary） */
--gold:      #c9a84c   /* ゴールドアクセント */
--gold-light:#f0d080   /* ゴールドライト */
--platinum:  #8b9ab0   /* プラチナシルバー */
--bg:        #f2f5f9   /* ページ背景 */
```

種別カラー（TYPE_DISPLAY_FIELDS参照）はカードタグ・フォームSTEP背景に使用。
ティアカラーはバッジ・ボーダー・シャドウに使用。
混在させないこと。

---

## 注意事項

- **既存の `partners` テーブルに旧カラムが存在する可能性あり**。`IF NOT EXISTS` で安全に追加する。
- **Tailwind v4 を使用**。`bg-[#xxx]` の任意値クラスが使える。
- **`partners-directory-design.jsx`** のインラインスタイル実装をそのまま参考にしてよい。ロジックは同一、スタイルをTailwindに変換するだけでOK。
- フォーム送信はまず **Supabase insert** だけ実装し、メール送信はTODOとして残す。
- 管理画面の既存コードを壊さないよう、**新機能は既存コンポーネントの末尾に追加**していく方針で。
