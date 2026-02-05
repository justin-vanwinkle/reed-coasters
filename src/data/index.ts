/**
 * Coaster Data Module
 * Single source of truth for all coaster data and derived computations
 */

import rawCoasters from './coasters.json';
import {
  PARK_COLORS,
  PARK_GROUPS,
  MFR_COLORS,
  MFR_SHORT_NAMES,
  DISNEY_PARKS,
  POV_VIDEOS,
} from './constants';
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
} from './coasters.types';

// Helper to get park group (Disney parks grouped as "Walt Disney World")
export function getParkGroup(park: string): string {
  if (DISNEY_PARKS.includes(park)) return 'Walt Disney World';
  return park;
}

// Helper to get manufacturer short name
function getMfrShortName(manufacturer: string): string {
  return MFR_SHORT_NAMES[manufacturer] || manufacturer;
}

// Helper to truncate long names
export function truncateName(name: string, maxLength = 18): string {
  return name.length > maxLength ? name.slice(0, maxLength - 2) + '…' : name;
}

// Helper to get park color
export function getParkColor(park: string): string {
  return PARK_COLORS[park] || '#4ECDC4';
}

// Helper to get manufacturer color
export function getMfrColor(mfr: string): string {
  return MFR_COLORS[mfr] || '#8E99A4';
}

// Transform raw JSON data into typed Coaster objects with computed fields
export const coasters: Coaster[] = rawCoasters.map((c) => ({
  ...c,
  parkGroup: getParkGroup(c.park),
  manufacturerShort: getMfrShortName(c.manufacturer),
  povVideo: POV_VIDEOS[c.name] || null,
}));

// Computed statistics
export const stats: CoasterStats = {
  totalCoasters: coasters.length,
  totalTrack: coasters.reduce((sum, c) => sum + (c.trackLength || 0), 0),
  totalInversions: coasters.reduce((sum, c) => sum + c.inversions, 0),
  maxHeight: Math.max(...coasters.filter((c) => c.height).map((c) => c.height!)),
  maxSpeed: Math.max(...coasters.filter((c) => c.speed).map((c) => c.speed!)),
  maxGForce: Math.max(...coasters.filter((c) => c.maxGForce).map((c) => c.maxGForce!)),
  avgSpeed: Math.round(
    coasters.filter((c) => c.speed).reduce((sum, c) => sum + c.speed!, 0) /
      coasters.filter((c) => c.speed).length
  ),
  parkCounts: coasters.reduce(
    (acc, c) => {
      const group = getParkGroup(c.park);
      acc[group] = (acc[group] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ),
  mfrCounts: coasters.reduce(
    (acc, c) => {
      acc[c.manufacturerShort] = (acc[c.manufacturerShort] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  ),
  decadeCounts: coasters
    .filter((c) => c.yearOpened)
    .reduce(
      (acc, c) => {
        const decade = Math.floor(c.yearOpened! / 10) * 10 + 's';
        acc[decade] = (acc[decade] || 0) + 1;
        return acc;
      },
      {} as Record<string, number>
    ),
};

// Pre-computed chart data
export const heightData: HeightDataPoint[] = coasters
  .filter((c) => c.height)
  .sort((a, b) => b.height! - a.height!)
  .map((c) => ({
    name: truncateName(c.name),
    fullName: c.name,
    height: c.height!,
    fill: getParkColor(c.park),
    park: c.park,
  }));

export const speedData: SpeedDataPoint[] = coasters
  .filter((c) => c.speed)
  .sort((a, b) => b.speed! - a.speed!)
  .map((c) => ({
    name: truncateName(c.name),
    fullName: c.name,
    speed: c.speed!,
    fill: getParkColor(c.park),
    park: c.park,
  }));

export const scatterData: ScatterDataPoint[] = coasters
  .filter((c) => c.height && c.speed)
  .map((c) => ({
    name: c.name,
    x: c.height!,
    y: c.speed!,
    z: (c.trackLength || 2000) / 400,
    fill: getParkColor(c.park),
    park: c.park,
    track: c.trackLength,
  }));

export const inversionData: InversionDataPoint[] = coasters
  .filter((c) => c.inversions > 0)
  .sort((a, b) => b.inversions - a.inversions)
  .map((c) => ({
    name: c.name,
    inversions: c.inversions,
    fill: getParkColor(c.park),
    park: c.park,
  }));

export const parkPieData: PieDataPoint[] = Object.entries(stats.parkCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([name, value]) => ({
    name,
    value,
    fill: PARK_GROUPS[name] || '#4ECDC4',
  }));

export const mfrPieData: PieDataPoint[] = Object.entries(stats.mfrCounts)
  .sort((a, b) => b[1] - a[1])
  .map(([name, value]) => ({
    name,
    value,
    fill: MFR_COLORS[name] || '#8E99A4',
  }));

export const timelineData: TimelineDataPoint[] = coasters
  .filter((c) => c.yearOpened)
  .sort((a, b) => a.yearOpened! - b.yearOpened!)
  .map((c) => ({
    name: c.name,
    year: c.yearOpened!,
    height: c.height || 50,
    speed: c.speed || 30,
    fill: getParkColor(c.park),
    park: c.park,
  }));

export const decadeData: DecadeDataPoint[] = Object.entries(stats.decadeCounts)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([name, count]) => ({ name, count }));

export const trackData: TrackDataPoint[] = coasters
  .filter((c) => c.trackLength)
  .sort((a, b) => b.trackLength! - a.trackLength!)
  .map((c) => ({
    name: truncateName(c.name),
    fullName: c.name,
    track: c.trackLength!,
    fill: getParkColor(c.park),
    park: c.park,
  }));

export const gforceData: GForceDataPoint[] = coasters
  .filter((c) => c.maxGForce)
  .sort((a, b) => b.maxGForce! - a.maxGForce!)
  .map((c) => ({
    name: c.name,
    gforce: c.maxGForce!,
    fill: getParkColor(c.park),
  }));

// Helper to get top N coasters by a field
function getTop3<K extends keyof Coaster>(
  field: K,
  ascending = false
): Coaster[] {
  const filtered = coasters.filter((c) => c[field] != null);
  const sorted = ascending
    ? filtered.sort((a, b) => (a[field] as number) - (b[field] as number))
    : filtered.sort((a, b) => (b[field] as number) - (a[field] as number));
  return sorted.slice(0, 3);
}

export const recordCategories: RecordCategory[] = [
  { id: 'tallest', title: 'Tallest', field: 'height', unit: 'ft', icon: '🏔️', data: getTop3('height') },
  { id: 'fastest', title: 'Fastest', field: 'speed', unit: 'mph', icon: '⚡', data: getTop3('speed') },
  { id: 'longest', title: 'Longest Track', field: 'trackLength', unit: 'ft', icon: '📏', data: getTop3('trackLength') },
  { id: 'inversions', title: 'Most Inversions', field: 'inversions', unit: '', icon: '🔄', data: getTop3('inversions') },
  { id: 'gforce', title: 'Highest G-Force', field: 'maxGForce', unit: 'G', icon: '💥', data: getTop3('maxGForce') },
  { id: 'steepest', title: 'Steepest Drop', field: 'dropAngle', unit: '°', icon: '🎯', data: getTop3('dropAngle') },
  { id: 'oldest', title: 'Oldest', field: 'yearOpened', unit: '', icon: '📜', data: getTop3('yearOpened', true) },
  { id: 'newest', title: 'Newest', field: 'yearOpened', unit: '', icon: '✨', data: getTop3('yearOpened', false) },
];

// Find coaster by name (for modal lookups)
export function findCoasterByName(name: string): Coaster | undefined {
  return coasters.find((c) => c.name === name);
}

// Re-export types for convenience
export type { Coaster, CoasterStats, POVVideo } from './coasters.types';

// Re-export constants
export { PARK_COLORS, PARK_GROUPS, MFR_COLORS, MEDAL_COLORS, POV_VIDEOS } from './constants';
