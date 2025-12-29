# Story 05-002: Create Popover Content Library

## Story

**As a** developer
**I want** a centralized content library
**So that** all help content is consistent and maintainable

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Create the complete popover content library with entries for all training levels, UI elements, settings, and results metrics.

## Acceptance Criteria

- [ ] Content for all 8 training levels
- [ ] Content for UI elements (grid, buttons, progress)
- [ ] Content for all settings
- [ ] Content for results metrics (d-prime, hit rate, etc.)
- [ ] Content for journey phases and streak

## Technical Details

```typescript
// src/content/popoverContent.ts
export const popoverContent: Record<string, PopoverContent> = {
  // Training Levels
  'level-position-1back': { ... },
  'level-position-2back': { ... },
  'level-audio-1back': { ... },
  'level-audio-2back': { ... },
  'level-dual-1back': { ... },
  'level-dual-2back': { ... },
  'level-dual-3back': { ... },

  // UI Elements
  'grid': { ... },
  'position-button': { ... },
  'audio-button': { ... },
  'history-helper': { ... },
  'progress-bar': { ... },

  // Settings
  'setting-trial-duration': { ... },
  'setting-session-length': { ... },
  'setting-adaptive-mode': { ... },

  // Results
  'result-hit-rate': { ... },
  'result-false-alarm': { ... },
  'result-dprime': { ... },

  // Journey
  'journey-phase-1': { ... },
  'journey-phase-2': { ... },
  'journey-phase-3': { ... },
  'streak': { ... },
};
```

## Content Guidelines

Each entry should have:
- **icon**: Relevant emoji
- **title**: Clear, concise name
- **description**: What it is (1-2 sentences)
- **whyItMatters**: Scientific/practical importance
- **proTip**: Actionable advice

## Tasks

- [ ] Create src/content/popoverContent.ts
- [ ] Write content for all training levels
- [ ] Write content for UI elements
- [ ] Write content for settings
- [ ] Write content for results metrics
- [ ] Write content for journey/engagement
- [ ] Review for consistency and accuracy
- [ ] Export from content index

## Dependencies

- Story 05-001 (PopoverContent type)

## Notes

- Content should be scientifically accurate
- Pro tips should be genuinely helpful
- Keep descriptions concise but informative
