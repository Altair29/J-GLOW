'use client';

import { useState } from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/client';
import { Button, Select, Badge } from '@/components/shared';
import type { Subsidy } from '@/types/database';

type Props = {
  texts: Record<string, string>;
  theme: Record<string, string>;
};

export function SubsidySearchForm({ texts, theme }: Props) {
  const [region, setRegion] = useState('');
  const [field, setField] = useState('');
  const [visaType, setVisaType] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [results, setResults] = useState<Subsidy[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    const supabase = createClient();

    // 条件に合うsubsidy_idを集める
    let matchedIds: number[] | null = null;

    const conditions: { type: string; value: string }[] = [];
    if (region) conditions.push({ type: 'region', value: region });
    if (field) conditions.push({ type: 'field', value: field });
    if (visaType) conditions.push({ type: 'visa_type', value: visaType });
    if (companySize) conditions.push({ type: 'company_size', value: companySize });

    if (conditions.length > 0) {
      // 各条件でマッチするsubsidy_idを取得し、共通するIDを抽出
      const idSets: Set<number>[] = [];
      for (const cond of conditions) {
        const { data } = await supabase
          .from('subsidy_conditions')
          .select('subsidy_id')
          .eq('condition_type', cond.type)
          .eq('condition_value', cond.value);
        if (data) {
          idSets.push(new Set(data.map((d) => d.subsidy_id)));
        }
      }
      if (idSets.length > 0) {
        const intersection = idSets.reduce((acc, s) => new Set([...acc].filter((x) => s.has(x))));
        matchedIds = [...intersection];
      }
    }

    let query = supabase
      .from('subsidies')
      .select('*')
      .eq('status', 'active')
      .order('sort_order');

    if (matchedIds !== null) {
      if (matchedIds.length === 0) {
        setResults([]);
        setLoading(false);
        // 検索ログ
        await supabase.from('subsidy_search_logs').insert({
          search_params: { region, field, visaType, companySize },
          results_count: 0,
          matched_ids: [],
        });
        return;
      }
      query = query.in('id', matchedIds);
    }

    const { data } = await query;
    setResults(data || []);

    // 検索ログ
    await supabase.from('subsidy_search_logs').insert({
      search_params: { region, field, visaType, companySize },
      results_count: (data || []).length,
      matched_ids: (data || []).map((s) => s.id),
    });

    setLoading(false);
  };

  // 選択肢は本来DBから取得すべきだが、初期フェーズでは固定値
  const regionOptions = [
    { label: '全国', value: '' },
    { label: '北海道', value: '北海道' },
    { label: '東北', value: '東北' },
    { label: '関東', value: '関東' },
    { label: '中部', value: '中部' },
    { label: '関西', value: '関西' },
    { label: '中国', value: '中国' },
    { label: '四国', value: '四国' },
    { label: '九州・沖縄', value: '九州・沖縄' },
  ];

  const fieldOptions = [
    { label: '全分野', value: '' },
    { label: '建設', value: '建設' },
    { label: '介護', value: '介護' },
    { label: '製造', value: '製造' },
    { label: '農業', value: '農業' },
    { label: '飲食', value: '飲食' },
    { label: '運輸', value: '運輸' },
    { label: 'その他', value: 'その他' },
  ];

  const visaOptions = [
    { label: 'すべて', value: '' },
    { label: '技能実習', value: '技能実習' },
    { label: '特定技能1号', value: '特定技能1号' },
    { label: '特定技能2号', value: '特定技能2号' },
    { label: '育成就労', value: '育成就労' },
    { label: '技術・人文知識・国際業務', value: '技人国' },
  ];

  const sizeOptions = [
    { label: 'すべて', value: '' },
    { label: '小規模 (〜50人)', value: 'small' },
    { label: '中規模 (51〜300人)', value: 'medium' },
    { label: '大規模 (301人〜)', value: 'large' },
  ];

  return (
    <div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        <Select label={texts.label_region || '地域'} options={regionOptions} value={region} onChange={(e) => setRegion(e.target.value)} />
        <Select label={texts.label_field || '分野・業種'} options={fieldOptions} value={field} onChange={(e) => setField(e.target.value)} />
        <Select label={texts.label_visa_type || '在留資格'} options={visaOptions} value={visaType} onChange={(e) => setVisaType(e.target.value)} />
        <Select label={texts.label_company_size || '企業規模'} options={sizeOptions} value={companySize} onChange={(e) => setCompanySize(e.target.value)} />
      </div>
      <Button
        type="button"
        themeColor={theme['--biz-primary'] || '#1a2f5e'}
        loading={loading}
        onClick={handleSearch}
      >
        {texts.search_button || '検索する'}
      </Button>

      {/* 検索結果 */}
      {results !== null && (
        <div className="mt-8">
          <h3 className="text-lg font-bold text-gray-900 mb-2">
            {texts.results_heading || '検索結果'}
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            {results.length}{texts.results_count || '件の助成金が見つかりました'}
          </p>

          {results.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              {texts.empty_state || '条件に合う助成金が見つかりませんでした。条件を変更してお試しください。'}
            </p>
          ) : (
            <div className="space-y-4">
              {results.map((sub) => (
                <Link
                  key={sub.id}
                  href={`/business/subsidies/${sub.slug}`}
                  className="block bg-white rounded-lg border border-gray-200 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Badge style={{ backgroundColor: '#d1fae5', color: '#065f46' }}>受付中</Badge>
                        <span className="text-xs text-gray-400">{sub.provider}</span>
                      </div>
                      <h4 className="font-bold text-gray-900 mb-1">{sub.name}</h4>
                      <p className="text-sm text-gray-600 line-clamp-2">{sub.summary}</p>
                    </div>
                    {sub.max_amount && (
                      <div className="text-right flex-shrink-0">
                        <span className="text-xs text-gray-400">最大金額</span>
                        <p className="text-lg font-bold" style={{ color: theme['--biz-primary'] || '#1a2f5e' }}>
                          {sub.max_amount}
                        </p>
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
