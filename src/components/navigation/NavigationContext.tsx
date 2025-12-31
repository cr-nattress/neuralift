'use client';

/**
 * Navigation Context
 *
 * Provides centralized navigation state management including:
 * - Navigation visibility (show/hide for training sessions)
 * - Current breakpoint detection
 * - Navigation mode control
 */

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from 'react';

export type NavigationMode = 'full' | 'minimal' | 'hidden';
export type Breakpoint = 'mobile' | 'tablet' | 'desktop';

interface NavigationContextValue {
  /** Current navigation visibility mode */
  mode: NavigationMode;
  /** Set navigation mode */
  setMode: (mode: NavigationMode) => void;
  /** Current viewport breakpoint */
  breakpoint: Breakpoint;
  /** Whether bottom nav should be visible */
  showBottomNav: boolean;
  /** Whether header should be visible */
  showHeader: boolean;
  /** Temporarily hide navigation (e.g., during training) */
  hideNavigation: () => void;
  /** Restore navigation to default mode */
  showNavigation: () => void;
}

const NavigationContext = createContext<NavigationContextValue | null>(null);

const BREAKPOINTS = {
  mobile: 0,
  tablet: 640,
  desktop: 1024,
} as const;

interface NavigationProviderProps {
  children: ReactNode;
}

export function NavigationProvider({ children }: NavigationProviderProps) {
  const [mode, setMode] = useState<NavigationMode>('full');
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  // Update breakpoint on resize
  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.desktop) {
        setBreakpoint('desktop');
      } else if (width >= BREAKPOINTS.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    };

    updateBreakpoint();
    window.addEventListener('resize', updateBreakpoint);
    return () => window.removeEventListener('resize', updateBreakpoint);
  }, []);

  const hideNavigation = useCallback(() => setMode('hidden'), []);
  const showNavigation = useCallback(() => setMode('full'), []);

  // Determine visibility based on mode and breakpoint
  const showBottomNav = mode !== 'hidden' && breakpoint !== 'desktop';
  const showHeader = mode !== 'hidden';

  const value: NavigationContextValue = {
    mode,
    setMode,
    breakpoint,
    showBottomNav,
    showHeader,
    hideNavigation,
    showNavigation,
  };

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation(): NavigationContextValue {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within NavigationProvider');
  }
  return context;
}
