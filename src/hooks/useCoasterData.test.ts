/**
 * useCoasterData Hook Tests
 * Tests for the main data hook
 */

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useCoasterData } from './useCoasterData';

describe('useCoasterData', () => {
  it('returns stable reference across re-renders', () => {
    const { result, rerender } = renderHook(() => useCoasterData());

    const firstRender = result.current;
    rerender();
    const secondRender = result.current;

    // Same reference means memoization is working
    expect(firstRender).toBe(secondRender);
  });

  it('returns coasters array', () => {
    const { result } = renderHook(() => useCoasterData());

    expect(result.current.coasters).toBeDefined();
    expect(Array.isArray(result.current.coasters)).toBe(true);
    expect(result.current.coasters.length).toBeGreaterThan(0);
  });

  it('returns stats object', () => {
    const { result } = renderHook(() => useCoasterData());

    expect(result.current.stats).toBeDefined();
    expect(result.current.stats.totalCoasters).toBe(result.current.coasters.length);
  });

  it('returns all chart data arrays', () => {
    const { result } = renderHook(() => useCoasterData());

    expect(Array.isArray(result.current.heightData)).toBe(true);
    expect(Array.isArray(result.current.speedData)).toBe(true);
    expect(Array.isArray(result.current.scatterData)).toBe(true);
    expect(Array.isArray(result.current.inversionData)).toBe(true);
    expect(Array.isArray(result.current.parkPieData)).toBe(true);
    expect(Array.isArray(result.current.mfrPieData)).toBe(true);
    expect(Array.isArray(result.current.timelineData)).toBe(true);
    expect(Array.isArray(result.current.decadeData)).toBe(true);
    expect(Array.isArray(result.current.trackData)).toBe(true);
    expect(Array.isArray(result.current.gforceData)).toBe(true);
    expect(Array.isArray(result.current.recordCategories)).toBe(true);
  });

  it('returns utility functions', () => {
    const { result } = renderHook(() => useCoasterData());

    expect(typeof result.current.findCoasterByName).toBe('function');
    expect(typeof result.current.getParkColor).toBe('function');
    expect(typeof result.current.getMfrColor).toBe('function');
    expect(typeof result.current.getParkGroup).toBe('function');
    expect(typeof result.current.truncateName).toBe('function');
  });

  it('utility functions work correctly', () => {
    const { result } = renderHook(() => useCoasterData());

    // Test findCoasterByName
    const beast = result.current.findCoasterByName('The Beast');
    expect(beast?.name).toBe('The Beast');

    // Test getParkColor
    const color = result.current.getParkColor('Kings Island');
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);

    // Test getParkGroup
    const group = result.current.getParkGroup('Hollywood Studios');
    expect(group).toBe('Walt Disney World');

    // Test truncateName
    const truncated = result.current.truncateName('This is a very long coaster name');
    expect(truncated.length).toBeLessThanOrEqual(18);
  });
});
