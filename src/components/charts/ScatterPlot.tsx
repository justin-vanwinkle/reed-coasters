import { memo } from 'react';
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from 'recharts';
import { CHART_MARGIN, AXIS_TICK_STYLE, GRID_STYLE, CHART_FONT } from './shared';
import type { ScatterDataPoint } from '../../data/coasters.types';
import styles from './ScatterPlot.module.css';

interface ScatterPlotProps {
  data: ScatterDataPoint[];
}

function ScatterPlotComponent({ data }: ScatterPlotProps) {
  return (
    <ResponsiveContainer width="100%" height={380}>
      <ScatterChart margin={{ ...CHART_MARGIN, bottom: 20 }}>
        <CartesianGrid {...GRID_STYLE} />
        <XAxis
          type="number"
          dataKey="x"
          name="Height"
          tick={AXIS_TICK_STYLE}
          unit=" ft"
          label={{
            value: 'Height (ft)',
            position: 'bottom',
            offset: 0,
            fill: 'rgba(255, 255, 255, 0.55)',
            fontSize: 11,
            fontFamily: CHART_FONT,
          }}
        />
        <YAxis
          type="number"
          dataKey="y"
          name="Speed"
          tick={AXIS_TICK_STYLE}
          unit=" mph"
          label={{
            value: 'Speed (mph)',
            angle: -90,
            position: 'insideLeft',
            fill: 'rgba(255, 255, 255, 0.55)',
            fontSize: 11,
            fontFamily: CHART_FONT,
          }}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (!active || !payload?.length) return null;
            const d = payload[0].payload as ScatterDataPoint;
            return (
              <div className={styles.tooltip}>
                <p className={styles.name}>{d.name}</p>
                <p className={styles.park} style={{ color: d.fill }}>
                  {d.park}
                </p>
                <p className={styles.stats}>
                  Height: {d.x} ft · Speed: {d.y} mph
                </p>
                {d.track && (
                  <p className={styles.stats}>Track: {d.track.toLocaleString()} ft</p>
                )}
              </div>
            );
          }}
        />
        <Scatter data={data} animationDuration={1200}>
          {data.map((d, i) => (
            <Cell
              key={i}
              fill={d.fill}
              fillOpacity={0.85}
              stroke="rgba(255, 255, 255, 0.25)"
              strokeWidth={1}
              r={Math.max(d.z, 4)}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
}

export const ScatterPlot = memo(ScatterPlotComponent);
export default ScatterPlot;
