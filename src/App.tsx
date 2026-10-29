import React, { useEffect } from 'react';
import { BrowserRouter, useLocation } from 'react-router-dom';
import { PublicNavbar } from './components/navigation/PublicNavbar';
import { PublicFooter } from './components/layout/PublicFooter';
import { AppRoutes } from './routes/AppRoutes';

/**
 * Automatically scrolls to top on navigation route transition
 */
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

const MainLayout: React.FC = () => {
  const location = useLocation();
  const isDashboard = location.pathname.startsWith('/dashboard');

  return (
    <div className="min-h-screen flex flex-col bg-carbon-bg text-carbon-text font-sans">
      {/* Public Header: Shown on public routes */}
      {!isDashboard && <PublicNavbar />}

      {/* Main Dynamic Workspace / Route Content */}
      <main className="flex-1 flex flex-col w-full">
        <AppRoutes />
      </main>

      {/* Public Footer: Shown on public routes */}
      {!isDashboard && <PublicFooter />}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <MainLayout />
    </BrowserRouter>
  );
};

export default App;
