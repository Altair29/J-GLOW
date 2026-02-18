import { createClient } from '@/lib/supabase/server';
import { getFeatureLabels } from '@/lib/data';

export default async function NewsPage() {
  const supabase = await createClient();
  const labels = await getFeatureLabels(supabase);

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-gray-900 mb-4">{labels.news}</h1>
      <p className="text-gray-500">このページは現在開発中です。</p>
    </div>
  );
}
