/**
 * ============================================================
 * Internal Strategic Medical Brokers staff.
 *
 * MOCK DATA ONLY — no directory, no SSO, no Zoho CRM users API.
 * Replacement path: Catalyst function -> Zoho CRM Users / org directory.
 * ============================================================
 */

export const mockStaff = [
  {
    id: 'stf-1',
    name: 'Daniel Whitmore',
    initials: 'DW',
    email: 'd.whitmore@strategicmedicalbrokers.com',
    role: 'Managing Broker',
    adminRole: 'SMB Administrator',
    phone: '(602) 555-0142',
  },
  {
    id: 'stf-2',
    name: 'Karen Delgado',
    initials: 'KD',
    email: 'k.delgado@strategicmedicalbrokers.com',
    role: 'Senior Transaction Advisor',
    adminRole: 'Deal Team',
    phone: '(602) 555-0188',
  },
  {
    id: 'stf-3',
    name: 'Marcus Feld',
    initials: 'MF',
    email: 'm.feld@strategicmedicalbrokers.com',
    role: 'Valuation Analyst',
    adminRole: 'Deal Team',
    phone: '(602) 555-0163',
  },
  {
    id: 'stf-4',
    name: 'Renee Alvarado',
    initials: 'RA',
    email: 'r.alvarado@strategicmedicalbrokers.com',
    role: 'Client Operations',
    adminRole: 'Portal Operations',
    phone: '(602) 555-0119',
  },
];

/** The signed-in internal operator for this prototype. */
export const mockAdminUser = {
  ...mockStaff[0],
  lastLogin: 'Sep 17, 2026 · 7:42 AM MST',
  mfa: 'Authenticator app',
};

export const staffById = (id) => mockStaff.find((s) => s.id === id) ?? null;
export const staffName = (id) => staffById(id)?.name ?? 'Unassigned';
