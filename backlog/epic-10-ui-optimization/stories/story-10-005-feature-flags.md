# Story 10-005: Feature Flag System

## Story

**As a** product owner
**I want** to enable/disable features via configuration
**So that** I can release an MVP with minimal functionality and gradually add features

## Points: 8

## Priority: Critical

## Status: TODO

## Description

Implement a feature flag system that allows controlling which features are enabled or disabled in the application. This enables releasing an MVP with only training and settings, while hiding progress tracking, help system, and other features until they are ready.

## Acceptance Criteria

- [ ] Feature flags defined in configuration file
- [ ] Environment variable overrides supported
- [ ] useFeatureFlag hook for checking feature status
- [ ] FeatureGate component for conditional rendering
- [ ] Disabled nav items hidden from bottom navigation
- [ ] Disabled routes redirect to home or show "coming soon"
- [ ] No errors or broken links when features are disabled
- [ ] Feature flags work at build time (static) and runtime

## MVP Configuration

| Feature | Flag Name | MVP Status |
|---------|-----------|------------|
| Training | `FEATURE_TRAINING` | Enabled |
| Level Selection | `FEATURE_LEVELS` | Enabled |
| Settings | `FEATURE_SETTINGS` | Enabled |
| Progress/Stats | `FEATURE_PROGRESS` | Disabled |
| Help System | `FEATURE_HELP` | Disabled |
| Onboarding | `FEATURE_ONBOARDING` | Disabled |
| Results History | `FEATURE_RESULTS` | Disabled |

## Technical Details

### Feature Configuration

```typescript
// src/config/features.ts

export type FeatureFlag =
  | 'FEATURE_TRAINING'
  | 'FEATURE_LEVELS'
  | 'FEATURE_SETTINGS'
  | 'FEATURE_PROGRESS'
  | 'FEATURE_HELP'
  | 'FEATURE_ONBOARDING'
  | 'FEATURE_RESULTS';

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
};

export function isFeatureEnabled(flag: FeatureFlag): boolean {
  // Check environment variable override
  const envValue = process.env[`NEXT_PUBLIC_${flag}`];
  if (envValue !== undefined) {
    return envValue === 'true';
  }

  // Fall back to default
  return FEATURE_FLAGS[flag].defaultEnabled;
}
```

### Feature Flag Hook

```typescript
// src/hooks/useFeatureFlag.ts

import { useMemo } from 'react';
import { isFeatureEnabled, FeatureFlag } from '@/config/features';

export function useFeatureFlag(flag: FeatureFlag): boolean {
  return useMemo(() => isFeatureEnabled(flag), [flag]);
}

export function useFeatureFlags(flags: FeatureFlag[]): Record<FeatureFlag, boolean> {
  return useMemo(() => {
    return flags.reduce((acc, flag) => {
      acc[flag] = isFeatureEnabled(flag);
      return acc;
    }, {} as Record<FeatureFlag, boolean>);
  }, [flags]);
}
```

### Feature Gate Component

```typescript
// src/components/FeatureGate.tsx

import { type ReactNode } from 'react';
import { useFeatureFlag } from '@/hooks/useFeatureFlag';
import { FeatureFlag } from '@/config/features';

interface FeatureGateProps {
  flag: FeatureFlag;
  children: ReactNode;
  fallback?: ReactNode;
}

export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  const isEnabled = useFeatureFlag(flag);

  if (!isEnabled) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}
```

### Navigation Integration

```typescript
// src/components/navigation/BottomNavigation.tsx

const NAV_ITEMS = [
  { href: '/', label: 'Home', icon: HomeIcon, feature: null }, // Always shown
  { href: '/levels', label: 'Train', icon: PlayIcon, feature: 'FEATURE_LEVELS' },
  { href: '/progress', label: 'Progress', icon: ChartIcon, feature: 'FEATURE_PROGRESS' },
  { href: '/settings', label: 'Settings', icon: SettingsIcon, feature: 'FEATURE_SETTINGS' },
];

// Filter nav items based on feature flags
const enabledNavItems = NAV_ITEMS.filter(item =>
  item.feature === null || isFeatureEnabled(item.feature as FeatureFlag)
);
```

### Environment Variables

```bash
# .env.local (MVP configuration)
NEXT_PUBLIC_FEATURE_TRAINING=true
NEXT_PUBLIC_FEATURE_LEVELS=true
NEXT_PUBLIC_FEATURE_SETTINGS=true
NEXT_PUBLIC_FEATURE_PROGRESS=false
NEXT_PUBLIC_FEATURE_HELP=false
NEXT_PUBLIC_FEATURE_ONBOARDING=false
NEXT_PUBLIC_FEATURE_RESULTS=false
```

## Route Protection

```typescript
// src/app/progress/page.tsx

import { redirect } from 'next/navigation';
import { isFeatureEnabled } from '@/config/features';

export default function ProgressPage() {
  if (!isFeatureEnabled('FEATURE_PROGRESS')) {
    redirect('/');
  }

  return <ProgressContent />;
}
```

## Tasks

- [ ] Create `src/config/features.ts` with feature definitions
- [ ] Create `useFeatureFlag` hook
- [ ] Create `FeatureGate` component
- [ ] Update BottomNavigation to filter by feature flags
- [ ] Add route protection to disabled pages
- [ ] Update `.env.example` with feature flag documentation
- [ ] Configure MVP feature flags in production env
- [ ] Test all combinations of enabled/disabled features
- [ ] Document feature flag usage for developers
- [ ] Add admin/debug UI for viewing feature status (dev only)

## Dependencies

- None (foundational infrastructure)

## Notes

- Use `NEXT_PUBLIC_` prefix for client-side access
- Feature flags should be checked at build time when possible
- Consider using a feature flag service (LaunchDarkly, etc.) for production
- Keep the number of flags manageable
- Document each flag's purpose and expected lifecycle
- Plan for flag cleanup when features are permanently enabled
