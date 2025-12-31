'use client';

/**
 * Feature Flag Hook
 *
 * React hook for checking feature flag status.
 */

import { useMemo } from 'react';
import { isFeatureEnabled, type FeatureFlag } from '@/config/features';

/**
 * Check if a single feature is enabled
 */
export function useFeatureFlag(flag: FeatureFlag): boolean {
  return useMemo(() => isFeatureEnabled(flag), [flag]);
}

/**
 * Check multiple features at once
 */
export function useFeatureFlags(flags: FeatureFlag[]): Record<FeatureFlag, boolean> {
  return useMemo(() => {
    return flags.reduce(
      (acc, flag) => {
        acc[flag] = isFeatureEnabled(flag);
        return acc;
      },
      {} as Record<FeatureFlag, boolean>
    );
  }, [flags]);
}
