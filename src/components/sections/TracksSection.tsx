import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { AnimatedNumber } from '../ui/AnimatedNumber';
import { TrackLengthChart, TimelineChart } from '../charts';
import { stats } from '../../data';
import type { TrackDataPoint, TimelineDataPoint } from '../../data/coasters.types';
import styles from './TracksSection.module.css';

interface TracksSectionProps {
  trackData: TrackDataPoint[];
  timelineData: TimelineDataPoint[];
}

function TracksSectionComponent({ trackData, timelineData }: TracksSectionProps) {
  return (
    <div className={styles.container}>
      {/* Big stat */}
      <div className={styles.statCard}>
        <div className={styles.statLabel}>Total Track Length Ridden</div>
        <div className={styles.statValue}>
          <AnimatedNumber target={stats.totalTrack} suffix=" ft" />
        </div>
        <div className={styles.statNote}>
          That's <strong>{(stats.totalTrack / 5280).toFixed(1)} miles</strong> — about{' '}
          {((stats.totalTrack / 5280 / 24) * 60).toFixed(0)} minutes of driving at highway speed
        </div>
      </div>

      <GlassCard title="📏 Track Length Rankings" subtitle="Feet of track per coaster" span>
        <TrackLengthChart data={trackData} />
      </GlassCard>

      <GlassCard
        title="⏳ Timeline: When These Rides Were Born"
        subtitle="Coasters sorted by year opened"
        span
      >
        <TimelineChart data={timelineData} />
      </GlassCard>
    </div>
  );
}

export const TracksSection = memo(TracksSectionComponent);
export default TracksSection;
