# Epic 09: Mobile Navigation

## Overview

Implement a responsive navigation system with a mobile header and bottom navigation bar that adapts across mobile, tablet, and desktop viewports. This epic ensures users can easily navigate the app on any device with consistent, touch-friendly controls.

## Goals

- Create a mobile-first header component
- Build a bottom navigation bar for mobile/tablet
- Implement responsive breakpoint logic
- Ensure seamless navigation across all pages
- Maintain accessibility standards
- Support both touch and mouse interactions

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 09-001 | [Create Mobile Header](./stories/story-09-001-mobile-header.md) | 5 | Critical | TODO |
| 09-002 | [Create Bottom Navigation](./stories/story-09-002-bottom-navigation.md) | 5 | Critical | TODO |
| 09-003 | [Create Navigation Context](./stories/story-09-003-navigation-context.md) | 3 | High | TODO |
| 09-004 | [Create Desktop Header](./stories/story-09-004-desktop-header.md) | 3 | High | TODO |
| 09-005 | [Responsive Navigation Shell](./stories/story-09-005-navigation-shell.md) | 5 | Critical | TODO |
| 09-006 | [Navigation Animations](./stories/story-09-006-navigation-animations.md) | 3 | Medium | TODO |
| 09-007 | [Active Route Indicators](./stories/story-09-007-active-indicators.md) | 2 | High | TODO |

**Total Points: 26**

## Breakpoint Strategy

| Viewport | Width | Navigation Style |
|----------|-------|------------------|
| Mobile | < 640px | Header + Bottom Nav |
| Tablet | 640px - 1024px | Header + Bottom Nav |
| Desktop | > 1024px | Full Header Only |

## Navigation Items

| Item | Icon | Route | Description |
|------|------|-------|-------------|
| Home | Home | `/` | Landing page |
| Train | Play | `/levels` | Level selection |
| Progress | BarChart | `/progress` | Statistics & history |
| Settings | Settings | `/settings` | User preferences |

## Component Architecture

```
src/components/navigation/
├── index.ts                    # Public exports
├── NavigationShell.tsx         # Responsive wrapper
├── MobileHeader.tsx            # Top header for mobile/tablet
├── BottomNavigation.tsx        # Bottom nav for mobile/tablet
├── DesktopHeader.tsx           # Full header for desktop
├── NavItem.tsx                 # Individual nav item
├── NavigationContext.tsx       # Navigation state context
└── hooks/
    ├── useNavigation.ts        # Navigation hook
    └── useBreakpoint.ts        # Responsive breakpoint hook
```

## Visual Design

### Mobile Header (< 1024px)
```
┌─────────────────────────────────────┐
│  [Logo]     Neuralift      [Menu]   │
└─────────────────────────────────────┘
```

### Bottom Navigation (< 1024px)
```
┌─────────────────────────────────────┐
│   🏠        ▶️        📊       ⚙️    │
│  Home     Train   Progress Settings │
└─────────────────────────────────────┘
```

### Desktop Header (≥ 1024px)
```
┌──────────────────────────────────────────────────────┐
│  [Logo] Neuralift    Home  Train  Progress  Settings │
└──────────────────────────────────────────────────────┘
```

## Acceptance Criteria

- [ ] Navigation renders correctly on mobile (< 640px)
- [ ] Navigation renders correctly on tablet (640px - 1024px)
- [ ] Navigation renders correctly on desktop (> 1024px)
- [ ] Active route is visually indicated
- [ ] Touch targets are at least 44x44px
- [ ] Smooth transitions between breakpoints
- [ ] Navigation is accessible via keyboard
- [ ] Screen readers announce navigation correctly
- [ ] No layout shift during page transitions
- [ ] Works in both portrait and landscape orientations

## Dependencies

- Epic 02: Design System (colors, typography, effects)
- Epic 04: Page Development (pages to navigate to)

## Blocks

- None (can be developed in parallel)

## Technical Considerations

1. **Safe Area Insets**: Handle notches and home indicators on iOS
2. **Sticky Positioning**: Header stays at top, footer at bottom
3. **Z-Index Management**: Navigation above page content
4. **Route Matching**: Highlight active routes including nested routes
5. **Gesture Handling**: Consider swipe gestures for tablet
6. **Performance**: Minimize re-renders during navigation
