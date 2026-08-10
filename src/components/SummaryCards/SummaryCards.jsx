import { Grid, Typography, Stack } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import BarChartIcon from '@mui/icons-material/BarChart';
import GroupIcon from '@mui/icons-material/Group';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import KpiCard from './KpiCard';
import { CHART_COLORS } from '../../utils/constants';
import { formatDateTime, formatNumber } from '../../utils/format';

export default function SummaryCards({ currentPeriod, loading, expectsNewLogins }) {
  const cards = [
    {
      label: 'Last Login',
      value: currentPeriod ? formatDateTime(currentPeriod.lastLogin) : '—',
      icon: <LoginIcon />,
      color: CHART_COLORS.blue,
    },
    {
      label: 'Total Login',
      value: currentPeriod ? formatNumber(currentPeriod.totalLogin) : '—',
      icon: <BarChartIcon />,
      color: CHART_COLORS.orange,
    },
    {
      label: 'Active Users',
      value: currentPeriod ? formatNumber(currentPeriod.activeUsers) : '—',
      icon: <GroupIcon />,
      color: CHART_COLORS.aqua,
    },
    {
      label: 'Avg Active Users / Day',
      value: currentPeriod ? formatNumber(currentPeriod.averageActiveUsersPerDay) : '—',
      icon: <TrendingUpIcon />,
      color: CHART_COLORS.violet,
    },
  ];

  // Only apps whose API reports a daily new-login series get this card
  // (LMS today) - same data-driven pattern as Training/E-Learning. While
  // loading, fall back to the live-app expectation so the card doesn't pop
  // in after the fact and shift the grid.
  if (currentPeriod?.newLogins !== undefined || (loading && expectsNewLogins)) {
    cards.push({
      label: 'Unique Logins',
      value: currentPeriod ? formatNumber(currentPeriod.newLogins) : '—',
      icon: <PersonAddIcon />,
      color: CHART_COLORS.green,
    });
  }

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">Dashboard Summary</Typography>
      <Grid container spacing={2}>
        {cards.map((card) => (
          <Grid key={card.label} size={{ xs: 12, sm: 6, md: 3, lg: 2 }}>
            <KpiCard {...card} loading={loading} />
          </Grid>
        ))}
      </Grid>
    </Stack>
  );
}
