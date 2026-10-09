import { describe, expect, it } from 'vitest';
import {
  alternateLocale,
  isLocale,
  localePath,
  localize,
  shouldRedirectToEnglish,
} from '../../src/i18n/locales';

describe('locale helpers', () => {
  it('recognizes only supported locales', () => {
    expect(isLocale('es')).toBe(true);
    expect(isLocale('en')).toBe(true);
    expect(isLocale('fr')).toBe(false);
    expect(isLocale(null)).toBe(false);
  });

  it('selects localized text and maps locale routes', () => {
    expect(localize({ es: 'Hola', en: 'Hello' }, 'es')).toBe('Hola');
    expect(localize({ es: 'Hola', en: 'Hello' }, 'en')).toBe('Hello');
    expect(localePath('es')).toBe('/');
    expect(localePath('en')).toBe('/en/');
    expect(alternateLocale('es')).toBe('en');
    expect(alternateLocale('en')).toBe('es');
  });
});

describe('browser language detection', () => {
  it('gives valid saved choices precedence', () => {
    expect(shouldRedirectToEnglish('es', ['en-US'])).toBe(false);
    expect(shouldRedirectToEnglish('en', ['es-ES'])).toBe(true);
  });

  it('keeps Spanish primary languages on Spanish', () => {
    expect(shouldRedirectToEnglish(null, ['es'])).toBe(false);
    expect(shouldRedirectToEnglish(undefined, ['ES-mx', 'en'])).toBe(false);
  });

  it('sends unsupported, invalid and missing languages to English', () => {
    expect(shouldRedirectToEnglish(null, ['fr-FR', 'es-ES'])).toBe(true);
    expect(shouldRedirectToEnglish('invalid', ['en-GB'])).toBe(true);
    expect(shouldRedirectToEnglish(undefined, [])).toBe(true);
  });
});
