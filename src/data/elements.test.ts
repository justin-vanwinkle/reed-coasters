/**
 * Element tag extraction tests
 */

import { describe, it, expect } from 'vitest';
import { ELEMENT_TAGS, extractElementTags, elementsMatrix, elementTagCounts } from './elements';
import { findCoasterById } from './core';

function tagIdsFor(id: string): string[] {
  return extractElementTags(findCoasterById(id)!).map((t) => t.id);
}

describe('extractElementTags', () => {
  it('tags The Beast with tunnels, helix and multiple lifts but no launch', () => {
    const tags = tagIdsFor('the-beast');
    expect(tags).toContain('tunnel');
    expect(tags).toContain('helix');
    expect(tags).toContain('multiLift');
    expect(tags).not.toContain('launch');
  });

  it('tags Flight of Fear as a launched indoor coaster', () => {
    const tags = tagIdsFor('flight-of-fear');
    expect(tags).toContain('launch');
    expect(tags).toContain('indoor');
    expect(tags).toContain('inverting');
  });

  it('tags Iron Gwazi with airtime and a beyond-vertical drop', () => {
    const tags = tagIdsFor('iron-gwazi');
    expect(tags).toContain('airtime');
    expect(tags).toContain('beyondVertical');
  });

  it('does not tag The Racer as launched ("helped launch the coaster boom")', () => {
    expect(tagIdsFor('the-racer')).not.toContain('launch');
    expect(tagIdsFor('the-racer')).toContain('racing');
  });

  it('derives the inverting tag from the numeric inversions field', () => {
    expect(tagIdsFor('banshee')).toContain('inverting');
    expect(tagIdsFor('orion')).not.toContain('inverting');
  });
});

describe('elementsMatrix', () => {
  it('has a row per coaster', () => {
    expect(elementsMatrix.length).toBe(35);
  });

  it('every tag matches at least one coaster (no dead tags)', () => {
    ELEMENT_TAGS.forEach((tag) => {
      expect(elementTagCounts[tag.id], `tag "${tag.id}" matches nothing`).toBeGreaterThan(0);
    });
  });

  it('extraction output is stable', () => {
    const summary = elementsMatrix.map(
      (row) => `${row.coaster.id}: ${[...row.tagIds].sort().join(', ')}`
    );
    expect(summary).toMatchSnapshot();
  });
});
