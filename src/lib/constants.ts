export const SUPPORTED_LANGUAGES = [
  { code: 'ja', name: '日本語', nativeName: '日本語' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'mn', name: 'Mongolian', nativeName: 'Монгол хэл' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'ja';

export const ROLES = {
  ADMIN: 'admin',
  BUSINESS: 'business',
  WORKER: 'worker',
} as const;
