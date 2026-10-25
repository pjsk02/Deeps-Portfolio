import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open, observeErrors, email } from './portfolio.helpers';

test('primary navigation marks the section being read', async ({ page }) => {
  const errors = observeErrors(page);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await expect(page.locator('[aria-current="location"]')).toHaveCount(0);
  for (const [id, label] of [['experience', 'Experience'], ['work', 'Work'], ['research', 'Research'], ['contact', 'Contact']]) {
    await page.locator(`#${id}`).evaluate((el) => el.scrollIntoView({ block: 'start' }));
    await expect(page.getByTestId(`link-nav-${id}`)).toHaveAttribute('aria-current', 'location');
    await expect(page.locator('nav[aria-label="Primary"] [aria-current="location"]')).toHaveText(label);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await expect(page.locator('[aria-current="location"]')).toHaveCount(0);
  // Not shown on case-study pages, where the sections do not exist.
  await open(page, '/work/glowmetric');
  await expect(page.locator('[aria-current="location"]')).toHaveCount(0);
  expect(errors).toEqual([]);
});

test('mobile menu shows the current section', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.locator('#research').evaluate((el) => el.scrollIntoView({ block: 'start' }));
  await page.getByTestId('button-mobile-menu').click();
  await expect(page.getByTestId('link-mobile-research')).toHaveAttribute('aria-current', 'location');
  await expect(page.getByTestId('link-mobile-research')).toContainText('You are here');
});

test('section numbers match the jump navigation', async ({ page }) => {
  await open(page);
  const jump = await page.locator('nav[aria-label="Jump to section"] a').evaluateAll((links) =>
    links.map((a) => [a.querySelector('.mono')?.textContent?.trim(), a.getAttribute('href')?.replace(/^.*#/, '')]));
  for (const [n, id] of jump) {
    const kicker = await page.locator(`#${id}`).evaluate((h) => h.closest('section')!.textContent ?? '');
    expect(kicker, `section ${id}`).toContain(`${n} ·`);
  }
});

test('copy email button copies the address and announces it', async ({ page, context }) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write']);
  await open(page);
  await page.getByTestId('button-copy-email').click();
  await expect(page.getByTestId('button-copy-email')).toHaveText('Email copied');
  await expect(page.getByTestId('status-copy-email')).toHaveText('Email address copied to clipboard.');
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(email);
  await expect(page.getByTestId('button-copy-email')).toHaveText('Copy email', { timeout: 5000 });
  const a11y = await new AxeBuilder({ page }).include('#contact').analyze();
  expect(a11y.violations).toEqual([]);
});

test('copy email failure explains the fallback', async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(navigator, 'clipboard', { value: { writeText: () => Promise.reject(new Error('denied')) } });
  });
  await open(page);
  await page.getByTestId('button-copy-email').click();
  await expect(page.getByTestId('button-copy-email')).toHaveText('Copy unavailable');
  await expect(page.getByTestId('status-copy-email')).toContainText(email);
});

test('dashboard screenshots open full size', async ({ page }) => {
  await open(page, '/work/glowmetric');
  for (const n of [1, 2, 3]) {
    const link = page.getByTestId(`link-dashboard-full-${n}`);
    await expect(link).toHaveAttribute('target', '_blank');
    const href = await link.getAttribute('href');
    const res = await page.request.get(href!);
    expect(res.ok()).toBe(true);
    expect(res.headers()['content-type']).toContain('image/');
  }
});

test('diagram labels stay inside their boxes', async ({ page }) => {
  for (const theme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme: theme });
    await open(page, '/work/food-inspections');
    const outside = await page.locator('svg[aria-label^="Diagram: Chicago"]').evaluate((svg) => {
      const rects = Array.from(svg.querySelectorAll('rect')).map((r) => r.getBBox()).filter((b) => b.width > 40);
      return Array.from(svg.querySelectorAll('text')).flatMap((t) => {
        const b = t.getBBox();
        const box = rects.find((r) => b.y >= r.y && b.y + b.height <= r.y + r.height && b.x >= r.x - 1 && b.x < r.x + r.width);
        if (!box) return [];
        return b.x + b.width > box.x + box.width - 4 ? [t.textContent] : [];
      });
    });
    expect(outside).toEqual([]);
  }
});

test('sections animate in on scroll when motion is on, and never hide when it is off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await open(page);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  const cards = page.locator('section[aria-labelledby="capabilities"] .stagger');
  await expect(cards).toHaveClass(/reveal-wait/);
  await expect.poll(() => cards.locator('> *').first().evaluate((el) => getComputedStyle(el).opacity)).toBe('0');
  await cards.evaluate((el) => el.scrollIntoView({ block: 'center', behavior: 'instant' }));
  await expect(cards).toHaveClass(/\bin\b/);
  await expect.poll(() => cards.locator('> *').last().evaluate((el) => getComputedStyle(el).opacity)).toBe('1');
  await page.getByTestId('button-toggle-motion').click();
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  const hidden = await page.locator('.reveal, .stagger > *').evaluateAll((els) => els.filter((el) => getComputedStyle(el).opacity !== '1').length);
  expect(hidden).toBe(0);
});
