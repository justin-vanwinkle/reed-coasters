/**
 * Reed's personal ride-history derivations
 * Built from timesRidden / reedsAgeOnFirstRide. Ride order within a single
 * age is unknown, so everything here is phrased per-age, never sequenced.
 */

import { coasters, getParkColor } from './core';
import { parseDurationToSeconds } from './derived';
import { extractElementTags } from './elements';
import type { Coaster, BraveryPoint, Milestone, OdometerTotals, FavoriteEntry } from './coasters.types';

const ridden = coasters.filter((c) => c.reedsAgeOnFirstRide != null);

const ages = [...new Set(ridden.map((c) => c.reedsAgeOnFirstRide!))].sort((a, b) => a - b);

// Cumulative "biggest thing conquered so far" per age
export const braveryData: BraveryPoint[] = ages.map((age) => {
  const soFar = ridden.filter((c) => c.reedsAgeOnFirstRide! <= age);
  const withHeight = soFar.filter((c) => c.height);
  const withSpeed = soFar.filter((c) => c.speed);
  const tallest = withHeight.reduce((best, c) => (c.height! > best.height! ? c : best), withHeight[0]);
  const fastest = withSpeed.reduce((best, c) => (c.speed! > best.speed! ? c : best), withSpeed[0]);
  return {
    age,
    maxHeight: tallest?.height ?? 0,
    maxSpeed: fastest?.speed ?? 0,
    maxInversions: Math.max(0, ...soFar.map((c) => c.inversions)),
    tallestName: tallest?.name ?? '',
    fastestName: fastest?.name ?? '',
    newCount: ridden.filter((c) => c.reedsAgeOnFirstRide === age).length,
  };
});

// "First X" milestones: min age satisfying a predicate; ties within that age
// broken by a superlative so the pick is deterministic and impressive
interface MilestoneRule {
  label: string;
  icon: string;
  predicate: (c: Coaster) => boolean;
  rank: (c: Coaster) => number;
  detail: (c: Coaster) => string;
}

const MILESTONE_RULES: MilestoneRule[] = [
  {
    label: 'First coaster ever',
    icon: '🎢',
    predicate: () => true,
    rank: (c) => -(c.height ?? 0),
    detail: (c) => `${c.height ?? '?'} ft tall — where it all began`,
  },
  {
    label: 'First wooden coaster',
    icon: '🪵',
    predicate: (c) => c.coasterType.toLowerCase().includes('wooden'),
    rank: (c) => (c.height ?? 0),
    detail: (c) => `${(c.trackLength ?? 0).toLocaleString()} ft of classic wooden track`,
  },
  {
    label: 'First time upside down',
    icon: '🙃',
    predicate: (c) => c.inversions > 0,
    rank: (c) => c.inversions,
    detail: (c) => `${c.inversions} inversion${c.inversions === 1 ? '' : 's'} in one ride`,
  },
  {
    label: 'First launch coaster',
    icon: '🚀',
    predicate: (c) => extractElementTags(c).some((t) => t.id === 'launch'),
    rank: (c) => c.speed ?? 0,
    detail: (c) => `catapulted to ${c.speed ?? '?'} mph`,
  },
  {
    label: 'First 100-footer',
    icon: '🏔️',
    predicate: (c) => (c.height ?? 0) >= 100,
    rank: (c) => c.height!,
    detail: (c) => `${c.height} ft tall`,
  },
  {
    label: 'First 200-footer',
    icon: '⛰️',
    predicate: (c) => (c.height ?? 0) >= 200,
    rank: (c) => c.height!,
    detail: (c) => `${c.height} ft tall`,
  },
  {
    label: 'Broke 300 feet',
    icon: '🗻',
    predicate: (c) => (c.height ?? 0) >= 300,
    rank: (c) => c.height!,
    detail: (c) => `${c.height} ft — taller than the Statue of Liberty`,
  },
  {
    label: 'First 60+ mph coaster',
    icon: '💨',
    predicate: (c) => (c.speed ?? 0) >= 60,
    rank: (c) => c.speed!,
    detail: (c) => `${c.speed} mph`,
  },
  {
    label: 'Broke 90 mph',
    icon: '⚡',
    predicate: (c) => (c.speed ?? 0) >= 90,
    rank: (c) => c.speed!,
    detail: (c) => `${c.speed} mph — highway speeds with no roof`,
  },
  {
    label: 'First giga coaster',
    icon: '👑',
    predicate: (c) => c.coasterType.toLowerCase().includes('giga'),
    rank: (c) => c.height ?? 0,
    detail: () => 'one of only a handful of giga coasters on Earth',
  },
];

export const firstsData: Milestone[] = MILESTONE_RULES.flatMap((rule) => {
  const candidates = ridden.filter(rule.predicate);
  if (candidates.length === 0) return [];
  const minAge = Math.min(...candidates.map((c) => c.reedsAgeOnFirstRide!));
  const pick = candidates
    .filter((c) => c.reedsAgeOnFirstRide === minAge)
    .sort((a, b) => rule.rank(b) - rule.rank(a))[0];
  return [
    {
      age: minAge,
      label: rule.label,
      detail: rule.detail(pick),
      coasterId: pick.id,
      coasterName: pick.name,
      icon: rule.icon,
      fill: getParkColor(pick.park),
    },
  ];
}).sort((a, b) => a.age - b.age);

// Lifetime totals across every ride ever taken
export const odometer: OdometerTotals = ridden.reduce(
  (acc, c) => {
    const rides = c.timesRidden ?? 0;
    acc.totalRides += rides;
    acc.totalUpsideDown += rides * c.inversions;
    if (c.trackLength) {
      acc.totalFeet += rides * c.trackLength;
    } else if (rides > 0) {
      acc.coastersExcludedFromFeet.push(c.name);
    }
    const seconds = parseDurationToSeconds(c.duration);
    if (seconds) acc.totalSeconds += rides * seconds;
    acc.totalMiles = Math.round((acc.totalFeet / 5280) * 10) / 10;
    return acc;
  },
  {
    totalRides: 0,
    totalFeet: 0,
    totalMiles: 0,
    totalSeconds: 0,
    totalUpsideDown: 0,
    coastersExcludedFromFeet: [] as string[],
  }
);

// Most re-ridden coasters
export const favoritesData: FavoriteEntry[] = coasters
  .filter((c) => (c.timesRidden ?? 0) >= 2)
  .sort((a, b) => (b.timesRidden ?? 0) - (a.timesRidden ?? 0) || (b.height ?? 0) - (a.height ?? 0))
  .map((c) => ({
    id: c.id,
    name: c.name,
    park: c.park,
    fill: getParkColor(c.park),
    timesRidden: c.timesRidden!,
  }));
