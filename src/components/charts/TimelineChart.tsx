import { memo } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { AXIS_TICK_STYLE, GRID_STYLE, CHART_BG, CHART_FONT } from './shared';
import type { TimelineDataPoint } from '../../data/coasters.types';
import styles from './TimelineChart.module.css';

interface TimelineChartProps {
  data: TimelineDataPoint[];
}

function TimelineChartComponent({ data }: TimelineChartProps) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <div style={{ minWidth: 700, height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 20, bottom: 50, left: 10 }}>
            <CartesianGrid {...GRID_STYLE} />
            <XAxis dataKey="year" tick={AXIS_TICK_STYLE} />
            <YAxis
              yAxisId="h"
              tick={{ ...AXIS_TICK_STYLE, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Height (ft)',
                angle: -90,
                position: 'insideLeft',
                fill: 'rgba(255, 255, 255, 0.55)',
                fontSize: 10,
                fontFamily: CHART_FONT,
              }}
            />
            <YAxis
              yAxisId="s"
              orientation="right"
              tick={{ ...AXIS_TICK_STYLE, fontSize: 10 }}
              axisLine={false}
              tickLine={false}
              label={{
                value: 'Speed (mph)',
                angle: 90,
                position: 'insideRight',
                fill: 'rgba(255, 255, 255, 0.55)',
                fontSize: 10,
                fontFamily: CHART_FONT,
              }}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0]?.payload as TimelineDataPoint;
                return (
                  <div className={styles.tooltip}>
                    <p className={styles.name}>
                      {d.name} ({d.year})
                    </p>
                    <p className={styles.park} style={{ color: d.fill }}>
                      {d.park}
                    </p>
                    <p className={styles.stats}>
                      Height: {d.height} ft · Speed: {d.speed} mph
                    </p>
                  </div>
                );
              }}
            />
            <Bar
              yAxisId="h"
              dataKey="height"
              radius={[3, 3, 0, 0]}
              barSize={14}
              fillOpacity={0.5}
              animationDuration={1200}
            >
              {data.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
            </Bar>
            <Line
              yAxisId="s"
              type="monotone"
              dataKey="speed"
              stroke="#FFC53D"
              strokeWidth={2}
              dot={{ r: 4, fill: '#FFC53D', stroke: CHART_BG, strokeWidth: 2 }}
              animationDuration={1500}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const TimelineChart = memo(TimelineChartComponent);
export default TimelineChart;
