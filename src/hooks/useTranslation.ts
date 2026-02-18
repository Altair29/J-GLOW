'use client';

import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { DEFAULT_LANGUAGE, type LanguageCode } from '@/lib/constants';

type TranslationMap = Record<string, string>;

export function useTranslation() {
  const [lang, setLang] = useState<LanguageCode>(DEFAULT_LANGUAGE);
  const [translations, setTranslations] = useState<TranslationMap>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('j-glow-lang') as LanguageCode | null;
    if (saved) setLang(saved);
  }, []);

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoading(true);
      const supabase = createClient();
      const { data } = await supabase
        .from('ui_translations')
        .select('key, value')
        .eq('lang', lang);

      if (data) {
        const map: TranslationMap = {};
        for (const row of data) {
          map[row.key] = row.value;
        }
        setTranslations(map);
      }
      setLoading(false);
    };

    fetchTranslations();
  }, [lang]);

  const switchLang = useCallback((newLang: LanguageCode) => {
    setLang(newLang);
    localStorage.setItem('j-glow-lang', newLang);
  }, []);

  const t = useCallback(
    (key: string, fallback?: string): string => {
      return translations[key] ?? fallback ?? key;
    },
    [translations]
  );

  return { lang, switchLang, t, loading };
}
