/**
 * ============================================================
 * Admin dashboard composition.
 *
 * The KPI figures are DERIVED from the other mock collections so
 * the dashboard can never disagree with the list screens. Only the
 * things that cannot be derived — the attention queue copy and the
 * quick-action set — are declared here.
 * ============================================================
 */
import { mockClients, engagementsByStage } from './clients';
import { mockPortalUsers } from './portalUsers';
import { mockRequests } from './requests';
import { mockDocuments, mockIncomingDocuments } from './documents';
import { mockMarketing, marketingTotals } from './marketing';
import { mockActivity } from './activity';

/** Operational KPI strip. Each tile links somewhere useful. */
export function dashboardKpis(state) {
  const clients = state?.clients ?? mockClients;
  const users = state?.portalUsers ?? mockPortalUsers;
  const requests = state?.requests ?? mockRequests;
  const incoming = state?.incoming ?? mockIncomingDocuments;

  const pendingInvites = users.filter(
    (u) => u.invitationStatus === 'Sent' || u.invitationStatus === 'Resent' || u.invitationStatus === 'Expired',
  ).length;

  return [
    {
      id: 'clients',
      label: 'Portal clients',
      value: clients.filter((c) => c.portalStatus !== 'Archived').length,
      note: `${clients.length} total including archived`,
      icon: 'building',
      to: '/admin/clients',
      tone: 'info',
    },
    {
      id: 'engagements',
      label: 'Active engagements',
      value: clients.filter((c) => c.crmStage !== 'Closed').length,
      note: 'Across all pipeline stages',
      icon: 'briefcase',
      to: '/admin/clients',
      tone: 'info',
    },
    {
      id: 'invitations',
      label: 'Pending invitations',
      value: pendingInvites,
      note: `${users.filter((u) => u.invitationStatus === 'Expired').length} expired`,
      icon: 'mail',
      to: '/admin/users',
      tone: pendingInvites > 0 ? 'warn' : 'neutral',
    },
    {
      id: 'pending-requests',
      label: 'Pending requests',
      value: requests.filter((r) => r.status === 'Pending').length,
      note: `${requests.filter((r) => r.status === 'Received').length} received, awaiting review`,
      icon: 'request',
      to: '/admin/requests',
      tone: 'warn',
    },
    {
      id: 'overdue-requests',
      label: 'Overdue requests',
      value: requests.filter((r) => r.status === 'Overdue').length,
      note: 'Past the agreed due date',
      icon: 'alert',
      to: '/admin/requests',
      tone: 'danger',
    },
    {
      id: 'incoming',
      label: 'Documents received',
      value: incoming.length,
      note: 'Waiting in the incoming inbox',
      icon: 'inbox',
      to: '/admin/documents/incoming',
      tone: incoming.length > 0 ? 'warn' : 'neutral',
    },
  ];
}

/**
 * "What requires SMB's attention today?" — the queue the dashboard is built
 * around. Derived where possible so it stays honest as the prototype is used.
 */
export function attentionItems(state) {
  const clients = state?.clients ?? mockClients;
  const users = state?.portalUsers ?? mockPortalUsers;
  const requests = state?.requests ?? mockRequests;
  const incoming = state?.incoming ?? mockIncomingDocuments;
  const listings = state?.marketing ?? mockMarketing;

  const items = [];

  const overdue = requests.filter((r) => r.status === 'Overdue');
  if (overdue.length) {
    items.push({
      id: 'att-overdue',
      severity: 'high',
      icon: 'alert',
      title: `${overdue.length} request${overdue.length === 1 ? '' : 's'} overdue`,
      detail: overdue
        .slice(0, 3)
        .map((r) => r.title)
        .join(' · '),
      action: 'Review requests',
      to: '/admin/requests?status=Overdue',
    });
  }

  const received = requests.filter((r) => r.status === 'Received');
  if (received.length) {
    items.push({
      id: 'att-received',
      severity: 'medium',
      icon: 'checkCircle',
      title: `${received.length} response${received.length === 1 ? '' : 's'} awaiting review`,
      detail: 'Client has responded — mark complete or reopen.',
      action: 'Review responses',
      to: '/admin/requests?status=Received',
    });
  }

  if (incoming.length) {
    items.push({
      id: 'att-inbox',
      severity: 'medium',
      icon: 'inbox',
      title: `${incoming.length} document${incoming.length === 1 ? '' : 's'} need categorising`,
      detail: 'Client uploads sitting in the incoming inbox.',
      action: 'Open inbox',
      to: '/admin/documents/incoming',
    });
  }

  const expired = users.filter((u) => u.invitationStatus === 'Expired');
  if (expired.length) {
    items.push({
      id: 'att-expired',
      severity: 'high',
      icon: 'mail',
      title: `${expired.length} portal invitation${expired.length === 1 ? '' : 's'} expired`,
      detail: expired.map((u) => u.email).join(' · '),
      action: 'Resend invitation',
      to: '/admin/users?invitation=Expired',
    });
  }

  const mfaGaps = users.filter(
    (u) => u.accountStatus === 'Active' && (u.mfa === 'Not enrolled' || u.mfa === 'Reset required'),
  );
  if (mfaGaps.length) {
    items.push({
      id: 'att-mfa',
      severity: 'medium',
      icon: 'shield',
      title: `${mfaGaps.length} active user${mfaGaps.length === 1 ? '' : 's'} without working MFA`,
      detail: mfaGaps.map((u) => u.name).join(' · '),
      action: 'Review users',
      to: '/admin/users',
    });
  }

  const unmapped = listings.filter((l) => !l.clientId || !l.mappingConfirmed);
  if (unmapped.length) {
    items.push({
      id: 'att-listing',
      severity: 'low',
      icon: 'chart',
      title: `${unmapped.length} listing${unmapped.length === 1 ? '' : 's'} not mapped to a client`,
      detail: unmapped.map((l) => l.listingId).join(' · '),
      action: 'Assign listing',
      to: '/admin/marketing',
    });
  }

  const notInvited = clients.filter((c) => c.portalStatus === 'Not invited');
  if (notInvited.length) {
    items.push({
      id: 'att-not-invited',
      severity: 'low',
      icon: 'userCheck',
      title: `${notInvited.length} client${notInvited.length === 1 ? '' : 's'} without portal access`,
      detail: notInvited.map((c) => c.practice.name).join(' · '),
      action: 'Open client',
      to: '/admin/clients',
    });
  }

  const order = { high: 0, medium: 1, low: 2 };
  return items.sort((a, b) => order[a.severity] - order[b.severity]);
}

/** Engagement-by-status bars. */
export const stageBreakdown = (state) => engagementsByStage(state?.clients ?? mockClients);

/** Most recent client uploads, newest first. */
export function recentUploads(state, limit = 5) {
  const incoming = state?.incoming ?? mockIncomingDocuments;
  const filed = (state?.documents ?? mockDocuments).filter((d) => d.uploadedByType === 'Client');
  return [
    ...incoming.map((d) => ({
      id: d.id,
      clientId: d.clientId,
      name: d.name,
      by: d.uploadedBy,
      on: d.receivedOn,
      status: 'Needs categorisation',
      type: d.type,
    })),
    ...filed.map((d) => ({
      id: d.id,
      clientId: d.clientId,
      name: d.name,
      by: d.uploadedBy,
      on: d.uploadedOn,
      status: d.status,
      type: d.type,
    })),
  ].slice(0, limit);
}

/** Portal-side events only — logins, uploads, activations. */
export function recentPortalActivity(state, limit = 6) {
  const events = state?.activity ?? mockActivity;
  return events.filter((e) => e.actorType !== 'SMB').slice(0, limit);
}

/** Portfolio marketing roll-up for the dashboard summary card. */
export function marketingSummary(state) {
  const listings = state?.marketing ?? mockMarketing;
  const totals = marketingTotals(listings);
  return {
    ...totals,
    listings: listings.length,
    visibleToClients: listings.filter((l) => l.clientVisible).length,
    lastSync: 'Sep 17, 2026 · 6:00 AM',
    top: [...listings]
      .filter((l) => l.clientId)
      .sort((a, b) => b.detailViews - a.detailViews)
      .slice(0, 3),
  };
}

/** Quick actions shown at the top of the dashboard. */
export const quickActions = [
  { id: 'add-client', label: 'Add client', icon: 'plus', variant: 'primary' },
  { id: 'invite-user', label: 'Invite user', icon: 'mail', variant: 'secondary' },
  { id: 'create-request', label: 'Create request', icon: 'request', variant: 'secondary' },
  { id: 'upload-document', label: 'Upload document', icon: 'upload', variant: 'secondary' },
];

/** Single object matching the naming the brief asked for. */
export const mockAdminDashboard = {
  kpis: dashboardKpis,
  attention: attentionItems,
  stages: stageBreakdown,
  uploads: recentUploads,
  activity: recentPortalActivity,
  marketing: marketingSummary,
  quickActions,
};
