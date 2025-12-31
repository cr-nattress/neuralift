'use client';

/**
 * Responsive Layout
 *
 * Switches between Mobile, Tablet, and Desktop layouts based on viewport.
 * Each layout handles its own breakpoint-specific rendering logic.
 */

import { type ReactNode } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigation } from '../navigation/NavigationContext';
import { MobileLayout } from './MobileLayout';
import { TabletLayout } from './TabletLayout';
import { DesktopLayout } from './DesktopLayout';

interface ResponsiveLayoutProps {
  children: ReactNode;
}

export function ResponsiveLayout({ children }: ResponsiveLayoutProps) {
  const { breakpoint, showHeader, showBottomNav } = useNavigation();

  const layoutProps = { showHeader, showBottomNav };

  return (
    <AnimatePresence mode="wait">
      {breakpoint === 'mobile' && (
        <MobileLayout key="mobile" {...layoutProps}>
          {children}
        </MobileLayout>
      )}
      {breakpoint === 'tablet' && (
        <TabletLayout key="tablet" {...layoutProps}>
          {children}
        </TabletLayout>
      )}
      {breakpoint === 'desktop' && (
        <DesktopLayout key="desktop" {...layoutProps}>
          {children}
        </DesktopLayout>
      )}
    </AnimatePresence>
  );
}
