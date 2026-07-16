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
import { CHART_MARGIN_WITH_LABELS, AXIS_TICK_STYLE, GRID_STYLE, BAR_RADIUS } from './shared';
import { useCoasterData } from '../../hooks/useCoasterData';
import type { PacingDataPoint } from '../../data/coasters.types';
import styles from './PacingChart.module.css';

/**
 * Pacing chart: top speed vs. whole-ride average speed per coaster.
 * The average includes the slow lift hill climb, so it is always well
 * below the headline number — the gap shows how "relentless" a ride is.
 */
function PacingChartComponent() {
  const { pacingData } = useCoasterData();

  return (
    <div>
      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swatchTop}`} />
          Top speed
        </span>
        <span className={styles.legendItem}>
          <span className={`${styles.swatch} ${styles.swatchAvg}`} />
          Whole-ride average
        </span>
      </div>

      <div className={styles.scroll}>
        <div className={styles.inner}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={pacingData}
              margin={CHART_MARGIN_WITH_LABELS}
              barCategoryGap="25%"
              barGap={2}
            >
              <CartesianGrid {...GRID_STYLE} vertical={false} />
              <XAxis
                dataKey="name"
                tick={{ ...AXIS_TICK_STYLE, fontSize: 10, fontWeight: 600 }}
                angle={-45}
                textAnchor="end"
                interval={0}
                height={70}
              />
              <YAxis
                tick={AXIS_TICK_STYLE}
                axisLine={false}
                tickLine={false}
                unit=" mph"
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const d = payload[0].payload as PacingDataPoint;
                  return (
                    <div className={styles.tooltip}>
                      <p className={styles.name}>{d.fullName}</p>
                      <p className={styles.value} style={{ color: d.fill }}>
                        Top speed {d.topSpeed} mph
                      </p>
                      <p className={styles.detail}>
                        Whole-ride average {d.avgSpeed} mph (includes the lift hill climb)
                      </p>
                    </div>
                  );
                }}
              />
              <Bar dataKey="topSpeed" radius={BAR_RADIUS} animationDuration={1500}>
                {pacingData.map((d, i) => (
                  <Cell key={i} fill={d.fill} />
                ))}
              </Bar>
              <Bar dataKey="avgSpeed" radius={BAR_RADIUS} animationDuration={1500}>
                {pacingData.map((d, i) => (
                  <Cell key={i} fill={`${d.fill}66`} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export const PacingChart = memo(PacingChartComponent);
export default PacingChart;
