/**
 * Derived dataset tests
 */

import { describe, it, expect } from 'vitest';
import {
  parseDurationToSeconds,
  pacingData,
  thrillDensityData,
  skylineData,
  SKYLINE_EXCLUDED,
  REFERENCE_OBJECTS,
  recordsMarqueeData,
  parkGeography,
} from './derived';
import { coasters } from './core';

describe('parseDurationToSeconds', () => {
  it('parses M:SS', () => {
    expect(parseDurationToSeconds('4:10')).toBe(250);
    expect(parseDurationToSeconds('1:03')).toBe(63);
  });

  it('strips the ~ prefix used for approximate durations', () => {
    expect(parseDurationToSeconds('~2:00')).toBe(120);
    expect(parseDurationToSeconds('~5:00')).toBe(300);
  });

  it('returns null for null or garbage', () => {
    expect(parseDurationToSeconds(null)).toBeNull();
    expect(parseDurationToSeconds('')).toBeNull();
    expect(parseDurationToSeconds('fast')).toBeNull();
    expect(parseDurationToSeconds('2:3')).toBeNull();
  });
});

describe('pacingData', () => {
  it('computes average speed over the full course', () => {
    const beast = pacingData.find((p) => p.fullName === 'The Beast')!;
    // 7361 ft in 250 s ≈ 20.1 mph
    expect(beast.avgSpeed).toBeCloseTo(20.1, 1);
    expect(beast.topSpeed).toBe(65);
  });

  it('average speed never exceeds top speed', () => {
    pacingData.forEach((p) => expect(p.avgSpeed).toBeLessThanOrEqual(p.topSpeed));
  });

  it('excludes coasters with missing track length', () => {
    expect(pacingData.find((p) => p.fullName === 'Blue Ridge Mountain Coaster')).toBeUndefined();
  });
});

describe('thrillDensityData', () => {
  it('computes inversions per minute', () => {
    const fof = thrillDensityData.find((p) => p.fullName === 'Flight of Fear')!;
    expect(fof.perMinute).toBe(4); // 4 inversions in 1:00
  });

  it('only includes inverting coasters', () => {
    thrillDensityData.forEach((p) => expect(p.inversions).toBeGreaterThan(0));
  });
});

describe('skylineData', () => {
  it('is sorted tallest first and excludes heightless coasters', () => {
    expect(skylineData[0].name).toBe('Fury 325');
    for (let i = 1; i < skylineData.length; i++) {
      expect(skylineData[i].height).toBeLessThanOrEqual(skylineData[i - 1].height);
    }
    expect(skylineData.length + SKYLINE_EXCLUDED.length).toBe(coasters.length);
    expect(SKYLINE_EXCLUDED).toContain('Blue Ridge Mountain Coaster');
  });

  it('provides reference objects', () => {
    expect(REFERENCE_OBJECTS.map((r) => r.name)).toContain('Statue of Liberty');
  });
});

describe('recordsMarqueeData', () => {
  it('splits records into individual trimmed claims', () => {
    const beastClaims = recordsMarqueeData.filter((m) => m.coasterId === 'the-beast');
    expect(beastClaims.length).toBe(3);
    expect(beastClaims[0].claim).toBe("World's longest wooden coaster (7,361')");
  });

  it('has no empty claims', () => {
    recordsMarqueeData.forEach((m) => expect(m.claim.length).toBeGreaterThan(0));
  });
});

describe('parkGeography', () => {
  it('derives counts from the data (Ohio has all 12 Kings Island coasters)', () => {
    const ohio = parkGeography.find((g) => g.state === 'Ohio')!;
    expect(ohio.count).toBe(12);
    expect(ohio.parks[0].name).toBe('Kings Island');
  });

  it('accounts for every coaster', () => {
    expect(parkGeography.reduce((sum, g) => sum + g.count, 0)).toBe(coasters.length);
    expect(parkGeography.find((g) => g.state === 'Unknown')).toBeUndefined();
  });
});
