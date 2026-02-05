import { memo } from 'react';
import { getParkColor } from '../../data';
import type { Coaster } from '../../data/coasters.types';
import styles from './CoasterCard.module.css';

interface CoasterCardProps {
  coaster: Coaster;
  onSelect: (coaster: Coaster) => void;
}

/**
 * Individual coaster card for grid display
 * Shows hero image, park badge, year, and quick stats
 */
function CoasterCardComponent({ coaster, onSelect }: CoasterCardProps) {
  const parkColor = getParkColor(coaster.park);

  return (
    <div
      className={styles.card}
      onClick={() => onSelect(coaster)}
      style={
        {
          '--park-color': parkColor,
          '--park-color-light': `${parkColor}33`,
        } as React.CSSProperties
      }
    >
      {/* Hero Image */}
      <div className={styles.hero}>
        {coaster.imageUrl && (
          <img
            src={coaster.imageUrl}
            alt={coaster.name}
            className={styles.image}
            referrerPolicy="no-referrer"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        )}
        {/* Park Badge */}
        <div className={styles.parkBadge}>{coaster.park}</div>
        {/* Year Badge */}
        {coaster.yearOpened && (
          <div className={styles.yearBadge}>{coaster.yearOpened}</div>
        )}
      </div>

      {/* Content */}
      <div className={styles.content}>
        <h3 className={styles.name}>{coaster.name}</h3>

        {/* Quick Stats */}
        <div className={styles.stats}>
          {coaster.height && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{coaster.height}</span>
              <span className={styles.statUnit}>ft</span>
            </div>
          )}
          {coaster.speed && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{coaster.speed}</span>
              <span className={styles.statUnit}>mph</span>
            </div>
          )}
          {coaster.inversions > 0 && (
            <div className={styles.stat}>
              <span className={styles.statValue}>{coaster.inversions}</span>
              <span className={styles.statUnit}>loops</span>
            </div>
          )}
        </div>

        <div className={styles.hint}>Click for details →</div>
      </div>
    </div>
  );
}

export const CoasterCard = memo(CoasterCardComponent);
export default CoasterCard;
