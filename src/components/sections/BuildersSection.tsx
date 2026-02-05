import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { coasters, stats, MFR_COLORS } from '../../data';
import type { PieDataPoint } from '../../data/coasters.types';
import styles from './BuildersSection.module.css';

const GEOGRAPHY = [
  {
    state: 'Florida',
    count: 17,
    color: '#FF6B6B',
    parks: 'Busch Gardens Tampa (7), SeaWorld Orlando (3), Walt Disney World (7)',
  },
  { state: 'Ohio', count: 6, color: '#4ECDC4', parks: 'Kings Island (6)' },
  {
    state: 'North Carolina',
    count: 6,
    color: '#6BCB77',
    parks: 'Carowinds (5), Jellystone Park (1)',
  },
];

interface BuildersSectionProps {
  mfrPieData: PieDataPoint[];
}

function BuildersSectionComponent({ mfrPieData }: BuildersSectionProps) {
  // Get coaster types
  const typeCounts: Record<string, number> = {};
  coasters.forEach((c) => {
    typeCounts[c.coasterType] = (typeCounts[c.coasterType] || 0) + 1;
  });
  const typeData = Object.entries(typeCounts).sort((a, b) => b[1] - a[1]);

  const colors = [
    '#4ECDC4',
    '#FFD93D',
    '#FF6B6B',
    '#4D96FF',
    '#6BCB77',
    '#C084FC',
    '#FF9A3C',
    '#00BFA5',
    '#FF4081',
    '#8E99A4',
  ];

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

      <GlassCard title="🗺️ Geography" subtitle="Reed's coasters by state">
        <div className={styles.geoList}>
          {GEOGRAPHY.map((s, i) => (
            <div
              key={i}
              className={styles.geoCard}
              style={{
                background: `${s.color}08`,
                border: `1px solid ${s.color}22`,
              }}
            >
              <div className={styles.geoContent}>
                <div className={styles.geoState} style={{ color: s.color }}>
                  {s.state}
                </div>
                <div className={styles.geoParks}>{s.parks}</div>
              </div>
              <div className={styles.geoCount} style={{ color: s.color }}>
                {s.count}
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}

export const BuildersSection = memo(BuildersSectionComponent);
export default BuildersSection;
