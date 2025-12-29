# Epic 02: Design System & Base Components

## Overview

Implement the "Neural Luxe" design system with complete color palette, typography, and reusable UI components. This establishes the visual foundation and component library.

## Goals

- Implement complete CSS variable design system
- Configure custom typography with variable fonts
- Create base UI component library
- Establish animation primitives
- Build visual effects (glassmorphism, glow, grain)

## Design Philosophy

**"Neural Luxe"** - A fusion of clinical precision and luxury minimalism. A high-end cognitive lab designed by a Scandinavian design studio. Premium wellness app meets scientific instrument.

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 02-001 | [Implement CSS Variables](./stories/story-02-001-css-variables.md) | 3 | Critical | TODO |
| 02-002 | [Configure Typography](./stories/story-02-002-typography.md) | 2 | Critical | TODO |
| 02-003 | [Setup Tailwind Config](./stories/story-02-003-tailwind-config.md) | 3 | Critical | TODO |
| 02-004 | [Create Button Component](./stories/story-02-004-button.md) | 3 | Critical | TODO |
| 02-005 | [Create Card Component](./stories/story-02-005-card.md) | 2 | Critical | TODO |
| 02-006 | [Create ProgressBar Component](./stories/story-02-006-progress-bar.md) | 2 | High | TODO |
| 02-007 | [Create Visual Effects](./stories/story-02-007-visual-effects.md) | 3 | High | TODO |

**Total Points: 18**

## Acceptance Criteria

- [ ] Design tokens accessible via CSS variables and Tailwind classes
- [ ] All components render correctly
- [ ] Hover/focus states work properly
- [ ] Visual effects (glassmorphism, glow) visible
- [ ] Typography hierarchy is clear
- [ ] Color contrast meets accessibility standards (4.5:1 minimum)

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| --bg-primary | #0c0c14 | Main background |
| --bg-secondary | #12121c | Card backgrounds |
| --accent-cyan | #00e5cc | Primary accent |
| --accent-magenta | #e930ff | Secondary accent |
| --accent-gold | #ffd93d | Tertiary accent |
| --text-primary | #f8fafc | Main text |
| --success | #22c55e | Correct feedback |
| --error | #ef4444 | Incorrect feedback |

## Dependencies

- Epic 01: Foundation (must be complete)

## Blocks

- Epic 04: Page Development
