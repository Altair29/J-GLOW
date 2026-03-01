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

export function GoldCard({ partner }: { partner: Partner }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const typeField = PARTNER_TYPE_CONFIG[partner.partner_type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(145deg, #fffef8 0%, #fffbec 100%)',
        border: '2px solid #c9a84c',
        borderRadius: '14px',
        padding: '20px 22px',
        marginBottom: '16px',
        transition: 'all 0.22s ease',
        boxShadow: hovered
          ? '0 12px 40px rgba(201,168,76,0.28)'
          : '0 3px 16px rgba(201,168,76,0.15)',
        transform: hovered ? 'translateY(-2px)' : 'none',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* コーナー装飾 */}
      <div style={{
        position: 'absolute', top: 0, right: 0,
        width: '60px', height: '60px',
        background: 'linear-gradient(225deg, transparent 50%, rgba(201,168,76,0.12) 50%)',
      }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <TierBadge tier="gold" />
          <TypeBadge type={partner.partner_type} />
          <span style={{ color: DS.textLight, fontSize: '12px' }}>📍 {partner.prefectures?.[0] ?? '—'}</span>
        </div>
        <span style={{ color: DS.textLight, fontSize: '12px' }}>
          月<strong style={{ color: DS.navy }}>{partner.monthly_inquiry_count}</strong>件問い合わせ
        </span>
      </div>

      <h3 style={{ margin: '0 0 6px', color: DS.navy, fontSize: '16px', fontWeight: 800 }}>
        {partner.name}
      </h3>

      <div style={{ marginBottom: '10px' }}>
        <StarRating rating={partner.rating} />
        <span style={{ color: DS.textLight, fontSize: '12px', marginLeft: '6px' }}>({partner.review_count}件)</span>
      </div>

      <p style={{ color: DS.textMid, fontSize: '13px', lineHeight: 1.7, margin: '0 0 12px' }}>
        {partner.catch_copy}
      </p>

      {/* スペック */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {partner.specialties && Object.entries(partner.specialties).map(([k, v]) => (
          <div key={k} style={{
            background: 'rgba(201,168,76,0.1)',
            border: '1px solid rgba(201,168,76,0.3)',
            borderRadius: '8px', padding: '8px 14px', textAlign: 'center',
          }}>
            <div style={{ fontSize: '15px', fontWeight: 800, color: DS.navy }}>{v}</div>
            <div style={{ fontSize: '10px', color: DS.textLight }}>{k}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '14px' }}>
        {partner.specialty_visas?.map(v => (
          <span key={v} style={{
            background: '#e8f0ff', color: '#1a2f5e',
            padding: '3px 9px', borderRadius: '4px',
            fontSize: '11px', border: '1px solid #c0d0e8', fontWeight: 600,
          }}>{v}</span>
        ))}
        {partner.specialty_industries?.slice(0, 3).map(i => (
          <span key={i} style={{
            background: '#f5f5f5', color: '#666',
            padding: '3px 9px', borderRadius: '4px',
            fontSize: '11px', border: '1px solid #e0e0e0',
          }}>{i}</span>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
          {partner.specialty_tags?.slice(0, 3).map(t => (
            <span key={t} style={{
              background: typeField.bgAccent, color: typeField.color,
              padding: '3px 8px', borderRadius: '20px', fontSize: '11px', fontWeight: 600,
            }}>{t}</span>
          ))}
        </div>
        <button
          onClick={() => router.push(`/business/partners/${partner.id}/contact`)}
          style={{
            background: 'linear-gradient(135deg, #c9a84c, #f0d080)',
            color: '#1a2f5e', border: 'none',
            borderRadius: '8px', padding: '9px 20px',
            fontSize: '13px', fontWeight: 700, cursor: 'pointer',
          }}
        >無料で相談する →</button>
      </div>
    </div>
  );
}
