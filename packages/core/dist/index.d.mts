import { I as IAnalyticsRepository } from './IAnalyticsRepository-dbLgTcrS.mjs';
export { A as AnalyticsEvent, E as EventCategory, e as PerformanceRawCounts, P as PerformanceStats, i as Position, h as PositionIndex, d as Session, S as SessionConfig, c as SessionProgress, b as SessionResult, a as Trial, T as TrialData, g as createEmptyPerformanceStats, f as createPerformanceStats, k as createPosition, l as createPositionFromCoords, m as getAllPositionIndices, n as getRandomPositionIndex, j as isValidPositionIndex, p as positionsEqual } from './IAnalyticsRepository-dbLgTcrS.mjs';
export { AnalyticsEventType, AppOpenedEvent, AppOpenedPayload, BaseAnalyticsEvent, ButtonClickedEvent, ButtonClickedPayload, HelpViewedEvent, HelpViewedPayload, Level, LevelProgress, LevelProgressEvent, LevelProgressPayload, LevelSelectedEvent, LevelSelectedPayload, LevelUnlocked, LevelUnlockedEvent, LevelUnlockedPayload, PageViewedEvent, PageViewedPayload, PayloadForEventType, SessionAbandonedEvent, SessionAbandonedPayload, SessionCompleted, SessionCompletedEvent, SessionCompletedPayload, SessionPausedEvent, SessionPausedPayload, SessionResumedEvent, SessionResumedPayload, SessionStarted, SessionStartedEvent, SessionStartedPayload, SettingChangedEvent, SettingChangedPayload, StreakMilestoneEvent, StreakMilestonePayload, TourCompletedEvent, TourCompletedPayload, TourStepViewedEvent, TourStepViewedPayload, TrialCompleted, TrialCompletedEvent, TrialCompletedPayload, UnlockCriteria, createLevel, createSessionCompletedEvent, isLevelUnlockCriteriaMet, levelRequiresUnlock } from './domain/index.mjs';
export { B as BehavioralPatterns, P as PerformanceTrends, S as StrengthsWeaknesses, T as TrainingPreferences, U as UserProfile, c as createInitialUserProfile, g as generateProfileSummary } from './UserProfile-Cuxx73iE.mjs';
export { N as NBackLevel, a as TRAINING_MODES, T as TrainingMode, c as createNBackLevel, g as getTrainingModeName, i as isValidNBackLevel, b as isValidTrainingMode, d as modeIncludesAudio, m as modeIncludesPosition } from './TrainingMode-CQj03MGg.mjs';
export { D as DomainEvent } from './DomainEvent-DmM7d3r0.mjs';
import { ISessionRepository, IAudioPlayer, ILLMService, IEventBus } from './ports/index.mjs';
export { FeedbackContext, FeedbackSoundType, LLMFeedbackResponse, TrainingRecommendation } from './ports/index.mjs';
import { I as IProgressRepository } from './IProgressRepository-CXwBdf0T.mjs';
export { U as UserProgress } from './IProgressRepository-CXwBdf0T.mjs';
import { SequenceGenerator, ScoringService } from './services/index.mjs';
export { DualTrialResult, ErrorPattern, FatigueIndicator, GeneratedTrial, ProfileAnalyzer, ProgressionService, RecommendationEngine, SequenceConfig, SessionScoringResult, TrialResult, UserBehavioralProfile, createProfileAnalyzer, createScoringService, createSequenceGenerator } from './services/index.mjs';
export { BuildUserProfile, CompleteSession, CompleteSessionInput, CompleteSessionOutput, GetRecommendations, RecommendationOutput, RecordResponse, RecordResponseInput, StartSession, StartSessionInput, StartSessionOutput, UnlockLevel, UnlockLevelInput } from './use-cases/index.mjs';
export { AUDIO_LETTERS, DEFAULT_TRIALS_PER_SESSION, DEFAULT_TRIAL_DURATION_MS, GRID_SIZE, LEVELS, LevelConfig, MAX_N_BACK_LEVEL, MIN_ACCURACY_FOR_PROGRESSION, MIN_SESSIONS_FOR_STREAK, SESSION_TIMEOUT_MS, TARGET_MATCH_PERCENTAGE, TOTAL_POSITIONS, getLevelById, getStarterLevels } from './config/index.mjs';

/**
 * Core Factory
 *
 * Provides dependency injection and service instantiation.
 * This is the main entry point for creating core services.
 */

/**
 * Port adapters required to create a CoreFactory instance
 */
interface CoreDependencies {
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
interface CoreServices {
    readonly sequenceGenerator: SequenceGenerator;
    readonly scoringService: ScoringService;
}
/**
 * Repositories exposed from core
 */
interface CoreRepositories {
    readonly session: ISessionRepository;
    readonly progress: IProgressRepository;
    readonly analytics: IAnalyticsRepository;
}
/**
 * Factory for creating core domain services
 */
interface CoreFactory {
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
declare function createCoreFactory(dependencies: CoreDependencies): CoreFactory;

export { type CoreDependencies, type CoreFactory, type CoreRepositories, type CoreServices, IAnalyticsRepository, IAudioPlayer, IEventBus, ILLMService, IProgressRepository, ISessionRepository, ScoringService, SequenceGenerator, createCoreFactory };
