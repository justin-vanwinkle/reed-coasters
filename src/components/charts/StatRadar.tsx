import { memo } from 'react';
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import type { TooltipProps } from 'recharts';
import { getRadarData, getParkColor } from '../../data';
import { AXIS_TICK_STYLE, GRID_STYLE } from './shared';
import type { Coaster } from '../../data/coasters.types';
import styles from './StatRadar.module.css';

interface StatRadarProps {
  coaster: Coaster;
  opponent?: Coaster;
  height?: number;
}

interface MergedRadarPoint {
  axis: string;
  a: number;
  rawA: string;
  b?: number;
  rawB?: string;
}

/** True when the coaster has enough data to draw a meaningful pentagon */
export function hasRadarData(coaster: Coaster): boolean {
  return getRadarData(coaster).filter((p) => p.value === 0).length < 3;
}

interface RadarTooltipConfig {
  primaryName: string;
  primaryColor: string;
  opponentName?: string;
  opponentColor?: string;
}

function RadarTooltip({
  active,
  payload,
  primaryName,
  primaryColor,
  opponentName,
  opponentColor,
}: TooltipProps<number, string> & RadarTooltipConfig) {
  if (!active || !payload?.length) return null;

  const point = payload[0].payload as MergedRadarPoint;

  return (
    <div className={styles.tooltip}>
      <p className={styles.tooltipAxis}>{point.axis}</p>
      <p className={styles.tooltipValue} style={{ color: primaryColor }}>
        {primaryName}: <strong>{point.rawA}</strong>
      </p>
      {opponentName && (
        <p className={styles.tooltipValue} style={{ color: opponentColor }}>
          {opponentName}: <strong>{point.rawB ?? '—'}</strong>
        </p>
      )}
    </div>
  );
}

/**
 * Stat Pentagon — 5-axis radar chart of a coaster's normalized stats
 * (Height, Speed, Length, Loops, Ride Time — each 0–100 vs the dataset max).
 * Pass an opponent to overlay a second pentagon for head-to-head duels.
 */
function StatRadarComponent({ coaster, opponent, height = 260 }: StatRadarProps) {
  if (!hasRadarData(coaster)) return null;

  const primaryData = getRadarData(coaster);
  const opponentData = opponent ? getRadarData(opponent) : null;

  const data: MergedRadarPoint[] = primaryData.map((point, i) => ({
    axis: point.axis,
    a: point.value,
    rawA: point.raw,
    ...(opponentData
      ? { b: opponentData[i].value, rawB: opponentData[i].raw }
      : {}),
  }));

  const primaryColor = getParkColor(coaster.park);
  const opponentColor = opponent ? getParkColor(opponent.park) : undefined;

  return (
    <div className={styles.container} style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="72%">
          <PolarGrid stroke={GRID_STYLE.stroke} />
          <PolarAngleAxis
            dataKey="axis"
            tick={{ ...AXIS_TICK_STYLE, fontWeight: 600 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name={coaster.name}
            dataKey="a"
            stroke={primaryColor}
            strokeWidth={2}
            fill={primaryColor}
            fillOpacity={0.35}
            animationDuration={800}
          />
          {opponent && (
            <Radar
              name={opponent.name}
              dataKey="b"
              stroke={opponentColor}
              strokeWidth={2}
              fill={opponentColor}
              fillOpacity={0.25}
              animationDuration={800}
            />
          )}
          <Tooltip
            content={
              <RadarTooltip
                primaryName={coaster.name}
                primaryColor={primaryColor}
                opponentName={opponent?.name}
                opponentColor={opponentColor}
              />
            }
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export const StatRadar = memo(StatRadarComponent);
export default StatRadar;
