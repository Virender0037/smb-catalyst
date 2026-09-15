import { createContext, useContext, useMemo, useState } from 'react';
import { mockRequests } from '../data/requests';
import { mockConversations } from '../data/messages';
import { mockDocuments } from '../data/documents';

/**
 * Holds the data the prototype mutates locally (uploading a document, answering
 * a request, reading a conversation) so the shell, dashboard and pages stay in
 * step with one another.
 *
 * It is seeded from the mock data layer and nothing more. When the Catalyst
 * functions land, this provider becomes the place where fetched data and
 * mutations live — no component below it has to change.
 */
const PortalStateContext = createContext(null);

export function PortalStateProvider({ children }) {
  const [requests, setRequests] = useState(mockRequests);
  const [conversations, setConversations] = useState(mockConversations);
  const [documents, setDocuments] = useState(mockDocuments);

  const value = useMemo(
    () => ({
      requests,
      setRequests,
      conversations,
      setConversations,
      documents,
      setDocuments,
      openRequests: requests.filter((r) => r.status === 'Pending' || r.status === 'Overdue'),
      pendingCount: requests.filter((r) => r.status === 'Pending').length,
      overdueCount: requests.filter((r) => r.status === 'Overdue').length,
      unreadMessages: conversations.reduce((n, c) => n + c.unread, 0),
    }),
    [requests, conversations, documents],
  );

  return <PortalStateContext.Provider value={value}>{children}</PortalStateContext.Provider>;
}

export function usePortalState() {
  const ctx = useContext(PortalStateContext);
  if (!ctx) throw new Error('usePortalState must be used inside <PortalStateProvider>');
  return ctx;
}
