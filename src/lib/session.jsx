import { createContext, useCallback, useContext, useMemo, useState } from 'react';

/**
 * PROTOTYPE SESSION ONLY.
 * Nothing here authenticates anybody — it exists so the demo can move between
 * the login, MFA and portal screens. Replace wholesale with Catalyst auth.
 */
const KEY = 'smb.demo.session';
const SessionContext = createContext(null);

const read = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY)) ?? null;
  } catch {
    return null;
  }
};

export function SessionProvider({ children }) {
  const [session, setSession] = useState(read);

  const persist = useCallback((next) => {
    setSession(next);
    try {
      if (next) sessionStorage.setItem(KEY, JSON.stringify(next));
      else sessionStorage.removeItem(KEY);
    } catch {
      /* storage unavailable — demo still works in memory */
    }
  }, []);

  const value = useMemo(
    () => ({
      session,
      /** Step 1 — credentials accepted, MFA still required. */
      startVerification: (email) => persist({ email, stage: 'mfa' }),
      /** Step 2 — MFA satisfied, portal unlocked. */
      completeVerification: () =>
        persist({ ...(read() ?? {}), stage: 'authenticated' }),
      signOut: () => persist(null),
      isAuthenticated: session?.stage === 'authenticated',
      isVerifying: session?.stage === 'mfa',
    }),
    [session, persist],
  );

  return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const ctx = useContext(SessionContext);
  if (!ctx) throw new Error('useSession must be used inside <SessionProvider>');
  return ctx;
}
