'use client';

/**
 * Breakpoint Detection Hooks
 *
 * Provides hooks for detecting current viewport breakpoint
 * and responsive behavior helpers.
 */

import { useState, useEffect } from 'react';

export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
} as const;

/**
 * Returns the current viewport breakpoint
 */
export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.desktop) {
        setBreakpoint('desktop');
      } else if (width >= BREAKPOINTS.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  return breakpoint;
}

/**
 * Returns true if viewport is mobile size
 */
export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
}

/**
 * Returns true if viewport is tablet size
 */
export function useIsTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'tablet';
}

/**
 * Returns true if viewport is desktop size
 */
export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop';
}

/**
 * Returns true if viewport is mobile or tablet (shows bottom nav)
 */
export function useIsMobileOrTablet(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile' || breakpoint === 'tablet';
}
