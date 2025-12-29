# Epic 03: Training Infrastructure

## Overview

Build the core training functionality including game logic, sequence generation, scoring, audio playback, state management, analytics tracking, and LLM integration for personalized feedback.

## Goals

- Implement infrastructure adapters for all core ports
- Build sequence generation and scoring services
- Set up audio playback system with GCP Cloud Storage
- Implement real-time session state management
- Create comprehensive analytics tracking
- Integrate LLM for personalized feedback
- Implement Supabase repositories for cloud persistence
- Set up offline-first with Dexie + Supabase sync

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 03-001 | [Implement Sequence Generator](./stories/story-03-001-sequence-generator.md) | 5 | Critical | TODO |
| 03-002 | [Implement Scoring Service](./stories/story-03-002-scoring-service.md) | 5 | Critical | TODO |
| 03-003 | [Setup Dexie Database](./stories/story-03-003-dexie-database.md) | 5 | Critical | TODO |
| 03-004 | [Implement Session Repository](./stories/story-03-004-session-repository.md) | 3 | Critical | TODO |
| 03-005 | [Implement Progress Repository](./stories/story-03-005-progress-repository.md) | 3 | Critical | TODO |
| 03-006 | [Implement Audio Player](./stories/story-03-006-audio-player.md) | 5 | Critical | TODO |
| 03-007 | [Create Session Store](./stories/story-03-007-session-store.md) | 5 | Critical | TODO |
| 03-008 | [Implement Analytics Repository](./stories/story-03-008-analytics-repository.md) | 5 | High | TODO |
| 03-009 | [Create Analytics Event System](./stories/story-03-009-analytics-events.md) | 5 | High | TODO |
| 03-010 | [Implement User Profile Builder](./stories/story-03-010-profile-builder.md) | 8 | High | TODO |
| 03-011 | [Implement LLM Service](./stories/story-03-011-llm-service.md) | 8 | High | TODO |
| 03-012 | [Create Training Hooks](./stories/story-03-012-training-hooks.md) | 5 | Critical | TODO |
| 03-013 | [Implement Supabase Repositories](./stories/story-03-013-supabase-repositories.md) | 8 | Critical | TODO |
| 03-014 | [Setup GCP Cloud Storage for Audio](./stories/story-03-014-gcp-audio-storage.md) | 5 | Critical | TODO |
| 03-015 | [Implement Data Sync Service](./stories/story-03-015-data-sync.md) | 8 | High | TODO |

**Total Points: 83**

## Data Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Browser)                        │
├─────────────────────────────────────────────────────────────────┤
│  Dexie (IndexedDB)          │  Supabase Client                  │
│  - Offline-first storage    │  - Real-time sync                 │
│  - Fast local queries       │  - Cloud backup                   │
│  - Works without network    │  - Cross-device sync              │
└───────────────┬─────────────┴───────────────┬───────────────────┘
                │                             │
                │     Data Sync Service       │
                │     (Background sync)       │
                └──────────────┬──────────────┘
                               │
┌──────────────────────────────┴──────────────────────────────────┐
│                         CLOUD SERVICES                          │
├─────────────────────────────────────────────────────────────────┤
│  Supabase (PostgreSQL)      │  GCP Cloud Storage                │
│  - Sessions                 │  - Letter audio files             │
│  - User profiles            │  - Feedback sounds                │
│  - Analytics events         │  - Static assets                  │
│  - Settings                 │                                   │
└─────────────────────────────┴───────────────────────────────────┘
```

## Acceptance Criteria

- [ ] Sequences generated with correct match probability
- [ ] D-prime and accuracy calculated correctly
- [ ] Audio loads from GCP Cloud Storage
- [ ] Session state persists during training
- [ ] Data syncs to Supabase when online
- [ ] App works offline with Dexie
- [ ] Analytics events are tracked
- [ ] User profiles are built from data
- [ ] LLM provides personalized feedback
- [ ] All hooks work in React components

## Dependencies

- Epic 01: Foundation (core domain, ports, Supabase setup)

## Blocks

- Epic 04: Page Development
- Epic 06: Polish & Accessibility

## Technical Notes

### Match Probability

- Position matches: ~30% of trials (configurable)
- Audio matches: ~30% of trials (configurable)
- Ensures enough matches to practice while maintaining challenge

### D-Prime Calculation

Signal detection theory measure:
- d' = Z(Hit Rate) - Z(False Alarm Rate)
- Where Z is the inverse normal CDF
- Higher d' = better discrimination ability

### Offline-First Strategy

1. All writes go to Dexie first (instant)
2. Background sync pushes to Supabase when online
3. On app load, pull latest from Supabase
4. Conflict resolution: server wins (latest timestamp)
