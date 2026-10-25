import { readFile, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const output = path.resolve('../generated-artifacts');
const publicDir = path.resolve('../artifacts/deepthi-portfolio/dist/public');
const manifest = JSON.parse(await readFile(path.join(publicDir, 'route-manifest.json'), 'utf8'));
const links = new Set();
for (const route of manifest.routes) {
  const html = await readFile(path.join(publicDir, route.slice(1), 'index.html'), 'utf8');
  for (const match of html.matchAll(/<a\b[^>]*href="(https:\/\/[^"]+)"/g)) links.add(match[1].replaceAll('&amp;', '&'));
}

async function check(url) {
  let current = url;
  const redirects = [];
  try {
    for (let i = 0; i < 8; i++) {
      const response = await fetch(current, { redirect: 'manual', signal: AbortSignal.timeout(20_000) });
      const location = response.headers.get('location');
      await response.body?.cancel();
      if (response.status >= 300 && response.status < 400 && location) {
        const next = new URL(location, current).href;
        redirects.push({ status: response.status, from: current, to: next });
        current = next;
        continue;
      }
      return {
        url, finalUrl: current, status: response.status, redirects,
        // IEEE Xplore explicitly uses 418 for its "Unusual Traffic Detected"
        // restriction. A restricted visit is not a verified page load.
        result: response.ok ? 'reachable' : ([401, 403, 429, 999].includes(response.status) || (response.status === 418 && new URL(current).hostname === 'ieeexplore.ieee.org')) ? 'access-restricted' : 'failed',
      };
    }
    return { url, finalUrl: current, redirects, result: 'failed', error: 'Too many redirects' };
  } catch (error) {
    return { url, finalUrl: current, redirects, result: 'network-unverified', error: String(error) };
  }
}

const queue = [...links];
const results = [];
async function worker() {
  while (queue.length) {
    const url = queue.shift();
    const result = await check(url);
    results.push(result);
    console.log(result.result, result.status ?? '', url);
  }
}
await Promise.all(Array.from({ length: 4 }, worker));
await mkdir(output, { recursive: true });
await writeFile(path.join(output, 'external-links.json'), JSON.stringify({ checkedAt: new Date().toISOString(), results }, null, 2));
console.log(JSON.stringify({ total: results.length, counts: results.reduce((counts, item) => ({ ...counts, [item.result]: (counts[item.result] || 0) + 1 }), {}) }));
if (results.some((item) => item.result === 'failed')) process.exitCode = 1;
