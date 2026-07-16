/**
 * Application constants
 * Single source of truth for colors, videos, and magic numbers
 */

import type { POVVideo } from './coasters.types';

// Park colors for visualizations
// NOTE: hexes must byte-match the tokens in src/styles/variables.css
export const PARK_COLORS: Record<string, string> = {
  'Kings Island': '#2CE5C9',
  'Hollywood Studios': '#FFC53D',
  'Magic Kingdom': '#FFC53D',
  'EPCOT': '#FFC53D',
  'Animal Kingdom': '#FFC53D',
  'Carowinds': '#6EE05C',
  'Busch Gardens Tampa': '#FF5A6E',
  'SeaWorld Orlando': '#54A8FF',
  'Jellystone Park': '#C77DFF',
};

// Grouped parks (Disney parks grouped as "Walt Disney World")
export const PARK_GROUPS: Record<string, string> = {
  'Kings Island': '#2CE5C9',
  'Walt Disney World': '#FFC53D',
  'Carowinds': '#6EE05C',
  'Busch Gardens Tampa': '#FF5A6E',
  'SeaWorld Orlando': '#54A8FF',
  'Jellystone Park': '#C77DFF',
};

// Manufacturer colors
// NOTE: hexes must byte-match the tokens in src/styles/variables.css
export const MFR_COLORS: Record<string, string> = {
  'B&M': '#FF5A6E',
  'Vekoma': '#54A8FF',
  'Arrow': '#FFC53D',
  'PTC': '#2CE5C9',
  'Premier': '#C77DFF',
  'Intamin': '#FF9440',
  'GCI': '#6EE05C',
  'RMC': '#FF4D9D',
  'Mack': '#00D4A0',
  'Wiegand': '#9FA8C9',
};

// Medal colors for podium displays
export const MEDAL_COLORS = {
  gold: '#FFD700',
  silver: '#C0C0C0',
  bronze: '#CD7F32',
} as const;

// POV video IDs (YouTube) - All videos verified February 2026
// Each video has been manually checked to confirm it shows the correct coaster POV
export const POV_VIDEOS: Record<string, POVVideo> = {
  // Kings Island - All verified from official Kings Island channel
  'The Beast': { id: 'ZJuhNpWMfdE', title: 'The Beast POV - Kings Island' },
  'Mystic Timbers': { id: 'X2kNPlOTGqk', title: 'Mystic Timbers POV - Kings Island' },
  'The Bat': { id: 'TPLdiw5AQDQ', title: 'The Bat POV - Kings Island (Official)' },
  'Queen City Stunt Coaster': { id: 'rERFA-BQrcU', title: 'Queen City Stunt Coaster (as Backlot Stunt Coaster) POV - Kings Island' },
  'The Racer': { id: 'r9BF9kL-SuI', title: 'The Racer POV - Kings Island (Official)' },
  'Flight of Fear': { id: 're_2QhAqC98', title: 'Flight of Fear Lights-On POV - Kings Island (Official)' },
  'Banshee': { id: 'CpEB0nsXHn8', title: 'Banshee POV - Kings Island (CoasterForce)' },
  'Diamondback': { id: 'KzgItmEId3g', title: 'Diamondback POV - Kings Island (Theme Park POV)' },
  'Orion': { id: 'Doh8EukW6Qk', title: 'Orion POV - Kings Island (Official)' },
  'Invertigo': { id: 'JI1TP1t63lw', title: 'Invertigo POV - Kings Island (Attraction Spot)' },
  'Adventure Express': { id: 'FNizziH0tB0', title: 'Adventure Express POV - Kings Island (Attraction Spot)' },
  // Note: Woodstock Express exists at both Kings Island (O6hXd9XCkH4) and Carowinds (cZpGZQaF0UQ)
  'Woodstock Express': { id: 'O6hXd9XCkH4', title: 'Woodstock Express POV - Kings Island (Official)' },
  // Walt Disney World - Verified POV videos
  "Rock 'n' Roller Coaster": { id: 'DcTikoA5jNE', title: "Rock 'n' Roller Coaster POV - Hollywood Studios" },
  'Seven Dwarfs Mine Train': { id: 'sf8NARziZZM', title: 'Seven Dwarfs Mine Train POV - Magic Kingdom' },
  'Slinky Dog Dash': { id: 'FlzHw4qWIps', title: 'Slinky Dog Dash POV - Hollywood Studios' },
  'Expedition Everest': { id: 'KTji1hOICEI', title: 'Expedition Everest POV - Animal Kingdom' },
  'The Barnstormer': { id: 'BRTpVIAzhNQ', title: 'The Barnstormer POV - Magic Kingdom' },
  'Big Thunder Mountain Railroad': { id: 'ZVT66d0kg_A', title: 'Big Thunder Mountain POV - Magic Kingdom' },
  'Guardians of the Galaxy: Cosmic Rewind': { id: 'fQ0ZPRmDA58', title: 'Cosmic Rewind POV - EPCOT' },
  // Carowinds - Verified from official Carowinds channel
  'Fury 325': { id: 'VyX6jzXSSSs', title: 'Fury 325 POV - Carowinds' },
  'Thunder Striker': { id: 'aDPCu1u3UCo', title: 'Thunder Striker POV - Carowinds (Official)' },
  'Carolina Cyclone': { id: '0Txobf7jrHw', title: 'Carolina Cyclone POV - Carowinds (Official)' },
  'Ricochet': { id: 'lRtG7C5ilN0', title: 'Ricochet POV - Carowinds (Official)' },
  // Busch Gardens Tampa - Verified POV videos
  'Montu': { id: 'fi_ugEfCvMA', title: 'Montu POV - Busch Gardens Tampa' },
  'SheiKra': { id: 'mMEed3OdU3A', title: 'SheiKra POV - Busch Gardens Tampa' },
  'Iron Gwazi': { id: 'NkCtNaThbmE', title: 'Iron Gwazi POV - Busch Gardens Tampa' },
  'Kumba': { id: 'pOCIs2dfDWY', title: 'Kumba POV - Busch Gardens Tampa' },
  'Phoenix Rising': { id: 'kw5Z-9sdCTE', title: 'Phoenix Rising POV - Busch Gardens Tampa (CoasterForce)' },
  'Tigris': { id: 'lpuQPYZysks', title: 'Tigris POV - Busch Gardens Tampa (CoasterForce)' },
  'Cheetah Hunt': { id: 'gqSxb5VonmM', title: 'Cheetah Hunt POV - Busch Gardens Tampa' },
  // SeaWorld Orlando - Verified POV videos
  'Mako': { id: 'ekEkDyp3lYs', title: 'Mako POV - SeaWorld Orlando' },
  'Pipeline: The Surf Coaster': { id: 'aLiCaYLer1g', title: 'Pipeline Surf Coaster POV - SeaWorld Orlando (CoasterForce)' },
  'Kraken': { id: 'glgRO5rYVmM', title: 'Kraken POV - SeaWorld Orlando (CoasterForce)' },
  // Jellystone Park
  'Blue Ridge Mountain Coaster': { id: '1NcD2-4Q5MU', title: 'Blue Ridge Mountain Coaster POV - Jellystone Park NC' },
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
