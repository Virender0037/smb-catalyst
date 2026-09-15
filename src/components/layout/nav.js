/**
 * Primary portal navigation. Badge counts are supplied at render time by
 * the portal state provider (see lib/portalState.jsx).
 */
export const navItems = [
  { to: '/overview', label: 'Overview', icon: 'overview' },
  { to: '/marketing', label: 'Marketing', icon: 'chart' },
  { to: '/documents', label: 'Documents', icon: 'document' },
  { to: '/requests', label: 'Requests', icon: 'request', badgeKey: 'openRequests' },
  { to: '/activity', label: 'Activity', icon: 'activity' },
];

export const pageMeta = {
  '/overview': { title: 'Overview', crumb: 'Engagement summary' },
  '/marketing': { title: 'Marketing Activity', crumb: 'Listing performance' },
  '/documents': { title: 'Documents', crumb: 'Secure document library' },
  '/requests': { title: 'Requests', crumb: 'Information we need from you' },
  '/activity': { title: 'Activity', crumb: 'Engagement history' },
};
