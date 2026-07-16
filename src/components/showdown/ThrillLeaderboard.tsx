import { memo } from 'react';
import { getParkColor, MEDAL_COLORS } from '../../data';
import { CHART_COLORS } from '../charts/shared';
import type { Coaster, ThrillScoreEntry, ThrillScoreBreakdown } from '../../data/coasters.types';
import styles from './ThrillLeaderboard.module.css';

interface ThrillLeaderboardProps {
  entries: ThrillScoreEntry[];
  onSelectCoaster: (coaster: Coaster) => void;
}

// Breakdown segments mapped onto the shared midway-lights palette
const SEGMENTS: { key: keyof ThrillScoreBreakdown; label: string; color: string }[] = [
  { key: 'height', label: 'Height', color: CHART_COLORS[0] }, // teal
  { key: 'speed', label: 'Speed', color: CHART_COLORS[1] }, // gold
  { key: 'inversions', label: 'Loops', color: CHART_COLORS[2] }, // coral
  { key: 'dropAngle', label: 'Drop Angle', color: CHART_COLORS[3] }, // sky
  { key: 'trackLength', label: 'Length', color: CHART_COLORS[5] }, // grape
  { key: 'elements', label: 'Elements', color: CHART_COLORS[6] }, // tangerine
];

const MEDALS = [MEDAL_COLORS.gold, MEDAL_COLORS.silver, MEDAL_COLORS.bronze];

/**
 * All coasters ranked by composite Thrill Score, with a stacked segment bar
 * showing how each score breaks down. Top 3 get podium medals.
 */
function ThrillLeaderboardComponent({ entries, onSelectCoaster }: ThrillLeaderboardProps) {
  const maxScore = entries[0]?.score ?? 100;

  return (
    <div className={styles.container}>
      {/* Legend */}
      <div className={styles.legend}>
        {SEGMENTS.map((seg) => (
          <span key={seg.key} className={styles.legendItem}>
            <span className={styles.legendSwatch} style={{ background: seg.color }} />
            {seg.label}
          </span>
        ))}
      </div>

      {/* Rows */}
      <div className={styles.rows}>
        {entries.map((entry, index) => {
          const { coaster, score, breakdown } = entry;
          const parkColor = getParkColor(coaster.park);
          const medalColor = index < 3 ? MEDALS[index] : null;

          return (
            <button
              key={coaster.id}
              type="button"
              className={styles.row}
              onClick={() => onSelectCoaster(coaster)}
            >
              <span
                className={`${styles.rank} ${medalColor ? styles.medal : ''}`}
                style={
                  medalColor
                    ? {
                        background: `linear-gradient(135deg, ${medalColor} 0%, ${medalColor}88 100%)`,
                        color: index === 0 ? '#000' : '#fff',
                        boxShadow: `0 2px 8px ${medalColor}44`,
                      }
                    : undefined
                }
              >
                {index + 1}
              </span>

              <span className={styles.info}>
                <span className={styles.name} style={{ color: parkColor }}>
                  {coaster.name}
                </span>
                <span className={styles.park}>{coaster.park}</span>
              </span>

              <span className={styles.bar}>
                {SEGMENTS.map((seg) => {
                  const value = breakdown[seg.key];
                  if (value <= 0) return null;
                  return (
                    <span
                      key={seg.key}
                      className={styles.segment}
                      style={{
                        width: `${(value / maxScore) * 100}%`,
                        background: seg.color,
                      }}
                      title={`${seg.label}: ${value}`}
                    />
                  );
                })}
              </span>

              <span className={styles.score}>{score}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export const ThrillLeaderboard = memo(ThrillLeaderboardComponent);
export default ThrillLeaderboard;
