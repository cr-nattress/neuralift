'use client';

/**
 * Tablet Layout
 *
 * Layout component for tablet viewports (640px - 1024px).
 * Uses same navigation pattern as mobile but can be customized for tablet-specific needs.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MobileHeader } from '../navigation/MobileHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';

interface TabletLayoutProps {
  children: ReactNode;
  showHeader: boolean;
  showBottomNav: boolean;
}

export function TabletLayout({ children, showHeader, showBottomNav }: TabletLayoutProps) {
  return (
    <>
      {/* Header */}
      <AnimatePresence>
        {showHeader && <MobileHeader />}
      </AnimatePresence>

      {/* Page Content */}
      <div
        className={cn(
          'min-h-screen transition-[padding] duration-200',
          showHeader && 'pt-14',
          showBottomNav && 'pb-20'
        )}
      >
        {children}
      </div>

      {/* Bottom Navigation */}
      <AnimatePresence>
        {showBottomNav && <BottomNavigation />}
      </AnimatePresence>
    </>
  );
}
