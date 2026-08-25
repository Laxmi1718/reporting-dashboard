import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import { Grid, Card, CardContent, Box, Stack, Typography } from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import GroupIcon from '@mui/icons-material/Group';
import { CHART_COLORS, CHART_INK } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

function ModuleBarChart({ title, subtitle, data, color, icon }) {
  return (
    <Card sx={{ height: '100%', borderRadius: 3, boxShadow: '0 1px 3px rgba(11,11,11,0.06)' }}>
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'flex-start', justifyContent: 'space-between', mb: 2.5 }}>
          <Box>
            <Typography variant="h6" fontWeight={700}>{title}</Typography>
            <Typography variant="body2" color="text.secondary">{subtitle}</Typography>
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: `${color}1f`,
              color,
              flexShrink: 0,
              '& svg': { fontSize: 24 },
            }}
          >
            {icon}
          </Box>
        </Stack>

        <Box sx={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 24, right: 12, left: -12, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="4 4" stroke={CHART_INK.grid} />
              <XAxis
                dataKey="name"
                tick={{ fill: CHART_INK.muted, fontSize: 12 }}
                axisLine={{ stroke: CHART_INK.baseline }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: CHART_INK.muted, fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                cursor={{ fill: `${color}14` }}
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${CHART_INK.grid}`,
                  boxShadow: '0 4px 14px rgba(11,11,11,0.08)',
                }}
                labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
              />
              <Bar dataKey="value" fill={color} radius={[4, 4, 0, 0]} maxBarSize={48}>
                <LabelList dataKey="value" position="top" formatter={formatNumber} style={{ fontSize: 12, fontWeight: 600, fill: color }} />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function CrmModuleComparisonCharts({ moduleTotals }) {
  const loginsData = (moduleTotals || [])
    .filter((m) => m.totalLogins != null)
    .map((m) => ({ name: m.name, value: m.totalLogins }));

  const activeUsersData = (moduleTotals || [])
    .filter((m) => m.uniqueUsers != null)
    .map((m) => ({ name: m.name, value: m.uniqueUsers }));

  if (!loginsData.length && !activeUsersData.length) return null;

  return (
    <Grid container spacing={2}>
      {loginsData.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <ModuleBarChart
            title="Total Logins by Module"
            subtitle="Total number of logins across modules"
            data={loginsData}
            color={CHART_COLORS.blueLight}
            icon={<LoginIcon />}
          />
        </Grid>
      )}
      {activeUsersData.length > 0 && (
        <Grid size={{ xs: 12, md: 6 }}>
          <ModuleBarChart
            title="Active Users by Module"
            subtitle="Total active users across modules"
            data={activeUsersData}
            color={CHART_COLORS.aquaLight}
            icon={<GroupIcon />}
          />
        </Grid>
      )}
    </Grid>
  );
}
