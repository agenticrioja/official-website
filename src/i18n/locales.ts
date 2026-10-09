export const locales = ['es', 'en'] as const;
export type Locale = (typeof locales)[number];
export type LocalizedText = Record<Locale, string>;

export const isLocale = (value: unknown): value is Locale => value === 'es' || value === 'en';

export const localize = (value: LocalizedText, locale: Locale): string => value[locale];

export const localePath = (locale: Locale): '/' | '/en/' => locale === 'es' ? '/' : '/en/';

export const alternateLocale = (locale: Locale): Locale => locale === 'es' ? 'en' : 'es';

export function shouldRedirectToEnglish(savedLocale: unknown, browserLanguages: readonly string[]): boolean {
  if (savedLocale === 'es') return false;
  if (savedLocale === 'en') return true;
  return !browserLanguages[0]?.toLowerCase().startsWith('es');
}
