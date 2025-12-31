'use client';

/**
 * Reduced Motion Hook
 *
 * Detects if the user prefers reduced motion for accessibility.
 * Components should disable or simplify animations when this returns true.
 */

import { useState, useEffect } from 'react';

/**
 * Get initial reduced motion preference (SSR-safe)
 */
function getInitialReducedMotion(): boolean {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return false;
  }
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Returns true if the user has enabled reduced motion in their system settings
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(getInitialReducedMotion);

  useEffect(() => {
    // Check if matchMedia is available (client-side only)
    if (typeof window === 'undefined' || !window.matchMedia) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const handler = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    // Use addEventListener for modern browsers
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}
