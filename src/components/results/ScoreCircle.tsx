'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ScoreCircleProps {
  accuracy: number;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function ScoreCircle({
  accuracy,
  label = 'Accuracy',
  size = 'lg',
  className,
}: ScoreCircleProps) {
  const sizeClasses = {
    sm: { container: 'w-24 h-24', text: 'text-2xl', label: 'text-xs' },
    md: { container: 'w-32 h-32', text: 'text-3xl', label: 'text-sm' },
    lg: { container: 'w-40 h-40', text: 'text-4xl', label: 'text-sm' },
  };

  const getColor = (acc: number) => {
    if (acc >= 90) return { stroke: 'var(--accent-cyan)', text: 'text-accent-cyan' };
    if (acc >= 75) return { stroke: 'var(--success)', text: 'text-success' };
    if (acc >= 60) return { stroke: 'var(--warning)', text: 'text-warning' };
    return { stroke: 'var(--accent-magenta)', text: 'text-accent-magenta' };
  };

  const color = getColor(accuracy);
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (accuracy / 100) * circumference;

  return (
    <div className={cn('relative', sizeClasses[size].container, className)}>
      <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke="var(--surface-subtle)"
          strokeWidth="8"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.2 }}
        />
      </svg>

      {/* Text overlay */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn('font-bold', sizeClasses[size].text, color.text)}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 0.5 }}
        >
          {Math.round(accuracy)}%
        </motion.span>
        <span className={cn('text-text-tertiary', sizeClasses[size].label)}>
          {label}
        </span>
      </div>
    </div>
  );
}
