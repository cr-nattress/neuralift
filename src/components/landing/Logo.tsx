'use client';

import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function Logo({ className, size = 'lg' }: LogoProps) {
  const reducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-5xl sm:text-6xl',
  };

  const iconSizes = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16 sm:w-20 sm:h-20',
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center gap-4',
        !reducedMotion && 'animate-fade-in',
        className
      )}
    >
      {/* Neural Network Icon */}
      <div
        className={cn(
          'relative',
          iconSizes[size],
          !reducedMotion && 'animate-pulse-glow'
        )}
      >
        <svg
          viewBox="0 0 80 80"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          {/* Outer ring */}
          <circle
            cx="40"
            cy="40"
            r="36"
            stroke="url(#gradient-ring)"
            strokeWidth="2"
            opacity="0.3"
          />

          {/* Neural nodes */}
          <circle cx="40" cy="20" r="5" fill="var(--accent-cyan)" />
          <circle cx="20" cy="50" r="5" fill="var(--accent-magenta)" />
          <circle cx="60" cy="50" r="5" fill="var(--accent-cyan)" />
          <circle cx="40" cy="40" r="8" fill="var(--accent-cyan)" />

          {/* Connections */}
          <line
            x1="40"
            y1="20"
            x2="40"
            y2="32"
            stroke="var(--accent-cyan)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="20"
            y1="50"
            x2="32"
            y2="40"
            stroke="var(--accent-magenta)"
            strokeWidth="2"
            opacity="0.6"
          />
          <line
            x1="60"
            y1="50"
            x2="48"
            y2="40"
            stroke="var(--accent-cyan)"
            strokeWidth="2"
            opacity="0.6"
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient-ring" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--accent-cyan)" />
              <stop offset="100%" stopColor="var(--accent-magenta)" />
            </linearGradient>
          </defs>
        </svg>

        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-accent-cyan/20 blur-xl rounded-full" />
      </div>

      {/* Logo Text */}
      <div className="flex flex-col items-center">
        <h1
          className={cn(
            'font-bold tracking-tight',
            'bg-gradient-to-r from-accent-cyan via-text-primary to-accent-magenta',
            'bg-clip-text text-transparent',
            sizeClasses[size]
          )}
        >
          Neuralift
        </h1>
        <p className="text-text-secondary text-sm sm:text-base mt-1">
          Dual N-Back Training
        </p>
      </div>
    </div>
  );
}
