# Story 01-006: Implement Domain Entities

## Story

**As a** developer
**I want** domain entities and value objects implemented
**So that** business logic has a solid foundation

## Points: 8

## Priority: Critical

## Status: TODO

## Description

Implement all core domain entities (Trial, Session, Level, UserProfile) and value objects (NBackLevel, TrainingMode, PerformanceStats, Position) using immutable patterns.

## Acceptance Criteria

- [ ] Trial entity with immutable response recording
- [ ] Session entity with trial management and completion
- [ ] Level configuration type defined
- [ ] UserProgress and UserBehavioralProfile types defined
- [ ] Value objects for NBackLevel, TrainingMode, Position
- [ ] PerformanceStats value object with all metrics
- [ ] Domain events defined (SessionStarted, TrialCompleted, etc.)
- [ ] All entities have toJSON() methods for serialization

## Technical Details

### Trial Entity

```typescript
export interface TrialData {
  id: number;
  position: number;
  audioLetter: string;
  isPositionMatch: boolean;
  isAudioMatch: boolean;
  userPositionResponse: boolean | null;
  userAudioResponse: boolean | null;
  positionResponseTime: number | null;
  audioResponseTime: number | null;
  stimulusTimestamp: number;
}

export class Trial {
  private constructor(private readonly data: TrialData) {}

  static create(id: number, position: number, audioLetter: string,
                isPositionMatch: boolean, isAudioMatch: boolean): Trial;

  recordPositionResponse(response: boolean): Trial; // Returns new Trial
  recordAudioResponse(response: boolean): Trial;    // Returns new Trial
  isPositionCorrect(): boolean;
  isAudioCorrect(): boolean;
  toJSON(): TrialData;
}
```

### Session Entity

```typescript
export interface SessionConfig {
  levelId: string;
  nBack: number;
  mode: TrainingMode;
  trialCount: number;
  trialDuration: number;
}

export interface SessionResult {
  sessionId: string;
  levelId: string;
  mode: TrainingMode;
  nBack: number;
  timestamp: Date;
  duration: number;
  trials: TrialData[];
  positionStats: PerformanceStats;
  audioStats: PerformanceStats;
  combinedAccuracy: number;
  completed: boolean;
}

export class Session {
  constructor(sessionId: string, config: SessionConfig, trials: Trial[]);

  start(): void;
  getCurrentTrial(): Trial | null;
  recordPositionResponse(response: boolean): void;
  recordAudioResponse(response: boolean): void;
  advanceToNextTrial(): boolean;
  complete(): SessionResult;
  getProgress(): { current: number; total: number; percentage: number };
}
```

### Value Objects

```typescript
export type NBackLevel = 1 | 2 | 3 | 4;
export type TrainingMode = 'position-only' | 'audio-only' | 'dual';

export interface PerformanceStats {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  hitRate: number;
  falseAlarmRate: number;
  dPrime: number;
  accuracy: number;
}

export interface Position {
  row: number;
  col: number;
  index: number; // 0-8 for 3x3 grid
}
```

### Domain Events

```typescript
export interface DomainEvent {
  type: string;
  timestamp: Date;
  payload: unknown;
}

export class SessionStartedEvent implements DomainEvent {
  type = 'SESSION_STARTED';
  timestamp = new Date();
  constructor(public payload: { sessionId: string; levelId: string; nBack: number; mode: TrainingMode; trialCount: number }) {}
}

export class SessionCompletedEvent implements DomainEvent {
  type = 'SESSION_COMPLETED';
  timestamp = new Date();
  constructor(public payload: { sessionId: string; levelId: string; accuracy: number; duration: number }) {}
}

export class TrialCompletedEvent implements DomainEvent {
  type = 'TRIAL_COMPLETED';
  timestamp = new Date();
  constructor(public payload: { sessionId: string; trialIndex: number; positionCorrect: boolean; audioCorrect: boolean }) {}
}
```

## Tasks

- [ ] Create value-objects/TrainingMode.ts
- [ ] Create value-objects/NBackLevel.ts
- [ ] Create value-objects/PerformanceStats.ts
- [ ] Create value-objects/Position.ts
- [ ] Create entities/Trial.ts with immutable pattern
- [ ] Create entities/Session.ts
- [ ] Create entities/Level.ts (LevelConfig type)
- [ ] Create entities/UserProfile.ts
- [ ] Create events/DomainEvent.ts base
- [ ] Create events/SessionStarted.ts
- [ ] Create events/SessionCompleted.ts
- [ ] Create events/TrialCompleted.ts
- [ ] Create events/LevelUnlocked.ts
- [ ] Write unit tests for Trial and Session

## Dependencies

- Story 01-004 (Core Package Structure)

## Notes

- Trial uses immutable pattern - methods return new instances
- Session mutates internally for performance during gameplay
- All entities must be serializable to JSON
