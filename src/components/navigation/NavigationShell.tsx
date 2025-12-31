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
import { DesktopHeader } from './DesktopHeader';
import { cn } from '@/lib/utils';

interface NavigationShellProps {
  children: ReactNode;
}

export function NavigationShell({ children }: NavigationShellProps) {
  const { showHeader, showBottomNav, breakpoint } = useNavigation();

  const isDesktop = breakpoint === 'desktop';

  return (
    <>
      {/* Desktop Header - only on large screens */}
      <AnimatePresence>
        {showHeader && isDesktop && <DesktopHeader />}
      </AnimatePresence>

      {/* Mobile Header - on mobile and tablet */}
      <AnimatePresence>
        {showHeader && !isDesktop && <MobileHeader />}
      </AnimatePresence>

      {/* Page Content with proper spacing */}
      <div
        className={cn(
          'min-h-screen transition-[padding] duration-200',
          // Top padding for header
          showHeader && !isDesktop && 'pt-14',
          showHeader && isDesktop && 'pt-16',
          // Bottom padding for bottom nav (mobile/tablet only)
          showBottomNav && 'pb-20'
        )}
      >
        {children}
      </div>

      {/* Bottom Navigation - only on mobile and tablet */}
      <AnimatePresence>
        {showBottomNav && <BottomNavigation />}
      </AnimatePresence>
    </>
  );
}
