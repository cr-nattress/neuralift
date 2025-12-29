/**
 * Core Factory
 *
 * Provides dependency injection and service instantiation.
 * This is the main entry point for creating core services.
 */

import type { ISessionRepository } from './ports/ISessionRepository';
import type { IProgressRepository } from './ports/IProgressRepository';
import type { IAnalyticsRepository } from './ports/IAnalyticsRepository';
import type { IAudioPlayer } from './ports/IAudioPlayer';
import type { ILLMService } from './ports/ILLMService';
import type { IEventBus } from './ports/IEventBus';
import { SequenceGenerator, createSequenceGenerator } from './services/SequenceGenerator';
import { ScoringService, createScoringService } from './services/ScoringService';

/**
 * Port adapters required to create a CoreFactory instance
 */
export interface CoreDependencies {
  sessionRepository: ISessionRepository;
  progressRepository: IProgressRepository;
  analyticsRepository: IAnalyticsRepository;
  audioPlayer: IAudioPlayer;
  llmService: ILLMService;
  eventBus: IEventBus;
}

/**
 * Core services (framework-agnostic domain services)
 */
export interface CoreServices {
  readonly sequenceGenerator: SequenceGenerator;
  readonly scoringService: ScoringService;
}

/**
 * Repositories exposed from core
 */
export interface CoreRepositories {
  readonly session: ISessionRepository;
  readonly progress: IProgressRepository;
  readonly analytics: IAnalyticsRepository;
}

/**
 * Factory for creating core domain services
 */
export interface CoreFactory {
  readonly dependencies: CoreDependencies;
  readonly services: CoreServices;
  readonly repositories: CoreRepositories;
  readonly audioPlayer: IAudioPlayer;
  readonly llmService: ILLMService;
  readonly eventBus: IEventBus;
}

/**
 * Creates a new CoreFactory with the provided dependencies
 */
export function createCoreFactory(dependencies: CoreDependencies): CoreFactory {
  const services: CoreServices = {
    sequenceGenerator: createSequenceGenerator(),
    scoringService: createScoringService(),
  };

  const repositories: CoreRepositories = {
    session: dependencies.sessionRepository,
    progress: dependencies.progressRepository,
    analytics: dependencies.analyticsRepository,
  };

  return {
    dependencies,
    services,
    repositories,
    audioPlayer: dependencies.audioPlayer,
    llmService: dependencies.llmService,
    eventBus: dependencies.eventBus,
  };
}
