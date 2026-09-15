/** Presentation helpers — pure, no side effects. */

export const formatNumber = (n) =>
  typeof n === 'number' ? n.toLocaleString('en-US') : String(n ?? '');

export const formatCompact = (n) => {
  if (typeof n !== 'number') return String(n ?? '');
  if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`;
  return n.toLocaleString('en-US');
};

export const formatPercent = (n, digits = 1) => {
  if (typeof n !== 'number') return '—';
  const sign = n > 0 ? '+' : '';
  return `${sign}${n.toFixed(digits)}%`;
};

export const initialsOf = (name = '') =>
  name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.replace(/[^A-Za-z]/g, '')[0] ?? '')
    .join('')
    .toUpperCase();

/** Status -> badge tone, shared by requests, documents and listings. */
export const statusTone = (status) => {
  switch (status) {
    case 'Completed':
    case 'Final':
    case 'Active':
    case 'Received':
      return 'success';
    case 'Pending':
    case 'In review':
    case 'Draft':
      return 'warn';
    case 'Overdue':
      return 'danger';
    case 'Updated weekly':
      return 'info';
    default:
      return 'neutral';
  }
};

export const deltaDirection = (n) => (n > 0 ? 'up' : n < 0 ? 'down' : 'flat');
