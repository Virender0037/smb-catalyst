/**
 * Admin navigation. Badge counts come from the admin state provider
 * at render time (see lib/adminState.jsx) — never hardcoded here.
 */
export const adminNavGroups = [
  {
    id: 'operate',
    label: 'Operations',
    items: [
      { to: '/admin/dashboard', label: 'Dashboard', icon: 'overview' },
      { to: '/admin/clients', label: 'Clients', icon: 'building' },
      { to: '/admin/users', label: 'Portal Users', icon: 'team', badgeKey: 'pendingInvites' },
      { to: '/admin/documents', label: 'Documents', icon: 'document', badgeKey: 'inbox' },
      { to: '/admin/requests', label: 'Requests', icon: 'request', badgeKey: 'overdue' },
    ],
  },
  {
    id: 'insight',
    label: 'Insight',
    items: [
      { to: '/admin/marketing', label: 'Marketing Activity', icon: 'chart' },
      { to: '/admin/activity', label: 'Activity', icon: 'activity' },
    ],
  },
  {
    id: 'configure',
    label: 'Configuration',
    items: [
      { to: '/admin/notifications', label: 'Notifications', icon: 'bell' },
      { to: '/admin/roles', label: 'Roles & Permissions', icon: 'shield' },
      { to: '/admin/settings', label: 'Settings', icon: 'settings' },
    ],
  },
];

export const adminNavItems = adminNavGroups.flatMap((g) => g.items);

export const adminPageMeta = {
  '/admin/dashboard': { title: 'Dashboard', crumb: 'What needs SMB attention today' },
  '/admin/clients': { title: 'Clients', crumb: 'Clients & engagements' },
  '/admin/users': { title: 'Portal Users', crumb: 'Access, invitations and MFA' },
  '/admin/documents': { title: 'Documents', crumb: 'Library, visibility and versions' },
  '/admin/documents/incoming': { title: 'Incoming Documents', crumb: 'Client uploads awaiting filing' },
  '/admin/requests': { title: 'Requests', crumb: 'Information requested from clients' },
  '/admin/marketing': { title: 'Marketing Activity', crumb: 'Listing performance and visibility' },
  '/admin/activity': { title: 'Activity', crumb: 'Internal audit timeline' },
  '/admin/notifications': { title: 'Notifications', crumb: 'Templates and triggers' },
  '/admin/roles': { title: 'Roles & Permissions', crumb: 'What each client role can see' },
  '/admin/settings': { title: 'Settings', crumb: 'Portal configuration' },
};

/** Falls back sensibly for dynamic routes such as /admin/clients/:id. */
export function metaForPath(pathname) {
  if (adminPageMeta[pathname]) return adminPageMeta[pathname];
  if (pathname.startsWith('/admin/clients/')) {
    return pathname.endsWith('/preview')
      ? { title: 'Preview as client', crumb: 'Read-only view of the client portal' }
      : { title: 'Client 360', crumb: 'Engagement, access and visibility' };
  }
  return { title: 'Admin', crumb: 'Strategic Medical Brokers' };
}
