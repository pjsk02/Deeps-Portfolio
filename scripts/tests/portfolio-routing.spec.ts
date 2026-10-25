import { test, expect } from '@playwright/test';
import { paths, slugs, open, email, observeErrors } from './portfolio.helpers';

test('all internal links and fragments, source destinations, contact identities and five papers', async ({ page }, testInfo) => {
  const errors = observeErrors(page);
  const inventory: { from: string; label: string; href: string }[] = [];
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const path of paths) {
    await open(page, path);
    const links = await page.locator('a').evaluateAll((elements) => elements.map((a) => ({
      label: a.getAttribute('aria-label') || a.textContent?.trim() || '',
      href: a.getAttribute('href') || '',
    })));
    for (const link of links) {
      expect(link.label, `${path}: link needs a name`).not.toBe('');
      expect(link.href, `${path}: missing destination`).not.toBe('');
      inventory.push({ from: path, ...link });
      if (link.href.startsWith('mailto:')) {
        expect(link.href).toBe(`mailto:${email}`);
      } else {
        const target = new URL(link.href, page.url());
        if (target.origin === new URL(page.url()).origin && /^\/img\/[\w.-]+\.(jpe?g|png|webp)$/.test(target.pathname)) {
          // Full-size image links must point at a real image file.
          const res = await page.request.get(target.href);
          expect(res.ok(), `${path}: ${target.pathname}`).toBe(true);
          expect(res.headers()['content-type']).toContain('image/');
        } else if (target.origin === new URL(page.url()).origin) {
          expect(paths).toContain(target.pathname);
          if (target.hash) {
            if (target.pathname === path) await expect(page.locator(`[id="${target.hash.slice(1)}"]`)).toHaveCount(1);
            else expect(['#experience', '#work', '#research', '#contact', '#workbench', '#main']).toContain(target.hash);
          }
        } else {
          expect(target.protocol).toBe('https:');
          expect(target.hostname).not.toMatch(/framer|instagram|youtube|x\.com/);
        }
      }
    }
    if (path !== '/') {
      await expect(page.getByTestId('link-project-source')).toHaveAttribute('href', /^https:\/\/github\.com\/Deepthir13\//);
      const index = slugs.indexOf(path.split('/').pop()!);
      await expect(page.getByTestId('link-next-project')).toHaveAttribute('href', `/work/${slugs[(index + 1) % slugs.length]}`);
      await expect(page.getByTestId('link-prev-project')).toHaveAttribute('href', `/work/${slugs[(index + slugs.length - 1) % slugs.length]}`);
    }
  }
  await open(page);
  await expect(page.locator('[data-testid^="link-paper-"]')).toHaveCount(5);
  await expect(page.getByTestId('link-contact-linkedin')).toHaveAttribute('href', 'https://www.linkedin.com/in/deepthiramesh23/');
  await expect(page.getByTestId('link-contact-github')).toHaveAttribute('href', 'https://github.com/Deepthir13');
  await expect(page.locator('a[href*="drive.google.com"]')).toHaveCount(0);
  await expect(page.locator('body')).not.toContainText(/Landin|MandroDesign|support@grooic|900\+|20% stakeholder/);
  await testInfo.attach('link-inventory.json', { body: JSON.stringify(inventory, null, 2), contentType: 'application/json' });
  expect(errors).toEqual([]);
});

test('HTTP routing, canonical trailing slashes, aliases, unknown pages and asset errors', async ({ request, page }) => {
  for (const [from, to] of [['/about', '/#experience'], ['/portfolio', '/#work'], ['/contact', '/#contact'], ['/contact/', '/#contact'], ['/work/glowmetric/', '/work/glowmetric']]) {
    const response = await request.get(from, { maxRedirects: 0 });
    expect(response.status()).toBe(308);
    expect(response.headers().location).toBe(to);
    await open(page, from);
    await expect(page).toHaveURL(new RegExp(`${to.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`));
  }
  const query = await request.get('/contact?utm_source=check', { maxRedirects: 0 });
  expect(query.headers().location).toBe('/?utm_source=check#contact');
  for (const path of ['/not-a-real-page', '/work/not-a-project', '/privacy-policy', '/terms-conditions', '/portfolio/wayfields', '/portfolio/raven-studio', '/portfolio/whitestag', '/404']) {
    const response = await open(page, path);
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText('returned nothing');
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'noindex, follow');
    await page.getByTestId('link-404-home').click();
    await expect(page).toHaveURL(/\/$/);
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute('content', 'index, follow');
  }
  expect((await request.get('/img/not-an-image.jpg')).status()).toBe(404);
  expect((await request.get('/robots.txt')).status()).toBe(200);
});

test('all ten pages have useful HTML and unique metadata without JavaScript', async ({ browser, request }) => {
  const context = await browser.newContext({ javaScriptEnabled: false, viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  const titles: string[] = [];
  for (const path of paths) {
    await page.goto(`http://localhost${path}`);
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toBeVisible();
    const html = await (await request.get(path)).text();
    expect(html).toContain('<h1');
    expect(html).toContain('application/ld+json');
    titles.push(await page.title());
    if (path === '/') {
      await expect(page.locator('h1')).toHaveCSS('opacity', '1');
      await expect(page.locator('[data-testid^="link-paper-"]')).toHaveCount(5);
      await expect(page.getByTestId('button-game-start')).toBeHidden();
      await expect(page.getByRole('navigation', { name: 'Section navigation' })).toBeVisible();
    }
  }
  expect(new Set(titles).size).toBe(paths.length);
  await context.close();
});

test('initial load is self-hosted; optional demos do not load at the top of the page', async ({ page }) => {
  const requests: string[] = [];
  page.on('request', (request) => requests.push(request.url()));
  await open(page);
  await page.waitForLoadState('networkidle');
  expect(requests.filter((url) => !url.startsWith('http://localhost/'))).toEqual([]);
  expect(requests.some((url) => /pipeline-game-.*\.js/.test(url))).toBe(false);
  expect(requests.some((url) => /agent-walkthrough-.*\.js/.test(url))).toBe(false);
});
