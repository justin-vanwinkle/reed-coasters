import { memo } from 'react';
import styles from './ViewToggle.module.css';

type ViewType = 'table' | 'cards';

interface ViewToggleProps {
  view: ViewType;
  onViewChange: (view: ViewType) => void;
}

/**
 * Toggle between table and card views for data display
 */
function ViewToggleComponent({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className={styles.container}>
      <button
        onClick={() => onViewChange('table')}
        className={`${styles.button} ${view === 'table' ? styles.active : ''}`}
        aria-pressed={view === 'table'}
      >
        Table View
      </button>
      <button
        onClick={() => onViewChange('cards')}
        className={`${styles.button} ${view === 'cards' ? styles.active : ''}`}
        aria-pressed={view === 'cards'}
      >
        Card View
      </button>
    </div>
  );
}

export const ViewToggle = memo(ViewToggleComponent);
export default ViewToggle;
