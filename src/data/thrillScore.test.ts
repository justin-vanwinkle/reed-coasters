/**
 * Thrill score + radar normalization tests
 */

import { describe, it, expect } from 'vitest';
import { thrillScores, getThrillScore, getRadarData } from './thrillScore';
import { coasters, findCoasterById } from './core';

describe('thrillScores', () => {
  it('scores every coaster in [0, 100]', () => {
    expect(thrillScores.length).toBe(coasters.length);
    thrillScores.forEach((entry) => {
      expect(entry.score).toBeGreaterThanOrEqual(0);
      expect(entry.score).toBeLessThanOrEqual(100);
    });
  });

  it('crowns Fury 325 as the top thrill', () => {
    expect(thrillScores[0].coaster.name).toBe('Fury 325');
  });

  it('breakdown components sum to the score', () => {
    thrillScores.forEach(({ score, breakdown }) => {
      const sum =
        breakdown.height +
        breakdown.speed +
        breakdown.inversions +
        breakdown.dropAngle +
        breakdown.trackLength +
        breakdown.elements;
      expect(sum).toBeCloseTo(score, 1);
    });
  });

  it('is sorted descending', () => {
    for (let i = 1; i < thrillScores.length; i++) {
      expect(thrillScores[i].score).toBeLessThanOrEqual(thrillScores[i - 1].score);
    }
  });

  it('looks up by id', () => {
    expect(getThrillScore('fury-325')?.coaster.name).toBe('Fury 325');
    expect(getThrillScore('nope')).toBeUndefined();
  });
});

describe('getRadarData', () => {
  it('returns five axes normalized to 0-100', () => {
    const fury = getRadarData(findCoasterById('fury-325')!);
    expect(fury.map((p) => p.axis)).toEqual(['Height', 'Speed', 'Length', 'Loops', 'Ride Time']);
    fury.forEach((p) => {
      expect(p.value).toBeGreaterThanOrEqual(0);
      expect(p.value).toBeLessThanOrEqual(100);
    });
    // Fury is the tallest and fastest in the set
    expect(fury.find((p) => p.axis === 'Height')!.value).toBe(100);
    expect(fury.find((p) => p.axis === 'Speed')!.value).toBe(100);
  });

  it('renders raw values for tooltips and dashes for missing data', () => {
    const blueRidge = getRadarData(findCoasterById('blue-ridge-mountain-coaster')!);
    expect(blueRidge.find((p) => p.axis === 'Height')!.raw).toBe('—');
    expect(blueRidge.find((p) => p.axis === 'Height')!.value).toBe(0);
    const beast = getRadarData(findCoasterById('the-beast')!);
    expect(beast.find((p) => p.axis === 'Height')!.raw).toBe('110 ft');
  });
});
