'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

export function Spinner({ size = 'md', className, label = 'Loading...' }: SpinnerProps) {
  const prefersReducedMotion = useReducedMotion();

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  if (prefersReducedMotion) {
    return (
      <div
        role="status"
        aria-label={label}
        className={cn('flex items-center justify-center', className)}
      >
        <span className="text-text-secondary text-sm">{label}</span>
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-label={label}
      className={cn('flex items-center justify-center', className)}
    >
      <motion.div
        className={cn(
          'rounded-full border-2 border-surface-subtle border-t-accent-cyan',
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}
