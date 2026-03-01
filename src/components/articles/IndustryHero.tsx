'use client';

import Link from 'next/link';
import type { IndustryData } from '@/lib/industry-data';

type Props = {
  data: IndustryData;
  title: string;
  publishedAt?: string | null;
};

export default function IndustryHero({ data, title, publishedAt }: Props) {
  const visaBadges: { label: string; active: boolean }[] = [
    { label: '育成就労', active: data.visa.ikusei },
    { label: '特定技能1号', active: data.visa.tokutei1 },
    { label: '特定技能2号', active: data.visa.tokutei2 },
  ];

  return (
    <header
      style={{
        background: 'linear-gradient(135deg, #0f2044 0%, #1a2f5e 50%, #1a2f5e 100%)',
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        padding: '3rem 1.5rem 2.5rem',
      }}
    >
      {/* 装飾SVG */}
      <svg
        aria-hidden
        viewBox="0 0 24 24"
        style={{
          position: 'absolute',
          right: '3%',
          top: '50%',
          transform: 'translateY(-50%)',
          width: 'clamp(160px, 25vw, 280px)',
          height: 'clamp(160px, 25vw, 280px)',
          fill: 'rgba(255,255,255,0.06)',
          pointerEvents: 'none',
        }}
      >
        <path d={data.svgPath} />
      </svg>

      <div style={{ maxWidth: '720px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
        {/* パンくず */}
        <nav
          style={{
            fontSize: '13px',
            color: 'rgba(147,197,253,0.9)',
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0',
            alignItems: 'center',
          }}
        >
          <Link href="/business" style={{ color: 'inherit', textDecoration: 'none' }}>
            企業向けトップ
          </Link>
          <span style={{ margin: '0 8px', opacity: 0.6 }}>{'>'}</span>
          <Link href="/business/articles" style={{ color: 'inherit', textDecoration: 'none' }}>
            分野別ガイド
          </Link>
          <span style={{ margin: '0 8px', opacity: 0.6 }}>{'>'}</span>
          <span style={{ color: 'rgba(255,255,255,0.7)' }}>
            {data.name}
          </span>
        </nav>

        {/* 分野アイコン + 名前 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <span style={{ fontSize: '32px', lineHeight: 1 }}>{data.icon}</span>
          <span
            style={{
              display: 'inline-block',
              backgroundColor: 'rgba(201,168,76,0.2)',
              color: '#c9a84c',
              fontSize: '11px',
              fontWeight: 700,
              padding: '4px 14px',
              borderRadius: '999px',
              letterSpacing: '0.05em',
            }}
          >
            {data.name}分野
          </span>
        </div>

        {/* タイトル */}
        <h1
          style={{
            fontSize: 'clamp(1.3rem, 4vw, 1.75rem)',
            fontWeight: 700,
            lineHeight: 1.5,
            marginBottom: '10px',
          }}
        >
          {title}
        </h1>

        {/* 説明文 */}
        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.7,
            color: 'rgba(255,255,255,0.75)',
            marginBottom: '16px',
            maxWidth: '560px',
          }}
        >
          {data.description}
        </p>

        {/* ビザバッジ + 日付 */}
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px' }}>
          {visaBadges.map((badge) => (
            <span
              key={badge.label}
              style={{
                display: 'inline-block',
                fontSize: '11px',
                fontWeight: 600,
                padding: '3px 10px',
                borderRadius: '4px',
                backgroundColor: badge.active
                  ? 'rgba(255,255,255,0.15)'
                  : 'rgba(255,255,255,0.05)',
                color: badge.active ? '#fff' : 'rgba(255,255,255,0.35)',
                border: badge.active
                  ? '1px solid rgba(255,255,255,0.3)'
                  : '1px solid rgba(255,255,255,0.1)',
              }}
            >
              {badge.active ? '✓ ' : '— '}
              {badge.label}
            </span>
          ))}
          {publishedAt && (
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginLeft: '8px' }}>
              {new Date(publishedAt).toLocaleDateString('ja-JP')}
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
