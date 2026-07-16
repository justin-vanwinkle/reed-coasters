/**
 * ParkMap Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import { ParkMap } from './ParkMap';

describe('ParkMap', () => {
  it('renders all three states', () => {
    render(<ParkMap />);

    expect(screen.getByText('Ohio')).toBeInTheDocument();
    expect(screen.getByText('North Carolina')).toBeInTheDocument();
    expect(screen.getByText('Florida')).toBeInTheDocument();
  });

  it('shows the derived count of 12 coasters for Ohio', () => {
    render(<ParkMap />);

    const ohioCard = screen.getByTestId('state-Ohio');
    expect(within(ohioCard).getAllByText('12').length).toBeGreaterThanOrEqual(1);
  });

  it('lists park chips inside their state card', () => {
    render(<ParkMap />);

    const ohioCard = screen.getByTestId('state-Ohio');
    expect(within(ohioCard).getByText('Kings Island')).toBeInTheDocument();
  });
});
