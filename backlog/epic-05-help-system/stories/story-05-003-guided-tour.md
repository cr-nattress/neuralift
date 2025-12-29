# Story 05-003: Create Guided Tour

## Story

**As a** first-time user
**I want** a guided tour of the training interface
**So that** I understand how to use the app

## Points: 5

## Priority: High

## Status: TODO

## Description

Build the GuidedTour component that walks first-time users through the key UI elements with spotlight highlighting and sequential steps.

## Acceptance Criteria

- [ ] Tour auto-starts for first-time users
- [ ] Spotlight highlights target element
- [ ] Step-by-step progression
- [ ] Skip option available
- [ ] Progress indicator (step X of Y)
- [ ] Completion stored in localStorage
- [ ] Tour doesn't show again after completion

## Technical Details

```typescript
const TOUR_STEPS: TourStep[] = [
  { target: '[data-tour="grid"]', contentKey: 'grid', placement: 'bottom' },
  { target: '[data-tour="position-button"]', contentKey: 'position-button', placement: 'top' },
  { target: '[data-tour="audio-button"]', contentKey: 'audio-button', placement: 'top' },
  { target: '[data-tour="progress-bar"]', contentKey: 'progress-bar', placement: 'bottom' },
];
```

## Components

- GuidedTour (main controller)
- TourOverlay (dark backdrop)
- TourSpotlight (ring around target)
- TourCard (step content)

## Tasks

- [ ] Create src/components/help/GuidedTour.tsx
- [ ] Implement step progression
- [ ] Add spotlight positioning
- [ ] Add localStorage persistence
- [ ] Add skip functionality
- [ ] Add data-tour attributes to target components
- [ ] Test on training page

## Dependencies

- Story 05-001 (HelpPopover for content)
- Story 05-002 (Content Library)
