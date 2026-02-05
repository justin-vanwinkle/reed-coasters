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
import type { SpeedDataPoint } from '../../data/coasters.types';

interface SpeedBarChartProps {
  data: SpeedDataPoint[];
  limit?: number;
}

function SpeedBarChartComponent({ data, limit = 15 }: SpeedBarChartProps) {
  const displayData = data.slice(0, limit);

  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={displayData} layout="vertical" margin={{ ...CHART_MARGIN, left: 5 }}>
        <CartesianGrid {...GRID_STYLE} horizontal={false} />
        <XAxis type="number" tick={AXIS_TICK_STYLE} unit=" mph" />
        <YAxis
          type="category"
          dataKey="name"
          tick={{ ...AXIS_TICK_STYLE, fontSize: 10, fontWeight: 600 }}
          width={130}
        />
        <Tooltip content={<DarkTooltip formatter={(v) => `${v} mph`} />} />
        <Bar dataKey="speed" radius={[0, 4, 4, 0]} animationDuration={1200} barSize={16}>
          {displayData.map((d, i) => (
            <Cell key={i} fill={d.fill} fillOpacity={0.85} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export const SpeedBarChart = memo(SpeedBarChartComponent);
export default SpeedBarChart;
