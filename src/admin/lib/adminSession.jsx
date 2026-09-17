import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { mockAdminUser } from '../data';

/**
 * PROTOTYPE STAFF SESSION ONLY.
 *
 * Nothing here authenticates anybody. It exists so the internal
 * console has its own front door, separate from the client portal
 * session, and so "sign out" behaves sensibly during a demo.
 * Replace wholesale with Catalyst authentication + staff SSO.
 */
const KEY = 'smb.demo.adminSession';
const AdminSessionContext = createContext(null);

const read = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? null;
  } catch {
    return null;
  }
};

export function AdminSessionProvider({ children }) {
  const [session, setSession] = useState(read);

  const persist = useCallback((next) => {
    setSession(next);
    try {
      if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
      else sessionStorage.removeItem(KEY);
    } catch {
      /* storage unavailable — the demo still works in memory */
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: mockAdminUser,
      isAuthenticated: session?.stage === 'authenticated',
      signIn: (email) => persist({ email: email || mockAdminUser.email, stage: 'authenticated' }),
      signOut: () => persist(null),
    }),
    [session, persist],
  );

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
}

export function useAdminSession() {
  const ctx = useContext(AdminSessionContext);
  if (!ctx) throw new Error('useAdminSession must be used inside <AdminSessionProvider>');
  return ctx;
}
