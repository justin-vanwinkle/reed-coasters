import { memo } from 'react';
import { getParkColor, MEDAL_COLORS } from '../../data';
import type { Coaster, RecordCategory } from '../../data/coasters.types';
import styles from './RecordPodium.module.css';

interface RecordPodiumProps {
  category: RecordCategory;
  onSelectCoaster?: (coaster: Coaster) => void;
}

interface PodiumPlaceProps {
  coaster: Coaster | undefined;
  place: 1 | 2 | 3;
  height: number;
  medalColor: string;
  field: keyof Coaster;
  unit: string;
  onSelect?: (coaster: Coaster) => void;
}

function PodiumPlace({ coaster, place, height, medalColor, field, unit, onSelect }: PodiumPlaceProps) {
  if (!coaster) return <div className={styles.placeholder} />;

  const parkColor = getParkColor(coaster.park);
  const value = coaster[field];

  return (
    <div
      className={styles.podiumPlace}
      onClick={() => onSelect?.(coaster)}
      style={{ cursor: onSelect ? 'pointer' : 'default' }}
    >
      {/* Medal */}
      <div
        className={styles.medal}
        style={{
          background: `linear-gradient(135deg, ${medalColor} 0%, ${medalColor}88 100%)`,
          color: place === 1 ? '#000' : '#fff',
          boxShadow: `0 4px 12px ${medalColor}44`,
        }}
      >
        {place}
      </div>

      {/* Podium block */}
      <div
        className={styles.block}
        style={{
          height,
          background: `linear-gradient(180deg, ${medalColor}33 0%, ${medalColor}11 100%)`,
          border: `2px solid ${medalColor}55`,
        }}
      >
        <div className={styles.value} style={{ color: medalColor }}>
          {value?.toLocaleString()}
          {unit}
        </div>
        <div className={styles.name}>{coaster.name}</div>
        <div className={styles.park} style={{ color: parkColor }}>
          {coaster.park}
        </div>
      </div>
    </div>
  );
}

/**
 * Olympic-style podium display for record categories
 * Shows gold, silver, bronze positions for coaster rankings
 */
function RecordPodiumComponent({ category, onSelectCoaster }: RecordPodiumProps) {
  const { title, field, unit, icon, data } = category;

  if (!data || data.length === 0) return null;

  const [first, second, third] = data;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{title}</span>
      </div>

      {/* Podium */}
      <div className={styles.podium}>
        <PodiumPlace
          coaster={second}
          place={2}
          height={100}
          medalColor={MEDAL_COLORS.silver}
          field={field}
          unit={unit}
          onSelect={onSelectCoaster}
        />
        <PodiumPlace
          coaster={first}
          place={1}
          height={130}
          medalColor={MEDAL_COLORS.gold}
          field={field}
          unit={unit}
          onSelect={onSelectCoaster}
        />
        <PodiumPlace
          coaster={third}
          place={3}
          height={80}
          medalColor={MEDAL_COLORS.bronze}
          field={field}
          unit={unit}
          onSelect={onSelectCoaster}
        />
      </div>
    </div>
  );
}

export const RecordPodium = memo(RecordPodiumComponent);
export default RecordPodium;
