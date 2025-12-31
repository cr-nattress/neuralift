# Story 10-003: Optimize Desktop UI

## Story

**As a** desktop user
**I want** a clean, focused interface without unnecessary scrolling
**So that** I can train efficiently on my larger screen

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Optimize the desktop layout (> 1024px) to provide a spacious, focused experience that fits within the viewport without vertical scrolling. Use the additional screen real estate for better visual hierarchy while maintaining a clean, uncluttered interface.

## Acceptance Criteria

- [ ] Home page fits on desktop screen without scrolling
- [ ] Training session is centered with comfortable spacing
- [ ] Level selection shows all levels without scrolling
- [ ] Settings page uses multi-column layout efficiently
- [ ] Content is centered with reasonable max-width
- [ ] Mouse interactions are smooth and responsive
- [ ] Keyboard shortcuts work as expected
- [ ] No wasted space or overly stretched elements

## Pages to Optimize

### Home Page
- Centered content container (max-width: 1200px)
- Horizontal layout for action cards
- Generous whitespace
- All content visible without scroll

### Level Selection
- Grid layout showing all levels
- Visual grouping by difficulty
- Hover states for mouse users
- Quick level preview on hover

### Training Session
- Large, centered grid (360-400px)
- Keyboard shortcut hints visible
- Generous spacing around grid
- Clear visual hierarchy

### Settings
- Three-column layout for setting categories
- All settings visible without scroll
- Inline descriptions and controls

## Technical Details

```typescript
// src/components/layouts/DesktopLayout.tsx

export function DesktopLayout({ children }: DesktopLayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden flex items-center justify-center">
        <div className="w-full max-w-5xl px-8">
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
| Header | 56px height | Consistent with mobile/tablet |
| Content Width | max-w-5xl (1024px) | Centered container |
| Grid Size | 360-400px | Largest size |
| Padding | 32px horizontal | Generous margins |
| Bottom Nav | 64px height | Consistent |

## Layout Pattern

```
┌──────────────────────────────────────────────────────────┐
│                        Header                            │
├──────────────────────────────────────────────────────────┤
│                                                          │
│         ┌──────────────────────────────────┐            │
│         │                                  │            │
│         │         Centered Content         │            │
│         │         (max-w-5xl)              │            │
│         │                                  │            │
│         └──────────────────────────────────┘            │
│                                                          │
├──────────────────────────────────────────────────────────┤
│                      Bottom Nav                          │
└──────────────────────────────────────────────────────────┘
```

## Desktop-Specific Enhancements

| Feature | Implementation |
|---------|---------------|
| Hover States | Visual feedback on interactive elements |
| Keyboard Shortcuts | A/L keys for matches, Space to pause |
| Focus Indicators | Clear focus rings for keyboard navigation |
| Cursor Styles | Appropriate cursors (pointer, default) |

## Tasks

- [ ] Audit current desktop layouts
- [ ] Implement centered content container
- [ ] Optimize grid and button sizes for desktop
- [ ] Add hover states to all interactive elements
- [ ] Implement multi-column settings layout
- [ ] Add keyboard shortcut hints
- [ ] Test on various desktop resolutions (1080p, 1440p, 4K)
- [ ] Test with mouse and keyboard
- [ ] Ensure no horizontal overflow on any resolution

## Dependencies

- Story 10-001 (Mobile UI) - responsive foundation
- Story 10-002 (Tablet UI) - intermediate breakpoint
- Story 10-004 (Uniform Header) - consistent header

## Notes

- Many desktop users have 1080p monitors - test this resolution
- Consider ultra-wide monitors (21:9 aspect ratio)
- Keyboard shortcuts should match common patterns (gaming: WASD-style)
- Mouse users expect hover feedback
- Avoid making the UI feel "empty" on large screens
