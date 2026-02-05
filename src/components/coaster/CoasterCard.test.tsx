/**
 * CoasterCard Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { CoasterCard } from './CoasterCard';
import type { Coaster } from '../../data/coasters.types';

const mockCoaster: Coaster = {
  id: 'test-1',
  name: 'Test Coaster',
  park: 'Kings Island',
  parkGroup: 'Kings Island',
  manufacturer: 'B&M',
  manufacturerShort: 'B&M',
  coasterType: 'Steel',
  yearOpened: 2000,
  height: 200,
  speed: 65,
  inversions: 3,
  trackLength: 4500,
  duration: '2:30',
  drop: 180,
  dropAngle: 85,
  maxGForce: 4.0,
  povVideo: null,
  imageUrl: 'https://example.com/image.jpg',
  specialElements: 'Loop, corkscrew',
  records: 'Tallest in park',
  timesRidden: 5,
  reedsAgeOnFirstRide: 8,
};

describe('CoasterCard', () => {
  it('renders coaster name', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    expect(screen.getByText('Test Coaster')).toBeInTheDocument();
  });

  it('renders park badge', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    expect(screen.getByText('Kings Island')).toBeInTheDocument();
  });

  it('renders year badge', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    expect(screen.getByText('2000')).toBeInTheDocument();
  });

  it('renders height stat', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    expect(screen.getByText('200')).toBeInTheDocument();
    expect(screen.getByText('ft')).toBeInTheDocument();
  });

  it('renders speed stat', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    expect(screen.getByText('65')).toBeInTheDocument();
    expect(screen.getByText('mph')).toBeInTheDocument();
  });

  it('renders inversions when greater than 0', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('loops')).toBeInTheDocument();
  });

  it('does not render inversions when 0', () => {
    const onSelect = vi.fn();
    const coasterWithoutInversions = { ...mockCoaster, inversions: 0 };
    render(<CoasterCard coaster={coasterWithoutInversions} onSelect={onSelect} />);

    expect(screen.queryByText('loops')).not.toBeInTheDocument();
  });

  it('calls onSelect when clicked', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    fireEvent.click(screen.getByText('Test Coaster').closest('div')!);
    expect(onSelect).toHaveBeenCalledWith(mockCoaster);
  });

  it('renders click hint', () => {
    const onSelect = vi.fn();
    render(<CoasterCard coaster={mockCoaster} onSelect={onSelect} />);

    expect(screen.getByText('Click for details →')).toBeInTheDocument();
  });
});
