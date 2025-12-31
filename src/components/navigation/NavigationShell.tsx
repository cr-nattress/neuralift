'use client';

/**
 * Navigation Shell
 *
 * Orchestrates all navigation components and handles responsive display.
 * Provides proper spacing for page content based on visible navigation.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigation } from './NavigationContext';
import { MobileHeader } from './MobileHeader';
import { BottomNavigation } from './BottomNavigation';
import { cn } from '@/lib/utils';

interface NavigationShellProps {
  children: ReactNode;
}

export function NavigationShell({ children }: NavigationShellProps) {
  const { showHeader, showBottomNav } = useNavigation();

  return (
    <>
      {/* Header - same style on all screen sizes */}
      <AnimatePresence>
        {showHeader && <MobileHeader />}
      </AnimatePresence>

      {/* Page Content with proper spacing */}
      <div
        className={cn(
          'min-h-screen transition-[padding] duration-200',
          // Top padding for header
          showHeader && 'pt-14',
          // Bottom padding for bottom nav (all breakpoints)
          showBottomNav && 'pb-20'
        )}
      >
        {children}
      </div>

      {/* Bottom Navigation - visible on all breakpoints */}
      <AnimatePresence>
        {showBottomNav && <BottomNavigation />}
      </AnimatePresence>
    </>
  );
}
