'use client';

import { cn } from '@/lib/utils';

interface StatsSummaryProps {
  totalSessions: number;
  totalTime: number;
  averageAccuracy?: number | undefined;
  className?: string;
}

function formatTime(ms: number): string {
  const totalMinutes = Math.floor(ms / 60000);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

export function StatsSummary({
  totalSessions,
  totalTime,
  averageAccuracy,
  className,
}: StatsSummaryProps) {
  return (
    <div className={cn('grid grid-cols-3 gap-4', className)}>
      {/* Total Sessions */}
      <div className="text-center">
        <div className="text-3xl font-bold text-text-primary">{totalSessions}</div>
        <div className="text-sm text-text-secondary">Sessions</div>
      </div>

      {/* Total Time */}
      <div className="text-center">
        <div className="text-3xl font-bold text-text-primary">
          {formatTime(totalTime)}
        </div>
        <div className="text-sm text-text-secondary">Total Time</div>
      </div>

      {/* Average Accuracy */}
      <div className="text-center">
        <div className="text-3xl font-bold text-accent-cyan">
          {averageAccuracy !== undefined ? `${Math.round(averageAccuracy)}%` : '-'}
        </div>
        <div className="text-sm text-text-secondary">Avg Accuracy</div>
      </div>
    </div>
  );
}
