'use client';

import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface TrainingGridProps {
  activePosition: number | null;
  feedback?: { position: number; type: 'correct' | 'incorrect' } | null;
  className?: string;
  /** Called when any grid cell is clicked (triggers position match) */
  onGridClick?: () => void;
  /** Whether grid interaction is disabled */
  disabled?: boolean;
}

const GRID_POSITIONS = [0, 1, 2, 3, 4, 5, 6, 7, 8];

export function TrainingGrid({
  activePosition,
  feedback,
  className,
  onGridClick,
  disabled = false,
}: TrainingGridProps) {
  const [tappedCell, setTappedCell] = useState<number | null>(null);

  const handleCellClick = useCallback((position: number) => {
    if (disabled) return;

    // Visual feedback
    setTappedCell(position);
    setTimeout(() => setTappedCell(null), 200);

    // Trigger position match callback
    onGridClick?.();
  }, [disabled, onGridClick]);

  return (
    <div
      role="grid"
      aria-label="N-back memory grid. Click or tap any cell to indicate a position match."
      className={cn(
        'grid grid-cols-3 gap-2 sm:gap-3',
        'w-64 h-64 sm:w-72 sm:h-72 md:w-80 md:h-80',
        className
      )}
    >
      {GRID_POSITIONS.map((position) => (
        <GridCell
          key={position}
          position={position}
          isActive={activePosition === position}
          feedback={feedback?.position === position ? feedback.type : null}
          isTapped={tappedCell === position}
          onClick={() => handleCellClick(position)}
          disabled={disabled}
        />
      ))}
    </div>
  );
}

interface GridCellProps {
  position: number;
  isActive: boolean;
  feedback: 'correct' | 'incorrect' | null;
  isTapped: boolean;
  onClick: () => void;
  disabled: boolean;
}

function GridCell({ position, isActive, feedback, isTapped, onClick, disabled }: GridCellProps) {
  const positionNames = [
    'top-left',
    'top-center',
    'top-right',
    'middle-left',
    'center',
    'middle-right',
    'bottom-left',
    'bottom-center',
    'bottom-right',
  ];

  return (
    <motion.button
      type="button"
      role="gridcell"
      aria-label={`Position ${positionNames[position]}${isActive ? ' (active)' : ''}. Click to indicate position match.`}
      aria-selected={isActive}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'rounded-xl border-2 relative flex items-center justify-center',
        'transition-all duration-150 cursor-pointer',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-bg-primary',
        'disabled:cursor-not-allowed disabled:opacity-70',
        'active:scale-95',
        {
          'bg-surface-subtle border-border-subtle hover:bg-surface-hover hover:border-border-hover': !isActive && !feedback && !isTapped,
          'bg-accent-cyan-glow border-accent-cyan shadow-glow-cyan': isActive,
          'bg-success-subtle border-success': feedback === 'correct',
          'bg-error-subtle border-error': feedback === 'incorrect',
          'bg-accent-cyan/20 border-accent-cyan': isTapped && !isActive,
        }
      )}
      whileTap={{ scale: 0.92 }}
      animate={
        isActive
          ? { scale: [1, 1.03, 1], transition: { duration: 0.3 } }
          : feedback === 'incorrect'
            ? { x: [0, -4, 4, -4, 4, 0], transition: { duration: 0.3 } }
            : isTapped
              ? { scale: [1, 0.95, 1], transition: { duration: 0.15 } }
              : {}
      }
    >
      {/* Tap ripple effect */}
      {isTapped && !isActive && (
        <motion.div
          className="absolute inset-0 rounded-xl"
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.1 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          style={{
            background: 'radial-gradient(circle, rgba(34,211,238,0.4) 0%, transparent 70%)',
          }}
        />
      )}

      {isActive && (
        <motion.div
          className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-accent-cyan"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          transition={{ duration: 0.15 }}
        />
      )}
    </motion.button>
  );
}
