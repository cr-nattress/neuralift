# Neuralift Development Backlog

This backlog contains all epics and user stories for the Neuralift Dual N-Back Training application.

## Epic Overview

| Epic | Name | Stories | Points | Priority |
|------|------|---------|--------|----------|
| 01 | Foundation & Project Setup | 10 | 46 | Critical |
| 02 | Design System & Base Components | 7 | 27 | Critical |
| 03 | Training Infrastructure | 15 | 83 | Critical |
| 04 | Page Development | 9 | 33 | High |
| 05 | Help System & Contextual Content | 6 | 24 | Medium |
| 06 | Polish, Animations & Accessibility | 9 | 41 | Medium |
| 07 | Audio CLI Tool | 10 | 49 | High |
| 08 | ElevenLabs Audio Integration | 1 | 5 | Medium |
| 09 | Mobile Navigation | 7 | 26 | High |

**Total Stories: 74 | Total Points: 334**

## Infrastructure Stack

| Service | Purpose |
|---------|---------|
| **Netlify** | Hosting, deployment, serverless functions |
| **Supabase** | PostgreSQL database, authentication, real-time sync |
| **GCP Cloud Storage** | Audio files, static assets |
| **Dexie.js** | Offline-first local storage (IndexedDB) |

## Story Point Scale

| Points | Effort | Example |
|--------|--------|---------|
| 1 | < 2 hours | Config change, small component |
| 2 | 2-4 hours | Simple component, basic hook |
| 3 | 4-8 hours | Complex component, integration |
| 5 | 1-2 days | Feature with multiple files |
| 8 | 2-3 days | Major feature, significant complexity |
| 13 | 3-5 days | Epic-level feature, architecture |

## Priority Levels

- **Critical** - Must have for MVP
- **High** - Important for core experience
- **Medium** - Enhances experience
- **Low** - Nice to have

## Story Status

- `TODO` - Not started
- `IN_PROGRESS` - Currently being worked on
- `IN_REVIEW` - Code complete, awaiting review
- `DONE` - Completed and merged

## Dependency Graph

```
Epic 01 (Foundation)
    │
    ├──► Epic 02 (Design System)
    │        │
    │        └──► Epic 04 (Pages) ──► Epic 05 (Help System)
    │                   │
    │                   └──► Epic 09 (Mobile Navigation)
    │
    └──► Epic 03 (Training Infrastructure)
                       │
                       ├──► Epic 06 (Polish & Accessibility)
                       │
                       ├──► Epic 07 (Audio CLI Tool) [Standalone]
                       │
                       └──► Epic 08 (ElevenLabs Audio) [Standalone]
```

## Quick Links

- [Epic 01: Foundation](./epic-01-foundation/)
- [Epic 02: Design System](./epic-02-design-system/)
- [Epic 03: Training Infrastructure](./epic-03-training-infrastructure/)
- [Epic 04: Page Development](./epic-04-page-development/)
- [Epic 05: Help System](./epic-05-help-system/)
- [Epic 06: Polish & Accessibility](./epic-06-polish-accessibility/)
- [Epic 07: Audio CLI Tool](./epic-07-audio-cli/)
- [Epic 08: ElevenLabs Audio](./epic-08-elevenlabs-audio/)
- [Epic 09: Mobile Navigation](./epic-09-mobile-navigation/)

## Getting Started

1. Start with Epic 01 stories in order
2. Epic 02 and 03 can be worked in parallel after Epic 01
3. Epic 04 requires both Epic 02 and Epic 03
4. Epic 05 requires Epic 04
5. Epic 06 can start after Epic 04, finalized last
6. Epic 07 is standalone and can be worked independently (requires GCP bucket)

## Definition of Done

- [ ] Code complete and passing linting
- [ ] TypeScript strict mode passing
- [ ] Unit tests written (where applicable)
- [ ] Code reviewed
- [ ] Documentation updated
- [ ] Accessibility requirements met
