/**
 * Wish-list Data Tests
 * Wish-list coasters stay separate from the ridden dataset and only
 * surface in the merged bar-chart data as outlined entries.
 */

import { describe, it, expect } from 'vitest';
import { wishlistCoasters } from './wishlist';
import { coasters, stats, heightData, speedData, inversionData, trackData } from './index';

describe('wishlistCoasters', () => {
  it('are all at Dollywood', () => {
    expect(wishlistCoasters.length).toBeGreaterThan(0);
    wishlistCoasters.forEach((c) => {
      expect(c.park).toBe('Dollywood');
      expect(c.parkGroup).toBe('Dollywood');
    });
  });

  it('are flagged as wishlist and not yet ridden', () => {
    wishlistCoasters.forEach((c) => {
      expect(c.wishlist).toBe(true);
      expect(c.timesRidden).toBeNull();
      expect(c.reedsAgeOnFirstRide).toBeNull();
    });
  });

  it('have unique ids that do not collide with ridden coasters', () => {
    const wishlistIds = wishlistCoasters.map((c) => c.id);
    expect(new Set(wishlistIds).size).toBe(wishlistIds.length);
    const riddenIds = new Set(coasters.map((c) => c.id));
    wishlistIds.forEach((id) => expect(riddenIds.has(id)).toBe(false));
  });

  it('have computed enrichment fields', () => {
    wishlistCoasters.forEach((c) => {
      expect(c.manufacturerShort).toBeDefined();
      expect('povVideo' in c).toBe(true);
    });
  });
});

describe('wishlist merge into chart data', () => {
  it('ridden-only stats exclude wishlist coasters', () => {
    expect(stats.totalCoasters).toBe(coasters.length);
    expect(stats.parkCounts['Dollywood']).toBeUndefined();
  });

  it('bar chart datasets include flagged wishlist entries', () => {
    expect(heightData.some((d) => d.wishlist && d.park === 'Dollywood')).toBe(true);
    expect(speedData.some((d) => d.wishlist && d.park === 'Dollywood')).toBe(true);
    expect(inversionData.some((d) => d.wishlist && d.park === 'Dollywood')).toBe(true);
    expect(trackData.some((d) => d.wishlist && d.park === 'Dollywood')).toBe(true);
  });

  it('keeps merged datasets sorted (wishlist interleaves by value)', () => {
    for (let i = 0; i < heightData.length - 1; i++) {
      expect(heightData[i].height).toBeGreaterThanOrEqual(heightData[i + 1].height);
    }
  });
});
