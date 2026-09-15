/**
 * Listing marketing performance — MOCK DATA ONLY.
 * No BizBuySell integration or scraping is performed anywhere in this prototype.
 * Replacement path: Catalyst function -> broker marketing feed / manual entry in Zoho CRM.
 */

export const mockListing = {
  name: 'West Phoenix Primary Care',
  headline: 'Primary Care Practice | 2 Locations | 6 Providers | Phoenix, AZ',
  reference: 'SMB-LST-2522217',
  status: 'Active',
  publishedOn: 'March 12, 2026',
  channels: ['Confidential business marketplace', 'SMB buyer network', 'Targeted outreach'],
  lastUpdated: 'September 15, 2026 · 6:00 AM MST',
};

export const marketingRanges = [
  { id: '30d', label: 'Past 30 days', period: 'Aug 17 – Sep 15, 2026', granularity: 'week' },
  { id: '3m', label: 'Past 3 months', period: 'Jun 16 – Sep 15, 2026', granularity: 'week' },
  { id: '6m', label: 'Past 6 months', period: 'Mar 16 – Sep 15, 2026', granularity: 'month' },
  { id: 'all', label: 'Since listing published', period: 'Mar 12 – Sep 15, 2026', granularity: 'month' },
];

export const defaultRangeId = '6m';

/**
 * Each series is an array of { label, impressions, views, leads, favorites }.
 * `partial` flags an in-progress bucket (rendered muted, like a partial week).
 */
export const mockMarketingStats = {
  '30d': {
    deltas: { impressions: -8.4, views: -6.1, leads: 0, favorites: 10 },
    series: [
      { label: 'Aug 17', impressions: 1080, views: 46, leads: 0, favorites: 0 },
      { label: 'Aug 24', impressions: 935, views: 38, leads: 1, favorites: 0 },
      { label: 'Aug 31', impressions: 870, views: 33, leads: 0, favorites: 1 },
      { label: 'Sep 7', impressions: 790, views: 30, leads: 1, favorites: 0 },
      { label: 'Sep 14', impressions: 460, views: 17, leads: 0, favorites: 0, partial: true },
    ],
  },
  '3m': {
    deltas: { impressions: -4.2, views: -2.8, leads: 12.5, favorites: 0 },
    series: [
      { label: 'Jun 16', impressions: 1180, views: 48, leads: 1, favorites: 0 },
      { label: 'Jun 23', impressions: 1245, views: 54, leads: 0, favorites: 1 },
      { label: 'Jun 30', impressions: 1090, views: 45, leads: 2, favorites: 0 },
      { label: 'Jul 7', impressions: 1160, views: 51, leads: 1, favorites: 1 },
      { label: 'Jul 14', impressions: 1215, views: 58, leads: 1, favorites: 0 },
      { label: 'Jul 21', impressions: 1320, views: 62, leads: 2, favorites: 1 },
      { label: 'Jul 28', impressions: 1140, views: 49, leads: 0, favorites: 1 },
      { label: 'Aug 4', impressions: 1055, views: 44, leads: 1, favorites: 0 },
      { label: 'Aug 11', impressions: 990, views: 41, leads: 1, favorites: 1 },
      { label: 'Aug 18', impressions: 1080, views: 46, leads: 0, favorites: 0 },
      { label: 'Aug 25', impressions: 935, views: 38, leads: 1, favorites: 0 },
      { label: 'Sep 1', impressions: 870, views: 33, leads: 0, favorites: 1 },
      { label: 'Sep 8', impressions: 640, views: 24, leads: 1, favorites: 0, partial: true },
    ],
  },
  '6m': {
    deltas: { impressions: 18.6, views: 14.2, leads: 21.4, favorites: 11.1 },
    series: [
      { label: 'Apr', impressions: 2980, views: 112, leads: 2, favorites: 1 },
      { label: 'May', impressions: 3620, views: 138, leads: 3, favorites: 2 },
      { label: 'Jun', impressions: 4410, views: 176, leads: 4, favorites: 2 },
      { label: 'Jul', impressions: 4980, views: 205, leads: 3, favorites: 2 },
      { label: 'Aug', impressions: 4290, views: 178, leads: 3, favorites: 2 },
      { label: 'Sep', impressions: 3135, views: 139, leads: 2, favorites: 1, partial: true },
    ],
  },
  all: {
    deltas: { impressions: 18.6, views: 14.2, leads: 21.4, favorites: 11.1 },
    series: [
      { label: 'Mar', impressions: 1240, views: 44, leads: 0, favorites: 0 },
      { label: 'Apr', impressions: 2980, views: 112, leads: 2, favorites: 1 },
      { label: 'May', impressions: 3620, views: 138, leads: 3, favorites: 2 },
      { label: 'Jun', impressions: 4410, views: 176, leads: 4, favorites: 2 },
      { label: 'Jul', impressions: 4980, views: 205, leads: 3, favorites: 2 },
      { label: 'Aug', impressions: 4290, views: 178, leads: 3, favorites: 2 },
      { label: 'Sep', impressions: 3135, views: 139, leads: 2, favorites: 1, partial: true },
    ],
  },
};

/** Click-through series (secondary toggle on the Detail Views chart). */
export const mockClickThrough = {
  '30d': [38, 31, 27, 24, 13],
  '3m': [41, 45, 38, 43, 49, 52, 42, 37, 34, 38, 31, 27, 19],
  '6m': [94, 118, 149, 173, 151, 118],
  all: [37, 94, 118, 149, 173, 151, 118],
};

export const mockLeadSources = [
  { label: 'Email inquiry', value: 11 },
  { label: 'Phone inquiry', value: 4 },
  { label: 'Saved-search alert', value: 2 },
];

/** Totals for a range, derived so KPI cards and charts can never disagree. */
export function getMarketingTotals(rangeId) {
  const rows = mockMarketingStats[rangeId]?.series ?? [];
  return rows.reduce(
    (acc, r) => ({
      impressions: acc.impressions + r.impressions,
      views: acc.views + r.views,
      leads: acc.leads + r.leads,
      favorites: acc.favorites + r.favorites,
    }),
    { impressions: 0, views: 0, leads: 0, favorites: 0 },
  );
}
