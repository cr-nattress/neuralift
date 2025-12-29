'use client';

import { useState, useEffect, useMemo } from 'react';
import { Transition } from 'framer-motion';

/**
 * Hook to detect user's reduced motion preference
 * @returns true if user prefers reduced motion
 */
export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (event: MediaQueryListEvent) => {
      setReducedMotion(event.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  return reducedMotion;
}

/**
 * Returns a transition that respects reduced motion preferences.
 * If reduced motion is preferred, returns instant transition.
 */
export function useMotionTransition(transition: Transition): Transition {
  const prefersReducedMotion = useReducedMotion();

  return useMemo(() => {
    if (prefersReducedMotion) {
      return { duration: 0 };
    }
    return transition;
  }, [prefersReducedMotion, transition]);
}

/**
 * Returns animation props that can be spread onto motion components.
 * Automatically disables animations when reduced motion is preferred.
 */
export function useMotionProps(
  animateProps: Record<string, unknown>,
  transition?: Transition
) {
  const prefersReducedMotion = useReducedMotion();

  return useMemo(() => {
    if (prefersReducedMotion) {
      return {
        animate: animateProps,
        transition: { duration: 0 },
      };
    }
    return {
      animate: animateProps,
      transition,
    };
  }, [prefersReducedMotion, animateProps, transition]);
}
