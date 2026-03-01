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
            5分で生成します。未払い賃金請求・行政指導・突然の離職——
            これらのリスクを「仕組み」で防ぐための、企業側の最初の一手です。
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
