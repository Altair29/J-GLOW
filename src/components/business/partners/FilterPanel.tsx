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
