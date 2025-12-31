'use client';

/**
 * Mobile Layout
 *
 * Layout component for mobile viewports (<640px).
 * Optimized for no scrolling - content fits within viewport.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { UniformHeader } from '../navigation/UniformHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader: boolean;
  showBottomNav: boolean;
}

export function MobileLayout({ children, showHeader, showBottomNav }: MobileLayoutProps) {
  return (
    <div className="h-[100dvh] flex flex-col overflow-hidden">
      {/* Header */}
      <AnimatePresence>
        {showHeader && <UniformHeader />}
      </AnimatePresence>

      {/* Page Content - fills remaining space */}
      <main
        className={cn(
          'flex-1 overflow-hidden',
          showHeader && 'pt-14',
          showBottomNav && 'pb-16'
        )}
      >
        {children}
      </main>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {showBottomNav && <BottomNavigation />}
      </AnimatePresence>
    </div>
  );
}
