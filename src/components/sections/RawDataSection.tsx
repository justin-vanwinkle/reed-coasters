import { memo, useState } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { ViewToggle } from '../ui/ViewToggle';
import { CoasterTable } from '../coaster/CoasterTable';
import { CoasterCard } from '../coaster/CoasterCard';
import type { Coaster } from '../../data/coasters.types';
import styles from './RawDataSection.module.css';

interface RawDataSectionProps {
  coasters: Coaster[];
  onSelectCoaster: (coaster: Coaster) => void;
}

function RawDataSectionComponent({ coasters, onSelectCoaster }: RawDataSectionProps) {
  const [view, setView] = useState<'table' | 'cards'>('cards');

  return (
    <GlassCard
      title="📊 Raw Coaster Data"
      subtitle={`Complete database of ${coasters.length} roller coasters with all stats and details`}
      span
    >
      <ViewToggle view={view} onViewChange={setView} />

      {view === 'table' ? (
        <CoasterTable coasters={coasters} onSelect={onSelectCoaster} />
      ) : (
        <div className={styles.cardGrid}>
          {coasters.map((coaster) => (
            <CoasterCard key={coaster.id} coaster={coaster} onSelect={onSelectCoaster} />
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export const RawDataSection = memo(RawDataSectionComponent);
export default RawDataSection;
