/**
 * Application Hooks
 *
 * React hooks for composing core services with UI state management.
 */

export { useAnalytics, type UseAnalyticsReturn, type TrackEventInput } from './useAnalytics';
export { useProgress, type UseProgressReturn } from './useProgress';
export {
  useTrainingSession,
  type UseTrainingSessionReturn,
  type SessionLevelConfig,
} from './useTrainingSession';
export { useLLMFeedback, type UseLLMFeedbackReturn } from './useLLMFeedback';
export { useSettings, type UseSettingsReturn, type Settings } from './useSettings';
export { useDataSync, type UseDataSyncReturn } from './useDataSync';
