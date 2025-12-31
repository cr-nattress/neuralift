'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { TrainingMode } from '@neuralift/core';

interface ResponseButtonsProps {
  mode: TrainingMode;
  onPositionMatch: () => void;
  onAudioMatch: () => void;
  disabled?: boolean;
  positionPressed?: boolean;
  audioPressed?: boolean;
}

export function ResponseButtons({
  mode,
  onPositionMatch,
  onAudioMatch,
  disabled = false,
  positionPressed = false,
  audioPressed = false,
}: ResponseButtonsProps) {
  const showPosition = mode === 'single-position' || mode === 'dual';
  const showAudio = mode === 'single-audio' || mode === 'dual';

  return (
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full max-w-md">
      {showPosition && (
        <ResponseButton
          data-tour="position-button"
          label="Position Match"
          shortcut="A"
          color="cyan"
          onClick={onPositionMatch}
          disabled={disabled}
          pressed={positionPressed}
          ariaLabel="Position match - press when current position matches position from N steps ago"
        />
      )}
      {showAudio && (
        <ResponseButton
          data-tour="audio-button"
          label="Audio Match"
          shortcut="L"
          color="magenta"
          onClick={onAudioMatch}
          disabled={disabled}
          pressed={audioPressed}
          ariaLabel="Audio match - press when current letter matches letter from N steps ago"
        />
      )}
    </div>
  );
}

interface ResponseButtonProps {
  label: string;
  shortcut: string;
  color: 'cyan' | 'magenta';
  onClick: () => void;
  disabled: boolean;
  pressed: boolean;
  ariaLabel: string;
  'data-tour'?: string;
}

function ResponseButton({
  label,
  shortcut,
  color,
  onClick,
  disabled,
  pressed,
  ariaLabel,
  ...props
}: ResponseButtonProps) {
  const colorClasses = {
    cyan: {
      icon: 'bg-accent-cyan/20 text-accent-cyan',
      iconPressed: 'bg-accent-cyan/40 text-accent-cyan',
      pressed: 'bg-accent-cyan/40 border-accent-cyan shadow-[0_0_20px_rgba(34,211,238,0.4)]',
      glow: 'rgba(34,211,238,0.6)',
    },
    magenta: {
      icon: 'bg-accent-magenta/20 text-accent-magenta',
      iconPressed: 'bg-accent-magenta/40 text-accent-magenta',
      pressed: 'bg-accent-magenta/40 border-accent-magenta shadow-[0_0_20px_rgba(232,121,249,0.4)]',
      glow: 'rgba(232,121,249,0.6)',
    },
  };

  return (
    <motion.button
      {...props}
      className={cn(
        'flex flex-col items-center justify-center flex-1 relative overflow-hidden',
        'min-h-[88px] sm:min-h-[100px]',
        'rounded-2xl border-2',
        'transition-all duration-150',
        'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        'active:scale-[0.97]', // CSS fallback for non-JS
        pressed
          ? colorClasses[color].pressed
          : 'bg-surface-subtle border-border-default hover:bg-surface-hover hover:border-border-hover'
      )}
      onClick={onClick}
      disabled={disabled}
      whileTap={{ scale: 0.92 }}
      animate={
        pressed
          ? {
              scale: [1, 1.03, 1],
              transition: { duration: 0.2 },
            }
          : {}
      }
      aria-label={ariaLabel}
      aria-pressed={pressed}
    >
      {/* Press ripple effect */}
      {pressed && (
        <motion.div
          className="absolute inset-0 rounded-2xl"
          initial={{ opacity: 0.6, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.2 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            background: `radial-gradient(circle, ${colorClasses[color].glow} 0%, transparent 70%)`,
          }}
        />
      )}

      {/* Icon */}
      <motion.div
        className={cn(
          'w-10 h-10 rounded-xl flex items-center justify-center mb-2 transition-all duration-150',
          pressed ? colorClasses[color].iconPressed : colorClasses[color].icon
        )}
        animate={
          pressed
            ? { scale: [1, 1.15, 1], transition: { duration: 0.2 } }
            : {}
        }
      >
        {color === 'cyan' ? (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
              clipRule="evenodd"
            />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z"
              clipRule="evenodd"
            />
          </svg>
        )}
      </motion.div>

      <span className={cn(
        'text-sm transition-colors duration-150',
        pressed ? 'text-text-primary' : 'text-text-secondary'
      )}>
        {label}
      </span>
      <kbd className={cn(
        'text-xs mt-1 px-2 py-0.5 rounded transition-all duration-150',
        pressed ? 'bg-white/10 text-text-primary' : 'bg-bg-elevated text-text-muted'
      )}>
        {shortcut}
      </kbd>
    </motion.button>
  );
}
