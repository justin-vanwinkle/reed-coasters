/**
 * Hero Component Tests
 */

import { afterEach, describe, it, expect, vi } from 'vitest';
import { act, render, screen } from '@testing-library/react';
import { Hero } from './Hero';

const PROMPTS = [
  'Can you ride more than me?',
  'Think you can top my coaster count?',
  'Front row or back row?',
  'How many loops is too many? Trick question.',
  'Big drops. Bigger bragging rights.',
  'The midway called—it wants another lap.',
  'Keep your hands up and your coaster count higher.',
  'One more ride? Always.',
  'Ready to earn some airtime?',
  "What’s your next must-ride?",
  'Your next favorite coaster is still out there.',
  'Queue up. Strap in. Brag later.',
];

function mockReducedMotion(matches: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation(() => ({
      matches,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    }))
  );
}

afterEach(() => {
  sessionStorage.clear();
  vi.useRealTimers();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

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

  it('renders an approved prompt before the stat cards', () => {
    render(<Hero />);

    const prompt = screen.getByTestId('hero-prompt');
    const firstStat = screen.getByText('Coasters');

    expect(PROMPTS).toContain(prompt.textContent);
    expect(
      prompt.compareDocumentPosition(firstStat) & Node.DOCUMENT_POSITION_FOLLOWING
    ).toBeTruthy();
  });

  it('rotates to a different prompt after 10 seconds', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    render(<Hero />);
    const openingPrompt = screen.getByTestId('hero-prompt').textContent;

    act(() => {
      vi.advanceTimersByTime(10_000);
    });

    expect(screen.getByTestId('hero-prompt')).not.toHaveTextContent(openingPrompt ?? '');
  });

  it('does not reuse the last displayed prompt after remounting', () => {
    vi.spyOn(Math, 'random').mockReturnValue(0);
    const firstRender = render(<Hero />);
    const previousPrompt = screen.getByTestId('hero-prompt').textContent;
    firstRender.unmount();

    render(<Hero />);

    expect(screen.getByTestId('hero-prompt')).not.toHaveTextContent(previousPrompt ?? '');
  });

  it('keeps the opening prompt static when reduced motion is preferred', () => {
    vi.useFakeTimers();
    vi.spyOn(Math, 'random').mockReturnValue(0);
    mockReducedMotion(true);
    render(<Hero />);
    const openingPrompt = screen.getByTestId('hero-prompt').textContent;

    act(() => {
      vi.advanceTimersByTime(20_000);
    });

    expect(screen.getByTestId('hero-prompt')).toHaveTextContent(openingPrompt ?? '');
  });
});
