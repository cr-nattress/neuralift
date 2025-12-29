# Story 03-013: Implement Supabase Repositories

## Story

**As a** developer
**I want** Supabase repository implementations
**So that** user data persists to the cloud and syncs across devices

## Points: 8

## Priority: Critical

## Status: TODO

## Description

Implement Supabase-backed versions of all repository interfaces that persist data to PostgreSQL for cloud backup and cross-device synchronization.

## Acceptance Criteria

- [ ] SupabaseSessionRepository implemented
- [ ] SupabaseProgressRepository implemented
- [ ] SupabaseAnalyticsRepository implemented
- [ ] SupabaseSettingsRepository implemented
- [ ] All repositories use typed Supabase client
- [ ] Error handling with fallback to local

## Technical Details

### SupabaseSessionRepository

```typescript
// src/infrastructure/repositories/SupabaseSessionRepository.ts
import { createClient } from '@/infrastructure/supabase/client';
import type { ISessionRepository, SessionResult } from '@neuralift/core';
import type { Database } from '@/infrastructure/supabase/types';

type SessionRow = Database['public']['Tables']['sessions']['Row'];
type SessionInsert = Database['public']['Tables']['sessions']['Insert'];

export class SupabaseSessionRepository implements ISessionRepository {
  private supabase = createClient();

  private toRow(session: SessionResult, userId: string): SessionInsert {
    return {
      id: session.sessionId,
      user_id: userId,
      level_id: session.levelId,
      mode: session.mode,
      n_back: session.nBack,
      timestamp: session.timestamp.toISOString(),
      duration: session.duration,
      trials: session.trials,
      position_stats: session.positionStats,
      audio_stats: session.audioStats,
      combined_accuracy: session.combinedAccuracy,
      completed: session.completed,
    };
  }

  private fromRow(row: SessionRow): SessionResult {
    return {
      sessionId: row.id,
      levelId: row.level_id,
      mode: row.mode as any,
      nBack: row.n_back as any,
      timestamp: new Date(row.timestamp),
      duration: row.duration,
      trials: row.trials as any,
      positionStats: row.position_stats as any,
      audioStats: row.audio_stats as any,
      combinedAccuracy: Number(row.combined_accuracy),
      completed: row.completed,
    };
  }

  async save(session: SessionResult): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await this.supabase
      .from('sessions')
      .upsert(this.toRow(session, user.id));

    if (error) throw error;
  }

  async findById(sessionId: string): Promise<SessionResult | null> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('id', sessionId)
      .single();

    if (error || !data) return null;
    return this.fromRow(data);
  }

  async findByLevel(levelId: string): Promise<SessionResult[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .eq('level_id', levelId)
      .order('timestamp', { ascending: false });

    if (error || !data) return [];
    return data.map(this.fromRow);
  }

  async findRecent(limit: number): Promise<SessionResult[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    if (error || !data) return [];
    return data.map(this.fromRow);
  }

  async findByDateRange(start: Date, end: Date): Promise<SessionResult[]> {
    const { data, error } = await this.supabase
      .from('sessions')
      .select('*')
      .gte('timestamp', start.toISOString())
      .lte('timestamp', end.toISOString())
      .order('timestamp', { ascending: false });

    if (error || !data) return [];
    return data.map(this.fromRow);
  }

  async count(): Promise<number> {
    const { count, error } = await this.supabase
      .from('sessions')
      .select('*', { count: 'exact', head: true });

    if (error) return 0;
    return count ?? 0;
  }

  async clear(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await this.supabase
      .from('sessions')
      .delete()
      .eq('user_id', user.id);
  }
}
```

### SupabaseProgressRepository

```typescript
// src/infrastructure/repositories/SupabaseProgressRepository.ts
export class SupabaseProgressRepository implements IProgressRepository {
  private supabase = createClient();

  async get(): Promise<UserProgress> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Get profile
    const { data: profile } = await this.supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get unlocked levels
    const { data: levels } = await this.supabase
      .from('unlocked_levels')
      .select('level_id')
      .eq('user_id', user.id);

    return {
      currentLevel: profile?.current_level ?? 'position-1back',
      unlockedLevels: levels?.map(l => l.level_id) ?? ['position-1back', 'audio-1back'],
      totalSessions: profile?.total_sessions ?? 0,
      totalTime: profile?.total_time ?? 0,
      currentStreak: profile?.current_streak ?? 0,
      longestStreak: profile?.longest_streak ?? 0,
      lastSessionDate: profile?.last_session_date
        ? new Date(profile.last_session_date)
        : null,
    };
  }

  async save(progress: UserProgress): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    // Update profile
    await this.supabase
      .from('profiles')
      .upsert({
        id: user.id,
        current_level: progress.currentLevel,
        total_sessions: progress.totalSessions,
        total_time: progress.totalTime,
        current_streak: progress.currentStreak,
        longest_streak: progress.longestStreak,
        last_session_date: progress.lastSessionDate?.toISOString().split('T')[0],
        updated_at: new Date().toISOString(),
      });

    // Sync unlocked levels
    for (const levelId of progress.unlockedLevels) {
      await this.supabase
        .from('unlocked_levels')
        .upsert({
          user_id: user.id,
          level_id: levelId,
        }, {
          onConflict: 'user_id,level_id',
        });
    }
  }

  async reset(): Promise<void> {
    const { data: { user } } = await this.supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    await this.supabase
      .from('profiles')
      .update({
        current_level: 'position-1back',
        total_sessions: 0,
        total_time: 0,
        current_streak: 0,
        longest_streak: 0,
        last_session_date: null,
      })
      .eq('id', user.id);

    await this.supabase
      .from('unlocked_levels')
      .delete()
      .eq('user_id', user.id);

    // Re-add initial levels
    await this.supabase
      .from('unlocked_levels')
      .insert([
        { user_id: user.id, level_id: 'position-1back' },
        { user_id: user.id, level_id: 'audio-1back' },
      ]);
  }
}
```

## Tasks

- [ ] Create SupabaseSessionRepository
- [ ] Create SupabaseProgressRepository
- [ ] Create SupabaseAnalyticsRepository
- [ ] Create SupabaseSettingsRepository
- [ ] Add error handling with logging
- [ ] Test with authenticated user
- [ ] Test RLS policies work correctly
- [ ] Export from infrastructure index

## Dependencies

- Story 01-009 (Supabase Setup)
- Story 01-005 (Port Interfaces)

## Notes

- All queries are automatically filtered by RLS
- JSONB columns handle complex nested data
- Use upsert for idempotent writes
- Authentication required for all operations
