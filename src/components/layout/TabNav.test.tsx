/**
 * TabNav Component Tests
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { TabNav, type Tab } from './TabNav';

const mockTabs: Tab[] = [
  { id: 'tab1', label: 'First Tab' },
  { id: 'tab2', label: 'Second Tab' },
  { id: 'tab3', label: 'Third Tab' },
];

describe('TabNav', () => {
  it('renders all tabs', () => {
    const onTabChange = vi.fn();
    render(<TabNav tabs={mockTabs} activeTab="tab1" onTabChange={onTabChange} />);

    expect(screen.getByText('First Tab')).toBeInTheDocument();
    expect(screen.getByText('Second Tab')).toBeInTheDocument();
    expect(screen.getByText('Third Tab')).toBeInTheDocument();
  });

  it('marks active tab with aria-selected', () => {
    const onTabChange = vi.fn();
    render(<TabNav tabs={mockTabs} activeTab="tab2" onTabChange={onTabChange} />);

    expect(screen.getByText('First Tab')).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByText('Second Tab')).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByText('Third Tab')).toHaveAttribute('aria-selected', 'false');
  });

  it('calls onTabChange with tab id when clicked', () => {
    const onTabChange = vi.fn();
    render(<TabNav tabs={mockTabs} activeTab="tab1" onTabChange={onTabChange} />);

    fireEvent.click(screen.getByText('Second Tab'));
    expect(onTabChange).toHaveBeenCalledWith('tab2');

    fireEvent.click(screen.getByText('Third Tab'));
    expect(onTabChange).toHaveBeenCalledWith('tab3');
  });

  it('all tabs have role="tab"', () => {
    const onTabChange = vi.fn();
    render(<TabNav tabs={mockTabs} activeTab="tab1" onTabChange={onTabChange} />);

    const tabs = screen.getAllByRole('tab');
    expect(tabs).toHaveLength(3);
  });
});
