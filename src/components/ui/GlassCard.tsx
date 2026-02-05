import { ReactNode, memo } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  span?: boolean;
  className?: string;
}

/**
 * Glassmorphism card wrapper with optional title and subtitle
 * Used as the primary container for dashboard sections
 */
function GlassCardComponent({
  title,
  subtitle,
  children,
  span = false,
  className = '',
}: GlassCardProps) {
  return (
    <div
      className={`${styles.card} ${span ? styles.span : ''} ${className}`}
    >
      <h2 className={styles.title}>{title}</h2>
      {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
      {!subtitle && <div className={styles.spacer} />}
      {children}
    </div>
  );
}

export const GlassCard = memo(GlassCardComponent);
export default GlassCard;
