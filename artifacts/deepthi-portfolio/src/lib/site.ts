import { BASE, profile, projects } from './content';

// ─── Published portfolio address (editable) ────────────────────────────────
// Paste the live address here once Replit shows it after publishing, e.g.
// 'https://your-portfolio.replit.app' or a custom domain, then rebuild.
// Leave it blank until then: canonical URLs, absolute social-preview links
// and the sitemap are only generated when this is set. Never use a preview
// (.replit.dev) address or a guessed domain.
//
// A build-time VITE_SITE_URL value overrides this setting, which allows a
// check build without committing an address.
export const publishedSiteUrl = '';

export function normalizeSiteOrigin(raw: string): string {
  const value = raw.trim();
  if (!value) return '';
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    throw new Error(`Published site URL "${value}" is not a valid web address.`);
  }
  if (url.protocol !== 'https:') throw new Error(`Published site URL "${value}" must start with https://.`);
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/') {
    throw new Error(`Published site URL "${value}" must be only the site address, without a path, query or fragment.`);
  }
  if (/(^|\.)(replit\.dev|repl\.co|localhost)$/i.test(url.hostname) || /^[\d.]+$/.test(url.hostname)) {
    throw new Error(`Published site URL "${value}" looks like a preview or local address; use the published domain.`);
  }
  return url.origin;
}

export const siteOrigin = normalizeSiteOrigin(import.meta.env.VITE_SITE_URL || publishedSiteUrl);

/** Absolute URL for a site path, or '' until the published address is set. */
export function absoluteUrl(path: string): string {
  if (!siteOrigin) return '';
  return `${siteOrigin}${BASE.replace(/\/$/, '')}${path.startsWith('/') ? path : `/${path}`}`;
}

export const siteName = 'Deepthi Ramesh — Data & AI';
export const homeTitle = 'Deepthi Ramesh — Data analyst, pipelines and applied AI';
export const homeDescription = 'Data analysis, reliable pipelines and applied AI, built around clear business questions. Explore Deepthi Ramesh’s projects, experience and co-authored research.';
export const shareImage = {
  path: '/img/deepthi.jpg',
  width: 480,
  height: 595,
  alt: 'Portrait of Deepthi Ramesh',
};

export const aliases: Record<string, string> = {
  '/about': '/#experience',
  '/portfolio': '/#work',
  '/contact': '/#contact',
};

export const routes = ['/', ...projects.map((project) => `/work/${project.slug}`)];

export function metadataFor(path: string) {
  const normalized = path.replace(/\/+$/, '') || '/';
  const project = projects.find((item) => normalized === `/work/${item.slug}`);
  const found = normalized === '/' || Boolean(project);
  return {
    title: project ? `${project.title} — Deepthi Ramesh` : found ? homeTitle : 'Page not found — Deepthi Ramesh',
    description: project?.summary ?? (found ? homeDescription : 'This page could not be found. Explore Deepthi Ramesh’s data, engineering and applied-AI projects instead.'),
    robots: found ? 'index, follow' : 'noindex, follow',
    path: normalized,
    canonical: found ? absoluteUrl(normalized) : '',
    image: absoluteUrl(shareImage.path),
  };
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ['Data analysis', 'Data engineering', 'Machine learning', 'Applied artificial intelligence'],
  ...(siteOrigin ? { url: absoluteUrl('/'), image: absoluteUrl(shareImage.path) } : {}),
};
