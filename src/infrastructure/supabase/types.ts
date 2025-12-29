/**
 * Supabase Database Types for Neuralift
 *
 * All tables use the 'neuralift' schema to avoid conflicts with other apps
 * sharing the same Supabase project.
 */

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

/**
 * Database schema definition
 * Tables are prefixed with 'neuralift_' for namespace isolation
 */
export interface Database {
  public: {
    Tables: {
      neuralift_sessions: {
        Row: {
          session_id: string;
          user_id: string | null;
          level_id: string;
          mode: string;
          n_back: number;
          timestamp: string;
          duration: number;
          trials: Json;
          position_stats: Json;
          audio_stats: Json;
          combined_accuracy: number;
          completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          session_id: string;
          user_id?: string | null;
          level_id: string;
          mode: string;
          n_back: number;
          timestamp: string;
          duration: number;
          trials: Json;
          position_stats: Json;
          audio_stats: Json;
          combined_accuracy: number;
          completed: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          session_id?: string;
          user_id?: string | null;
          level_id?: string;
          mode?: string;
          n_back?: number;
          timestamp?: string;
          duration?: number;
          trials?: Json;
          position_stats?: Json;
          audio_stats?: Json;
          combined_accuracy?: number;
          completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      neuralift_progress: {
        Row: {
          id: string;
          user_id: string | null;
          device_id: string;
          current_level: string;
          unlocked_levels: string[];
          total_sessions: number;
          total_time: number;
          current_streak: number;
          longest_streak: number;
          last_session_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          device_id: string;
          current_level: string;
          unlocked_levels: string[];
          total_sessions?: number;
          total_time?: number;
          current_streak?: number;
          longest_streak?: number;
          last_session_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          device_id?: string;
          current_level?: string;
          unlocked_levels?: string[];
          total_sessions?: number;
          total_time?: number;
          current_streak?: number;
          longest_streak?: number;
          last_session_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      neuralift_settings: {
        Row: {
          id: string;
          user_id: string | null;
          device_id: string;
          trial_duration: number;
          session_length: number;
          adaptive_mode: boolean;
          show_history_helper: boolean;
          show_briefing: boolean;
          sound_enabled: boolean;
          volume: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          device_id: string;
          trial_duration?: number;
          session_length?: number;
          adaptive_mode?: boolean;
          show_history_helper?: boolean;
          show_briefing?: boolean;
          sound_enabled?: boolean;
          volume?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          device_id?: string;
          trial_duration?: number;
          session_length?: number;
          adaptive_mode?: boolean;
          show_history_helper?: boolean;
          show_briefing?: boolean;
          sound_enabled?: boolean;
          volume?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      neuralift_analytics_events: {
        Row: {
          id: string;
          user_id: string | null;
          device_id: string;
          type: string;
          category: string;
          session_id: string | null;
          timestamp: string;
          payload: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          device_id: string;
          type: string;
          category: string;
          session_id?: string | null;
          timestamp: string;
          payload: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          device_id?: string;
          type?: string;
          category?: string;
          session_id?: string | null;
          timestamp?: string;
          payload?: Json;
          created_at?: string;
        };
      };
      neuralift_sync_log: {
        Row: {
          id: string;
          device_id: string;
          table_name: string;
          last_sync_at: string;
          sync_status: string;
          error_message: string | null;
        };
        Insert: {
          id?: string;
          device_id: string;
          table_name: string;
          last_sync_at: string;
          sync_status: string;
          error_message?: string | null;
        };
        Update: {
          id?: string;
          device_id?: string;
          table_name?: string;
          last_sync_at?: string;
          sync_status?: string;
          error_message?: string | null;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types for easier access
export type NeuraliftSession = Database['public']['Tables']['neuralift_sessions']['Row'];
export type NeuraliftProgress = Database['public']['Tables']['neuralift_progress']['Row'];
export type NeuraliftSettings = Database['public']['Tables']['neuralift_settings']['Row'];
export type NeuraliftAnalyticsEvent = Database['public']['Tables']['neuralift_analytics_events']['Row'];
export type NeuraliftSyncLog = Database['public']['Tables']['neuralift_sync_log']['Row'];

// Insert types
export type NeuraliftSessionInsert = Database['public']['Tables']['neuralift_sessions']['Insert'];
export type NeuraliftProgressInsert = Database['public']['Tables']['neuralift_progress']['Insert'];
export type NeuraliftSettingsInsert = Database['public']['Tables']['neuralift_settings']['Insert'];
export type NeuraliftAnalyticsEventInsert = Database['public']['Tables']['neuralift_analytics_events']['Insert'];
