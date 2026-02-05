import { useState, useEffect, useRef, memo } from 'react';
import { ANIMATION } from '../../data/constants';

interface AnimatedNumberProps {
  target: number;
  suffix?: string;
  duration?: number;
  decimals?: number;
}

/**
 * Animated counter that triggers when element scrolls into view
 * Uses IntersectionObserver to detect visibility
 */
function AnimatedNumberComponent({
  target,
  suffix = '',
  duration = ANIMATION.DEFAULT_DURATION,
  decimals = 0,
}: AnimatedNumberProps) {
  const [value, setValue] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (hasAnimated.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated.current) {
          hasAnimated.current = true;
          let start = 0;
          const step = target / (duration / ANIMATION.FRAME_DURATION);

          const animate = () => {
            start += step;
            if (start >= target) {
              setValue(target);
              return;
            }
            setValue(decimals > 0 ? parseFloat(start.toFixed(decimals)) : Math.floor(start));
            requestAnimationFrame(animate);
          };

          animate();
          observer.disconnect();
        }
      },
      { threshold: ANIMATION.INTERSECTION_THRESHOLD }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [target, duration, decimals]);

  const displayValue = decimals > 0 ? value.toFixed(decimals) : value.toLocaleString();

  return (
    <span ref={ref}>
      {displayValue}
      {suffix}
    </span>
  );
}

export const AnimatedNumber = memo(AnimatedNumberComponent);
export default AnimatedNumber;
