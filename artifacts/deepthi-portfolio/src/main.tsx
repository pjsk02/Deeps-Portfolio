import { createRoot, hydrateRoot } from 'react-dom/client';

import App from './App';
import { ErrorBoundary } from '@/components/error-boundary';

import './index.css';

const root = document.getElementById('root')!;
const options = {
  // Keeps caught errors off reportError(), which would raise the dev overlay.
  onCaughtError: (error: unknown, errorInfo: { componentStack?: string | null }) => {
    console.error(error, errorInfo.componentStack);
  },
};
const app = (
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

if (root.hasChildNodes()) {
  hydrateRoot(root, app, options);
} else {
  createRoot(root, options).render(app);
}
