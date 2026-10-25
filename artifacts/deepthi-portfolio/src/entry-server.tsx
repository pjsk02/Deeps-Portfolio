import { renderToString } from 'react-dom/server';
import App from './App';
import { ErrorBoundary } from './components/error-boundary';
import { BASE } from './lib/content';
export { BASE as basePath } from './lib/content';
export { aliases, routes, metadataFor, personSchema, siteOrigin, absoluteUrl } from './lib/site';

export function render(path: string) {
  return renderToString(
    <ErrorBoundary><App ssrPath={`${BASE.replace(/\/$/, '')}${path}`} /></ErrorBoundary>,
  );
}
