import { BASE, profile, projects } from './content';

// Set only after publishing, using the production URL returned by Replit's
// deployment metadata. Do not use the preview domain or guess a live URL.
export const siteOrigin = '';
export const homeTitle = 'Deepthi Ramesh — Data analyst, pipelines and applied AI';
export const homeDescription = 'Data analysis, reliable pipelines and applied AI, built around clear business questions. Explore Deepthi Ramesh’s projects, experience and co-authored research.';

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
    canonical: siteOrigin && found ? `${siteOrigin}${BASE.replace(/\/$/, '')}${normalized}` : '',
  };
}

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: profile.name,
  sameAs: [profile.github, profile.linkedin],
  knowsAbout: ['Data analysis', 'Data engineering', 'Machine learning', 'Applied artificial intelligence'],
  ...(siteOrigin ? { url: `${siteOrigin}${BASE}` } : {}),
};
