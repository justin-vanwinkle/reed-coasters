/**
 * Core coaster dataset and lookup helpers
 * Extracted from index.ts so derived-data modules can import it without cycles;
 * index.ts re-exports everything here.
 */

import rawCoasters from './coasters.json';
import {
  PARK_COLORS,
  MFR_COLORS,
  MFR_SHORT_NAMES,
  DISNEY_PARKS,
  POV_VIDEOS,
} from './constants';
import type { Coaster } from './coasters.types';

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
  return name.length > maxLength ? name.slice(0, maxLength - 1) + '…' : name;
}

// Helper to get park color
export function getParkColor(park: string): string {
  return PARK_COLORS[park] || PARK_COLORS['Kings Island'];
}

// Helper to get manufacturer color
export function getMfrColor(mfr: string): string {
  return MFR_COLORS[mfr] || MFR_COLORS['Wiegand'];
}

// Transform raw JSON data into typed Coaster objects with computed fields
export const coasters: Coaster[] = rawCoasters.map((c) => ({
  ...c,
  parkGroup: getParkGroup(c.park),
  manufacturerShort: getMfrShortName(c.manufacturer),
  povVideo: POV_VIDEOS[c.name] || null,
}));

// Find coaster by id (names are not unique — two "Woodstock Express")
export function findCoasterById(id: string): Coaster | undefined {
  return coasters.find((c) => c.id === id);
}
