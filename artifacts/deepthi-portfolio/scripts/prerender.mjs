import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, routes, aliases, metadataFor, personSchema, siteOrigin, absoluteUrl, basePath } from '../dist/server/entry-server.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const out = path.join(root, 'dist/public');
const template = await readFile(path.join(out, 'index.html'), 'utf8');
const escape = (text) => String(text).replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const manifest = { routes, aliases };

for (const route of [...routes, '/404']) {
  const meta = metadataFor(route);
  let html = template
    .replace('<div id="root"></div>', () => `<div id="root">${render(route)}</div>`)
    .replace(/<title>[^<]*<\/title>/, () => `<title>${escape(meta.title)}</title>`)
    .replace(/(<meta (?:name|property)="(?:description|og:description|twitter:description)" content=")[^"]*(")/g, (_, before, after) => `${before}${escape(meta.description)}${after}`)
    .replace(/(<meta (?:name|property)="(?:og:title|twitter:title)" content=")[^"]*(")/g, (_, before, after) => `${before}${escape(meta.title)}${after}`)
    .replace(/(<meta name="robots" content=")[^"]*(")/, (_, before, after) => `${before}${meta.robots}${after}`)
    .replace('<!-- build:structured-data -->', () => `<script type="application/ld+json">${JSON.stringify(personSchema).replace(/</g, '\\u003c')}</script>`);
  const extraHead = [];
  if (meta.canonical) {
    extraHead.push(`<link rel="canonical" href="${escape(meta.canonical)}">`, `<meta property="og:url" content="${escape(meta.canonical)}">`);
  }
  if (meta.image) {
    // Social crawlers require absolute image URLs.
    html = html.replace(/(<meta property="og:image" content=")[^"]*(")/, (_, before, after) => `${before}${escape(meta.image)}${after}`);
    extraHead.push(`<meta name="twitter:image" content="${escape(meta.image)}">`);
  }
  if (extraHead.length) html = html.replace('</head>', () => `${extraHead.join('')}</head>`);
  const destination = route === '/404' ? path.join(out, '404.html') : path.join(out, route.slice(1), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

for (const [route, target] of Object.entries(aliases)) {
  const targetHref = `${basePath.replace(/\/$/, '')}${target}`;
  const canonical = absoluteUrl(target.split('#')[0] || '/');
  const destination = path.join(out, route.slice(1), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Continue to Deepthi’s portfolio</title><meta name="robots" content="noindex, follow">${canonical ? `<link rel="canonical" href="${escape(canonical)}">` : ''}<meta http-equiv="refresh" content="0;url=${escape(targetHref)}"></head><body><a href="${escape(targetHref)}">Continue to Deepthi’s portfolio</a></body></html>`);
}

await writeFile(path.join(out, 'route-manifest.json'), JSON.stringify(manifest));
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${siteOrigin ? `Sitemap: ${absoluteUrl('/sitemap.xml')}\n` : '# Sitemap and canonical URLs are added after the published domain is set in src/lib/site.ts.\n'}`);
const sitemap = path.join(out, 'sitemap.xml');
if (siteOrigin) {
  const urls = routes.map((route) => `<url><loc>${escape(metadataFor(route).canonical)}</loc></url>`).join('');
  await writeFile(sitemap, `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>\n`);
} else {
  await rm(sitemap, { force: true });
}
console.log(`Prerendered ${routes.length} public pages, three legacy aliases and a 404 page.`);
console.log(siteOrigin
  ? `Canonical URLs, absolute social metadata and sitemap generated for ${siteOrigin}.`
  : 'Published address not set: canonical URLs and sitemap skipped; no preview URL has been substituted.');
