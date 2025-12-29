/**
 * Application Layer
 *
 * Contains React-specific implementations including:
 * - Providers for dependency injection
 * - Zustand stores for state management
 * - Hooks for composing core services with React state
 */

// Providers
export { CoreProvider, useCore } from './providers';

// Stores
export {
  useSessionStore,
  selectCurrentTrial,
  selectProgress,
  selectIsActive,
  selectIsComplete,
  selectDuration,
  selectCanRespondPosition,
  selectCanRespondAudio,
  type SessionStatus,
  type SessionInitConfig,
} from './stores';

// Hooks
export {
  useAnalytics,
  useProgress,
  useTrainingSession,
  useLLMFeedback,
  type UseAnalyticsReturn,
  type TrackEventInput,
  type UseProgressReturn,
  type UseTrainingSessionReturn,
  type SessionLevelConfig,
  type UseLLMFeedbackReturn,
} from './hooks';
