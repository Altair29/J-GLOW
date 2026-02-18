import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { getFeatureCards } from '@/lib/data';
import { getIcon } from '@/lib/icons';

export default async function AdminDashboard() {
  const supabase = await createClient();
  const cards = await getFeatureCards(supabase, 'admin');

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-900 mb-6">管理ダッシュボード</h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map((card) => {
          const Icon = getIcon(card.icon);
          return (
            <Link
              key={card.id}
              href={card.href}
              className="block p-6 bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  {Icon && <Icon size={20} className="text-gray-700" />}
                </div>
                <h3 className="font-bold text-gray-900">{card.title}</h3>
              </div>
              <p className="text-sm text-gray-500">{card.description}</p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
