import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from 'recharts';
import { Box, Stack, Typography } from '@mui/material';
import ChartCard from './ChartCard';
import { STATUS_COLORS, CHART_INK } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

const LIGHT_RED = '#f0797a';

const SLICE_COLORS = {
  Completed: STATUS_COLORS.good,
  'In Progress': STATUS_COLORS.warning,
  'Not Started': LIGHT_RED,
  'Not Completed': LIGHT_RED,
};

const RADIAN = Math.PI / 180;

function renderValueLabel({ cx, cy, midAngle, innerRadius, outerRadius, value }) {
  if (!value) return null;
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize={11} fontWeight={700}>
      {formatNumber(value)}
    </text>
  );
}

export default function StatusPie({ title, data, donut = false }) {
  const total = data.reduce((sum, entry) => sum + entry.value, 0);

  return (
    <ChartCard title={title}>
      <Box sx={{ display: 'flex', alignItems: 'center', height: '100%', gap: 2 }}>
        <Box sx={{ position: 'relative', flex: '0 0 60%', height: '100%' }}>
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={donut ? '62%' : 0}
                outerRadius="85%"
                paddingAngle={2}
                stroke={CHART_INK.surface}
                strokeWidth={2}
                label={renderValueLabel}
                labelLine={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={SLICE_COLORS[entry.name] ?? CHART_INK.muted} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: `1px solid ${CHART_INK.grid}`,
                  boxShadow: '0 4px 14px rgba(11,11,11,0.08)',
                }}
                labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
              />
            </PieChart>
          </ResponsiveContainer>
          {donut && (
            <Box
              sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                textAlign: 'center',
                pointerEvents: 'none',
              }}
            >
              <Typography variant="h5" fontWeight={700} sx={{ color: CHART_INK.primary }}>
                {formatNumber(total)}
              </Typography>
              <Typography variant="caption" sx={{ color: CHART_INK.muted }}>
                Total Users
              </Typography>
            </Box>
          )}
        </Box>
        <Stack spacing={1.5} sx={{ flex: 1, minWidth: 0 }}>
          {data.map((entry) => (
            <Stack key={entry.name} direction="row" spacing={1} sx={{ alignItems: 'center' }}>
              <Box
                sx={{
                  width: 10,
                  height: 10,
                  borderRadius: '50%',
                  backgroundColor: SLICE_COLORS[entry.name] ?? CHART_INK.muted,
                  flexShrink: 0,
                }}
              />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={600} noWrap>
                  {entry.name}
                </Typography>
                <Typography variant="caption" sx={{ color: CHART_INK.muted }}>
                  {formatNumber(entry.value)} ({total ? ((entry.value / total) * 100).toFixed(1) : '0.0'}%)
                </Typography>
              </Box>
            </Stack>
          ))}
        </Stack>
      </Box>
    </ChartCard>
  );
}
