# Story 09-003: Create Navigation Context

## Story

**As a** developer
**I want** a centralized navigation state context
**So that** components can control navigation visibility and behavior

## Points: 3

## Priority: High

## Status: TODO

## Description

Create a React context that manages navigation state across the app. This allows pages to control whether navigation is visible (e.g., hide during training) and provides navigation-related utilities.

## Acceptance Criteria

- [ ] Context provides navigation visibility state
- [ ] Components can hide/show navigation
- [ ] Supports different navigation modes
- [ ] Provides current breakpoint info
- [ ] Persists state across page transitions
- [ ] TypeScript types are well-defined

## Components

- NavigationProvider
- useNavigation hook
- useBreakpoint hook

## Technical Details

```typescript
// src/components/navigation/NavigationContext.tsx
'use client';

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';

type NavigationMode = 'full' | 'minimal' | 'hidden';
type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface NavigationContextValue {
  /** Current navigation visibility mode */
  mode: NavigationMode;
  /** Set navigation mode */
  setMode: (mode: NavigationMode) => void;
  /** Current viewport breakpoint */
  breakpoint: Breakpoint;
  /** Whether bottom nav should be visible */
  showBottomNav: boolean;
  /** Whether header should be visible */
  showHeader: boolean;
  /** Temporarily hide navigation (e.g., during training) */
  hideNavigation: () => void;
  /** Restore navigation to default mode */
  showNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
} as const;

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [mode, setMode] = useState<NavigationMode>('full');
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  // Update breakpoint on resize
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

  const hideNavigation = useCallback(() => setMode('hidden'), []);
  const showNavigation = useCallback(() => setMode('full'), []);

  // Determine visibility based on mode and breakpoint
  const showBottomNav = mode !== 'hidden' && breakpoint !== 'desktop';
  const showHeader = mode !== 'hidden';

  const value: NavigationContextValue = {
    mode,
    setMode,
    breakpoint,
    showBottomNav,
    showHeader,
    hideNavigation,
    showNavigation,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
```

```typescript
// src/components/navigation/hooks/useBreakpoint.ts
'use client';

import { useState, useEffect } from 'react';

type Breakpoint = 'mobile' | 'tablet' | 'desktop';

const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
} as const;

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

export function useIsMobile(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'mobile';
}

export function useIsDesktop(): boolean {
  const breakpoint = useBreakpoint();
  return breakpoint === 'desktop';
}
```

## Usage Example

```typescript
// In training session page
function TrainingSessionPage() {
  const { hideNavigation, showNavigation } = useNavigation();

  useEffect(() => {
    // Hide navigation during training
    hideNavigation();

    return () => {
      // Restore navigation when leaving
      showNavigation();
    };
  }, [hideNavigation, showNavigation]);

  return <div>Training content...</div>;
}
```

## Tasks

- [ ] Create NavigationContext with provider
- [ ] Create useNavigation hook
- [ ] Create useBreakpoint hook
- [ ] Add TypeScript types
- [ ] Add to app layout
- [ ] Test breakpoint detection
- [ ] Test hide/show functionality

## Dependencies

- None

## Notes

- Consider using CSS media queries via matchMedia for better performance
- May want to debounce resize handler
- Could add route-based auto-hiding logic
