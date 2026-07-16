/**
 * Derived physics/metrics datasets
 * Computed once at module load, like the chart datasets in index.ts
 */

import { coasters, getParkColor, getParkGroup, truncateName } from './core';
import { PARK_STATES, PARK_GROUPS } from './constants';
import type {
  PacingDataPoint,
  ThrillDensityPoint,
  SkylinePoint,
  MarqueeClaim,
  StateGeo,
} from './coasters.types';

// Parse "M:SS" (optionally prefixed with "~") into seconds; null if unparseable
export function parseDurationToSeconds(duration: string | null): number | null {
  if (!duration) return null;
  const match = duration.trim().replace(/^~/, '').match(/^(\d+):(\d{2})$/);
  if (!match) return null;
  return parseInt(match[1], 10) * 60 + parseInt(match[2], 10);
}

const FEET_PER_MILE = 5280;

// Average speed over the full course (includes lift hill) vs top speed
export const pacingData: PacingDataPoint[] = coasters
  .filter((c) => c.trackLength && c.speed && parseDurationToSeconds(c.duration))
  .map((c) => {
    const seconds = parseDurationToSeconds(c.duration)!;
    return {
      name: truncateName(c.name),
      fullName: c.name,
      avgSpeed: Math.round(((c.trackLength! / seconds) * 3600 / FEET_PER_MILE) * 10) / 10,
      topSpeed: c.speed!,
      fill: getParkColor(c.park),
      park: c.park,
    };
  })
  .sort((a, b) => b.topSpeed - a.topSpeed);

// Inversions per minute for coasters that invert
export const thrillDensityData: ThrillDensityPoint[] = coasters
  .filter((c) => c.inversions > 0 && parseDurationToSeconds(c.duration))
  .map((c) => {
    const seconds = parseDurationToSeconds(c.duration)!;
    return {
      name: truncateName(c.name),
      fullName: c.name,
      inversions: c.inversions,
      perMinute: Math.round((c.inversions / (seconds / 60)) * 10) / 10,
      fill: getParkColor(c.park),
      park: c.park,
    };
  })
  .sort((a, b) => b.perMinute - a.perMinute);

// To-scale skyline silhouettes (tallest first)
export const skylineData: SkylinePoint[] = coasters
  .filter((c) => c.height)
  .sort((a, b) => b.height! - a.height!)
  .map((c) => ({
    id: c.id,
    name: c.name,
    height: c.height!,
    drop: c.drop,
    park: c.park,
    fill: getParkColor(c.park),
  }));

export const SKYLINE_EXCLUDED: string[] = coasters
  .filter((c) => !c.height)
  .map((c) => c.name);

export interface ReferenceObject {
  name: string;
  height: number;
  kind: 'statue' | 'house';
}

export const REFERENCE_OBJECTS: ReferenceObject[] = [
  { name: 'Statue of Liberty', height: 305, kind: 'statue' },
  { name: '2-story house', height: 25, kind: 'house' },
];

// Individual record claims split out of the free-text `records` field
export const recordsMarqueeData: MarqueeClaim[] = coasters
  .filter((c) => c.records)
  .flatMap((c) =>
    c.records!
      .split(';')
      .map((claim) => claim.trim())
      .filter(Boolean)
      .map((claim) => ({
        coasterId: c.id,
        coasterName: c.name,
        park: c.park,
        fill: getParkColor(c.park),
        claim,
      }))
  );

// State-level geography derived from data (replaces a stale hardcoded table)
export const parkGeography: StateGeo[] = Object.entries(
  coasters.reduce(
    (acc, c) => {
      const state = PARK_STATES[c.park] || 'Unknown';
      acc[state] = acc[state] || {};
      acc[state][c.park] = (acc[state][c.park] || 0) + 1;
      return acc;
    },
    {} as Record<string, Record<string, number>>
  )
)
  .map(([state, parkCounts]) => {
    const parks = Object.entries(parkCounts)
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count, color: getParkColor(name) }));
    return {
      state,
      count: parks.reduce((sum, p) => sum + p.count, 0),
      parks,
      // Color the state by its biggest park's group color
      color: PARK_GROUPS[getParkGroup(parks[0].name)] || parks[0].color,
    };
  })
  .sort((a, b) => b.count - a.count);
