import { memo } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import { DarkTooltip } from '../ui/Tooltip';
import type { PieDataPoint } from '../../data/coasters.types';

interface PieChartComponentProps {
  data: PieDataPoint[];
  height?: number;
}

function renderLabel({
  cx,
  cy,
  midAngle,
  outerRadius,
  name,
  value,
}: {
  cx: number;
  cy: number;
  midAngle: number;
  outerRadius: number;
  name: string;
  value: number;
}) {
  const RADIAN = Math.PI / 180;
  const radius = outerRadius + 20;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="rgba(255, 255, 255, 0.7)"
      textAnchor={x > cx ? 'start' : 'end'}
      fontSize={11}
      fontWeight={600}
    >
      {name} ({value})
    </text>
  );
}

function PieChartComponentInner({ data, height = 240 }: PieChartComponentProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={50}
          outerRadius={85}
          dataKey="value"
          stroke="rgba(0, 0, 0, 0.3)"
          strokeWidth={2}
          label={renderLabel}
          labelLine={{ stroke: 'rgba(255, 255, 255, 0.2)' }}
        >
          {data.map((d, i) => (
            <Cell key={i} fill={d.fill} />
          ))}
        </Pie>
        <Tooltip content={<DarkTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export const PieChartComponent = memo(PieChartComponentInner);
export default PieChartComponent;
