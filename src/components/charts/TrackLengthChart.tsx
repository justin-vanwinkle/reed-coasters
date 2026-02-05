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
import { CHART_MARGIN_WITH_LABELS, AXIS_TICK_STYLE, GRID_STYLE } from './shared';
import type { TrackDataPoint } from '../../data/coasters.types';
import styles from './TrackLengthChart.module.css';

interface TrackLengthChartProps {
  data: TrackDataPoint[];
}

function TrackLengthChartComponent({ data }: TrackLengthChartProps) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: 700, height: 340 }}>
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
            <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as TrackDataPoint;
                return (
                  <div className={styles.tooltip}>
                    <p className={styles.name}>{d.fullName}</p>
                    <p className={styles.value} style={{ color: d.fill }}>
                      {d.track.toLocaleString()} ft ({(d.track / 5280).toFixed(2)} mi)
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="track" radius={[4, 4, 0, 0]} animationDuration={1500}>
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

export const TrackLengthChart = memo(TrackLengthChartComponent);
export default TrackLengthChart;
