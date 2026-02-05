/**
 * GlassCard Component Tests
 */

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { GlassCard } from './GlassCard';

describe('GlassCard', () => {
  it('renders title', () => {
    render(
      <GlassCard title="Test Title">
        <div>Content</div>
      </GlassCard>
    );

    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('renders subtitle when provided', () => {
    render(
      <GlassCard title="Test Title" subtitle="Test Subtitle">
        <div>Content</div>
      </GlassCard>
    );

    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders children', () => {
    render(
      <GlassCard title="Test Title">
        <div data-testid="child">Child Content</div>
      </GlassCard>
    );

    expect(screen.getByTestId('child')).toBeInTheDocument();
  });

  it('applies span class when span prop is true', () => {
    const { container } = render(
      <GlassCard title="Test Title" span>
        <div>Content</div>
      </GlassCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('span');
  });

  it('applies custom className', () => {
    const { container } = render(
      <GlassCard title="Test Title" className="custom-class">
        <div>Content</div>
      </GlassCard>
    );

    const card = container.firstChild as HTMLElement;
    expect(card.className).toContain('custom-class');
  });
});
