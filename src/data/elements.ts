/**
 * Element tag extraction
 * Turns the free-text `specialElements` + `coasterType` fields into a fixed
 * tag vocabulary. Regexes get ~90% of the way; ELEMENT_OVERRIDES corrects the
 * rest per coaster id. `records` text is deliberately excluded (too many
 * false positives like "first coaster with a launch").
 */

import { coasters } from './core';
import type { Coaster } from './coasters.types';

export interface ElementTag {
  id: string;
  label: string;
  icon: string;
  pattern: RegExp;
}

export const ELEMENT_TAGS: ElementTag[] = [
  { id: 'launch', label: 'Launch', icon: '🚀', pattern: /\blaunch|\blim\b|\blsm\b/i },
  { id: 'inverting', label: 'Goes Upside Down', icon: '🙃', pattern: /$^/ }, // derived from inversions count
  { id: 'tunnel', label: 'Tunnels', icon: '🕳️', pattern: /tunnel|trench|underground/i },
  { id: 'helix', label: 'Helix', icon: '🌀', pattern: /helix/i },
  { id: 'airtime', label: 'Airtime Hills', icon: '🪂', pattern: /airtime|camelback|speed hill/i },
  { id: 'backwards', label: 'Backwards', icon: '↩️', pattern: /backward|reverse/i },
  { id: 'indoor', label: 'In the Dark', icon: '🌑', pattern: /indoor|enclosed|in the dark/i },
  { id: 'water', label: 'Splashdown', icon: '💦', pattern: /splashdown|over water/i },
  { id: 'feetDangle', label: 'Feet Dangling', icon: '🦶', pattern: /feet-dangling|inverted|suspended/i },
  { id: 'beyondVertical', label: '90°+ Drop', icon: '📐', pattern: /beyond-vertical|90° vertical|91°/i },
  { id: 'themed', label: 'Story & Theming', icon: '🎭', pattern: /animatronic|movie set/i },
  { id: 'racing', label: 'Racing', icon: '🏁', pattern: /racing|dual-track/i },
  { id: 'multiLift', label: 'Multiple Lifts', icon: '⛓️', pattern: /two lift hills|three lift hills|lift spikes/i },
];

// Per-coaster corrections where the regexes read the prose wrong
export const ELEMENT_OVERRIDES: Record<string, { add?: string[]; remove?: string[] }> = {
  // "helped launch modern coaster renaissance" is not a launch coaster
  'the-racer': { remove: ['launch'] },
  // "'What's in the Shed?' mystery finale" is theming the regex misses
  'mystic-timbers': { add: ['themed'] },
  // "chanting statue finale on the second lift" likewise
  'adventure-express': { add: ['themed'] },
};

export function extractElementTags(coaster: Coaster): ElementTag[] {
  const text = `${coaster.specialElements || ''} ${coaster.coasterType}`;
  const tagIds = new Set(
    ELEMENT_TAGS.filter((tag) => tag.pattern.test(text)).map((tag) => tag.id)
  );
  if (coaster.inversions > 0) tagIds.add('inverting');

  const overrides = ELEMENT_OVERRIDES[coaster.id];
  overrides?.add?.forEach((id) => tagIds.add(id));
  overrides?.remove?.forEach((id) => tagIds.delete(id));

  return ELEMENT_TAGS.filter((tag) => tagIds.has(tag.id));
}

export interface ElementsMatrixRow {
  coaster: Coaster;
  tagIds: Set<string>;
}

export const elementsMatrix: ElementsMatrixRow[] = coasters.map((coaster) => ({
  coaster,
  tagIds: new Set(extractElementTags(coaster).map((tag) => tag.id)),
}));

export const elementTagCounts: Record<string, number> = ELEMENT_TAGS.reduce(
  (acc, tag) => {
    acc[tag.id] = elementsMatrix.filter((row) => row.tagIds.has(tag.id)).length;
    return acc;
  },
  {} as Record<string, number>
);
