import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
import type { Plugin } from 'vite';

/** Serve the actual prerendered pages in preview, including real 404 statuses.
 * Production is static hosting, with equivalent explicit rewrites and 404.html.
 */
export function previewRouting(directory: string, base: string): Plugin {
  return {
    name: 'portfolio-static-preview',
    configurePreviewServer(server) {
      const manifest = JSON.parse(readFileSync(path.join(directory, 'route-manifest.json'), 'utf8')) as {
        routes: string[];
        aliases: Record<string, string>;
      };
      const routes = new Set(manifest.routes);
      const prefix = base.replace(/\/$/, '');
      server.middlewares.use((req, res, next) => {
        if (req.method !== 'GET' && req.method !== 'HEAD') return next();
        const url = new URL(req.url || '/', 'http://routing.invalid');
        let pathname: string;
        try { pathname = decodeURIComponent(url.pathname); }
        catch { res.statusCode = 400; res.end('Invalid URL encoding'); return; }
        if (prefix && !pathname.startsWith(`${prefix}/`)) return next();
        pathname = pathname.slice(prefix.length) || '/';
        const normalized = pathname.replace(/\/+$/, '') || '/';
        const alias = manifest.aliases[normalized];
        if (alias) {
          const [destination, fragment] = alias.split('#');
          res.statusCode = 308;
          res.setHeader('Location', `${prefix}${destination}${url.search}${fragment ? `#${fragment}` : ''}`);
          res.end();
          return;
        }
        if (pathname !== normalized && routes.has(normalized)) {
          res.statusCode = 308;
          res.setHeader('Location', `${prefix}${normalized}${url.search}`);
          res.end();
          return;
        }
        const asset = path.resolve(directory, `.${pathname}`);
        if (asset.startsWith(`${directory}${path.sep}`) && existsSync(asset) && statSync(asset).isFile()) return next();
        const known = routes.has(normalized);
        const file = known ? path.join(directory, normalized.slice(1), 'index.html') : path.join(directory, '404.html');
        res.statusCode = known ? 200 : 404;
        res.setHeader('Content-Type', 'text/html; charset=utf-8');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Vary', 'Accept-Encoding');
        const acceptsGzip = (req.headers['accept-encoding'] || '').split(',').some((part) => {
          const [encoding, ...parameters] = part.trim().split(';');
          return encoding === 'gzip' && !parameters.some((parameter) => /^q=0(?:\.0*)?$/.test(parameter.trim()));
        });
        const contents = readFileSync(file);
        const body = acceptsGzip ? gzipSync(contents) : contents;
        if (acceptsGzip) res.setHeader('Content-Encoding', 'gzip');
        res.setHeader('Content-Length', body.length);
        res.end(req.method === 'HEAD' ? undefined : body);
      });
    },
  };
}
