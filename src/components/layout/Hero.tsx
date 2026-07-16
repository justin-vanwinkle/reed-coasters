import { memo } from 'react';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { stats } from '../../data';
import styles from './Hero.module.css';

const HERO_STATS = [
  { value: stats.totalCoasters, label: 'Coasters', suffix: '', color: 'var(--color-primary)' },
  { value: stats.maxHeight, label: 'Max Height', suffix: ' ft', color: 'var(--color-warning)' },
  { value: stats.maxSpeed, label: 'Top Speed', suffix: ' mph', color: 'var(--color-danger)' },
  { value: stats.totalInversions, label: 'Inversions', suffix: '', color: 'var(--color-info)' },
  { value: stats.maxGForce, label: 'Peak G-Force', suffix: ' G', color: 'var(--color-jellystone)' },
];

/**
 * Hero section with animated stats
 */
function HeroComponent() {
  return (
    <div className={styles.hero}>
      <div className={styles.background} />
      <svg
        className={styles.trackSvg}
        viewBox="0 0 1200 120"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path
          d="M-10 110 Q 150 108 260 60 T 430 18 Q 470 10 500 26 T 600 100 Q 660 118 740 90 T 900 40 Q 1000 14 1210 60"
          fill="none"
          stroke="rgba(255, 197, 61, 0.18)"
          strokeWidth="3"
        />
        <circle cx="430" cy="18" r="5" fill="rgba(255, 197, 61, 0.25)" />
        <circle cx="446" cy="19" r="4" fill="rgba(255, 197, 61, 0.2)" />
        <circle cx="462" cy="22" r="4" fill="rgba(255, 197, 61, 0.15)" />
      </svg>
      <div className={styles.content}>
        <div className={styles.eyebrow}>Data Visualization</div>
        <h1 className={styles.title}>Reed's Roller Coaster Universe</h1>
        <p className={styles.subtitle}>
          {stats.totalCoasters} coasters. 9 parks. 50+ years of engineering. Every twist, drop, and loop — visualized.
        </p>
        <div className={styles.trackDivider} />

        <div className={styles.statsGrid}>
          {HERO_STATS.map((stat, i) => (
            <div key={i} className={styles.statCard}>
              <div className={styles.statValue} style={{ color: stat.color }}>
                <AnimatedNumber
                  target={stat.value}
                  suffix={stat.suffix}
                  decimals={stat.value % 1 !== 0 ? 1 : 0}
                />
              </div>
              <div className={styles.statLabel}>{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Hero = memo(HeroComponent);
export default Hero;
