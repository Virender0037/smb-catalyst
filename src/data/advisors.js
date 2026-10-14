/**
 * The client's own outside advisors (not SMB staff), scoped to one engagement.
 * Contact fields stay null until the client or deal team supplies them — the
 * Overview renders a placeholder state rather than inventing details.
 * Replacement path: Catalyst function -> Zoho CRM Contacts related to the Deal.
 */
export const advisorTypes = [
  { id: 'cpa', label: 'CPA', icon: 'briefcase', role: 'Financial statements and tax planning' },
  { id: 'attorney', label: 'Attorney', icon: 'shield', role: 'Transaction documents and legal review' },
  { id: 'financial-advisor', label: 'Financial Advisor', icon: 'trendUp', role: 'Proceeds and wealth planning' },
  { id: 'consultant', label: 'Consultant', icon: 'team', role: 'Practice operations and transition' },
];

export const mockAdvisors = [
  { id: 'adv-0184-cpa', engagementRef: 'SMB-2026-0184', type: 'cpa', name: null, firm: null, phone: null, email: null },
  { id: 'adv-0184-att', engagementRef: 'SMB-2026-0184', type: 'attorney', name: null, firm: null, phone: null, email: null },
  { id: 'adv-0184-fa', engagementRef: 'SMB-2026-0184', type: 'financial-advisor', name: null, firm: null, phone: null, email: null },
  { id: 'adv-0184-con', engagementRef: 'SMB-2026-0184', type: 'consultant', name: null, firm: null, phone: null, email: null },
];

/** One row per advisor type for the given engagement; never returns another engagement's records. */
export const advisorsForEngagement = (engagementRef) =>
  advisorTypes.map((t) => ({
    ...t,
    advisor: mockAdvisors.find((a) => a.engagementRef === engagementRef && a.type === t.id) ?? null,
  }));
