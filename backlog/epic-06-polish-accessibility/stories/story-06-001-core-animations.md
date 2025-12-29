# Story 06-001: Implement Core Animations

## Story

**As a** user
**I want** smooth, premium animations
**So that** the app feels polished and responsive

## Points: 5

## Priority: High

## Status: TODO

## Description

Implement all signature animations: cell activation glow, correct/incorrect feedback, button presses, page transitions, countdown, and score reveal.

## Acceptance Criteria

- [ ] Cell activation with glow pulse
- [ ] Correct response flash (green)
- [ ] Incorrect response shake (red)
- [ ] Button tap scale animation
- [ ] Page transition fade/slide
- [ ] Countdown number animation
- [ ] Score circle reveal animation
- [ ] Background orb floating

## Technical Details

Create animation config file:

```typescript
// src/lib/animations.ts
export const animations = {
  cellActivate: {
    animate: { scale: [1, 1.05, 1], boxShadow: [...] },
    transition: { duration: 0.6 },
  },
  correctFlash: {
    animate: { backgroundColor: [...] },
    transition: { duration: 0.4 },
  },
  incorrectShake: {
    animate: { x: [0, -8, 8, -8, 8, 0] },
    transition: { duration: 0.4 },
  },
  // ... more animations
};
```

## Tasks

- [ ] Create src/lib/animations.ts
- [ ] Implement cell animations
- [ ] Implement feedback animations
- [ ] Implement button animations
- [ ] Implement page transitions
- [ ] Implement countdown animation
- [ ] Implement score reveal
- [ ] Add background orbs
- [ ] Test performance (60fps)

## Dependencies

- Framer Motion installed
- Story 02-007 (Visual Effects)
