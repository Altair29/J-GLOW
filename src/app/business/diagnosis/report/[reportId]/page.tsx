export default async function DiagnosisReportPage({ params }: { params: Promise<{ reportId: string }> }) {
  const { reportId } = await params;
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">診断レポート</h1>
      <p className="text-gray-500">ID: {reportId}</p>
      <p className="text-gray-500 mt-2">このページは現在開発中です。</p>
    </div>
  );
}
