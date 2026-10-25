import { mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { render, routes, aliases, metadataFor, personSchema, siteOrigin, basePath } from '../dist/server/entry-server.js';

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
  if (meta.canonical) {
    html = html.replace('</head>', `<link rel="canonical" href="${escape(meta.canonical)}"><meta property="og:url" content="${escape(meta.canonical)}"></head>`);
  }
  if (siteOrigin) html = html.replace(/(<meta property="og:image" content=")(\/[^"]*)(")/, (_, a, image, b) => `${a}${siteOrigin}${image}${b}`);
  const destination = route === '/404' ? path.join(out, '404.html') : path.join(out, route.slice(1), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, html);
}

for (const [route, target] of Object.entries(aliases)) {
  const targetHref = `${basePath.replace(/\/$/, '')}${target}`;
  const destination = path.join(out, route.slice(1), 'index.html');
  await mkdir(path.dirname(destination), { recursive: true });
  await writeFile(destination, `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Continue to Deepthi’s portfolio</title><meta name="robots" content="noindex, follow"><meta http-equiv="refresh" content="0;url=${escape(targetHref)}"></head><body><a href="${escape(targetHref)}">Continue to Deepthi’s portfolio</a></body></html>`);
}

await writeFile(path.join(out, 'route-manifest.json'), JSON.stringify(manifest));
await writeFile(path.join(out, 'robots.txt'), `User-agent: *\nAllow: /\n${siteOrigin ? `Sitemap: ${siteOrigin}${basePath}sitemap.xml\n` : '# Sitemap and canonical URLs are added after the published domain is confirmed.\n'}`);
if (siteOrigin) {
  const urls = routes.map((route) => `<url><loc>${escape(metadataFor(route).canonical)}</loc></url>`).join('');
  await writeFile(path.join(out, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`);
}
console.log(`Prerendered ${routes.length} public pages, three legacy aliases and a 404 page.`);
if (!siteOrigin) console.log('Canonical URLs and sitemap await the verified published domain; no preview URL has been substituted.');
