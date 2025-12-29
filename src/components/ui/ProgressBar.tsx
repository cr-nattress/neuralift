'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number;
  max: number;
  className?: string;
  showLabel?: boolean;
  color?: 'cyan' | 'magenta' | 'gold';
}

export function ProgressBar({
  value,
  max,
  className,
  showLabel = false,
  color = 'cyan',
}: ProgressBarProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;

  const colorClasses = {
    cyan: 'bg-accent-cyan',
    magenta: 'bg-accent-magenta',
    gold: 'bg-accent-gold',
  };

  return (
    <div className={cn('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-sm text-text-secondary mb-2">
          <span>Progress</span>
          <span>
            {value} / {max}
          </span>
        </div>
      )}

      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={`Progress: ${value} of ${max}`}
        className="h-2 bg-surface-subtle rounded-full overflow-hidden"
      >
        <motion.div
          className={cn('h-full rounded-full', colorClasses[color])}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}
