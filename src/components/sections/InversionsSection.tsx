import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { InversionBarChart } from '../charts';
import { stats } from '../../data';
import type { InversionDataPoint, GForceDataPoint } from '../../data/coasters.types';
import styles from './InversionsSection.module.css';

interface InversionsSectionProps {
  inversionData: InversionDataPoint[];
  gforceData: GForceDataPoint[];
}

function InversionsSectionComponent({ inversionData, gforceData }: InversionsSectionProps) {
  return (
    <div className={styles.grid}>
      <GlassCard title="🔄 Inversion Kings" subtitle="Coasters that flip you upside down" span>
        <InversionBarChart data={inversionData} />
      </GlassCard>

      <GlassCard title="💥 G-Force Meter" subtitle="How hard these rides push you into your seat">
        <div className={styles.gforceList}>
          {gforceData.map((c, i) => (
            <div key={i} className={styles.gforceItem}>
              <div className={styles.gforceHeader}>
                <span className={styles.gforceName} style={{ color: c.fill }}>
                  {c.name}
                </span>
                <span
                  className={styles.gforceValue}
                  style={{ color: c.gforce >= 4.5 ? '#FF4081' : 'var(--text-primary)' }}
                >
                  {c.gforce} G
                </span>
              </div>
              <div className={styles.gforceBar}>
                <div
                  className={styles.gforceFill}
                  style={{
                    width: `${(c.gforce / 5.5) * 100}%`,
                    background:
                      c.gforce >= 4.5
                        ? 'linear-gradient(90deg, #FF6B6B, #FF4081)'
                        : `linear-gradient(90deg, ${c.fill}66, ${c.fill})`,
                  }}
                >
                  {c.gforce >= 4.5 && <span className={styles.extremeLabel}>EXTREME</span>}
                </div>
                {[1, 2, 3, 4].map((n) => (
                  <div
                    key={n}
                    className={styles.refLine}
                    style={{ left: `${(n / 5.5) * 100}%` }}
                  />
                ))}
              </div>
            </div>
          ))}
          <div className={styles.gforceScale}>
            {[0, 1, 2, 3, 4, 5].map((n) => (
              <span key={n}>{n}G</span>
            ))}
          </div>
          <p className={styles.gforceNote}>
            For reference: 1G = normal gravity · Fighter pilot turns ≈ 9G · Space shuttle launch ≈ 3G
          </p>
        </div>
      </GlassCard>

      <GlassCard
        title="🧮 Inversion Breakdown"
        subtitle={`Where all ${stats.totalInversions} inversions come from`}
      >
        <div className={styles.inversionList}>
          {inversionData.map((c, i) => {
            const pct = (c.inversions / stats.totalInversions) * 100;
            return (
              <div key={i} className={styles.inversionRow}>
                <div className={styles.inversionName} style={{ color: c.fill }}>
                  {c.name}
                </div>
                <div className={styles.inversionDots}>
                  {Array.from({ length: c.inversions }).map((_, j) => (
                    <div
                      key={j}
                      className={styles.inversionDot}
                      style={{ background: c.fill }}
                    >
                      {j + 1}
                    </div>
                  ))}
                </div>
                <div className={styles.inversionPct}>{pct.toFixed(0)}%</div>
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}

export const InversionsSection = memo(InversionsSectionComponent);
export default InversionsSection;
