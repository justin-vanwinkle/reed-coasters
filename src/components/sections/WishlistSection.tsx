import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { CoasterCard } from '../coaster/CoasterCard';
import { getParkColor } from '../../data';
import type { Coaster } from '../../data/coasters.types';
import styles from './WishlistSection.module.css';

interface WishlistSectionProps {
  coasters: Coaster[];
  onSelectCoaster: (coaster: Coaster) => void;
}

/**
 * Reed's wish list — coasters he wants to ride but hasn't yet.
 * These show up across the dashboard's bar charts as dashed outlines.
 */
function WishlistSectionComponent({ coasters, onSelectCoaster }: WishlistSectionProps) {
  const tallest = coasters.reduce((a, b) => ((b.height ?? 0) > (a.height ?? 0) ? b : a));
  const fastest = coasters.reduce((a, b) => ((b.speed ?? 0) > (a.speed ?? 0) ? b : a));
  const longest = coasters.reduce((a, b) => ((b.trackLength ?? 0) > (a.trackLength ?? 0) ? b : a));
  const parkColor = getParkColor('Dollywood');

  return (
    <GlassCard
      title="⭐ Reed's Wish List"
      subtitle={`First stop: Dollywood in Pigeon Forge, Tennessee — all ${coasters.length} coasters`}
      span
    >
      <p className={styles.intro}>
        Reed wants to ride every coaster at Dollywood. Until he does, they appear as{' '}
        <span className={styles.outlineExample} style={{ borderColor: parkColor, color: parkColor }}>
          dashed outlines
        </span>{' '}
        in the charts — placeholders waiting to be filled in.
      </p>
      <div className={styles.superlatives}>
        <div className={styles.superlative}>
          <span className={styles.superlativeLabel}>Tallest</span>
          <span className={styles.superlativeValue}>
            {tallest.name} · {tallest.height} ft
          </span>
        </div>
        <div className={styles.superlative}>
          <span className={styles.superlativeLabel}>Fastest</span>
          <span className={styles.superlativeValue}>
            {fastest.name} · {fastest.speed} mph
          </span>
        </div>
        <div className={styles.superlative}>
          <span className={styles.superlativeLabel}>Longest</span>
          <span className={styles.superlativeValue}>
            {longest.name} · {longest.trackLength?.toLocaleString()} ft
          </span>
        </div>
      </div>
      <div className={styles.cardGrid}>
        {coasters.map((coaster) => (
          <CoasterCard key={coaster.id} coaster={coaster} onSelect={onSelectCoaster} />
        ))}
      </div>
    </GlassCard>
  );
}

export const WishlistSection = memo(WishlistSectionComponent);
export default WishlistSection;
