'use client';

import { cn } from '@/lib/utils';

interface StreakDisplayProps {
  current: number;
  longest: number;
  className?: string;
}

export function StreakDisplay({ current, longest, className }: StreakDisplayProps) {
  const isActive = current > 0;

  return (
    <div className={cn('flex items-center gap-8', className)}>
      {/* Current Streak */}
      <div className="flex flex-col items-center">
        <div
          className={cn(
            'text-5xl font-bold mb-2',
            isActive ? 'text-accent-gold' : 'text-text-tertiary'
          )}
        >
          {current}
        </div>
        <div className="flex items-center gap-2">
          <span className={cn('text-2xl', isActive && 'animate-pulse')}>
            {isActive ? String.fromCodePoint(0x1f525) : String.fromCodePoint(0x1f9ca)}
          </span>
          <span className="text-sm text-text-secondary">Current</span>
        </div>
      </div>

      {/* Divider */}
      <div className="h-16 w-px bg-border-subtle" />

      {/* Longest Streak */}
      <div className="flex flex-col items-center">
        <div className="text-5xl font-bold text-text-primary mb-2">{longest}</div>
        <div className="flex items-center gap-2">
          <span className="text-2xl">{String.fromCodePoint(0x1f3c6)}</span>
          <span className="text-sm text-text-secondary">Best</span>
        </div>
      </div>
    </div>
  );
}
