'use client';

import { cn } from '@/lib/utils';

interface Stats {
  hits: number;
  misses: number;
  falseAlarms: number;
  correctRejections: number;
  dPrime: number;
}

interface StatsTableProps {
  positionStats: Stats;
  audioStats: Stats;
  className?: string;
}

export function StatsTable({
  positionStats,
  audioStats,
  className,
}: StatsTableProps) {
  const rows = [
    { label: 'Hits', position: positionStats.hits, audio: audioStats.hits },
    { label: 'Misses', position: positionStats.misses, audio: audioStats.misses },
    {
      label: 'False Alarms',
      position: positionStats.falseAlarms,
      audio: audioStats.falseAlarms,
    },
    {
      label: 'Correct Rejections',
      position: positionStats.correctRejections,
      audio: audioStats.correctRejections,
    },
    {
      label: "D' (Sensitivity)",
      position: positionStats.dPrime.toFixed(2),
      audio: audioStats.dPrime.toFixed(2),
      isSpecial: true,
    },
  ];

  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border-subtle">
            <th className="py-2 text-left text-text-tertiary font-medium">
              Metric
            </th>
            <th className="py-2 text-right text-accent-cyan font-medium">
              Position
            </th>
            <th className="py-2 text-right text-accent-magenta font-medium">
              Audio
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={row.label}
              className={cn(
                'border-b border-border-subtle last:border-0',
                row.isSpecial && 'bg-surface-subtle'
              )}
            >
              <td className="py-2 text-text-secondary">{row.label}</td>
              <td className="py-2 text-right text-text-primary font-mono">
                {row.position}
              </td>
              <td className="py-2 text-right text-text-primary font-mono">
                {row.audio}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
