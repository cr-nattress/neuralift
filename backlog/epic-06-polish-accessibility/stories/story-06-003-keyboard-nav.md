# Story 06-003: Implement Keyboard Navigation

## Story

**As a** keyboard user
**I want** full keyboard navigation
**So that** I can use the app without a mouse

## Points: 3

## Priority: Critical

## Status: TODO

## Description

Ensure complete keyboard navigation throughout the app with visible focus states, skip links, and focus trapping in modals.

## Acceptance Criteria

- [ ] Tab navigation works on all pages
- [ ] Focus indicators visible (cyan ring)
- [ ] Skip link to main content
- [ ] Focus trap in modals/popovers
- [ ] Training shortcuts work (A, L, Escape)
- [ ] Escape closes modals

## Technical Details

```typescript
// Skip Link
<a
  href="#main-content"
  className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-accent-cyan focus:text-bg-primary focus:rounded-lg"
>
  Skip to main content
</a>

// Focus styles (in globals.css)
:focus-visible {
  outline: 2px solid var(--accent-cyan);
  outline-offset: 2px;
}
```

## Tasks

- [ ] Add skip link to layout
- [ ] Update focus-visible styles
- [ ] Add focus trap to modals (Radix handles this)
- [ ] Test full keyboard flow
- [ ] Test training keyboard shortcuts
- [ ] Document keyboard shortcuts

## Dependencies

- All pages built (Epic 04)
