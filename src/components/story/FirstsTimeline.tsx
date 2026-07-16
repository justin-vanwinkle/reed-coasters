import { memo } from 'react';
import type { Milestone } from '../../data/coasters.types';
import styles from './FirstsTimeline.module.css';

interface FirstsTimelineProps {
  milestones: Milestone[];
  onSelect: (coasterId: string) => void;
}

/**
 * Vertical milestone timeline of coaster "firsts", grouped by age.
 * Ride order within a year is unknown, so everything is phrased "At age N".
 */
function FirstsTimelineComponent({ milestones, onSelect }: FirstsTimelineProps) {
  const ages = [...new Set(milestones.map((m) => m.age))].sort((a, b) => a - b);

  return (
    <div className={styles.timeline}>
      {ages.map((age) => (
        <div key={age} className={styles.ageGroup}>
          <div className={styles.ageHeader}>At Age {age}</div>
          {milestones
            .filter((m) => m.age === age)
            .map((m) => (
              <div
                key={`${m.label}-${m.coasterId}`}
                className={styles.milestone}
                onClick={() => onSelect(m.coasterId)}
              >
                <span className={styles.icon} aria-hidden="true">
                  {m.icon}
                </span>
                <div className={styles.content}>
                  <div className={styles.label}>
                    {m.label} —{' '}
                    <span className={styles.coasterName} style={{ color: m.fill }}>
                      {m.coasterName}
                    </span>
                  </div>
                  <div className={styles.detail}>{m.detail}</div>
                </div>
              </div>
            ))}
        </div>
      ))}
    </div>
  );
}

export const FirstsTimeline = memo(FirstsTimelineComponent);
export default FirstsTimeline;
