import { memo } from 'react';
import type { Coaster } from '../../data/coasters.types';
import styles from './CoasterTable.module.css';

interface CoasterTableProps {
  coasters: Coaster[];
  onSelect?: (coaster: Coaster) => void;
}

const DISPLAY_COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'park', label: 'Park' },
  { key: 'manufacturerShort', label: 'Manufacturer' },
  { key: 'yearOpened', label: 'Year' },
  { key: 'coasterType', label: 'Type' },
  { key: 'height', label: 'Height (ft)' },
  { key: 'speed', label: 'Speed (mph)' },
  { key: 'inversions', label: 'Inversions' },
  { key: 'trackLength', label: 'Track (ft)' },
  { key: 'maxGForce', label: 'G-Force' },
] as const;

/**
 * Full-width data table for displaying all coaster information
 */
function CoasterTableComponent({ coasters, onSelect }: CoasterTableProps) {
  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return '—';
    if (typeof value === 'number') return value.toLocaleString();
    return String(value);
  };

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            {DISPLAY_COLUMNS.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {coasters.map((coaster, i) => (
            <tr
              key={coaster.id}
              className={`${styles.tr} ${i % 2 ? styles.trAlt : ''}`}
              onClick={() => onSelect?.(coaster)}
              style={{ cursor: onSelect ? 'pointer' : 'default' }}
            >
              {DISPLAY_COLUMNS.map((col) => (
                <td key={col.key} className={styles.td}>
                  {formatValue(coaster[col.key as keyof Coaster])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const CoasterTable = memo(CoasterTableComponent);
export default CoasterTable;
