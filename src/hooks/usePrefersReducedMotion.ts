import { useSyncExternalStore } from 'react';

const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

let mediaQuery: MediaQueryList | null = null;

function getMediaQuery(): MediaQueryList | null {
  if (
    mediaQuery === null &&
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function'
  ) {
    mediaQuery = window.matchMedia(REDUCED_MOTION_QUERY);
  }

  return mediaQuery;
}

function subscribe(onStoreChange: () => void): () => void {
  const query = getMediaQuery();
  query?.addEventListener?.('change', onStoreChange);
  return () => query?.removeEventListener?.('change', onStoreChange);
}

function getSnapshot(): boolean {
  return getMediaQuery()?.matches ?? false;
}

function getServerSnapshot(): boolean {
  return false;
}

export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
