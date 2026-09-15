/**
 * Client / practice / signed-in user.
 * Replacement path: Catalyst function -> Zoho CRM Contact + Deal record.
 */
export const mockClient = {
  id: 'CLI-4821',
  name: 'Dr. Michael Carter',
  initials: 'MC',
  title: 'Owner & Medical Director',
  email: 'm.carter@westphoenixpc.com',
  phoneMasked: '(***) ***-9891',
  practice: {
    id: 'PRC-2291',
    name: 'West Phoenix Primary Care',
    specialty: 'Primary Care / Family Medicine',
    location: 'Phoenix, Arizona',
    locations: 2,
    providers: 6,
    established: 2009,
  },
  engagementRef: 'SMB-2026-0184',
  advisorId: 'tm-1',
};

/** The authenticated portal user (same person as the client in this prototype). */
export const mockUser = {
  name: mockClient.name,
  initials: mockClient.initials,
  email: mockClient.email,
  role: 'Client — Seller',
  lastLogin: 'Sep 14, 2026 · 4:12 PM MST',
};
