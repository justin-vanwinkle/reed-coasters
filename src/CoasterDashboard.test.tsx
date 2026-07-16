/**
 * Dashboard integration smoke test
 * Renders every tab to catch wiring/crash regressions across sections
 */

import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CoasterDashboard from './CoasterDashboard';

const TAB_LABELS = [
  'Overview',
  "Reed's Story",
  'Height & Speed',
  "Inversions & G's",
  'Tracks & Time',
  'Builders & Types',
  'Records',
  'Showdown',
  'Coaster Details',
];

describe('CoasterDashboard', () => {
  it('renders all nine tabs', () => {
    render(<CoasterDashboard />);
    TAB_LABELS.forEach((label) => {
      expect(screen.getByRole('tab', { name: label })).toBeTruthy();
    });
  });

  it('every tab renders without crashing when activated', () => {
    render(<CoasterDashboard />);
    TAB_LABELS.forEach((label) => {
      fireEvent.click(screen.getByRole('tab', { name: label }));
      expect(screen.getByRole('tab', { name: label, selected: true })).toBeTruthy();
    });
  });

  it('opens the coaster modal from a favorites row on Reed\'s Story', () => {
    render(<CoasterDashboard />);
    fireEvent.click(screen.getByRole('tab', { name: "Reed's Story" }));
    const barnstormerRow = screen.getAllByText('The Barnstormer')[0];
    fireEvent.click(barnstormerRow.closest('button') ?? barnstormerRow);
    expect(screen.getByRole('dialog')).toBeTruthy();
  });
});
