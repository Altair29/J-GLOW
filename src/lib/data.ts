import type { NavigationItem, FeatureCard, WorkerTopic } from '@/types/database';
import { defaultFeatureLabels, type FeatureLabelKey } from '@/config/labels';

/* eslint-disable @typescript-eslint/no-explicit-any */
type SupabaseClient = any;

// ========================================
// ナビゲーション
// ========================================
export async function getNavItems(
  supabase: SupabaseClient,
  section: NavigationItem['section']
): Promise<NavigationItem[]> {
  const { data } = await supabase
    .from('navigation_items')
    .select('*')
    .eq('section', section)
    .eq('is_active', true)
    .order('sort_order');
  return (data as NavigationItem[]) ?? [];
}

// ========================================
// テーマ (CSS変数マップ)
// ========================================
export async function getThemeVars(
  supabase: SupabaseClient,
  section: string
): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('theme_config')
    .select('css_var, value')
    .eq('section', section)
    .order('sort_order');

  const vars: Record<string, string> = {};
  if (data) {
    for (const row of data as { css_var: string; value: string }[]) {
      vars[row.css_var] = row.value;
    }
  }
  return vars;
}

// ========================================
// コンテンツブロック
// ========================================
export async function getContentBlocks(
  supabase: SupabaseClient,
  page: string,
  lang = 'ja'
): Promise<Record<string, string>> {
  const { data } = await supabase
    .from('content_blocks')
    .select('block_key, content')
    .eq('page', page)
    .eq('lang', lang)
    .order('sort_order');

  const blocks: Record<string, string> = {};
  if (data) {
    for (const row of data as { block_key: string; content: string }[]) {
      blocks[row.block_key] = row.content;
    }
  }
  return blocks;
}

// ========================================
// 機能カード
// ========================================
export async function getFeatureCards(
  supabase: SupabaseClient,
  section: FeatureCard['section']
): Promise<FeatureCard[]> {
  const { data } = await supabase
    .from('feature_cards')
    .select('*')
    .eq('section', section)
    .eq('is_active', true)
    .order('sort_order');
  return (data as FeatureCard[]) ?? [];
}

// ========================================
// ワーカートピック
// ========================================
export async function getWorkerTopics(
  supabase: SupabaseClient
): Promise<WorkerTopic[]> {
  const { data } = await supabase
    .from('worker_topics')
    .select('*')
    .eq('is_active', true)
    .order('sort_order');
  return (data as WorkerTopic[]) ?? [];
}

// ========================================
// 機能ラベル (DB → フォールバック)
// ========================================
export async function getFeatureLabels(
  supabase: SupabaseClient,
  lang = 'ja'
): Promise<Record<FeatureLabelKey, string>> {
  const blocks = await getContentBlocks(supabase, 'feature_labels', lang);
  return {
    ...defaultFeatureLabels,
    ...Object.fromEntries(
      Object.entries(blocks).filter(([key]) => key in defaultFeatureLabels)
    ),
  } as Record<FeatureLabelKey, string>;
}

// ========================================
// テーマをCSS style objectに変換
// ========================================
export function themeToStyle(vars: Record<string, string>): React.CSSProperties {
  const style: Record<string, string> = {};
  for (const [key, value] of Object.entries(vars)) {
    style[key] = value;
  }
  return style as React.CSSProperties;
}
