/**
 * SkylineChart Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SkylineChart } from './SkylineChart';

describe('SkylineChart', () => {
  it('renders 34 coaster silhouettes and 2 reference silhouettes', () => {
    const { container } = render(<SkylineChart onSelectCoaster={() => {}} />);

    expect(container.querySelectorAll('[data-testid^="skyline-coaster-"]')).toHaveLength(34);
    expect(container.querySelectorAll('[data-testid^="skyline-ref-"]')).toHaveLength(2);
  });

  it('calls onSelectCoaster with the clicked coaster', () => {
    const onSelectCoaster = vi.fn();
    render(<SkylineChart onSelectCoaster={onSelectCoaster} />);

    fireEvent.click(screen.getByTestId('skyline-coaster-fury-325'));

    expect(onSelectCoaster).toHaveBeenCalledTimes(1);
    expect(onSelectCoaster.mock.calls[0][0].id).toBe('fury-325');
  });

  it('lists excluded coasters in the footnote', () => {
    render(<SkylineChart onSelectCoaster={() => {}} />);

    expect(screen.getByText(/Not pictured:/)).toBeInTheDocument();
    expect(screen.getByText(/Blue Ridge/)).toBeInTheDocument();
  });
});
