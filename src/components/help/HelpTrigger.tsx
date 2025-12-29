'use client';

import { HelpPopover, type PopoverContent } from './HelpPopover';
import { getPopoverContent } from '@/content/popoverContent';
import { cn } from '@/lib/utils';

interface HelpTriggerProps {
  contentKey: string;
  content?: PopoverContent;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
  size?: 'sm' | 'md';
}

export function HelpTrigger({
  contentKey,
  content,
  side = 'top',
  align = 'center',
  className,
  size = 'sm',
}: HelpTriggerProps) {
  const popoverContent = content ?? getPopoverContent(contentKey);

  if (!popoverContent) {
    console.warn(`HelpTrigger: No content found for key "${contentKey}"`);
    return null;
  }

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
  };

  return (
    <HelpPopover content={popoverContent} side={side} align={align}>
      <button
        type="button"
        className={cn(
          'inline-flex items-center justify-center rounded-full',
          'text-text-tertiary hover:text-text-secondary',
          'hover:bg-surface-subtle',
          'transition-colors duration-150',
          'focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan',
          sizeClasses[size],
          className
        )}
        aria-label={`Help: ${popoverContent.title}`}
      >
        <svg
          className="w-full h-full"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </button>
    </HelpPopover>
  );
}
