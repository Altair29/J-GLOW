'use client';

import { useState } from 'react';

type LangCode = 'JP' | 'VN' | 'ID' | 'GB' | 'MM';

const TABS: { code: LangCode; flag: string; label: string }[] = [
  { code: 'JP', flag: '\u{1F1EF}\u{1F1F5}', label: '日本語' },
  { code: 'VN', flag: '\u{1F1FB}\u{1F1F3}', label: 'Tiếng Việt' },
  { code: 'ID', flag: '\u{1F1EE}\u{1F1E9}', label: 'Bahasa Indonesia' },
  { code: 'GB', flag: '\u{1F1EC}\u{1F1E7}', label: 'English' },
  { code: 'MM', flag: '\u{1F1F2}\u{1F1F2}', label: 'မြန်မာဘာသာ' },
];

const DESCRIPTIONS: Record<LangCode, string> = {
  JP: '以下のテンプレートは日本語版の労働条件通知書です。',
  VN: '以下のテンプレートはベトナム語（Tiếng Việt）対応の労働条件通知書です。',
  ID: '以下のテンプレートはインドネシア語（Bahasa Indonesia）対応の労働条件通知書です。',
  GB: '以下のテンプレートは英語（English）対応の労働条件通知書です。',
  MM: '以下のテンプレートはミャンマー語（မြန်မာဘာသာ）対応の労働条件通知書です。',
};

export default function LanguageTabs() {
  const [active, setActive] = useState<LangCode>('JP');

  return (
    <div className="mb-8">
      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {TABS.map((tab) => {
          const isActive = active === tab.code;
          return (
            <button
              key={tab.code}
              onClick={() => setActive(tab.code)}
              className={`
                flex items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2
                text-sm transition-colors
                ${
                  isActive
                    ? 'bg-[#1a2f5e] text-white'
                    : 'border border-gray-200 bg-white text-gray-600 hover:bg-[#1a2f5e]/5'
                }
              `}
            >
              <span className="text-base leading-none">{tab.flag}</span>
              <span className="text-[11px] font-normal opacity-70">{tab.code}</span>
              <span className="font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Description */}
      <p className="mt-4 text-sm text-gray-600">{DESCRIPTIONS[active]}</p>
    </div>
  );
}
