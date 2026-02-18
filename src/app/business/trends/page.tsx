import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { TrendDashboard } from '@/components/business/TrendDashboard';

export default async function TrendsPage() {
  const supabase = await createClient();

  const [texts, theme, { data: widgets }, { data: insights }, { data: sources }] = await Promise.all([
    getContentBlocks(supabase, 'business_trends'),
    getThemeVars(supabase, 'business'),
    supabase
      .from('trend_widgets')
      .select('*')
      .eq('is_active', true)
      .order('sort_order'),
    supabase
      .from('trend_insights')
      .select('id, title, body, published_at')
      .eq('status', 'published')
      .order('published_at', { ascending: false })
      .limit(5),
    supabase
      .from('trend_sources')
      .select('id, name, source_url, last_updated')
      .eq('is_active', true)
      .order('name'),
  ]);

  return (
    <div>
      {/* ヒーロー */}
      <section
        className="py-16"
        style={{
          backgroundColor: theme['--biz-hero-bg'] || '#1e3a5f',
          color: theme['--biz-hero-text'] || '#ffffff',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold mb-3">{texts.hero_title || '最新トレンドダッシュボード'}</h1>
          <p className="text-lg opacity-80">{texts.hero_subtitle || ''}</p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-12">
        <TrendDashboard
          widgets={widgets || []}
          insights={insights || []}
          sources={sources || []}
          texts={texts}
          theme={theme}
        />
      </section>
    </div>
  );
}
