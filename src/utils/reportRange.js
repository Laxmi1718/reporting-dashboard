import dayjs from 'dayjs';

// The report-type dropdown is a preset picker for the From/To fields, not a
// parameter sent to the API - only the resulting date range is. Custom Date
// Range intentionally returns null so it never overwrites what the user
// already picked.
export function getPresetRange(reportType) {
  const today = dayjs();

  switch (reportType) {
    case 'Daily':
      return { from: today, to: today };
    case 'Weekly':
      return { from: today.subtract(6, 'day'), to: today };
    case 'Monthly':
      return { from: today.startOf('month'), to: today };
    case 'Quarterly': {
      const quarterStartMonth = Math.floor(today.month() / 3) * 3;
      return { from: today.month(quarterStartMonth).startOf('month'), to: today };
    }
    case 'Half-Yearly': {
      const halfStartMonth = today.month() < 6 ? 0 : 6;
      return { from: today.month(halfStartMonth).startOf('month'), to: today };
    }
    case 'Yearly':
      return { from: today.startOf('year'), to: today };
    default:
      return null;
  }
}
