# Story 09-005: Responsive Navigation Shell

## Story

**As a** user
**I want** navigation that automatically adapts to my device
**So that** I have the best experience regardless of screen size

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Create a wrapper component that orchestrates all navigation components, handling responsive display logic and providing proper spacing for page content. This is the main integration point that brings together the header, bottom nav, and desktop header.

## Acceptance Criteria

- [ ] Automatically shows correct navigation for viewport size
- [ ] Provides proper padding/margin for page content
- [ ] Handles navigation hide/show state
- [ ] Smooth transitions between breakpoints
- [ ] No layout shift during navigation state changes
- [ ] Integrates with NavigationProvider

## Components

- NavigationShell
- PageContent (wrapper with proper spacing)

## Technical Details

```typescript
// src/components/navigation/NavigationShell.tsx
'use client';

import { type ReactNode } from 'react';
import { useNavigation } from './NavigationContext';
import { MobileHeader } from './MobileHeader';
import { BottomNavigation } from './BottomNavigation';
import { DesktopHeader } from './DesktopHeader';
import { cn } from '@/lib/utils';

interface NavigationShellProps {
  children: ReactNode;
}

export function NavigationShell({ children }: NavigationShellProps) {
  const { showHeader, showBottomNav, breakpoint } = useNavigation();

  return (
    <>
      {/* Desktop Header - only on large screens */}
      {showHeader && breakpoint === 'desktop' && <DesktopHeader />}

      {/* Mobile Header - on mobile and tablet */}
      {showHeader && breakpoint !== 'desktop' && <MobileHeader />}

      {/* Page Content with proper spacing */}
      <div
        className={cn(
          'min-h-screen',
          // Top padding for header
          showHeader && breakpoint !== 'desktop' && 'pt-14',
          showHeader && breakpoint === 'desktop' && 'pt-16',
          // Bottom padding for bottom nav
          showBottomNav && 'pb-20'
        )}
      >
        {children}
      </div>

      {/* Bottom Navigation - only on mobile and tablet */}
      {showBottomNav && <BottomNavigation />}
    </>
  );
}
```

```typescript
// src/components/navigation/index.ts
export { NavigationShell } from './NavigationShell';
export { NavigationProvider, useNavigation } from './NavigationContext';
export { MobileHeader } from './MobileHeader';
export { BottomNavigation } from './BottomNavigation';
export { DesktopHeader } from './DesktopHeader';
export { useBreakpoint, useIsMobile, useIsDesktop } from './hooks/useBreakpoint';
```

```typescript
// src/app/layout.tsx - Integration
import { NavigationProvider, NavigationShell } from '@/components/navigation';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <NavigationProvider>
          <NavigationShell>
            {children}
          </NavigationShell>
        </NavigationProvider>
      </body>
    </html>
  );
}
```

## Page Content Spacing

| Breakpoint | Header Height | Bottom Nav Height | Content Padding |
|------------|--------------|-------------------|-----------------|
| Mobile | 56px | 64px + safe-area | pt-14 pb-20 |
| Tablet | 56px | 64px + safe-area | pt-14 pb-20 |
| Desktop | 64px | None | pt-16 pb-0 |

## Tasks

- [ ] Create NavigationShell component
- [ ] Integrate with NavigationContext
- [ ] Add responsive padding logic
- [ ] Update app layout to use shell
- [ ] Test navigation hide/show
- [ ] Test breakpoint transitions
- [ ] Ensure no layout shift
- [ ] Test on all device sizes

## Dependencies

- Story 09-001 (Mobile Header)
- Story 09-002 (Bottom Navigation)
- Story 09-003 (Navigation Context)
- Story 09-004 (Desktop Header)

## Notes

- Consider using CSS variables for spacing values
- May need to handle scroll restoration
- AnimatePresence can be used for enter/exit animations
