/**
 * Application constants
 * Single source of truth for colors, videos, and magic numbers
 */

import type { POVVideo } from './coasters.types';

// Park colors for visualizations
export const PARK_COLORS: Record<string, string> = {
  'Kings Island': '#4ECDC4',
  'Hollywood Studios': '#FFD93D',
  'Magic Kingdom': '#FFD93D',
  'EPCOT': '#FFD93D',
  'Animal Kingdom': '#FFD93D',
  'Carowinds': '#6BCB77',
  'Busch Gardens Tampa': '#FF6B6B',
  'SeaWorld Orlando': '#4D96FF',
  'Jellystone Park': '#C084FC',
};

// Grouped parks (Disney parks grouped as "Walt Disney World")
export const PARK_GROUPS: Record<string, string> = {
  'Kings Island': '#4ECDC4',
  'Walt Disney World': '#FFD93D',
  'Carowinds': '#6BCB77',
  'Busch Gardens Tampa': '#FF6B6B',
  'SeaWorld Orlando': '#4D96FF',
  'Jellystone Park': '#C084FC',
};

// Manufacturer colors
export const MFR_COLORS: Record<string, string> = {
  'B&M': '#FF6B6B',
  'Vekoma': '#4D96FF',
  'Arrow': '#FFD93D',
  'PTC': '#4ECDC4',
  'Premier': '#C084FC',
  'Intamin': '#FF9A3C',
  'GCI': '#6BCB77',
  'RMC': '#FF4081',
  'Mack': '#00BFA5',
  'Wiegand': '#8E99A4',
};

// Medal colors for podium displays
export const MEDAL_COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
} as const;

// POV video IDs (YouTube) - Verified front-seat POV videos
export const POV_VIDEOS: Record<string, POVVideo> = {
  // Kings Island
  'The Beast': { id: 'tvGDC1vJLaQ', title: 'The Beast POV - Kings Island (Official)' },
  'Mystic Timbers': { id: '7bMWLgLZHIk', title: 'Mystic Timbers POV - Kings Island' },
  'The Bat': { id: 'aS0tspdvo7c', title: 'The Bat POV - Kings Island' },
  'Backlot Stunt Coaster': { id: '4v6paKuFDv0', title: 'Backlot Stunt Coaster POV - Kings Island' },
  'The Racer': { id: 'hIL-gZTftPk', title: 'The Racer POV - Kings Island' },
  'Woodstock Express': { id: 'k2tz_SSnID4', title: 'Woodstock Express POV - Kings Island' },
  // Walt Disney World
  "Rock 'n' Roller Coaster": { id: '3kPGnGb7E9M', title: "Rock 'n' Roller Coaster POV - Hollywood Studios" },
  'Seven Dwarfs Mine Train': { id: '8T0wAi0gMvM', title: 'Seven Dwarfs Mine Train POV - Magic Kingdom' },
  'Slinky Dog Dash': { id: '6KERUB0PqjI', title: 'Slinky Dog Dash POV - Hollywood Studios' },
  'Expedition Everest': { id: 'WYhAu4OhhZ4', title: 'Expedition Everest POV - Animal Kingdom' },
  'The Barnstormer': { id: 'aZR5pFnNJsU', title: 'The Barnstormer POV - Magic Kingdom' },
  'Big Thunder Mountain Railroad': { id: 'uzHbyQh2kRw', title: 'Big Thunder Mountain POV - Magic Kingdom' },
  'Guardians of the Galaxy: Cosmic Rewind': { id: 'HlBRVamVhDM', title: 'Cosmic Rewind POV - EPCOT' },
  // Carowinds
  'Fury 325': { id: 'Ry8UYr7wg64', title: 'Fury 325 POV - Carowinds' },
  'Thunder Striker': { id: 'fTh_qfYvqpw', title: 'Thunder Striker (Intimidator) POV - Carowinds' },
  'Carolina Cyclone': { id: '5_0H5HZQDTQ', title: 'Carolina Cyclone POV - Carowinds' },
  'Ricochet': { id: 'VwVJNNKLhP8', title: 'Ricochet POV - Carowinds' },
  // Busch Gardens Tampa
  'Montu': { id: 'j0kw80_5xhM', title: 'Montu POV - Busch Gardens Tampa' },
  'SheiKra': { id: 'hMnWfk1zYSE', title: 'SheiKra POV - Busch Gardens Tampa' },
  'Iron Gwazi': { id: 'TQX7DEPyoBA', title: 'Iron Gwazi POV - Busch Gardens Tampa (Official)' },
  'Kumba': { id: 'hMJ2ti4RnHk', title: 'Kumba POV - Busch Gardens Tampa' },
  'Phoenix Rising': { id: '3EqD7eveKtM', title: 'Phoenix Rising POV - Busch Gardens Tampa' },
  'Tigris': { id: 'qF6kLKHvNw8', title: 'Tigris POV - Busch Gardens Tampa' },
  'Cheetah Hunt': { id: 'KyCbp5N2qJs', title: 'Cheetah Hunt POV - Busch Gardens Tampa' },
  // SeaWorld Orlando
  'Mako': { id: 'lGKq_dpMLlQ', title: 'Mako POV - SeaWorld Orlando' },
  'Pipeline: The Surf Coaster': { id: 'BLvC3xNnKXk', title: 'Pipeline Surf Coaster POV - SeaWorld Orlando' },
  'Kraken': { id: 'oOWAf_Rlm4w', title: 'Kraken POV - SeaWorld Orlando' },
  // Other
  'Blue Ridge Mountain Coaster': { id: 'k5f8ZT8bMrs', title: 'Blue Ridge Mountain Coaster POV' },
};

// Manufacturer short names mapping
export const MFR_SHORT_NAMES: Record<string, string> = {
  'Philadelphia Toboggan Coasters': 'PTC',
  'Great Coasters International (GCI)': 'GCI',
  'Bolliger & Mabillard (B&M)': 'B&M',
  'Rocky Mountain Construction (RMC)': 'RMC',
  'Arrow Dynamics': 'Arrow',
  'Premier Rides': 'Premier',
  'Vekoma': 'Vekoma',
  'Mack Rides': 'Mack',
  'Intamin': 'Intamin',
  'Wiegand Sports': 'Wiegand',
  'Vekoma / WED Enterprises': 'Vekoma',
};

// Disney parks that should be grouped as "Walt Disney World"
export const DISNEY_PARKS = ['Hollywood Studios', 'Magic Kingdom', 'EPCOT', 'Animal Kingdom'];

// Animation and UI constants
export const ANIMATION = {
  FRAME_DURATION: 16, // 60fps
  DEFAULT_DURATION: 2000,
  INTERSECTION_THRESHOLD: 0.3,
} as const;

// Video aspect ratio
export const VIDEO_ASPECT_RATIO = '56.25%'; // 16:9

// Chart display limits
export const DISPLAY_LIMITS = {
  MAX_BAR_ITEMS: 15,
  TRUNCATE_NAME_LENGTH: 18,
} as const;
