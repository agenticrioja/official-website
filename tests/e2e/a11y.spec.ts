import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

for (const path of ['/', '/en/', '/404']) {
  test(`${path} has no WCAG 2.1 AA violations`, async ({ page }) => {
    if (path === '/') await page.addInitScript(() => localStorage.setItem('agentic-rioja-locale', 'es'));
    await page.goto(path);
    await expect(page.locator('html')).toHaveAttribute('lang', path === '/en/' ? 'en' : 'es');
    const { violations } = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa']).analyze();
    expect(violations.map((v) => `${v.id}: ${v.nodes.map((n) => n.target).join(', ')}`)).toEqual([]);
  });
}
