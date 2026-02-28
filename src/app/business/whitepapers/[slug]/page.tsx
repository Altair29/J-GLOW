import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getContentBlocks, getThemeVars, getFeatureLabels } from '@/lib/data';
import { Badge } from '@/components/shared';
import { MarkdownPreview } from '@/components/admin/blog/MarkdownPreview';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function WhitepaperDetailPage({ params }: Props) {
  const { slug } = await params;
  const supabase = await createClient();

  const [texts, theme, labels, { data: wp }] = await Promise.all([
    getContentBlocks(supabase, 'business_whitepapers'),
    getThemeVars(supabase, 'business'),
    getFeatureLabels(supabase),
    supabase
      .from('whitepapers')
      .select('*, whitepaper_categories(name)')
      .eq('slug', slug)
      .eq('status', 'published')
      .single(),
  ]);

  if (!wp) notFound();

  // 閲覧数インクリメント
  await supabase
    .from('whitepapers')
    .update({ view_count: (wp.view_count || 0) + 1 })
    .eq('id', wp.id);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const catName = (wp as any).whitepaper_categories?.name;

  return (
    <div>
      {/* カバー */}
      {wp.thumbnail_url && (
        <div className="w-full h-64 md:h-80 overflow-hidden">
          <img src={wp.thumbnail_url} alt={wp.title} className="w-full h-full object-cover" />
        </div>
      )}

      <article className="max-w-4xl mx-auto px-4 py-12">
        <Link
          href="/business/whitepapers"
          className="text-sm mb-6 inline-block hover:opacity-80 transition-opacity"
          style={{ color: theme['--biz-primary'] || '#1a2f5e' }}
        >
          ← {labels.whitepaper}一覧に戻る
        </Link>

        <div className="flex flex-wrap items-center gap-2 mb-4">
          {catName && <Badge style={{ backgroundColor: '#e8ecf5', color: '#1a2f5e' }}>{catName}</Badge>}
          {wp.industry && <Badge style={{ backgroundColor: '#f3f4f6', color: '#374151' }}>{wp.industry}</Badge>}
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">{wp.title}</h1>
        {wp.subtitle && <p className="text-lg text-gray-500 mb-6">{wp.subtitle}</p>}
        {wp.author && <p className="text-sm text-gray-400 mb-8">著者: {wp.author}</p>}

        {/* DLリンク */}
        {wp.download_url && (
          <div className="mb-8 p-4 bg-[#1a2f5e]/5 border border-[#1a2f5e]/20 rounded-lg flex items-center justify-between">
            <span className="text-sm text-[#1a2f5e]">PDF版をダウンロードできます</span>
            <a
              href={wp.download_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-white rounded-lg"
              style={{ backgroundColor: theme['--biz-primary'] || '#1a2f5e' }}
            >
              {texts.download_cta || 'ダウンロード'}
            </a>
          </div>
        )}

        {/* 本文 */}
        <div className="mb-12">
          <MarkdownPreview content={wp.body} />
        </div>
      </article>
    </div>
  );
}
