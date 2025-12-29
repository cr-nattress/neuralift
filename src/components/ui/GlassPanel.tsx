'use client';

import { cn } from '@/lib/utils';

interface GlassPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  blur?: 'sm' | 'md' | 'lg';
  opacity?: 'low' | 'medium' | 'high';
}

export function GlassPanel({
  className,
  blur = 'md',
  opacity = 'medium',
  children,
  ...props
}: GlassPanelProps) {
  const blurClasses = {
    sm: 'backdrop-blur-sm',
    md: 'backdrop-blur-md',
    lg: 'backdrop-blur-lg',
  };

  const opacityClasses = {
    low: 'bg-white/[0.02]',
    medium: 'bg-white/[0.04]',
    high: 'bg-white/[0.08]',
  };

  return (
    <div
      className={cn(
        'rounded-2xl border border-white/[0.06]',
        blurClasses[blur],
        opacityClasses[opacity],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
