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
  LabelList,
} from 'recharts';
import {
  CHART_MARGIN_WITH_LABELS,
  AXIS_TICK_STYLE,
  AXIS_LABEL_STYLE,
  GRID_STYLE,
  BAR_RADIUS,
} from './shared';
import { useCoasterData } from '../../hooks/useCoasterData';
import type { ThrillDensityPoint } from '../../data/coasters.types';
import styles from './ThrillDensityChart.module.css';

// Reconstruct the approximate ride duration ("M:SS") from the ratio
function approxDuration(d: ThrillDensityPoint): string {
  const totalSeconds = Math.round((d.inversions / d.perMinute) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `≈${minutes}:${String(seconds).padStart(2, '0')}`;
}

/**
 * Flip density chart: inversions per minute of ride time for every coaster
 * that goes upside down. Bar labels show the raw inversion count.
 */
function ThrillDensityChartComponent() {
  const { thrillDensityData } = useCoasterData();

  return (
    <div className={styles.scroll}>
      <div className={styles.inner}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={thrillDensityData} margin={CHART_MARGIN_WITH_LABELS}>
            <CartesianGrid {...GRID_STYLE} vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ ...AXIS_TICK_STYLE, fontSize: 10, fontWeight: 600 }}
              angle={-45}
              textAnchor="end"
              interval={0}
              height={70}
            />
            <YAxis tick={AXIS_TICK_STYLE} axisLine={false} tickLine={false} />
            <Tooltip
              content={({ active, payload }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as ThrillDensityPoint;
                return (
                  <div className={styles.tooltip}>
                    <p className={styles.name}>{d.fullName}</p>
                    <p className={styles.value} style={{ color: d.fill }}>
                      {d.inversions} inversion{d.inversions === 1 ? '' : 's'} in{' '}
                      {approxDuration(d)} — {d.perMinute} flips/minute
                    </p>
                  </div>
                );
              }}
            />
            <Bar dataKey="perMinute" radius={BAR_RADIUS} animationDuration={1200}>
              {thrillDensityData.map((d, i) => (
                <Cell key={i} fill={d.fill} />
              ))}
              <LabelList
                dataKey="inversions"
                position="top"
                formatter={(v: number) => `${v}×`}
                fill={AXIS_LABEL_STYLE.fill}
                fontSize={AXIS_LABEL_STYLE.fontSize}
                fontFamily={AXIS_LABEL_STYLE.fontFamily}
                fontWeight={AXIS_LABEL_STYLE.fontWeight}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export const ThrillDensityChart = memo(ThrillDensityChartComponent);
export default ThrillDensityChart;
