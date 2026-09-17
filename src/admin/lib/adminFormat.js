/** Presentation helpers for the admin portal. Pure, no side effects. */

/** Engagement stage -> badge tone. */
export const stageTone = (stage) => {
  switch (stage) {
    case 'Closed':
      return 'neutral';
    case 'Closing':
    case 'Diligence':
      return 'success';
    case 'Marketing & Buyer Outreach':
      return 'accent';
    case 'Onboarding':
      return 'warn';
    default:
      return 'info';
  }
};

/** CRM health -> badge tone. */
export const crmStatusTone = (status) => {
  switch (status) {
    case 'On track':
      return 'success';
    case 'Attention needed':
    case 'Awaiting client':
      return 'warn';
    case 'At risk':
      return 'danger';
    case 'Closed — transaction complete':
      return 'neutral';
    default:
      return 'info';
  }
};

/** Portal access state -> badge tone. */
export const portalStatusTone = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Invited':
      return 'info';
    case 'Suspended':
      return 'danger';
    case 'Archived':
      return 'neutral';
    default:
      return 'warn';
  }
};

export const accountStatusTone = (status) => {
  switch (status) {
    case 'Active':
      return 'success';
    case 'Pending activation':
      return 'warn';
    case 'Deactivated':
      return 'neutral';
    case 'Revoked':
      return 'danger';
    default:
      return 'neutral';
  }
};

export const invitationTone = (status) => {
  switch (status) {
    case 'Accepted':
      return 'success';
    case 'Sent':
    case 'Resent':
      return 'info';
    case 'Expired':
      return 'danger';
    default:
      return 'neutral';
  }
};

export const mfaTone = (mfa) => {
  if (!mfa || mfa === 'Not enrolled') return 'warn';
  if (mfa === 'Reset required') return 'danger';
  return 'success';
};

export const requestStatusTone = (status) => {
  switch (status) {
    case 'Completed':
      return 'success';
    case 'Received':
      return 'info';
    case 'Overdue':
      return 'danger';
    default:
      return 'warn';
  }
};

export const priorityTone = (p) => (p === 'High' ? 'danger' : p === 'Low' ? 'neutral' : 'warn');

export const listingStatusTone = (status) => {
  switch (status) {
    case 'Live':
      return 'success';
    case 'Scheduled':
      return 'info';
    case 'Paused':
      return 'warn';
    case 'Unassigned':
      return 'danger';
    default:
      return 'neutral';
  }
};

export const marketingStatusTone = listingStatusTone;

export const visibilityTone = (v) => {
  switch (v) {
    case 'Client visible':
      return 'success';
    case 'Restricted by role':
      return 'warn';
    default:
      return 'neutral';
  }
};

export const docStatusTone = (status) => {
  switch (status) {
    case 'Final':
      return 'success';
    case 'In review':
      return 'info';
    case 'Draft':
      return 'warn';
    case 'Needs categorisation':
      return 'danger';
    default:
      return 'neutral';
  }
};

export const severityTone = (s) => (s === 'high' ? 'danger' : s === 'medium' ? 'warn' : 'info');

/** "Sep 17, 2026 · 8:14 AM" -> "Sep 17, 2026" for compact columns. */
export const dayOf = (stamp = '') => String(stamp).split('·')[0].trim();

/** Maps a display date ("Sep 17, 2026") to an ISO key for range filtering. */
const MONTHS = {
  Jan: '01', Feb: '02', Mar: '03', Apr: '04', May: '05', Jun: '06',
  Jul: '07', Aug: '08', Sep: '09', Oct: '10', Nov: '11', Dec: '12',
};

export function toIsoKey(display) {
  if (!display) return '';
  const m = /^([A-Z][a-z]{2}) (\d{1,2}), (\d{4})/.exec(String(display).trim());
  if (!m) return '';
  const [, mon, day, year] = m;
  return `${year}-${MONTHS[mon] ?? '01'}-${day.padStart(2, '0')}`;
}

/** The prototype's "today". Everything relative is measured from here. */
export const TODAY_ISO = '2026-09-17';
export const TODAY_DISPLAY = 'September 17, 2026';

/** Negative = overdue by N days. */
export function daysUntil(display, fromIso = TODAY_ISO) {
  const iso = toIsoKey(display);
  if (!iso) return null;
  const ms = Date.parse(`${iso}T00:00:00Z`) - Date.parse(`${fromIso}T00:00:00Z`);
  return Math.round(ms / 86400000);
}

export function dueLabel(display) {
  const d = daysUntil(display);
  if (d === null) return display ?? '—';
  if (d < 0) return `${Math.abs(d)} day${Math.abs(d) === 1 ? '' : 's'} overdue`;
  if (d === 0) return 'Due today';
  if (d === 1) return 'Due tomorrow';
  return `Due in ${d} days`;
}

/** File extension -> the file-chip class already defined in pages.css. */
export const fileClass = (type) =>
  ['pdf', 'xlsx', 'docx', 'zip'].includes(type) ? `file-${type}` : 'file-other';
