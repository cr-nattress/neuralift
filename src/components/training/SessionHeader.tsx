'use client';

import { cn } from '@/lib/utils';

interface SessionHeaderProps {
  levelName: string;
  current: number;
  total: number;
  onPause: () => void;
  className?: string;
}

export function SessionHeader({
  levelName,
  current,
  total,
  onPause,
  className,
}: SessionHeaderProps) {
  return (
    <header
      className={cn(
        'flex items-center justify-between w-full max-w-md mb-6',
        className
      )}
    >
      {/* Level Info */}
      <div>
        <h1 className="text-lg font-semibold text-text-primary">{levelName}</h1>
        <p className="text-sm text-text-secondary">
          Trial {current} of {total}
        </p>
      </div>

      {/* Pause Button */}
      <button
        onClick={onPause}
        className={cn(
          'flex items-center gap-2 px-4 py-2 rounded-lg',
          'bg-surface-subtle border border-border-subtle',
          'text-text-secondary hover:text-text-primary',
          'hover:bg-surface-hover hover:border-border-hover',
          'transition-colors duration-200',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan'
        )}
        aria-label="Pause session"
      >
        <svg
          className="w-4 h-4"
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path
            fillRule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
        <span className="text-sm">Pause</span>
      </button>
    </header>
  );
}
