'use client';

import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

interface PauseOverlayProps {
  onResume: () => void;
  onQuit: () => void;
}

export function PauseOverlay({ onResume, onQuit }: PauseOverlayProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-bg-primary/90 backdrop-blur-sm"
    >
      <Card variant="elevated" padding="lg" className="max-w-sm w-full mx-4">
        <CardContent className="flex flex-col items-center text-center">
          {/* Pause Icon */}
          <div className="w-16 h-16 rounded-full bg-accent-cyan/10 flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-accent-cyan"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>

          <h2 className="text-xl font-bold text-text-primary mb-2">
            Session Paused
          </h2>
          <p className="text-text-secondary mb-6">
            Take a break. Your progress is saved.
          </p>

          <div className="flex flex-col gap-3 w-full">
            <Button onClick={onResume} size="lg" fullWidth>
              Resume Session
            </Button>
            <Button onClick={onQuit} variant="ghost" fullWidth>
              End Session
            </Button>
          </div>

          <p className="text-text-tertiary text-sm mt-4">
            Press <kbd className="px-1.5 py-0.5 rounded bg-surface-subtle border border-border-subtle font-mono text-xs">Esc</kbd> to resume
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
