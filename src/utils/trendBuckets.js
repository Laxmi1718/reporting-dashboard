// Splits an overall [from, to] window into calendar sub-ranges for a given
// trend granularity - used to fan out one real API call per bucket for live
// apps, whose backend only returns aggregate totals for a single queried
// window (no historical series of its own). Capped to keep the fan-out
// bounded on wide date ranges.
const MAX_BUCKETS = 24;

function clip(bucketFrom, bucketTo, from, to) {
  return {
    from: bucketFrom.isBefore(from) ? from : bucketFrom,
    to: bucketTo.isAfter(to) ? to : bucketTo,
  };
}

export function buildTrendBucketRanges(reportType, from, to) {
  const buckets = [];

  if (reportType === 'Weekly') {
    let cursor = from.startOf('day');
    while (!cursor.isAfter(to) && buckets.length < MAX_BUCKETS) {
      const { from: bucketFrom, to: bucketTo } = clip(cursor, cursor.add(6, 'day'), from, to);
      buckets.push({ label: cursor.format('DD MMM'), from: bucketFrom, to: bucketTo });
      cursor = cursor.add(7, 'day');
    }
  } else if (reportType === 'Monthly') {
    let cursor = from.startOf('month');
    while (!cursor.isAfter(to) && buckets.length < MAX_BUCKETS) {
      const { from: bucketFrom, to: bucketTo } = clip(cursor, cursor.endOf('month'), from, to);
      buckets.push({ label: cursor.format("MMM 'YY"), from: bucketFrom, to: bucketTo });
      cursor = cursor.add(1, 'month');
    }
  } else if (reportType === 'Quarterly') {
    let cursor = from.month(Math.floor(from.month() / 3) * 3).startOf('month');
    while (!cursor.isAfter(to) && buckets.length < MAX_BUCKETS) {
      const { from: bucketFrom, to: bucketTo } = clip(cursor, cursor.add(2, 'month').endOf('month'), from, to);
      buckets.push({ label: `Q${Math.floor(cursor.month() / 3) + 1} '${cursor.format('YY')}`, from: bucketFrom, to: bucketTo });
      cursor = cursor.add(3, 'month');
    }
  } else if (reportType === 'Yearly') {
    let cursor = from.startOf('year');
    while (!cursor.isAfter(to) && buckets.length < MAX_BUCKETS) {
      const { from: bucketFrom, to: bucketTo } = clip(cursor, cursor.endOf('year'), from, to);
      buckets.push({ label: cursor.format('YYYY'), from: bucketFrom, to: bucketTo });
      cursor = cursor.add(1, 'year');
    }
  }

  return buckets.length ? buckets : [{ label: to.format("DD MMM 'YY"), from, to }];
}
