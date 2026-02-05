import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { CoasterCard } from '../coaster/CoasterCard';
import type { Coaster } from '../../data/coasters.types';
import styles from './RawDataSection.module.css';

interface RawDataSectionProps {
  coasters: Coaster[];
  onSelectCoaster: (coaster: Coaster) => void;
}

function RawDataSectionComponent({ coasters, onSelectCoaster }: RawDataSectionProps) {
  return (
    <GlassCard
      title="🎢 Coaster Details"
      subtitle={`Browse all ${coasters.length} roller coasters`}
      span
    >
      <div className={styles.cardGrid}>
        {coasters.map((coaster) => (
          <CoasterCard key={coaster.id} coaster={coaster} onSelect={onSelectCoaster} />
        ))}
      </div>
    </GlassCard>
  );
}

export const RawDataSection = memo(RawDataSectionComponent);
export default RawDataSection;
