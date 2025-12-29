# Story 06-002: Add Reduced Motion Support

## Story

**As a** user with motion sensitivity
**I want** animations to respect my preferences
**So that** I can use the app comfortably

## Points: 2

## Priority: Critical

## Status: TODO

## Description

Implement prefers-reduced-motion media query support throughout the application.

## Acceptance Criteria

- [ ] useReducedMotion hook created
- [ ] All animations check motion preference
- [ ] Background orbs disabled when reduced
- [ ] Essential motion (cell highlight) preserved
- [ ] Page transitions simplified

## Technical Details

```typescript
// src/hooks/useReducedMotion.ts
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
```

## Tasks

- [ ] Create useReducedMotion hook
- [ ] Update animations to check preference
- [ ] Add CSS media query fallbacks
- [ ] Test with system preference
- [ ] Document in accessibility notes

## Dependencies

- Story 06-001 (Core Animations)
