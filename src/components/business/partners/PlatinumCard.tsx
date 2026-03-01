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

export function PlatinumCard({ partner }: { partner: Partner }) {
  const [hovered, setHovered] = useState(false);
  const router = useRouter();
  const typeField = PARTNER_TYPE_CONFIG[partner.partner_type];

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'linear-gradient(145deg, #f0f4ff 0%, #e8edf8 100%)',
        border: '2px solid #8b9ab0',
        borderRadius: '16px',
        padding: '0',
        marginBottom: '20px',
        transition: 'all 0.25s ease',
        boxShadow: hovered
          ? '0 16px 56px rgba(107,127,163,0.3)'
          : '0 6px 32px rgba(107,127,163,0.18)',
        transform: hovered ? 'translateY(-3px)' : 'none',
        overflow: 'hidden',
        cursor: 'pointer',
        position: 'relative',
      }}
    >
      {/* 左アクセントライン */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0,
        width: '5px',
        background: 'linear-gradient(180deg, #8b9ab0, #b8c5d6, #8b9ab0)',
      }} />

      {/* ヘッダー部 */}
      <div style={{
        background: 'linear-gradient(135deg, #1e3a6e 0%, #0f1f45 100%)',
        padding: '16px 24px 16px 28px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: '8px',
      }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
          <TierBadge tier="platinum" />
          <TypeBadge type={partner.partner_type} />
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '12px' }}>
            📍 {partner.prefectures?.[0] ?? '—'} / {partner.regions?.join('・') ?? '—'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <StarRating rating={partner.rating} size={13} />
          <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
            ({partner.review_count}件)
          </span>
          <span style={{
            background: 'rgba(201,168,76,0.25)',
            color: '#f0d080',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 600,
          }}>
            月{partner.monthly_inquiry_count}件問い合わせ
          </span>
        </div>
      </div>

      {/* ボディ */}
      <div style={{ padding: '20px 24px 20px 28px' }}>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          {/* 左：基本情報 */}
          <div style={{ flex: '1 1 300px' }}>
            <h3 style={{
              margin: '0 0 6px', color: DS.navy,
              fontSize: '19px', fontWeight: 800, lineHeight: 1.3,
            }}>
              {partner.name}
            </h3>
            <p style={{ color: DS.textMid, fontSize: '13px', lineHeight: 1.7, margin: '0 0 14px' }}>
              {partner.catch_copy}
            </p>

            {/* ビザ・分野タグ */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '12px' }}>
              {partner.specialty_visas?.map(v => (
                <span key={v} style={{
                  background: '#e8f0ff', color: '#1a2f5e',
                  padding: '3px 10px', borderRadius: '4px',
                  fontSize: '11px', border: '1px solid #c0d0e8', fontWeight: 600,
                }}>{v}</span>
              ))}
              {partner.specialty_industries?.slice(0, 3).map(i => (
                <span key={i} style={{
                  background: '#f5f5f5', color: '#555',
                  padding: '3px 10px', borderRadius: '4px',
                  fontSize: '11px', border: '1px solid #e0e0e0',
                }}>{i}</span>
              ))}
              {(partner.specialty_industries?.length ?? 0) > 3 && (
                <span style={{ color: DS.textLight, fontSize: '11px', padding: '3px 6px' }}>
                  +{(partner.specialty_industries?.length ?? 0) - 3}
                </span>
              )}
            </div>

            <div style={{ fontSize: '12px', color: DS.textLight }}>
              送出国: {partner.specialty_countries?.join('・') ?? '—'} ｜ 設立: {partner.founded_year ?? '—'}年 ｜ {partner.permit_type ?? '—'}
            </div>
          </div>

          {/* 右：スペック数字 */}
          <div style={{
            display: 'flex', gap: '16px', alignItems: 'flex-start',
            flexWrap: 'wrap',
          }}>
            {partner.specialties && Object.entries(partner.specialties).map(([k, v]) => (
              <div key={k} style={{
                textAlign: 'center',
                background: 'rgba(107,127,163,0.08)',
                border: '1px solid rgba(107,127,163,0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                minWidth: '90px',
              }}>
                <div style={{ fontSize: '18px', fontWeight: 800, color: DS.navy, lineHeight: 1.2 }}>{v}</div>
                <div style={{ fontSize: '10px', color: DS.textLight, marginTop: '4px' }}>{k}</div>
              </div>
            ))}
          </div>
        </div>

        {/* フッター */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: '16px', paddingTop: '16px',
          borderTop: '1px solid rgba(107,127,163,0.2)',
          flexWrap: 'wrap', gap: '8px',
        }}>
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
            {partner.specialty_tags?.map(t => (
              <span key={t} style={{
                background: typeField.bgAccent,
                color: typeField.color,
                padding: '3px 9px', borderRadius: '20px',
                fontSize: '11px', fontWeight: 600,
              }}>{t}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button style={{
              background: 'transparent', color: '#1a2f5e',
              border: '1.5px solid #8b9ab0',
              borderRadius: '8px', padding: '9px 18px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}>詳しく見る</button>
            <button
              onClick={() => router.push(`/business/partners/${partner.id}/contact`)}
              style={{
                background: 'linear-gradient(135deg, #1a2f5e, #2a4f8e)',
                color: '#fff', border: 'none',
                borderRadius: '8px', padding: '9px 20px',
                fontSize: '13px', fontWeight: 700, cursor: 'pointer',
              }}
            >無料で相談する →</button>
          </div>
        </div>
      </div>
    </div>
  );
}
