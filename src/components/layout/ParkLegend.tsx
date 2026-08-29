import { memo } from 'react';
import { PARK_GROUPS, WISHLIST_PARK_GROUPS } from '../../data';
import styles from './ParkLegend.module.css';

/**
 * Color legend showing park color associations
 * Wish-list parks get a hollow dashed dot to match their outlined chart bars
 */
function ParkLegendComponent() {
  return (
    <div className={styles.container}>
      {Object.entries(PARK_GROUPS).map(([name, color]) => {
        const isWishlist = WISHLIST_PARK_GROUPS.includes(name);
        return (
          <div key={name} className={styles.item}>
            <div
              className={isWishlist ? styles.wishlistDot : styles.dot}
              style={isWishlist ? { borderColor: color, color } : { background: color, color }}
            />
            <span className={styles.label}>{isWishlist ? `${name} (wish list)` : name}</span>
          </div>
        );
      })}
    </div>
  );
}

export const ParkLegend = memo(ParkLegendComponent);
export default ParkLegend;
