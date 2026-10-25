import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { metadataFor } from '@/lib/site';

function upsert(selector: string, create: () => HTMLElement, attribute: string, value: string) {
  const existing = document.head.querySelector<HTMLElement>(selector);
  if (!value) {
    existing?.remove();
    return;
  }
  const element = existing ?? document.head.appendChild(create());
  element.setAttribute(attribute, value);
}

const meta = (key: 'name' | 'property', name: string) => () => {
  const element = document.createElement('meta');
  element.setAttribute(key, name);
  return element;
};

export function PageMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const page = metadataFor(location);
    document.title = page.title;
    for (const [selector, content] of [
      ['meta[name="description"]', page.description],
      ['meta[name="robots"]', page.robots],
      ['meta[property="og:title"]', page.title],
      ['meta[property="og:description"]', page.description],
      ['meta[name="twitter:title"]', page.title],
      ['meta[name="twitter:description"]', page.description],
    ]) {
      document.querySelector(selector)?.setAttribute('content', content);
    }
    upsert('link[rel="canonical"]', () => {
      const link = document.createElement('link');
      link.rel = 'canonical';
      return link;
    }, 'href', page.canonical);
    upsert('meta[property="og:url"]', meta('property', 'og:url'), 'content', page.canonical);
  }, [location]);
  return null;
}
