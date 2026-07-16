import { memo } from 'react';
import { GlassCard } from '../ui/GlassCard';
import { BattleArena, ThrillLeaderboard } from '../showdown';
import { useCoasterData } from '../../hooks/useCoasterData';
import type { Coaster } from '../../data/coasters.types';
import styles from './ShowdownSection.module.css';

interface ShowdownSectionProps {
  onSelectCoaster: (coaster: Coaster) => void;
}

function ShowdownSectionComponent({ onSelectCoaster }: ShowdownSectionProps) {
  const { thrillScores } = useCoasterData();

  return (
    <div className={styles.grid}>
      <GlassCard title="⚔️ Head-to-Head" subtitle="Pick any two, settle it" span>
        <BattleArena />
      </GlassCard>

      <GlassCard
        title="🔥 Thrill Score"
        subtitle="One number to rank them all — 30% height, 25% speed, 15% loops, 10% drop angle, 10% length, 10% special elements"
        span
      >
        <ThrillLeaderboard entries={thrillScores} onSelectCoaster={onSelectCoaster} />
      </GlassCard>
    </div>
  );
}

export const ShowdownSection = memo(ShowdownSectionComponent);
export default ShowdownSection;
