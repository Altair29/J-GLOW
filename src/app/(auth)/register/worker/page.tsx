import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars } from '@/lib/data';
import { WorkerRegisterForm } from './WorkerRegisterForm';

export default async function WorkerRegisterPage() {
  const supabase = await createClient();
  const [texts, theme] = await Promise.all([
    getContentBlocks(supabase, 'register_worker'),
    getThemeVars(supabase, 'worker'),
  ]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4">
      <WorkerRegisterForm texts={texts} theme={theme} />
    </div>
  );
}
