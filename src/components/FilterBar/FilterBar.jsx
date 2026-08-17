import { useState } from 'react';
import {
  Card,
  CardContent,
  Stack,
  MenuItem,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import RefreshIcon from '@mui/icons-material/Autorenew';
import CheckIcon from '@mui/icons-material/Check';
import dayjs from 'dayjs';
import { APPLICATIONS, CRM_MODULES, REPORT_TYPES } from '../../utils/constants';
import { getPresetRange } from '../../utils/reportRange';

const DEFAULT_APP = APPLICATIONS[0];
const DEFAULT_REPORT_TYPE = 'Monthly';
const DATE_FORMAT = 'DD/MM/YYYY';

export default function FilterBar({ onApply }) {
  const [app, setApp] = useState(DEFAULT_APP);
  const [reportType, setReportType] = useState(DEFAULT_REPORT_TYPE);
  const initialRange = getPresetRange(DEFAULT_REPORT_TYPE);
  const [fromDate, setFromDate] = useState(initialRange.from);
  const [toDate, setToDate] = useState(initialRange.to);

  const buildFilters = (overrides = {}) => ({
    app,
    reportType,
    fromDate: fromDate?.format('YYYY-MM-DD'),
    toDate: toDate?.format('YYYY-MM-DD'),
    ...overrides,
  });

  const handleReportTypeChange = (value) => {
    setReportType(value);
    const preset = getPresetRange(value);
    if (preset) {
      setFromDate(preset.from);
      setToDate(preset.to);
    }
  };

  const handleApply = () => {
    onApply(buildFilters());
  };

  const handleRefresh = () => {
    const today = dayjs();
    setReportType('Daily');
    setFromDate(today);
    setToDate(today);
    onApply({
      app,
      reportType: 'Daily',
      fromDate: today.format('YYYY-MM-DD'),
      toDate: today.format('YYYY-MM-DD'),
    });
  };

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} sx={{ alignItems: 'center' }}>
          <Grid size={{ xs: 12, sm: 6, md: 2 }}>
            <TextField
              select
              fullWidth
              label="Application"
              value={app}
              onChange={(e) => setApp(e.target.value)}
            >
              {APPLICATIONS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <TextField
              select
              fullWidth
              label="Report Type"
              value={reportType}
              onChange={(e) => handleReportTypeChange(e.target.value)}
            >
              {REPORT_TYPES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <DatePicker
              label="From Date"
              format={DATE_FORMAT}
              value={fromDate}
              onChange={setFromDate}
              maxDate={toDate ?? undefined}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 6, md: 2.5 }}>
            <DatePicker
              label="To Date"
              format={DATE_FORMAT}
              value={toDate}
              onChange={setToDate}
              minDate={fromDate ?? undefined}
              maxDate={dayjs()}
              slotProps={{ textField: { fullWidth: true } }}
            />
          </Grid>

          <Grid size={{ xs: 12, md: 2.5 }}>
            <Stack direction="row" spacing={1.5} sx={{ justifyContent: { md: 'flex-end' } }}>
              <Button
                variant="outlined"
                color="inherit"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
              >
                Refresh
              </Button>
              <Button variant="contained" startIcon={<CheckIcon />} onClick={handleApply}>
                Apply
              </Button>
            </Stack>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
}
