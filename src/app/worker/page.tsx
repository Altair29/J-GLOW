import { createClient } from '@/lib/supabase/server';
import { getAllContentBlocks, getThemeVars, getWorkerTopics } from '@/lib/data';
import { WorkerHomeClient } from '@/components/worker/WorkerHomeClient';

export default async function WorkerPage() {
  const supabase = await createClient();

  const [allTexts, theme, topics] = await Promise.all([
    getAllContentBlocks(supabase, 'worker_home'),
    getThemeVars(supabase, 'worker'),
    getWorkerTopics(supabase),
  ]);

  return <WorkerHomeClient topics={topics} allTexts={allTexts} theme={theme} />;
}
