import { memo } from 'react';
import type { TooltipProps } from 'recharts';
import styles from './Tooltip.module.css';

interface DarkTooltipProps extends TooltipProps<number, string> {
  formatter?: (value: number, name: string) => string;
}

/**
 * Custom dark tooltip for Recharts visualizations
 * Provides consistent styling across all charts
 */
function DarkTooltipComponent({
  active,
  payload,
  label,
  formatter,
}: DarkTooltipProps) {
  if (!active || !payload?.length) return null;

  return (
    <div className={styles.tooltip}>
      <p className={styles.label}>{label || payload[0]?.payload?.name}</p>
      {payload.map((p, i) => (
        <p
          key={i}
          className={styles.value}
          style={{ color: p.color || 'var(--text-tertiary)' }}
        >
          {p.name}:{' '}
          <strong>
            {formatter ? formatter(p.value as number, p.name as string) : p.value}
          </strong>
        </p>
      ))}
    </div>
  );
}

export const DarkTooltip = memo(DarkTooltipComponent);
export default DarkTooltip;
