'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface TodayStatsProps {
  className?: string;
  sessionsToday?: number;
  bestAccuracy?: number;
  currentStreak?: number;
}

interface StatItemProps {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  accentColor: 'cyan' | 'magenta' | 'gold';
}

function StatItem({ label, value, icon, accentColor }: StatItemProps) {
  const colorClasses = {
    cyan: 'text-accent-cyan bg-accent-cyan/10',
    magenta: 'text-accent-magenta bg-accent-magenta/10',
    gold: 'text-accent-gold bg-accent-gold/10',
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center',
          colorClasses[accentColor]
        )}
      >
        {icon}
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-text-primary">{value}</p>
        <p className="text-xs text-text-tertiary">{label}</p>
      </div>
    </div>
  );
}

export function TodayStats({
  className,
  sessionsToday = 0,
  bestAccuracy = 0,
  currentStreak = 0,
}: TodayStatsProps) {
  return (
    <Card variant="default" padding="md" className={className}>
      <CardHeader>
        <CardTitle className="text-center text-base">Today&apos;s Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-around">
          {/* Sessions */}
          <StatItem
            label="Sessions"
            value={sessionsToday}
            accentColor="cyan"
            icon={
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
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            }
          />

          {/* Best Score */}
          <StatItem
            label="Best Score"
            value={`${bestAccuracy}%`}
            accentColor="magenta"
            icon={
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
                  d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                />
              </svg>
            }
          />

          {/* Streak */}
          <StatItem
            label="Day Streak"
            value={currentStreak}
            accentColor="gold"
            icon={
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
                  d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9.879 16.121A3 3 0 1012.015 11L11 14H9c0 .768.293 1.536.879 2.121z"
                />
              </svg>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}
