import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  LabelList,
} from 'recharts';
import ChartCard from './ChartCard';
import { CHART_COLORS, CHART_INK } from '../../utils/constants';
import { formatNumber } from '../../utils/format';

export default function LoginTrendChart({ data }) {
  return (
    <ChartCard title="Login Trend">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 24, right: 12, left: -12, bottom: 0 }}>
          <defs>
            <linearGradient id="loginTrendFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={CHART_COLORS.blue} stopOpacity={0.28} />
              <stop offset="100%" stopColor={CHART_COLORS.blue} stopOpacity={0.02} />
            </linearGradient>
          </defs>
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
            cursor={{ stroke: CHART_INK.baseline, strokeWidth: 1 }}
            contentStyle={{
              borderRadius: 10,
              border: `1px solid ${CHART_INK.grid}`,
              boxShadow: '0 4px 14px rgba(11,11,11,0.08)',
            }}
            labelStyle={{ color: CHART_INK.primary, fontWeight: 600 }}
          />
          <Area
            type="monotone"
            dataKey="logins"
            name="Logins"
            stroke={CHART_COLORS.blue}
            strokeWidth={2}
            fill="url(#loginTrendFill)"
            dot={{ r: 3, fill: CHART_COLORS.blue, strokeWidth: 0 }}
            activeDot={{ r: 5 }}
          >
            <LabelList
              dataKey="logins"
              position="top"
              formatter={formatNumber}
              style={{ fontSize: 11, fill: CHART_INK.secondary }}
            />
          </Area>
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
