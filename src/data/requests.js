/**
 * Information / document requests raised by the SMB deal team.
 * Replacement path: Catalyst function -> Zoho CRM Tasks related to the Deal.
 */
export const requestStatuses = ['Pending', 'Overdue', 'Received', 'Completed'];

export const mockRequests = [
  {
    id: 'req-01',
    title: '2025 Financial Statements',
    description:
      'Year-end profit & loss, balance sheet and statement of cash flows for the 2025 fiscal year. Compiled or reviewed statements are both acceptable.',
    category: 'Financials',
    status: 'Pending',
    dueDate: 'Sep 20, 2026',
    requestedOn: 'Sep 10, 2026',
    requestedBy: 'Elena Vasquez',
    action: 'upload',
    priority: 'High',
  },
  {
    id: 'req-02',
    title: 'Owner Information Form',
    description:
      'Short questionnaire covering ownership percentages, post-close intentions and preferred transition timeline. Takes about 10 minutes.',
    category: 'Engagement',
    status: 'Pending',
    dueDate: 'Sep 22, 2026',
    requestedOn: 'Sep 11, 2026',
    requestedBy: 'Sarah Mitchell',
    action: 'complete',
    priority: 'Normal',
  },
  {
    id: 'req-03',
    title: 'Malpractice Insurance Declarations',
    description:
      'Current declarations page for each provider, including tail coverage terms. Buyers have begun asking for this in diligence.',
    category: 'Corporate / Legal',
    status: 'Overdue',
    dueDate: 'Sep 8, 2026',
    requestedOn: 'Aug 25, 2026',
    requestedBy: 'Marcus Webb',
    action: 'upload',
    priority: 'High',
  },
  {
    id: 'req-04',
    title: 'Lease Agreement — 4820 W Thunderbird Rd',
    description:
      'Fully executed commercial lease including all amendments and any option-to-extend language.',
    category: 'Real Estate',
    status: 'Received',
    dueDate: 'Sep 15, 2026',
    requestedOn: 'Sep 2, 2026',
    requestedBy: 'Marcus Webb',
    action: 'view',
    receivedOn: 'Sep 12, 2026',
    priority: 'Normal',
  },
  {
    id: 'req-05',
    title: 'Practice Payer Mix Summary',
    description:
      'Breakdown of revenue by payer for the trailing twelve months, used to support the valuation narrative.',
    category: 'Operations',
    status: 'Completed',
    dueDate: 'Aug 22, 2026',
    requestedOn: 'Aug 8, 2026',
    requestedBy: 'Elena Vasquez',
    action: 'view',
    completedOn: 'Aug 21, 2026',
    priority: 'Normal',
  },
  {
    id: 'req-06',
    title: 'Signed Engagement Letter',
    description: 'Countersigned engagement agreement authorising Strategic Medical Brokers to represent the practice.',
    category: 'Engagement',
    status: 'Completed',
    dueDate: 'Feb 6, 2026',
    requestedOn: 'Jan 29, 2026',
    requestedBy: 'Sarah Mitchell',
    action: 'view',
    completedOn: 'Feb 3, 2026',
    priority: 'Normal',
  },
];
