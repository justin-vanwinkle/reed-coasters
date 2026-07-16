import { memo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { DarkTooltip } from '../ui/Tooltip';
import { CHART_MARGIN, AXIS_TICK_STYLE, GRID_STYLE, CHART_COLORS, BAR_RADIUS } from './shared';
import type { DecadeDataPoint } from '../../data/coasters.types';

interface DecadeBarChartProps {
  data: DecadeDataPoint[];
}

function DecadeBarChartComponent({ data }: DecadeBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={180}>
      <BarChart data={data} margin={{ ...CHART_MARGIN, left: 20, right: 20 }}>
        <CartesianGrid {...GRID_STYLE} vertical={false} />
        <XAxis
          dataKey="name"
          tick={{ ...AXIS_TICK_STYLE, fontSize: 11, fontWeight: 600 }}
        />
        <YAxis
          tick={AXIS_TICK_STYLE}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<DarkTooltip formatter={(v) => `${v} coasters`} />} />
        <Bar dataKey="count" radius={BAR_RADIUS} animationDuration={1200}>
          {data.map((_, i) => (
            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export const DecadeBarChart = memo(DecadeBarChartComponent);
export default DecadeBarChart;
