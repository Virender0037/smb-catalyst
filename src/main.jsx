import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import App from './App';
import { SessionProvider } from './lib/session';
import { PortalStateProvider } from './lib/portalState';
import { ToastProvider } from './components/ui/Toast';

import './styles/tokens.css';
import './styles/base.css';
import './styles/brand.css';
import './styles/ui.css';
import './styles/charts.css';
import './styles/layout.css';
import './styles/auth.css';
import './styles/pages.css';
/* Admin console styles come last so its density overrides land on top of the
   shared primitives. Every selector is `.ad-*`, so the client portal is
   unaffected by its presence. */
import './styles/admin.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Hash routing keeps deep links working on static Catalyst client hosting
        without any server-side rewrite rules. */}
    <HashRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <SessionProvider>
        <PortalStateProvider>
          <ToastProvider>
            <App />
          </ToastProvider>
        </PortalStateProvider>
      </SessionProvider>
    </HashRouter>
  </React.StrictMode>,
);
