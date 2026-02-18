'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/shared';
import { MarkdownPreview } from '@/components/admin/blog/MarkdownPreview';
import type { TrendWidget, TrendData } from '@/types/database';

type InsightSummary = {
  id: number;
  title: string;
  body: string;
  published_at: string | null;
};

type SourceSummary = {
  id: number;
  name: string;
  source_url: string | null;
  last_updated: string | null;
};

type Props = {
  widgets: TrendWidget[];
  insights: InsightSummary[];
  sources: SourceSummary[];
  texts: Record<string, string>;
  theme: Record<string, string>;
};

export function TrendDashboard({ widgets, insights, sources, texts, theme }: Props) {
  const [widgetData, setWidgetData] = useState<Record<number, TrendData[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient();
      const allMetricKeys = widgets.flatMap((w) => w.metric_keys);
      if (allMetricKeys.length === 0) { setLoading(false); return; }

      const { data } = await supabase
        .from('trend_data')
        .select('*')
        .in('metric_key', allMetricKeys)
        .order('period', { ascending: true });

      // ウィジェットごとにデータを振り分け
      const grouped: Record<number, TrendData[]> = {};
      widgets.forEach((w) => {
        grouped[w.id] = (data || []).filter((d) => w.metric_keys.includes(d.metric_key));
      });
      setWidgetData(grouped);
      setLoading(false);
    };
    fetchData();
  }, [widgets]);

  return (
    <div className="space-y-12">
      {/* ウィジェット (統計カード & チャート) */}
      {widgets.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{texts.section_stats || '主要統計'}</h2>

          {/* stat_card タイプ */}
          {(() => {
            const statCards = widgets.filter((w) => w.widget_type === 'stat_card');
            if (statCards.length === 0) return null;
            return (
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((widget) => {
                  const data = widgetData[widget.id] || [];
                  const latestValue = data.length > 0 ? data[data.length - 1] : null;
                  return (
                    <div
                      key={widget.id}
                      className="bg-white rounded-xl border border-gray-200 p-5"
                    >
                      <p className="text-sm text-gray-500 mb-1">{widget.title}</p>
                      {loading ? (
                        <div className="h-8 bg-gray-100 rounded animate-pulse" />
                      ) : latestValue ? (
                        <>
                          <p className="text-2xl font-bold" style={{ color: theme['--biz-primary'] || '#1e3a5f' }}>
                            {Number(latestValue.value).toLocaleString()}{latestValue.unit || ''}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">{latestValue.period}</p>
                        </>
                      ) : (
                        <p className="text-sm text-gray-400">データなし</p>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })()}

          {/* チャートタイプ (line_chart, bar_chart, pie_chart, table, map) */}
          {(() => {
            const chartWidgets = widgets.filter((w) => w.widget_type !== 'stat_card');
            if (chartWidgets.length === 0) return null;
            return (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-gray-900">{texts.section_charts || 'グラフ・チャート'}</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {chartWidgets.map((widget) => {
                    const data = widgetData[widget.id] || [];
                    return (
                      <Card key={widget.id}>
                        <CardHeader>
                          <CardTitle>{widget.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                          {loading ? (
                            <div className="h-48 bg-gray-50 rounded animate-pulse" />
                          ) : data.length === 0 ? (
                            <p className="text-sm text-gray-400 py-8 text-center">データなし</p>
                          ) : widget.widget_type === 'table' ? (
                            <div className="overflow-x-auto">
                              <table className="w-full text-sm">
                                <thead className="border-b">
                                  <tr>
                                    <th className="text-left py-2 pr-4 font-medium text-gray-500">期間</th>
                                    <th className="text-left py-2 pr-4 font-medium text-gray-500">指標</th>
                                    <th className="text-right py-2 font-medium text-gray-500">値</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y">
                                  {data.slice(-10).map((d) => (
                                    <tr key={d.id}>
                                      <td className="py-2 pr-4 text-gray-600">{d.period}</td>
                                      <td className="py-2 pr-4 text-gray-600">{d.metric_label}</td>
                                      <td className="py-2 text-right font-medium">{Number(d.value).toLocaleString()}{d.unit || ''}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          ) : (
                            /* 簡易バーチャート (line_chart/bar_chart/pie_chart) */
                            <div className="space-y-2">
                              {data.slice(-8).map((d) => {
                                const maxVal = Math.max(...data.map((x) => Number(x.value)));
                                const pct = maxVal > 0 ? (Number(d.value) / maxVal) * 100 : 0;
                                return (
                                  <div key={d.id} className="flex items-center gap-2">
                                    <span className="text-xs text-gray-500 w-20 flex-shrink-0 truncate">{d.period}</span>
                                    <div className="flex-1 h-5 bg-gray-100 rounded overflow-hidden">
                                      <div
                                        className="h-full rounded transition-all duration-500"
                                        style={{
                                          width: `${pct}%`,
                                          backgroundColor: theme['--biz-primary'] || '#1e3a5f',
                                        }}
                                      />
                                    </div>
                                    <span className="text-xs font-medium text-gray-700 w-20 text-right">
                                      {Number(d.value).toLocaleString()}{d.unit || ''}
                                    </span>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {widgets.length === 0 && insights.length === 0 && (
        <p className="text-center text-gray-500 py-12">{texts.empty_state || 'データがまだ登録されていません。'}</p>
      )}

      {/* インサイト記事 */}
      {insights.length > 0 && (
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-6">{texts.section_insights || 'インサイト・解説'}</h2>
          <div className="space-y-6">
            {insights.map((insight) => (
              <Card key={insight.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>{insight.title}</CardTitle>
                    {insight.published_at && (
                      <span className="text-xs text-gray-400">
                        {new Date(insight.published_at).toLocaleDateString('ja-JP')}
                      </span>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <MarkdownPreview content={insight.body} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* データソース */}
      {sources.length > 0 && (
        <div className="border-t pt-8">
          <h3 className="text-sm font-medium text-gray-500 mb-3">{texts.data_source_label || 'データソース'}</h3>
          <div className="flex flex-wrap gap-4">
            {sources.map((src) => (
              <div key={src.id} className="text-xs text-gray-400">
                {src.source_url ? (
                  <a href={src.source_url} target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 underline">
                    {src.name}
                  </a>
                ) : (
                  src.name
                )}
                {src.last_updated && (
                  <span className="ml-1">
                    ({texts.last_updated_label || '最終更新'}: {new Date(src.last_updated).toLocaleDateString('ja-JP')})
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
