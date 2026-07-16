/**
 * RecordsMarquee Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { RecordsMarquee } from './RecordsMarquee';
import { recordsMarqueeData, findCoasterById } from '../../data';

describe('RecordsMarquee', () => {
  it('renders record claims', () => {
    render(<RecordsMarquee onSelectCoaster={() => {}} />);

    const firstClaim = recordsMarqueeData[0];
    // The list is rendered twice for a seamless loop, so expect duplicates
    expect(
      screen.getAllByText((content) => content.includes(firstClaim.claim)).length
    ).toBeGreaterThanOrEqual(1);
  });

  it('exposes one accessible button per claim (the loop copy is aria-hidden)', () => {
    render(<RecordsMarquee onSelectCoaster={() => {}} />);

    expect(screen.getAllByRole('button')).toHaveLength(recordsMarqueeData.length);
  });

  it('calls onSelectCoaster with the matching coaster when a claim is clicked', () => {
    const handleSelect = vi.fn();
    render(<RecordsMarquee onSelectCoaster={handleSelect} />);

    fireEvent.click(screen.getAllByRole('button')[0]);

    const expected = findCoasterById(recordsMarqueeData[0].coasterId);
    expect(handleSelect).toHaveBeenCalledTimes(1);
    expect(handleSelect).toHaveBeenCalledWith(expected);
  });
});
