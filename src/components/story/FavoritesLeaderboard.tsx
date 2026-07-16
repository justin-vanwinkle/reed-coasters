import { memo } from 'react';
import type { FavoriteEntry } from '../../data/coasters.types';
import styles from './FavoritesLeaderboard.module.css';

interface FavoritesLeaderboardProps {
  favorites: FavoriteEntry[];
  onSelect: (coasterId: string) => void;
}

/**
 * Ranked list of the most re-ridden coasters, with one 🎢 per ride as a tally
 */
function FavoritesLeaderboardComponent({ favorites, onSelect }: FavoritesLeaderboardProps) {
  return (
    <div className={styles.list}>
      {favorites.map((fav, i) => (
        <div key={fav.id} className={styles.row} onClick={() => onSelect(fav.id)}>
          <div className={i === 0 ? `${styles.rank} ${styles.rankFirst}` : styles.rank}>
            {i + 1}
          </div>
          <div className={styles.info}>
            <div className={styles.name} style={{ color: fav.fill }}>
              {fav.name}
            </div>
            <div className={styles.park}>{fav.park}</div>
          </div>
          <div className={styles.tally}>
            <span className={styles.emoji} aria-hidden="true">
              {'🎢'.repeat(fav.timesRidden)}
            </span>
            <span className={styles.count}>× {fav.timesRidden}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export const FavoritesLeaderboard = memo(FavoritesLeaderboardComponent);
export default FavoritesLeaderboard;
