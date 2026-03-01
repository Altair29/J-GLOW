import ApplicationForm from '@/components/business/partners/ApplicationForm';

export const metadata = {
  title: '掲載申し込み | パートナーディレクトリ | J-GLOW',
  description: 'J-GLOWパートナーディレクトリへの掲載申し込みフォーム',
};

export default function PartnerApplyPage() {
  return (
    <div className="min-h-screen" style={{ background: '#f2f5f9' }}>
      <div className="max-w-[720px] mx-auto px-4 py-10">
        <ApplicationForm />
      </div>
    </div>
  );
}
