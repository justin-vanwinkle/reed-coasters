/**
 * ReedsStorySection Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ReedsStorySection } from './ReedsStorySection';
import { odometer, favoritesData } from '../../data';

describe('ReedsStorySection', () => {
  it('renders all 4 story cards', () => {
    render(<ReedsStorySection onSelectCoaster={() => {}} />);

    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(4);
    expect(screen.getByText(/Lifetime Odometer/)).toBeInTheDocument();
    expect(screen.getByText(/The Bravery Curve/)).toBeInTheDocument();
    expect(screen.getByText(/Most Ridden/)).toBeInTheDocument();
    expect(screen.getByText(/Coaster Firsts/)).toBeInTheDocument();
  });

  it('renders headline odometer numbers', async () => {
    render(<ReedsStorySection onSelectCoaster={() => {}} />);

    expect(screen.getByText('Total Rides')).toBeInTheDocument();
    expect(screen.getByText('Times Upside Down')).toBeInTheDocument();

    // AnimatedNumber counts up to the target after the IntersectionObserver fires
    await waitFor(
      () => {
        expect(
          screen.getAllByText(odometer.totalRides.toLocaleString()).length
        ).toBeGreaterThan(0);
      },
      { timeout: 4000 }
    );
  });

  it('calls onSelectCoaster with the coaster when a favorites row is clicked', () => {
    const onSelectCoaster = vi.fn();
    render(<ReedsStorySection onSelectCoaster={onSelectCoaster} />);

    const topFavorite = favoritesData[0];
    // The name may also appear in the firsts timeline; the leaderboard row comes first
    fireEvent.click(screen.getAllByText(topFavorite.name)[0]);

    expect(onSelectCoaster).toHaveBeenCalledTimes(1);
    expect(onSelectCoaster.mock.calls[0][0].id).toBe(topFavorite.id);
  });
});
