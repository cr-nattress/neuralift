# Story 01-009: Setup Supabase Project

## Story

**As a** developer
**I want** Supabase configured for the project
**So that** we have cloud database, auth, and real-time capabilities

## Points: 5

## Priority: Critical

## Status: TODO

## Description

Create and configure a Supabase project with the database schema, Row Level Security policies, and client configuration for both browser and server usage.

## Acceptance Criteria

- [ ] Supabase project created
- [ ] Database schema created with all tables
- [ ] Row Level Security (RLS) policies configured
- [ ] Supabase client configured for browser
- [ ] Supabase client configured for server (API routes)
- [ ] Types generated from database schema

## Technical Details

### Database Schema

```sql
-- Users table (extends Supabase auth.users)
CREATE TABLE public.profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  current_level TEXT DEFAULT 'position-1back',
  total_sessions INTEGER DEFAULT 0,
  total_time INTEGER DEFAULT 0,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_session_date DATE
);

-- Sessions table
CREATE TABLE public.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL,
  mode TEXT NOT NULL,
  n_back INTEGER NOT NULL,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  duration INTEGER NOT NULL,
  trials JSONB NOT NULL,
  position_stats JSONB NOT NULL,
  audio_stats JSONB NOT NULL,
  combined_accuracy NUMERIC(5,4) NOT NULL,
  completed BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Unlocked levels table
CREATE TABLE public.unlocked_levels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  level_id TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, level_id)
);

-- Analytics events table
CREATE TABLE public.analytics_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  session_id UUID REFERENCES public.sessions(id) ON DELETE SET NULL,
  type TEXT NOT NULL,
  category TEXT NOT NULL,
  payload JSONB,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings table
CREATE TABLE public.settings (
  user_id UUID REFERENCES public.profiles(id) PRIMARY KEY,
  trial_duration INTEGER DEFAULT 3000,
  session_length INTEGER DEFAULT 20,
  adaptive_mode BOOLEAN DEFAULT false,
  show_history_helper BOOLEAN DEFAULT true,
  show_briefing BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  volume INTEGER DEFAULT 80,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_sessions_user_id ON public.sessions(user_id);
CREATE INDEX idx_sessions_timestamp ON public.sessions(timestamp);
CREATE INDEX idx_analytics_user_id ON public.analytics_events(user_id);
CREATE INDEX idx_analytics_timestamp ON public.analytics_events(timestamp);
```

### Row Level Security Policies

```sql
-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.unlocked_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- Sessions: Users can only access their own sessions
CREATE POLICY "Users can view own sessions"
  ON public.sessions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own sessions"
  ON public.sessions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Similar policies for other tables...
```

### Supabase Client Setup

```typescript
// src/infrastructure/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import type { Database } from './types';

export function createClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// src/infrastructure/supabase/server.ts
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './types';

export function createServerSupabaseClient() {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          cookieStore.set({ name, value, ...options });
        },
        remove(name: string, options: CookieOptions) {
          cookieStore.set({ name, value: '', ...options });
        },
      },
    }
  );
}
```

### Type Generation

```bash
# Generate types from Supabase schema
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/infrastructure/supabase/types.ts
```

## Tasks

- [ ] Create Supabase project at supabase.com
- [ ] Run database schema SQL
- [ ] Configure RLS policies
- [ ] Install @supabase/ssr package
- [ ] Create browser client (src/infrastructure/supabase/client.ts)
- [ ] Create server client (src/infrastructure/supabase/server.ts)
- [ ] Generate TypeScript types
- [ ] Test connection from app
- [ ] Create profile trigger for new users

## Dependencies

- Story 01-001 (Initialize Project)

## Notes

- Use @supabase/ssr for Next.js App Router compatibility
- RLS ensures users can only access their own data
- JSONB columns store complex nested data (trials, stats)
- Supabase handles auth.users, we extend with profiles table
