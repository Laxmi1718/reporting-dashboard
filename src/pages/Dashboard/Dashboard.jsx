import { useState } from 'react';
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
} from '@mui/material';
import InsightsIcon from '@mui/icons-material/Insights';
import DownloadIcon from '@mui/icons-material/Download';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterBar from '../../components/FilterBar/FilterBar';
import SummaryCards from '../../components/SummaryCards/SummaryCards';
import TrainingSection from '../../components/TrainingSection/TrainingSection';
import ELearningSection from '../../components/ELearningSection/ELearningSection';
import ChartsSection from '../../components/Charts/ChartsSection';
import ComparisonTable from '../../components/ComparisonTable/ComparisonTable';
import useDashboardData from '../../hooks/useDashboardData';
import { getPresetRange } from '../../utils/reportRange';
import { deriveTrainingBreakdown, deriveELearningBreakdown } from '../../utils/breakdown';
import { isLive } from '../../services/appConfig';
import { exportDashboardReport } from '../../utils/exportExcel';

const DEFAULT_REPORT_TYPE = 'Monthly';
const DEFAULT_RANGE = getPresetRange(DEFAULT_REPORT_TYPE);
const DEFAULT_FILTERS = {
  app: 'CRM',
  reportType: DEFAULT_REPORT_TYPE,
  fromDate: DEFAULT_RANGE.from.format('YYYY-MM-DD'),
  toDate: DEFAULT_RANGE.to.format('YYYY-MM-DD'),
};

export default function Dashboard({ onLogout }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, loading, error } = useDashboardData(filters);
  const [exporting, setExporting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Training/e-learning only exist for apps whose API actually reports them
  // (LMS today) - branch on the data shape, not on the app name, so a new
  // app automatically gets these sections the moment its API includes them.
  const trainingSessions = data?.currentPeriod?.trainingSessions;
  const eLearning = data?.currentPeriod?.eLearning;
  // Only the live-wired apps' contract is known to include these sections,
  // so that's what we show a loading skeleton for - avoids a flash of empty
  // Training/E-Learning cards for apps that will never report them.
  const expectsLiveExtras = isLive(filters.app);

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

          {error && <Alert severity="error">{error}</Alert>}

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
