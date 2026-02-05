import { memo } from 'react';
import { stats } from '../../data';
import styles from './Footer.module.css';

/**
 * Simple footer with attribution
 */
function FooterComponent() {
  return (
    <footer className={styles.footer}>
      <div className={styles.divider} />
      Reed's Roller Coaster Database · {stats.totalCoasters} Coasters · 9 Parks · Data compiled 2026
    </footer>
  );
}

export const Footer = memo(FooterComponent);
export default Footer;
