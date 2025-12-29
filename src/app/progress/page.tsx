'use client';

import { useEffect, useState, useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui';
import { BackButton } from '@/components/layout';
import { HelpTrigger } from '@/components/help';
import {
  StreakDisplay,
  StatsSummary,
  AccuracyChart,
  SessionHistory,
} from '@/components/progress';
import { useProgress } from '@/application/hooks';
import { db, type DBSession } from '@/infrastructure/database';

/**
 * Loading skeleton for progress page
 */
function ProgressLoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-8">
            <Skeleton className="h-20 w-20 rounded-full" />
            <Skeleton className="h-20 w-20 rounded-full" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-24" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-32" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-40 w-full" />
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <Skeleton className="h-6 w-36" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function ProgressPage() {
  const { progress, loading: progressLoading } = useProgress();
  const [sessions, setSessions] = useState<DBSession[]>([]);
  const [sessionsLoading, setSessionsLoading] = useState(true);

  // Load sessions from database
  useEffect(() => {
    async function loadSessions() {
      try {
        setSessionsLoading(true);
        await db.initialize();
        const recentSessions = await db.sessions
          .orderBy('timestamp')
          .reverse()
          .limit(20)
          .toArray();
        setSessions(recentSessions);
      } catch (error) {
        console.error('[ProgressPage] Failed to load sessions:', error);
      } finally {
        setSessionsLoading(false);
      }
    }

    void loadSessions();
  }, []);

  // Calculate average accuracy from sessions
  const averageAccuracy = useMemo(() => {
    if (sessions.length === 0) return undefined;
    const total = sessions.reduce((sum, s) => sum + s.combinedAccuracy, 0);
    return total / sessions.length;
  }, [sessions]);

  const loading = progressLoading || sessionsLoading;

  return (
    <main id="main-content" className="min-h-screen p-6 pb-20">
      <div className="max-w-4xl mx-auto">
        <BackButton href="/" className="mb-6" />

        <h1 className="text-3xl font-bold text-text-primary mb-2">
          Your Progress
        </h1>
        <p className="text-text-secondary mb-8">
          Track your cognitive training journey
        </p>

        {loading ? (
          <ProgressLoadingSkeleton />
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {/* Streak Display */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Streak</CardTitle>
                  <HelpTrigger contentKey="streak" />
                </div>
              </CardHeader>
              <CardContent>
                <StreakDisplay
                  current={progress?.currentStreak ?? 0}
                  longest={progress?.longestStreak ?? 0}
                />
              </CardContent>
            </Card>

            {/* Stats Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Summary</CardTitle>
              </CardHeader>
              <CardContent>
                <StatsSummary
                  totalSessions={progress?.totalSessions ?? 0}
                  totalTime={progress?.totalTime ?? 0}
                  averageAccuracy={averageAccuracy}
                />
              </CardContent>
            </Card>

            {/* Accuracy Chart */}
            <Card className="md:col-span-2">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <CardTitle>Accuracy Trend</CardTitle>
                  <HelpTrigger contentKey="result-accuracy" />
                </div>
              </CardHeader>
              <CardContent>
                <AccuracyChart sessions={sessions} />
              </CardContent>
            </Card>

            {/* Session History */}
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Recent Sessions</CardTitle>
              </CardHeader>
              <CardContent>
                <SessionHistory sessions={sessions} />
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </main>
  );
}
