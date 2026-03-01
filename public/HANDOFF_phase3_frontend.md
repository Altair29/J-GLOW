# パートナーディレクトリ Phase 3: フロントエンド実装

## 前提（完了済み）
- `supabase/migrations/00036_partners_extended.sql` 実行済み
- `src/types/database.ts` に `PartnerType`, `PlanTier`, `PartnerStatus`, `Partner` 型追加済み
- `PartnersAdmin.tsx`, `PartnerDirectory.tsx` はレガシー型参照に切り替え済み

## デザイン参照
- `partners-directory-design.jsx` — カードUI・フォームの完成デザイン（インラインスタイル実装）
- ブランドカラー: ネイビー `#1a2f5e`（`var(--biz-primary)`）、ゴールド `#c9a84c`（`var(--biz-accent)`）

---

## STEP 1: 定数ファイル作成

### `src/lib/partners-config.ts`（新規作成）

```typescript
import type { PartnerType, PlanTier } from '@/types/database';

export const TIER_CONFIG: Record<PlanTier, {
  label: string;
  badge: string;
  price: string;
  borderColor: string;
  cardBg: string;
  badgeBg: string;
  badgeColor: string;
  shadow: string;
  hoverShadow: string;
}> = {
  platinum: {
    label: 'プラチナ',
    badge: 'PLATINUM',
    price: '¥150,000〜 / 月',
    borderColor: '#8b9ab0',
    cardBg: 'linear-gradient(145deg, #f0f4ff 0%, #e8edf8 100%)',
    badgeBg: 'linear-gradient(135deg, #8b9ab0, #b8c5d6)',
    badgeColor: '#0f1f45',
    shadow: '0 6px 32px rgba(107,127,163,0.18)',
    hoverShadow: '0 16px 56px rgba(107,127,163,0.3)',
  },
  gold: {
    label: 'ゴールド',
    badge: 'GOLD',
    price: '¥80,000〜 / 月',
    borderColor: '#c9a84c',
    cardBg: 'linear-gradient(145deg, #fffef8 0%, #fffbec 100%)',
    badgeBg: 'linear-gradient(135deg, #c9a84c, #f0d080)',
    badgeColor: '#1a2f5e',
    shadow: '0 3px 16px rgba(201,168,76,0.15)',
    hoverShadow: '0 12px 40px rgba(201,168,76,0.28)',
  },
  regular: {
    label: 'レギュラー',
    badge: 'MEMBER',
    price: '審査費のみ ¥30,000',
    borderColor: '#dce4ef',
    cardBg: '#ffffff',
    badgeBg: '#e8edf5',
    badgeColor: '#1a2f5e',
    shadow: '0 1px 4px rgba(0,0,0,0.05)',
    hoverShadow: '0 4px 20px rgba(26,47,94,0.1)',
  },
};

export const PARTNER_TYPE_CONFIG: Record<PartnerType, {
  label: string;
  icon: string;
  color: string;
  bgAccent: string;
}> = {
  kanri:    { label: '監理団体',     icon: '🏢', color: '#2d6a4f', bgAccent: '#d8f3dc' },
  support:  { label: '登録支援機関', icon: '🤝', color: '#1d6fa4', bgAccent: '#d0eaf8' },
  gyosei:   { label: '行政書士',     icon: '📋', color: '#6b4226', bgAccent: '#fde8d8' },
  bengoshi: { label: '弁護士',       icon: '⚖️', color: '#5b2333', bgAccent: '#fdd8de' },
  sharoshi: { label: '社労士',       icon: '📊', color: '#4a3580', bgAccent: '#e6e0f8' },
};

// 種別ごとのビザ選択肢（フィルターパネルで使用）
export const TYPE_VISA_OPTIONS: Record<PartnerType | 'all', string[]> = {
  all:      ['育成就労', '技能実習', '特定技能1号', '特定技能2号', '技術・人文・国際', '留学', '経営管理'],
  kanri:    ['育成就労', '技能実習'],
  support:  ['特定技能1号'],
  gyosei:   ['育成就労', '技能実習', '特定技能1号', '特定技能2号', '技術・人文・国際', '経営管理', '留学', '高度人材'],
  bengoshi: ['育成就労', '技能実習', '特定技能1号', '特定技能2号', '技術・人文・国際', '経営管理', '不法就労対応', '異議申立'],
  sharoshi: ['就業規則', '社会保険', '雇用保険', '助成金', '給与計算'],
};

export const REGION_OPTIONS = ['北海道', '東北', '関東', '東海', '関西', '中国・四国', '九州・沖縄', '全国'];
export const INDUSTRY_OPTIONS = ['製造業', '建設業', '農業', '介護', '食品加工', 'IT', 'サービス業', '溶接・溶断', '塗装', '繊維'];
export const COUNTRY_OPTIONS = ['ベトナム', 'インドネシア', 'フィリピン', 'ミャンマー', '中国', 'カンボジア', 'タイ'];
```

---

## STEP 2: 共通バッジコンポーネント

### `src/components/business/partners/TierBadge.tsx`（新規作成）

```typescript
import { TIER_CONFIG } from '@/lib/partners-config';
import type { PlanTier } from '@/types/database';

export function TierBadge({ tier }: { tier: PlanTier }) {
  const cfg = TIER_CONFIG[tier];
  return (
    <span
      style={{ background: cfg.badgeBg, color: cfg.badgeColor }}
      className="px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest whitespace-nowrap font-mono"
    >
      {cfg.badge}
    </span>
  );
}
```

### `src/components/business/partners/TypeBadge.tsx`（新規作成）

```typescript
import { PARTNER_TYPE_CONFIG } from '@/lib/partners-config';
import type { PartnerType } from '@/types/database';

export function TypeBadge({ type }: { type: PartnerType }) {
  const cfg = PARTNER_TYPE_CONFIG[type];
  return (
    <span
      style={{ background: cfg.bgAccent, color: cfg.color }}
      className="px-2.5 py-0.5 rounded text-[11px] font-bold whitespace-nowrap"
    >
      {cfg.icon} {cfg.label}
    </span>
  );
}
```

---

## STEP 3: カードコンポーネント

3ファイルを新規作成。**デザインは `partners-directory-design.jsx` の該当コンポーネントをそのまま移植**する。
インラインスタイルのままでも可（Tailwindへの変換は任意）。
`'use client'` ディレクティブを先頭に追加する。

### `src/components/business/partners/PlatinumCard.tsx`

移植元: `partners-directory-design.jsx` の `PlatinumCard` コンポーネント

変更点のみ：
- props型を `{ partner: Partner }` に変更（`isSponsored` props は不要、削除）
- `partner.specialties` は `Record<string, string>` 型（DBのJSONBカラム）
- `partner.specialty_visas` → ビザタグ表示
- `partner.specialty_industries` → 業種タグ表示
- `partner.specialty_tags` → 強みタグ表示
- `partner.specialty_countries` → 送出国表示
- 「無料で相談する」ボタンに `onClick` で `/business/partners/[id]/contact` へのルーティング追加
  ```typescript
  import { useRouter } from 'next/navigation';
  const router = useRouter();
  // ボタンのonClick:
  onClick={() => router.push(`/business/partners/${partner.id}/contact`)}
  ```

### `src/components/business/partners/GoldCard.tsx`

移植元: `partners-directory-design.jsx` の `GoldCard` コンポーネント

変更点: PlatinumCardと同様のprops型・フィールド名変更のみ

### `src/components/business/partners/RegularCard.tsx`

移植元: `partners-directory-design.jsx` の `RegularCard` コンポーネント

変更点: PlatinumCardと同様のprops型・フィールド名変更のみ

---

## STEP 4: フィルターパネル

### `src/components/business/partners/FilterPanel.tsx`（新規作成）

```typescript
'use client';

import { PARTNER_TYPE_CONFIG, REGION_OPTIONS, INDUSTRY_OPTIONS, COUNTRY_OPTIONS, TYPE_VISA_OPTIONS } from '@/lib/partners-config';
import type { PartnerType } from '@/types/database';

export interface FilterState {
  keyword: string;
  type: PartnerType | 'all';
  regions: string[];
  visas: string[];
  industries: string[];
  countries: string[];
}

interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  totalCount: number;
}

export function FilterPanel({ filters, onChange, totalCount }: FilterPanelProps) {
  const visaOptions = TYPE_VISA_OPTIONS[filters.type];

  const toggle = (key: 'regions' | 'visas' | 'industries' | 'countries', value: string) => {
    const current = filters[key];
    onChange({
      ...filters,
      [key]: current.includes(value)
        ? current.filter(v => v !== value)
        : [...current, value],
      // 種別変更時はビザフィルターをリセット
      ...(key === 'regions' ? {} : {}),
    });
  };

  const setType = (type: PartnerType | 'all') => {
    onChange({ ...filters, type, visas: [] }); // 種別変更でビザリセット
  };

  return (
    <div className="bg-white rounded-xl p-5 mb-5 shadow-sm border border-[#dce4ef]">
      {/* キーワード */}
      <input
        type="text"
        placeholder="キーワード検索（団体名、対応業種など）"
        value={filters.keyword}
        onChange={e => onChange({ ...filters, keyword: e.target.value })}
        className="w-full px-4 py-2.5 border border-[#dce4ef] rounded-lg text-sm mb-4 outline-none focus:border-[#1a2f5e]"
      />

      {/* 種別選択 */}
      <div className="mb-4">
        <div className="text-xs font-bold text-[#1a2f5e] mb-2">種別</div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setType('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
              filters.type === 'all'
                ? 'border-[#1a2f5e] bg-[#e8edf5] text-[#1a2f5e]'
                : 'border-[#dce4ef] bg-white text-[#718096]'
            }`}
          >
            すべて
          </button>
          {(Object.entries(PARTNER_TYPE_CONFIG) as [PartnerType, typeof PARTNER_TYPE_CONFIG[PartnerType]][]).map(([key, cfg]) => (
            <button
              key={key}
              onClick={() => setType(key)}
              style={filters.type === key ? { background: cfg.bgAccent, color: cfg.color, borderColor: cfg.color } : {}}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                filters.type === key ? '' : 'border-[#dce4ef] bg-white text-[#718096]'
              }`}
            >
              {cfg.icon} {cfg.label}
            </button>
          ))}
        </div>
      </div>

      {/* 地域 */}
      <div className="mb-4">
        <div className="text-xs font-bold text-[#1a2f5e] mb-2">対応エリア</div>
        <div className="flex flex-wrap gap-1.5">
          {REGION_OPTIONS.map(r => (
            <label key={r} className="flex items-center gap-1 bg-[#f4f7fb] border border-[#dce4ef] rounded px-2 py-1 text-xs cursor-pointer">
              <input type="checkbox" checked={filters.regions.includes(r)} onChange={() => toggle('regions', r)} className="cursor-pointer" />
              {r}
            </label>
          ))}
        </div>
      </div>

      {/* ビザ（種別に連動） */}
      <div className="mb-4">
        <div className="text-xs font-bold text-[#1a2f5e] mb-2">
          {filters.type === 'sharoshi' ? '対応サービス' : 'ビザ・制度'}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {visaOptions.map(v => (
            <label key={v} className="flex items-center gap-1 bg-[#e8f0ff] border border-[#c0d0e8] rounded px-2 py-1 text-xs cursor-pointer text-[#1a2f5e]">
              <input type="checkbox" checked={filters.visas.includes(v)} onChange={() => toggle('visas', v)} className="cursor-pointer" />
              {v}
            </label>
          ))}
        </div>
      </div>

      {/* 分野 */}
      <div className="mb-4">
        <div className="text-xs font-bold text-[#1a2f5e] mb-2">業種・分野</div>
        <div className="flex flex-wrap gap-1.5">
          {INDUSTRY_OPTIONS.map(i => (
            <label key={i} className="flex items-center gap-1 bg-[#f4f7fb] border border-[#dce4ef] rounded px-2 py-1 text-xs cursor-pointer">
              <input type="checkbox" checked={filters.industries.includes(i)} onChange={() => toggle('industries', i)} className="cursor-pointer" />
              {i}
            </label>
          ))}
        </div>
      </div>

      {/* 送出国（監理団体・登録支援機関のみ表示） */}
      {(filters.type === 'kanri' || filters.type === 'support' || filters.type === 'all') && (
        <div>
          <div className="text-xs font-bold text-[#1a2f5e] mb-2">送出国・国籍</div>
          <div className="flex flex-wrap gap-1.5">
            {COUNTRY_OPTIONS.map(c => (
              <label key={c} className="flex items-center gap-1 bg-[#f4f7fb] border border-[#dce4ef] rounded px-2 py-1 text-xs cursor-pointer">
                <input type="checkbox" checked={filters.countries.includes(c)} onChange={() => toggle('countries', c)} className="cursor-pointer" />
                {c}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 件数表示 */}
      <div className="mt-4 pt-4 border-t border-[#dce4ef] text-sm text-[#718096]">
        <strong className="text-[#1a2f5e]">{totalCount}件</strong>の専門家が見つかりました
      </div>
    </div>
  );
}
```

---

## STEP 5: メイン検索コンポーネント

### `src/components/business/partners/PartnersSearch.tsx`（新規作成）

```typescript
'use client';

import { useState, useMemo } from 'react';
import type { Partner } from '@/types/database';
import { FilterPanel, FilterState } from './FilterPanel';
import { PlatinumCard } from './PlatinumCard';
import { GoldCard } from './GoldCard';
import { RegularCard } from './RegularCard';

interface PartnersSearchProps {
  initialPlatinum: Partner[];
  initialGold: Partner[];
  initialRegular: Partner[];
}

const DEFAULT_FILTERS: FilterState = {
  keyword: '',
  type: 'all',
  regions: [],
  visas: [],
  industries: [],
  countries: [],
};

function matchesFilter(partner: Partner, filters: FilterState): boolean {
  if (filters.type !== 'all' && partner.partner_type !== filters.type) return false;

  if (filters.keyword) {
    const kw = filters.keyword.toLowerCase();
    if (!partner.name.toLowerCase().includes(kw) &&
        !(partner.catch_copy ?? '').toLowerCase().includes(kw) &&
        !(partner.description ?? '').toLowerCase().includes(kw)) return false;
  }

  if (filters.regions.length > 0) {
    if (!filters.regions.some(r => partner.regions?.includes(r))) return false;
  }

  if (filters.visas.length > 0) {
    if (!filters.visas.some(v => partner.specialty_visas?.includes(v))) return false;
  }

  if (filters.industries.length > 0) {
    if (!filters.industries.some(i => partner.specialty_industries?.includes(i))) return false;
  }

  if (filters.countries.length > 0) {
    if (!filters.countries.some(c => partner.specialty_countries?.includes(c))) return false;
  }

  return true;
}

export function PartnersSearch({ initialPlatinum, initialGold, initialRegular }: PartnersSearchProps) {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);

  const { platinum, gold, regular } = useMemo(() => ({
    platinum: initialPlatinum.filter(p => matchesFilter(p, filters)),
    gold: initialGold.filter(p => matchesFilter(p, filters)),
    regular: initialRegular.filter(p => matchesFilter(p, filters)),
  }), [initialPlatinum, initialGold, initialRegular, filters]);

  const total = platinum.length + gold.length + regular.length;

  return (
    <div className="min-h-screen" style={{ background: '#f2f5f9', fontFamily: "'Noto Sans JP', 'Hiragino Sans', sans-serif" }}>

      {/* ヘッダー */}
      <div style={{ background: 'linear-gradient(135deg, #0f1f45 0%, #1a2f5e 100%)', padding: '40px 24px 32px', textAlign: 'center' }}>
        <div style={{ display: 'inline-block', background: 'rgba(201,168,76,0.2)', color: '#c9a84c', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 700, letterSpacing: '1.5px', marginBottom: '12px' }}>
          J-GLOW パートナーディレクトリ
        </div>
        <h1 style={{ color: '#fff', margin: '0 0 8px', fontSize: '26px', fontWeight: 800 }}>
          外国人雇用の専門家を探す
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.65)', margin: 0, fontSize: '13px' }}>
          監理団体・行政書士・登録支援機関・弁護士・社労士 全国掲載
        </p>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '28px 16px' }}>

        {/* フィルター */}
        <FilterPanel filters={filters} onChange={setFilters} totalCount={total} />

        {/* プラチナ */}
        {platinum.length > 0 && (
          <div className="mb-2">
            <div className="flex items-center gap-2.5 mb-3">
              <span style={{ background: 'linear-gradient(135deg, #8b9ab0, #b8c5d6)', color: '#0f1f45', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', fontFamily: 'monospace' }}>
                PLATINUM
              </span>
              <span className="text-xs text-[#718096]">最上部固定 ・ 優先表示</span>
            </div>
            {platinum.map(p => <PlatinumCard key={p.id} partner={p} />)}
          </div>
        )}

        {/* ゴールドセパレーター */}
        {gold.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-[#dce4ef]" />
              <span style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#1a2f5e', padding: '4px 14px', borderRadius: '20px', fontSize: '11px', fontWeight: 800, letterSpacing: '1px', fontFamily: 'monospace' }}>
                GOLD SPONSOR
              </span>
              <div className="flex-1 h-px bg-[#dce4ef]" />
            </div>
            {gold.map(p => <GoldCard key={p.id} partner={p} />)}
          </>
        )}

        {/* レギュラーセパレーター */}
        {regular.length > 0 && (
          <>
            <div className="flex items-center gap-3 my-7">
              <div className="flex-1 h-px bg-[#dce4ef]" />
              <span className="text-xs text-[#718096] whitespace-nowrap">掲載会員</span>
              <div className="flex-1 h-px bg-[#dce4ef]" />
            </div>
            {regular.map(p => <RegularCard key={p.id} partner={p} />)}
          </>
        )}

        {/* 0件 */}
        {total === 0 && (
          <div className="text-center py-16 bg-white rounded-xl">
            <div className="text-4xl mb-4">🔍</div>
            <p className="text-[#718096]">条件に合う専門家が見つかりませんでした。</p>
            <p className="text-sm text-[#718096]">絞り込み条件を変更してみてください。</p>
          </div>
        )}

        {/* 掲載CTAバナー */}
        <div style={{ background: 'linear-gradient(135deg, #0f1f45, #1a2f5e)', borderRadius: '12px', padding: '28px 24px', marginTop: '40px', textAlign: 'center', boxShadow: '0 4px 20px rgba(26,47,94,0.2)' }}>
          <div style={{ color: '#c9a84c', fontSize: '11px', fontWeight: 700, letterSpacing: '1px', marginBottom: '8px' }}>
            監理団体・行政書士・登録支援機関・弁護士・社労士の方へ
          </div>
          <h3 style={{ color: '#fff', margin: '0 0 8px', fontSize: '18px', fontWeight: 800 }}>
            J-GLOWに掲載しませんか？
          </h3>
          <p style={{ color: 'rgba(255,255,255,0.7)', margin: '0 0 20px', fontSize: '13px', lineHeight: 1.7 }}>
            月間●●社の企業が外国人雇用の相談先を探しています。<br />
            初期審査費のみで掲載開始できます。
          </p>
          <a href="/business/partners/apply">
            <button style={{ background: 'linear-gradient(135deg, #c9a84c, #f0d080)', color: '#1a2f5e', border: 'none', borderRadius: '8px', padding: '12px 28px', fontSize: '14px', fontWeight: 800, cursor: 'pointer' }}>
              掲載を申し込む（無料相談）
            </button>
          </a>
        </div>

      </div>
    </div>
  );
}
```

---

## STEP 6: ページファイル更新

### `src/app/business/partners/page.tsx`（既存ファイルを全書き換え）

```typescript
import { createClient } from '@/lib/supabase/server';
import { PartnersSearch } from '@/components/business/partners/PartnersSearch';

export const revalidate = 60;

export default async function PartnersPage() {
  const supabase = createClient();

  const [{ data: platinum }, { data: gold }, { data: regular }] = await Promise.all([
    supabase.from('partners').select('*').eq('status', 'active').eq('plan_tier', 'platinum').order('display_order'),
    supabase.from('partners').select('*').eq('status', 'active').eq('plan_tier', 'gold').order('display_order'),
    supabase.from('partners').select('*').eq('status', 'active').eq('plan_tier', 'regular').order('updated_at', { ascending: false }),
  ]);

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

## STEP 7: テストデータ投入

実装確認用に以下をSupabase SQL Editorで実行：

```sql
INSERT INTO partners (
  name, catch_copy, description, partner_type, plan_tier, status, display_order,
  regions, prefectures, specialty_visas, specialty_industries, specialty_countries, specialty_tags,
  permit_type, permit_no, founded_year,
  specialties, rating, review_count, monthly_inquiry_count
) VALUES
(
  '協同組合 東海外国人支援センター',
  '愛知・東海エリア製造業15年の実績。育成就労移行支援に特化。',
  '愛知県内の製造業を中心に15年の実績。育成就労制度への移行支援に特化したサポートチームを設置。',
  'kanri', 'platinum', 'active', 1,
  ARRAY['東海', '中部'], ARRAY['愛知県'],
  ARRAY['育成就労', '技能実習'],
  ARRAY['製造業', '建設業', '食品加工', '溶接・溶断'],
  ARRAY['ベトナム', 'インドネシア', 'フィリピン'],
  ARRAY['送出機関直結', '日本語教育', '生活支援', '入国前研修'],
  '一般監理事業', '愛知第12-345678号', 2008,
  '{"組合員企業数": "142社", "現在管理中": "380名", "対応分野": "8分野"}'::jsonb,
  4.8, 23, 42
),
(
  '行政書士法人 グローバルビザ事務所',
  '年間200件超の申請実績。許可率98.7%。オンライン全国対応。',
  '特定技能ビザ申請の専門事務所。年間200件以上の申請実績。オンライン対応可能で全国対応。',
  'gyosei', 'gold', 'active', 1,
  ARRAY['関西', '全国'], ARRAY['大阪府'],
  ARRAY['特定技能1号', '技術・人文・国際', '育成就労'],
  ARRAY['IT', '介護', '製造業', 'サービス業'],
  ARRAY['中国', 'フィリピン', 'ミャンマー'],
  ARRAY['在留資格申請', '書類作成', 'オンライン対応', 'スピード対応'],
  '行政書士法人', '大阪府行政書士会 No.12345', 2012,
  '{"年間申請件数": "200件以上", "許可率": "98.7%", "対応ビザ": "8種類"}'::jsonb,
  4.9, 41, 38
),
(
  'NPO法人 関西外国人労働支援機構',
  '特定技能外国人の生活支援・日本語学習支援に特化。',
  '特定技能外国人の生活支援・日本語学習支援に強み。関西圏全域対応。',
  'support', 'regular', 'active', 1,
  ARRAY['関西'], ARRAY['大阪府'],
  ARRAY['特定技能1号'],
  ARRAY['介護', '飲食業'],
  ARRAY['ベトナム'],
  ARRAY['生活支援', '住居確保', '日本語支援', '定期面談'],
  '登録支援機関', '登20-123456', 2019,
  '{"担当可能人数": "50名まで", "対応言語": "3言語", "相談対応": "24時間"}'::jsonb,
  4.5, 8, 12
),
(
  '社会保険労務士 田村人事労務事務所',
  '外国人雇用の社会保険・助成金申請に特化した専門事務所。',
  '外国人雇用専門の社労士事務所。助成金申請から就業規則多言語化まで対応。',
  'sharoshi', 'regular', 'active', 2,
  ARRAY['関東'], ARRAY['東京都'],
  ARRAY['就業規則', '社会保険', '助成金'],
  ARRAY['製造業', 'IT', '介護'],
  ARRAY['ベトナム', '中国', 'インドネシア'],
  ARRAY['助成金申請', '社会保険', '就業規則', '給与計算'],
  '社会保険労務士', '東京都社労士会 No.98765', 2015,
  '{"対応助成金": "8種類", "顧問先": "35社", "給与計算対応": "4言語"}'::jsonb,
  4.6, 14, 19
);
```

---

## ディレクトリ構成（最終）

```
src/
├── lib/
│   └── partners-config.ts            # ★ 新規
├── components/business/partners/
│   ├── TierBadge.tsx                 # ★ 新規
│   ├── TypeBadge.tsx                 # ★ 新規
│   ├── PlatinumCard.tsx              # ★ 新規（design.jsxから移植）
│   ├── GoldCard.tsx                  # ★ 新規（design.jsxから移植）
│   ├── RegularCard.tsx               # ★ 新規（design.jsxから移植）
│   ├── FilterPanel.tsx               # ★ 新規
│   └── PartnersSearch.tsx            # ★ 新規
└── app/business/partners/
    └── page.tsx                      # ★ 既存を全書き換え
```

## 完了確認チェックリスト

- [ ] `src/lib/partners-config.ts` 作成済み
- [ ] `TierBadge`, `TypeBadge` コンポーネント作成済み
- [ ] `PlatinumCard`, `GoldCard`, `RegularCard` コンポーネント作成済み（design.jsxデザイン反映）
- [ ] `FilterPanel` 作成済み（種別変更でビザ選択肢が切り替わる）
- [ ] `PartnersSearch` 作成済み（useMemoでフィルタリング）
- [ ] `page.tsx` 更新済み（SSRで3ティア別取得）
- [ ] テストデータ4件投入済み
- [ ] `/business/partners` で3ティア表示確認
- [ ] フィルターで絞り込み動作確認
- [ ] ビルドエラーなし（`next build` または `next dev`）
