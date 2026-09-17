import { createContext, useCallback, useContext, useMemo, useState } from 'react';
import {
  mockActivity,
  mockClients,
  mockDocuments,
  mockIncomingDocuments,
  mockMarketing,
  mockNotifications,
  mockPortalUsers,
  mockRequests,
  mockRoles,
  mockSettings,
} from '../data';
import { TODAY_DISPLAY, toIsoKey } from './adminFormat';

/**
 * ============================================================
 * Admin portal state.
 *
 * Seeded entirely from src/admin/data. Every mutation below is
 * LOCAL AND IN-MEMORY — nothing is persisted, transmitted or
 * integrated. It exists so the prototype behaves like a real
 * console during review (invite a user, file a document, mark a
 * request complete) without any backend.
 *
 * When the Catalyst functions land this provider becomes the
 * place where fetching and mutations live; no page below it has
 * to change shape.
 * ============================================================
 */
const AdminStateContext = createContext(null);

const TODAY_SHORT = 'Sep 17, 2026';
let seq = 0;
const nextId = (prefix) => `${prefix}-${Date.now().toString(36)}-${(seq += 1)}`;

export function AdminStateProvider({ children }) {
  const [clients, setClients] = useState(mockClients);
  const [portalUsers, setPortalUsers] = useState(mockPortalUsers);
  const [documents, setDocuments] = useState(mockDocuments);
  const [incoming, setIncoming] = useState(mockIncomingDocuments);
  const [requests, setRequests] = useState(mockRequests);
  const [marketing, setMarketing] = useState(mockMarketing);
  const [activity, setActivity] = useState(mockActivity);
  const [notifications, setNotifications] = useState(mockNotifications);
  const [roles, setRoles] = useState(mockRoles);
  const [settings, setSettings] = useState(mockSettings);

  /* ---------------------------------------------- audit trail */
  const logEvent = useCallback((event) => {
    setActivity((prev) => [
      {
        id: nextId('ev'),
        actorType: 'SMB',
        actor: 'Daniel Whitmore',
        dateKey: toIsoKey(TODAY_SHORT),
        date: TODAY_SHORT,
        time: 'Just now',
        ip: '—',
        detail: '',
        ...event,
      },
      ...prev,
    ]);
  }, []);

  /* ---------------------------------------------- clients */
  const addClient = useCallback(
    (draft) => {
      const id = `CLI-${4860 + Math.floor(Math.random() * 90)}`;
      const record = {
        id,
        owner: draft.owner,
        ownerTitle: draft.ownerTitle || 'Owner',
        ownerEmail: draft.ownerEmail,
        ownerPhone: draft.ownerPhone || '—',
        initials: draft.owner
          .split(/\s+/)
          .filter((w) => /^[A-Za-z]/.test(w))
          .slice(-2)
          .map((w) => w[0])
          .join('')
          .toUpperCase(),
        practice: {
          name: draft.practiceName,
          specialty: draft.specialty,
          location: draft.location,
          locations: Number(draft.locations) || 1,
          providers: Number(draft.providers) || 1,
          established: Number(draft.established) || new Date().getFullYear(),
          annualRevenue: draft.annualRevenue || '—',
          ebitda: draft.ebitda || '—',
        },
        engagementRef: draft.engagementRef || `SMB-2026-0${210 + clients.length}`,
        engagementType: 'Sell-side representation',
        engagedOn: TODAY_SHORT,
        crmStage: draft.crmStage || 'Onboarding',
        crmStatus: 'New',
        nextMilestone: draft.nextMilestone || 'Engagement letter countersignature',
        targetDate: draft.targetDate || '—',
        portalStatus: 'Not invited',
        portalActivatedOn: null,
        marketingStatus: 'Not listed',
        listingId: null,
        lastActivity: `${TODAY_SHORT} · Just now`,
        leadAdvisorId: draft.leadAdvisorId || 'stf-1',
        supportAdvisorId: draft.supportAdvisorId || 'stf-4',
        buyerActivity: { ndas: 0, cimViews: 0, activeDiligence: 0, indications: 0 },
        marketingSummary: { impressions: 0, views: 0, leads: 0, favorites: 0 },
        visibility: structuredClone(mockClients[0].visibility),
        notes: draft.notes || '',
      };
      setClients((prev) => [record, ...prev]);
      logEvent({
        type: 'stage',
        clientId: id,
        summary: `Client created — ${record.practice.name}`,
        detail: `Engagement ${record.engagementRef} opened at stage ${record.crmStage}.`,
      });
      return record;
    },
    [clients.length, logEvent],
  );

  const updateClient = useCallback((id, patch) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }, []);

  const updateVisibility = useCallback((id, mutate) => {
    setClients((prev) =>
      prev.map((c) => (c.id === id ? { ...c, visibility: mutate(structuredClone(c.visibility)) } : c)),
    );
  }, []);

  /* ---------------------------------------------- portal users */
  const inviteUser = useCallback(
    (draft) => {
      const record = {
        id: nextId('usr'),
        name: draft.name,
        email: draft.email,
        clientId: draft.clientId,
        role: draft.role,
        accountStatus: 'Pending activation',
        invitationStatus: 'Sent',
        invitedOn: TODAY_SHORT,
        activatedOn: null,
        lastLogin: null,
        mfa: 'Not enrolled',
        accessExpiresOn: draft.accessExpiresOn || null,
        logins90d: 0,
      };
      setPortalUsers((prev) => [record, ...prev]);
      setClients((prev) =>
        prev.map((c) =>
          c.id === draft.clientId && c.portalStatus === 'Not invited' ? { ...c, portalStatus: 'Invited' } : c,
        ),
      );
      logEvent({
        type: 'invitation',
        clientId: draft.clientId,
        summary: `Portal invitation sent to ${draft.email}`,
        detail: `${draft.role} role. No password is created by SMB — the user sets their own during activation.`,
      });
      return record;
    },
    [logEvent],
  );

  const updateUser = useCallback((id, patch, event) => {
    setPortalUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...patch } : u)));
    if (event) {
      setActivity((prev) => [
        {
          id: nextId('ev'),
          actorType: 'SMB',
          actor: 'Daniel Whitmore',
          dateKey: toIsoKey(TODAY_SHORT),
          date: TODAY_SHORT,
          time: 'Just now',
          ip: '—',
          detail: '',
          ...event,
        },
        ...prev,
      ]);
    }
  }, []);

  /* ---------------------------------------------- documents */
  const addDocument = useCallback(
    (draft) => {
      const record = {
        id: nextId('ad-doc'),
        clientId: draft.clientId,
        name: draft.name,
        category: draft.category,
        type: draft.type ?? 'pdf',
        size: draft.size ?? '—',
        uploadedBy: draft.uploadedBy ?? 'Daniel Whitmore',
        uploadedByType: draft.uploadedByType ?? 'SMB',
        uploadedOn: TODAY_SHORT,
        visibility: draft.visibility ?? 'Internal only',
        restrictedRoles: draft.restrictedRoles ?? [],
        status: draft.status ?? 'In review',
        version: 1,
        watermark: draft.watermark ?? true,
        archived: false,
      };
      setDocuments((prev) => [record, ...prev]);
      logEvent({
        type: 'upload',
        clientId: draft.clientId,
        summary: `Uploaded ${record.name}`,
        detail: `Filed under ${record.category} · ${record.visibility}.`,
      });
      return record;
    },
    [logEvent],
  );

  const updateDocument = useCallback((id, patch) => {
    setDocuments((prev) => prev.map((d) => (d.id === id ? { ...d, ...patch } : d)));
  }, []);

  const replaceDocument = useCallback((id) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === id ? { ...d, version: d.version + 1, uploadedOn: TODAY_SHORT, status: 'In review' } : d)),
    );
  }, []);

  /** Move an inbox item into the filed library. */
  const fileIncoming = useCallback(
    (incomingId, { category, visibility, status }) => {
      const item = incoming.find((i) => i.id === incomingId);
      if (!item) return;
      setIncoming((prev) => prev.filter((i) => i.id !== incomingId));
      setDocuments((prev) => [
        {
          id: nextId('ad-doc'),
          clientId: item.clientId,
          name: item.name,
          category,
          type: item.type,
          size: item.size,
          uploadedBy: item.uploadedBy,
          uploadedByType: 'Client',
          uploadedOn: item.receivedOn.split('·')[0].trim(),
          visibility,
          restrictedRoles: [],
          status,
          version: 1,
          watermark: false,
          archived: false,
        },
        ...prev,
      ]);
      logEvent({
        type: 'upload',
        clientId: item.clientId,
        summary: `Filed ${item.name}`,
        detail: `Categorised as ${category} · ${visibility}.`,
      });
    },
    [incoming, logEvent],
  );

  /* ---------------------------------------------- requests */
  const createRequest = useCallback(
    (draft) => {
      const record = {
        id: nextId('ad-req'),
        clientId: draft.clientId,
        title: draft.title,
        description: draft.description,
        category: draft.category,
        priority: draft.priority,
        status: 'Pending',
        createdOn: TODAY_SHORT,
        dueDate: draft.dueDate,
        receivedOn: null,
        completedOn: null,
        createdById: 'stf-1',
        assignedTo: draft.assignedTo,
        relatedDocumentId: null,
        remindersSent: 0,
        lastReminder: null,
      };
      setRequests((prev) => [record, ...prev]);
      logEvent({
        type: 'request-created',
        clientId: draft.clientId,
        summary: `Created request “${draft.title}”`,
        detail: `${draft.priority} priority, due ${draft.dueDate}.`,
      });
      return record;
    },
    [logEvent],
  );

  const updateRequest = useCallback(
    (id, patch, event) => {
      setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
      if (event) logEvent(event);
    },
    [logEvent],
  );

  const sendReminder = useCallback(
    (id) => {
      setRequests((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, remindersSent: r.remindersSent + 1, lastReminder: TODAY_SHORT } : r,
        ),
      );
    },
    [],
  );

  /* ---------------------------------------------- marketing */
  const updateListing = useCallback(
    (id, patch, event) => {
      setMarketing((prev) => prev.map((l) => (l.id === id ? { ...l, ...patch } : l)));
      if (event) logEvent(event);
    },
    [logEvent],
  );

  const refreshListing = useCallback((id) => {
    setMarketing((prev) =>
      prev.map((l) => (l.id === id ? { ...l, lastSync: `${TODAY_SHORT} · Just now` } : l)),
    );
  }, []);

  /* ---------------------------------------------- notifications */
  const updateNotification = useCallback((id, patch) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, ...patch } : n)));
  }, []);

  /* ---------------------------------------------- roles */
  const togglePermission = useCallback((roleId, permissionId) => {
    setRoles((prev) =>
      prev.map((r) =>
        r.id === roleId
          ? { ...r, permissions: { ...r.permissions, [permissionId]: !r.permissions[permissionId] } }
          : r,
      ),
    );
  }, []);

  const updateRole = useCallback((roleId, patch) => {
    setRoles((prev) => prev.map((r) => (r.id === roleId ? { ...r, ...patch } : r)));
  }, []);

  /* ---------------------------------------------- settings */
  const updateSettings = useCallback((section, patch) => {
    setSettings((prev) => ({
      ...prev,
      [section]: typeof patch === 'function' ? patch(prev[section]) : { ...prev[section], ...patch },
    }));
  }, []);

  const value = useMemo(
    () => ({
      today: TODAY_DISPLAY,

      clients,
      portalUsers,
      documents,
      incoming,
      requests,
      marketing,
      activity,
      notifications,
      roles,
      settings,

      addClient,
      updateClient,
      updateVisibility,
      inviteUser,
      updateUser,
      addDocument,
      updateDocument,
      replaceDocument,
      fileIncoming,
      createRequest,
      updateRequest,
      sendReminder,
      updateListing,
      refreshListing,
      updateNotification,
      togglePermission,
      updateRole,
      updateSettings,
      logEvent,

      /* ---- selectors -------------------------------------- */
      clientById: (id) => clients.find((c) => c.id === id) ?? null,
      clientName: (id) => clients.find((c) => c.id === id)?.practice.name ?? 'Unassigned',
      usersForClient: (id) => portalUsers.filter((u) => u.clientId === id),
      documentsForClient: (id) => documents.filter((d) => d.clientId === id),
      requestsForClient: (id) => requests.filter((r) => r.clientId === id),
      listingForClient: (id) => marketing.find((l) => l.clientId === id) ?? null,
      activityForClient: (id) => activity.filter((e) => e.clientId === id),
      openRequestCount: (id) =>
        requests.filter((r) => r.clientId === id && (r.status === 'Pending' || r.status === 'Overdue')).length,
      overdueCount: requests.filter((r) => r.status === 'Overdue').length,
      pendingInviteCount: portalUsers.filter(
        (u) => u.invitationStatus === 'Sent' || u.invitationStatus === 'Resent' || u.invitationStatus === 'Expired',
      ).length,
      inboxCount: incoming.length,
    }),
    [
      clients,
      portalUsers,
      documents,
      incoming,
      requests,
      marketing,
      activity,
      notifications,
      roles,
      settings,
      addClient,
      updateClient,
      updateVisibility,
      inviteUser,
      updateUser,
      addDocument,
      updateDocument,
      replaceDocument,
      fileIncoming,
      createRequest,
      updateRequest,
      sendReminder,
      updateListing,
      refreshListing,
      updateNotification,
      togglePermission,
      updateRole,
      updateSettings,
      logEvent,
    ],
  );

  return <AdminStateContext.Provider value={value}>{children}</AdminStateContext.Provider>;
}

export function useAdminState() {
  const ctx = useContext(AdminStateContext);
  if (!ctx) throw new Error('useAdminState must be used inside <AdminStateProvider>');
  return ctx;
}
