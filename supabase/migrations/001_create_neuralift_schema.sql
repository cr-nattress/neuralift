-- ============================================================================
-- Neuralift Database Schema
-- ============================================================================
-- This migration creates all tables for the Neuralift Dual N-Back Training app.
-- All tables are prefixed with 'neuralift_' to avoid conflicts with other apps
-- sharing the same Supabase project.
--
-- Run this migration in your Supabase SQL Editor or via Supabase CLI.
-- ============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================================
-- SESSIONS TABLE
-- Stores completed training session data
-- ============================================================================
CREATE TABLE IF NOT EXISTS neuralift_sessions (
  session_id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL,
  mode TEXT NOT NULL CHECK (mode IN ('single-position', 'single-audio', 'dual')),
  n_back INTEGER NOT NULL CHECK (n_back >= 1 AND n_back <= 9),
  timestamp TIMESTAMPTZ NOT NULL,
  duration INTEGER NOT NULL CHECK (duration >= 0),
  trials JSONB NOT NULL DEFAULT '[]',
  position_stats JSONB NOT NULL DEFAULT '{}',
  audio_stats JSONB NOT NULL DEFAULT '{}',
  combined_accuracy REAL NOT NULL CHECK (combined_accuracy >= 0 AND combined_accuracy <= 100),
  completed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying sessions by user and timestamp
CREATE INDEX IF NOT EXISTS idx_neuralift_sessions_user_timestamp
  ON neuralift_sessions(user_id, timestamp DESC);

-- Index for querying sessions by level
CREATE INDEX IF NOT EXISTS idx_neuralift_sessions_level
  ON neuralift_sessions(level_id);

-- ============================================================================
-- PROGRESS TABLE
-- Stores user progress (streaks, unlocked levels, etc.)
-- Uses device_id for anonymous users, user_id for authenticated users
-- ============================================================================
CREATE TABLE IF NOT EXISTS neuralift_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  current_level TEXT NOT NULL DEFAULT 'position-1back',
  unlocked_levels TEXT[] NOT NULL DEFAULT ARRAY['position-1back', 'audio-1back'],
  total_sessions INTEGER NOT NULL DEFAULT 0 CHECK (total_sessions >= 0),
  total_time INTEGER NOT NULL DEFAULT 0 CHECK (total_time >= 0),
  current_streak INTEGER NOT NULL DEFAULT 0 CHECK (current_streak >= 0),
  longest_streak INTEGER NOT NULL DEFAULT 0 CHECK (longest_streak >= 0),
  last_session_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure unique progress per device (for anonymous) or per user
  CONSTRAINT unique_progress_per_device UNIQUE (device_id)
);

-- Index for looking up progress by user
CREATE INDEX IF NOT EXISTS idx_neuralift_progress_user
  ON neuralift_progress(user_id);

-- ============================================================================
-- SETTINGS TABLE
-- Stores user preferences and settings
-- ============================================================================
CREATE TABLE IF NOT EXISTS neuralift_settings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  trial_duration INTEGER NOT NULL DEFAULT 3000 CHECK (trial_duration >= 1000 AND trial_duration <= 10000),
  session_length INTEGER NOT NULL DEFAULT 20 CHECK (session_length >= 10 AND session_length <= 50),
  adaptive_mode BOOLEAN NOT NULL DEFAULT false,
  show_history_helper BOOLEAN NOT NULL DEFAULT true,
  show_briefing BOOLEAN NOT NULL DEFAULT true,
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  volume INTEGER NOT NULL DEFAULT 80 CHECK (volume >= 0 AND volume <= 100),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  -- Ensure unique settings per device
  CONSTRAINT unique_settings_per_device UNIQUE (device_id)
);

-- Index for looking up settings by user
CREATE INDEX IF NOT EXISTS idx_neuralift_settings_user
  ON neuralift_settings(user_id);

-- ============================================================================
-- ANALYTICS EVENTS TABLE
-- Stores user behavior and training analytics
-- ============================================================================
CREATE TABLE IF NOT EXISTS neuralift_analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  device_id TEXT NOT NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  session_id TEXT REFERENCES neuralift_sessions(session_id) ON DELETE SET NULL,
  timestamp TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for querying events by type and timestamp
CREATE INDEX IF NOT EXISTS idx_neuralift_analytics_type_timestamp
  ON neuralift_analytics_events(type, timestamp DESC);

-- Index for querying events by session
CREATE INDEX IF NOT EXISTS idx_neuralift_analytics_session
  ON neuralift_analytics_events(session_id);

-- ============================================================================
-- SYNC LOG TABLE
-- Tracks synchronization status between local and cloud
-- ============================================================================
CREATE TABLE IF NOT EXISTS neuralift_sync_log (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  device_id TEXT NOT NULL,
  table_name TEXT NOT NULL,
  last_sync_at TIMESTAMPTZ NOT NULL,
  sync_status TEXT NOT NULL CHECK (sync_status IN ('success', 'failed', 'pending')),
  error_message TEXT,

  -- One sync log entry per device per table
  CONSTRAINT unique_sync_log UNIQUE (device_id, table_name)
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE neuralift_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuralift_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuralift_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuralift_analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE neuralift_sync_log ENABLE ROW LEVEL SECURITY;

-- Sessions policies
CREATE POLICY "Users can read own sessions" ON neuralift_sessions
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own sessions" ON neuralift_sessions
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own sessions" ON neuralift_sessions
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Progress policies
CREATE POLICY "Users can read own progress" ON neuralift_progress
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own progress" ON neuralift_progress
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own progress" ON neuralift_progress
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Settings policies
CREATE POLICY "Users can read own settings" ON neuralift_settings
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own settings" ON neuralift_settings
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own settings" ON neuralift_settings
  FOR UPDATE USING (auth.uid() = user_id OR user_id IS NULL);

-- Analytics policies
CREATE POLICY "Users can read own analytics" ON neuralift_analytics_events
  FOR SELECT USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own analytics" ON neuralift_analytics_events
  FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Sync log policies
CREATE POLICY "Devices can manage own sync logs" ON neuralift_sync_log
  FOR ALL USING (true);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION neuralift_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER neuralift_sessions_updated_at
  BEFORE UPDATE ON neuralift_sessions
  FOR EACH ROW EXECUTE FUNCTION neuralift_update_updated_at();

CREATE TRIGGER neuralift_progress_updated_at
  BEFORE UPDATE ON neuralift_progress
  FOR EACH ROW EXECUTE FUNCTION neuralift_update_updated_at();

CREATE TRIGGER neuralift_settings_updated_at
  BEFORE UPDATE ON neuralift_settings
  FOR EACH ROW EXECUTE FUNCTION neuralift_update_updated_at();

-- ============================================================================
-- DONE
-- ============================================================================
-- To apply this migration:
-- 1. Go to your Supabase Dashboard > SQL Editor
-- 2. Paste this entire file and run it
-- Or use the Supabase CLI: supabase db push
-- ============================================================================
