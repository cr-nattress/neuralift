'use client';

import { cn } from '@/lib/utils';

interface PhaseSectionProps {
  title: string;
  description?: string;
  accentColor?: 'cyan' | 'magenta' | 'gold';
  children: React.ReactNode;
  className?: string;
}

export function PhaseSection({
  title,
  description,
  accentColor = 'cyan',
  children,
  className,
}: PhaseSectionProps) {
  const accentClasses = {
    cyan: 'border-accent-cyan/30',
    magenta: 'border-accent-magenta/30',
    gold: 'border-accent-gold/30',
  };

  const dotColors = {
    cyan: 'bg-accent-cyan',
    magenta: 'bg-accent-magenta',
    gold: 'bg-accent-gold',
  };

  return (
    <section className={cn('mb-10', className)}>
      {/* Phase Header */}
      <div
        className={cn(
          'mb-6 pb-4 border-b',
          accentClasses[accentColor]
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className={cn('w-3 h-3 rounded-full', dotColors[accentColor])}
          />
          <h2 className="text-xl font-bold text-text-primary">{title}</h2>
        </div>
        {description && (
          <p className="text-text-secondary text-sm mt-2 ml-6">{description}</p>
        )}
      </div>

      {/* Phase Content */}
      {children}
    </section>
  );
}
