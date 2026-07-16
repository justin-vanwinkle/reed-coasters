import { memo } from 'react';
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  CHART_COLORS,
  CHART_BG,
  CHART_FONT,
  CHART_MARGIN,
  AXIS_TICK_STYLE,
  GRID_STYLE,
} from '../charts/shared';
import type { BraveryPoint } from '../../data/coasters.types';
import styles from './BraveryCurve.module.css';

interface BraveryCurveProps {
  data: BraveryPoint[];
}

const TEAL = CHART_COLORS[0]; // #2CE5C9
const GOLD = CHART_COLORS[1]; // #FFC53D

/**
 * Step chart of the biggest thing conquered at each age —
 * cumulative max height (teal, left axis) and max speed (gold, right axis)
 */
function BraveryCurveComponent({ data }: BraveryCurveProps) {
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart data={data} margin={CHART_MARGIN}>
          <CartesianGrid {...GRID_STYLE} />
          <XAxis
            dataKey="age"
            type="number"
            domain={[6, 9]}
            ticks={[6, 7, 8, 9]}
            tick={AXIS_TICK_STYLE}
            tickFormatter={(v: number) => `Age ${v}`}
          />
          <YAxis
            yAxisId="h"
            tick={{ ...AXIS_TICK_STYLE, fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            label={{
              value: 'Tallest (ft)',
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
              value: 'Fastest (mph)',
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
              const d = payload[0]?.payload as BraveryPoint;
              return (
                <div className={styles.tooltip}>
                  <p className={styles.name}>Age {d.age}</p>
                  <p className={styles.stat} style={{ color: TEAL }}>
                    Tallest conquered: {d.tallestName} ({d.maxHeight} ft)
                  </p>
                  <p className={styles.stat} style={{ color: GOLD }}>
                    Fastest: {d.fastestName} ({d.maxSpeed} mph)
                  </p>
                  <p className={styles.stats}>
                    Most loops in one ride: {d.maxInversions} · {d.newCount} new coaster
                    {d.newCount === 1 ? '' : 's'}
                  </p>
                </div>
              );
            }}
          />
          <Line
            yAxisId="h"
            type="stepAfter"
            dataKey="maxHeight"
            stroke={TEAL}
            strokeWidth={3}
            dot={{ r: 5, fill: TEAL, stroke: CHART_BG, strokeWidth: 2 }}
            animationDuration={1200}
          />
          <Line
            yAxisId="s"
            type="stepAfter"
            dataKey="maxSpeed"
            stroke={GOLD}
            strokeWidth={3}
            dot={{ r: 5, fill: GOLD, stroke: CHART_BG, strokeWidth: 2 }}
            animationDuration={1500}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export const BraveryCurve = memo(BraveryCurveComponent);
export default BraveryCurve;
