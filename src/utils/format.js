export function formatNumber(value) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return new Intl.NumberFormat('en-US').format(value);
}

export function formatDecimal(value, digits = 1) {
  if (value === null || value === undefined || Number.isNaN(value)) return '—';
  return Number(value).toFixed(digits);
}

const DMY_PATTERN = /^(\d{2})\/(\d{2})\/(\d{4})$/;
const pad2 = (n) => String(n).padStart(2, '0');

export function formatDMY(date) {
  return `${pad2(date.getDate())}/${pad2(date.getMonth() + 1)}/${date.getFullYear()}`;
}

// Accepts either an ISO datetime (mock data) or a DD/MM/YYYY date-only
// string (the live LMS API's format) and renders both as DD/MM/YYYY.
export function formatDateTime(value) {
  if (!value) return '—';

  const dmyMatch = DMY_PATTERN.exec(value);
  if (dmyMatch) return value;

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
