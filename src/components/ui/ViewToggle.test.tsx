/**
 * ViewToggle Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ViewToggle } from './ViewToggle';

describe('ViewToggle', () => {
  it('renders table and card view buttons', () => {
    const onViewChange = vi.fn();
    render(<ViewToggle view="table" onViewChange={onViewChange} />);

    expect(screen.getByText('Table View')).toBeInTheDocument();
    expect(screen.getByText('Card View')).toBeInTheDocument();
  });

  it('marks table button as active when view is table', () => {
    const onViewChange = vi.fn();
    render(<ViewToggle view="table" onViewChange={onViewChange} />);

    const tableButton = screen.getByText('Table View');
    expect(tableButton.getAttribute('aria-pressed')).toBe('true');

    const cardButton = screen.getByText('Card View');
    expect(cardButton.getAttribute('aria-pressed')).toBe('false');
  });

  it('marks card button as active when view is cards', () => {
    const onViewChange = vi.fn();
    render(<ViewToggle view="cards" onViewChange={onViewChange} />);

    const tableButton = screen.getByText('Table View');
    expect(tableButton.getAttribute('aria-pressed')).toBe('false');

    const cardButton = screen.getByText('Card View');
    expect(cardButton.getAttribute('aria-pressed')).toBe('true');
  });

  it('calls onViewChange with "table" when table button clicked', () => {
    const onViewChange = vi.fn();
    render(<ViewToggle view="cards" onViewChange={onViewChange} />);

    fireEvent.click(screen.getByText('Table View'));
    expect(onViewChange).toHaveBeenCalledWith('table');
  });

  it('calls onViewChange with "cards" when card button clicked', () => {
    const onViewChange = vi.fn();
    render(<ViewToggle view="table" onViewChange={onViewChange} />);

    fireEvent.click(screen.getByText('Card View'));
    expect(onViewChange).toHaveBeenCalledWith('cards');
  });
});
