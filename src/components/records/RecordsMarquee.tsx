import { memo, useEffect, useState } from 'react';
import { useCoasterData } from '../../hooks/useCoasterData';
import type { Coaster, MarqueeClaim } from '../../data/coasters.types';
import styles from './RecordsMarquee.module.css';

const STATIC_CLAIM_LIMIT = 8;

// jsdom (and very old browsers) may lack matchMedia, so guard every call
function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') return;
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduced(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener?.('change', onChange);
    return () => mq.removeEventListener?.('change', onChange);
  }, []);

  return reduced;
}

interface RecordsMarqueeProps {
  onSelectCoaster: (coaster: Coaster) => void;
}

interface ClaimButtonProps {
  item: MarqueeClaim;
  onClick: (coasterId: string) => void;
  tabbable?: boolean;
}

function ClaimButton({ item, onClick, tabbable = true }: ClaimButtonProps) {
  return (
    <button
      type="button"
      className={styles.claim}
      onClick={() => onClick(item.coasterId)}
      tabIndex={tabbable ? 0 : -1}
    >
      <span className={styles.star} aria-hidden="true">
        ⭐
      </span>{' '}
      {item.claim} —{' '}
      <span className={styles.coasterName} style={{ color: item.fill }}>
        {item.coasterName}
      </span>
    </button>
  );
}

/**
 * Carnival-marquee ticker of every record and award claim in the collection.
 * The claim list is rendered twice inside one animated row so the CSS
 * translateX(-50%) loop is seamless. Hovering pauses the scroll; users who
 * prefer reduced motion get a static, capped list instead.
 */
function RecordsMarqueeComponent({ onSelectCoaster }: RecordsMarqueeProps) {
  const { recordsMarqueeData, findCoasterById } = useCoasterData();
  const prefersReducedMotion = usePrefersReducedMotion();

  const handleClick = (coasterId: string) => {
    const coaster = findCoasterById(coasterId);
    if (coaster) onSelectCoaster(coaster);
  };

  if (prefersReducedMotion) {
    const visible = recordsMarqueeData.slice(0, STATIC_CLAIM_LIMIT);
    const remaining = recordsMarqueeData.length - visible.length;
    return (
      <div className={styles.marquee}>
        <div className={styles.staticList}>
          {visible.map((item, i) => (
            <ClaimButton key={i} item={item} onClick={handleClick} />
          ))}
          {remaining > 0 && (
            <span className={styles.moreNote}>+{remaining} more records</span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.marquee}>
      <div className={styles.track}>
        {[0, 1].map((copy) => (
          <div key={copy} className={styles.group} aria-hidden={copy === 1}>
            {recordsMarqueeData.map((item, i) => (
              <ClaimButton
                key={`${copy}-${i}`}
                item={item}
                onClick={handleClick}
                tabbable={copy === 0}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export const RecordsMarquee = memo(RecordsMarqueeComponent);
export default RecordsMarquee;
