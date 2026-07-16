import { memo, useState, useMemo, ChangeEvent } from 'react';
import { StatRadar } from '../charts/StatRadar';
import { useCoasterData } from '../../hooks/useCoasterData';
import type { Coaster, ThrillScoreBreakdown } from '../../data/coasters.types';
import styles from './BattleArena.module.css';

interface BattleStat {
  key: string;
  label: string;
  getValue: (coaster: Coaster, thrillScore: number | null) => number | null;
  format: (value: number) => string;
}

const BATTLE_STATS: BattleStat[] = [
  { key: 'height', label: 'Height', getValue: (c) => c.height, format: (v) => `${v} ft` },
  { key: 'speed', label: 'Top Speed', getValue: (c) => c.speed, format: (v) => `${v} mph` },
  {
    key: 'trackLength',
    label: 'Track Length',
    getValue: (c) => c.trackLength,
    format: (v) => `${v.toLocaleString()} ft`,
  },
  { key: 'inversions', label: 'Inversions', getValue: (c) => c.inversions, format: (v) => `${v}` },
  { key: 'dropAngle', label: 'Drop Angle', getValue: (c) => c.dropAngle, format: (v) => `${v}°` },
  {
    key: 'thrillScore',
    label: 'Thrill Score',
    getValue: (_, thrillScore) => thrillScore,
    format: (v) => `${v}`,
  },
];

const BREAKDOWN_REASONS: Record<keyof ThrillScoreBreakdown, string> = {
  height: 'the height advantage seals it',
  speed: 'raw speed makes the difference',
  inversions: 'the loop count settles it',
  dropAngle: 'the steeper drop tips the scales',
  trackLength: 'the longer track wins out',
  elements: 'the special elements push it over the top',
};

function biggestGapReason(
  winner: ThrillScoreBreakdown,
  loser: ThrillScoreBreakdown
): string {
  let bestKey: keyof ThrillScoreBreakdown = 'height';
  let bestGap = -Infinity;
  (Object.keys(BREAKDOWN_REASONS) as (keyof ThrillScoreBreakdown)[]).forEach((key) => {
    const gap = winner[key] - loser[key];
    if (gap > bestGap) {
      bestGap = gap;
      bestKey = key;
    }
  });
  return BREAKDOWN_REASONS[bestKey];
}

/**
 * Head-to-head battle arena — pick any two coasters, overlay their stat
 * pentagons, and settle it stat by stat plus a Thrill Score verdict.
 */
function BattleArenaComponent() {
  const { coasters, findCoasterById, getThrillScore, getParkColor } = useCoasterData();

  const [leftId, setLeftId] = useState('fury-325');
  const [rightId, setRightId] = useState('the-beast');

  const sortedCoasters = useMemo(
    () => [...coasters].sort((a, b) => a.name.localeCompare(b.name)),
    [coasters]
  );

  const left = findCoasterById(leftId);
  const right = findCoasterById(rightId);
  if (!left || !right) return null;

  const leftColor = getParkColor(left.park);
  const rightColor = getParkColor(right.park);
  const leftEntry = getThrillScore(left.id);
  const rightEntry = getThrillScore(right.id);
  const leftScore = leftEntry?.score ?? null;
  const rightScore = rightEntry?.score ?? null;

  const renderSelect = (
    label: string,
    value: string,
    color: string,
    onChange: (e: ChangeEvent<HTMLSelectElement>) => void
  ) => (
    <select
      className={styles.picker}
      aria-label={label}
      value={value}
      onChange={onChange}
      style={{ color }}
    >
      {sortedCoasters.map((c) => (
        <option key={c.id} value={c.id}>
          {c.name} ({c.park})
        </option>
      ))}
    </select>
  );

  const winner =
    leftScore !== null && rightScore !== null && leftScore !== rightScore
      ? leftScore > rightScore
        ? left
        : right
      : null;

  let banner: string;
  let reason: string | null = null;
  if (winner && leftEntry && rightEntry) {
    const winnerEntry = winner === left ? leftEntry : rightEntry;
    const loserEntry = winner === left ? rightEntry : leftEntry;
    banner = `🏆 ${winner.name} wins the showdown — Thrill Score ${winnerEntry.score} to ${loserEntry.score}`;
    reason = biggestGapReason(winnerEntry.breakdown, loserEntry.breakdown);
  } else {
    banner = `🤝 It's a dead heat — Thrill Score ${leftScore ?? '—'} to ${rightScore ?? '—'}`;
  }
  const winnerColor = winner ? getParkColor(winner.park) : undefined;

  return (
    <div className={styles.arena}>
      {/* Pickers */}
      <div className={styles.pickers}>
        {renderSelect('Left coaster', leftId, leftColor, (e) => setLeftId(e.target.value))}
        <div className={styles.vs}>VS</div>
        {renderSelect('Right coaster', rightId, rightColor, (e) => setRightId(e.target.value))}
      </div>

      {/* Dueling pentagons */}
      <StatRadar coaster={left} opponent={right} height={280} />

      {/* Stat-by-stat rows */}
      <div className={styles.rows}>
        {BATTLE_STATS.map((stat) => {
          const a = stat.getValue(left, leftScore);
          const b = stat.getValue(right, rightScore);
          const aWins = a !== null && (b === null || a > b);
          const bWins = b !== null && (a === null || b > a);

          const cellStyle = (wins: boolean, color: string) =>
            wins
              ? {
                  background: `${color}18`,
                  boxShadow: `inset 0 0 0 1px ${color}66, 0 0 12px ${color}33`,
                  color,
                }
              : undefined;

          return (
            <div key={stat.key} className={styles.row}>
              <div className={styles.cell} style={cellStyle(aWins, leftColor)}>
                {a !== null ? stat.format(a) : '—'}
              </div>
              <div className={styles.rowLabel}>{stat.label}</div>
              <div className={styles.cell} style={cellStyle(bWins, rightColor)}>
                {b !== null ? stat.format(b) : '—'}
              </div>
            </div>
          );
        })}
      </div>

      {/* Winner banner */}
      <div
        className={styles.banner}
        style={
          winnerColor
            ? { borderColor: `${winnerColor}55`, background: `${winnerColor}12` }
            : undefined
        }
      >
        <p className={styles.bannerHeadline} style={{ color: winnerColor }}>
          {banner}
        </p>
        {reason && <p className={styles.bannerReason}>…{reason}.</p>}
      </div>
    </div>
  );
}

export const BattleArena = memo(BattleArenaComponent);
export default BattleArena;
