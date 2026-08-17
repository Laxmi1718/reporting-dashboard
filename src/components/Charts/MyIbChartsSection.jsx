import { useEffect, useState } from 'react';
import { Grid, Stack, Typography, Select, MenuItem, CircularProgress } from '@mui/material';
import LoginTrendChart from './LoginTrendChart';
import ActiveUsersChart from './ActiveUsersChart';
import MyIbServiceRequestsChart from './MyIbServiceRequestsChart';
import { fetchDashboardReport } from '../../services/api';
import { TREND_REPORT_TYPES, CHART_COLORS } from '../../utils/constants';

const DEFAULT_GRANULARITY = 'Monthly';
const MYIB_GRANULARITIES = TREND_REPORT_TYPES.filter((option) => option !== 'Custom Date Range');

const UTILIZATION_DEFS = [
  { field: 'ItsmTicketsCreated', label: 'ITSM Tickets Created', color: CHART_COLORS.blue },
  { field: 'TravelDeskRequestCreated', label: 'Travel Desk Requests', color: CHART_COLORS.orange },
  { field: 'MeetingRoomRequestCreated', label: 'Meeting Room Requests', color: CHART_COLORS.aqua },
  { field: 'GatePassRequestCreated', label: 'Gate Pass Requests', color: CHART_COLORS.violet },
  { field: 'CompanyCarRequestCreated', label: 'Company Car Requests', color: CHART_COLORS.green },
  { field: 'LeaveRequestCreated', label: 'Leave Requests', color: CHART_COLORS.red },
];

function buildTrendData(period) {
  if (!period || (period.totalLoginCount == null && period.activeUsers == null)) return null;
  return [{
    label: period.reportPeriod || 'Current',
    logins: Number(period.totalLoginCount) || 0,
    activeUsers: Number(period.activeUsers) || 0,
  }];
}

function buildServiceRequestsData(utilization) {
  if (!utilization) return null;
  const data = UTILIZATION_DEFS
    .filter(({ field }) => utilization[field] != null)
    .map(({ field, label, color }) => ({ label, value: Number(utilization[field]) || 0, color }));
  return data.length ? data : null;
}

export default function MyIbChartsSection({ toDate, reportType, currentPeriod, loading }) {
  const initialGranularity = MYIB_GRANULARITIES.includes(reportType) ? reportType : DEFAULT_GRANULARITY;
  const [granularity, setGranularity] = useState(initialGranularity);
  const [localPeriod, setLocalPeriod] = useState(currentPeriod ?? null);
  const [trendLoading, setTrendLoading] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocalPeriod(currentPeriod ?? null);
  }, [currentPeriod]);

  useEffect(() => {
    if (MYIB_GRANULARITIES.includes(reportType)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setGranularity(reportType);
    }
  }, [reportType]);

  useEffect(() => {
    if (!toDate) return undefined;

    let ignore = false;
    // load() sets loading state before its first await; this is the standard
    // fetch-on-dependency-change pattern, not an unintended cascade.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTrendLoading(true);

    fetchDashboardReport({ app: 'MyIB', reportType: granularity, fromDate: toDate, toDate })
      .then((report) => {
        if (!ignore) setLocalPeriod(report?.currentPeriod || null);
      })
      .catch(() => {
        // Keep showing the last-good period if this granularity request fails.
      })
      .finally(() => {
        if (!ignore) setTrendLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [granularity, toDate]);

  const trendData = buildTrendData(localPeriod);
  const serviceRequestsChartData = buildServiceRequestsData(localPeriod?.utilizationPerDay);

  if (loading && !localPeriod) {
    return (
      <Stack spacing={1.5}>
        <Typography variant="h6">Charts</Typography>
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
          onChange={(e) => setGranularity(e.target.value)}
          sx={{ minWidth: 140 }}
        >
          {MYIB_GRANULARITIES.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {trendLoading && <CircularProgress size={18} />}
      </Stack>

      <Grid container spacing={2}>
        {trendData && (
          <>
            <Grid size={{ xs: 12, md: 6 }}>
              <LoginTrendChart data={trendData} />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <ActiveUsersChart data={trendData} />
            </Grid>
          </>
        )}
        {serviceRequestsChartData && (
          <Grid size={{ xs: 12 }}>
            <MyIbServiceRequestsChart data={serviceRequestsChartData} />
          </Grid>
        )}
      </Grid>
    </Stack>
  );
}
