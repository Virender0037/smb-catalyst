import { useEffect } from 'react';
import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import AdminShell from './layout/AdminShell';
import { AdminSessionProvider, useAdminSession } from './lib/adminSession';
import { AdminStateProvider } from './lib/adminState';
import { metaForPath } from './layout/adminNav';

import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminClients from './pages/AdminClients';
import AdminClient360 from './pages/AdminClient360';
import AdminClientPreview from './pages/AdminClientPreview';
import AdminPortalUsers from './pages/AdminPortalUsers';
import AdminDocuments from './pages/AdminDocuments';
import AdminRequests from './pages/AdminRequests';
import AdminMarketing from './pages/AdminMarketing';
import AdminActivity from './pages/AdminActivity';
import AdminNotifications from './pages/AdminNotifications';
import AdminRoles from './pages/AdminRoles';
import AdminSettings from './pages/AdminSettings';
import AdminNotFound from './pages/AdminNotFound';

/** Gate for the internal console. Front-end only — see lib/adminSession.jsx. */
function RequireStaff({ children }) {
  const { isAuthenticated } = useAdminSession();
  const location = useLocation();
  if (!isAuthenticated) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />;
  return children;
}

function useAdminDocumentTitle() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname === '/admin/login') return;
    document.title = `${metaForPath(pathname).title} · SMB Admin`;
  }, [pathname]);
}

function useScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, [pathname]);
}

function AdminRoutes() {
  useAdminDocumentTitle();
  useScrollReset();

  return (
    <Routes>
      <Route index element={<Navigate to="/admin/dashboard" replace />} />
      <Route path="login" element={<AdminLogin />} />

      <Route
        element={
          <RequireStaff>
            <AdminShell />
          </RequireStaff>
        }
      >
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="clients" element={<AdminClients />} />
        <Route path="clients/:clientId" element={<AdminClient360 />} />
        <Route path="clients/:clientId/preview" element={<AdminClientPreview />} />
        <Route path="users" element={<AdminPortalUsers />} />
        <Route path="documents" element={<AdminDocuments />} />
        <Route path="documents/incoming" element={<AdminDocuments />} />
        <Route path="requests" element={<AdminRequests />} />
        <Route path="marketing" element={<AdminMarketing />} />
        <Route path="activity" element={<AdminActivity />} />
        <Route path="notifications" element={<AdminNotifications />} />
        <Route path="roles" element={<AdminRoles />} />
        <Route path="settings" element={<AdminSettings />} />
        <Route path="*" element={<AdminNotFound />} />
      </Route>
    </Routes>
  );
}

/**
 * The admin portal is mounted as a single self-contained subtree at /admin.
 * It carries its own session, its own state provider and its own stylesheet,
 * so nothing in the client portal is touched by it.
 */
export default function AdminApp() {
  return (
    <AdminSessionProvider>
      <AdminStateProvider>
        <AdminRoutes />
      </AdminStateProvider>
    </AdminSessionProvider>
  );
}
