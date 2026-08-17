import { useEffect, useState } from 'react';
import {
  Grid,
  Stack,
  Typography,
  Skeleton,
  Select,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import LoginTrendChart from './LoginTrendChart';
import ActiveUsersChart from './ActiveUsersChart';
import TrainingCompletionChart from './TrainingCompletionChart';
import ELearningProgressChart from './ELearningProgressChart';
import CallsComparisonChart from './CallsComparisonChart';
import CallsDirectionChart from './CallsDirectionChart';
import { fetchDashboardReport } from '../../services/api';
import { isLive } from '../../services/appConfig';
import { buildTrendBucketRanges } from '../../utils/trendBuckets';
import { TREND_REPORT_TYPES } from '../../utils/constants';

const DEFAULT_GRANULARITY = 'Monthly';
const CUSTOM = 'Custom Date Range';

export default function ChartsSection({
  app,
  fromDate,
  toDate,
  trend,
  trainingBreakdown,
  eLearningBreakdown,
  callComparison,
  callDirection,
  loading,
}) {
  const [granularity, setGranularity] = useState(DEFAULT_GRANULARITY);
  const [customFrom, setCustomFrom] = useState(() => dayjs(fromDate));
  const [customTo, setCustomTo] = useState(() => dayjs(toDate));
  const [localTrend, setLocalTrend] = useState(trend ?? null);
  const [trendLoading, setTrendLoading] = useState(false);

  useEffect(() => {
    // Keep the chart in sync when the parent swaps in a different module's trend
    // (e.g. switching the CRM module dropdown) without app/granularity changing.
    if (app === 'CRM' && Array.isArray(trend)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLocalTrend(trend);
    }
  }, [app, trend]);

  const handleGranularityChange = (value) => {
    if (value === CUSTOM) {
      setCustomFrom(dayjs(fromDate));
      setCustomTo(dayjs(toDate));
    }
    setGranularity(value);
  };

  useEffect(() => {
    if (!app) return undefined;

    if (app === 'CRM' && Array.isArray(trend) && trend.length) {
      setLocalTrend(trend);
      setTrendLoading(false);
      return undefined;
    }

    const range = granularity === CUSTOM ? { from: customFrom, to: customTo } : { from: dayjs(fromDate), to: dayjs(toDate) };
    if (!range.from?.isValid() || !range.to?.isValid()) return undefined;

    let ignore = false;

    setTrendLoading(true);


    const loadTrend = async () => {
      if (isLive(app) && granularity !== CUSTOM) {
        const buckets = buildTrendBucketRanges(granularity, range.from, range.to);
        const results = await Promise.all(
          buckets.map(async (bucket) => {
            try {
              const report = await fetchDashboardReport({
                app,
                reportType: granularity,
                fromDate: bucket.from.format('YYYY-MM-DD'),
                toDate: bucket.to.format('YYYY-MM-DD'),
              });
              const currentPeriod = report?.currentPeriod || {};
              return {
                label: bucket.label,
                logins: Number(currentPeriod.totalLogin ?? currentPeriod.totalLogins ?? 0),
                activeUsers: Number(currentPeriod.activeUsers ?? currentPeriod.totalActiveEmployees ?? 0),
              };
            } catch {
              return null;
            }
          }),
        );
        return results.filter(Boolean);
      }

      const report = await fetchDashboardReport({
        app,
        reportType: granularity,
        fromDate: range.from.format('YYYY-MM-DD'),
        toDate: range.to.format('YYYY-MM-DD'),
      });
      return report?.trend || [];
    };

    loadTrend()
      .then((nextTrend) => {
        if (!ignore) setLocalTrend(nextTrend);
      })
      .catch(() => {
        // Keep showing the last-good trend if this granularity request fails.
      })
      .finally(() => {
        if (!ignore) setTrendLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [app, granularity, fromDate, toDate, customFrom, customTo]);

  if (loading && !localTrend) {
    const skeletonCount = trainingBreakdown || eLearningBreakdown || callComparison || callDirection ? 4 : 2;
    return (
      <Stack spacing={1.5}>
        <Typography variant="h6">Charts</Typography>
        <Grid container spacing={2}>
          {Array.from({ length: skeletonCount }, (_, key) => (
            <Grid key={key} size={{ xs: 12, md: 6 }}>
              <Skeleton variant="rounded" height={340} />
            </Grid>
          ))}
        </Grid>
      </Stack>
    );
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">Charts</Typography>

      <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
        <Select
          size="small"
          value={granularity}
          onChange={(e) => handleGranularityChange(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {TREND_REPORT_TYPES.map((option) => (
            <MenuItem key={option} value={option}>
              {option === CUSTOM ? 'Custom' : option}
            </MenuItem>
          ))}
        </Select>
        {granularity === CUSTOM && (
          <>
            <DatePicker
              label="From"
              format="DD/MM/YYYY"
              value={customFrom}
              onChange={setCustomFrom}
              maxDate={customTo ?? undefined}
              slotProps={{ textField: { size: 'small' } }}
            />
            <DatePicker
              label="To"
              format="DD/MM/YYYY"
              value={customTo}
              onChange={setCustomTo}
              minDate={customFrom ?? undefined}
              slotProps={{ textField: { size: 'small' } }}
            />
          </>
        )}
        {trendLoading && <CircularProgress size={18} />}
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <LoginTrendChart data={localTrend ?? []} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <ActiveUsersChart data={localTrend ?? []} />
        </Grid>
        {trainingBreakdown && (
          <Grid size={{ xs: 12, md: 6 }}>
            <TrainingCompletionChart data={trainingBreakdown} />
          </Grid>
        )}
        {eLearningBreakdown && (
          <Grid size={{ xs: 12, md: 6 }}>
            <ELearningProgressChart data={eLearningBreakdown} />
          </Grid>
        )}
        {callComparison && (
          <Grid size={{ xs: 12, md: 6 }}>
            <CallsComparisonChart data={callComparison} />
          </Grid>
        )}
        {callDirection && (
          <Grid size={{ xs: 12, md: 6 }}>
            <CallsDirectionChart data={callDirection} />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
