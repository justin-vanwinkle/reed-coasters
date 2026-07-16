/**
 * Reed's personal-story derivation tests
 */

import { describe, it, expect } from 'vitest';
import { braveryData, firstsData, odometer, favoritesData } from './reed';
import { coasters } from './core';
import { parseDurationToSeconds } from './derived';

describe('braveryData', () => {
  it('starts at age 6 with The Barnstormer', () => {
    expect(braveryData[0]).toMatchObject({
      age: 6,
      maxHeight: 30,
      maxSpeed: 25,
      maxInversions: 0,
      tallestName: 'The Barnstormer',
    });
  });

  it('is cumulative: every metric is non-decreasing with age', () => {
    for (let i = 1; i < braveryData.length; i++) {
      expect(braveryData[i].maxHeight).toBeGreaterThanOrEqual(braveryData[i - 1].maxHeight);
      expect(braveryData[i].maxSpeed).toBeGreaterThanOrEqual(braveryData[i - 1].maxSpeed);
      expect(braveryData[i].maxInversions).toBeGreaterThanOrEqual(braveryData[i - 1].maxInversions);
    }
  });

  it('ends at age 9 with Fury 325', () => {
    const last = braveryData[braveryData.length - 1];
    expect(last).toMatchObject({ age: 9, maxHeight: 325, maxSpeed: 95, maxInversions: 7 });
    expect(last.tallestName).toBe('Fury 325');
  });

  it('newCount across all ages covers every ridden coaster', () => {
    const total = braveryData.reduce((sum, p) => sum + p.newCount, 0);
    expect(total).toBe(coasters.filter((c) => c.reedsAgeOnFirstRide != null).length);
  });
});

describe('firstsData', () => {
  it('is sorted by age', () => {
    for (let i = 1; i < firstsData.length; i++) {
      expect(firstsData[i].age).toBeGreaterThanOrEqual(firstsData[i - 1].age);
    }
  });

  it('first coaster ever is The Barnstormer at age 6', () => {
    const first = firstsData.find((m) => m.label === 'First coaster ever')!;
    expect(first.age).toBe(6);
    expect(first.coasterName).toBe('The Barnstormer');
  });

  it('first inversions came at age 8 on Rock ‘n’ Roller Coaster', () => {
    const first = firstsData.find((m) => m.label === 'First time upside down')!;
    expect(first.age).toBe(8);
    expect(first.coasterId).toBe('rock-n-roller-coaster');
  });

  it('every milestone points at a real coaster', () => {
    firstsData.forEach((m) => {
      expect(coasters.some((c) => c.id === m.coasterId)).toBe(true);
    });
  });
});

describe('odometer', () => {
  it('matches hand-computed totals', () => {
    const expected = coasters.reduce(
      (acc, c) => {
        const rides = c.timesRidden ?? 0;
        acc.rides += rides;
        acc.upsideDown += rides * c.inversions;
        if (c.trackLength) acc.feet += rides * c.trackLength;
        const s = parseDurationToSeconds(c.duration);
        if (s) acc.seconds += rides * s;
        return acc;
      },
      { rides: 0, feet: 0, seconds: 0, upsideDown: 0 }
    );
    expect(odometer.totalRides).toBe(expected.rides);
    expect(odometer.totalFeet).toBe(expected.feet);
    expect(odometer.totalSeconds).toBe(expected.seconds);
    expect(odometer.totalUpsideDown).toBe(expected.upsideDown);
    expect(odometer.totalMiles).toBeCloseTo(expected.feet / 5280, 1);
  });

  it('flags Blue Ridge Mountain Coaster as excluded from the feet total', () => {
    expect(odometer.coastersExcludedFromFeet).toContain('Blue Ridge Mountain Coaster');
  });
});

describe('favoritesData', () => {
  it('leads with The Barnstormer (6 rides)', () => {
    expect(favoritesData[0]).toMatchObject({ name: 'The Barnstormer', timesRidden: 6 });
  });

  it('only includes re-ridden coasters, sorted by rides', () => {
    favoritesData.forEach((f) => expect(f.timesRidden).toBeGreaterThanOrEqual(2));
    for (let i = 1; i < favoritesData.length; i++) {
      expect(favoritesData[i].timesRidden).toBeLessThanOrEqual(favoritesData[i - 1].timesRidden);
    }
  });
});
