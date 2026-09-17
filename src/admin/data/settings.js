/**
 * ============================================================
 * Portal configuration.
 *
 * MOCK DATA ONLY. No integration below is connected — the
 * status shown against each one is sample state for design
 * review, and every control is inert.
 *
 * Replacement path: Catalyst function -> a portal settings
 * document plus per-integration credential records.
 * ============================================================
 */

export const mockSettings = {
  portal: {
    name: 'Strategic Medical Brokers Client Portal',
    shortName: 'SMB Client Portal',
    subdomain: 'portal',
    domain: 'strategicmedicalbrokers.com',
    supportLine: '(602) 555-0100',
    supportHours: 'Monday – Friday, 8:00 AM – 5:00 PM MST',
    logoFile: 'smb-logo.png',
    logoNote: 'Official header artwork. No reverse/white variant exists, so portal surfaces stay light.',
    primaryColor: '#1870B8',
    accentColor: '#0FAEEB',
    headingFont: 'DM Serif Display',
    bodyFont: 'System sans (matches the public website)',
    footerText: '© Strategic Medical Brokers. Confidential — for the named recipient only.',
  },

  clientExperience: {
    overviewFields: [
      { id: 'engagement-stage', label: 'Engagement stage', enabled: true, locked: true },
      { id: 'next-milestone', label: 'Next milestone', enabled: true, locked: false },
      { id: 'target-date', label: 'Target date', enabled: true, locked: false },
      { id: 'advisor-contact', label: 'Deal team contact details', enabled: true, locked: false },
      { id: 'valuation-range', label: 'Valuation range', enabled: false, locked: false },
      { id: 'deal-terms', label: 'Headline deal terms', enabled: false, locked: false },
      { id: 'buyer-counts', label: 'Buyer activity counts', enabled: true, locked: false },
    ],
    statusVisibility: 'Show stage name and progress',
    statusVisibilityOptions: [
      'Show stage name and progress',
      'Show stage name only',
      'Hide engagement status entirely',
    ],
    milestoneVisibility: 'Show next milestone and target date',
    milestoneVisibilityOptions: [
      'Show next milestone and target date',
      'Show next milestone only',
      'Hide milestones',
    ],
    buyerIdentityVisibility: 'Anonymised (Buyer #1, Buyer #2…)',
    buyerIdentityOptions: [
      'Anonymised (Buyer #1, Buyer #2…)',
      'Named buyers',
      'Hide buyer activity entirely',
    ],
    defaultNote:
      'These are portal-wide defaults. Any client can be overridden individually from Client 360 → Portal Visibility.',
  },

  documents: {
    categories: [
      { id: 'engagement', label: 'Engagement', defaultVisibility: 'Client visible', locked: true },
      { id: 'valuation', label: 'Valuation', defaultVisibility: 'Restricted by role', locked: false },
      { id: 'financials', label: 'Financials', defaultVisibility: 'Internal only', locked: false },
      { id: 'corporate-legal', label: 'Corporate / Legal', defaultVisibility: 'Internal only', locked: false },
      { id: 'real-estate', label: 'Real Estate', defaultVisibility: 'Internal only', locked: false },
      { id: 'operations', label: 'Operations', defaultVisibility: 'Internal only', locked: false },
      { id: 'marketing', label: 'Marketing', defaultVisibility: 'Client visible', locked: false },
      { id: 'buyer-activity', label: 'Buyer Activity', defaultVisibility: 'Internal only', locked: false },
      { id: 'closing', label: 'Closing', defaultVisibility: 'Restricted by role', locked: false },
    ],
    allowedFileTypes: ['PDF', 'DOCX', 'XLSX', 'CSV', 'PNG', 'JPG', 'HEIC', 'ZIP'],
    /* Executables only. Phone formats such as HEIC are allowed through and
       converted on filing — clients do send signature-page photos. */
    blockedFileTypes: ['EXE', 'BAT', 'JS', 'MSI'],
    maxFileSizeMb: 50,
    maxFilesPerUpload: 10,
    versioning: true,
    retentionYears: 7,
    watermark: {
      enabled: true,
      appliesTo: 'All client downloads',
      appliesToOptions: ['All client downloads', 'Restricted categories only', 'Disabled'],
      content: 'Viewer email + download timestamp',
      contentOptions: [
        'Viewer email + download timestamp',
        'Viewer email only',
        'Viewer email + timestamp + engagement reference',
      ],
      placement: 'Diagonal, centre of page, 12% opacity',
      note: 'Watermarking is not implemented in this prototype. These controls define the intended behaviour only.',
    },
  },

  integrations: [
    {
      id: 'zoho-crm',
      name: 'Zoho CRM',
      description: 'Source of record for accounts, contacts, engagements and pipeline stages.',
      icon: 'briefcase',
      status: 'Not connected',
      detail: 'Phase 2 — clients, engagements and stages will sync from the Deal module.',
      lastSync: '—',
      fields: [
        { label: 'Organisation', value: 'Not configured' },
        { label: 'Modules in scope', value: 'Accounts, Contacts, Deals, Tasks' },
        { label: 'Sync direction', value: 'CRM → Portal (read), Portal → CRM (requests & activity)' },
      ],
    },
    {
      id: 'document-service',
      name: 'Document service',
      description: 'Secure storage, versioning and watermarked delivery of engagement documents.',
      icon: 'folder',
      status: 'Not connected',
      detail: 'Phase 2 — Catalyst File Store or Zoho WorkDrive, pending client decision.',
      lastSync: '—',
      fields: [
        { label: 'Provider', value: 'Undecided — see open questions' },
        { label: 'Encryption', value: 'At rest and in transit (required)' },
        { label: 'Watermarking', value: 'Server-side render on download (required)' },
      ],
    },
    {
      id: 'bizbuysell',
      name: 'BizBuySell',
      description: 'Listing performance statistics — impressions, detail views, leads and favourites.',
      icon: 'chart',
      status: 'Not connected',
      detail:
        'No integration or scraping exists. All marketing figures in this build are mock data. ' +
        'Delivery method to be confirmed with the client.',
      lastSync: '—',
      fields: [
        { label: 'Method', value: 'To be confirmed — API, export, or manual entry' },
        { label: 'Refresh cadence', value: 'Proposed: daily at 6:00 AM MST' },
        { label: 'Listing mapping', value: 'Manual, confirmed by staff in Marketing Activity' },
      ],
    },
    {
      id: 'email',
      name: 'Email notifications',
      description: 'Transactional delivery for invitations, reminders and document alerts.',
      icon: 'mail',
      status: 'Not connected',
      detail: 'Phase 2 — no email is sent from this prototype under any circumstance.',
      lastSync: '—',
      fields: [
        { label: 'Provider', value: 'Zoho ZeptoMail (proposed)' },
        { label: 'From address', value: 'portal@strategicmedicalbrokers.com (proposed)' },
        { label: 'Reply-to', value: 'Lead advisor on the engagement' },
      ],
    },
  ],

  security: {
    mfa: {
      required: true,
      requiredFor: 'All portal users',
      requiredForOptions: ['All portal users', 'Owners and Outside Advisors', 'Optional'],
      methods: [
        { id: 'authenticator', label: 'Authenticator app (TOTP)', enabled: true },
        { id: 'sms', label: 'SMS one-time code', enabled: true },
        { id: 'email', label: 'Email one-time code', enabled: false },
      ],
      rememberDeviceDays: 30,
    },
    password: {
      minLength: 12,
      requireUppercase: true,
      requireNumber: true,
      requireSymbol: true,
      blockCommon: true,
      expiryDays: 0,
      historyCount: 5,
      note: 'Passwords are created by the client during activation. SMB staff never set or view a client password.',
    },
    session: {
      idleTimeoutMinutes: 20,
      absoluteTimeoutHours: 12,
      concurrentSessions: 2,
      forceLogoutOnRoleChange: true,
    },
    invitations: {
      expiryDays: 14,
      resendLimit: 3,
      allowedDomainsNote: 'No domain restriction — outside advisors use their own firm domains.',
    },
  },
};
