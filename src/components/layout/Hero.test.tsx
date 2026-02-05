/**
 * Hero Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Hero } from './Hero';

describe('Hero', () => {
  it('renders the title', () => {
    render(<Hero />);
    expect(screen.getByText("Reed's Roller Coaster Universe")).toBeInTheDocument();
  });

  it('renders the eyebrow text', () => {
    render(<Hero />);
    expect(screen.getByText('Data Visualization')).toBeInTheDocument();
  });

  it('renders the subtitle', () => {
    render(<Hero />);
    // Subtitle contains key phrases
    expect(screen.getByText(/coasters.*parks.*years/i)).toBeInTheDocument();
  });

  it('renders all stat cards', () => {
    render(<Hero />);

    // Check for stat labels
    expect(screen.getByText('Coasters')).toBeInTheDocument();
    expect(screen.getByText('Max Height')).toBeInTheDocument();
    expect(screen.getByText('Top Speed')).toBeInTheDocument();
    expect(screen.getByText('Inversions')).toBeInTheDocument();
    expect(screen.getByText('Peak G-Force')).toBeInTheDocument();
  });
});
