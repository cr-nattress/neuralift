# Story 09-002: Create Bottom Navigation

## Story

**As a** mobile/tablet user
**I want** a navigation bar at the bottom of the screen
**So that** I can easily navigate between main sections with my thumb

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Build a bottom navigation bar component for mobile and tablet viewports. This follows the mobile-first pattern of having primary navigation at the bottom of the screen where it's easily reachable by thumb.

## Acceptance Criteria

- [ ] Fixed at the bottom of the viewport
- [ ] Contains 4 navigation items: Home, Train, Progress, Settings
- [ ] Each item has an icon and label
- [ ] Active item is visually highlighted
- [ ] Touch targets are at least 44x44px
- [ ] Respects safe area insets (iOS home indicator)
- [ ] Smooth transition animations on tap
- [ ] Hidden during active training session
- [ ] Badge support for notifications (future)

## Components

- BottomNavigation
- NavItem
- NavIcon
- NavLabel

## Technical Details

```typescript
// src/components/navigation/BottomNavigation.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Home, Play, BarChart3, Settings } from 'lucide-react';

interface NavItemConfig {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPaths?: string[];
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    href: '/',
    label: 'Home',
    icon: Home,
    matchPaths: ['/'],
  },
  {
    href: '/levels',
    label: 'Train',
    icon: Play,
    matchPaths: ['/levels', '/train'],
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: BarChart3,
    matchPaths: ['/progress', '/results'],
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: Settings,
    matchPaths: ['/settings'],
  },
];

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname();

  const isActive = (item: NavItemConfig) => {
    if (pathname === item.href) return true;
    return item.matchPaths?.some((path) =>
      path === '/' ? pathname === '/' : pathname.startsWith(path)
    );
  };

  return (
    <nav
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'h-16 px-2',
        'flex items-center justify-around',
        'bg-bg-primary/90 backdrop-blur-lg',
        'border-t border-border-subtle',
        'safe-area-inset-bottom',
        className
      )}
      aria-label="Main navigation"
    >
      {NAV_ITEMS.map((item) => {
        const active = isActive(item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center',
              'min-w-[64px] h-12 px-3 rounded-xl',
              'transition-all duration-200',
              active
                ? 'text-accent-cyan'
                : 'text-text-muted hover:text-text-secondary'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <motion.div
              className="relative"
              whileTap={{ scale: 0.9 }}
            >
              {/* Active indicator */}
              {active && (
                <motion.div
                  className="absolute -inset-2 bg-accent-cyan/10 rounded-xl"
                  layoutId="nav-active-bg"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <Icon className="w-6 h-6 relative z-10" />
            </motion.div>
            <span className={cn(
              'text-xs mt-1 font-medium',
              active ? 'text-accent-cyan' : 'text-text-muted'
            )}>
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
```

## Styling

```css
/* Safe area support for iOS home indicator */
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom, 0);
}
```

## Visual States

| State | Icon Color | Label Color | Background |
|-------|------------|-------------|------------|
| Default | text-muted | text-muted | transparent |
| Hover | text-secondary | text-secondary | transparent |
| Active | accent-cyan | accent-cyan | accent-cyan/10 |
| Pressed | accent-cyan | accent-cyan | scale(0.9) |

## Tasks

- [ ] Create BottomNavigation component
- [ ] Create NavItem subcomponent
- [ ] Implement active route detection
- [ ] Add animated active indicator
- [ ] Style with blur background
- [ ] Add safe area inset support
- [ ] Add whileTap animation
- [ ] Test touch targets on mobile
- [ ] Hide during training session

## Dependencies

- Story 02-001 (CSS Variables)
- Story 02-003 (Tailwind Config)

## Notes

- Consider adding haptic feedback on tap (if supported)
- Badge support can be added later for notifications
- May want to add a "floating" variant for certain pages
