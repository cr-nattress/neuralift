'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatComparisonProps {
  positionAccuracy: number;
  audioAccuracy: number;
  className?: string;
}

export function StatComparison({
  positionAccuracy,
  audioAccuracy,
  className,
}: StatComparisonProps) {
  return (
    <div className={cn('flex gap-6 sm:gap-8', className)}>
      {/* Position */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="w-16 h-16 rounded-xl bg-accent-cyan/10 flex items-center justify-center mb-2">
          <svg
            className="w-8 h-8 text-accent-cyan"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-text-primary">
          {Math.round(positionAccuracy)}%
        </span>
        <span className="text-sm text-text-secondary">Position</span>
      </motion.div>

      {/* Divider */}
      <div className="w-px bg-border-subtle self-stretch" />

      {/* Audio */}
      <motion.div
        className="flex flex-col items-center"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="w-16 h-16 rounded-xl bg-accent-magenta/10 flex items-center justify-center mb-2">
          <svg
            className="w-8 h-8 text-accent-magenta"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <span className="text-2xl font-bold text-text-primary">
          {Math.round(audioAccuracy)}%
        </span>
        <span className="text-sm text-text-secondary">Audio</span>
      </motion.div>
    </div>
  );
}
