import { expect, test } from '@playwright/test';

test('custom domain and crawler files are published', async ({ request }) => {
  expect((await (await request.get('/CNAME')).text()).trim()).toBe('agenticrioja.com');
  expect(await (await request.get('/robots.txt')).text()).toContain('https://agenticrioja.com/sitemap-index.xml');
  expect((await request.get('/sitemap-index.xml')).status()).toBe(200);
});

test('404 page links back home', async ({ page }) => {
  await page.goto('/404');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('404');
  await page.getByRole('link', { name: 'Back home' }).click();
  await expect(page).toHaveURL(/\/$/);
});
