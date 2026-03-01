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
            月間多数の企業が外国人雇用の相談先を探しています。<br />
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
