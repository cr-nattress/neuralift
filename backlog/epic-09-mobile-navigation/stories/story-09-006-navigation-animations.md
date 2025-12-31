# Story 09-006: Navigation Animations

## Story

**As a** user
**I want** smooth animations when interacting with navigation
**So that** the app feels polished and responsive

## Points: 3

## Priority: Medium

## Status: TODO

## Description

Add animations to navigation components including enter/exit transitions, tap feedback, and active state transitions. These animations enhance the perceived quality of the app and provide visual feedback for user actions.

## Acceptance Criteria

- [ ] Navigation items have tap/press feedback
- [ ] Active indicator animates between items
- [ ] Header shows/hides smoothly
- [ ] Bottom nav shows/hides smoothly
- [ ] Respects reduced motion preferences
- [ ] Animations don't block interaction
- [ ] Performance is smooth (60fps)

## Animation Specifications

### Tap Feedback
```typescript
whileTap={{ scale: 0.95 }}
transition={{ duration: 0.1 }}
```

### Active Indicator
```typescript
// Shared layout animation
<motion.div
  layoutId="nav-active-indicator"
  className="absolute inset-0 bg-accent-cyan/10 rounded-xl"
  transition={{
    type: 'spring',
    stiffness: 500,
    damping: 30,
  }}
/>
```

### Show/Hide Transitions
```typescript
// Bottom Navigation enter/exit
<AnimatePresence>
  {showBottomNav && (
    <motion.nav
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 100, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* ... */}
    </motion.nav>
  )}
</AnimatePresence>

// Header enter/exit
<AnimatePresence>
  {showHeader && (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -100, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
    >
      {/* ... */}
    </motion.header>
  )}
</AnimatePresence>
```

### Icon Animations
```typescript
// Icon bounce on active
<motion.div
  animate={active ? { scale: [1, 1.2, 1] } : {}}
  transition={{ duration: 0.3 }}
>
  <Icon />
</motion.div>
```

## Reduced Motion Support

```typescript
// src/components/navigation/hooks/useReducedMotion.ts
import { useEffect, useState } from 'react';

export function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);

  return reducedMotion;
}

// Usage in components
const reducedMotion = useReducedMotion();

<motion.div
  animate={reducedMotion ? {} : { scale: [1, 1.2, 1] }}
>
```

## Tasks

- [ ] Add tap feedback to nav items
- [ ] Create shared active indicator animation
- [ ] Add header show/hide animation
- [ ] Add bottom nav show/hide animation
- [ ] Create useReducedMotion hook
- [ ] Apply reduced motion preferences
- [ ] Test animation performance
- [ ] Ensure animations don't block clicks

## Dependencies

- Story 09-001 (Mobile Header)
- Story 09-002 (Bottom Navigation)
- Story 09-004 (Desktop Header)

## Notes

- Use `layoutId` for smooth active indicator movement
- Consider staggered animations for initial load
- May want to add haptic feedback on mobile (future)
