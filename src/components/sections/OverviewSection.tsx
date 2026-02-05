import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { HeightBarChart, PieChartComponent, DecadeBarChart } from '../charts';
import type {
  HeightDataPoint,
  PieDataPoint,
  DecadeDataPoint,
} from '../../data/coasters.types';
import styles from './OverviewSection.module.css';

interface OverviewSectionProps {
  heightData: HeightDataPoint[];
  parkPieData: PieDataPoint[];
  mfrPieData: PieDataPoint[];
  decadeData: DecadeDataPoint[];
}

function OverviewSectionComponent({
  heightData,
  parkPieData,
  mfrPieData,
  decadeData,
}: OverviewSectionProps) {
  return (
    <div className={styles.grid}>
      <GlassCard
        title="🏔️ The Skyline"
        subtitle="Every coaster Reed has ridden, ranked by height"
        span
      >
        <HeightBarChart data={heightData} />
      </GlassCard>

      <GlassCard title="🎡 Coasters by Park" subtitle="Where Reed has ridden">
        <PieChartComponent data={parkPieData} />
      </GlassCard>

      <GlassCard title="🏭 Manufacturer DNA" subtitle="Who built Reed's rides?">
        <PieChartComponent data={mfrPieData} />
      </GlassCard>

      <GlassCard
        title="📅 Coasters by Decade"
        subtitle="50+ years of coaster engineering"
        span
      >
        <DecadeBarChart data={decadeData} />
      </GlassCard>
    </div>
  );
}

export const OverviewSection = memo(OverviewSectionComponent);
export default OverviewSection;
