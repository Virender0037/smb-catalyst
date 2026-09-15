/**
 * ============================================================
 * Mock data barrel — the single seam between UI and backend.
 *
 * Every screen imports its data from here and nowhere else.
 * When the Catalyst functions exist, each named export below
 * becomes an API-backed hook/loader with the same shape, and
 * no component markup has to change.
 * ============================================================
 */
export { mockClient, mockUser } from './client';
export { mockEngagement, mockMilestones } from './engagement';
export {
  mockListing,
  mockMarketingStats,
  mockClickThrough,
  mockLeadSources,
  marketingRanges,
  defaultRangeId,
  getMarketingTotals,
} from './marketing';
export { mockDocuments, documentCategories } from './documents';
export { mockRequests, requestStatuses } from './requests';
export { mockActivity, activityTypes } from './activity';
export { mockConversations } from './messages';
export { mockTeam, mockSupport } from './team';
export { mockNotifications } from './notifications';
