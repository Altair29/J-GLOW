'use client';

type Props = {
  category: string;
  title: string;
  updatedAt: string;
  readTime: string;
  accentChar?: string;
  gradientTo?: string;
};

export default function ArticleHeader({
  category,
  title,
  updatedAt,
  readTime,
  accentChar,
  gradientTo = '#1a2f5e',
}: Props) {
  return (
    <header
      style={{
        background: `linear-gradient(135deg, #0f2044 0%, #1a2f5e 50%, ${gradientTo} 100%)`,
        color: '#fff',
        position: 'relative',
        overflow: 'hidden',
        padding: '3.5rem 1.5rem 3rem',
      }}
    >
      {accentChar && (
        <span
          aria-hidden
          style={{
            position: 'absolute',
            right: '5%',
            top: '50%',
            transform: 'translateY(-50%)',
            fontSize: 'clamp(120px, 20vw, 220px)',
            fontWeight: 900,
            color: 'rgba(255,255,255,0.04)',
            lineHeight: 1,
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {accentChar}
        </span>
      )}
      <div style={{ maxWidth: '680px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
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
            marginBottom: '1rem',
          }}
        >
          {category}
        </span>
        <h1
          style={{
            fontSize: 'clamp(1.4rem, 4vw, 1.75rem)',
            fontWeight: 700,
            lineHeight: 1.5,
            marginBottom: '1rem',
            maxWidth: '680px',
          }}
        >
          {title}
        </h1>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            fontSize: '12px',
            color: 'rgba(255,255,255,0.6)',
            flexWrap: 'wrap',
          }}
        >
          <span>{updatedAt}</span>
          <span>{readTime}</span>
        </div>
      </div>
    </header>
  );
}
