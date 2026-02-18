import { SiteSetting, SettingSection } from '@/types/database';

type SettingsCache = {
  data: Record<string, unknown>;
  timestamp: number;
};

const cache: Record<string, SettingsCache> = {};
const CACHE_TTL = 60 * 1000; // 1分キャッシュ

export async function getSettings(
  supabase: { from: (table: string) => { select: (columns: string) => { eq: (column: string, value: string) => { order: (column: string) => Promise<{ data: SiteSetting[] | null; error: unknown }> } } } },
  section: SettingSection
): Promise<Record<string, unknown>> {
  const cacheKey = section;
  const now = Date.now();

  if (cache[cacheKey] && now - cache[cacheKey].timestamp < CACHE_TTL) {
    return cache[cacheKey].data;
  }

  const { data, error } = await supabase
    .from('site_settings')
    .select('key, value, value_type')
    .eq('section', section)
    .order('sort_order');

  if (error || !data) {
    return cache[cacheKey]?.data ?? {};
  }

  const settings: Record<string, unknown> = {};
  for (const row of data) {
    settings[row.key] = row.value;
  }

  cache[cacheKey] = { data: settings, timestamp: now };
  return settings;
}

export function invalidateCache(section?: SettingSection) {
  if (section) {
    delete cache[section];
  } else {
    Object.keys(cache).forEach((key) => delete cache[key]);
  }
}
