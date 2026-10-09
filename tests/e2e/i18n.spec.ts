import { expect, test } from '@playwright/test';

test('redirects a non-Spanish browser from the root to English', async ({ page }) => {
  await page.goto('/?from=test#events');
  await expect(page).toHaveURL(/\/en\/\?from=test#events$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'en');
});

test('keeps a Spanish browser on the Spanish root', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'languages', { get: () => ['es-ES', 'en'] });
    Object.defineProperty(navigator, 'language', { get: () => 'es-ES' });
  });
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await expect(page.getByRole('heading', { level: 1 })).toContainText('Creando agentes de IA');
});

test('manual language choice persists and preserves the section hash', async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    if (!localStorage.getItem('agentic-rioja-locale')) localStorage.setItem('agentic-rioja-locale', 'es');
  });
  await page.goto('/#events');
  if (isMobile) await page.locator('#mobile-menu summary').click();
  await page.locator('.language-switcher').getByRole('link', { name: 'EN' }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/en\/#events$/);
  expect(await page.evaluate(() => localStorage.getItem('agentic-rioja-locale'))).toBe('en');
  await page.goto('/');
  await expect(page).toHaveURL(/\/en\/$/);
});

for (const locale of [
  { path: '/', saved: 'es', lang: 'es', canonical: 'https://agenticrioja.com/', current: 'ES' },
  { path: '/en/', saved: 'en', lang: 'en', canonical: 'https://agenticrioja.com/en/', current: 'EN' },
] as const) {
  test(`${locale.path} publishes localized metadata and language controls`, async ({ page }) => {
    await page.addInitScript((saved) => localStorage.setItem('agentic-rioja-locale', saved), locale.saved);
    await page.goto(locale.path);
    await expect(page.locator('html')).toHaveAttribute('lang', locale.lang);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', locale.canonical);
    await expect(page.locator('link[rel="alternate"][hreflang="es"]')).toHaveAttribute('href', 'https://agenticrioja.com/');
    await expect(page.locator('link[rel="alternate"][hreflang="en"]')).toHaveAttribute('href', 'https://agenticrioja.com/en/');
    await expect(page.locator(`.language-switcher a[data-locale="${locale.lang}"]`).first()).toHaveAttribute('aria-current', 'page');
  });
}
