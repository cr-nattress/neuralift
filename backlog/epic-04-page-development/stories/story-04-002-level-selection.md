# Story 04-002: Create Level Selection Page

## Story

**As a** user
**I want** to see all available training levels
**So that** I can choose what to practice

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Build the level selection page showing all training levels grouped by phase, with locked/unlocked states and completion indicators.

## Acceptance Criteria

- [ ] Levels grouped by phase (Foundations, Integration, Advanced)
- [ ] Locked levels show unlock requirements
- [ ] Completed levels show checkmark
- [ ] Current/recommended level highlighted
- [ ] Clicking unlocked level navigates to briefing
- [ ] Back navigation works

## Technical Details

```typescript
// src/app/train/page.tsx
import { LEVELS, PHASES } from '@neuralift/core';

export default function LevelSelectionPage() {
  const { progress } = useProgress();

  return (
    <main className="min-h-screen p-6">
      <BackButton href="/" />
      <h1 className="text-3xl font-bold mb-8 text-center">Choose Your Training</h1>

      {PHASES.map((phase) => (
        <PhaseSection key={phase.id} phase={phase}>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {phase.levels.map((levelId) => {
              const level = LEVELS[levelId];
              const isUnlocked = progress?.unlockedLevels.includes(levelId);
              const isComplete = /* check completion */;

              return (
                <LevelCard
                  key={levelId}
                  level={level}
                  locked={!isUnlocked}
                  complete={isComplete}
                  href={`/train/${levelId}`}
                />
              );
            })}
          </div>
        </PhaseSection>
      ))}
    </main>
  );
}
```

## Components

- PhaseSection
- LevelCard
- LockIndicator
- CompletionBadge
- BackButton

## Tasks

- [ ] Create src/app/train/page.tsx
- [ ] Create PhaseSection component
- [ ] Create LevelCard component
- [ ] Create LockIndicator component
- [ ] Create level configuration data
- [ ] Integrate with progress data
- [ ] Add hover/focus states

## Dependencies

- Story 02-005 (Card)
- Story 03-012 (useProgress hook)
