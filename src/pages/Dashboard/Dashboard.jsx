import { useEffect, useState } from 'react';
import {
  Container,
  Stack,
  Alert,
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Snackbar,
  Card,
  CardContent,
  Grid,
  TextField,
  MenuItem,
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import GroupIcon from '@mui/icons-material/Group';
import BarChartIcon from '@mui/icons-material/BarChart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CallIcon from '@mui/icons-material/Call';
import CallMadeIcon from '@mui/icons-material/CallMade';
import CallReceivedIcon from '@mui/icons-material/CallReceived';
import CallMissedIcon from '@mui/icons-material/CallMissed';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import FlightIcon from '@mui/icons-material/Flight';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import BadgeIcon from '@mui/icons-material/Badge';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import EventBusyIcon from '@mui/icons-material/EventBusy';
import FilterBar from '../../components/FilterBar/FilterBar';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import TrainingSection from '../../components/TrainingSection/TrainingSection';
import ELearningSection from '../../components/ELearningSection/ELearningSection';
import ChartsSection from '../../components/Charts/ChartsSection';
import ComparisonTable from '../../components/ComparisonTable/ComparisonTable';
import KpiCard from '../../components/SummaryCards/KpiCard';
import MyIbChartsSection from '../../components/Charts/MyIbChartsSection';
import useDashboardData from '../../hooks/useDashboardData';
import { getPresetRange } from '../../utils/reportRange';
import { deriveTrainingBreakdown, deriveELearningBreakdown } from '../../utils/breakdown';
import { isLive } from '../../services/appConfig';
import { exportDashboardReport } from '../../utils/exportExcel';
import { CHART_COLORS, CRM_MODULES } from '../../utils/constants';
import { formatDateTime, formatNumber, formatDMY, formatDecimal } from '../../utils/format';

const DEFAULT_REPORT_TYPE = 'Monthly';
const DEFAULT_RANGE = getPresetRange(DEFAULT_REPORT_TYPE);
const DEFAULT_FILTERS = {
  app: 'All',
  crmModule: 'All',
  reportType: DEFAULT_REPORT_TYPE,
  fromDate: DEFAULT_RANGE.from.format('YYYY-MM-DD'),
  toDate: DEFAULT_RANGE.to.format('YYYY-MM-DD'),
};

function asNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function getModuleReport(appReports, moduleName) {
  const targetName = String(moduleName ?? '').trim().toLowerCase();
  if (!targetName) return null;

  return (appReports || []).find((item) => {
    const itemName = String(item?.app ?? '').trim().toLowerCase();
    return itemName === targetName;
  }) || null;
}

function getDisplayValue(value) {
  if (value === null || value === undefined || value === '') return 'Data unavailable';
  return formatNumber(value);
}

function buildCallComparisonData(currentPeriod, previousPeriod) {
  if (!currentPeriod || currentPeriod.totalCalls == null) return null;
  const current = currentPeriod;
  const previous = previousPeriod || {};

  return [
    { label: 'Total Calls', current: Number(current.totalCalls ?? 0), previous: Number(previous.totalCalls ?? 0) },
    { label: 'Connected', current: Number(current.connectedCalls ?? 0), previous: Number(previous.connectedCalls ?? 0) },
    { label: 'Missed', current: Number(current.missedCalls ?? 0), previous: Number(previous.missedCalls ?? 0) },
    { label: 'Incoming', current: Number(current.totalIncomingCalls ?? 0), previous: Number(previous.totalIncomingCalls ?? 0) },
    { label: 'Outgoing', current: Number(current.totalOutgoingCalls ?? 0), previous: Number(previous.totalOutgoingCalls ?? 0) },
  ];
}

function buildCallDirectionData(currentPeriod) {
  if (!currentPeriod || currentPeriod.totalCalls == null) return null;

  return [
    {
      label: 'Incoming',
      connected: Number(currentPeriod.connectedIncomingCalls ?? 0),
      missed: Number(currentPeriod.missedIncomingCalls ?? 0),
    },
    {
      label: 'Outgoing',
      connected: Number(currentPeriod.connectedOutgoingCalls ?? 0),
      missed: Number(currentPeriod.missedOutgoingCalls ?? 0),
    },
  ];
}

const MYIB_UTILIZATION_DEFS = [
  { field: 'ItsmTicketsCreated', label: 'ITSM Tickets Created', icon: <ConfirmationNumberIcon />, color: CHART_COLORS.blue },
  { field: 'TravelDeskRequestCreated', label: 'Travel Desk Requests', icon: <FlightIcon />, color: CHART_COLORS.orange },
  { field: 'MeetingRoomRequestCreated', label: 'Meeting Room Requests', icon: <MeetingRoomIcon />, color: CHART_COLORS.aqua },
  { field: 'GatePassRequestCreated', label: 'Gate Pass Requests', icon: <BadgeIcon />, color: CHART_COLORS.violet },
  { field: 'CompanyCarRequestCreated', label: 'Company Car Requests', icon: <DirectionsCarIcon />, color: CHART_COLORS.green },
  { field: 'LeaveRequestCreated', label: 'Leave Requests', icon: <EventBusyIcon />, color: CHART_COLORS.red },
];

function buildMyIbSummaryCards(period) {
  if (!period) return [];
  const cards = [];

  if (period.totalLoginCount != null) {
    cards.push({ label: 'Total Login Count', value: formatNumber(period.totalLoginCount), icon: <BarChartIcon />, color: CHART_COLORS.orange });
  }
  if (period.activeUsers != null) {
    cards.push({ label: 'Active Users', value: formatNumber(period.activeUsers), icon: <GroupIcon />, color: CHART_COLORS.aqua });
  }
  if (period.lastLoginCount != null) {
    cards.push({ label: 'Last Login Count', value: formatNumber(period.lastLoginCount), icon: <PeopleAltIcon />, color: CHART_COLORS.blue });
  }
  if (period.averageActiveUsersPerDay != null) {
    cards.push({ label: 'Average Active Users / Day', value: formatNumber(period.averageActiveUsersPerDay), icon: <TrendingUpIcon />, color: CHART_COLORS.violet });
  }
  if (period.loginAverage != null) {
    cards.push({ label: 'Login Average', value: formatDecimal(period.loginAverage, 2), icon: <TrendingUpIcon />, color: CHART_COLORS.green });
  }

  return cards;
}

function buildMyIbUtilizationCards(utilization) {
  if (!utilization) return [];
  return MYIB_UTILIZATION_DEFS
    .filter(({ field }) => utilization[field] != null)
    .map(({ field, label, icon, color }) => ({ label, value: formatNumber(utilization[field]), icon, color }));
}

const CALL_CARD_DEFS = [
  { field: 'totalCalls', label: 'Total Calls', icon: <CallIcon />, color: CHART_COLORS.magenta },
  { field: 'totalIncomingCalls', label: 'Total Incoming Calls', icon: <CallReceivedIcon />, color: CHART_COLORS.blue },
  { field: 'totalOutgoingCalls', label: 'Total Outgoing Calls', icon: <CallMadeIcon />, color: CHART_COLORS.orange },
  { field: 'connectedCalls', label: 'Connected Calls', icon: <CallIcon />, color: CHART_COLORS.green },
  { field: 'missedCalls', label: 'Missed Calls', icon: <CallMissedIcon />, color: CHART_COLORS.red },
  { field: 'connectedIncomingCalls', label: 'Connected Incoming Calls', icon: <CallReceivedIcon />, color: CHART_COLORS.aqua },
  { field: 'missedIncomingCalls', label: 'Missed Incoming Calls', icon: <CallMissedIcon />, color: CHART_COLORS.red },
  { field: 'connectedOutgoingCalls', label: 'Connected Outgoing Calls', icon: <CallMadeIcon />, color: CHART_COLORS.violet },
  { field: 'missedOutgoingCalls', label: 'Missed Outgoing Calls', icon: <CallMissedIcon />, color: CHART_COLORS.red },
];

function buildCrmCards(period) {
  if (!period) return [];
  const cards = [];

  const totalUsers = period.totalUsers ?? period.totalEmployees;
  if (totalUsers != null) {
    cards.push({ label: 'Total Users', value: formatNumber(totalUsers), icon: <PeopleAltIcon />, color: CHART_COLORS.blue });
  }

  const uniqueUsers = period.uniqueUsers ?? period.activeUsers ?? period.totalActiveEmployees;
  if (uniqueUsers != null) {
    cards.push({ label: 'Unique Users', value: formatNumber(uniqueUsers), icon: <GroupIcon />, color: CHART_COLORS.aqua });
  }

  const totalLogins = period.totalLogins ?? period.totalLogin;
  if (totalLogins != null) {
    cards.push({ label: 'Total Logins', value: formatNumber(totalLogins), icon: <BarChartIcon />, color: CHART_COLORS.orange });
  }

  if (period.totalEmployees != null) {
    cards.push({ label: 'Total Employees', value: formatNumber(period.totalEmployees), icon: <PeopleAltIcon />, color: CHART_COLORS.blue });
  }

  if (period.totalActiveEmployees != null) {
    cards.push({ label: 'Active Employees', value: formatNumber(period.totalActiveEmployees), icon: <GroupIcon />, color: CHART_COLORS.aqua });
  }

  if (period.totalInactiveEmployees != null) {
    cards.push({ label: 'Inactive Employees', value: formatNumber(period.totalInactiveEmployees), icon: <GroupIcon />, color: CHART_COLORS.red });
  }

  const averageActiveUsersPerDay = period.averageActiveUsersPerDay ?? period.avgActiveUsersPerDay;
  if (averageActiveUsersPerDay != null) {
    cards.push({ label: 'Average Active Users / Day', value: formatNumber(averageActiveUsersPerDay), icon: <TrendingUpIcon />, color: CHART_COLORS.violet });
  }

  const loginAverage = period.loginAveragePerUser ?? period.loginAverage;
  if (loginAverage != null) {
    cards.push({ label: 'Login Average Per User', value: formatNumber(loginAverage), icon: <TrendingUpIcon />, color: CHART_COLORS.green });
  }

  if (period.lastLogin) {
    cards.push({ label: 'Last Login', value: formatDateTime(period.lastLogin), icon: <BarChartIcon />, color: CHART_COLORS.yellow });
  }

  const utilization = period.utilizationPerDay ?? period.utilization;
  if (utilization != null) {
    cards.push({ label: 'Utilization', value: formatNumber(utilization), icon: <TrendingUpIcon />, color: CHART_COLORS.magenta });
  }

  if (period.totalCalls != null) {
    CALL_CARD_DEFS.forEach(({ field, label, icon, color }) => {
      cards.push({ label, value: formatNumber(period[field]), icon, color });
    });
  }

  return cards;
}

function CRMModuleSummaryCards({ crmData, loading }) {
  const overall = crmData?.currentPeriod || crmData?.overall || {};
  const cards = buildCrmCards(overall);

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">Overall CRM Report</Typography>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
            <KpiCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}

export default function Dashboard({ onLogout }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [selectedModule, setSelectedModule] = useState('');
  const { data, loading, error } = useDashboardData(filters);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (filters.app !== 'CRM') {
      setSelectedModule('');
      return;
    }

    if (filters.crmModule === 'All') {
      setSelectedModule('');
      return;
    }

    setSelectedModule(filters.crmModule);
  }, [filters.app, filters.crmModule]);

  const trainingSessions = data?.currentPeriod?.trainingSessions;
  const eLearning = data?.currentPeriod?.eLearning;
  const expectsLiveExtras = isLive(filters.app);
  const isAll = filters.app === 'All';
  const isCRM = filters.app === 'CRM';
  const isMyIB = filters.app === 'MyIB';
  const crmData = isCRM ? (data?.crm || data) : null;
  const appReports = crmData?.appReports || [];
  const moduleNames = ['Parivartan', 'Abis Pro (CRM)', 'Traders CRM', 'Chicks CRM', 'Doctor CRM'];
  const activeModuleReport = moduleNames
    .map((name) => getModuleReport(appReports, name))
    .find((report) => report?.app && report.app === selectedModule) || getModuleReport(appReports, selectedModule) || (
      isCRM && selectedModule && appReports.length === 0 && crmData
        ? {
            app: selectedModule,
            currentPeriod: crmData.currentPeriod || {},
            previousPeriod: crmData.previousPeriod || {},
            dailyData: crmData.dailyData || [],
            raw: crmData,
          }
        : null
    );

  const handleExport = async () => {
    setExporting(true);
    try {
      await exportDashboardReport({ data, filters });
      setSnackbar({ open: true, message: 'Report exported to Excel', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message || 'Export failed', severity: 'error' });
    } finally {
      setExporting(false);
    }
  };

  const renderAllEmptyState = () => (
    <Box
      sx={{
        border: '1px dashed',
        borderColor: 'divider',
        borderRadius: 3,
        backgroundColor: 'rgba(148, 163, 184, 0.06)',
        p: 4,
        textAlign: 'center',
      }}
    >
      <Typography variant="h6" sx={{ mb: 1, color: 'text.primary' }}>
        No data selected
      </Typography>
      <Typography variant="body1" color="text.secondary">
        Select a specific application to view its report.
      </Typography>
    </Box>
  );

  const renderCRMOverview = () => (
    <Stack spacing={2}>
      <CRMModuleSummaryCards crmData={crmData} loading={loading} />
    </Stack>
  );

  const renderMyIB = () => {
    const period = data?.currentPeriod || {};
    const summaryCards = buildMyIbSummaryCards(period);
    const utilizationCards = buildMyIbUtilizationCards(period.utilizationPerDay);

    return (
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="h6">MyIB Dashboard</Typography>
          {period.reportPeriod && (
            <Typography variant="body2" color="text.secondary">
              Report Date: {period.reportPeriod} ({period.period || filters.reportType})
            </Typography>
          )}
        </Stack>

        <Grid container spacing={2}>
          {summaryCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard {...card} loading={loading} />
            </Grid>
          ))}
        </Grid>

        {(utilizationCards.length > 0 || loading) && (
          <Stack spacing={1.5}>
            <Typography variant="h6">Service Requests</Typography>
            <Grid container spacing={2}>
              {utilizationCards.map((card) => (
                <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
                  <KpiCard {...card} loading={loading} />
                </Grid>
              ))}
            </Grid>
          </Stack>
        )}

        <MyIbChartsSection toDate={filters.toDate} reportType={filters.reportType} currentPeriod={data?.currentPeriod} loading={loading} />
      </Stack>
    );
  };

  const selectedModuleCurrentPeriod = activeModuleReport?.currentPeriod
    ? {
        ...activeModuleReport.currentPeriod,
        reportPeriod: activeModuleReport.currentPeriod.dateRange
          ? `${activeModuleReport.currentPeriod.dateRange.from} - ${activeModuleReport.currentPeriod.dateRange.to}`
          : activeModuleReport.currentPeriod.reportPeriod || 'Current Period',
      }
    : null;

  const selectedModulePreviousPeriod = activeModuleReport?.previousPeriod
    ? {
        ...activeModuleReport.previousPeriod,
        reportPeriod: activeModuleReport.previousPeriod.dateRange
          ? `${activeModuleReport.previousPeriod.dateRange.from} - ${activeModuleReport.previousPeriod.dateRange.to}`
          : activeModuleReport.previousPeriod.reportPeriod || 'Previous Period',
      }
    : null;

  const selectedModuleTrend = (() => {
    if (Array.isArray(activeModuleReport?.dailyData) && activeModuleReport.dailyData.length) {
      return activeModuleReport.dailyData.map((entry) => ({
        ...entry,
        label: entry.label || entry.date || 'N/A',
        logins: Number(entry.logins ?? entry.totalLogins ?? entry.loginCount ?? 0),
        activeUsers: Number(entry.activeUsers ?? entry.uniqueUsers ?? 0),
      }));
    }

    const current = activeModuleReport?.currentPeriod || {};
    const previous = activeModuleReport?.previousPeriod || {};

    const currentLabel = current.dateRange
      ? `${current.dateRange.from} - ${current.dateRange.to}`
      : 'Current';
    const previousLabel = previous.dateRange
      ? `${previous.dateRange.from} - ${previous.dateRange.to}`
      : 'Previous';

    return [
      {
        label: previousLabel,
        logins: Number(previous.totalLogins ?? previous.totalLogin ?? 0),
        activeUsers: Number(previous.activeUsers ?? previous.uniqueUsers ?? 0),
      },
      {
        label: currentLabel,
        logins: Number(current.totalLogins ?? current.totalLogin ?? 0),
        activeUsers: Number(current.activeUsers ?? current.uniqueUsers ?? 0),
      },
    ];
  })();

  const selectedModuleCallComparison = buildCallComparisonData(selectedModuleCurrentPeriod, selectedModulePreviousPeriod);
  const selectedModuleCallDirection = buildCallDirectionData(selectedModuleCurrentPeriod);
  const overviewCallComparison = buildCallComparisonData(data?.currentPeriod, data?.previousPeriod);
  const overviewCallDirection = buildCallDirectionData(data?.currentPeriod);

  const renderCRMDetail = () => {
    const current = activeModuleReport?.currentPeriod || {};
    const moduleCards = buildCrmCards(current);

    return (
      <Stack spacing={2}>
        <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
          <Button variant="outlined" startIcon={<ArrowBackIcon />} onClick={() => setSelectedModule('')}>
            Back
          </Button>
          <Typography variant="h6">{selectedModule} Report</Typography>
        </Stack>

        {activeModuleReport?.unavailable && (
          <Alert severity="warning">
            Could not fetch live data for {selectedModule} in the selected date range. The numbers below may be incomplete — try Refresh, or narrow the date range and try again.
          </Alert>
        )}

        <Grid container spacing={2}>
          {moduleCards.map((card) => (
            <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3 }}>
              <KpiCard {...card} loading={loading} />
            </Grid>
          ))}
        </Grid>

        <ChartsSection
          app={filters.app}
          fromDate={filters.fromDate}
          toDate={filters.toDate}
          trend={selectedModuleTrend}
          callComparison={selectedModuleCallComparison}
          callDirection={selectedModuleCallDirection}
          loading={loading}
        />

        <ComparisonTable
          currentPeriod={selectedModuleCurrentPeriod}
          previousPeriod={selectedModulePreviousPeriod}
          loading={loading}
        />

        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
          Date Range: {formatDMY(new Date(filters.fromDate))} - {formatDMY(new Date(filters.toDate))}
        </Typography>
      </Stack>
    );
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ justifyContent: 'space-between' }}>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: 'center' }}>
            <InsightsIcon />
            <Typography variant="h6" fontWeight={700}>
              Reporting Dashboard
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={handleExport}
              disabled={exporting || loading || !data}
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.6)',
                '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.12)' },
              }}
            >
              {exporting ? 'Exporting…' : 'Export Excel'}
            </Button>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={onLogout}
              sx={{
                color: '#ffffff',
                borderColor: 'rgba(255,255,255,0.6)',
                '&:hover': { borderColor: '#ffffff', backgroundColor: 'rgba(255,255,255,0.12)' },
              }}
            >
              Logout
            </Button>
          </Stack>
        </Toolbar>
      </AppBar>

      <Container maxWidth="xl" sx={{ py: 3 }}>
        <Stack spacing={3}>
          <FilterBar onApply={setFilters} />

          {isCRM && (
            <Card sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
              <CardContent sx={{ py: 2.5, '&:last-child': { pb: 2.5 } }}>
                <Grid container spacing={2} sx={{ alignItems: 'center' }}>
                  <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
                    <TextField
                      select
                      fullWidth
                      label="CRM Module"
                      value={filters.crmModule || 'All'}
                      onChange={(event) =>
                        setFilters((prev) => ({ ...prev, crmModule: event.target.value }))
                      }
                    >
                      {CRM_MODULES.map((option) => (
                        <MenuItem key={option} value={option}>
                          {option}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          )}

          {error && <Alert severity="error">{error}</Alert>}

          {isAll && renderAllEmptyState()}

          {!isCRM && !isAll && !isMyIB && (
            <>
              <SummaryCards currentPeriod={data?.currentPeriod} loading={loading} expectsNewLogins={expectsLiveExtras} />
              {(trainingSessions || (loading && expectsLiveExtras)) && (
                <TrainingSection training={trainingSessions} loading={loading} />
              )}
              {(eLearning || (loading && expectsLiveExtras)) && (
                <ELearningSection eLearningSection={eLearning} loading={loading} />
              )}
              <ChartsSection
                app={filters.app}
                fromDate={filters.fromDate}
                toDate={filters.toDate}
                trend={data?.trend}
                trainingBreakdown={deriveTrainingBreakdown(trainingSessions)}
                eLearningBreakdown={deriveELearningBreakdown(eLearning)}
                loading={loading}
              />
              <ComparisonTable
                currentPeriod={data?.currentPeriod}
                previousPeriod={data?.previousPeriod}
                loading={loading}
              />
            </>
          )}

          {isCRM && (
            selectedModule ? renderCRMDetail() : (
              <>
                {renderCRMOverview()}
                <ChartsSection
                  app={filters.app}
                  fromDate={filters.fromDate}
                  toDate={filters.toDate}
                  trend={data?.trend}
                  callComparison={overviewCallComparison}
                  callDirection={overviewCallDirection}
                  loading={loading}
                />
                <ComparisonTable
                  currentPeriod={data?.currentPeriod}
                  previousPeriod={data?.previousPeriod}
                  loading={loading}
                />
                <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'right' }}>
                  Date Range: {formatDMY(new Date(filters.fromDate))} - {formatDMY(new Date(filters.toDate))}
                </Typography>
              </>
            )
          )}

          {isMyIB && renderMyIB()}
        </Stack>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3500}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
