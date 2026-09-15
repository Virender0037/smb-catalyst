/**
 * Engagement status, deal stages, milestones and buyer activity.
 * Replacement path: Catalyst function -> Zoho CRM Deal stage + custom fields.
 */
export const mockEngagement = {
  status: 'Marketing & Buyer Outreach',
  statusTone: 'accent',
  engagedOn: 'February 3, 2026',
  listingPublished: 'March 12, 2026',
  currentStageId: 'marketing',
  nextMilestone: 'Initial Buyer Review',
  nextMilestoneDate: 'September 25, 2026',
  nextMilestoneNote:
    'Sarah will present the qualified buyer shortlist and indications of interest received to date.',
  stages: [
    { id: 'engagement', label: 'Engagement', state: 'done', completedOn: 'Feb 3, 2026' },
    { id: 'valuation', label: 'Valuation', state: 'done', completedOn: 'Feb 26, 2026' },
    { id: 'preparation', label: 'Preparation', state: 'done', completedOn: 'Mar 10, 2026' },
    { id: 'marketing', label: 'Marketing & Buyer Outreach', state: 'current', progress: 0.65 },
    { id: 'diligence', label: 'Diligence', state: 'upcoming' },
    { id: 'closing', label: 'Closing', state: 'upcoming' },
  ],
  /** Buyer-side traction — headline numbers for the dashboard. */
  buyerActivity: [
    {
      id: 'ndas',
      label: 'NDAs Executed',
      value: 8,
      note: '2 executed in the last 14 days',
      trend: [2, 3, 3, 5, 6, 7, 8],
      delta: { value: '+2', direction: 'up', period: 'vs. last month' },
    },
    {
      id: 'cim',
      label: 'CIM Views',
      value: 14,
      note: 'Confidential memorandum opened by 8 buyers',
      trend: [1, 3, 5, 7, 9, 12, 14],
      delta: { value: '+5', direction: 'up', period: 'vs. last month' },
    },
    {
      id: 'diligence',
      label: 'Active Diligence',
      value: 3,
      note: '1 group scheduled a site visit',
      trend: [0, 0, 1, 1, 2, 2, 3],
      delta: { value: '+1', direction: 'up', period: 'vs. last month' },
    },
  ],
  buyerTypes: [
    { label: 'Private equity / platform', value: 4 },
    { label: 'Physician group / strategic', value: 3 },
    { label: 'Individual physician buyer', value: 1 },
  ],
};

export const mockMilestones = [
  { id: 'ms-1', label: 'Initial Buyer Review', date: 'September 25, 2026', state: 'upcoming' },
  { id: 'ms-2', label: 'Indications of Interest Due', date: 'October 9, 2026', state: 'upcoming' },
  { id: 'ms-3', label: 'Management Meetings', date: 'October 23, 2026', state: 'upcoming' },
  { id: 'ms-4', label: 'Letter of Intent Target', date: 'November 13, 2026', state: 'upcoming' },
];
