export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDecimal(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return Number(value).toFixed(digits);
}

const DMY_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const DMY_DASH_DATETIME_PATTERN = /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2}):(\d{2})$/;
const pad2 = (n) => String(n).padStart(2, '0');

export function formatDMY(date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

// Accepts an ISO datetime (mock data / Doctor CRM), a DD/MM/YYYY date-only
// string (the live LMS API's format), or a "DD-MM-YYYY HH:mm:ss" datetime
// string (Abis Pro CRM's format - not parseable by `new Date()` directly),
// and renders all of them as DD/MM/YYYY[, time].
export function formatDateTime(value) {
  if (!value) return '—';

  const dmyMatch = DMY_PATTERN.exec(value);
  if (dmyMatch) return value;

  const dashDateTimeMatch = DMY_DASH_DATETIME_PATTERN.exec(value);
  if (dashDateTimeMatch) {
    const [, day, month, year, hour, minute, second] = dashDateTimeMatch;
    value = new Date(year, month - 1, day, hour, minute, second);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';

  const time = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${formatDMY(date)}, ${time}`;
}

export function formatGrowth(current, previous) {
  if (!previous) return current ? 100 : 0;
  return ((current - previous) / previous) * 100;
}

export function formatSignedPercent(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
}
