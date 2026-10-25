import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { paths, open, loadImages, observeErrors, expectNoOverflow } from './portfolio.helpers';

test.describe.configure({ mode: 'parallel' });

for (const width of [320, 360, 390, 768, 1024, 1440]) {
  for (const theme of ['light', 'dark'] as const) {
    for (const path of [...paths, '/404']) {
      test(`layout ${width}px ${theme} ${path}`, async ({ page }, testInfo) => {
        const errors = observeErrors(page);
        await page.setViewportSize({ width, height: width < 768 ? 844 : 1000 });
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
        const response = await open(page, path);
        expect(response?.status()).toBe(path === '/404' ? 404 : 200);
        await expect(page.locator('h1')).toHaveCount(1);
        await expect(page.locator('main')).toHaveCount(1);
        await expect(page).toHaveTitle(/Deepthi Ramesh/);
        expect(await page.locator('meta[name="description"]').getAttribute('content')).toBeTruthy();
        expect(await page.locator('html').evaluate((html) => html.classList.contains('dark'))).toBe(theme === 'dark');
        await loadImages(page);
        await expectNoOverflow(page);
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.screenshot({ path: testInfo.outputPath('full-page.jpg'), fullPage: true, type: 'jpeg', quality: 78 });
        expect(errors).toEqual([]);
      });
    }
  }
}

for (const theme of ['light', 'dark'] as const) {
  for (const path of [...paths, '/404']) {
    test(`accessibility ${theme} ${path}`, async ({ page }, testInfo) => {
      await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
      await open(page, path);
      await loadImages(page);
      await page.evaluate(() => window.scrollTo(0, 0));
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
      await testInfo.attach('accessibility.json', { body: JSON.stringify(results.violations, null, 2), contentType: 'application/json' });
      expect(results.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.map((n) => ({ target: n.target, failure: n.failureSummary })) }))).toEqual([]);
    });
  }
}

test('320px reflow, enlarged text, both themes and expanded mobile navigation', async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 820 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.addStyleTag({ content: 'html { font-size: 20px; }' });
  for (let i = 0; i < 2; i++) {
    await expectNoOverflow(page);
    await page.getByTestId('button-mobile-menu').click();
    await expectNoOverflow(page);
    await page.keyboard.press('Escape');
    await page.getByTestId('button-toggle-theme').click();
  }
});
