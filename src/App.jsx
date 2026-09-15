import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AppShell from './components/layout/AppShell';
import { useSession } from './lib/session';
import { pageMeta } from './components/layout/nav';

import Login from './pages/Login';
import VerifyMobile from './pages/VerifyMobile';
import VerifyCode from './pages/VerifyCode';
import Overview from './pages/Overview';
import Marketing from './pages/Marketing';
import Documents from './pages/Documents';
import Requests from './pages/Requests';
import Activity from './pages/Activity';
import NotFound from './pages/NotFound';

/** Gate for the authenticated portal. Front-end only — see lib/session.jsx. */
function RequireSession({ children }) {
  const { isAuthenticated } = useSession();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  return children;
}

/** Keeps the document title in step with the route. */
function useDocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    const page = pageMeta[pathname]?.title;
    document.title = page
      ? `${page} · SMB Client Portal`
      : 'Strategic Medical Brokers — Client Portal';
  }, [pathname]);
}

/** Scrolls to the top on navigation, as a multi-page portal should. */
function useScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
}

export default function App() {
  useDocumentTitle();
  useScrollReset();
  const { isAuthenticated } = useSession();

  return (
    <Routes>
      <Route path="/" element={<Navigate to={isAuthenticated ? '/overview' : '/login'} replace />} />

      <Route path="/login" element={<Login />} />
      <Route path="/verify" element={<VerifyMobile />} />
      <Route path="/verify/code" element={<VerifyCode />} />

      <Route
        element={
          <RequireSession>
            <AppShell />
          </RequireSession>
        }
      >
        <Route path="/overview" element={<Overview />} />
        <Route path="/marketing" element={<Marketing />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/activity" element={<Activity />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
