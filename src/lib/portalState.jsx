import { createContext, useContext, useMemo, useState } from 'react';
import { mockRequests } from '../data/requests';
import { mockDocuments } from '../data/documents';

/**
 * Holds the data the prototype mutates locally (uploading a document,
 * answering a request) so the shell and dashboard stay in step with one
 * another.
 *
 * It is seeded from the mock data layer and nothing more. When the Catalyst
 * functions land, this provider becomes the place where fetched data and
 * mutations live — no component below it has to change.
 */
const PortalStateContext = createContext(null);

export function PortalStateProvider({ children }) {
  const [requests, setRequests] = useState(mockRequests);
  const [documents, setDocuments] = useState(mockDocuments);

  const value = useMemo(
    () => ({
      requests,
      setRequests,
      documents,
      setDocuments,
      openRequests: requests.filter((r) => r.status === 'Pending' || r.status === 'Overdue'),
      pendingCount: requests.filter((r) => r.status === 'Pending').length,
      overdueCount: requests.filter((r) => r.status === 'Overdue').length,
    }),
    [requests, documents],
  );

  return <PortalStateContext.Provider value={value}>{children}</PortalStateContext.Provider>;
}

export function usePortalState() {
  const ctx = useContext(PortalStateContext);
  if (!ctx) throw new Error('usePortalState must be used inside <PortalStateProvider>');
  return ctx;
}
