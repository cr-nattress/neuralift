# Story 09-004: Create Desktop Header

## Story

**As a** desktop user
**I want** a full-width header with horizontal navigation
**So that** I can navigate the app using familiar desktop patterns

## Points: 3

## Priority: High

## Status: TODO

## Description

Build a desktop-optimized header that displays horizontal navigation links. This replaces the mobile header + bottom nav pattern when the viewport is 1024px or wider.

## Acceptance Criteria

- [ ] Only displays on desktop (≥ 1024px)
- [ ] Full-width with centered content
- [ ] Logo on the left
- [ ] Navigation links in the center/right
- [ ] Active link is highlighted
- [ ] Hover states for all interactive elements
- [ ] Sticky at top of viewport
- [ ] Subtle background blur

## Components

- DesktopHeader
- DesktopNavLink
- HeaderLogo

## Technical Details

```typescript
// src/components/navigation/DesktopHeader.tsx
'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Home, Play, BarChart3, Settings } from 'lucide-react';

interface NavLink {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPaths?: string[];
}

const NAV_LINKS: NavLink[] = [
  { href: '/', label: 'Home', icon: Home, matchPaths: ['/'] },
  { href: '/levels', label: 'Train', icon: Play, matchPaths: ['/levels', '/train'] },
  { href: '/progress', label: 'Progress', icon: BarChart3, matchPaths: ['/progress', '/results'] },
  { href: '/settings', label: 'Settings', icon: Settings, matchPaths: ['/settings'] },
];

interface DesktopHeaderProps {
  className?: string;
}

export function DesktopHeader({ className }: DesktopHeaderProps) {
  const pathname = usePathname();

  const isActive = (link: NavLink) => {
    if (pathname === link.href) return true;
    return link.matchPaths?.some((path) =>
      path === '/' ? pathname === '/' : pathname.startsWith(path)
    );
  };

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-16 px-6',
        'hidden lg:flex items-center justify-between',
        'bg-bg-primary/80 backdrop-blur-lg',
        'border-b border-border-subtle',
        className
      )}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-10 h-10 rounded-xl bg-accent-cyan flex items-center justify-center group-hover:shadow-glow-cyan transition-shadow">
          <span className="text-bg-primary font-bold text-lg">N</span>
        </div>
        <span className="text-xl font-semibold text-text-primary">
          Neuralift
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-1" aria-label="Main navigation">
        {NAV_LINKS.map((link) => {
          const active = isActive(link);
          const Icon = link.icon;

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-xl',
                'text-sm font-medium transition-all duration-200',
                active
                  ? 'text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.div
                  className="absolute inset-0 bg-accent-cyan/10 rounded-xl"
                  layoutId="desktop-nav-active"
                  transition={{ type: 'spring', duration: 0.5 }}
                />
              )}
              <Icon className="w-4 h-4 relative z-10" />
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right side placeholder for future features */}
      <div className="w-[140px]" />
    </header>
  );
}
```

## Visual Design

```
┌──────────────────────────────────────────────────────────────────────┐
│  [N] Neuralift                    Home  Train  Progress  Settings    │
│                                    ▔▔▔▔                              │
│                                  (active)                            │
└──────────────────────────────────────────────────────────────────────┘
```

## Tasks

- [ ] Create DesktopHeader component
- [ ] Add logo with hover effect
- [ ] Create horizontal nav links
- [ ] Implement active state with animation
- [ ] Add blur background
- [ ] Use CSS `hidden lg:flex` for responsive display
- [ ] Test on various desktop widths

## Dependencies

- Story 02-001 (CSS Variables)
- Story 02-003 (Tailwind Config)
- Story 09-003 (Navigation Context)

## Notes

- Uses Tailwind's `lg:` breakpoint (1024px)
- Consider adding user avatar/account in the future
- May want to add a search feature later
