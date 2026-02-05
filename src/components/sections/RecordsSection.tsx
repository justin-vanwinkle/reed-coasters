import { memo } from 'react';
import { RecordPodium } from '../records/RecordPodium';
import type { Coaster, RecordCategory } from '../../data/coasters.types';
import styles from './RecordsSection.module.css';

interface RecordsSectionProps {
  recordCategories: RecordCategory[];
  onSelectCoaster: (coaster: Coaster) => void;
}

function RecordsSectionComponent({ recordCategories, onSelectCoaster }: RecordsSectionProps) {
  return (
    <div className={styles.container}>
      {/* Hero Header */}
      <div className={styles.header}>
        <div className={styles.trophy}>🏆</div>
        <h2 className={styles.title}>Hall of Records</h2>
        <p className={styles.subtitle}>The ultimate champions of Reed's coaster collection</p>
      </div>

      {/* Podium Grid */}
      <div className={styles.grid}>
        {recordCategories.map((cat) => (
          <RecordPodium key={cat.id} category={cat} onSelectCoaster={onSelectCoaster} />
        ))}
      </div>
    </div>
  );
}

export const RecordsSection = memo(RecordsSectionComponent);
export default RecordsSection;
