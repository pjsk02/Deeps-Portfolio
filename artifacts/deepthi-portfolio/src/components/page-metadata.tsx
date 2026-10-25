import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { metadataFor } from '@/lib/site';

export function PageMetadata() {
  const [location] = useLocation();
  useEffect(() => {
    const meta = metadataFor(location);
    document.title = meta.title;
    for (const [selector, content] of [
      ['meta[name="description"]', meta.description],
      ['meta[name="robots"]', meta.robots],
      ['meta[property="og:title"]', meta.title],
      ['meta[property="og:description"]', meta.description],
      ['meta[name="twitter:title"]', meta.title],
      ['meta[name="twitter:description"]', meta.description],
    ]) {
      document.querySelector(selector)?.setAttribute('content', content);
    }
    const canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (meta.canonical) {
      const link = canonical ?? document.head.appendChild(document.createElement('link'));
      link.rel = 'canonical';
      link.href = meta.canonical;
    } else {
      canonical?.remove();
    }
    document.querySelector('meta[property="og:url"]')?.setAttribute('content', meta.canonical);
  }, [location]);
  return null;
}
