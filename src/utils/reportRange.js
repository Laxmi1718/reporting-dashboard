import dayjs from 'dayjs';
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
