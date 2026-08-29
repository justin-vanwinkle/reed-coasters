/**
 * Wish-list coaster dataset — coasters Reed wants to ride but hasn't yet.
 * Kept separate from core.ts `coasters` so ridden-only stats and derived
 * datasets stay untouched; only the bar charts in index.ts merge these in.
 */

import rawWishlist from './wishlist.json';
import { getParkGroup, getMfrShortName } from './core';
import { POV_VIDEOS } from './constants';
import type { Coaster } from './coasters.types';

export const wishlistCoasters: Coaster[] = rawWishlist.map((c) => ({
  ...c,
  parkGroup: getParkGroup(c.park),
  manufacturerShort: getMfrShortName(c.manufacturer),
  povVideo: POV_VIDEOS[c.name] || null,
  wishlist: true,
}));
