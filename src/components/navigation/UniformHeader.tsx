'use client';

/**
 * Uniform Header
 *
 * A consistent header across all pages and breakpoints.
 * Contains only the app icon and name, left-aligned.
 */

import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface UniformHeaderProps {
  className?: string;
}

export function UniformHeader({ className }: UniformHeaderProps) {
  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -56, opacity: 0 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-14 px-4',
        'flex items-center',
        'bg-bg-primary/80 backdrop-blur-lg',
        'border-b border-border-subtle',
        // Safe area for iOS notch
        'pt-[env(safe-area-inset-top)]',
        className
      )}
    >
      <Link
        href="/"
        className="flex items-center gap-3 hover:opacity-80 transition-opacity"
        aria-label="Neuralift Home"
      >
        {/* App Icon */}
        <div className="w-8 h-8 rounded-lg bg-accent-cyan flex items-center justify-center flex-shrink-0">
          <span className="text-bg-primary font-bold text-sm">N</span>
        </div>

        {/* App Name */}
        <span className="text-lg font-semibold text-text-primary">
          Neuralift
        </span>
      </Link>
    </motion.header>
  );
}
