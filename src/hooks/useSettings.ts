'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { SettingSection } from '@/types/database';

export function useSettings(section: SettingSection) {
  const [settings, setSettings] = useState<Record<string, unknown>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      const supabase = createClient();
      const { data } = await supabase
        .from('site_settings')
        .select('key, value')
        .eq('section', section)
        .order('sort_order');

      if (data) {
        const map: Record<string, unknown> = {};
        for (const row of data) {
          map[row.key] = row.value;
        }
        setSettings(map);
      }
      setLoading(false);
    };

    fetchSettings();
  }, [section]);

  const getSetting = <T = string>(key: string, fallback?: T): T => {
    return (settings[key] as T) ?? fallback ?? ('' as unknown as T);
  };

  return { settings, loading, getSetting };
}
