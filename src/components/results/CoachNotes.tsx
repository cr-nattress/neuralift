'use client';

import { cn } from '@/lib/utils';

interface CoachNotesProps {
  feedback?: string;
  recommendations?: string[];
  encouragement?: string;
  isLoading?: boolean;
  className?: string;
}

export function CoachNotes({
  feedback,
  recommendations = [],
  encouragement,
  isLoading = false,
  className,
}: CoachNotesProps) {
  if (isLoading) {
    return (
      <div className={cn('space-y-3', className)}>
        <div className="h-4 bg-surface-subtle rounded animate-pulse w-full" />
        <div className="h-4 bg-surface-subtle rounded animate-pulse w-5/6" />
        <div className="h-4 bg-surface-subtle rounded animate-pulse w-4/6" />
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Main Feedback */}
      {feedback && (
        <p className="text-text-secondary leading-relaxed">{feedback}</p>
      )}

      {/* Recommendations */}
      {recommendations.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-text-primary mb-2">
            Recommendations:
          </h4>
          <ul className="space-y-1">
            {recommendations.map((rec, index) => (
              <li
                key={index}
                className="flex items-start gap-2 text-sm text-text-secondary"
              >
                <span className="text-accent-cyan">•</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Encouragement */}
      {encouragement && (
        <p className="text-sm text-accent-cyan italic">{encouragement}</p>
      )}
    </div>
  );
}
