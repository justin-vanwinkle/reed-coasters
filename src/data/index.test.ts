/**
 * Data Index Tests
 * Tests for coaster data transformations and computed values
 */

import { describe, it, expect } from 'vitest';
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
  getParkGroup,
  getParkColor,
  getMfrColor,
  truncateName,
  findCoasterByName,
} from './index';

describe('getParkGroup', () => {
  it('returns "Walt Disney World" for Disney parks', () => {
    expect(getParkGroup('Hollywood Studios')).toBe('Walt Disney World');
    expect(getParkGroup('Magic Kingdom')).toBe('Walt Disney World');
    expect(getParkGroup('EPCOT')).toBe('Walt Disney World');
    expect(getParkGroup('Animal Kingdom')).toBe('Walt Disney World');
  });

  it('returns the park name for non-Disney parks', () => {
    expect(getParkGroup('Kings Island')).toBe('Kings Island');
    expect(getParkGroup('Carowinds')).toBe('Carowinds');
    expect(getParkGroup('Busch Gardens Tampa')).toBe('Busch Gardens Tampa');
  });
});

describe('truncateName', () => {
  it('returns short names unchanged', () => {
    expect(truncateName('The Beast')).toBe('The Beast');
    expect(truncateName('Fury 325')).toBe('Fury 325');
  });

  it('truncates long names with ellipsis', () => {
    const longName = 'This Is A Very Long Coaster Name';
    const result = truncateName(longName, 18);
    expect(result.length).toBe(18);
    expect(result.endsWith('…')).toBe(true);
  });

  it('uses default max length of 18', () => {
    const exactLength = 'Exactly18CharLong!'; // 18 chars
    expect(truncateName(exactLength)).toBe(exactLength);

    const oneLonger = 'Exactly19CharsLong!'; // 19 chars
    expect(truncateName(oneLonger).length).toBe(18);
  });
});

describe('getParkColor', () => {
  it('returns correct color for known parks', () => {
    expect(getParkColor('Kings Island')).toBe('#4ECDC4');
    expect(getParkColor('Carowinds')).toBe('#6BCB77');
  });

  it('returns default color for unknown parks', () => {
    expect(getParkColor('Unknown Park')).toBe('#4ECDC4');
  });
});

describe('getMfrColor', () => {
  it('returns correct color for known manufacturers', () => {
    expect(getMfrColor('B&M')).toBe('#FF6B6B');
    expect(getMfrColor('Intamin')).toBe('#FF9A3C');
  });

  it('returns default color for unknown manufacturers', () => {
    expect(getMfrColor('Unknown Manufacturer')).toBe('#8E99A4');
  });
});

describe('coasters', () => {
  it('has coasters array with data', () => {
    expect(coasters).toBeDefined();
    expect(coasters.length).toBeGreaterThan(0);
  });

  it('each coaster has required fields', () => {
    coasters.forEach((coaster) => {
      expect(coaster.id).toBeDefined();
      expect(coaster.name).toBeDefined();
      expect(coaster.park).toBeDefined();
      expect(coaster.manufacturer).toBeDefined();
    });
  });

  it('each coaster has computed fields', () => {
    coasters.forEach((coaster) => {
      expect(coaster.parkGroup).toBeDefined();
      expect(coaster.manufacturerShort).toBeDefined();
      // povVideo can be null
      expect('povVideo' in coaster).toBe(true);
    });
  });

  it('Disney coasters have parkGroup as Walt Disney World', () => {
    const disneyCoasters = coasters.filter(
      (c) =>
        c.park === 'Hollywood Studios' ||
        c.park === 'Magic Kingdom' ||
        c.park === 'EPCOT' ||
        c.park === 'Animal Kingdom'
    );
    disneyCoasters.forEach((c) => {
      expect(c.parkGroup).toBe('Walt Disney World');
    });
  });
});

describe('stats', () => {
  it('has all required statistics', () => {
    expect(stats.totalCoasters).toBeDefined();
    expect(stats.totalTrack).toBeDefined();
    expect(stats.totalInversions).toBeDefined();
    expect(stats.maxHeight).toBeDefined();
    expect(stats.maxSpeed).toBeDefined();
    expect(stats.maxGForce).toBeDefined();
    expect(stats.avgSpeed).toBeDefined();
    expect(stats.parkCounts).toBeDefined();
    expect(stats.mfrCounts).toBeDefined();
    expect(stats.decadeCounts).toBeDefined();
  });

  it('totalCoasters matches coasters array length', () => {
    expect(stats.totalCoasters).toBe(coasters.length);
  });

  it('totalInversions is sum of all inversions', () => {
    const calculatedTotal = coasters.reduce((sum, c) => sum + c.inversions, 0);
    expect(stats.totalInversions).toBe(calculatedTotal);
  });

  it('maxHeight is highest height in data', () => {
    const heights = coasters.filter((c) => c.height).map((c) => c.height!);
    expect(stats.maxHeight).toBe(Math.max(...heights));
  });

  it('maxSpeed is highest speed in data', () => {
    const speeds = coasters.filter((c) => c.speed).map((c) => c.speed!);
    expect(stats.maxSpeed).toBe(Math.max(...speeds));
  });

  it('parkCounts uses grouped parks', () => {
    expect(stats.parkCounts['Walt Disney World']).toBeDefined();
    // Individual Disney parks should not exist in counts
    expect(stats.parkCounts['Hollywood Studios']).toBeUndefined();
  });
});

describe('heightData', () => {
  it('is sorted by height descending', () => {
    for (let i = 0; i < heightData.length - 1; i++) {
      expect(heightData[i].height).toBeGreaterThanOrEqual(heightData[i + 1].height);
    }
  });

  it('all entries have required fields', () => {
    heightData.forEach((d) => {
      expect(d.name).toBeDefined();
      expect(d.fullName).toBeDefined();
      expect(d.height).toBeGreaterThan(0);
      expect(d.fill).toMatch(/^#[0-9A-Fa-f]{6}$/);
      expect(d.park).toBeDefined();
    });
  });
});

describe('speedData', () => {
  it('is sorted by speed descending', () => {
    for (let i = 0; i < speedData.length - 1; i++) {
      expect(speedData[i].speed).toBeGreaterThanOrEqual(speedData[i + 1].speed);
    }
  });
});

describe('scatterData', () => {
  it('all entries have x (height) and y (speed)', () => {
    scatterData.forEach((d) => {
      expect(d.x).toBeGreaterThan(0);
      expect(d.y).toBeGreaterThan(0);
      expect(d.z).toBeDefined(); // bubble size
    });
  });
});

describe('inversionData', () => {
  it('only includes coasters with inversions', () => {
    inversionData.forEach((d) => {
      expect(d.inversions).toBeGreaterThan(0);
    });
  });

  it('is sorted by inversions descending', () => {
    for (let i = 0; i < inversionData.length - 1; i++) {
      expect(inversionData[i].inversions).toBeGreaterThanOrEqual(inversionData[i + 1].inversions);
    }
  });
});

describe('parkPieData', () => {
  it('is sorted by value descending', () => {
    for (let i = 0; i < parkPieData.length - 1; i++) {
      expect(parkPieData[i].value).toBeGreaterThanOrEqual(parkPieData[i + 1].value);
    }
  });

  it('values sum to total coasters', () => {
    const sum = parkPieData.reduce((acc, d) => acc + d.value, 0);
    expect(sum).toBe(stats.totalCoasters);
  });
});

describe('mfrPieData', () => {
  it('is sorted by value descending', () => {
    for (let i = 0; i < mfrPieData.length - 1; i++) {
      expect(mfrPieData[i].value).toBeGreaterThanOrEqual(mfrPieData[i + 1].value);
    }
  });
});

describe('timelineData', () => {
  it('is sorted by year ascending', () => {
    for (let i = 0; i < timelineData.length - 1; i++) {
      expect(timelineData[i].year).toBeLessThanOrEqual(timelineData[i + 1].year);
    }
  });
});

describe('decadeData', () => {
  it('has decade format names (e.g., "1970s")', () => {
    decadeData.forEach((d) => {
      expect(d.name).toMatch(/^\d{4}s$/);
    });
  });

  it('is sorted chronologically', () => {
    for (let i = 0; i < decadeData.length - 1; i++) {
      expect(decadeData[i].name < decadeData[i + 1].name).toBe(true);
    }
  });
});

describe('trackData', () => {
  it('is sorted by track length descending', () => {
    for (let i = 0; i < trackData.length - 1; i++) {
      expect(trackData[i].track).toBeGreaterThanOrEqual(trackData[i + 1].track);
    }
  });
});

describe('gforceData', () => {
  it('is sorted by g-force descending', () => {
    for (let i = 0; i < gforceData.length - 1; i++) {
      expect(gforceData[i].gforce).toBeGreaterThanOrEqual(gforceData[i + 1].gforce);
    }
  });
});

describe('recordCategories', () => {
  it('has all expected categories', () => {
    const categoryIds = recordCategories.map((c) => c.id);
    expect(categoryIds).toContain('tallest');
    expect(categoryIds).toContain('fastest');
    expect(categoryIds).toContain('longest');
    expect(categoryIds).toContain('inversions');
    expect(categoryIds).toContain('gforce');
    expect(categoryIds).toContain('steepest');
    expect(categoryIds).toContain('oldest');
    expect(categoryIds).toContain('newest');
  });

  it('each category has top 3 coasters', () => {
    recordCategories.forEach((cat) => {
      expect(cat.data.length).toBeLessThanOrEqual(3);
      expect(cat.data.length).toBeGreaterThan(0);
    });
  });

  it('tallest has correct order', () => {
    const tallest = recordCategories.find((c) => c.id === 'tallest')!;
    expect(tallest.data[0].height).toBeGreaterThanOrEqual(tallest.data[1].height!);
  });

  it('oldest has ascending order (oldest first)', () => {
    const oldest = recordCategories.find((c) => c.id === 'oldest')!;
    expect(oldest.data[0].yearOpened).toBeLessThanOrEqual(oldest.data[1].yearOpened!);
  });

  it('newest has descending order (newest first)', () => {
    const newest = recordCategories.find((c) => c.id === 'newest')!;
    expect(newest.data[0].yearOpened).toBeGreaterThanOrEqual(newest.data[1].yearOpened!);
  });
});

describe('findCoasterByName', () => {
  it('finds existing coasters', () => {
    const beast = findCoasterByName('The Beast');
    expect(beast).toBeDefined();
    expect(beast?.name).toBe('The Beast');
    expect(beast?.park).toBe('Kings Island');
  });

  it('returns undefined for non-existent coasters', () => {
    const result = findCoasterByName('Non-Existent Coaster');
    expect(result).toBeUndefined();
  });
});
