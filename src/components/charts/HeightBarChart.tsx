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
import { CHART_MARGIN_WITH_LABELS, AXIS_TICK_STYLE, GRID_STYLE } from './shared';
import type { HeightDataPoint } from '../../data/coasters.types';

interface HeightBarChartProps {
  data: HeightDataPoint[];
}

function HeightBarChartComponent({ data }: HeightBarChartProps) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: 700, height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={CHART_MARGIN_WITH_LABELS}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis
              dataKey="name"
              tick={{ ...AXIS_TICK_STYLE, fontSize: 9, fontWeight: 600 }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis
              tick={AXIS_TICK_STYLE}
              axisLine={false}
              tickLine={false}
              unit=" ft"
            />
            <Tooltip content={<DarkTooltip formatter={(v) => `${v} ft`} />} />
            <Bar dataKey="height" radius={[4, 4, 0, 0]} animationDuration={1500}>
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} fillOpacity={0.85} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const HeightBarChart = memo(HeightBarChartComponent);
export default HeightBarChart;
