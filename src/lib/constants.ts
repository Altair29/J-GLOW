export const SUPPORTED_LANGUAGES = [
  { code: 'ja', name: '日本語', nativeName: '日本語' },
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'zh', name: 'Chinese', nativeName: '中文' },
  { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt' },
  { code: 'tl', name: 'Filipino', nativeName: 'Filipino' },
  { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
  { code: 'id', name: 'Indonesian', nativeName: 'Bahasa Indonesia' },
  { code: 'th', name: 'Thai', nativeName: 'ภาษาไทย' },
  { code: 'my', name: 'Burmese', nativeName: 'မြန်မာဘာသာ' },
  { code: 'ne', name: 'Nepali', nativeName: 'नेपाली' },
  { code: 'km', name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
] as const;

export type LanguageCode = (typeof SUPPORTED_LANGUAGES)[number]['code'];

export const DEFAULT_LANGUAGE: LanguageCode = 'ja';

export const ROLES = {
  ADMIN: 'admin',
  BUSINESS: 'business',
  WORKER: 'worker',
} as const;
