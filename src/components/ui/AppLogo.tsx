'use client';

/**
 * App Logo
 *
 * Shared logo component used in headers and navigation.
 */

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-lg',
  lg: 'w-12 h-12 text-xl',
};

export function AppLogo({ size = 'sm', showText = false, className }: AppLogoProps) {
  return (
    <Link href="/" aria-label="Home" className={cn('flex items-center gap-3', className)}>
      <div
        className={cn(
          'rounded-lg bg-accent-cyan flex items-center justify-center',
          sizeClasses[size]
        )}
      >
        <span className="text-bg-primary font-bold">N</span>
      </div>
      {showText && (
        <span className="text-xl font-semibold text-text-primary">Neuralift</span>
      )}
    </Link>
  );
}
