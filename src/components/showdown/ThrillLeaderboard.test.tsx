/**
 * ThrillLeaderboard Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ThrillLeaderboard } from './ThrillLeaderboard';
import { thrillScores } from '../../data';

describe('ThrillLeaderboard', () => {
  it('renders a row for all 35 coasters', () => {
    render(<ThrillLeaderboard entries={thrillScores} onSelectCoaster={() => {}} />);

    expect(screen.getAllByRole('button')).toHaveLength(35);
  });

  it('ranks Fury 325 first', () => {
    render(<ThrillLeaderboard entries={thrillScores} onSelectCoaster={() => {}} />);

    const rows = screen.getAllByRole('button');
    expect(rows[0]).toHaveTextContent('1');
    expect(rows[0]).toHaveTextContent('Fury 325');
    expect(rows[0]).toHaveTextContent('Carowinds');
  });

  it('calls onSelectCoaster with the clicked coaster', () => {
    const onSelectCoaster = vi.fn();
    render(<ThrillLeaderboard entries={thrillScores} onSelectCoaster={onSelectCoaster} />);

    fireEvent.click(screen.getAllByRole('button')[0]);

    expect(onSelectCoaster).toHaveBeenCalledWith(thrillScores[0].coaster);
    expect(onSelectCoaster.mock.calls[0][0].name).toBe('Fury 325');
  });
});
