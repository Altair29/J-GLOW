import Link from 'next/link';

export const metadata = {
  title: '申し込み完了 | パートナーディレクトリ | J-GLOW',
};

export default function PartnerApplyCompletePage() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: '#f2f5f9' }}>
      <div className="max-w-md mx-auto px-6 py-16 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-xl font-extrabold text-[#0f1f45] mb-3">
          お申し込みを受け付けました
        </h1>
        <p className="text-[#4a5568] text-sm leading-relaxed mb-6">
          担当者から3営業日以内にご連絡いたします。
          <br />
          審査費のご案内も合わせて送付いたします。
        </p>
        <Link
          href="/business/partners"
          className="inline-block rounded-lg px-6 py-3 text-sm font-bold text-white no-underline hover:opacity-90 transition-opacity"
          style={{ background: 'linear-gradient(135deg, #1a2f5e, #2a4f8e)' }}
        >
          パートナーディレクトリに戻る
        </Link>
      </div>
    </div>
  );
}
