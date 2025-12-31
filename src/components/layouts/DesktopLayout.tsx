'use client';

/**
 * Desktop Layout
 *
 * Layout component for desktop viewports (>1024px).
 * Optimized for no scrolling with spacious centered content.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UniformHeader } from '../navigation/UniformHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';

interface DesktopLayoutProps {
  children: ReactNode;
  showHeader: boolean;
  showBottomNav: boolean;
}

export function DesktopLayout({ children, showHeader, showBottomNav }: DesktopLayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <AnimatePresence>
        {showHeader && <UniformHeader />}
      </AnimatePresence>

      {/* Page Content - centered with generous max width */}
      <main
        className={cn(
          'flex-1 overflow-hidden flex items-center justify-center',
          showHeader && 'pt-14',
          showBottomNav && 'pb-16'
        )}
      >
        <div className="w-full max-w-5xl px-8 h-full">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {showBottomNav && <BottomNavigation />}
      </AnimatePresence>
    </div>
  );
}
