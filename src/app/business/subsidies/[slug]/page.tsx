import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars, getFeatureLabels } from '@/lib/data';
import { Badge } from '@/components/shared';
import { MarkdownPreview } from '@/components/admin/blog/MarkdownPreview';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function SubsidyDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const [texts, theme, labels, { data: sub }] = await Promise.all([
    getContentBlocks(supabase, 'business_subsidies'),
    getThemeVars(supabase, 'business'),
    getFeatureLabels(supabase),
    supabase
      .from('subsidies')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'active')
      .single(),
  ]);

  if (!sub) notFound();

  // 適用条件を取得
  const { data: conditions } = await supabase
    .from('subsidy_conditions')
    .select('condition_type, condition_value')
    .eq('subsidy_id', sub.id);

  const statusMap: Record<string, { label: string; bg: string; color: string }> = {
    active: { label: '受付中', bg: '#d1fae5', color: '#065f46' },
    upcoming: { label: '受付予定', bg: '#dbeafe', color: '#1e40af' },
    expired: { label: '受付終了', bg: '#e5e7eb', color: '#374151' },
    suspended: { label: '一時停止', bg: '#fee2e2', color: '#991b1b' },
  };
  const st = statusMap[sub.status] || statusMap.active;

  const conditionTypeLabels: Record<string, string> = {
    region: '対象地域',
    field: '対象分野',
    job_type: '対象職種',
    visa_type: '対象在留資格',
    company_size: '対象企業規模',
    employee_count: '従業員数要件',
  };

  // 条件をタイプ別にグループ化
  const groupedConditions: Record<string, string[]> = {};
  (conditions || []).forEach((c) => {
    if (!groupedConditions[c.condition_type]) groupedConditions[c.condition_type] = [];
    groupedConditions[c.condition_type].push(c.condition_value);
  });

  return (
    <div>
      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/business/subsidies"
          className="text-sm mb-6 inline-block hover:opacity-80 transition-opacity"
          style={{ color: theme['--biz-primary'] || '#1a2f5e' }}
        >
          ← {labels.subsidy}一覧に戻る
        </Link>

        <div className="flex items-center gap-2 mb-4">
          <Badge style={{ backgroundColor: st.bg, color: st.color }}>{st.label}</Badge>
          {sub.is_featured && <Badge style={{ backgroundColor: '#fdf5e0', color: '#8a7530' }}>注目</Badge>}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{sub.name}</h1>
        <p className="text-sm text-gray-500 mb-6">{sub.provider}</p>

        {/* 概要カード */}
        <div className="bg-gray-50 rounded-xl p-6 mb-8 grid sm:grid-cols-2 gap-4">
          {sub.max_amount && (
            <div>
              <span className="text-xs text-gray-400">最大金額</span>
              <p className="text-xl font-bold" style={{ color: theme['--biz-primary'] || '#1a2f5e' }}>{sub.max_amount}</p>
            </div>
          )}
          {sub.deadline && (
            <div>
              <span className="text-xs text-gray-400">申請期限</span>
              <p className="text-lg font-medium text-gray-900">{sub.deadline}</p>
            </div>
          )}
          {sub.fiscal_year && (
            <div>
              <span className="text-xs text-gray-400">対象年度</span>
              <p className="text-lg font-medium text-gray-900">{sub.fiscal_year}</p>
            </div>
          )}
        </div>

        {/* 概要 */}
        <div className="mb-8">
          <h2 className="text-lg font-bold text-gray-900 mb-3">概要</h2>
          <p className="text-gray-700 leading-relaxed">{sub.summary}</p>
        </div>

        {/* 詳細 */}
        {sub.detail && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">詳細</h2>
            <MarkdownPreview content={sub.detail} />
          </div>
        )}

        {/* 適用条件 */}
        {Object.keys(groupedConditions).length > 0 && (
          <div className="mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-3">適用条件</h2>
            <div className="space-y-3">
              {Object.entries(groupedConditions).map(([type, values]) => (
                <div key={type} className="flex items-start gap-3">
                  <span className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">
                    {conditionTypeLabels[type] || type}
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {values.map((v) => (
                      <Badge key={v} style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{v}</Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 対象配列フィールド */}
        <div className="mb-8 space-y-3">
          {sub.eligible_regions && sub.eligible_regions.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">対象地域</span>
              <div className="flex flex-wrap gap-1">
                {sub.eligible_regions.map((r: string) => (
                  <Badge key={r} style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{r}</Badge>
                ))}
              </div>
            </div>
          )}
          {sub.eligible_fields && sub.eligible_fields.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">対象分野</span>
              <div className="flex flex-wrap gap-1">
                {sub.eligible_fields.map((f: string) => (
                  <Badge key={f} style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{f}</Badge>
                ))}
              </div>
            </div>
          )}
          {sub.eligible_visa_types && sub.eligible_visa_types.length > 0 && (
            <div className="flex items-start gap-3">
              <span className="text-sm font-medium text-gray-500 w-32 flex-shrink-0">対象在留資格</span>
              <div className="flex flex-wrap gap-1">
                {sub.eligible_visa_types.map((v: string) => (
                  <Badge key={v} style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{v}</Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 申請先リンク */}
        {sub.application_url && (
          <div className="border-t pt-6">
            <a
              href={sub.application_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              style={{ backgroundColor: theme['--biz-primary'] || '#1a2f5e' }}
            >
              {texts.apply_link || '申請ページへ'} ↗
            </a>
          </div>
        )}
      </article>
    </div>
  );
}
