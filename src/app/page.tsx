'use client';

import Link from 'next/link';
import { useEffect, useState, useMemo } from 'react';
import { BackgroundOrbs } from '@/components/ui/BackgroundOrbs';
import { Logo } from '@/components/landing/Logo';
import { QuickStartCard } from '@/components/landing/QuickStartCard';
import { LearnMoreCard } from '@/components/landing/LearnMoreCard';
import { JourneyMap } from '@/components/landing/JourneyMap';
import { TodayStats } from '@/components/landing/TodayStats';
import { GuidedTour } from '@/components/help';
import { useProgress } from '@/application/hooks';
import { db, type DBSession } from '@/infrastructure/database';
import { cn } from '@/lib/utils';

function NavIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cn(
        'w-10 h-10 rounded-xl flex items-center justify-center',
        'bg-surface-subtle hover:bg-surface-hover',
        'border border-border-subtle hover:border-border-hover',
        'text-text-secondary hover:text-text-primary',
        'transition-all duration-200',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan'
      )}
      aria-label={label}
    >
      {children}
    </Link>
  );
}

export default function HomePage() {
  const { progress } = useProgress();
  const [todaySessions, setTodaySessions] = useState<DBSession[]>([]);

  // Load today's sessions
  useEffect(() => {
    async function loadTodaySessions() {
      try {
        await db.initialize();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sessions = await db.getSessionsInRange(today, new Date());
        setTodaySessions(sessions.filter((s) => s.completed));
      } catch (error) {
        console.error('[HomePage] Failed to load today sessions:', error);
      }
    }
    void loadTodaySessions();
  }, []);

  // Calculate stats
  const sessionsToday = todaySessions.length;
  const bestAccuracy = useMemo(() => {
    if (todaySessions.length === 0) return 0;
    return Math.round(
      Math.max(...todaySessions.map((s) => s.combinedAccuracy))
    );
  }, [todaySessions]);
  const currentStreak = progress?.currentStreak ?? 0;
  const unlockedLevels = progress?.unlockedLevels ?? [];

  // Calculate current level number from level ID
  const currentLevelNum = useMemo(() => {
    const levelId = progress?.currentLevel ?? 'position-1back';
    const match = levelId.match(/(\d+)/);
    const numStr = match?.[1];
    return numStr ? parseInt(numStr, 10) : 1;
  }, [progress]);

  return (
    <main id="main-content" className="min-h-screen bg-gradient-neural">
      <BackgroundOrbs />
      <GuidedTour />

      <div className="container mx-auto px-4 py-12 flex flex-col items-center relative">
        {/* Navigation Icons */}
        <div className="absolute top-4 right-4 flex gap-2">
          <NavIcon href="/progress" label="View progress">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </NavIcon>
          <NavIcon href="/settings" label="Settings">
            <svg
              className="w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </NavIcon>
        </div>

        {/* Logo Section */}
        <Logo className="mb-12" />

        {/* Action Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-12 w-full max-w-md" data-tour="quick-start">
          <QuickStartCard />
          <LearnMoreCard />
        </div>

        {/* Journey Map */}
        <div data-tour="journey-map">
          <JourneyMap
            className="mb-8 w-full max-w-2xl"
            currentLevel={currentLevelNum}
            unlockedLevels={unlockedLevels.length > 0 ? unlockedLevels.map((_, i) => i + 1) : [1]}
          />
        </div>

        {/* Today's Stats */}
        <div data-tour="today-stats">
          <TodayStats
            className="w-full max-w-lg"
            sessionsToday={sessionsToday}
            bestAccuracy={bestAccuracy}
            currentStreak={currentStreak}
          />
        </div>
      </div>
    </main>
  );
}
