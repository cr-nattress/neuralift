# Phase 1: Foundation & Project Setup

## Overview

Establish the core project infrastructure using a **Clean Architecture** approach that completely separates business logic from UI concerns. This enables:
- Swapping UI frameworks (React → Vue, Mobile, CLI)
- Moving business logic to serverless functions
- Publishing core logic as a standalone package
- Comprehensive testing of business rules without UI dependencies

---

## Objectives

1. Initialize Next.js 14+ project with App Router
2. Configure TypeScript in strict mode
3. **Establish Clean Architecture layer separation**
4. **Create framework-agnostic core domain module**
5. **Define port interfaces for all external dependencies**
6. Set up project structure with clear boundaries
7. Configure dependency injection pattern
8. Install and configure all dependencies
9. Configure development tooling (ESLint, Prettier)

---

## Architecture Overview

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────────────────┐
│                         PRESENTATION LAYER                          │
│   Next.js App Router, React Components, Zustand UI State            │
│   (Replaceable: Could be Vue, React Native, CLI, etc.)              │
├─────────────────────────────────────────────────────────────────────┤
│                         APPLICATION LAYER                           │
│   Use Cases, Application Services, Orchestration                    │
│   (React Hooks that compose core services)                          │
├─────────────────────────────────────────────────────────────────────┤
│                      INFRASTRUCTURE LAYER                           │
│   Adapters: IndexedDB, Web Audio, Fetch API, LocalStorage           │
│   (Implements Port interfaces defined by Core)                      │
├─────────────────────────────────────────────────────────────────────┤
│                          CORE DOMAIN                                │
│   Business Logic, Entities, Value Objects, Domain Services          │
│   Port Interfaces (contracts for external dependencies)             │
│   ⚠️ ZERO external dependencies - pure TypeScript                   │
│   ⚠️ NO React, NO Next.js, NO browser APIs                          │
└─────────────────────────────────────────────────────────────────────┘
```

### Dependency Rule

Dependencies point **inward only**:
- Presentation → Application → Core
- Infrastructure → Core
- Core depends on **NOTHING** external

### Key Benefits

1. **UI Interchangeability**: Core doesn't know React exists
2. **Serverless Ready**: Core can run in Edge Functions, AWS Lambda, etc.
3. **Testability**: Test business logic without mocking UI
4. **Package Extraction**: Core can become `@neuralift/core` npm package

---

## Tech Stack Installation

### Core Dependencies

```bash
# Framework & Language
next@14+          # React framework with App Router
react@18+         # UI library (Presentation layer only)
typescript        # Type safety

# Styling (Presentation layer only)
tailwindcss       # Utility-first CSS
postcss           # CSS processing
autoprefixer      # Vendor prefixing

# Animation (Presentation layer only)
framer-motion     # Animation library

# UI Primitives (Presentation layer only)
@radix-ui/react-popover
@radix-ui/react-dialog
@radix-ui/react-progress
@radix-ui/react-tooltip

# State Management (Application layer)
zustand           # UI state only - not business logic

# Infrastructure Adapters
dexie             # IndexedDB wrapper
howler            # Audio playback
nanoid            # ID generation (also works in Core)

# Icons (Presentation layer only)
lucide-react

# Utilities
zod               # Schema validation (works in Core too)
```

### Dev Dependencies

```bash
eslint
eslint-config-next
prettier
prettier-plugin-tailwindcss
@types/node
@types/react
@types/react-dom
vitest            # For testing Core without Jest/DOM
```

---

## Project Structure

```
├── packages/
│   └── core/                      # 📦 CORE DOMAIN (publishable)
│       ├── package.json           # Standalone package config
│       ├── tsconfig.json          # Strict, no DOM libs
│       ├── src/
│       │   ├── index.ts           # Public API exports
│       │   │
│       │   ├── domain/            # 🎯 ENTITIES & VALUE OBJECTS
│       │   │   ├── entities/
│       │   │   │   ├── Trial.ts
│       │   │   │   ├── Session.ts
│       │   │   │   ├── Level.ts
│       │   │   │   └── UserProfile.ts
│       │   │   ├── value-objects/
│       │   │   │   ├── NBackLevel.ts
│       │   │   │   ├── TrainingMode.ts
│       │   │   │   ├── PerformanceStats.ts
│       │   │   │   └── Position.ts
│       │   │   └── events/        # Domain events
│       │   │       ├── SessionStarted.ts
│       │   │       ├── TrialCompleted.ts
│       │   │       └── LevelUnlocked.ts
│       │   │
│       │   ├── services/          # 🔧 DOMAIN SERVICES
│       │   │   ├── SequenceGenerator.ts
│       │   │   ├── ScoringService.ts
│       │   │   ├── ProgressionService.ts
│       │   │   ├── ProfileAnalyzer.ts
│       │   │   └── RecommendationEngine.ts
│       │   │
│       │   ├── ports/             # 🔌 PORT INTERFACES
│       │   │   ├── ISessionRepository.ts
│       │   │   ├── IProgressRepository.ts
│       │   │   ├── IAnalyticsRepository.ts
│       │   │   ├── IAudioPlayer.ts
│       │   │   ├── ILLMService.ts
│       │   │   └── IEventBus.ts
│       │   │
│       │   ├── use-cases/         # 📋 APPLICATION USE CASES
│       │   │   ├── StartSession.ts
│       │   │   ├── RecordResponse.ts
│       │   │   ├── CompleteSession.ts
│       │   │   ├── GetRecommendations.ts
│       │   │   ├── UnlockLevel.ts
│       │   │   └── BuildUserProfile.ts
│       │   │
│       │   └── config/            # ⚙️ STATIC CONFIGURATION
│       │       ├── levels.ts
│       │       └── constants.ts
│       │
│       └── __tests__/             # Core unit tests (Vitest)
│
├── src/                           # 🖥️ NEXT.JS APPLICATION
│   ├── app/                       # Presentation: Pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── train/
│   │   ├── progress/
│   │   └── api/                   # API routes (could call Core)
│   │       └── llm/
│   │
│   ├── components/                # Presentation: React Components
│   │   ├── ui/
│   │   ├── training/
│   │   ├── help/
│   │   └── results/
│   │
│   ├── infrastructure/            # 🔌 ADAPTER IMPLEMENTATIONS
│   │   ├── repositories/
│   │   │   ├── DexieSessionRepository.ts
│   │   │   ├── DexieProgressRepository.ts
│   │   │   └── DexieAnalyticsRepository.ts
│   │   ├── audio/
│   │   │   └── HowlerAudioPlayer.ts
│   │   ├── llm/
│   │   │   └── AnthropicLLMService.ts
│   │   └── analytics/
│   │       └── BrowserEventBus.ts
│   │
│   ├── application/               # 📋 APPLICATION SERVICES
│   │   ├── providers/
│   │   │   └── CoreProvider.tsx   # DI container for React
│   │   ├── hooks/                 # React hooks composing Core
│   │   │   ├── useGame.ts
│   │   │   ├── useSession.ts
│   │   │   ├── useProgress.ts
│   │   │   └── useLLMFeedback.ts
│   │   └── stores/                # Zustand (UI state only)
│   │       ├── uiStore.ts
│   │       └── settingsStore.ts
│   │
│   ├── lib/                       # Shared utilities
│   │   └── utils.ts
│   │
│   └── types/                     # Presentation-layer types
│       └── ui.ts
│
├── package.json                   # Root workspace config
├── tsconfig.json                  # Root TS config
└── turbo.json                     # Monorepo build (optional)
```

---

## Core Domain Module

### Package Configuration

```json
// packages/core/package.json
{
  "name": "@neuralift/core",
  "version": "0.1.0",
  "main": "./dist/index.js",
  "module": "./dist/index.mjs",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.mjs",
      "require": "./dist/index.js",
      "types": "./dist/index.d.ts"
    }
  },
  "scripts": {
    "build": "tsup src/index.ts --format cjs,esm --dts",
    "test": "vitest",
    "typecheck": "tsc --noEmit"
  },
  "devDependencies": {
    "tsup": "^8.0.0",
    "typescript": "^5.0.0",
    "vitest": "^1.0.0"
  },
  "peerDependencies": {
    "zod": "^3.0.0"
  }
}
```

### TypeScript Configuration (Core)

```json
// packages/core/tsconfig.json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "lib": ["ES2022"],           // NO DOM!
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

---

## Port Interfaces (Contracts)

### Session Repository Port

```typescript
// packages/core/src/ports/ISessionRepository.ts

import type { Session, SessionResult } from '../domain/entities/Session';

/**
 * Port for session persistence.
 * Implemented by: DexieSessionRepository, InMemorySessionRepository, APISessionRepository
 */
export interface ISessionRepository {
  save(session: SessionResult): Promise<void>;
  findById(sessionId: string): Promise<SessionResult | null>;
  findByLevel(levelId: string): Promise<SessionResult[]>;
  findRecent(limit: number): Promise<SessionResult[]>;
  findByDateRange(start: Date, end: Date): Promise<SessionResult[]>;
  count(): Promise<number>;
  clear(): Promise<void>;
}
```

### Progress Repository Port

```typescript
// packages/core/src/ports/IProgressRepository.ts

import type { UserProgress } from '../domain/entities/UserProfile';

export interface IProgressRepository {
  get(): Promise<UserProgress>;
  save(progress: UserProgress): Promise<void>;
  reset(): Promise<void>;
}
```

### Analytics Repository Port

```typescript
// packages/core/src/ports/IAnalyticsRepository.ts

import type { AnalyticsEvent } from '../domain/events/AnalyticsEvent';
import type { UserBehavioralProfile } from '../domain/entities/UserProfile';

export interface IAnalyticsRepository {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  trackEvents(events: AnalyticsEvent[]): Promise<void>;
  getEventsByCategory(category: string): Promise<AnalyticsEvent[]>;
  getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]>;
  getRecentEvents(limit: number): Promise<AnalyticsEvent[]>;
  clear(): Promise<void>;
}
```

### Audio Player Port

```typescript
// packages/core/src/ports/IAudioPlayer.ts

/**
 * Port for audio playback.
 * Implemented by: HowlerAudioPlayer, WebAudioPlayer, NoOpAudioPlayer (for testing/serverless)
 */
export interface IAudioPlayer {
  initialize(): Promise<void>;
  playLetter(letter: string): Promise<void>;
  playFeedback(type: 'correct' | 'incorrect' | 'tick'): Promise<void>;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
  destroy(): void;
}

// No-op implementation for serverless/testing
export class NoOpAudioPlayer implements IAudioPlayer {
  async initialize() {}
  async playLetter() {}
  async playFeedback() {}
  setVolume() {}
  mute() {}
  unmute() {}
  destroy() {}
}
```

### LLM Service Port

```typescript
// packages/core/src/ports/ILLMService.ts

import type { UserBehavioralProfile } from '../domain/entities/UserProfile';
import type { SessionResult } from '../domain/entities/Session';

export interface LLMFeedbackRequest {
  type: 'session_feedback' | 'recommendation' | 'motivation' | 'tip';
  profile: UserBehavioralProfile;
  session?: SessionResult;
}

export interface LLMFeedbackResponse {
  message: string;
  suggestions?: string[];
  encouragement?: string;
  nextSteps?: string[];
}

export interface ILLMService {
  getSessionFeedback(session: SessionResult, profile: UserBehavioralProfile): Promise<LLMFeedbackResponse>;
  getRecommendations(profile: UserBehavioralProfile): Promise<LLMFeedbackResponse>;
  getMotivationalMessage(profile: UserBehavioralProfile, trigger: string): Promise<string>;
}

// Fallback implementation when LLM unavailable
export class FallbackLLMService implements ILLMService {
  async getSessionFeedback(): Promise<LLMFeedbackResponse> {
    return { message: "Great effort! Keep practicing to build those neural pathways." };
  }
  async getRecommendations(): Promise<LLMFeedbackResponse> {
    return { message: "Continue with your current level to build consistency." };
  }
  async getMotivationalMessage(): Promise<string> {
    return "Every session counts toward building a stronger mind!";
  }
}
```

### Event Bus Port

```typescript
// packages/core/src/ports/IEventBus.ts

import type { DomainEvent } from '../domain/events/DomainEvent';

export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): () => void;
  unsubscribeAll(): void;
}
```

---

## Domain Entities

### Trial Entity

```typescript
// packages/core/src/domain/entities/Trial.ts

import { Position } from '../value-objects/Position';

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

  static create(
    id: number,
    position: number,
    audioLetter: string,
    isPositionMatch: boolean,
    isAudioMatch: boolean
  ): Trial {
    return new Trial({
      id,
      position,
      audioLetter,
      isPositionMatch,
      isAudioMatch,
      userPositionResponse: null,
      userAudioResponse: null,
      positionResponseTime: null,
      audioResponseTime: null,
      stimulusTimestamp: Date.now(),
    });
  }

  get id(): number { return this.data.id; }
  get position(): number { return this.data.position; }
  get audioLetter(): string { return this.data.audioLetter; }
  get isPositionMatch(): boolean { return this.data.isPositionMatch; }
  get isAudioMatch(): boolean { return this.data.isAudioMatch; }

  recordPositionResponse(response: boolean): Trial {
    return new Trial({
      ...this.data,
      userPositionResponse: response,
      positionResponseTime: Date.now() - this.data.stimulusTimestamp,
    });
  }

  recordAudioResponse(response: boolean): Trial {
    return new Trial({
      ...this.data,
      userAudioResponse: response,
      audioResponseTime: Date.now() - this.data.stimulusTimestamp,
    });
  }

  isPositionCorrect(): boolean {
    if (this.data.userPositionResponse === null) {
      return !this.data.isPositionMatch; // No response = correct if no match
    }
    return this.data.userPositionResponse === this.data.isPositionMatch;
  }

  isAudioCorrect(): boolean {
    if (this.data.userAudioResponse === null) {
      return !this.data.isAudioMatch;
    }
    return this.data.userAudioResponse === this.data.isAudioMatch;
  }

  toJSON(): TrialData {
    return { ...this.data };
  }
}
```

### Session Entity

```typescript
// packages/core/src/domain/entities/Session.ts

import { Trial, TrialData } from './Trial';
import { PerformanceStats } from '../value-objects/PerformanceStats';
import { TrainingMode } from '../value-objects/TrainingMode';

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
  private trials: Trial[] = [];
  private currentTrialIndex = 0;
  private startTime: Date | null = null;
  private endTime: Date | null = null;

  constructor(
    public readonly sessionId: string,
    public readonly config: SessionConfig,
    initialTrials: Trial[]
  ) {
    this.trials = initialTrials;
  }

  start(): void {
    this.startTime = new Date();
  }

  getCurrentTrial(): Trial | null {
    return this.trials[this.currentTrialIndex] ?? null;
  }

  recordPositionResponse(response: boolean): void {
    if (this.currentTrialIndex < this.trials.length) {
      this.trials[this.currentTrialIndex] =
        this.trials[this.currentTrialIndex].recordPositionResponse(response);
    }
  }

  recordAudioResponse(response: boolean): void {
    if (this.currentTrialIndex < this.trials.length) {
      this.trials[this.currentTrialIndex] =
        this.trials[this.currentTrialIndex].recordAudioResponse(response);
    }
  }

  advanceToNextTrial(): boolean {
    if (this.currentTrialIndex < this.trials.length - 1) {
      this.currentTrialIndex++;
      return true;
    }
    return false;
  }

  complete(): SessionResult {
    this.endTime = new Date();

    const trialData = this.trials.map(t => t.toJSON());
    const positionStats = this.calculateStats('position');
    const audioStats = this.calculateStats('audio');

    return {
      sessionId: this.sessionId,
      levelId: this.config.levelId,
      mode: this.config.mode,
      nBack: this.config.nBack,
      timestamp: this.startTime!,
      duration: this.endTime.getTime() - this.startTime!.getTime(),
      trials: trialData,
      positionStats,
      audioStats,
      combinedAccuracy: this.calculateCombinedAccuracy(positionStats, audioStats),
      completed: true,
    };
  }

  getProgress(): { current: number; total: number; percentage: number } {
    return {
      current: this.currentTrialIndex + 1,
      total: this.trials.length,
      percentage: ((this.currentTrialIndex + 1) / this.trials.length) * 100,
    };
  }

  private calculateStats(type: 'position' | 'audio'): PerformanceStats {
    // Implementation moved to ScoringService
    // This is a simplified version
    let hits = 0, misses = 0, falseAlarms = 0, correctRejections = 0;

    for (const trial of this.trials) {
      const isMatch = type === 'position' ? trial.isPositionMatch : trial.isAudioMatch;
      const isCorrect = type === 'position' ? trial.isPositionCorrect() : trial.isAudioCorrect();
      const data = trial.toJSON();
      const userResponse = type === 'position' ? data.userPositionResponse : data.userAudioResponse;

      if (isMatch && userResponse) hits++;
      else if (isMatch && !userResponse) misses++;
      else if (!isMatch && userResponse) falseAlarms++;
      else correctRejections++;
    }

    const totalMatches = hits + misses;
    const totalNonMatches = falseAlarms + correctRejections;
    const hitRate = totalMatches > 0 ? hits / totalMatches : 0;
    const falseAlarmRate = totalNonMatches > 0 ? falseAlarms / totalNonMatches : 0;

    return {
      hits,
      misses,
      falseAlarms,
      correctRejections,
      hitRate,
      falseAlarmRate,
      dPrime: 0, // Calculated by ScoringService
      accuracy: (hits + correctRejections) / this.trials.length,
    };
  }

  private calculateCombinedAccuracy(position: PerformanceStats, audio: PerformanceStats): number {
    switch (this.config.mode) {
      case 'position-only': return position.accuracy;
      case 'audio-only': return audio.accuracy;
      case 'dual': return (position.accuracy + audio.accuracy) / 2;
    }
  }
}
```

---

## Use Cases

### Start Session Use Case

```typescript
// packages/core/src/use-cases/StartSession.ts

import { Session } from '../domain/entities/Session';
import { Trial } from '../domain/entities/Trial';
import { SequenceGenerator } from '../services/SequenceGenerator';
import type { IEventBus } from '../ports/IEventBus';
import type { IAudioPlayer } from '../ports/IAudioPlayer';
import { SessionStartedEvent } from '../domain/events/SessionStarted';
import { LEVELS } from '../config/levels';

export interface StartSessionInput {
  levelId: string;
  customTrialCount?: number;
}

export interface StartSessionOutput {
  session: Session;
}

export class StartSessionUseCase {
  constructor(
    private readonly eventBus: IEventBus,
    private readonly audioPlayer: IAudioPlayer,
    private readonly sequenceGenerator: SequenceGenerator
  ) {}

  async execute(input: StartSessionInput): Promise<StartSessionOutput> {
    const level = LEVELS[input.levelId];
    if (!level) {
      throw new Error(`Level ${input.levelId} not found`);
    }

    // Generate sequence
    const trialCount = input.customTrialCount ?? level.defaultTrials;
    const sequence = this.sequenceGenerator.generate({
      nBack: level.nBack,
      mode: level.mode,
      trialCount,
    });

    // Create session
    const sessionId = this.generateSessionId();
    const trials = sequence.map((s, i) =>
      Trial.create(i, s.position, s.letter, s.isPositionMatch, s.isAudioMatch)
    );

    const session = new Session(sessionId, {
      levelId: level.id,
      nBack: level.nBack,
      mode: level.mode,
      trialCount,
      trialDuration: level.trialDuration,
    }, trials);

    // Initialize audio
    await this.audioPlayer.initialize();

    // Publish domain event
    await this.eventBus.publish(new SessionStartedEvent({
      sessionId,
      levelId: level.id,
      nBack: level.nBack,
      mode: level.mode,
      trialCount,
    }));

    return { session };
  }

  private generateSessionId(): string {
    // Simple UUID-like generation without external deps
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
```

### Complete Session Use Case

```typescript
// packages/core/src/use-cases/CompleteSession.ts

import type { Session, SessionResult } from '../domain/entities/Session';
import type { ISessionRepository } from '../ports/ISessionRepository';
import type { IProgressRepository } from '../ports/IProgressRepository';
import type { IAnalyticsRepository } from '../ports/IAnalyticsRepository';
import type { IEventBus } from '../ports/IEventBus';
import { ScoringService } from '../services/ScoringService';
import { ProgressionService } from '../services/ProgressionService';
import { SessionCompletedEvent } from '../domain/events/SessionCompleted';

export interface CompleteSessionInput {
  session: Session;
}

export interface CompleteSessionOutput {
  result: SessionResult;
  levelUnlocked?: string;
  newPersonalBest: boolean;
}

export class CompleteSessionUseCase {
  constructor(
    private readonly sessionRepo: ISessionRepository,
    private readonly progressRepo: IProgressRepository,
    private readonly analyticsRepo: IAnalyticsRepository,
    private readonly eventBus: IEventBus,
    private readonly scoringService: ScoringService,
    private readonly progressionService: ProgressionService
  ) {}

  async execute(input: CompleteSessionInput): Promise<CompleteSessionOutput> {
    // Complete session and calculate stats
    const result = input.session.complete();

    // Enhance stats with d-prime calculation
    result.positionStats.dPrime = this.scoringService.calculateDPrime(
      result.positionStats.hitRate,
      result.positionStats.falseAlarmRate
    );
    result.audioStats.dPrime = this.scoringService.calculateDPrime(
      result.audioStats.hitRate,
      result.audioStats.falseAlarmRate
    );

    // Persist session
    await this.sessionRepo.save(result);

    // Update progress
    const progress = await this.progressRepo.get();
    const previousBest = await this.getBestAccuracy(result.levelId);

    const updatedProgress = this.progressionService.updateProgress(
      progress,
      result
    );
    await this.progressRepo.save(updatedProgress);

    // Check for level unlock
    const levelUnlocked = await this.progressionService.checkUnlocks(
      updatedProgress,
      result
    );

    // Publish event
    await this.eventBus.publish(new SessionCompletedEvent({
      sessionId: result.sessionId,
      levelId: result.levelId,
      accuracy: result.combinedAccuracy,
      duration: result.duration,
    }));

    return {
      result,
      levelUnlocked,
      newPersonalBest: result.combinedAccuracy > previousBest,
    };
  }

  private async getBestAccuracy(levelId: string): Promise<number> {
    const sessions = await this.sessionRepo.findByLevel(levelId);
    if (sessions.length === 0) return 0;
    return Math.max(...sessions.map(s => s.combinedAccuracy));
  }
}
```

---

## Core Public API

```typescript
// packages/core/src/index.ts

// Domain Entities
export { Trial, type TrialData } from './domain/entities/Trial';
export { Session, type SessionConfig, type SessionResult } from './domain/entities/Session';
export { type UserProgress, type UserBehavioralProfile } from './domain/entities/UserProfile';

// Value Objects
export { type NBackLevel } from './domain/value-objects/NBackLevel';
export { type TrainingMode } from './domain/value-objects/TrainingMode';
export { type PerformanceStats } from './domain/value-objects/PerformanceStats';

// Domain Events
export { type DomainEvent } from './domain/events/DomainEvent';
export { SessionStartedEvent } from './domain/events/SessionStarted';
export { SessionCompletedEvent } from './domain/events/SessionCompleted';
export { TrialCompletedEvent } from './domain/events/TrialCompleted';

// Ports (Interfaces)
export type { ISessionRepository } from './ports/ISessionRepository';
export type { IProgressRepository } from './ports/IProgressRepository';
export type { IAnalyticsRepository } from './ports/IAnalyticsRepository';
export type { IAudioPlayer } from './ports/IAudioPlayer';
export type { ILLMService, LLMFeedbackRequest, LLMFeedbackResponse } from './ports/ILLMService';
export type { IEventBus, EventHandler } from './ports/IEventBus';

// Default Implementations (for testing/serverless)
export { NoOpAudioPlayer } from './ports/IAudioPlayer';
export { FallbackLLMService } from './ports/ILLMService';
export { InMemoryEventBus } from './ports/IEventBus';

// Services
export { SequenceGenerator } from './services/SequenceGenerator';
export { ScoringService } from './services/ScoringService';
export { ProgressionService } from './services/ProgressionService';
export { ProfileAnalyzer } from './services/ProfileAnalyzer';

// Use Cases
export { StartSessionUseCase } from './use-cases/StartSession';
export { RecordResponseUseCase } from './use-cases/RecordResponse';
export { CompleteSessionUseCase } from './use-cases/CompleteSession';
export { GetRecommendationsUseCase } from './use-cases/GetRecommendations';
export { BuildUserProfileUseCase } from './use-cases/BuildUserProfile';

// Configuration
export { LEVELS, LEVEL_ORDER, type LevelConfig } from './config/levels';
export { AUDIO_LETTERS, GRID_SIZE } from './config/constants';

// Factory for creating configured instances
export { createCore, type CoreConfig, type CoreInstance } from './factory';
```

---

## Dependency Injection Container

### Core Factory

```typescript
// packages/core/src/factory.ts

import type { ISessionRepository } from './ports/ISessionRepository';
import type { IProgressRepository } from './ports/IProgressRepository';
import type { IAnalyticsRepository } from './ports/IAnalyticsRepository';
import type { IAudioPlayer } from './ports/IAudioPlayer';
import type { ILLMService } from './ports/ILLMService';
import type { IEventBus } from './ports/IEventBus';

import { NoOpAudioPlayer } from './ports/IAudioPlayer';
import { FallbackLLMService } from './ports/ILLMService';
import { InMemoryEventBus } from './ports/IEventBus';

import { SequenceGenerator } from './services/SequenceGenerator';
import { ScoringService } from './services/ScoringService';
import { ProgressionService } from './services/ProgressionService';
import { ProfileAnalyzer } from './services/ProfileAnalyzer';

import { StartSessionUseCase } from './use-cases/StartSession';
import { RecordResponseUseCase } from './use-cases/RecordResponse';
import { CompleteSessionUseCase } from './use-cases/CompleteSession';
import { GetRecommendationsUseCase } from './use-cases/GetRecommendations';
import { BuildUserProfileUseCase } from './use-cases/BuildUserProfile';

export interface CoreConfig {
  sessionRepository: ISessionRepository;
  progressRepository: IProgressRepository;
  analyticsRepository?: IAnalyticsRepository;
  audioPlayer?: IAudioPlayer;
  llmService?: ILLMService;
  eventBus?: IEventBus;
}

export interface CoreInstance {
  // Use Cases
  startSession: StartSessionUseCase;
  recordResponse: RecordResponseUseCase;
  completeSession: CompleteSessionUseCase;
  getRecommendations: GetRecommendationsUseCase;
  buildUserProfile: BuildUserProfileUseCase;

  // Services (for direct access if needed)
  services: {
    sequenceGenerator: SequenceGenerator;
    scoringService: ScoringService;
    progressionService: ProgressionService;
    profileAnalyzer: ProfileAnalyzer;
  };

  // Event Bus
  eventBus: IEventBus;
}

export function createCore(config: CoreConfig): CoreInstance {
  // Use provided implementations or defaults
  const eventBus = config.eventBus ?? new InMemoryEventBus();
  const audioPlayer = config.audioPlayer ?? new NoOpAudioPlayer();
  const llmService = config.llmService ?? new FallbackLLMService();

  // Create services
  const sequenceGenerator = new SequenceGenerator();
  const scoringService = new ScoringService();
  const progressionService = new ProgressionService();
  const profileAnalyzer = new ProfileAnalyzer();

  // Create use cases with dependencies injected
  const startSession = new StartSessionUseCase(
    eventBus,
    audioPlayer,
    sequenceGenerator
  );

  const recordResponse = new RecordResponseUseCase(eventBus);

  const completeSession = new CompleteSessionUseCase(
    config.sessionRepository,
    config.progressRepository,
    config.analyticsRepository!,
    eventBus,
    scoringService,
    progressionService
  );

  const getRecommendations = new GetRecommendationsUseCase(
    config.sessionRepository,
    config.progressRepository,
    llmService,
    profileAnalyzer
  );

  const buildUserProfile = new BuildUserProfileUseCase(
    config.sessionRepository,
    config.progressRepository,
    config.analyticsRepository!,
    profileAnalyzer
  );

  return {
    startSession,
    recordResponse,
    completeSession,
    getRecommendations,
    buildUserProfile,
    services: {
      sequenceGenerator,
      scoringService,
      progressionService,
      profileAnalyzer,
    },
    eventBus,
  };
}
```

### React Provider (Application Layer)

```typescript
// src/application/providers/CoreProvider.tsx
'use client';

import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { createCore, type CoreInstance } from '@neuralift/core';

// Infrastructure adapters
import { DexieSessionRepository } from '@/infrastructure/repositories/DexieSessionRepository';
import { DexieProgressRepository } from '@/infrastructure/repositories/DexieProgressRepository';
import { DexieAnalyticsRepository } from '@/infrastructure/repositories/DexieAnalyticsRepository';
import { HowlerAudioPlayer } from '@/infrastructure/audio/HowlerAudioPlayer';
import { AnthropicLLMService } from '@/infrastructure/llm/AnthropicLLMService';
import { BrowserEventBus } from '@/infrastructure/analytics/BrowserEventBus';

const CoreContext = createContext<CoreInstance | null>(null);

export function CoreProvider({ children }: { children: ReactNode }) {
  const core = useMemo(() => {
    return createCore({
      sessionRepository: new DexieSessionRepository(),
      progressRepository: new DexieProgressRepository(),
      analyticsRepository: new DexieAnalyticsRepository(),
      audioPlayer: new HowlerAudioPlayer(),
      llmService: new AnthropicLLMService(),
      eventBus: new BrowserEventBus(),
    });
  }, []);

  return (
    <CoreContext.Provider value={core}>
      {children}
    </CoreContext.Provider>
  );
}

export function useCore(): CoreInstance {
  const context = useContext(CoreContext);
  if (!context) {
    throw new Error('useCore must be used within a CoreProvider');
  }
  return context;
}
```

---

## Infrastructure Adapter Example

```typescript
// src/infrastructure/repositories/DexieSessionRepository.ts

import Dexie, { type Table } from 'dexie';
import type { ISessionRepository } from '@neuralift/core';
import type { SessionResult } from '@neuralift/core';

class NeuraliftDB extends Dexie {
  sessions!: Table<SessionResult>;

  constructor() {
    super('neuralift');
    this.version(1).stores({
      sessions: 'sessionId, levelId, timestamp',
    });
  }
}

export class DexieSessionRepository implements ISessionRepository {
  private db: NeuraliftDB;

  constructor() {
    this.db = new NeuraliftDB();
  }

  async save(session: SessionResult): Promise<void> {
    await this.db.sessions.put(session);
  }

  async findById(sessionId: string): Promise<SessionResult | null> {
    return await this.db.sessions.get(sessionId) ?? null;
  }

  async findByLevel(levelId: string): Promise<SessionResult[]> {
    return this.db.sessions.where('levelId').equals(levelId).toArray();
  }

  async findRecent(limit: number): Promise<SessionResult[]> {
    return this.db.sessions.orderBy('timestamp').reverse().limit(limit).toArray();
  }

  async findByDateRange(start: Date, end: Date): Promise<SessionResult[]> {
    return this.db.sessions
      .where('timestamp')
      .between(start, end)
      .toArray();
  }

  async count(): Promise<number> {
    return this.db.sessions.count();
  }

  async clear(): Promise<void> {
    await this.db.sessions.clear();
  }
}
```

---

## Serverless Function Example

```typescript
// Example: AWS Lambda / Vercel Edge Function
// This shows how Core can run outside the browser

import { createCore, FallbackLLMService, NoOpAudioPlayer } from '@neuralift/core';
import { DynamoDBSessionRepository } from './adapters/DynamoDBSessionRepository';
import { DynamoDBProgressRepository } from './adapters/DynamoDBProgressRepository';

export async function handler(event: any) {
  // Create core with serverless-compatible adapters
  const core = createCore({
    sessionRepository: new DynamoDBSessionRepository(),
    progressRepository: new DynamoDBProgressRepository(),
    audioPlayer: new NoOpAudioPlayer(),      // No audio in serverless
    llmService: new FallbackLLMService(),    // Or real LLM service
  });

  const { action, payload } = JSON.parse(event.body);

  switch (action) {
    case 'buildProfile':
      const profile = await core.buildUserProfile.execute({ userId: payload.userId });
      return { statusCode: 200, body: JSON.stringify(profile) };

    case 'getRecommendations':
      const recommendations = await core.getRecommendations.execute(payload);
      return { statusCode: 200, body: JSON.stringify(recommendations) };

    default:
      return { statusCode: 400, body: 'Unknown action' };
  }
}
```

---

## Root Workspace Configuration

```json
// package.json (root)
{
  "name": "neuralift",
  "private": true,
  "workspaces": [
    "packages/*",
    "."
  ],
  "scripts": {
    "dev": "next dev",
    "build": "npm run build:core && next build",
    "build:core": "npm run build -w @neuralift/core",
    "test": "npm run test:core && npm run test:app",
    "test:core": "npm run test -w @neuralift/core",
    "typecheck": "tsc --noEmit && npm run typecheck -w @neuralift/core"
  }
}
```

```json
// tsconfig.json (root)
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "paths": {
      "@/*": ["./src/*"],
      "@neuralift/core": ["./packages/core/src"],
      "@neuralift/core/*": ["./packages/core/src/*"]
    }
  }
}
```

---

## Deliverables Checklist

### Foundation
- [ ] Next.js 14+ project initialized with App Router
- [ ] TypeScript configured in strict mode
- [ ] Monorepo workspace structure created
- [ ] Path aliases configured
- [ ] ESLint and Prettier configured

### Core Domain Package
- [ ] `packages/core` folder structure created
- [ ] Core package.json with build scripts
- [ ] Core tsconfig.json (no DOM libs)
- [ ] All port interfaces defined
- [ ] Domain entities (Trial, Session, UserProfile)
- [ ] Value objects defined
- [ ] Domain events defined
- [ ] Core services scaffolded
- [ ] Use cases scaffolded
- [ ] Public API exports (index.ts)
- [ ] Factory function for DI
- [ ] NoOp/Fallback implementations for testing

### Application Layer
- [ ] CoreProvider React context
- [ ] useCore hook
- [ ] Base application hooks structure

### Infrastructure Layer
- [ ] Repository adapters folder structure
- [ ] Audio player adapter folder structure
- [ ] LLM service adapter folder structure

---

## Success Criteria

1. `npm run build:core` compiles without errors
2. Core package has **zero** browser/React dependencies
3. Core can be imported and used in a Node.js script
4. CoreProvider correctly injects dependencies
5. Path aliases resolve in both app and core
6. TypeScript strict mode passes in both packages

---

## Dependencies for Next Phase

Phase 2 (Design System) requires:
- Working project structure
- Core package building
- Type definitions available from Core

Phase 3 (Training Infrastructure) will:
- Implement all Core services
- Create infrastructure adapters
- Wire up use cases

---

## Notes

- **Core must never import from `src/`** - only the reverse
- Use `npm link` or workspace references during development
- Consider publishing Core to npm once stable
- Infrastructure adapters can be swapped without changing Core
- Test Core independently with Vitest (no Jest DOM)
- Consider adding OpenAPI spec for future API layer
