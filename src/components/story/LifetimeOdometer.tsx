import { memo } from 'react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import type { OdometerTotals } from '../../data/coasters.types';
import styles from './LifetimeOdometer.module.css';

interface LifetimeOdometerProps {
  odometer: OdometerTotals;
}

/**
 * Hero stat row of lifetime ride totals — every ride ever taken, added up
 */
function LifetimeOdometerComponent({ odometer }: LifetimeOdometerProps) {
  const totalMinutes = Math.round(odometer.totalSeconds / 60);
  const marathons = odometer.totalMiles / 26.2;
  const hours = odometer.totalSeconds / 3600;

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        <div className={styles.stat}>
          <div className={styles.value}>
            <AnimatedNumber target={odometer.totalRides} />
          </div>
          <div className={styles.label}>Total Rides</div>
          <div className={styles.subline}>every lap on every coaster, counted</div>
        </div>

        <div className={styles.stat}>
          <div className={styles.value}>
            <AnimatedNumber target={odometer.totalMiles} decimals={1} />
          </div>
          <div className={styles.label}>Miles of Track</div>
          <div className={styles.subline}>
            that&apos;s {marathons.toFixed(1)}× a full marathon — on rails
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.value}>
            <AnimatedNumber target={totalMinutes} />
          </div>
          <div className={styles.label}>Minutes Riding</div>
          <div className={styles.subline}>
            about {hours.toFixed(1)} hours strapped in, start to finish
          </div>
        </div>

        <div className={styles.stat}>
          <div className={styles.value}>
            <AnimatedNumber target={odometer.totalUpsideDown} />
          </div>
          <div className={styles.label}>Times Upside Down</div>
          <div className={styles.subline}>loops, rolls, and corkscrews combined</div>
        </div>
      </div>

      {odometer.coastersExcludedFromFeet.length > 0 && (
        <p className={styles.footnote}>
          Track length unknown for {odometer.coastersExcludedFromFeet.join(', ')} — not counted in
          the distance total.
        </p>
      )}
    </div>
  );
}

export const LifetimeOdometer = memo(LifetimeOdometerComponent);
export default LifetimeOdometer;
