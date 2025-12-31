# Story 09-001: Create Mobile Header

## Story

**As a** mobile/tablet user
**I want** a compact header at the top of the screen
**So that** I can see where I am and access the menu

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Build a mobile-optimized header component that displays at the top of all pages on mobile and tablet viewports. The header should show the app logo, current page title, and provide access to contextual actions.

## Acceptance Criteria

- [ ] Header is fixed/sticky at the top of the viewport
- [ ] Displays app logo on the left
- [ ] Shows current page title in the center
- [ ] Has contextual action button on the right (back, menu, etc.)
- [ ] Respects safe area insets (iOS notch)
- [ ] Height is appropriate for touch (56-64px)
- [ ] Background has subtle blur effect
- [ ] Hidden during active training session (optional)

## Components

- MobileHeader
- HeaderLogo
- HeaderTitle
- HeaderAction

## Technical Details

```typescript
// src/components/navigation/MobileHeader.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { ChevronLeft, Menu } from 'lucide-react';

interface MobileHeaderProps {
  className?: string;
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const pathname = usePathname();

  // Determine page title from route
  const getPageTitle = () => {
    if (pathname === '/') return 'Neuralift';
    if (pathname === '/levels') return 'Choose Level';
    if (pathname === '/progress') return 'Progress';
    if (pathname === '/settings') return 'Settings';
    if (pathname.startsWith('/train/')) return 'Training';
    if (pathname.startsWith('/results/')) return 'Results';
    return 'Neuralift';
  };

  // Show back button on nested pages
  const showBackButton = pathname !== '/' && pathname !== '/levels';

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-14 px-4',
        'flex items-center justify-between',
        'bg-bg-primary/80 backdrop-blur-lg',
        'border-b border-border-subtle',
        'safe-area-inset-top',
        className
      )}
    >
      {/* Left: Logo or Back Button */}
      <div className="w-10 flex justify-start">
        {showBackButton ? (
          <Link
            href="/"
            className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-surface-hover transition-colors"
            aria-label="Go back"
          >
            <ChevronLeft className="w-6 h-6 text-text-secondary" />
          </Link>
        ) : (
          <Link href="/" aria-label="Home">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan flex items-center justify-center">
              <span className="text-bg-primary font-bold text-sm">N</span>
            </div>
          </Link>
        )}
      </div>

      {/* Center: Page Title */}
      <h1 className="text-lg font-semibold text-text-primary">
        {getPageTitle()}
      </h1>

      {/* Right: Action Button */}
      <div className="w-10 flex justify-end">
        {/* Placeholder for future menu or actions */}
      </div>
    </header>
  );
}
```

## Styling

```css
/* Safe area support for iOS */
.safe-area-inset-top {
  padding-top: env(safe-area-inset-top, 0);
}
```

## Tasks

- [ ] Create MobileHeader component
- [ ] Implement route-based title logic
- [ ] Add back button for nested routes
- [ ] Style with blur background
- [ ] Add safe area inset support
- [ ] Test on various mobile devices
- [ ] Add to NavigationShell

## Dependencies

- Story 02-001 (CSS Variables)
- Story 02-003 (Tailwind Config)

## Notes

- Header should hide during active training to maximize screen space
- Consider adding a "mini" mode that shows only on scroll up
