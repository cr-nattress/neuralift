'use client';

/**
 * Tablet Layout
 *
 * Layout component for tablet viewports (640px - 1024px).
 * Optimized for no scrolling with larger content area.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UniformHeader } from '../navigation/UniformHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';

interface TabletLayoutProps {
  children: ReactNode;
  showHeader: boolean;
  showBottomNav: boolean;
}

export function TabletLayout({ children, showHeader, showBottomNav }: TabletLayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <AnimatePresence>
        {showHeader && <UniformHeader />}
      </AnimatePresence>

      {/* Page Content - centered with max width */}
      <main
        className={cn(
          'flex-1 overflow-hidden flex items-center justify-center',
          showHeader && 'pt-14',
          showBottomNav && 'pb-16'
        )}
      >
        <div className="w-full max-w-2xl px-6 h-full">
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
