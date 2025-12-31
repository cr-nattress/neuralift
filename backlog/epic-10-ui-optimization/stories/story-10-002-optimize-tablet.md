# Story 10-002: Optimize Tablet UI

## Story

**As a** tablet user
**I want** content optimized for my screen size without scrolling
**So that** I can enjoy an immersive training experience

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Optimize the tablet layout (640px - 1024px) to utilize the larger screen real estate while ensuring all essential content fits within the viewport without vertical scrolling. Take advantage of the additional space for better visual hierarchy and touch targets.

## Acceptance Criteria

- [ ] Home page fits on tablet screen without scrolling
- [ ] Training session uses larger grid with comfortable spacing
- [ ] Level selection shows more levels in view
- [ ] Settings page uses two-column layout where appropriate
- [ ] All touch targets are generously sized (48x48px+)
- [ ] Content is well-balanced and not cramped
- [ ] Works in both portrait and landscape orientations
- [ ] Smooth transition from mobile breakpoint

## Pages to Optimize

### Home Page
- Centered content with comfortable margins
- Side-by-side action cards
- Larger hero section (but still no scroll)

### Level Selection
- Grid of level cards (2-3 columns)
- All levels visible or minimal scroll
- Larger touch targets for level selection

### Training Session
- Larger 3x3 grid (up to 320px)
- More spacing around grid
- Larger response buttons
- Clear visual feedback

### Settings
- Two-column layout for setting groups
- Inline labels and controls
- No scrolling required

## Technical Details

```typescript
// src/components/layouts/TabletLayout.tsx

export function TabletLayout({ children }: TabletLayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-2xl px-6">
          {children}
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}
```

## Design Guidelines

| Element | Specification | Notes |
|---------|--------------|-------|
| Header | 56px height | Same as mobile |
| Content Width | max-w-2xl (672px) | Centered |
| Grid Size | 280-320px | Larger than mobile |
| Padding | 24px horizontal | Comfortable margins |
| Bottom Nav | 64px height | Same as mobile |

## Layout Patterns

### Portrait (768x1024)
```
┌────────────────────────┐
│       Header           │
├────────────────────────┤
│                        │
│    ┌────┐  ┌────┐     │
│    │    │  │    │     │
│    └────┘  └────┘     │
│                        │
│      [Content]         │
│                        │
├────────────────────────┤
│     Bottom Nav         │
└────────────────────────┘
```

### Landscape (1024x768)
```
┌──────────────────────────────────┐
│            Header                │
├──────────────────────────────────┤
│                                  │
│  ┌────┐  ┌────┐  ┌────┐        │
│  │    │  │    │  │    │        │
│  └────┘  └────┘  └────┘        │
│                                  │
├──────────────────────────────────┤
│          Bottom Nav              │
└──────────────────────────────────┘
```

## Tasks

- [ ] Audit current tablet layouts
- [ ] Implement two-column card layouts
- [ ] Increase grid and button sizes
- [ ] Add proper spacing and margins
- [ ] Implement two-column settings layout
- [ ] Test on actual tablets (iPad, Android tablets)
- [ ] Test portrait and landscape orientations
- [ ] Ensure smooth breakpoint transitions

## Dependencies

- Story 10-001 (Mobile UI) - builds on mobile patterns
- Story 10-004 (Uniform Header) - consistent header

## Notes

- Tablet is often used in landscape for training
- Consider split-view multitasking on iPads
- Test with keyboard attached (iPad with Magic Keyboard)
- Balance between utilizing space and maintaining focus
