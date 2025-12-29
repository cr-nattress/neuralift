'use client';

import * as React from 'react';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface PopoverContent {
  icon?: string;
  title: string;
  description: string;
  whyItMatters?: string;
  proTip?: string;
  videoUrl?: string;
}

interface HelpPopoverProps {
  children: React.ReactNode;
  content: PopoverContent;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function HelpPopover({
  children,
  content,
  side = 'top',
  align = 'center',
  className,
}: HelpPopoverProps) {
  const [open, setOpen] = React.useState(false);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>{children}</PopoverPrimitive.Trigger>

      <AnimatePresence>
        {open && (
          <PopoverPrimitive.Portal forceMount>
            <PopoverPrimitive.Content
              side={side}
              align={align}
              sideOffset={8}
              asChild
              onEscapeKeyDown={() => setOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: side === 'top' ? 10 : -10 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'z-50 w-80 rounded-xl border border-border-subtle',
                  'bg-bg-elevated/95 backdrop-blur-lg',
                  'shadow-xl shadow-black/20',
                  'focus:outline-none',
                  className
                )}
              >
                {/* Header */}
                <div className="flex items-start gap-3 p-4 border-b border-border-subtle">
                  {content.icon && (
                    <span className="text-2xl flex-shrink-0">{content.icon}</span>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-text-primary text-base">
                      {content.title}
                    </h3>
                    <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                      {content.description}
                    </p>
                  </div>
                  <PopoverPrimitive.Close
                    className="text-text-tertiary hover:text-text-primary transition-colors p-1 -m-1"
                    aria-label="Close"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </PopoverPrimitive.Close>
                </div>

                {/* Why It Matters */}
                {content.whyItMatters && (
                  <div className="p-4 border-b border-border-subtle">
                    <div className="rounded-lg bg-accent-cyan/5 border border-accent-cyan/20 p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <svg className="w-4 h-4 text-accent-cyan" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <span className="text-xs font-semibold text-accent-cyan uppercase tracking-wide">
                          Why It Matters
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {content.whyItMatters}
                      </p>
                    </div>
                  </div>
                )}

                {/* Pro Tip */}
                {content.proTip && (
                  <div className="p-4 border-b border-border-subtle">
                    <div className="flex items-start gap-2">
                      <span className="text-accent-gold">💡</span>
                      <div>
                        <span className="text-xs font-semibold text-accent-gold uppercase tracking-wide">
                          Pro Tip
                        </span>
                        <p className="text-text-secondary text-sm mt-1 leading-relaxed">
                          {content.proTip}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div className="p-3 flex items-center justify-between">
                  {content.videoUrl ? (
                    <a
                      href={content.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-accent-cyan hover:underline flex items-center gap-1"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                      Watch tutorial
                    </a>
                  ) : (
                    <span />
                  )}
                  <PopoverPrimitive.Close
                    className="px-4 py-1.5 rounded-lg bg-surface-subtle text-text-primary text-sm font-medium hover:bg-surface-hover transition-colors"
                  >
                    Got it
                  </PopoverPrimitive.Close>
                </div>

                {/* Arrow */}
                <PopoverPrimitive.Arrow
                  className="fill-bg-elevated"
                  width={12}
                  height={6}
                />
              </motion.div>
            </PopoverPrimitive.Content>
          </PopoverPrimitive.Portal>
        )}
      </AnimatePresence>
    </PopoverPrimitive.Root>
  );
}
