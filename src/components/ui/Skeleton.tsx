'use client';

import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
}

export function Skeleton({
  className,
  variant = 'rectangular',
  width,
  height,
}: SkeletonProps) {
  const prefersReducedMotion = useReducedMotion();

  const variantClasses = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      role="presentation"
      aria-hidden="true"
      className={cn(
        'bg-surface-subtle',
        variantClasses[variant],
        !prefersReducedMotion && 'animate-pulse',
        className
      )}
      style={style}
    />
  );
}

// Pre-configured skeleton components for common use cases
export function SkeletonText({ lines = 3, className }: { lines?: number; className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          className={cn(
            'h-4',
            i === lines - 1 && 'w-3/4' // Last line shorter
          )}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('rounded-xl border border-border-subtle p-4 space-y-3', className)}>
      <Skeleton variant="rectangular" className="h-32 w-full" />
      <Skeleton variant="text" className="h-5 w-3/4" />
      <Skeleton variant="text" className="h-4 w-1/2" />
    </div>
  );
}

export function SkeletonAvatar({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return <Skeleton variant="circular" className={sizeClasses[size]} />;
}

export function SkeletonStat({ className }: { className?: string }) {
  return (
    <div className={cn('space-y-2', className)}>
      <Skeleton variant="text" className="h-3 w-16" />
      <Skeleton variant="text" className="h-8 w-24" />
    </div>
  );
}
