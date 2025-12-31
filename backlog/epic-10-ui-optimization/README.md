# Epic 10: UI Optimization & MVP Release

## Overview

Optimize the user interface for all screen sizes to eliminate scrolling and provide a streamlined experience. Implement a uniform header design and feature flag system to enable controlled MVP releases with minimal functionality.

## Goals

- Optimize layouts for mobile, tablet, and desktop to fit content without scrolling
- Create a consistent, minimal header across all pages and breakpoints
- Implement feature flag infrastructure for controlled feature rollout
- Enable MVP release with training and settings only
- Improve overall user experience with focused, distraction-free interfaces

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 10-001 | [Optimize Mobile UI](./stories/story-10-001-optimize-mobile.md) | 5 | Critical | TODO |
| 10-002 | [Optimize Tablet UI](./stories/story-10-002-optimize-tablet.md) | 5 | Critical | TODO |
| 10-003 | [Optimize Desktop UI](./stories/story-10-003-optimize-desktop.md) | 5 | Critical | TODO |
| 10-004 | [Uniform Header Design](./stories/story-10-004-uniform-header.md) | 3 | High | TODO |
| 10-005 | [Feature Flag System](./stories/story-10-005-feature-flags.md) | 8 | Critical | TODO |

**Total Points: 26**

## Breakpoint Strategy

| Viewport | Width | Target |
|----------|-------|--------|
| Mobile | < 640px | Single-screen experience, no vertical scroll |
| Tablet | 640px - 1024px | Optimized two-column layouts where appropriate |
| Desktop | > 1024px | Spacious layout with centered content |

## Header Design

All pages will use a uniform header:

```
┌─────────────────────────────────────┐
│  [N] Neuralift                      │
└─────────────────────────────────────┘
```

- App icon (N logo) on the left
- App name "Neuralift" next to icon
- No other elements in header
- Navigation handled by bottom nav bar

## MVP Feature Set

The MVP release will include only:

| Feature | Status |
|---------|--------|
| Training Session | Enabled |
| Level Selection | Enabled |
| Settings | Enabled |
| Progress/Stats | Disabled |
| Help System | Disabled |
| Onboarding | Disabled |

## Component Architecture

```
src/
├── config/
│   └── features.ts              # Feature flag definitions
├── hooks/
│   └── useFeatureFlag.ts        # Feature flag hook
├── components/
│   └── FeatureGate.tsx          # Conditional rendering wrapper
└── layouts/
    ├── MobileLayout.tsx         # Optimized mobile layout
    ├── TabletLayout.tsx         # Optimized tablet layout
    └── DesktopLayout.tsx        # Optimized desktop layout
```

## Acceptance Criteria

- [ ] Mobile UI fits on screen without vertical scrolling
- [ ] Tablet UI fits on screen without vertical scrolling
- [ ] Desktop UI fits on screen without vertical scrolling
- [ ] Header is identical across all pages and breakpoints
- [ ] Feature flags can enable/disable UI sections
- [ ] MVP mode hides Progress, Help, and Onboarding
- [ ] No visual regressions in enabled features
- [ ] Graceful handling of disabled features (hidden nav items, etc.)

## Dependencies

- Epic 09: Mobile Navigation (navigation components)
- Epic 02: Design System (colors, typography)

## Blocks

- None (can be developed independently)

## Technical Considerations

1. **Viewport Units**: Use `dvh` (dynamic viewport height) for mobile to account for browser chrome
2. **Content Priority**: Determine what content is essential vs. nice-to-have for each breakpoint
3. **Feature Flags**: Store in environment variables for build-time configuration
4. **Graceful Degradation**: Disabled features should not break navigation or cause errors
5. **Testing**: Test on actual devices, not just browser dev tools
6. **Safe Areas**: Account for notches, home indicators, and status bars
