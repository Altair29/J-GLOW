'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { Partner } from '@/types/database';
import { PARTNER_TYPE_CONFIG } from '@/lib/partners-config';
import { TierBadge } from './TierBadge';
import { TypeBadge } from './TypeBadge';

const DS = {
  navy: '#0f1f45',
  textMid: '#4a5568',
  textLight: '#718096',
  gold: '#c9a84c',
  border: '#dce4ef',
};

function StarRating({ rating, size = 12 }: { rating: number; size?: number }) {
  return (
    <span style={{ fontSize: `${size}px`, color: DS.gold, letterSpacing: '1px' }}>
      {'★'.repeat(Math.round(rating))}{'☆'.repeat(5 - Math.round(rating))}
      <span style={{ color: DS.textLight, marginLeft: '4px', fontSize: `${size - 1}px` }}>
        {rating}
      </span>
    </span>
  );
}

export function RegularCard({ partner }: { partner: Partner }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const typeField = PARTNER_TYPE_CONFIG[partner.partner_type];
  const typeIcon = typeField.icon;

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#fff',
        border: '1px solid',
        borderColor: hovered ? '#aabbd4' : DS.border,
        borderRadius: '10px',
        padding: '16px 18px',
        marginBottom: '10px',
        transition: 'all 0.2s ease',
        boxShadow: hovered ? '0 4px 20px rgba(26,47,94,0.1)' : '0 1px 4px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        display: 'flex', gap: '16px', alignItems: 'flex-start',
        flexWrap: 'wrap',
      }}
    >
      {/* 左：タイプアイコン */}
      <div style={{
        width: '44px', height: '44px', flexShrink: 0,
        background: typeField.bgAccent,
        borderRadius: '10px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '20px',
      }}>
        {typeIcon}
      </div>

      {/* 中：情報 */}
      <div style={{ flex: '1 1 200px' }}>
        <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap', marginBottom: '6px' }}>
          <TierBadge tier="regular" />
          <TypeBadge type={partner.partner_type} />
          <span style={{ color: DS.textLight, fontSize: '11px' }}>📍 {partner.prefectures?.[0] ?? '—'}</span>
        </div>
        <h3 style={{ margin: '0 0 4px', color: DS.navy, fontSize: '14px', fontWeight: 700 }}>
          {partner.name}
        </h3>
        <StarRating rating={partner.rating} size={11} />
        <span style={{ color: DS.textLight, fontSize: '11px', marginLeft: '4px' }}>({partner.review_count}件)</span>
        <p style={{ color: DS.textMid, fontSize: '12px', lineHeight: 1.6, margin: '6px 0 0' }}>
          {partner.catch_copy}
        </p>
      </div>

      {/* 右：タグ + ボタン */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          {partner.specialty_tags?.slice(0, 2).map(t => (
            <span key={t} style={{
              background: typeField.bgAccent, color: typeField.color,
              padding: '2px 7px', borderRadius: '20px', fontSize: '10px', fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
        <button
          onClick={() => router.push(`/business/partners/${partner.id}/contact`)}
          style={{
            background: DS.navy, color: '#fff', border: 'none',
            borderRadius: '6px', padding: '7px 14px',
            fontSize: '12px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap',
          }}
        >相談する →</button>
      </div>
    </div>
  );
}
