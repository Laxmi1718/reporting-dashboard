import { Grid, Typography, Stack } from '@mui/material';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import GroupsIcon from '@mui/icons-material/Groups';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import HourglassBottomIcon from '@mui/icons-material/HourglassBottom';
import KpiCard from '../SummaryCards/KpiCard';
import { CHART_COLORS } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

export default function ELearningSection({ eLearningSection, loading }) {
  const cards = [
    {
      label: 'Active Courses',
      value: eLearningSection ? formatNumber(eLearningSection.activeCourses) : '—',
      icon: <MenuBookIcon />,
      color: CHART_COLORS.blue,
    },
    {
      label: 'Assigned Users',
      value: eLearningSection ? formatNumber(eLearningSection.assignedUsers) : '—',
      icon: <GroupsIcon />,
      color: CHART_COLORS.orange,
    },
    {
      label: 'Completed Users',
      value: eLearningSection ? formatNumber(eLearningSection.completedUsers) : '—',
      icon: <DoneAllIcon />,
      color: CHART_COLORS.aqua,
    },
    {
      label: 'In Progress Users',
      value: eLearningSection ? formatNumber(eLearningSection.inProgressUsers) : '—',
      icon: <HourglassBottomIcon />,
      color: CHART_COLORS.yellow,
    },
  ];

  return (
    <Stack spacing={1.5}>
      <Typography variant="h6">E-Learning</Typography>
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
