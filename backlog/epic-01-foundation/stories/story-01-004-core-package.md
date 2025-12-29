# Story 01-004: Create Core Package Structure

## Story

**As a** developer
**I want** a well-organized core package structure
**So that** domain logic is cleanly separated and maintainable

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Create the folder structure and TypeScript configuration for the core domain package following Clean Architecture principles.

## Acceptance Criteria

- [ ] Core package has proper folder structure
- [ ] tsconfig.json configured with NO DOM libs
- [ ] All folders have placeholder index.ts files
- [ ] Package builds without errors
- [ ] No browser-specific code in core

## Technical Details

### Folder Structure

```
packages/core/
├── package.json
├── tsconfig.json
├── src/
│   ├── index.ts                 # Public API exports
│   ├── domain/
│   │   ├── index.ts
│   │   ├── entities/
│   │   │   ├── index.ts
│   │   │   ├── Trial.ts
│   │   │   ├── Session.ts
│   │   │   ├── Level.ts
│   │   │   └── UserProfile.ts
│   │   ├── value-objects/
│   │   │   ├── index.ts
│   │   │   ├── NBackLevel.ts
│   │   │   ├── TrainingMode.ts
│   │   │   ├── PerformanceStats.ts
│   │   │   └── Position.ts
│   │   └── events/
│   │       ├── index.ts
│   │       ├── DomainEvent.ts
│   │       ├── SessionStarted.ts
│   │       ├── TrialCompleted.ts
│   │       └── LevelUnlocked.ts
│   ├── services/
│   │   ├── index.ts
│   │   ├── SequenceGenerator.ts
│   │   ├── ScoringService.ts
│   │   ├── ProgressionService.ts
│   │   ├── ProfileAnalyzer.ts
│   │   └── RecommendationEngine.ts
│   ├── ports/
│   │   ├── index.ts
│   │   ├── ISessionRepository.ts
│   │   ├── IProgressRepository.ts
│   │   ├── IAnalyticsRepository.ts
│   │   ├── IAudioPlayer.ts
│   │   ├── ILLMService.ts
│   │   └── IEventBus.ts
│   ├── use-cases/
│   │   ├── index.ts
│   │   ├── StartSession.ts
│   │   ├── RecordResponse.ts
│   │   ├── CompleteSession.ts
│   │   ├── GetRecommendations.ts
│   │   ├── UnlockLevel.ts
│   │   └── BuildUserProfile.ts
│   ├── config/
│   │   ├── index.ts
│   │   ├── levels.ts
│   │   └── constants.ts
│   └── factory.ts
└── __tests__/
    └── .gitkeep
```

### Core tsconfig.json

```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitReturns": true,
    "exactOptionalPropertyTypes": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "__tests__"]
}
```

## Tasks

- [ ] Create all folders as per structure
- [ ] Create tsconfig.json for core (NO DOM libs)
- [ ] Create placeholder index.ts in each folder
- [ ] Create main src/index.ts with placeholder exports
- [ ] Verify build produces dist/ output
- [ ] Verify no DOM types are available in core

## Dependencies

- Story 01-003 (Monorepo Setup)

## Notes

- lib: ["ES2022"] ensures no DOM APIs leak into core
- This is the most important architectural decision
