# Epic 05: Help System & Contextual Content

## Overview

Implement the extensive contextual help system with intelligent popovers that guide users through every aspect of the training. Create the "why" behind every feature.

## Goals

- Build core Popover component system
- Create complete popover content library
- Implement first-time user guided tour
- Add contextual help triggers throughout app
- Build educational "Learn More" modal

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 05-001 | [Create HelpPopover Component](./stories/story-05-001-help-popover.md) | 5 | Critical | TODO |
| 05-002 | [Create Popover Content Library](./stories/story-05-002-content-library.md) | 5 | Critical | TODO |
| 05-003 | [Create Guided Tour](./stories/story-05-003-guided-tour.md) | 5 | High | TODO |
| 05-004 | [Create HelpTrigger Component](./stories/story-05-004-help-trigger.md) | 2 | Critical | TODO |
| 05-005 | [Create QuickHelp Component](./stories/story-05-005-quick-help.md) | 2 | High | TODO |
| 05-006 | [Create LearnMoreModal](./stories/story-05-006-learn-more-modal.md) | 3 | High | TODO |

**Total Points: 22**

## Popover Design Principles

Every popover must answer three questions:
1. **WHAT** — What is this element/action?
2. **WHY** — Why does this matter for training?
3. **HOW** — How do I use it effectively?

## Acceptance Criteria

- [ ] All popovers render with correct styling
- [ ] Popovers are keyboard accessible
- [ ] Guided tour runs for first-time users
- [ ] Tour can be skipped and doesn't show again
- [ ] Help triggers don't obstruct UI
- [ ] Content is accurate and helpful

## Dependencies

- Epic 02: Design System
- Epic 04: Page Development (pages must exist)

## Blocks

- Epic 06: Polish (help must work first)
