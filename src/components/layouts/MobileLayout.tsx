'use client';

/**
 * Mobile Layout
 *
 * Layout component for mobile viewports (<640px).
 * Features compact header and bottom navigation.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MobileHeader } from '../navigation/MobileHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';

interface MobileLayoutProps {
  children: ReactNode;
  showHeader: boolean;
  showBottomNav: boolean;
}

export function MobileLayout({ children, showHeader, showBottomNav }: MobileLayoutProps) {
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
