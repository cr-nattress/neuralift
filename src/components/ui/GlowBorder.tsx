'use client';

import { cn } from '@/lib/utils';

interface GlowBorderProps extends React.HTMLAttributes<HTMLDivElement> {
  color?: 'cyan' | 'magenta' | 'gold';
  intensity?: 'low' | 'medium' | 'high';
  animated?: boolean;
}

export function GlowBorder({
  className,
  color = 'cyan',
  intensity = 'medium',
  animated = false,
  children,
  ...props
}: GlowBorderProps) {
  const colorClasses = {
    cyan: 'border-accent-cyan shadow-glow-cyan',
    magenta: 'border-accent-magenta shadow-glow-magenta',
    gold: 'border-accent-gold',
  };

  const intensityClasses = {
    low: 'border opacity-50',
    medium: 'border-2',
    high: 'border-2 shadow-lg',
  };

  return (
    <div
      className={cn(
        'rounded-2xl',
        colorClasses[color],
        intensityClasses[intensity],
        animated && 'animate-pulse-glow',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
