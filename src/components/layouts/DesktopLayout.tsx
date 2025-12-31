'use client';

/**
 * Desktop Layout
 *
 * Layout component for desktop viewports (>1024px).
 * Uses same navigation pattern as mobile/tablet but can be customized for desktop-specific needs.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { MobileHeader } from '../navigation/MobileHeader';
import { BottomNavigation } from '../navigation/BottomNavigation';

interface DesktopLayoutProps {
  children: ReactNode;
  showHeader: boolean;
  showBottomNav: boolean;
}

export function DesktopLayout({ children, showHeader, showBottomNav }: DesktopLayoutProps) {
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
