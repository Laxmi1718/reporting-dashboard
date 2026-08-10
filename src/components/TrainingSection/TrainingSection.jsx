import { Grid, Typography, Stack } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import GroupsIcon from '@mui/icons-material/Groups';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import KpiCard from '../SummaryCards/KpiCard';
import { CHART_COLORS } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

export default function TrainingSection({ training, loading }) {
  const cards = [
    {
      label: 'Trainings Created',
      value: training ? formatNumber(training.created) : '—',
      icon: <SchoolIcon />,
      color: CHART_COLORS.blue,
    },
    {
      label: 'Trainings Completed',
      value: training ? formatNumber(training.completed) : '—',
      icon: <TaskAltIcon />,
      color: CHART_COLORS.aqua,
    },
    {
      label: 'Assigned Users',
      value: training ? formatNumber(training.assignedUsers) : '—',
      icon: <GroupsIcon />,
      color: CHART_COLORS.orange,
    },
    {
      label: 'Completed Users',
      value: training ? formatNumber(training.completedUsers) : '—',
      icon: <DoneAllIcon />,
      color: CHART_COLORS.violet,
    },
  ];

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">Training</Typography>
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
