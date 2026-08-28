import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Route, Switch, useLocation, Router as WouterRouter } from 'wouter';

import { ErrorBoundary } from '@/components/error-boundary';
import { SiteChromeProvider } from '@/components/site-chrome';
import { SiteFooter } from '@/components/site-footer';
import { SiteHeader } from '@/components/site-header';
import { TooltipProvider } from '@/components/ui/tooltip';
import Contact from '@/pages/contact';
import Home from '@/pages/home';
import NotFound from '@/pages/not-found';
import Privacy from '@/pages/privacy';
import Retreats from '@/pages/retreats';
import Terms from '@/pages/terms';

const queryClient = new QueryClient();

/** Routing the error boundary on location so a bad page recovers on navigate. */
function Routes() {
  const [location] = useLocation();

  return (
    <ErrorBoundary resetKey={location}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/retreats" component={Retreats} />
        <Route path="/contact" component={Contact} />
        <Route path="/privacy" component={Privacy} />
        <Route path="/terms" component={Terms} />
        <Route component={NotFound} />
      </Switch>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <SiteChromeProvider>
            <div className="min-h-screen bg-bg text-fg flex flex-col relative font-sans">
              {/* First thing in the tab order on every page. Off-screen until
                  focused, so a keyboard or screen-reader visitor can jump the
                  eight nav items instead of walking them on each navigation.
                  WCAG 2.4.1. */}
              <a href="#main-content" className="skip-link">Skip to content</a>
              <SiteHeader />
              <Routes />
              <SiteFooter />
            </div>
          </SiteChromeProvider>
        </WouterRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
