import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars, getWorkerTopics } from '@/lib/data';
import { getIcon } from '@/lib/icons';

// トピック別のカラーマップ (DBのworker_topicsテーブルにcolor_*を追加する拡張も可能)
const topicColorMap: Record<string, { bg: string; text: string }> = {
  transfer: { bg: '#eff6ff', text: '#1d4ed8' },
  housing: { bg: '#f0fdf4', text: '#15803d' },
  medical: { bg: '#fef2f2', text: '#b91c1c' },
  labor_rights: { bg: '#faf5ff', text: '#7e22ce' },
  visa: { bg: '#eef2ff', text: '#4338ca' },
  japanese: { bg: '#fefce8', text: '#a16207' },
  banking: { bg: '#ecfeff', text: '#0e7490' },
  daily_life: { bg: '#fff7ed', text: '#c2410c' },
  emergency: { bg: '#fff1f2', text: '#be123c' },
  career: { bg: '#f0fdfa', text: '#0f766e' },
};

const defaultColor = { bg: '#f3f4f6', text: '#374151' };

export default async function WorkerPage() {
  const supabase = await createClient();
  const [texts, theme, topics] = await Promise.all([
    getContentBlocks(supabase, 'worker_home'),
    getThemeVars(supabase, 'worker'),
    getWorkerTopics(supabase),
  ]);

  return (
    <div>
      {/* ヒーロー */}
      <section
        className="py-20"
        style={{
          backgroundColor: theme['--wkr-hero-bg'] || '#059669',
          color: theme['--wkr-hero-text'] || '#ffffff',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            {texts.hero_title || ''}
          </h1>
          <p className="text-lg opacity-80 max-w-2xl mx-auto mb-2">
            {texts.hero_subtitle_en || ''}
          </p>
          <p className="text-sm opacity-60">
            {texts.hero_note || ''}
          </p>
        </div>
      </section>

      {/* 10大課題カード */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">
          {texts.section_heading || ''}
        </h2>
        <p className="text-center text-gray-500 mb-12">
          {texts.section_desc || ''}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {topics.map((topic) => {
            const Icon = getIcon(topic.icon);
            const colors = topicColorMap[topic.slug] || defaultColor;
            return (
              <Link
                key={topic.id}
                href={`/worker/topics/${topic.slug}`}
                className="group block p-5 rounded-xl border hover:shadow-lg transition-all duration-200 text-center"
                style={{
                  backgroundColor: colors.bg,
                  color: colors.text,
                  borderColor: colors.text + '33',
                }}
              >
                <div className="flex justify-center mb-3">
                  {Icon && <Icon size={32} />}
                </div>
                <h3 className="font-bold text-sm mb-1">{topic.title_ja}</h3>
                <div className="mt-3 flex justify-center">
                  <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
