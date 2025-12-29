/**
 * Supabase Infrastructure
 *
 * Exports Supabase clients and types for the Neuralift application.
 * All tables use the 'neuralift_' prefix for namespace isolation.
 */

export { getSupabaseBrowserClient, isSupabaseAvailable } from './client';
export { getSupabaseServerClient, getSupabaseAdminClient } from './server';
export { getDeviceId, hasDeviceId, clearDeviceId } from './deviceId';
export {
  SupabaseSessionRepository,
  supabaseSessionRepository,
} from './SupabaseSessionRepository';
export {
  SupabaseProgressRepository,
  supabaseProgressRepository,
} from './SupabaseProgressRepository';
export {
  SupabaseSettingsRepository,
  supabaseSettingsRepository,
} from './SupabaseSettingsRepository';
export type {
  Database,
  NeuraliftSession,
  NeuraliftProgress,
  NeuraliftSettings,
  NeuraliftAnalyticsEvent,
  NeuraliftSyncLog,
  NeuraliftSessionInsert,
  NeuraliftProgressInsert,
  NeuraliftSettingsInsert,
  NeuraliftAnalyticsEventInsert,
} from './types';
