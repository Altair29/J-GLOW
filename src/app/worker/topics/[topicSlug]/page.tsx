export default async function TopicDetailPage({ params }: { params: Promise<{ topicSlug: string }> }) {
  const { topicSlug } = await params;
  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">トピック詳細</h1>
      <p className="text-gray-500">ID: {topicSlug}</p>
      <p className="text-gray-500 mt-2">このページは現在開発中です。</p>
    </div>
  );
}
