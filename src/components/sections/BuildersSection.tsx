import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ElementsMatrix, ParkMap } from '../builders';
import { coasters, stats } from '../../data';
import { CHART_COLORS } from '../charts/shared';
import type { Coaster, PieDataPoint } from '../../data/coasters.types';
import styles from './BuildersSection.module.css';

interface BuildersSectionProps {
  mfrPieData: PieDataPoint[];
  // Optional until the dashboard wiring passes it through — the section and
  // its children are safe to render without a handler in the meantime.
  onSelectCoaster?: (coaster: Coaster) => void;
}

function BuildersSectionComponent({ mfrPieData, onSelectCoaster }: BuildersSectionProps) {
  // Get coaster types
  const typeCounts: Record<string, number> = {};
  coasters.forEach((c) => {
    typeCounts[c.coasterType] = (typeCounts[c.coasterType] || 0) + 1;
  });
  const typeData = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  const colors = CHART_COLORS;

  return (
    <div className={styles.grid}>
      <GlassCard title="🏭 Manufacturer Breakdown" subtitle="B&M dominates Reed's list" span>
        <div className={styles.mfrList}>
          {mfrPieData.map((m, i) => {
            const pct = (m.value / stats.totalCoasters) * 100;
            const mfrCoasters = coasters
              .filter((c) => c.manufacturerShort === m.name)
              .map((c) => c.name);
            return (
              <div key={i} className={styles.mfrItem}>
                <div className={styles.mfrHeader}>
                  <span className={styles.mfrName} style={{ color: m.fill }}>
                    {m.name}
                  </span>
                  <span className={styles.mfrCount}>
                    {m.value} coasters ({pct.toFixed(0)}%)
                  </span>
                </div>
                <div className={styles.mfrBar}>
                  <div
                    className={styles.mfrFill}
                    style={{
                      width: `${pct}%`,
                      background: `linear-gradient(90deg, ${m.fill}88, ${m.fill})`,
                    }}
                  />
                </div>
                <div className={styles.mfrCoasters}>{mfrCoasters.join(' · ')}</div>
              </div>
            );
          })}
        </div>
      </GlassCard>

      <GlassCard title="🎠 Coaster Types" subtitle="The variety of ride experiences">
        <div className={styles.typeTags}>
          {typeData.map(([type, count], i) => (
            <div
              key={i}
              className={styles.typeTag}
              style={{
                background: `${colors[i % colors.length]}15`,
                border: `1px solid ${colors[i % colors.length]}33`,
              }}
            >
              <span className={styles.typeCount} style={{ color: colors[i % colors.length] }}>
                {count}
              </span>
              <span className={styles.typeName}>{type}</span>
            </div>
          ))}
        </div>
      </GlassCard>

      <GlassCard
        title="🎬 Special Elements"
        subtitle="What the fine print says each ride actually does"
        span
      >
        <ElementsMatrix onSelectCoaster={onSelectCoaster} />
      </GlassCard>

      <GlassCard title="🗺️ Road Trip Map" subtitle="Reed's coasters by state">
        <ParkMap />
      </GlassCard>
    </div>
  );
}

export const BuildersSection = memo(BuildersSectionComponent);
export default BuildersSection;
