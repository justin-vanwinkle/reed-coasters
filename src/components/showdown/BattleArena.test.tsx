/**
 * BattleArena Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BattleArena } from './BattleArena';

describe('BattleArena', () => {
  it('renders the default Fury 325 vs The Beast matchup', () => {
    render(<BattleArena />);

    expect(screen.getByLabelText('Left coaster')).toHaveValue('fury-325');
    expect(screen.getByLabelText('Right coaster')).toHaveValue('the-beast');
    expect(screen.getByText(/Fury 325 wins the showdown/)).toBeInTheDocument();
  });

  it('renders a row for each battle stat', () => {
    render(<BattleArena />);

    for (const label of [
      'Height',
      'Top Speed',
      'Track Length',
      'Inversions',
      'Drop Angle',
      'Thrill Score',
    ]) {
      expect(screen.getByText(label)).toBeInTheDocument();
    }
  });

  it('updates the winner banner when a select changes', () => {
    render(<BattleArena />);

    fireEvent.change(screen.getByLabelText('Left coaster'), {
      target: { value: 'the-barnstormer' },
    });

    expect(screen.queryByText(/Fury 325 wins the showdown/)).not.toBeInTheDocument();
    expect(screen.getByText(/The Beast wins the showdown/)).toBeInTheDocument();
  });
});
