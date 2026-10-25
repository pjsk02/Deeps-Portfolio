import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { open, expectNoOverflow, observeErrors } from './portfolio.helpers';

for (const theme of ['light', 'dark'] as const) {
  test(`supplied palette and mobile browser color — ${theme}`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
    await open(page);
    await expect(page.locator('body')).toHaveCSS('background-color', theme === 'dark' ? 'rgb(35, 24, 21)' : 'rgb(255, 253, 246)');
    await expect(page.getByTestId('link-home').locator('rect')).toHaveCSS('fill', theme === 'dark' ? 'rgb(165, 188, 214)' : 'rgb(77, 14, 18)');
    const expectedColor = theme === 'dark' ? '#231815' : '#FFFDF6';
    expect(await page.locator('meta[name="theme-color"]').evaluateAll((nodes) => nodes.map((n) => n.getAttribute('content')))).toEqual([expectedColor, expectedColor]);
    await page.getByTestId('button-toggle-theme').click();
    const changedColor = theme === 'dark' ? '#FFFDF6' : '#231815';
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', changedColor);
    await page.reload();
    await expect(page.locator('meta[name="theme-color"]').first()).toHaveAttribute('content', changedColor);
    const favicon = await page.request.get('/favicon.svg');
    expect(favicon.ok()).toBe(true);
    expect(await favicon.text()).toContain('#4D0E12');
  });
}

test.describe('touch layouts', () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const viewport of [
    { width: 320, height: 740 },
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1024, height: 768 },
    { width: 844, height: 390 },
  ]) {
    for (const theme of ['light', 'dark'] as const) {
      test(`${viewport.width}×${viewport.height} ${theme}: navigation, workflow and all game stages`, async ({ page }, testInfo) => {
        const errors = observeErrors(page);
        await page.setViewportSize(viewport);
        await page.emulateMedia({ colorScheme: theme, reducedMotion: 'reduce' });
        await open(page);
        await expectNoOverflow(page);
        if (viewport.width < 768) {
          await page.getByTestId('button-mobile-menu').tap();
          await page.getByTestId('link-mobile-work').tap();
          await expect(page.getByTestId('button-mobile-menu')).toHaveAttribute('aria-expanded', 'false');
        } else {
          await page.getByTestId('link-nav-work').tap();
        }
        await expect(page).toHaveURL(/#work$/);

        await page.locator('#workbench').scrollIntoViewIfNeeded();
        await page.getByTestId('radio-sample-b').check();
        await page.getByTestId('button-agent-run').tap();
        for (let n = 0; n < 3; n++) await page.getByTestId('button-agent-next').tap();
        await page.getByTestId('button-agent-approve').tap();
        await expectNoOverflow(page);

        await page.getByTestId('button-game-start').tap();
        const game = page.getByTestId('widget-pipeline-game');
        for (let stage = 0; stage < 3; stage++) {
          await expect(game).toContainText(`stage ${stage + 1}/3`);
          await page.getByTestId(`button-game-choice-${stage === 0 ? 2 : stage + 1}`).tap();
          await expectNoOverflow(page);
          if (stage === 0) {
            await expect(game).toContainText('NOT QUITE.');
            const results = await new AxeBuilder({ page }).include('[data-testid="widget-pipeline-game"]').withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa']).analyze();
            expect(results.violations.map(({ id, nodes }) => ({ id, targets: nodes.map((node) => node.target) }))).toEqual([]);
          }
          const next = page.getByTestId('button-game-next');
          expect((await next.boundingBox())!.height).toBeGreaterThanOrEqual(44);
          await next.tap();
        }
        await expect(game).toContainText('PIPELINE CLEAN. 2/3');
        await game.screenshot({ path: testInfo.outputPath('touch-game-result.png') });
        await page.getByTestId('button-game-exit').tap();
        await expect(page.getByTestId('button-game-start')).toBeVisible();

        // Resize the same session, rather than only testing fresh page loads.
        await page.setViewportSize({ width: viewport.height, height: viewport.width });
        await expectNoOverflow(page);
        expect(errors).toEqual([]);
      });
    }
  }

  test('320px game reflows with enlarged text', async ({ page }) => {
    await page.setViewportSize({ width: 320, height: 740 });
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await open(page);
    await page.addStyleTag({ content: 'html { font-size: 20px; }' });
    await page.getByTestId('button-game-start').tap();
    for (let stage = 1; stage <= 3; stage++) {
      await page.getByTestId(`button-game-choice-${stage}`).tap();
      await expectNoOverflow(page);
      await page.getByTestId('button-game-next').tap();
    }
    await expect(page.getByTestId('widget-pipeline-game')).toContainText('PIPELINE CLEAN. 3/3');
  });
});
