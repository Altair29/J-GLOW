import { createClient } from '@/lib/supabase/server';
import { DiagnosisAdmin } from '@/components/admin/DiagnosisAdmin';

export default async function DiagnosisAdminPage() {
  const supabase = await createClient();

  const [{ data: categories }, { data: questions }, { count: sessionCount }] = await Promise.all([
    supabase.from('diagnosis_categories').select('*').order('sort_order'),
    supabase.from('diagnosis_questions').select('*').order('category_id').order('sort_order'),
    supabase.from('diagnosis_sessions').select('*', { count: 'exact', head: true }),
  ]);

  return (
    <DiagnosisAdmin
      categories={categories || []}
      questions={questions || []}
      sessionCount={sessionCount || 0}
    />
  );
}
