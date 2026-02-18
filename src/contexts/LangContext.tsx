'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

export type LangCode =
  | 'ja' | 'en' | 'zh' | 'vi' | 'tl'
  | 'id' | 'th' | 'my' | 'km' | 'mn' | 'ne';

export type LangOption = {
  code: LangCode;
  label: string;       // 母国語表記
  labelShort: string;  // 短縮表記
};

export const SUPPORTED_LANGS: LangOption[] = [
  { code: 'ja', label: '日本語',           labelShort: '日本語' },
  { code: 'en', label: 'English',          labelShort: 'EN' },
  { code: 'zh', label: '中文',             labelShort: '中文' },
  { code: 'vi', label: 'Tiếng Việt',       labelShort: 'VI' },
  { code: 'tl', label: 'Tagalog',          labelShort: 'TL' },
  { code: 'id', label: 'Bahasa Indonesia', labelShort: 'ID' },
  { code: 'th', label: 'ภาษาไทย',          labelShort: 'TH' },
  { code: 'my', label: 'မြန်မာဘာသာ',        labelShort: 'MY' },
  { code: 'km', label: 'ភាសាខ្មែរ',          labelShort: 'KM' },
  { code: 'mn', label: 'Монгол',           labelShort: 'MN' },
  { code: 'ne', label: 'नेपाली',            labelShort: 'NE' },
];

type LangContextType = {
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  langOption: LangOption;
};

const LangContext = createContext<LangContextType>({
  lang: 'ja',
  setLang: () => {},
  langOption: SUPPORTED_LANGS[0],
});

const STORAGE_KEY = 'j-glow-lang';

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LangCode>('ja');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY) as LangCode | null;
    if (saved && SUPPORTED_LANGS.some((l) => l.code === saved)) {
      setLangState(saved);
    }
  }, []);

  const setLang = (code: LangCode) => {
    setLangState(code);
    localStorage.setItem(STORAGE_KEY, code);
  };

  const langOption = SUPPORTED_LANGS.find((l) => l.code === lang) ?? SUPPORTED_LANGS[0];

  return (
    <LangContext.Provider value={{ lang, setLang, langOption }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  return useContext(LangContext);
}
