'use client';

/**
 * Navigation Item
 *
 * Shared navigation item component used in bottom navigation and headers.
 * Supports different variants for different contexts.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavItemProps {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
  variant?: 'bottom' | 'header';
  className?: string;
}

export function NavItem({
  href,
  label,
  icon,
  active = false,
  variant = 'bottom',
  className,
}: NavItemProps) {
  if (variant === 'bottom') {
    return (
      <Link
        href={href}
        className={cn(
          'flex flex-col items-center justify-center',
          'min-w-[64px] h-12 px-3 rounded-xl',
          'transition-all duration-200',
          'active:scale-95',
          active
            ? 'text-accent-cyan'
            : 'text-text-muted hover:text-text-secondary',
          className
        )}
        aria-current={active ? 'page' : undefined}
      >
        <motion.div
          className="relative flex items-center justify-center"
          whileTap={{ scale: 0.9 }}
        >
          {/* Active background indicator */}
          {active && (
            <motion.div
              className="absolute -inset-2 bg-accent-cyan/10 rounded-xl"
              layoutId="bottom-nav-active"
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            />
          )}
          <div className="w-6 h-6 relative z-10">{icon}</div>
        </motion.div>
        <span
          className={cn(
            'text-xs mt-1 transition-all duration-200',
            active ? 'font-medium text-accent-cyan' : 'font-normal text-text-muted'
          )}
        >
          {label}
        </span>
      </Link>
    );
  }

  // Header variant
  return (
    <Link
      href={href}
      className={cn(
        'relative flex items-center gap-2 px-4 py-2 rounded-xl',
        'text-sm font-medium transition-all duration-200',
        active
          ? 'text-accent-cyan'
          : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
        className
      )}
      aria-current={active ? 'page' : undefined}
    >
      {active && (
        <motion.div
          className="absolute inset-0 bg-accent-cyan/10 rounded-xl"
          layoutId="header-nav-active"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
      <span className="relative z-10">{label}</span>
    </Link>
  );
}
