'use client';

import { useMemo } from 'react';
import { cn } from '@/lib/utils';
import type { DBSession } from '@/infrastructure/database';

interface AccuracyChartProps {
  sessions: DBSession[];
  className?: string;
}

export function AccuracyChart({ sessions, className }: AccuracyChartProps) {
  const chartData = useMemo(() => {
    // Take last 10 sessions, sorted by timestamp ascending (oldest first)
    const recentSessions = [...sessions]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .slice(-10);

    return recentSessions.map((session, index) => ({
      index,
      accuracy: session.combinedAccuracy,
      date: new Date(session.timestamp),
    }));
  }, [sessions]);

  if (chartData.length === 0) {
    return (
      <div
        className={cn(
          'flex items-center justify-center h-40 text-text-tertiary',
          className
        )}
      >
        No sessions yet. Complete a session to see your progress!
      </div>
    );
  }

  const maxAccuracy = 100;
  const minAccuracy = 0;
  const chartHeight = 160;
  const chartWidth = 100; // percentage

  // Calculate positions
  const points = chartData.map((d, i) => {
    const x = (i / Math.max(chartData.length - 1, 1)) * chartWidth;
    const y =
      chartHeight -
      ((d.accuracy - minAccuracy) / (maxAccuracy - minAccuracy)) * chartHeight;
    return { x, y, accuracy: d.accuracy, date: d.date };
  });

  // Create SVG path
  const linePath =
    points.length > 1
      ? points.reduce((path, point, i) => {
          if (i === 0) return `M ${point.x} ${point.y}`;
          return `${path} L ${point.x} ${point.y}`;
        }, '')
      : '';

  // Create area path (for gradient fill)
  const lastPoint = points[points.length - 1];
  const firstPoint = points[0];
  const areaPath =
    points.length > 1 && lastPoint && firstPoint
      ? `${linePath} L ${lastPoint.x} ${chartHeight} L ${firstPoint.x} ${chartHeight} Z`
      : '';

  return (
    <div className={cn('relative', className)}>
      {/* Y-axis labels */}
      <div className="absolute left-0 top-0 h-40 flex flex-col justify-between text-xs text-text-tertiary pr-2">
        <span>100%</span>
        <span>50%</span>
        <span>0%</span>
      </div>

      {/* Chart area */}
      <div className="ml-10">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full h-40"
          preserveAspectRatio="none"
        >
          {/* Gradient definition */}
          <defs>
            <linearGradient id="accuracyGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.3" />
              <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Grid lines */}
          <line
            x1="0"
            y1={chartHeight / 2}
            x2={chartWidth}
            y2={chartHeight / 2}
            stroke="var(--border-subtle)"
            strokeDasharray="2,2"
          />

          {/* Area fill */}
          {areaPath && (
            <path d={areaPath} fill="url(#accuracyGradient)" />
          )}

          {/* Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="var(--accent-cyan)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          )}

          {/* Points */}
          {points.map((point, i) => (
            <circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="3"
              fill="var(--accent-cyan)"
              stroke="var(--bg-primary)"
              strokeWidth="1"
              vectorEffect="non-scaling-stroke"
            />
          ))}
        </svg>

        {/* X-axis labels */}
        <div className="flex justify-between mt-2 text-xs text-text-tertiary">
          {firstPoint && (
            <>
              <span>
                {firstPoint.date.toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
              {lastPoint && points.length > 1 && (
                <span>
                  {lastPoint.date.toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                  })}
                </span>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
