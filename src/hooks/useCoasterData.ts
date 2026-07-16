/**
 * useCoasterData Hook
 * Provides memoized access to coaster data and derived computations
 */

import { useMemo } from 'react';
import {
  coasters,
  stats,
  heightData,
  speedData,
  scatterData,
  inversionData,
  parkPieData,
  mfrPieData,
  timelineData,
  decadeData,
  trackData,
  gforceData,
  recordCategories,
  pacingData,
  thrillDensityData,
  skylineData,
  SKYLINE_EXCLUDED,
  recordsMarqueeData,
  parkGeography,
  elementsMatrix,
  elementTagCounts,
  braveryData,
  firstsData,
  odometer,
  favoritesData,
  thrillScores,
  getThrillScore,
  getRadarData,
  findCoasterByName,
  findCoasterById,
  getParkColor,
  getMfrColor,
  getParkGroup,
  truncateName,
} from '../data';
import type { ElementsMatrixRow } from '../data';
import type {
  Coaster,
  CoasterStats,
  HeightDataPoint,
  SpeedDataPoint,
  ScatterDataPoint,
  InversionDataPoint,
  PieDataPoint,
  TimelineDataPoint,
  TrackDataPoint,
  GForceDataPoint,
  DecadeDataPoint,
  RecordCategory,
  PacingDataPoint,
  ThrillDensityPoint,
  SkylinePoint,
  MarqueeClaim,
  StateGeo,
  BraveryPoint,
  Milestone,
  OdometerTotals,
  FavoriteEntry,
  ThrillScoreEntry,
  RadarPoint,
} from '../data/coasters.types';

export interface UseCoasterDataReturn {
  // Core data
  coasters: Coaster[];
  stats: CoasterStats;

  // Chart data (pre-computed)
  heightData: HeightDataPoint[];
  speedData: SpeedDataPoint[];
  scatterData: ScatterDataPoint[];
  inversionData: InversionDataPoint[];
  parkPieData: PieDataPoint[];
  mfrPieData: PieDataPoint[];
  timelineData: TimelineDataPoint[];
  decadeData: DecadeDataPoint[];
  trackData: TrackDataPoint[];
  gforceData: GForceDataPoint[];
  recordCategories: RecordCategory[];

  // Derived datasets
  pacingData: PacingDataPoint[];
  thrillDensityData: ThrillDensityPoint[];
  skylineData: SkylinePoint[];
  skylineExcluded: string[];
  recordsMarqueeData: MarqueeClaim[];
  parkGeography: StateGeo[];
  elementsMatrix: ElementsMatrixRow[];
  elementTagCounts: Record<string, number>;
  braveryData: BraveryPoint[];
  firstsData: Milestone[];
  odometer: OdometerTotals;
  favoritesData: FavoriteEntry[];
  thrillScores: ThrillScoreEntry[];

  // Utility functions
  getThrillScore: (id: string) => ThrillScoreEntry | undefined;
  getRadarData: (coaster: Coaster) => RadarPoint[];
  findCoasterByName: (name: string) => Coaster | undefined;
  findCoasterById: (id: string) => Coaster | undefined;
  getParkColor: (park: string) => string;
  getMfrColor: (mfr: string) => string;
  getParkGroup: (park: string) => string;
  truncateName: (name: string, maxLength?: number) => string;
}

/**
 * Hook providing access to all coaster data and utilities
 * Data is pre-computed at module load time, so this hook mainly provides
 * a convenient API and ensures type safety
 */
export function useCoasterData(): UseCoasterDataReturn {
  // The data is already computed at module level, so we just return references
  // Using useMemo here ensures stable references across re-renders
  return useMemo(
    () => ({
      coasters,
      stats,
      heightData,
      speedData,
      scatterData,
      inversionData,
      parkPieData,
      mfrPieData,
      timelineData,
      decadeData,
      trackData,
      gforceData,
      recordCategories,
      pacingData,
      thrillDensityData,
      skylineData,
      skylineExcluded: SKYLINE_EXCLUDED,
      recordsMarqueeData,
      parkGeography,
      elementsMatrix,
      elementTagCounts,
      braveryData,
      firstsData,
      odometer,
      favoritesData,
      thrillScores,
      getThrillScore,
      getRadarData,
      findCoasterByName,
      findCoasterById,
      getParkColor,
      getMfrColor,
      getParkGroup,
      truncateName,
    }),
    []
  );
}

export default useCoasterData;
