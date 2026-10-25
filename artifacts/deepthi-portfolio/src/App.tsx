import { type ReactNode } from 'react';
import { Route, Switch, Redirect, useLocation, Router as WouterRouter } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import { PrefsProvider } from '@/lib/prefs';
import { Shell } from '@/components/shell';
import Home from '@/pages/home';
import ProjectPage from '@/pages/project';
import NotFound from '@/pages/not-found';
import { aliases } from '@/lib/site';

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function Router() {
  return (
    <Shell>
      <RoutedErrorBoundary>
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/work/:slug" component={ProjectPage} />
          {Object.entries(aliases).map(([path, to]) => <Route key={path} path={path}><Redirect to={to} replace /></Route>)}
          <Route component={NotFound} />
        </Switch>
      </RoutedErrorBoundary>
    </Shell>
  );
}

function App({ ssrPath }: { ssrPath?: string }) {
  return (
    <PrefsProvider>
      <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')} ssrPath={ssrPath}>
        <Router />
      </WouterRouter>
    </PrefsProvider>
  );
}

export default App;
