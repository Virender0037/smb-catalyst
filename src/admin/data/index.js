/**
 * ============================================================
 * Admin mock-data barrel — the single seam between the admin UI
 * and a future backend.
 *
 * Every admin screen imports its data from here and nowhere else.
 * No component contains a hardcoded client, user, document,
 * request, listing, template or setting.
 *
 * When the Catalyst functions exist, each named export below
 * becomes an API-backed loader with the same shape and no
 * component markup has to change.
 *
 * NOTHING HERE IS REAL: no CRM, no auth, no file store, no
 * BizBuySell feed, no email. UI prototype only.
 * ============================================================
 */

export { mockStaff, mockAdminUser, staffById, staffName } from './staff';

export {
  mockClients,
  clientById,
  clientLabel,
  engagementStages,
  portalStatuses,
  marketingStatuses,
  engagementsByStage,
} from './clients';

export {
  mockPortalUsers,
  portalUserRoles,
  accountStatuses,
  invitationStatuses,
  mfaStatuses,
} from './portalUsers';

export {
  mockDocuments,
  mockIncomingDocuments,
  documentCategories,
  documentVisibilities,
  documentStatuses,
} from './documents';

export { mockRequests, requestStatuses, requestPriorities, requestCategories } from './requests';

export {
  mockMarketing,
  listingStatuses,
  reportingPeriods,
  defaultReportingPeriod,
  scaledMetrics,
  marketingTotals,
} from './marketing';

export { mockActivity, activityEventTypes, eventTypeLabel } from './activity';

export { mockNotifications, notificationChannels } from './notifications';

export { mockRoles, permissionGroups, allPermissions, mockTimeLimitedGrants } from './roles';

export { mockSettings } from './settings';

export {
  mockAdminDashboard,
  dashboardKpis,
  attentionItems,
  stageBreakdown,
  recentUploads,
  recentPortalActivity,
  marketingSummary,
  quickActions,
} from './dashboard';
