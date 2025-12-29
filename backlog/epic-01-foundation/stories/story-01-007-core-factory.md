# Story 01-007: Create Core Factory & Dependency Injection

## Story

**As a** developer
**I want** a factory function for creating core instances
**So that** dependencies are injected cleanly and the core is configurable

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Create the factory function that assembles all core services, use cases, and wires up dependencies. This is the main entry point for using the core domain.

## Acceptance Criteria

- [ ] createCore() factory function implemented
- [ ] CoreConfig interface defined with required/optional deps
- [ ] CoreInstance interface returned with all use cases
- [ ] Default implementations used when optional deps not provided
- [ ] All services properly instantiated and wired
- [ ] Factory can be called from Node.js (no browser deps)

## Technical Details

### CoreConfig Interface

```typescript
export interface CoreConfig {
  // Required
  sessionRepository: ISessionRepository;
  progressRepository: IProgressRepository;

  // Optional - defaults provided
  analyticsRepository?: IAnalyticsRepository;
  audioPlayer?: IAudioPlayer;
  llmService?: ILLMService;
  eventBus?: IEventBus;
}
```

### CoreInstance Interface

```typescript
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
```

### Factory Implementation

```typescript
export function createCore(config: CoreConfig): CoreInstance {
  // Use provided implementations or defaults
  const eventBus = config.eventBus ?? new InMemoryEventBus();
  const audioPlayer = config.audioPlayer ?? new NoOpAudioPlayer();
  const llmService = config.llmService ?? new FallbackLLMService();
  const analyticsRepository = config.analyticsRepository ?? new NoOpAnalyticsRepository();

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
    analyticsRepository,
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
    analyticsRepository,
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

## Tasks

- [ ] Create CoreConfig interface
- [ ] Create CoreInstance interface
- [ ] Implement createCore() factory
- [ ] Create NoOpAnalyticsRepository for defaults
- [ ] Export factory from index.ts
- [ ] Write integration test that creates core instance
- [ ] Verify core works in Node.js script

## Dependencies

- Story 01-005 (Port Interfaces)
- Story 01-006 (Domain Entities)

## Notes

- Factory pattern allows different configurations for browser/serverless
- Optional dependencies have sensible defaults
- This is the ONLY way to get a core instance
