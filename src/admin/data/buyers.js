/**
 * ============================================================
 * Buyers in each engagement's process, with their current stage.
 *
 * MOCK DATA ONLY — internal identifiers, no CRM record links.
 * Staff-only: these records are never passed to the client portal
 * or to "Preview as client"; the client's buyerIdentities setting
 * still governs what the client sees.
 *
 * Each record carries its own clientId + engagementRef, so buyers for any
 * other engagement are added here and picked up by buyersForClient().
 *
 * Replacement path: Catalyst function -> Zoho CRM buyer Contacts
 * related to the Deal, with a buyer-stage field.
 * ============================================================
 */

export const buyerStages = ['CIM Viewed', 'Buyer-Seller virtual meeting', 'LOI presented', 'No longer interested'];

export const mockBuyers = [
  { id: 'BYR-0184-001', clientId: 'CLI-4821', engagementRef: 'SMB-2026-0184', name: 'Buyer 1', stage: 'CIM Viewed' },
  { id: 'BYR-0184-002', clientId: 'CLI-4821', engagementRef: 'SMB-2026-0184', name: 'Buyer 2', stage: 'No longer interested' },
  { id: 'BYR-0184-003', clientId: 'CLI-4821', engagementRef: 'SMB-2026-0184', name: 'Buyer 3', stage: 'Buyer-Seller virtual meeting' },
  { id: 'BYR-0184-004', clientId: 'CLI-4821', engagementRef: 'SMB-2026-0184', name: 'Buyer 4', stage: 'LOI presented' },
];

export const buyersForClient = (clientId) => mockBuyers.filter((b) => b.clientId === clientId);
