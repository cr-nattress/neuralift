'use client';

import { cn } from '@/lib/utils';
import type { TrainingMode } from '@neuralift/core';

interface ControlInstructionsProps {
  mode: TrainingMode;
  nBack: number;
  className?: string;
}

export function ControlInstructions({
  mode,
  nBack,
  className,
}: ControlInstructionsProps) {
  const showPosition = mode === 'single-position' || mode === 'dual';
  const showAudio = mode === 'single-audio' || mode === 'dual';

  return (
    <div className={cn('space-y-4', className)}>
      <h3 className="font-semibold text-text-primary">Controls</h3>

      <div className="grid gap-3">
        {showPosition && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-subtle">
            <div className="flex-shrink-0">
              <div className="w-12 h-10 rounded-lg bg-accent-cyan/20 border border-accent-cyan/40 flex items-center justify-center">
                <span className="text-accent-cyan font-mono text-sm">A</span>
              </div>
            </div>
            <div>
              <p className="text-text-primary font-medium">Position Match</p>
              <p className="text-text-secondary text-sm">
                Press when the square is in the same position as {nBack} step
                {nBack > 1 ? 's' : ''} ago
              </p>
            </div>
          </div>
        )}

        {showAudio && (
          <div className="flex items-center gap-4 p-3 rounded-lg bg-surface-subtle">
            <div className="flex-shrink-0">
              <div className="w-12 h-10 rounded-lg bg-accent-magenta/20 border border-accent-magenta/40 flex items-center justify-center">
                <span className="text-accent-magenta font-mono text-sm">L</span>
              </div>
            </div>
            <div>
              <p className="text-text-primary font-medium">Audio Match</p>
              <p className="text-text-secondary text-sm">
                Press when the letter sounds the same as {nBack} step
                {nBack > 1 ? 's' : ''} ago
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Keyboard Shortcuts */}
      <div className="mt-4 p-3 rounded-lg bg-bg-elevated border border-border-subtle">
        <p className="text-text-tertiary text-sm mb-2">Keyboard Shortcuts</p>
        <div className="flex flex-wrap gap-4 text-sm">
          {showPosition && (
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-surface-subtle border border-border-default text-text-primary font-mono">
                A
              </kbd>
              <span className="text-text-secondary">Position</span>
            </div>
          )}
          {showAudio && (
            <div className="flex items-center gap-2">
              <kbd className="px-2 py-1 rounded bg-surface-subtle border border-border-default text-text-primary font-mono">
                L
              </kbd>
              <span className="text-text-secondary">Audio</span>
            </div>
          )}
          <div className="flex items-center gap-2">
            <kbd className="px-2 py-1 rounded bg-surface-subtle border border-border-default text-text-primary font-mono">
              Esc
            </kbd>
            <span className="text-text-secondary">Pause</span>
          </div>
        </div>
      </div>
    </div>
  );
}
