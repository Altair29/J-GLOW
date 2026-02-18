'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLang, SUPPORTED_LANGS } from '@/contexts/LangContext';

export function LangSelector() {
  const { lang, setLang, langOption } = useLang();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) close();
    };
    const keyHandler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
  }, [open, close]);

  return (
    <div ref={ref} className="relative">
      <button
        className="flex items-center gap-1.5 text-sm px-2.5 py-1.5 border border-white/30 rounded-lg hover:bg-white/10 transition-colors"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <Globe size={15} />
        <span className="max-w-[100px] truncate">{langOption.label}</span>
        <ChevronDown
          size={13}
          className={`opacity-60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <div
        className={`absolute top-full right-0 mt-2 transition-all duration-200 z-50 ${
          open
            ? 'opacity-100 translate-y-0 pointer-events-auto'
            : 'opacity-0 -translate-y-1 pointer-events-none'
        }`}
      >
        <div className="glass-dropdown rounded-xl py-1.5 min-w-[200px] shadow-xl">
          {SUPPORTED_LANGS.map((option) => (
            <button
              key={option.code}
              className={`flex items-center justify-between w-full px-4 py-2.5 text-sm transition-colors ${
                lang === option.code
                  ? 'text-slate-900 bg-white/50 font-medium'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/40'
              }`}
              onClick={() => {
                setLang(option.code);
                close();
              }}
            >
              <span>{option.label}</span>
              {lang === option.code && (
                <Check size={15} className="text-emerald-600 shrink-0" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
