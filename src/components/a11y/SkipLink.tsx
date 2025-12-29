'use client';

/**
 * SkipLink Component
 *
 * Provides a skip link for keyboard users to bypass navigation
 * and jump directly to main content.
 */

import { cn } from '@/lib/utils';

interface SkipLinkProps {
  href?: string;
  children?: React.ReactNode;
}

export function SkipLink({
  href = '#main-content',
  children = 'Skip to main content'
}: SkipLinkProps) {
  return (
    <a
      href={href}
      className={cn(
        'absolute left-4 top-4 z-[9999]',
        'px-4 py-2 rounded-lg',
        'bg-accent-cyan text-bg-primary font-medium',
        'transform -translate-y-full',
        'focus:translate-y-0',
        'transition-transform duration-200',
        'focus:outline-none focus:ring-2 focus:ring-accent-cyan focus:ring-offset-2 focus:ring-offset-bg-primary'
      )}
    >
      {children}
    </a>
  );
}
