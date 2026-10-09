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

test('preserves the section hash when storing the language preference fails', async ({ page, isMobile }) => {
  await page.addInitScript(() => {
    Storage.prototype.setItem.call(localStorage, 'agentic-rioja-locale', 'es');
    Storage.prototype.setItem = () => { throw new DOMException('Storage disabled'); };
  });
  await page.goto('/#events');
  if (isMobile) await page.locator('#mobile-menu summary').click();
  await page.locator('.language-switcher').getByRole('link', { name: 'EN' }).filter({ visible: true }).click();
  await expect(page).toHaveURL(/\/en\/#events$/);
});

test('mobile language controls have touch targets and a non-color current state', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  await page.goto('/en/');
  await page.locator('#mobile-menu summary').click();
  const switcher = page.locator('#mobile-menu .language-switcher');
  const current = page.locator('#mobile-menu .language-switcher a[aria-current="page"]');
  const alternate = page.locator('#mobile-menu .language-switcher a:not([aria-current="page"])');
  const box = await current.boundingBox();
  const switcherBox = await switcher.boundingBox();
  expect(box?.width).toBeGreaterThanOrEqual(44);
  expect(box?.height).toBeGreaterThanOrEqual(44);
  expect(box!.width).toBeGreaterThan(box!.height);
  expect(switcherBox?.height).toBeLessThanOrEqual(48);
  await expect(switcher).toHaveCSS('border-top-style', 'solid');
  await expect(switcher).toHaveCSS('border-top-width', '1px');
  expect(parseFloat(await switcher.evaluate((element) => getComputedStyle(element).borderRadius))).toBeGreaterThan(20);
  await expect(current).toHaveCSS('text-decoration-line', 'none');
  expect(Number(await current.evaluate((link) => getComputedStyle(link).fontWeight)))
    .toBeGreaterThan(Number(await alternate.evaluate((link) => getComputedStyle(link).fontWeight)));
});

for (const preference of [
  { saved: 'es', browser: 'en-US', expected: /\/$/, lang: 'es' },
  { saved: 'en', browser: 'es-ES', expected: /\/en\/$/, lang: 'en' },
  { saved: 'invalid', browser: 'fr-FR', expected: /\/en\/$/, lang: 'en' },
] as const) {
  test(`saved ${preference.saved} with browser ${preference.browser} resolves to ${preference.lang}`, async ({ page }) => {
    await page.addInitScript(({ saved, browser }) => {
      localStorage.setItem('agentic-rioja-locale', saved);
      Object.defineProperty(navigator, 'languages', { get: () => [browser] });
      Object.defineProperty(navigator, 'language', { get: () => browser });
    }, preference);
    await page.goto('/');
    await expect(page).toHaveURL(preference.expected);
    await expect(page.locator('html')).toHaveAttribute('lang', preference.lang);
  });
}

test('the static Spanish root remains usable without JavaScript', async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, locale: 'en-US' });
  const page = await context.newPage();
  await page.goto('/');
  await expect(page).toHaveURL(/\/$/);
  await expect(page.locator('html')).toHaveAttribute('lang', 'es');
  await context.close();
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
    await expect(page.locator('meta[property="og:locale"]')).toHaveAttribute('content', locale.lang === 'es' ? 'es_ES' : 'en_GB');
    const structuredData = await page.locator('script[type="application/ld+json"]').allTextContents();
    expect(structuredData.every((block) => JSON.parse(block))).toBe(true);
    await expect(page.locator(`.language-switcher a[data-locale="${locale.lang}"]`).first()).toHaveAttribute('aria-current', 'page');
  });
}
