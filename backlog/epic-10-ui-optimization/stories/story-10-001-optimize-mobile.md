# Story 10-001: Optimize Mobile UI

## Story

**As a** mobile user
**I want** all content to fit on my screen without scrolling
**So that** I can focus on training without distractions

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Redesign the mobile layout (< 640px) to ensure all essential content fits within the viewport without requiring vertical scrolling. This creates a focused, app-like experience that feels native on mobile devices.

## Acceptance Criteria

- [ ] Home page fits on mobile screen without scrolling
- [ ] Training session page fits without scrolling
- [ ] Level selection fits without scrolling (or uses horizontal scroll for overflow)
- [ ] Settings page uses collapsible sections to fit
- [ ] All touch targets remain at least 44x44px
- [ ] Content remains readable and usable
- [ ] Works in both portrait and landscape orientations
- [ ] Accounts for safe areas (notch, home indicator)

## Pages to Optimize

### Home Page
- Compact hero section
- Single CTA button
- Remove or minimize secondary content

### Level Selection
- Horizontal scrolling level cards
- Compact level indicators
- Clear current level highlight

### Training Session
- Full-screen grid
- Minimal header (level info only)
- Response buttons at thumb reach
- Progress indicator (non-intrusive)

### Settings
- Collapsible setting groups
- Compact toggle/slider controls
- Scrollable only if absolutely necessary

## Technical Details

```typescript
// Use dynamic viewport height for mobile
// src/components/layouts/MobileLayout.tsx

export function MobileLayout({ children }: MobileLayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      <Header />
      <main className="flex-1 overflow-hidden">
        {children}
      </main>
      <BottomNavigation />
    </div>
  );
}
```

## Design Guidelines

| Element | Max Height | Notes |
|---------|------------|-------|
| Header | 56px | Fixed, minimal |
| Content | calc(100dvh - 56px - 64px) | Flexible |
| Bottom Nav | 64px | Fixed |
| Safe Area | env(safe-area-inset-*) | Variable |

## Tasks

- [ ] Audit current mobile layouts for scroll requirements
- [ ] Redesign Home page for mobile viewport
- [ ] Redesign Level Selection for mobile viewport
- [ ] Optimize Training Session layout
- [ ] Implement collapsible Settings sections
- [ ] Add `100dvh` viewport handling
- [ ] Test on actual mobile devices (iOS Safari, Android Chrome)
- [ ] Test in landscape orientation
- [ ] Verify safe area handling

## Dependencies

- Story 10-004 (Uniform Header) - header height affects content area

## Notes

- Use `dvh` units instead of `vh` for dynamic viewport height
- Consider using CSS `overflow: hidden` on body during training
- May need to hide bottom nav during training for more space
- Test on older devices with smaller screens (iPhone SE, etc.)
