# Story 09-007: Active Route Indicators

## Story

**As a** user
**I want** to clearly see which section I'm currently in
**So that** I always know where I am in the app

## Points: 2

## Priority: High

## Status: TODO

## Description

Implement clear visual indicators for the currently active navigation item. This includes handling nested routes (e.g., `/train/audio-1/session` should highlight "Train") and providing consistent styling across mobile and desktop.

## Acceptance Criteria

- [ ] Active item has distinct visual styling
- [ ] Nested routes highlight parent nav item
- [ ] Active indicator is consistent across breakpoints
- [ ] Works with both icons and text labels
- [ ] Color meets accessibility contrast requirements
- [ ] Indicator animates smoothly between items

## Route Matching Logic

| Route Pattern | Active Nav Item |
|--------------|-----------------|
| `/` | Home |
| `/levels` | Train |
| `/train/*` | Train |
| `/progress` | Progress |
| `/results/*` | Progress |
| `/settings` | Settings |

## Technical Details

```typescript
// src/components/navigation/utils/routeMatcher.ts

interface NavItem {
  href: string;
  matchPaths: string[];
}

/**
 * Determines if a nav item should be marked as active
 * based on the current pathname
 */
export function isNavItemActive(pathname: string, item: NavItem): boolean {
  // Exact match
  if (pathname === item.href) return true;

  // Check match paths
  for (const pattern of item.matchPaths) {
    // Root path special case
    if (pattern === '/') {
      if (pathname === '/') return true;
      continue;
    }

    // Prefix match for nested routes
    if (pathname.startsWith(pattern)) return true;
  }

  return false;
}

/**
 * Gets the active nav item index for layoutId animations
 */
export function getActiveNavIndex(pathname: string, items: NavItem[]): number {
  return items.findIndex((item) => isNavItemActive(pathname, item));
}
```

## Visual Styles

### Mobile Bottom Nav (Active State)
```css
/* Icon */
color: var(--accent-cyan);

/* Background pill */
background: rgba(var(--accent-cyan-rgb), 0.1);
border-radius: 12px;
padding: 8px 16px;

/* Label */
color: var(--accent-cyan);
font-weight: 500;
```

### Desktop Header (Active State)
```css
/* Link text */
color: var(--accent-cyan);

/* Background */
background: rgba(var(--accent-cyan-rgb), 0.1);
border-radius: 12px;

/* Optional underline indicator */
border-bottom: 2px solid var(--accent-cyan);
```

## Component Updates

```typescript
// NavItem component with active state
interface NavItemProps {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive: boolean;
}

function NavItem({ href, label, icon: Icon, isActive }: NavItemProps) {
  return (
    <Link
      href={href}
      className={cn(
        'flex flex-col items-center justify-center',
        'min-w-[64px] h-12 px-3 rounded-xl',
        'transition-colors duration-200',
        isActive
          ? 'text-accent-cyan'
          : 'text-text-muted hover:text-text-secondary'
      )}
      aria-current={isActive ? 'page' : undefined}
    >
      <div className="relative">
        {/* Animated background indicator */}
        {isActive && (
          <motion.div
            layoutId="nav-indicator"
            className="absolute -inset-2 bg-accent-cyan/10 rounded-xl"
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        )}
        <Icon className={cn(
          'w-6 h-6 relative z-10 transition-transform',
          isActive && 'scale-110'
        )} />
      </div>
      <span className={cn(
        'text-xs mt-1 transition-colors',
        isActive ? 'font-medium' : 'font-normal'
      )}>
        {label}
      </span>
    </Link>
  );
}
```

## Tasks

- [ ] Create routeMatcher utility
- [ ] Update BottomNavigation with active logic
- [ ] Update DesktopHeader with active logic
- [ ] Add animated background indicator
- [ ] Style active icon (color + scale)
- [ ] Style active label (color + weight)
- [ ] Add aria-current attribute
- [ ] Test all route combinations
- [ ] Verify color contrast (WCAG AA)

## Dependencies

- Story 09-002 (Bottom Navigation)
- Story 09-004 (Desktop Header)

## Notes

- Use `aria-current="page"` for accessibility
- Consider adding a dot indicator below icon as alternative
- May want different indicator styles for different pages
