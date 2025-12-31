'use client';

/**
 * Feature Gate Component
 *
 * Conditionally renders children based on feature flag status.
 * Optionally renders a fallback when feature is disabled.
 */

import { type ReactNode } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { type FeatureFlag } from '@/config/features';

interface FeatureGateProps {
  /** The feature flag to check */
  flag: FeatureFlag;
  /** Content to render when feature is enabled */
  children: ReactNode;
  /** Optional content to render when feature is disabled */
  fallback?: ReactNode;
}

export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const isEnabled = useFeatureFlag(flag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
