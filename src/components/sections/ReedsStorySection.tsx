import { memo, useCallback } from 'react';
import { GlassCard } from '../ui/GlassCard';
import {
  LifetimeOdometer,
  FavoritesLeaderboard,
  FirstsTimeline,
  BraveryCurve,
} from '../story';
import { useCoasterData } from '../../hooks/useCoasterData';
import type { Coaster } from '../../data/coasters.types';
import styles from './ReedsStorySection.module.css';

interface ReedsStorySectionProps {
  onSelectCoaster: (coaster: Coaster) => void;
}

function ReedsStorySectionComponent({ onSelectCoaster }: ReedsStorySectionProps) {
  const { braveryData, firstsData, odometer, favoritesData, findCoasterById } = useCoasterData();

  const handleSelectId = useCallback(
    (coasterId: string) => {
      const coaster = findCoasterById(coasterId);
      if (coaster) onSelectCoaster(coaster);
    },
    [findCoasterById, onSelectCoaster]
  );

  return (
    <div className={styles.container}>
      <GlassCard title="🛤️ Lifetime Odometer" subtitle="Every foot of every ride, added up">
        <LifetimeOdometer odometer={odometer} />
      </GlassCard>

      <GlassCard
        title="📈 The Bravery Curve"
        subtitle="The biggest thing conquered at each age — watch the nerve grow"
      >
        <BraveryCurve data={braveryData} />
      </GlassCard>

      <div className={styles.grid}>
        <GlassCard title="🥇 Most Ridden" subtitle="The coasters worth getting back in line for">
          <FavoritesLeaderboard favorites={favoritesData} onSelect={handleSelectId} />
        </GlassCard>

        <GlassCard
          title="⭐ Coaster Firsts"
          subtitle="Milestones on the road from kiddie coaster to giga"
        >
          <FirstsTimeline milestones={firstsData} onSelect={handleSelectId} />
        </GlassCard>
      </div>
    </div>
  );
}

export const ReedsStorySection = memo(ReedsStorySectionComponent);
export default ReedsStorySection;
