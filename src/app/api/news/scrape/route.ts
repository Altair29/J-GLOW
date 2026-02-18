import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  // Cron or admin-triggered endpoint
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = createAdminClient();

  // アクティブなニュースソースを取得
  const { data: sources } = await supabase
    .from('news_sources')
    .select('*')
    .eq('is_active', true);

  if (!sources || sources.length === 0) {
    return NextResponse.json({ message: 'No active sources' });
  }

  const results = {
    processed: 0,
    newArticles: 0,
    errors: [] as string[],
  };

  for (const source of sources) {
    try {
      // TODO: Implement actual RSS/Atom parsing and scraping
      // This is a placeholder for the scraping logic
      results.processed++;

      // Update last_fetched
      await supabase
        .from('news_sources')
        .update({ last_fetched: new Date().toISOString() })
        .eq('id', source.id);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      results.errors.push(`${source.name}: ${message}`);
    }
  }

  return NextResponse.json(results);
}
