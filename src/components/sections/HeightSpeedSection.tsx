import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ScatterPlot, SpeedBarChart } from '../charts';
import { getParkColor, coasters } from '../../data';
import type { ScatterDataPoint, SpeedDataPoint } from '../../data/coasters.types';
import styles from './HeightSpeedSection.module.css';

interface HeightSpeedSectionProps {
  scatterData: ScatterDataPoint[];
  speedData: SpeedDataPoint[];
}

function HeightSpeedSectionComponent({ scatterData, speedData }: HeightSpeedSectionProps) {
  const dropAngleCoasters = coasters
    .filter((c) => c.dropAngle)
    .sort((a, b) => (b.dropAngle ?? 0) - (a.dropAngle ?? 0));

  return (
    <div className={styles.container}>
      <GlassCard
        title="⚡ Height vs Speed"
        subtitle="Does taller always mean faster? Bubble size = track length"
      >
        <ScatterPlot data={scatterData} />
      </GlassCard>

      <div className={styles.grid}>
        <GlassCard title="🏎️ Speed Rankings" subtitle="Top speed in mph">
          <SpeedBarChart data={speedData} />
        </GlassCard>

        <GlassCard
          title="🎯 Drop Angles"
          subtitle="The steeper the scarier — 90° is straight down, 91° is beyond vertical!"
        >
          <div className={styles.dropAngles}>
            {dropAngleCoasters.map((c, i) => {
              const parkColor = getParkColor(c.park);
              return (
                <div key={i} className={styles.dropRow}>
                  <div className={styles.dropName} style={{ color: parkColor }}>
                    {c.name}
                  </div>
                  <div className={styles.dropBar}>
                    <div
                      className={styles.dropFill}
                      style={{
                        width: `${((c.dropAngle ?? 0) / 91) * 100}%`,
                        background: `linear-gradient(90deg, ${parkColor}88, ${parkColor})`,
                      }}
                    />
                  </div>
                  <div
                    className={styles.dropValue}
                    style={{ color: (c.dropAngle ?? 0) >= 90 ? 'var(--color-extreme)' : 'var(--text-primary)' }}
                  >
                    {c.dropAngle}°
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

export const HeightSpeedSection = memo(HeightSpeedSectionComponent);
export default HeightSpeedSection;
