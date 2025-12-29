'use client';

import { useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { cn } from '@/lib/utils';

interface JourneyMapProps {
  className?: string;
  currentLevel?: number;
  unlockedLevels?: number[];
}

interface LevelNode {
  id: string;
  nBack: number;
  mode: 'position' | 'audio' | 'dual';
  label: string;
  unlocked: boolean;
  current: boolean;
}

export function JourneyMap({
  className,
  currentLevel = 1,
  unlockedLevels = [1, 2, 3],
}: JourneyMapProps) {
  const levels: LevelNode[] = useMemo(() => {
    const levelData = [
      { id: 'position-1', nBack: 1, mode: 'position' as const, label: 'P1' },
      { id: 'audio-1', nBack: 1, mode: 'audio' as const, label: 'A1' },
      { id: 'dual-1', nBack: 1, mode: 'dual' as const, label: 'D1' },
      { id: 'position-2', nBack: 2, mode: 'position' as const, label: 'P2' },
      { id: 'audio-2', nBack: 2, mode: 'audio' as const, label: 'A2' },
      { id: 'dual-2', nBack: 2, mode: 'dual' as const, label: 'D2' },
      { id: 'position-3', nBack: 3, mode: 'position' as const, label: 'P3' },
      { id: 'audio-3', nBack: 3, mode: 'audio' as const, label: 'A3' },
      { id: 'dual-3', nBack: 3, mode: 'dual' as const, label: 'D3' },
    ];

    return levelData.map((level, index) => ({
      ...level,
      unlocked: unlockedLevels.includes(index + 1),
      current: index + 1 === currentLevel,
    }));
  }, [currentLevel, unlockedLevels]);

  const getModeColor = (mode: 'position' | 'audio' | 'dual') => {
    switch (mode) {
      case 'position':
        return 'bg-accent-cyan';
      case 'audio':
        return 'bg-accent-magenta';
      case 'dual':
        return 'bg-accent-gold';
    }
  };

  const getModeGlow = (mode: 'position' | 'audio' | 'dual') => {
    switch (mode) {
      case 'position':
        return 'shadow-glow-cyan';
      case 'audio':
        return 'shadow-glow-magenta';
      case 'dual':
        return 'shadow-[0_0_20px_-5px_var(--accent-gold)]';
    }
  };

  return (
    <Card variant="default" padding="md" className={className}>
      <CardHeader>
        <CardTitle className="text-center">Your Journey</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap justify-center gap-3">
          {levels.map((level) => (
            <div
              key={level.id}
              className={cn(
                'relative w-12 h-12 rounded-xl flex items-center justify-center',
                'text-sm font-bold transition-all duration-200',
                level.unlocked
                  ? cn(
                      getModeColor(level.mode),
                      'text-bg-primary',
                      level.current && getModeGlow(level.mode)
                    )
                  : 'bg-surface-subtle text-text-muted border border-border-subtle'
              )}
              title={`${level.mode.charAt(0).toUpperCase() + level.mode.slice(1)} ${level.nBack}-back`}
            >
              {level.label}

              {/* Current indicator */}
              {level.current && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-pulse" />
              )}

              {/* Locked icon */}
              {!level.unlocked && (
                <svg
                  className="absolute w-3 h-3 bottom-1 right-1 opacity-50"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-4 text-xs text-text-tertiary">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-accent-cyan" />
            <span>Position</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-accent-magenta" />
            <span>Audio</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 rounded bg-accent-gold" />
            <span>Dual</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
