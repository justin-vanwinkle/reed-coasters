import { Fragment, memo } from 'react';
import { useCoasterData } from '../../hooks/useCoasterData';
import type { StateGeo } from '../../data/coasters.types';
import styles from './ParkMap.module.css';

// Rough north-to-south order for the road-trip layout
const GEO_ORDER = ['Ohio', 'North Carolina', 'Florida'];

function geoRank(state: string): number {
  const idx = GEO_ORDER.indexOf(state);
  return idx === -1 ? GEO_ORDER.length : idx;
}

function StateCard({ geo }: { geo: StateGeo }) {
  return (
    <div
      className={styles.stateCard}
      data-testid={`state-${geo.state}`}
      style={{
        background: `${geo.color}08`,
        border: `1px solid ${geo.color}22`,
      }}
    >
      <div className={styles.stateHeader}>
        <div className={styles.stateName} style={{ color: geo.color }}>
          {geo.state}
        </div>
        <div className={styles.stateCount} style={{ color: geo.color }}>
          {geo.count}
        </div>
      </div>
      <div className={styles.parkChips}>
        {geo.parks.map((park) => (
          <span key={park.name} className={styles.parkChip}>
            <span className={styles.parkDot} style={{ background: park.color }} />
            <span className={styles.parkName}>{park.name}</span>
            <span className={styles.parkCount}>{park.count}</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Stylized "road trip" panel: state cards stacked roughly north-to-south
 * (Ohio → North Carolina → Florida) and joined by a dashed line suggesting
 * the drive down I-77/I-95. All counts derive from parkGeography.
 */
function ParkMapComponent() {
  const { parkGeography } = useCoasterData();

  const states = [...parkGeography].sort((a, b) => geoRank(a.state) - geoRank(b.state));

  return (
    <div className={styles.roadTrip}>
      {states.map((geo, i) => (
        <Fragment key={geo.state}>
          {i > 0 && (
            <div className={styles.leg} aria-hidden="true">
              <span className={styles.legLine} />
              <span className={styles.legCar}>🚗</span>
              <span className={styles.legLine} />
            </div>
          )}
          <StateCard geo={geo} />
        </Fragment>
      ))}
      <p className={styles.note}>North to south — the family coaster road trip</p>
    </div>
  );
}

export const ParkMap = memo(ParkMapComponent);
export default ParkMap;
