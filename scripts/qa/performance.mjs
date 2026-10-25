import { chromium } from '@playwright/test';
import lighthouse from 'lighthouse';
import { mkdir, writeFile, readdir, readFile } from 'node:fs/promises';
import { gzipSync } from 'node:zlib';
import path from 'node:path';

const out = path.resolve('../generated-artifacts/performance');
await mkdir(out, { recursive: true });
const browser = await chromium.launch({
  executablePath: '/repl/tools/bin/chromium',
  args: ['--no-sandbox', '--disable-dev-shm-usage', '--remote-debugging-port=9222', '--remote-debugging-address=127.0.0.1'],
});
try {
  const report = await lighthouse('http://localhost/', {
    port: 9222,
    output: ['json', 'html'],
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  await writeFile(path.join(out, 'lighthouse.json'), report.report[0]);
  await writeFile(path.join(out, 'lighthouse.html'), report.report[1]);
  const audits = report.lhr.audits;
  const summary = {
    kind: 'Lighthouse simulated mobile lab run; not field Core Web Vitals',
    scores: Object.fromEntries(Object.entries(report.lhr.categories).map(([key, value]) => [key, Math.round(value.score * 100)])),
    metrics: Object.fromEntries(['first-contentful-paint', 'largest-contentful-paint', 'speed-index', 'total-blocking-time', 'cumulative-layout-shift', 'total-byte-weight'].map((key) => [key, { value: audits[key].numericValue, display: audits[key].displayValue }])),
    opportunities: Object.values(audits).filter((audit) => audit.score !== null && audit.score < 1).map((audit) => ({ id: audit.id, title: audit.title, display: audit.displayValue, score: audit.score })),
  };

  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
  const page = await context.newPage();
  await page.goto('http://localhost/');
  await page.waitForSelector('html[data-app-ready="true"]');
  const cdp = await context.newCDPSession(page);
  await cdp.send('Performance.enable');
  const measure = async () => {
    await cdp.send('HeapProfiler.collectGarbage');
    const { metrics } = await cdp.send('Performance.getMetrics');
    return Object.fromEntries(metrics.filter(({ name }) => ['JSHeapUsedSize', 'Nodes', 'Documents', 'JSEventListeners', 'TaskDuration'].includes(name)).map(({ name, value }) => [name, value]));
  };
  const cycle = async () => {
    await page.getByTestId('button-game-start').click();
    await page.getByTestId('button-game-choice-1').click();
    await page.getByTestId('button-game-reset').click();
    await page.getByTestId('button-game-exit').click();
  };
  // Warm exactly the same path before comparing retained memory. Keep a second
  // checkpoint to distinguish one-time initialization from ongoing growth.
  for (let i = 0; i < 5; i++) await cycle();
  const before = await measure();
  for (let i = 0; i < 20; i++) await cycle();
  const after20 = await measure();
  for (let i = 0; i < 20; i++) await cycle();
  const after = await measure();
  summary.repeatInteraction = { warmupCycles: 5, cycles: 40, before, after20, after, heapDeltaBytes: after.JSHeapUsedSize - before.JSHeapUsedSize, secondBatchDeltaBytes: after.JSHeapUsedSize - after20.JSHeapUsedSize, note: 'JavaScript retained heap after garbage collection, not total browser RAM.' };

  const files = await readdir(path.resolve('../artifacts/deepthi-portfolio/dist/public/assets'));
  summary.bundles = await Promise.all(files.filter((name) => name.endsWith('.js')).map(async (name) => {
    const bytes = await readFile(path.resolve('../artifacts/deepthi-portfolio/dist/public/assets', name));
    return { name, bytes: bytes.length, gzipBytes: gzipSync(bytes).length };
  }));
  await writeFile(path.join(out, 'summary.json'), JSON.stringify(summary, null, 2));
  console.log(JSON.stringify(summary, null, 2));
  await context.close();
} finally {
  await browser.close();
}
