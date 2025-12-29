'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';
import type { DBSession } from '@/infrastructure/database';

interface SessionHistoryProps {
  sessions: DBSession[];
  className?: string;
}

function formatDate(date: Date): string {
  const now = new Date();
  const sessionDate = new Date(date);
  const diffDays = Math.floor(
    (now.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) {
    return `Today, ${sessionDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  } else if (diffDays === 1) {
    return `Yesterday, ${sessionDate.toLocaleTimeString(undefined, {
      hour: 'numeric',
      minute: '2-digit',
    })}`;
  } else if (diffDays < 7) {
    return sessionDate.toLocaleDateString(undefined, {
      weekday: 'short',
      hour: 'numeric',
      minute: '2-digit',
    });
  } else {
    return sessionDate.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  }
}

function formatDuration(ms: number): string {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes > 0) {
    return `${minutes}m ${remainingSeconds}s`;
  }
  return `${remainingSeconds}s`;
}

function getLevelDisplayName(levelId: string): string {
  // Parse level ID like "position-2back" or "dual-3back"
  const parts = levelId.split('-');
  const modePart = parts[0];
  const nBackPart = parts[1];
  if (parts.length >= 2 && modePart && nBackPart) {
    const mode = modePart.charAt(0).toUpperCase() + modePart.slice(1);
    const nBack = nBackPart.replace('back', '-Back');
    return `${mode} ${nBack}`;
  }
  return levelId;
}

function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 80) return 'text-success';
  if (accuracy >= 60) return 'text-accent-gold';
  return 'text-error';
}

export function SessionHistory({ sessions, className }: SessionHistoryProps) {
  if (sessions.length === 0) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center py-12 text-center',
          className
        )}
      >
        <span className="text-4xl mb-3">{String.fromCodePoint(0x1f4ca)}</span>
        <p className="text-text-secondary">No sessions yet</p>
        <p className="text-sm text-text-tertiary mt-1">
          Complete your first training session to see history
        </p>
      </div>
    );
  }

  return (
    <div className={cn('space-y-2', className)}>
      {sessions.map((session) => (
        <Link
          key={session.sessionId}
          href={`/results/${session.sessionId}`}
          className={cn(
            'flex items-center justify-between p-4 rounded-xl',
            'bg-surface-subtle hover:bg-surface-hover',
            'border border-transparent hover:border-border-hover',
            'transition-all duration-200',
            'group'
          )}
        >
          <div className="flex flex-col gap-1">
            <span className="text-text-primary font-medium group-hover:text-accent-cyan transition-colors">
              {getLevelDisplayName(session.levelId)}
            </span>
            <span className="text-sm text-text-tertiary">
              {formatDate(session.timestamp)} &middot; {formatDuration(session.duration)}
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span
                className={cn(
                  'text-lg font-semibold',
                  getAccuracyColor(session.combinedAccuracy)
                )}
              >
                {Math.round(session.combinedAccuracy)}%
              </span>
              <span className="text-sm text-text-tertiary ml-1">accuracy</span>
            </div>

            <svg
              className="w-4 h-4 text-text-tertiary group-hover:text-accent-cyan transition-colors"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>
      ))}
    </div>
  );
}
