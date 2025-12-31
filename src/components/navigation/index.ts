/**
 * Navigation Components
 *
 * Responsive navigation system for mobile, tablet, and desktop.
 */

// Main components
export { NavigationShell } from './NavigationShell';
export { NavigationProvider, useNavigation } from './NavigationContext';
export { MobileHeader } from './MobileHeader';
export { UniformHeader } from './UniformHeader';
export { BottomNavigation } from './BottomNavigation';
export { DesktopHeader } from './DesktopHeader';

// Hooks
export {
  useBreakpoint,
  useIsMobile,
  useIsTablet,
  useIsDesktop,
  useIsMobileOrTablet,
} from './hooks/useBreakpoint';
export { useReducedMotion } from './hooks/useReducedMotion';

// Types
export type { NavigationMode, Breakpoint } from './NavigationContext';
