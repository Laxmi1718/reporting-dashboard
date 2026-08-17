import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, CHART_INK } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

export default function CallsComparisonChart({ data }) {
  return (
    <ChartCard title="Calls: Current vs Previous Period">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 24, right: 12, left: -12, bottom: 0 }}>
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
            cursor={{ fill: `${CHART_COLORS.blue}14` }}
            contentStyle={{
              borderRadius: 10,
              border: `1px solid ${CHART_INK.grid}`,
              boxShadow: '0 4px 14px rgba(11,11,11,0.08)',
            }}
            labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="previous" name="Previous Period" fill={`${CHART_COLORS.orange}55`} radius={[4, 4, 0, 0]} maxBarSize={36}>
            <LabelList dataKey="previous" position="top" formatter={formatNumber} style={{ fontSize: 10, fill: CHART_INK.secondary }} />
          </Bar>
          <Bar dataKey="current" name="Current Period" fill={CHART_COLORS.blue} radius={[4, 4, 0, 0]} maxBarSize={36}>
            <LabelList dataKey="current" position="top" formatter={formatNumber} style={{ fontSize: 10, fill: CHART_INK.secondary }} />
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
