'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { LevelConfig } from '@neuralift/core';

interface LevelCardProps {
  level: LevelConfig;
  locked?: boolean;
  complete?: boolean;
  recommended?: boolean;
  bestAccuracy?: number;
  className?: string;
}

export function LevelCard({
  level,
  locked = false,
  complete = false,
  recommended = false,
  bestAccuracy,
  className,
}: LevelCardProps) {
  const getModeColor = (mode: string) => {
    if (mode.includes('position')) return 'cyan';
    if (mode.includes('audio')) return 'magenta';
    return 'gold';
  };

  const modeColor = getModeColor(level.mode);

  const colorClasses = {
    cyan: {
      bg: 'bg-accent-cyan/10',
      border: 'border-accent-cyan/30',
      text: 'text-accent-cyan',
      glow: 'shadow-glow-cyan',
    },
    magenta: {
      bg: 'bg-accent-magenta/10',
      border: 'border-accent-magenta/30',
      text: 'text-accent-magenta',
      glow: 'shadow-glow-magenta',
    },
    gold: {
      bg: 'bg-accent-gold/10',
      border: 'border-accent-gold/30',
      text: 'text-accent-gold',
      glow: 'shadow-[0_0_20px_-5px_var(--accent-gold)]',
    },
  };

  const colors = colorClasses[modeColor];

  const content = (
    <Card
      variant={locked ? 'default' : 'interactive'}
      padding="md"
      glow={recommended && !locked ? modeColor as 'cyan' | 'magenta' : 'none'}
      className={cn(
        'relative h-full',
        locked && 'opacity-50 cursor-not-allowed',
        !locked && 'hover:scale-[1.02]',
        className
      )}
    >
      <CardContent className="flex flex-col h-full">
        {/* N-Back Level Badge */}
        <div
          className={cn(
            'w-12 h-12 rounded-xl flex items-center justify-center mb-3',
            'font-bold text-lg',
            colors.bg,
            colors.text
          )}
        >
          {level.nBack}
        </div>

        {/* Level Name */}
        <h3 className="font-semibold text-text-primary mb-1">{level.name}</h3>

        {/* Description */}
        <p className="text-text-tertiary text-sm flex-1">{level.description}</p>

        {/* Status Indicators */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border-subtle">
          {complete ? (
            <div className="flex items-center gap-1.5 text-success text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Complete</span>
            </div>
          ) : locked ? (
            <div className="flex items-center gap-1.5 text-text-muted text-sm">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span>Locked</span>
            </div>
          ) : recommended ? (
            <div className={cn('flex items-center gap-1.5 text-sm', colors.text)}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span>Recommended</span>
            </div>
          ) : (
            <span className="text-text-tertiary text-sm">Ready to train</span>
          )}

          {bestAccuracy !== undefined && bestAccuracy > 0 && (
            <span className="text-text-secondary text-sm font-medium">
              {bestAccuracy}%
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );

  if (locked) {
    return content;
  }

  return (
    <Link href={`/train/${level.id}`} className="block h-full">
      {content}
    </Link>
  );
}
