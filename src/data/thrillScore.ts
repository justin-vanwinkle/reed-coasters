/**
 * Composite thrill scoring + radar-chart normalization
 * Every stat is normalized against the dataset max so scores are 0–100 and
 * pentagons for different coasters are directly comparable.
 */

import { coasters } from './core';
import { parseDurationToSeconds } from './derived';
import { elementsMatrix } from './elements';
import type { Coaster, ThrillScoreEntry, RadarPoint } from './coasters.types';

function maxOf(values: (number | null)[]): number {
  return Math.max(...values.map((v) => v ?? 0), 1);
}

const MAX = {
  height: maxOf(coasters.map((c) => c.height)),
  speed: maxOf(coasters.map((c) => c.speed)),
  inversions: maxOf(coasters.map((c) => c.inversions)),
  dropAngle: maxOf(coasters.map((c) => c.dropAngle)),
  trackLength: maxOf(coasters.map((c) => c.trackLength)),
  durationSeconds: maxOf(coasters.map((c) => parseDurationToSeconds(c.duration))),
};

function norm(value: number | null, max: number): number {
  return (value ?? 0) / max;
}

const BONUS_TAGS = ['launch', 'beyondVertical', 'airtime', 'backwards'];

function elementBonus(coaster: Coaster): number {
  const row = elementsMatrix.find((r) => r.coaster.id === coaster.id);
  if (!row) return 0;
  return Math.min(10, BONUS_TAGS.filter((id) => row.tagIds.has(id)).length * 2.5);
}

export const thrillScores: ThrillScoreEntry[] = coasters
  .map((coaster) => {
    const breakdown = {
      height: Math.round(30 * norm(coaster.height, MAX.height) * 10) / 10,
      speed: Math.round(25 * norm(coaster.speed, MAX.speed) * 10) / 10,
      inversions: Math.round(15 * norm(coaster.inversions, MAX.inversions) * 10) / 10,
      dropAngle: Math.round(10 * norm(coaster.dropAngle, MAX.dropAngle) * 10) / 10,
      trackLength: Math.round(10 * norm(coaster.trackLength, MAX.trackLength) * 10) / 10,
      elements: elementBonus(coaster),
    };
    const score =
      Math.round(
        (breakdown.height +
          breakdown.speed +
          breakdown.inversions +
          breakdown.dropAngle +
          breakdown.trackLength +
          breakdown.elements) *
          10
      ) / 10;
    return { coaster, score, breakdown };
  })
  .sort((a, b) => b.score - a.score);

export function getThrillScore(id: string): ThrillScoreEntry | undefined {
  return thrillScores.find((entry) => entry.coaster.id === id);
}

// Five radar axes, each 0–100 vs the dataset max, with raw values for tooltips
export function getRadarData(coaster: Coaster): RadarPoint[] {
  const seconds = parseDurationToSeconds(coaster.duration);
  return [
    {
      axis: 'Height',
      value: Math.round(norm(coaster.height, MAX.height) * 100),
      raw: coaster.height ? `${coaster.height} ft` : '—',
    },
    {
      axis: 'Speed',
      value: Math.round(norm(coaster.speed, MAX.speed) * 100),
      raw: coaster.speed ? `${coaster.speed} mph` : '—',
    },
    {
      axis: 'Length',
      value: Math.round(norm(coaster.trackLength, MAX.trackLength) * 100),
      raw: coaster.trackLength ? `${coaster.trackLength.toLocaleString()} ft` : '—',
    },
    {
      axis: 'Loops',
      value: Math.round(norm(coaster.inversions, MAX.inversions) * 100),
      raw: `${coaster.inversions}`,
    },
    {
      axis: 'Ride Time',
      value: Math.round(norm(seconds, MAX.durationSeconds) * 100),
      raw: coaster.duration ? coaster.duration.replace(/^~/, '≈') : '—',
    },
  ];
}
