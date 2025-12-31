/**
 * Feature Flags Configuration
 *
 * Controls which features are enabled/disabled in the application.
 * Used to enable MVP releases with minimal functionality.
 */

export type FeatureFlag =
  | 'FEATURE_TRAINING'
  | 'FEATURE_LEVELS'
  | 'FEATURE_SETTINGS'
  | 'FEATURE_PROGRESS'
  | 'FEATURE_HELP'
  | 'FEATURE_ONBOARDING'
  | 'FEATURE_RESULTS'
  | 'FEATURE_PHASE_FOUNDATIONS'
  | 'FEATURE_PHASE_INTERMEDIATE'
  | 'FEATURE_PHASE_ADVANCED';

interface FeatureConfig {
  name: string;
  description: string;
  defaultEnabled: boolean;
}

export const FEATURE_FLAGS: Record<FeatureFlag, FeatureConfig> = {
  FEATURE_TRAINING: {
    name: 'Training',
    description: 'Core training functionality',
    defaultEnabled: true,
  },
  FEATURE_LEVELS: {
    name: 'Level Selection',
    description: 'Level selection and progression',
    defaultEnabled: true,
  },
  FEATURE_SETTINGS: {
    name: 'Settings',
    description: 'User preferences and settings',
    defaultEnabled: true,
  },
  FEATURE_PROGRESS: {
    name: 'Progress Tracking',
    description: 'Statistics and progress visualization',
    defaultEnabled: false,
  },
  FEATURE_HELP: {
    name: 'Help System',
    description: 'In-app help and tutorials',
    defaultEnabled: false,
  },
  FEATURE_ONBOARDING: {
    name: 'Onboarding',
    description: 'New user onboarding flow',
    defaultEnabled: false,
  },
  FEATURE_RESULTS: {
    name: 'Results History',
    description: 'Session results and history',
    defaultEnabled: false,
  },
  FEATURE_PHASE_FOUNDATIONS: {
    name: 'Foundations Phase',
    description: 'Position 1-back and Audio 1-back levels',
    defaultEnabled: true,
  },
  FEATURE_PHASE_INTERMEDIATE: {
    name: 'Intermediate Phase',
    description: 'Position 2-back and Audio 2-back levels',
    defaultEnabled: false,
  },
  FEATURE_PHASE_ADVANCED: {
    name: 'Advanced Phase',
    description: 'Dual 2-back and Dual 3-back levels',
    defaultEnabled: false,
  },
};

/**
 * Check if a feature is enabled
 * Checks environment variable override first, then falls back to default
 */
export function isFeatureEnabled(flag: FeatureFlag): boolean {
  // Check environment variable override (client-side safe)
  if (typeof window !== 'undefined') {
    const envKey = `NEXT_PUBLIC_${flag}`;
    const envValue = process.env[envKey];
    if (envValue !== undefined) {
      return envValue === 'true';
    }
  }

  // Fall back to default configuration
  return FEATURE_FLAGS[flag].defaultEnabled;
}

/**
 * Get all feature flags with their current status
 */
export function getAllFeatureFlags(): Record<FeatureFlag, boolean> {
  return Object.keys(FEATURE_FLAGS).reduce(
    (acc, flag) => {
      acc[flag as FeatureFlag] = isFeatureEnabled(flag as FeatureFlag);
      return acc;
    },
    {} as Record<FeatureFlag, boolean>
  );
}

/**
 * Navigation items with their associated feature flags
 */
export const NAV_FEATURE_MAP: Record<string, FeatureFlag | null> = {
  '/': null, // Home is always enabled
  '/levels': 'FEATURE_LEVELS',
  '/train': 'FEATURE_TRAINING',
  '/progress': 'FEATURE_PROGRESS',
  '/settings': 'FEATURE_SETTINGS',
  '/results': 'FEATURE_RESULTS',
};
