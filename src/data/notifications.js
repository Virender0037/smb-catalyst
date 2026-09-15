/**
 * Header notification tray.
 * Replacement path: Catalyst function -> notification service.
 */
export const mockNotifications = [
  {
    id: 'ntf-1',
    title: 'Message from Sarah Mitchell',
    text: 'Buyer shortlist added ahead of the September 25 review.',
    time: '2 hours ago',
    unread: true,
    link: '/messages',
  },
  {
    id: 'ntf-2',
    title: 'Marketing statistics updated',
    text: 'Listing performance refreshed through September 14.',
    time: 'Today, 6:00 AM',
    unread: true,
    link: '/marketing',
  },
  {
    id: 'ntf-3',
    title: 'Request overdue',
    text: 'Malpractice Insurance Declarations were due September 8.',
    time: 'Yesterday',
    unread: false,
    link: '/requests',
  },
  {
    id: 'ntf-4',
    title: 'Buyer NDA executed',
    text: 'Buyer #8 executed the confidentiality agreement.',
    time: 'Sep 13',
    unread: false,
    link: '/activity',
  },
];
