/**
 * ============================================================
 * Marketing / listing administration — MOCK DATA ONLY.
 *
 * There is NO BizBuySell integration, feed or scraping anywhere
 * in this prototype. Every number below is fabricated sample data
 * and the "Refresh" control is a UI affordance only.
 *
 * Replacement path: Catalyst function -> broker marketing feed or
 * manual entry against the Zoho CRM Deal.
 * ============================================================
 */

export const listingStatuses = ['Live', 'Scheduled', 'Paused', 'Withdrawn', 'Unassigned'];

export const reportingPeriods = [
  { id: '30d', label: 'Past 30 days' },
  { id: '3m', label: 'Past 3 months' },
  { id: '6m', label: 'Past 6 months' },
  { id: 'all', label: 'Since published' },
];

export const defaultReportingPeriod = '6m';

export const mockMarketing = [
  {
    id: 'lst-001',
    listingId: 'SMB-LST-2522217',
    name: 'Primary Care Practice | 2 Locations | Phoenix, AZ',
    clientId: 'CLI-4821',
    status: 'Live',
    source: 'Confidential business marketplace',
    publishedOn: 'Mar 12, 2026',
    reportingPeriod: '6m',
    periodLabel: 'Mar 16 – Sep 15, 2026',
    impressions: 23415,
    detailViews: 948,
    leads: 17,
    favorites: 10,
    lastSync: 'Sep 17, 2026 · 6:00 AM',
    trend: [2980, 3620, 4410, 4980, 4290, 3135],
    trendDirection: 'up',
    trendPct: 18.6,
    clientVisible: true,
    mappingConfirmed: true,
  },
  {
    id: 'lst-002',
    listingId: 'SMB-LST-2519884',
    name: 'Dermatology Group | 3 Locations | Tucson, AZ',
    clientId: 'CLI-4802',
    status: 'Paused',
    source: 'Confidential business marketplace',
    publishedOn: 'Dec 4, 2025',
    reportingPeriod: '6m',
    periodLabel: 'Mar 16 – Sep 15, 2026',
    impressions: 41880,
    detailViews: 1624,
    leads: 29,
    favorites: 18,
    lastSync: 'Sep 17, 2026 · 6:00 AM',
    trend: [8100, 7940, 7220, 6680, 6010, 5930],
    trendDirection: 'down',
    trendPct: -9.4,
    clientVisible: true,
    mappingConfirmed: true,
  },
  {
    id: 'lst-003',
    listingId: 'SMB-LST-2531470',
    name: 'Cardiology Practice | 2 Locations | Mesa, AZ',
    clientId: 'CLI-4776',
    status: 'Scheduled',
    source: 'Confidential business marketplace',
    publishedOn: 'Scheduled for Oct 1, 2026',
    reportingPeriod: '30d',
    periodLabel: 'Aug 18 – Sep 17, 2026',
    impressions: 0,
    detailViews: 0,
    leads: 0,
    favorites: 0,
    lastSync: '—',
    trend: [0, 0, 0, 0, 0, 0],
    trendDirection: 'flat',
    trendPct: 0,
    clientVisible: false,
    mappingConfirmed: true,
  },
  {
    id: 'lst-004',
    listingId: 'SMB-LST-2501133',
    name: 'Multi-Site Dental Group | 4 Locations | Glendale, AZ',
    clientId: 'CLI-4790',
    status: 'Withdrawn',
    source: 'Confidential business marketplace',
    publishedOn: 'Sep 2, 2025',
    reportingPeriod: 'all',
    periodLabel: 'Sep 2, 2025 – Aug 14, 2026',
    impressions: 58120,
    detailViews: 2411,
    leads: 44,
    favorites: 27,
    lastSync: 'Aug 14, 2026 · 6:00 AM',
    trend: [9800, 10240, 9910, 9330, 8890, 9950],
    trendDirection: 'flat',
    trendPct: 0.8,
    clientVisible: true,
    mappingConfirmed: true,
  },
  {
    id: 'lst-005',
    listingId: 'SMB-LST-2488021',
    name: 'Urology Practice | Flagstaff, AZ',
    clientId: 'CLI-4721',
    status: 'Withdrawn',
    source: 'Confidential business marketplace',
    publishedOn: 'Apr 1, 2025',
    reportingPeriod: 'all',
    periodLabel: 'Apr 1, 2025 – Jun 30, 2026',
    impressions: 61990,
    detailViews: 2870,
    leads: 51,
    favorites: 33,
    lastSync: 'Jun 30, 2026 · 6:00 AM',
    trend: [10600, 11020, 10480, 9940, 9510, 10440],
    trendDirection: 'flat',
    trendPct: -0.4,
    clientVisible: false,
    mappingConfirmed: true,
  },
  {
    id: 'lst-006',
    listingId: 'SMB-LST-2534902',
    name: 'Orthopedic Practice | Chandler, AZ (draft)',
    clientId: null,
    status: 'Unassigned',
    source: 'Confidential business marketplace',
    publishedOn: '—',
    reportingPeriod: '30d',
    periodLabel: 'Aug 18 – Sep 17, 2026',
    impressions: 412,
    detailViews: 11,
    leads: 0,
    favorites: 1,
    lastSync: 'Sep 17, 2026 · 6:00 AM',
    trend: [0, 0, 0, 90, 180, 142],
    trendDirection: 'up',
    trendPct: 0,
    clientVisible: false,
    mappingConfirmed: false,
  },
];

/** Period-scaled figures so switching the reporting period visibly changes the data. */
const PERIOD_SCALE = { '30d': 0.14, '3m': 0.42, '6m': 1, all: 1.28 };

export function scaledMetrics(listing, periodId = listing.reportingPeriod) {
  const k = PERIOD_SCALE[periodId] ?? 1;
  const round = (n) => Math.round(n * k);
  return {
    impressions: round(listing.impressions),
    detailViews: round(listing.detailViews),
    leads: round(listing.leads),
    favorites: round(listing.favorites),
  };
}

/** Portfolio roll-up used by the admin dashboard. */
export function marketingTotals(listings = mockMarketing) {
  return listings.reduce(
    (acc, l) => ({
      impressions: acc.impressions + l.impressions,
      detailViews: acc.detailViews + l.detailViews,
      leads: acc.leads + l.leads,
      favorites: acc.favorites + l.favorites,
      live: acc.live + (l.status === 'Live' ? 1 : 0),
    }),
    { impressions: 0, detailViews: 0, leads: 0, favorites: 0, live: 0 },
  );
}
