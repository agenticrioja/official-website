import { expect, test } from '@playwright/test';

const LUMA = 'https://luma.com/aaif-logrono';

test.beforeEach(async ({ page }) => {
  await page.goto('/en/');
});

test('shows the hero with a Luma call to action', async ({ page }) => {
  await expect(page).toHaveTitle(/^Agentic Rioja/);
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Learn and build AI agents in La Rioja.');
  await expect(page.getByRole('img', { name: /Illustration of Logroño/ })).toBeVisible();
  await expect(page.locator('main').getByRole('link', { name: 'Meetups on Luma' }).first()).toHaveAttribute('href', LUMA);
});

test('renders every section', async ({ page }) => {
  for (const heading of ['Explore how agents work', 'Upcoming meetups', 'What to expect at a meetup', 'Made in La Rioja', "Who's behind this", 'Join us in Logroño']) {
    await expect(page.getByRole('heading', { level: 2, name: heading })).toBeVisible();
  }
});

test('distills participation into one action and a simple list', async ({ page }) => {
  const join = page.locator('#join');
  await expect(join.getByRole('listitem')).toHaveCount(3);
  await expect(join.locator('article')).toHaveCount(0);
  await expect(join.getByRole('link', { name: 'Meetups on Luma' })).toHaveCount(1);
});

test('every in-page link points to an existing section', async ({ page }) => {
  const hrefs = await page.locator('a[href^="#"]').evaluateAll((as) => as.map((a) => a.getAttribute('href')!));
  expect(hrefs.length).toBeGreaterThan(0);
  for (const href of new Set(hrefs)) {
    await expect(page.locator(href), `${href} target`).toHaveCount(1);
  }
});

test('events section shows event cards or the coming-soon notice', async ({ page }) => {
  const events = page.locator('#events');
  const cards = events.locator('article');
  if ((await cards.count()) === 0) {
    await expect(events.getByText('We’re planning our first meetup.')).toBeVisible();
  } else {
    await expect(cards.first().getByRole('heading', { level: 3 })).toBeVisible();
    await expect(cards.first().getByRole('link', { name: /Luma/ })).toHaveAttribute('href', /^https:\/\/luma\.com\//);
  }
});

test('lists both organizers', async ({ page }) => {
  const organizers = page.locator('#organizers');
  await expect(organizers.getByRole('heading', { name: 'Diego Cristóbal Herreros' })).toBeVisible();
  await expect(organizers.getByRole('heading', { name: 'Adrián Barrio Andrés' })).toBeVisible();
});

test('all images and the OG image load', async ({ page, request }) => {
  const srcs = await page.locator('img').evaluateAll((imgs) => imgs.map((i) => (i as HTMLImageElement).src));
  const og = await page.locator('meta[property="og:image"]').getAttribute('content');
  // og:image is absolute to the production domain; check the same path locally.
  const urls = [...new Set(srcs), new URL(og!).pathname, '/favicon.svg', '/apple-touch-icon.png'];
  for (const url of urls) {
    expect((await request.get(url)).status(), url).toBe(200);
  }
});

test('has SEO metadata and valid structured data', async ({ page }) => {
  await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /Logroño/);
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://agenticrioja.com/en/');
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', 'https://agenticrioja.com/og.png');
  const blocks = await page.locator('script[type="application/ld+json"]').allTextContents();
  const parsed = blocks.flatMap((b) => [JSON.parse(b)].flat());
  expect(parsed.some((d) => d['@type'] === 'Organization')).toBe(true);
});

test('skip link moves focus to the main content', async ({ page, isMobile }) => {
  test.skip(isMobile, 'keyboard navigation');
  await page.keyboard.press('Tab');
  const skip = page.getByRole('link', { name: 'Skip to content' });
  await expect(skip).toBeFocused();
  await skip.press('Enter');
  await expect(page).toHaveURL(/#main$/);
});

test('mobile menu opens and closes after choosing a link', async ({ page, isMobile }) => {
  test.skip(!isMobile, 'mobile only');
  const menu = page.locator('#mobile-menu');
  await menu.getByText('Menu').click();
  await expect(menu).toHaveAttribute('open', '');
  await menu.getByRole('link', { name: 'Meetups', exact: true }).click();
  await expect(menu).not.toHaveAttribute('open');
  await expect(page).toHaveURL(/#events$/);
});

test('reduced motion swaps GIFs for still images', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  const robot = page.locator('#topics img').first();
  await robot.scrollIntoViewIfNeeded();
  await expect(robot).toHaveJSProperty('complete', true);
  expect(await robot.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.png(?:\?|$)/);
});

test('serves efficient animated artwork to motion-enabled visitors', async ({ page }) => {
  const robots = page.locator('#topics img');
  await robots.first().scrollIntoViewIfNeeded();
  await expect(robots.first()).toHaveJSProperty('complete', true);
  for (const robot of await robots.all()) {
    expect(await robot.evaluate((img: HTMLImageElement) => img.currentSrc)).toMatch(/\.webp(?:\?|$)/);
  }
});

test('keeps the AAIF chapter affiliation visible', async ({ page }) => {
  const strip = page.getByRole('region', { name: 'Our foundation' });
  await expect(strip.getByRole('link', { name: 'Agentic AI Foundation (AAIF)' })).toHaveAttribute('href', 'https://aaif.io');
  await expect(strip.getByRole('link', { name: 'Linux Foundation' })).toHaveAttribute('href', 'https://www.linuxfoundation.org');
  await expect(page.locator('#about').getByRole('heading', { name: 'Logroño chapter of the AAIF' })).toBeVisible();
  await expect(page.locator('footer').getByRole('link', { name: 'Agentic AI Foundation' })).toHaveAttribute('href', 'https://aaif.io');
});

test('links to our sibling community, Cloud Native Rioja', async ({ page }) => {
  await expect(page.locator('#about').getByRole('link', { name: 'cloudnativerioja.com' })).toHaveAttribute('href', 'https://cloudnativerioja.com');
  await expect(page.locator('footer').getByRole('link', { name: 'Cloud Native Rioja' })).toHaveAttribute('href', 'https://cloudnativerioja.com');
});

test('links to the Agentic Rioja GitHub organization', async ({ page }) => {
  await expect(page.locator('footer').getByRole('link', { name: 'GitHub' })).toHaveAttribute('href', 'https://github.com/agenticrioja');
});
