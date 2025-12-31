# Story 09-008: Responsive Layout Components Architecture

## Story

**As a** developer
**I want** separate React components for mobile, tablet, and desktop layouts
**So that** the application logic is simplified and easier to maintain

## Points: 8

## Priority: High

## Status: TODO

## Description

Refactor the application to use dedicated layout components for each breakpoint (mobile, tablet, desktop). This architectural change simplifies conditional rendering logic by moving breakpoint-specific code into separate components. Shared UI elements should be abstracted into a reusable component layer that all layout variants can consume.

## Acceptance Criteria

- [ ] Create separate layout components for mobile, tablet, and desktop
- [ ] Abstract shared UI components into a reusable layer
- [ ] Each layout component handles its own breakpoint-specific logic
- [ ] Shared components are imported by layout variants as needed
- [ ] No breakpoint conditional logic scattered throughout components
- [ ] Clean separation of concerns between layouts and shared UI
- [ ] Existing functionality is preserved after refactor
- [ ] No visual regressions across any breakpoint

## Component Architecture

```
src/components/
├── layouts/                        # Breakpoint-specific layouts
│   ├── index.ts                    # Public exports + ResponsiveLayout
│   ├── ResponsiveLayout.tsx        # Switches between layouts based on breakpoint
│   ├── MobileLayout.tsx            # Mobile-specific layout (<640px)
│   ├── TabletLayout.tsx            # Tablet-specific layout (640-1024px)
│   └── DesktopLayout.tsx           # Desktop-specific layout (>1024px)
│
├── ui/                             # Shared UI components (reusable)
│   ├── index.ts
│   ├── Logo.tsx                    # App logo
│   ├── NavItem.tsx                 # Navigation item
│   ├── NavIcon.tsx                 # Navigation icons
│   ├── PageTitle.tsx               # Page title component
│   └── ...                         # Other shared primitives
│
└── navigation/                     # Navigation (existing, may be refactored)
    ├── BottomNavigation.tsx        # Uses ui/NavItem, ui/NavIcon
    ├── MobileHeader.tsx            # Uses ui/Logo, ui/PageTitle
    └── ...
```

## Technical Details

```typescript
// src/components/layouts/ResponsiveLayout.tsx
'use client';

import { useBreakpoint } from '@/hooks/useBreakpoint';
import { MobileLayout } from './MobileLayout';
import { TabletLayout } from './TabletLayout';
import { DesktopLayout } from './DesktopLayout';

interface ResponsiveLayoutProps {
  children: React.ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const breakpoint = useBreakpoint();

  switch (breakpoint) {
    case 'mobile':
      return <MobileLayout>{children}</MobileLayout>;
    case 'tablet':
      return <TabletLayout>{children}</TabletLayout>;
    case 'desktop':
      return <DesktopLayout>{children}</DesktopLayout>;
  }
}
```

```typescript
// src/components/layouts/MobileLayout.tsx
'use client';

import { MobileHeader } from '@/components/navigation/MobileHeader';
import { BottomNavigation } from '@/components/navigation/BottomNavigation';

interface MobileLayoutProps {
  children: React.ReactNode;
}

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <>
      <MobileHeader />
      <main className="min-h-screen pt-14 pb-20">
        {children}
      </main>
      <BottomNavigation />
    </>
  );
}
```

```typescript
// src/components/ui/NavItem.tsx
// Shared navigation item used by both BottomNavigation and any header nav

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  variant?: 'bottom' | 'header';
}

export function NavItem({ href, label, icon, active, variant = 'bottom' }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center transition-colors',
        variant === 'bottom' && 'flex-col gap-1 px-3 py-2',
        variant === 'header' && 'gap-2 px-4 py-2',
        active ? 'text-accent-cyan' : 'text-text-muted hover:text-text-secondary'
      )}
    >
      {icon}
      <span className={cn(variant === 'bottom' && 'text-xs')}>{label}</span>
    </Link>
  );
}
```

## Benefits

1. **Simplified Logic**: Each layout component handles only its own concerns
2. **Easier Testing**: Can test each layout variant in isolation
3. **Better Maintainability**: Changes to one breakpoint don't affect others
4. **Reusable UI**: Shared components can be composed differently per layout
5. **Clear Boundaries**: Developers know exactly where to make changes

## Tasks

- [ ] Create `src/components/layouts/` directory structure
- [ ] Create `ResponsiveLayout` component with breakpoint switching
- [ ] Create `MobileLayout` component
- [ ] Create `TabletLayout` component
- [ ] Create `DesktopLayout` component
- [ ] Identify shared UI components to abstract
- [ ] Create `src/components/ui/` abstractions
- [ ] Refactor navigation components to use shared UI
- [ ] Update app layout to use `ResponsiveLayout`
- [ ] Test all breakpoints for visual regressions
- [ ] Update documentation

## Dependencies

- Story 09-003 (Navigation Context) - for breakpoint detection
- Story 09-005 (Navigation Shell) - will be replaced by ResponsiveLayout

## Notes

- Consider using React.lazy for layout components to reduce initial bundle
- The `ui/` layer should contain only presentational components
- Layout components may need access to NavigationContext for hide/show state
- This refactor should be done incrementally to avoid breaking changes
