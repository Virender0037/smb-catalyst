/**
 * ============================================================
 * Roles & permissions matrix for CLIENT-SIDE portal roles.
 *
 * MOCK DATA ONLY — nothing here is enforced by a backend. The
 * matrix is the design artefact SMB signs off before the rules
 * are implemented server-side.
 *
 * Replacement path: Catalyst function -> role definitions stored
 * against the engagement, enforced in every API handler.
 * ============================================================
 */

export const permissionGroups = [
  {
    id: 'engagement',
    label: 'Engagement',
    permissions: [
      { id: 'view-overview', label: 'View Overview', hint: 'Engagement summary, stage and milestones' },
      { id: 'view-deal-terms', label: 'View Deal Terms', hint: 'Headline terms, valuation range, offers' },
      { id: 'view-financials', label: 'View Financials', hint: 'Financial statements and valuation workings' },
    ],
  },
  {
    id: 'buyers',
    label: 'Buyers & marketing',
    permissions: [
      { id: 'view-buyer-activity', label: 'View Buyer Activity', hint: 'NDA counts, CIM views, diligence progress' },
      { id: 'view-buyer-identities', label: 'View Buyer Identities', hint: 'Named buyers rather than anonymised labels' },
      { id: 'view-marketing', label: 'View Marketing Activity', hint: 'Listing performance and lead volume' },
    ],
  },
  {
    id: 'documents',
    label: 'Documents',
    permissions: [
      { id: 'view-documents', label: 'View Documents', hint: 'Browse the client-visible document library' },
      { id: 'upload-documents', label: 'Upload Documents', hint: 'Send files to the SMB deal team' },
      { id: 'download-documents', label: 'Download Documents', hint: 'Downloads carry a viewer watermark' },
    ],
  },
  {
    id: 'requests',
    label: 'Requests',
    permissions: [
      { id: 'view-requests', label: 'View Requests', hint: 'See what the deal team has asked for' },
      { id: 'complete-requests', label: 'Complete Requests', hint: 'Respond to and close out a request' },
    ],
  },
];

/** Flat list in display order — handy for the matrix rows. */
export const allPermissions = permissionGroups.flatMap((g) =>
  g.permissions.map((p) => ({ ...p, groupId: g.id, groupLabel: g.label })),
);

export const mockRoles = [
  {
    id: 'owner',
    name: 'Owner',
    description: 'The selling physician or practice owner. Full visibility of their own engagement.',
    system: true,
    assignedUsers: 7,
    timeLimited: false,
    defaultExpiryDays: null,
    permissions: {
      'view-overview': true,
      'view-deal-terms': true,
      'view-financials': true,
      'view-buyer-activity': true,
      'view-buyer-identities': true,
      'view-marketing': true,
      'view-documents': true,
      'upload-documents': true,
      'download-documents': true,
      'view-requests': true,
      'complete-requests': true,
    },
  },
  {
    id: 'practice-admin',
    name: 'Practice Administrator',
    description: 'Practice manager or office administrator supporting the owner with document gathering.',
    system: true,
    assignedUsers: 6,
    timeLimited: false,
    defaultExpiryDays: null,
    permissions: {
      'view-overview': true,
      'view-deal-terms': false,
      'view-financials': false,
      'view-buyer-activity': false,
      'view-buyer-identities': false,
      'view-marketing': false,
      'view-documents': true,
      'upload-documents': true,
      'download-documents': true,
      'view-requests': true,
      'complete-requests': true,
    },
  },
  {
    id: 'outside-advisor',
    name: 'Outside Advisor (CPA / Attorney)',
    description: "The client's accountant or counsel. Time-limited access, scoped to what they are advising on.",
    system: true,
    assignedUsers: 4,
    timeLimited: true,
    defaultExpiryDays: 60,
    permissions: {
      'view-overview': true,
      'view-deal-terms': true,
      'view-financials': true,
      'view-buyer-activity': false,
      'view-buyer-identities': false,
      'view-marketing': false,
      'view-documents': true,
      'upload-documents': true,
      'download-documents': true,
      'view-requests': true,
      'complete-requests': false,
    },
  },
  {
    id: 'reserved',
    name: 'Additional role',
    description: 'Reserved slot for a fourth client-side role — not yet defined or assignable.',
    system: false,
    placeholder: true,
    assignedUsers: 0,
    timeLimited: false,
    defaultExpiryDays: null,
    permissions: {},
  },
];

/** Active time-limited grants, shown beneath the matrix. */
export const mockTimeLimitedGrants = [
  {
    id: 'grant-1',
    userId: 'usr-006',
    userName: 'Erin Salazar, Esq.',
    clientId: 'CLI-4802',
    role: 'Outside Advisor',
    grantedOn: 'Jul 8, 2026',
    expiresOn: 'Sep 30, 2026',
    daysRemaining: 13,
    scope: 'Corporate / Legal, Closing',
  },
  {
    id: 'grant-2',
    userId: 'usr-010',
    userName: 'Gregory Pham, Esq.',
    clientId: 'CLI-4790',
    role: 'Outside Advisor',
    grantedOn: 'Aug 5, 2026',
    expiresOn: 'Oct 15, 2026',
    daysRemaining: 28,
    scope: 'Closing',
  },
  {
    id: 'grant-3',
    userId: 'usr-003',
    userName: 'Thomas Bregman, CPA',
    clientId: 'CLI-4821',
    role: 'Outside Advisor',
    grantedOn: 'Mar 2, 2026',
    expiresOn: 'Oct 31, 2026',
    daysRemaining: 44,
    scope: 'Financials, Valuation',
  },
];
