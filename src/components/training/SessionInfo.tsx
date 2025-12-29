'use client';

import { cn } from '@/lib/utils';

interface SessionInfoProps {
  trialCount?: number;
  trialDurationMs?: number;
  className?: string;
}

export function SessionInfo({
  trialCount = 20,
  trialDurationMs = 3000,
  className,
}: SessionInfoProps) {
  const sessionDurationMinutes = Math.round((trialCount * trialDurationMs) / 1000 / 60);

  return (
    <div className={cn('space-y-3', className)}>
      <h3 className="font-semibold text-text-primary">Session Parameters</h3>

      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-surface-subtle text-center">
          <p className="text-2xl font-bold text-text-primary">{trialCount}</p>
          <p className="text-text-tertiary text-sm">Trials</p>
        </div>

        <div className="p-3 rounded-lg bg-surface-subtle text-center">
          <p className="text-2xl font-bold text-text-primary">
            ~{sessionDurationMinutes}
          </p>
          <p className="text-text-tertiary text-sm">Minutes</p>
        </div>
      </div>

      <p className="text-text-secondary text-sm">
        Each trial lasts {trialDurationMs / 1000} seconds. You can pause at any
        time by pressing <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border-subtle font-mono text-xs">Esc</kbd>.
      </p>
    </div>
  );
}
