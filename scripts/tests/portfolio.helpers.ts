import { expect, type Page } from '@playwright/test';

export const slugs = [
  'food-inspections', 'glowmetric', 'cloutwatch', 'trip-sync', 'lease-lens',
  'ecommerce-funnel', 'cloud-bi', 'media-metadata', 'supply-chain',
];
export const paths = ['/', ...slugs.map((slug) => `/work/${slug}`)];
export const email = 'ramesh.dee@northeastern.edu';

export function observeErrors(page: Page) {
  const errors: string[] = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error' && !message.text().startsWith('Failed to load resource:')) errors.push(message.text());
  });
  page.on('response', (response) => {
    if (response.status() >= 400 && response.request().resourceType() !== 'document') errors.push(`${response.status()} ${response.url()}`);
  });
  return errors;
}

export async function open(page: Page, path = '/') {
  const response = await page.goto(path);
  await expect(page.locator('html')).toHaveAttribute('data-app-ready', 'true');
  await page.evaluate(() => document.fonts.ready);
  return response;
}

export async function loadImages(page: Page) {
  const images = page.locator('img');
  for (let i = 0; i < await images.count(); i++) {
    const image = images.nth(i);
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.complete && element.naturalWidth > 0)).toBe(true);
    await expect(image).toHaveAttribute('alt', /\S+/);
    expect(await image.getAttribute('width')).toBeTruthy();
    expect(await image.getAttribute('height')).toBeTruthy();
  }
}

export async function expectNoOverflow(page: Page) {
  const overflow = await page.evaluate(() => {
    if (document.documentElement.scrollWidth <= window.innerWidth + 1) return [];
    return Array.from(document.querySelectorAll<HTMLElement>('body *')).filter((element) => {
      const rect = element.getBoundingClientRect();
      return rect.width > 0 && (rect.right > innerWidth + 1 || rect.left < -1) && getComputedStyle(element).position !== 'fixed';
    }).map((element) => ({ tag: element.tagName, class: element.className, text: element.textContent?.slice(0, 90) })).slice(0, 15);
  });
  expect(overflow, 'Elements extend outside the viewport').toEqual([]);
}
