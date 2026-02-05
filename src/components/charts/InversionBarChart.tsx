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
import { CHART_MARGIN, AXIS_TICK_STYLE, GRID_STYLE } from './shared';
import type { InversionDataPoint } from '../../data/coasters.types';

interface InversionBarChartProps {
  data: InversionDataPoint[];
}

function InversionBarChartComponent({ data }: InversionBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={CHART_MARGIN}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis
          dataKey="name"
          tick={{ ...AXIS_TICK_STYLE, fontSize: 10, fontWeight: 600 }}
          angle={-20}
          textAnchor="end"
        />
        <YAxis
          tick={AXIS_TICK_STYLE}
          axisLine={false}
          tickLine={false}
          allowDecimals={false}
        />
        <Tooltip content={<DarkTooltip formatter={(v) => `${v} inversions`} />} />
        <Bar dataKey="inversions" radius={[6, 6, 0, 0]} animationDuration={1200} barSize={40}>
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export const InversionBarChart = memo(InversionBarChartComponent);
export default InversionBarChart;
