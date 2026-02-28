'use client';

import { useState, useMemo } from 'react';
import { PARTNER_TYPE_LABELS } from '@/types/database';
import type { Partner, PartnerType } from '@/types/database';
import { Mail, Globe, Building2, MapPin, Briefcase, FileCheck } from 'lucide-react';

type Props = {
  partners: Partner[];
  theme: Record<string, string>;
};

const ALL_TYPES: { value: '' | PartnerType; label: string }[] = [
  { value: '', label: 'すべて' },
  { value: 'supervisory', label: '監理団体' },
  { value: 'admin_scrivener', label: '行政書士' },
  { value: 'support_org', label: '登録支援機関' },
];

export function PartnerDirectory({ partners, theme }: Props) {
  const [filterType, setFilterType] = useState<'' | PartnerType>('');
  const [filterPref, setFilterPref] = useState('');

  /* 都道府県一覧（データから抽出） */
  const prefectures = useMemo(() => {
    const set = new Set<string>();
    partners.forEach((p) => {
      if (p.prefecture) set.add(p.prefecture);
    });
    return Array.from(set).sort();
  }, [partners]);

  /* フィルタ適用 */
  const filtered = useMemo(() => {
    return partners.filter((p) => {
      if (filterType && p.type !== filterType) return false;
      if (filterPref && p.prefecture !== filterPref) return false;
      return true;
    });
  }, [partners, filterType, filterPref]);

  /* スポンサー / メンバー分離 */
  const sponsors = filtered.filter((p) => p.plan === 'sponsor');
  const members = filtered.filter((p) => p.plan === 'member');

  const primary = theme['--biz-primary'] || '#1a2f5e';

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      {/* フィルター */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">条件で絞り込む</h2>
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 種別フィルタ */}
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">種別</label>
            <div className="flex flex-wrap gap-2">
              {ALL_TYPES.map((t) => {
                const active = filterType === t.value;
                return (
                  <button
                    key={t.value}
                    onClick={() => setFilterType(t.value)}
                    className="px-4 py-2 text-sm rounded-full border transition-all"
                    style={
                      active
                        ? { backgroundColor: primary, color: '#fff', borderColor: primary }
                        : { backgroundColor: '#fff', color: '#374151', borderColor: '#d1d5db' }
                    }
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 都道府県フィルタ */}
          <div className="sm:w-56">
            <label className="block text-sm font-medium text-gray-600 mb-1.5">都道府県</label>
            <select
              value={filterPref}
              onChange={(e) => setFilterPref(e.target.value)}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#1a2f5e]/20"
            >
              <option value="">すべて</option>
              {prefectures.map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* スポンサーパートナー */}
      {sponsors.length > 0 && (
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 rounded-full" style={{ backgroundColor: '#c9a84c' }} />
            スポンサーパートナー
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {sponsors.map((p) => (
              <SponsorCard key={p.id} partner={p} primary={primary} />
            ))}
          </div>
        </div>
      )}

      {/* メンバーパートナー */}
      {members.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            <span className="inline-block w-1.5 h-6 rounded-full" style={{ backgroundColor: primary }} />
            パートナー一覧
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((p) => (
              <MemberCard key={p.id} partner={p} primary={primary} />
            ))}
          </div>
        </div>
      )}

      {/* 結果なし */}
      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">該当するパートナーが見つかりませんでした</p>
          <button
            onClick={() => { setFilterType(''); setFilterPref(''); }}
            className="mt-4 text-sm font-medium underline"
            style={{ color: primary }}
          >
            フィルターをリセット
          </button>
        </div>
      )}

      {/* CTA */}
      <div className="mt-16 rounded-2xl p-8 text-center text-white"
        style={{ background: `linear-gradient(135deg, ${primary} 0%, #0f1d3d 100%)` }}
      >
        <h3 className="text-xl font-bold mb-2">パートナーとして掲載しませんか？</h3>
        <p className="text-sm opacity-80 mb-6">
          J-GLOWパートナーディレクトリに掲載をご希望の機関様はお問い合わせください
        </p>
        <a
          href="mailto:info@j-glow.jp"
          className="inline-block px-6 py-3 rounded-lg font-semibold text-sm transition-all hover:shadow-lg hover:-translate-y-px"
          style={{ backgroundColor: '#c9a84c', color: '#1a2f5e' }}
        >
          掲載のお問い合わせ
        </a>
      </div>
    </section>
  );
}

/* ========================================
   スポンサーカード（大きめ）
   ======================================== */
function SponsorCard({ partner: p, primary }: { partner: Partner; primary: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow">
      {/* ヘッダー帯 */}
      <div className="px-6 py-3 flex items-center justify-between"
        style={{ backgroundColor: '#fdf8ee', borderBottom: '1px solid #f0e6cc' }}
      >
        <span className="text-xs font-bold tracking-wider uppercase"
          style={{ color: '#c9a84c' }}
        >
          SPONSOR
        </span>
        <span className="text-xs font-medium text-gray-500">
          {PARTNER_TYPE_LABELS[p.type]}
        </span>
      </div>

      <div className="p-6">
        {/* 法人名 */}
        <h3 className="text-lg font-bold mb-1" style={{ color: primary }}>
          {p.name}
        </h3>

        {/* 都道府県 */}
        {p.prefecture && (
          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-3">
            <MapPin size={14} />
            {p.prefecture}
          </div>
        )}

        {/* 紹介文 */}
        {p.description && (
          <p className="text-sm text-gray-600 mb-4 leading-relaxed">
            {p.description}
          </p>
        )}

        {/* タグ */}
        <div className="space-y-2 mb-5">
          {p.industries && p.industries.length > 0 && (
            <div className="flex items-start gap-2">
              <Briefcase size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {p.industries.map((ind) => (
                  <span key={ind} className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700">{ind}</span>
                ))}
              </div>
            </div>
          )}
          {p.visas && p.visas.length > 0 && (
            <div className="flex items-start gap-2">
              <FileCheck size={14} className="text-gray-400 mt-0.5 shrink-0" />
              <div className="flex flex-wrap gap-1.5">
                {p.visas.map((v) => (
                  <span key={v} className="text-xs px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">{v}</span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* アクション */}
        <div className="flex gap-3">
          {p.contact_email ? (
            <a
              href={`mailto:${p.contact_email}`}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-semibold rounded-lg text-white transition-all hover:shadow-md hover:-translate-y-px"
              style={{ backgroundColor: primary }}
            >
              <Mail size={15} />
              問い合わせ
            </a>
          ) : (
            <span className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg bg-gray-100 text-gray-400 cursor-not-allowed">
              <Mail size={15} />
              準備中
            </span>
          )}
          {p.website_url && (
            <a
              href={p.website_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
            >
              <Globe size={15} />
              Web
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ========================================
   メンバーカード（コンパクト）
   ======================================== */
function MemberCard({ partner: p, primary }: { partner: Partner; primary: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
      {/* バッジ行 */}
      <div className="flex items-center gap-2 mb-3">
        <span
          className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full text-white"
          style={{ backgroundColor: primary }}
        >
          MEMBER
        </span>
        <span className="text-xs text-gray-500">{PARTNER_TYPE_LABELS[p.type]}</span>
      </div>

      {/* 法人名 */}
      <h3 className="text-base font-bold text-gray-900 mb-1">{p.name}</h3>

      {/* 都道府県 */}
      {p.prefecture && (
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
          <MapPin size={12} />
          {p.prefecture}
        </div>
      )}

      {/* 紹介文 */}
      {p.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{p.description}</p>
      )}

      {/* 業種タグ */}
      {p.industries && p.industries.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {p.industries.map((ind) => (
            <span key={ind} className="text-[11px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{ind}</span>
          ))}
        </div>
      )}

      {/* アクション */}
      {p.contact_email ? (
        <a
          href={`mailto:${p.contact_email}`}
          className="inline-flex items-center gap-1.5 text-sm font-medium transition-colors"
          style={{ color: primary }}
        >
          <Mail size={14} />
          問い合わせ
        </a>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-sm text-gray-400">
          <Mail size={14} />
          準備中
        </span>
      )}
    </div>
  );
}
