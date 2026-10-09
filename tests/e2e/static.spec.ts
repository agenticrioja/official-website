import { expect, test } from '@playwright/test';

test('custom domain and crawler files are published', async ({ request }) => {
  expect((await (await request.get('/CNAME')).text()).trim()).toBe('agenticrioja.com');
  expect(await (await request.get('/robots.txt')).text()).toContain('https://agenticrioja.com/sitemap-index.xml');
  const sitemapIndex = await request.get('/sitemap-index.xml');
  expect(sitemapIndex.status()).toBe(200);
  const sitemap = await request.get('/sitemap-0.xml');
  expect(await sitemap.text()).toContain('<loc>https://agenticrioja.com/</loc>');
  expect(await sitemap.text()).toContain('<loc>https://agenticrioja.com/en/</loc>');
});

test('404 page links back home', async ({ page }) => {
  await page.goto('/404');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
  await page.getByRole('link', { name: 'Back home' }).click();
  await expect(page).toHaveURL(/\/$/);
});

test('404 page offers Spanish and English recovery links', async ({ page }) => {
  await page.goto('/404');
  await expect(page.getByRole('link', { name: 'Volver al inicio' })).toHaveAttribute('href', '/');
  await expect(page.getByRole('link', { name: 'Back home' })).toHaveAttribute('href', '/en/');
});
