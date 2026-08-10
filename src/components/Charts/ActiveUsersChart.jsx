import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, CHART_INK } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

export default function ActiveUsersChart({ data }) {
  return (
    <ChartCard title="Active Users">
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={{ top: 28, right: 12, left: -12, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke={CHART_INK.grid} />
          <XAxis
            dataKey="label"
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
            cursor={{ fill: `${CHART_COLORS.aqua}14` }}
            contentStyle={{
              borderRadius: 10,
              border: `1px solid ${CHART_INK.grid}`,
              boxShadow: '0 4px 14px rgba(11,11,11,0.08)',
            }}
            labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
          />
          <Bar dataKey="activeUsers" name="Active Users" fill={`${CHART_COLORS.aqua}33`} radius={[4, 4, 0, 0]} maxBarSize={40} />
          <Line
            type="monotone"
            dataKey="activeUsers"
            name="Active Users"
            stroke={CHART_COLORS.aqua}
            strokeWidth={2}
            dot={{ r: 3, fill: CHART_COLORS.aqua, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          >
            <LabelList
              dataKey="activeUsers"
              position="top"
              formatter={formatNumber}
              style={{ fontSize: 11, fill: CHART_INK.secondary }}
            />
          </Line>
        </ComposedChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
