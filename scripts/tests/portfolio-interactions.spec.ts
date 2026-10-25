import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open, observeErrors, expectNoOverflow } from './portfolio.helpers';

test('theme and motion follow system, persist overrides, and survive route navigation', async ({ page }) => {
  const errors = observeErrors(page);
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
  await open(page);
  await expect(page.getByTestId('button-toggle-theme')).toHaveAccessibleName('Switch to light theme');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await expect(page.getByTestId('button-toggle-theme')).toHaveAccessibleName('Switch to dark theme');
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'on');
  await page.getByTestId('button-toggle-theme').click();
  await page.getByTestId('button-toggle-motion').click();
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'no-preference' });
  await page.getByTestId('link-case-food-inspections').click();
  await expect(page).toHaveURL(/\/work\/food-inspections$/);
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByTestId('link-next-project').click();
  await expect(page).toHaveURL(/\/work\/glowmetric$/);
  await page.goBack();
  await expect(page).toHaveURL(/\/work\/food-inspections$/);
  await page.goForward();
  await expect(page).toHaveURL(/\/work\/glowmetric$/);
  await page.getByTestId('link-back-work').click();
  await expect(page).toHaveURL(/\/#work$/);
  await expect(page.getByTestId('link-case-food-inspections')).toBeVisible();
  expect(errors).toEqual([]);
});

test('storage denied does not break preferences or rendering', async ({ page }) => {
  await page.addInitScript(() => {
    Storage.prototype.getItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
  });
  const errors = observeErrors(page);
  await open(page);
  await page.getByTestId('button-toggle-theme').click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await page.getByTestId('button-toggle-motion').click();
  await expect(page.locator('html')).toHaveAttribute('data-motion', 'off');
  expect(errors).toEqual([]);
});

test('mobile menu, keyboard Escape, focus return, section anchors and skip link', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page);
  await page.keyboard.press('Tab');
  await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('#main')).toBeFocused();
  const menu = page.getByTestId('button-mobile-menu');
  await menu.click();
  await expect(menu).toHaveAttribute('aria-expanded', 'true');
  await expect(page.getByTestId('link-mobile-experience')).toBeFocused();
  await page.keyboard.press('Escape');
  await expect(menu).toHaveAttribute('aria-expanded', 'false');
  await expect(menu).toBeFocused();
  for (const section of ['experience', 'work', 'research', 'contact']) {
    await menu.click();
    await page.getByTestId(`link-mobile-${section}`).click();
    await expect(page).toHaveURL(new RegExp(`#${section}$`));
    await expect(menu).toHaveAttribute('aria-expanded', 'false');
    await expect.poll(() => page.locator(`#${section}`).evaluate((el) => el.getBoundingClientRect().top)).toBeGreaterThanOrEqual(63);
    await expect.poll(() => page.locator(`#${section}`).evaluate((el) => el.getBoundingClientRect().top)).toBeLessThan(800);
  }
});

for (const theme of ['light', 'dark'] as const) {
  test(`workbench sample A/B, all manual steps, human approval, reset and accessibility — ${theme}`, async ({ page }) => {
    const errors = observeErrors(page);
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    await open(page, '/#workbench');
    const widget = page.getByTestId('widget-agent-walkthrough');
    await expect(widget).toBeVisible();
    await expect(widget).toContainText('no live AI');
    for (const sample of ['a', 'b']) {
      await page.getByTestId(`radio-sample-${sample}`).check();
      await page.getByTestId('button-agent-run').click();
      await expect(widget).toContainText(sample === 'a' ? 'Engagement is steady' : 'Small, highly engaged audience');
      for (let i = 0; i < 3; i++) await page.getByTestId('button-agent-next').click();
      await expect(page.getByTestId('button-agent-next')).toBeDisabled();
      await page.getByTestId('button-agent-approve').click();
      await expect(widget).toContainText('Brief approved by a human reviewer');
      await expectNoOverflow(page);
      await page.getByTestId('button-agent-reset').click();
      await expect(widget.getByText('Waiting…', { exact: true })).toHaveCount(3);
    }
    const a11y = await new AxeBuilder({ page }).include('[data-testid="widget-agent-walkthrough"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
    expect(a11y.violations).toEqual([]);
    expect(errors).toEqual([]);
  });
}

test('autoplay pauses offscreen, while hidden, and when motion is off', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  await open(page, '/#workbench');
  await page.getByTestId('button-agent-run').click();
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(2200);
  const widget = page.getByTestId('widget-agent-walkthrough');
  await expect(widget.getByText('Waiting…', { exact: true })).toHaveCount(2);
  await widget.scrollIntoViewIfNeeded();
  await expect(widget.getByText('Waiting…', { exact: true })).toHaveCount(1);
  // Chromium's hidden-tab event is deterministic here; no OS focus assumption.
  await page.evaluate(() => {
    Object.defineProperty(document, 'hidden', { configurable: true, get: () => true });
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.waitForTimeout(2200);
  await expect(widget.getByText('Waiting…', { exact: true })).toHaveCount(1);
  await page.evaluate(() => {
    Reflect.deleteProperty(document, 'hidden');
    document.dispatchEvent(new Event('visibilitychange'));
  });
  await page.getByTestId('button-toggle-motion').click();
  await page.waitForTimeout(2200);
  await expect(widget.getByText('Waiting…', { exact: true })).toHaveCount(1);
});

test('game: every answer in every round, feedback, reset, skip, exit and result link', async ({ page }) => {
  const errors = observeErrors(page);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '/#game');
  await page.getByTestId('details-game-solution').locator('summary').click();
  await expect(page.getByTestId('details-game-solution')).toContainText('city + inspection + violation');
  await page.getByTestId('button-game-start').click();
  const game = page.getByTestId('widget-pipeline-game');
  for (let choice = 1; choice <= 3; choice++) {
    await page.getByTestId('button-game-reset').click();
    for (let stage = 1; stage <= 3; stage++) {
      await expect(game).toContainText(`stage ${stage}/3`);
      await page.getByTestId(`button-game-choice-${choice}`).click();
      await expect(game).toContainText(stage === choice ? 'GOOD CALL.' : 'NOT QUITE.');
      await expect(page.getByTestId('button-game-choice-1')).toBeDisabled();
      await expectNoOverflow(page);
      await page.getByTestId('button-game-next').click();
    }
    await expect(game).toContainText('1/3 first-try calls');
  }
  await page.getByTestId('button-game-reset').click();
  await page.getByTestId('button-game-skip').click();
  await expect(game).toContainText('SOLUTION PREVIEW');
  await expect(game).not.toContainText('PIPELINE CLEAN');
  await page.getByTestId('button-game-exit').click();
  await expect(page.getByTestId('button-game-start')).toBeFocused();
  await page.getByTestId('button-game-start').click();
  await game.focus();
  await page.keyboard.press('Escape');
  await expect(page.getByTestId('button-game-start')).toBeFocused();
  await page.getByTestId('button-game-start').click();
  await page.getByTestId('button-game-skip').click();
  await game.getByRole('link', { name: 'See the real inspection pipeline' }).click();
  await expect(page).toHaveURL(/\/work\/food-inspections$/);
  expect(errors).toEqual([]);
});

test('game keyboard shortcuts and Enter on a native button never skip a stage', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await open(page, '/#game');
  await page.getByTestId('button-game-start').click();
  const game = page.getByTestId('widget-pipeline-game');
  await expect(game).toBeFocused();
  await page.keyboard.press('1');
  await page.getByTestId('button-game-next').focus();
  await page.keyboard.press('Enter');
  await expect(game).toContainText('stage 2/3');
  await game.focus();
  await page.keyboard.press('2');
  await page.keyboard.press('Enter');
  await expect(game).toContainText('stage 3/3');
  await page.keyboard.press('3');
  await page.keyboard.press('Enter');
  await expect(game).toContainText('3/3 first-try calls');
  const results = await new AxeBuilder({ page }).include('[data-testid="widget-pipeline-game"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze();
  expect(results.violations).toEqual([]);
});

test('mobile touch can complete and reset the game', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 360, height: 780 }, isMobile: true, hasTouch: true, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await open(page, 'http://localhost/#game');
  await page.getByTestId('button-game-start').tap();
  for (let n = 1; n <= 3; n++) {
    await page.getByTestId(`button-game-choice-${n}`).tap();
    await page.getByTestId('button-game-next').tap();
  }
  await expect(page.getByTestId('widget-pipeline-game')).toContainText('3/3 first-try calls');
  await page.getByTestId('button-game-reset').tap();
  await expect(page.getByTestId('widget-pipeline-game')).toContainText('stage 1/3');
  await expectNoOverflow(page);
  await context.close();
});
