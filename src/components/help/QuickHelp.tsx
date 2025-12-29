'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface QuickHelpProps {
  nBack: number;
  mode: 'single-position' | 'single-audio' | 'dual';
  className?: string;
}

export function QuickHelp({ nBack, mode, className }: QuickHelpProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const showPosition = mode === 'single-position' || mode === 'dual';
  const showAudio = mode === 'single-audio' || mode === 'dual';

  return (
    <div className={cn('relative', className)}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={cn(
          'flex items-center gap-2 px-3 py-1.5 rounded-lg',
          'text-sm text-text-secondary',
          'bg-surface-subtle border border-border-subtle',
          'hover:bg-surface-hover hover:border-border-hover',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan'
        )}
        aria-expanded={isExpanded}
        aria-label="Toggle quick help"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <span>Quick Help</span>
        <motion.svg
          className="w-3 h-3"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
          animate={{ rotate: isExpanded ? 180 : 0 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </motion.svg>
      </button>

      {/* Expanded Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 z-10"
          >
            <div
              className={cn(
                'rounded-xl border border-border-subtle',
                'bg-bg-elevated/95 backdrop-blur-lg',
                'shadow-lg p-4'
              )}
            >
              <h4 className="font-semibold text-text-primary text-sm mb-3">
                {nBack}-Back Rules
              </h4>

              <div className="space-y-3 text-sm">
                {showPosition && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-cyan/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-cyan font-mono text-xs">A</span>
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">Position Match</p>
                      <p className="text-text-secondary text-xs">
                        Press when the square is in the same spot as {nBack} turn
                        {nBack > 1 ? 's' : ''} ago
                      </p>
                    </div>
                  </div>
                )}

                {showAudio && (
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent-magenta/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent-magenta font-mono text-xs">L</span>
                    </div>
                    <div>
                      <p className="text-text-primary font-medium">Audio Match</p>
                      <p className="text-text-secondary text-xs">
                        Press when the letter is the same as {nBack} turn
                        {nBack > 1 ? 's' : ''} ago
                      </p>
                    </div>
                  </div>
                )}

                <div className="pt-2 border-t border-border-subtle">
                  <p className="text-text-tertiary text-xs">
                    Press <kbd className="px-1 py-0.5 rounded bg-surface-subtle border border-border-subtle font-mono">Esc</kbd> to pause
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
