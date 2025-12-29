# Epic 01: Foundation & Project Setup

## Overview

Establish the core project infrastructure using Clean Architecture that completely separates business logic from UI concerns. This enables UI framework swapping, serverless deployment, and comprehensive testing.

## Goals

- Initialize Next.js 14+ project with App Router
- Configure TypeScript in strict mode
- Establish Clean Architecture layer separation
- Create framework-agnostic core domain module
- Define port interfaces for all external dependencies
- Configure dependency injection pattern
- Setup Supabase for cloud database and authentication
- Configure environment for Netlify deployment

## Stories

| ID | Story | Points | Priority | Status |
|----|-------|--------|----------|--------|
| 01-001 | [Initialize Next.js Project](./stories/story-01-001-init-nextjs.md) | 3 | Critical | TODO |
| 01-002 | [Configure TypeScript Strict Mode](./stories/story-01-002-typescript-config.md) | 2 | Critical | TODO |
| 01-003 | [Setup Monorepo Structure](./stories/story-01-003-monorepo-setup.md) | 5 | Critical | TODO |
| 01-004 | [Create Core Package Structure](./stories/story-01-004-core-package.md) | 5 | Critical | TODO |
| 01-005 | [Define Port Interfaces](./stories/story-01-005-port-interfaces.md) | 8 | Critical | TODO |
| 01-006 | [Implement Domain Entities](./stories/story-01-006-domain-entities.md) | 8 | Critical | TODO |
| 01-007 | [Create Core Factory & DI](./stories/story-01-007-core-factory.md) | 5 | Critical | TODO |
| 01-008 | [Setup React Core Provider](./stories/story-01-008-core-provider.md) | 3 | Critical | TODO |
| 01-009 | [Setup Supabase Project](./stories/story-01-009-supabase-setup.md) | 5 | Critical | TODO |
| 01-010 | [Configure Environment Variables](./stories/story-01-010-env-config.md) | 2 | Critical | TODO |

**Total Points: 46**

## Infrastructure Stack

| Service | Purpose |
|---------|---------|
| **Netlify** | Hosting, deployment, serverless functions |
| **Supabase** | PostgreSQL database, authentication, real-time sync |
| **GCP Cloud Storage** | Audio files, static assets |

## Acceptance Criteria

- [ ] `npm run build:core` compiles without errors
- [ ] Core package has zero browser/React dependencies
- [ ] Core can be imported and used in a Node.js script
- [ ] CoreProvider correctly injects dependencies
- [ ] Path aliases resolve in both app and core
- [ ] TypeScript strict mode passes in both packages
- [ ] Supabase client configured and connecting
- [ ] Environment variables properly configured for local/production

## Dependencies

- None (this is the first epic)

## Blocked By

- Nothing

## Blocks

- Epic 02: Design System
- Epic 03: Training Infrastructure
