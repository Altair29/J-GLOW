'use client';

import { useEffect, useRef, useState } from 'react';

/** Animated yellow highlighter that draws on when visible */
function HighlightMarker({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <span ref={ref} className="relative inline">
      <span
        className="absolute left-0 bottom-0 h-[40%] rounded-sm"
        style={{
          background: 'linear-gradient(90deg, #fde68a 0%, #fbbf24 50%, #fde68a 100%)',
          opacity: visible ? 0.5 : 0,
          width: visible ? '100%' : '0%',
          transition: 'width 0.8s cubic-bezier(0.25,0.46,0.45,0.94) 0.3s, opacity 0.4s ease 0.3s',
        }}
      />
      <span className="relative">{children}</span>
    </span>
  );
}

export default function LeadSection() {
  return (
    <div style={{
      background: '#fff',
      borderBottom: '1px solid #e2e8f0',
      padding: '32px 24px',
    }}>
      <div style={{ maxWidth: '860px', margin: '0 auto' }}>
        <div style={{
          borderLeft: '4px solid #1a2f5e',
          paddingLeft: '20px',
          marginBottom: '16px',
        }}>
          <p style={{ fontWeight: 700, color: '#1a2f5e', fontSize: '16px', margin: '0 0 10px' }}>
            「サインをもらった」だけでは不十分な時代です。
          </p>
          <p style={{ color: '#444', fontSize: '13px', lineHeight: 1.85, margin: '0 0 8px' }}>
            厚労省・入管庁のテンプレートは法令遵守の第一歩。しかし多忙な現場では、
            外国人スタッフが契約内容を本当に理解しているか確認しきれていないケースが
            多く見受けられます。
          </p>
          <p style={{ color: '#444', fontSize: '13px', lineHeight: 1.85, margin: 0 }}>
            J-GLOWの労働条件通知書ツールは、日本語と母国語を並べたバイリンガルPDFを
            5分で生成します。
          </p>
          <p style={{ fontWeight: 700, color: '#1a2f5e', fontSize: '13px', lineHeight: 1.85, marginTop: '10px', marginBottom: 0 }}>
            <HighlightMarker>未払い賃金請求・行政指導・突然の離職</HighlightMarker>——
            これらのリスクを「仕組み」で防ぐための、<HighlightMarker>企業側の最初の一手</HighlightMarker>です。
          </p>
        </div>
        <p style={{ color: '#666', fontSize: '12px', margin: '0 0 4px' }}>
          対応言語：ベトナム語・英語・中国語・インドネシア語・タガログ語・クメール語・ミャンマー語
        </p>
        <p style={{ color: '#999', fontSize: '11px', margin: 0 }}>
          ※ 専門家によるリーガルチェックと併用してご利用ください。
        </p>
      </div>
    </div>
  );
}
