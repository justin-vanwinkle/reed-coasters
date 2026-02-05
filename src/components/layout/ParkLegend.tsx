import { memo } from 'react';
import { PARK_GROUPS } from '../../data';
import styles from './ParkLegend.module.css';

/**
 * Color legend showing park color associations
 */
function ParkLegendComponent() {
  return (
    <div className={styles.container}>
      {Object.entries(PARK_GROUPS).map(([name, color]) => (
        <div key={name} className={styles.item}>
          <div className={styles.dot} style={{ background: color }} />
          <span className={styles.label}>{name}</span>
        </div>
      ))}
    </div>
  );
}

export const ParkLegend = memo(ParkLegendComponent);
export default ParkLegend;
