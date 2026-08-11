import { formatDMY } from '../utils/format';

const APP_SCALE = {
  CRM: 1.6,
  LMS: 1.2,
  Procurement: 0.9,
  IdeaBank: 0.6,
  HRMS: 1.1,
};

const MS_PER_DAY = 24 * 60 * 60 * 1000;

const UNIT_BY_REPORT_TYPE = {
  Daily: 'day',
  Weekly: 'week',
  Monthly: 'month',
  Quarterly: 'quarter',
  'Half-Yearly': 'half',
  Yearly: 'year',
};

const STEP_DAYS = { day: 1, week: 7, month: 30, quarter: 91, half: 182, year: 365 };

function hashSeed(str) {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    return ((h ^= h >>> 16) >>> 0) / 4294967296;
  };
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function fmtShort(date) {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function unitForReportType(reportType, spanDays) {
  if (UNIT_BY_REPORT_TYPE[reportType]) return UNIT_BY_REPORT_TYPE[reportType];
  // Custom Date Range: pick a sensible granularity for the span itself.
  if (spanDays <= 31) return 'day';
  if (spanDays <= 180) return 'week';
  if (spanDays <= 730) return 'month';
  return 'quarter';
}

// Guarantees a readable multi-point trend even when the selected window is
// narrow (e.g. a single-day report) by looking back far enough for context.
function generateTrendBuckets(from, to, unit) {
  const step = STEP_DAYS[unit] ?? 30;
  const end = startOfDay(to);
  const spanDays = Math.max(1, Math.round((end - startOfDay(from)) / MS_PER_DAY));
  const minBuckets = 5;
  const maxBuckets = 24;

  let start = startOfDay(from);
  if (spanDays / step < minBuckets - 1) {
    start = new Date(end.getTime() - (minBuckets - 1) * step * MS_PER_DAY);
  }

  const buckets = [];
  let cursor;

  switch (unit) {
    case 'day':
      cursor = new Date(start);
      while (cursor <= end && buckets.length < maxBuckets) {
        buckets.push({ label: fmtShort(cursor) });
        cursor.setDate(cursor.getDate() + 1);
      }
      break;
    case 'week':
      cursor = new Date(start);
      while (cursor <= end && buckets.length < maxBuckets) {
        buckets.push({ label: fmtShort(cursor) });
        cursor.setDate(cursor.getDate() + 7);
      }
      break;
    case 'month':
      cursor = new Date(start.getFullYear(), start.getMonth(), 1);
      while (cursor <= end && buckets.length < maxBuckets) {
        buckets.push({ label: cursor.toLocaleDateString('en-US', { month: 'short' }) });
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1);
      }
      break;
    case 'quarter':
      cursor = new Date(start.getFullYear(), Math.floor(start.getMonth() / 3) * 3, 1);
      while (cursor <= end && buckets.length < maxBuckets) {
        buckets.push({ label: `Q${Math.floor(cursor.getMonth() / 3) + 1}` });
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 3, 1);
      }
      break;
    case 'half':
      cursor = new Date(start.getFullYear(), start.getMonth() < 6 ? 0 : 6, 1);
      while (cursor <= end && buckets.length < maxBuckets) {
        buckets.push({ label: cursor.getMonth() < 6 ? 'H1' : 'H2' });
        cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 6, 1);
      }
      break;
    case 'year':
      cursor = new Date(start.getFullYear(), 0, 1);
      while (cursor <= end && buckets.length < maxBuckets) {
        buckets.push({ label: `${cursor.getFullYear()}` });
        cursor = new Date(cursor.getFullYear() + 1, 0, 1);
      }
      break;
    default:
      break;
  }

  return buckets.length ? buckets : [{ label: fmtShort(end) }];
}

function buildPeriod(rand, scale, label, isPrevious) {
  const drift = isPrevious ? 0.82 + rand() * 0.15 : 1;
  const totalLogin = Math.round((3200 + rand() * 4200) * scale * drift);
  const activeUsers = Math.round((180 + rand() * 260) * scale * drift);
  const averageActiveUsersPerDay = Math.round(activeUsers * (0.35 + rand() * 0.2));
  const loginAveragePerUser = Number((totalLogin / Math.max(activeUsers, 1)).toFixed(1));
  const lastLogin = new Date(Date.now() - Math.round(rand() * 6) * 60 * 60 * 1000).toISOString();

  return {
    reportPeriod: label,
    lastLogin,
    totalLogin,
    activeUsers,
    averageActiveUsersPerDay,
    loginAveragePerUser,
  };
}

function buildTrend(rand, scale, buckets) {
  return buckets.map(({ label }) => ({
    label,
    logins: Math.round((400 + rand() * 700) * scale),
    activeUsers: Math.round((60 + rand() * 90) * scale),
  }));
}

function rangeLabel(from, to) {
  return startOfDay(from).getTime() === startOfDay(to).getTime()
    ? formatDMY(from)
    : `${formatDMY(from)} - ${formatDMY(to)}`;
}

export function generateDashboardReport({ app, reportType, fromDate, toDate }) {
  const scale = APP_SCALE[app] ?? 1;
  const from = fromDate ? new Date(fromDate) : new Date();
  const to = toDate ? new Date(toDate) : new Date();
  const spanDays = Math.max(1, Math.round((startOfDay(to) - startOfDay(from)) / MS_PER_DAY) + 1);

  const prevTo = new Date(startOfDay(from).getTime() - MS_PER_DAY);
  const prevFrom = new Date(prevTo.getTime() - (spanDays - 1) * MS_PER_DAY);

  const seedKey = `${app}|${reportType}|${fromDate ?? ''}|${toDate ?? ''}`;
  const rand = hashSeed(seedKey);

  const unit = unitForReportType(reportType, spanDays);
  const buckets = generateTrendBuckets(from, to, unit);

  const currentPeriod = buildPeriod(rand, scale, rangeLabel(from, to), false);
  const previousPeriod = buildPeriod(rand, scale, rangeLabel(prevFrom, prevTo), true);
  const trend = buildTrend(rand, scale, buckets);

  return { app, reportType, currentPeriod, previousPeriod, trend };
}
