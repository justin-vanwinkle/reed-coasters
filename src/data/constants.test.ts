/**
 * Constants Tests
 * Tests for application constants and configuration
 */

import { describe, it, expect } from 'vitest';
import {
  PARK_COLORS,
  PARK_GROUPS,
  MFR_COLORS,
  MEDAL_COLORS,
  POV_VIDEOS,
  MFR_SHORT_NAMES,
  DISNEY_PARKS,
  ANIMATION,
  VIDEO_ASPECT_RATIO,
  DISPLAY_LIMITS,
} from './constants';

describe('PARK_COLORS', () => {
  it('contains all expected parks', () => {
    expect(PARK_COLORS['Kings Island']).toBeDefined();
    expect(PARK_COLORS['Hollywood Studios']).toBeDefined();
    expect(PARK_COLORS['Magic Kingdom']).toBeDefined();
    expect(PARK_COLORS['EPCOT']).toBeDefined();
    expect(PARK_COLORS['Animal Kingdom']).toBeDefined();
    expect(PARK_COLORS['Carowinds']).toBeDefined();
    expect(PARK_COLORS['Busch Gardens Tampa']).toBeDefined();
    expect(PARK_COLORS['SeaWorld Orlando']).toBeDefined();
    expect(PARK_COLORS['Jellystone Park']).toBeDefined();
  });

  it('all colors are valid hex values', () => {
    Object.values(PARK_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });

  it('Disney parks share the same color', () => {
    expect(PARK_COLORS['Hollywood Studios']).toBe(PARK_COLORS['Magic Kingdom']);
    expect(PARK_COLORS['Magic Kingdom']).toBe(PARK_COLORS['EPCOT']);
    expect(PARK_COLORS['EPCOT']).toBe(PARK_COLORS['Animal Kingdom']);
  });
});

describe('PARK_GROUPS', () => {
  it('contains grouped park names', () => {
    expect(PARK_GROUPS['Walt Disney World']).toBeDefined();
    expect(PARK_GROUPS['Kings Island']).toBeDefined();
  });

  it('does not contain individual Disney parks', () => {
    expect(PARK_GROUPS['Hollywood Studios']).toBeUndefined();
    expect(PARK_GROUPS['Magic Kingdom']).toBeUndefined();
    expect(PARK_GROUPS['EPCOT']).toBeUndefined();
    expect(PARK_GROUPS['Animal Kingdom']).toBeUndefined();
  });
});

describe('MFR_COLORS', () => {
  it('contains common manufacturers', () => {
    expect(MFR_COLORS['B&M']).toBeDefined();
    expect(MFR_COLORS['Vekoma']).toBeDefined();
    expect(MFR_COLORS['Arrow']).toBeDefined();
    expect(MFR_COLORS['Intamin']).toBeDefined();
    expect(MFR_COLORS['RMC']).toBeDefined();
  });

  it('all colors are valid hex values', () => {
    Object.values(MFR_COLORS).forEach((color) => {
      expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
    });
  });
});

describe('MEDAL_COLORS', () => {
  it('has gold, silver, and bronze', () => {
    expect(MEDAL_COLORS.gold).toBe('#FFD700');
    expect(MEDAL_COLORS.silver).toBe('#C0C0C0');
    expect(MEDAL_COLORS.bronze).toBe('#CD7F32');
  });
});

describe('POV_VIDEOS', () => {
  it('contains videos for popular coasters', () => {
    expect(POV_VIDEOS['The Beast']).toBeDefined();
    expect(POV_VIDEOS['Iron Gwazi']).toBeDefined();
    expect(POV_VIDEOS['Fury 325']).toBeDefined();
    expect(POV_VIDEOS['Mako']).toBeDefined();
  });

  it('video objects have id and title', () => {
    Object.values(POV_VIDEOS).forEach((video) => {
      expect(video).toHaveProperty('id');
      expect(video).toHaveProperty('title');
      expect(video.id).toBeTruthy();
      expect(video.title).toBeTruthy();
    });
  });

  it('video IDs are valid YouTube IDs (11 chars)', () => {
    Object.values(POV_VIDEOS).forEach((video) => {
      expect(video.id).toMatch(/^[a-zA-Z0-9_-]{11}$/);
    });
  });
});

describe('MFR_SHORT_NAMES', () => {
  it('maps long names to short names', () => {
    expect(MFR_SHORT_NAMES['Philadelphia Toboggan Coasters']).toBe('PTC');
    expect(MFR_SHORT_NAMES['Bolliger & Mabillard (B&M)']).toBe('B&M');
    expect(MFR_SHORT_NAMES['Rocky Mountain Construction (RMC)']).toBe('RMC');
    expect(MFR_SHORT_NAMES['Great Coasters International (GCI)']).toBe('GCI');
  });
});

describe('DISNEY_PARKS', () => {
  it('contains all Disney park names', () => {
    expect(DISNEY_PARKS).toContain('Hollywood Studios');
    expect(DISNEY_PARKS).toContain('Magic Kingdom');
    expect(DISNEY_PARKS).toContain('EPCOT');
    expect(DISNEY_PARKS).toContain('Animal Kingdom');
  });

  it('has exactly 4 parks', () => {
    expect(DISNEY_PARKS).toHaveLength(4);
  });
});

describe('ANIMATION', () => {
  it('has correct frame duration for 60fps', () => {
    expect(ANIMATION.FRAME_DURATION).toBe(16);
  });

  it('has reasonable default duration', () => {
    expect(ANIMATION.DEFAULT_DURATION).toBe(2000);
  });

  it('has valid intersection threshold', () => {
    expect(ANIMATION.INTERSECTION_THRESHOLD).toBeGreaterThan(0);
    expect(ANIMATION.INTERSECTION_THRESHOLD).toBeLessThan(1);
  });
});

describe('VIDEO_ASPECT_RATIO', () => {
  it('is 16:9 aspect ratio', () => {
    expect(VIDEO_ASPECT_RATIO).toBe('56.25%');
  });
});

describe('DISPLAY_LIMITS', () => {
  it('has reasonable bar chart limit', () => {
    expect(DISPLAY_LIMITS.MAX_BAR_ITEMS).toBe(15);
  });

  it('has reasonable name truncation length', () => {
    expect(DISPLAY_LIMITS.TRUNCATE_NAME_LENGTH).toBe(18);
  });
});
