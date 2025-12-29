# Story 01-005: Define Port Interfaces

## Story

**As a** developer
**I want** port interfaces defined for all external dependencies
**So that** the core domain remains decoupled from infrastructure

## Points: 8

## Priority: Critical

## Status: TODO

## Description

Define TypeScript interfaces for all ports (contracts) that the core domain needs from external systems. These will be implemented by adapters in the infrastructure layer.

## Acceptance Criteria

- [ ] ISessionRepository interface defined
- [ ] IProgressRepository interface defined
- [ ] IAnalyticsRepository interface defined
- [ ] IAudioPlayer interface defined with NoOp implementation
- [ ] ILLMService interface defined with Fallback implementation
- [ ] IEventBus interface defined with InMemory implementation
- [ ] All interfaces exported from ports/index.ts
- [ ] Default implementations available for testing/serverless

## Technical Details

### ISessionRepository

```typescript
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

### IProgressRepository

```typescript
export interface IProgressRepository {
  get(): Promise<UserProgress>;
  save(progress: UserProgress): Promise<void>;
  reset(): Promise<void>;
}
```

### IAnalyticsRepository

```typescript
export interface IAnalyticsRepository {
  trackEvent(event: AnalyticsEvent): Promise<void>;
  trackEvents(events: AnalyticsEvent[]): Promise<void>;
  getEventsByCategory(category: string): Promise<AnalyticsEvent[]>;
  getEventsBySession(sessionId: string): Promise<AnalyticsEvent[]>;
  getRecentEvents(limit: number): Promise<AnalyticsEvent[]>;
  clear(): Promise<void>;
}
```

### IAudioPlayer (with NoOp)

```typescript
export interface IAudioPlayer {
  initialize(): Promise<void>;
  playLetter(letter: string): Promise<void>;
  playFeedback(type: 'correct' | 'incorrect' | 'tick'): Promise<void>;
  setVolume(volume: number): void;
  mute(): void;
  unmute(): void;
  destroy(): void;
}

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

### ILLMService (with Fallback)

```typescript
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

export class FallbackLLMService implements ILLMService {
  async getSessionFeedback(): Promise<LLMFeedbackResponse> {
    return { message: "Great effort! Keep practicing." };
  }
  async getRecommendations(): Promise<LLMFeedbackResponse> {
    return { message: "Continue with your current level." };
  }
  async getMotivationalMessage(): Promise<string> {
    return "Every session counts!";
  }
}
```

### IEventBus (with InMemory)

```typescript
export type EventHandler<T extends DomainEvent = DomainEvent> = (event: T) => void | Promise<void>;

export interface IEventBus {
  publish<T extends DomainEvent>(event: T): Promise<void>;
  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): () => void;
  unsubscribeAll(): void;
}

export class InMemoryEventBus implements IEventBus {
  private handlers: Map<string, Set<EventHandler>> = new Map();

  async publish<T extends DomainEvent>(event: T): Promise<void> {
    const eventHandlers = this.handlers.get(event.type);
    if (eventHandlers) {
      for (const handler of eventHandlers) {
        await handler(event);
      }
    }
  }

  subscribe<T extends DomainEvent>(eventType: string, handler: EventHandler<T>): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, new Set());
    }
    this.handlers.get(eventType)!.add(handler as EventHandler);
    return () => this.handlers.get(eventType)?.delete(handler as EventHandler);
  }

  unsubscribeAll(): void {
    this.handlers.clear();
  }
}
```

## Tasks

- [ ] Create ISessionRepository.ts
- [ ] Create IProgressRepository.ts
- [ ] Create IAnalyticsRepository.ts
- [ ] Create IAudioPlayer.ts with NoOpAudioPlayer
- [ ] Create ILLMService.ts with FallbackLLMService
- [ ] Create IEventBus.ts with InMemoryEventBus
- [ ] Create ports/index.ts exporting all interfaces
- [ ] Write unit tests for default implementations

## Dependencies

- Story 01-004 (Core Package Structure)

## Notes

- Default implementations allow core to be tested without infrastructure
- NoOpAudioPlayer is essential for serverless/Node.js usage
- FallbackLLMService provides graceful degradation
