'use client';

/**
 * Mobile Header
 *
 * A compact header for mobile and tablet viewports.
 * Shows logo, page title, and contextual actions.
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface MobileHeaderProps {
  className?: string;
}

/**
 * Get the page title based on current route
 */
function getPageTitle(pathname: string): string {
  if (pathname === '/') return 'Neuralift';
  if (pathname === '/levels') return 'Choose Level';
  if (pathname === '/progress') return 'Progress';
  if (pathname === '/settings') return 'Settings';
  if (pathname.startsWith('/train/') && pathname.includes('/session')) return 'Training';
  if (pathname.startsWith('/train/')) return 'Briefing';
  if (pathname.startsWith('/results/')) return 'Results';
  return 'Neuralift';
}

/**
 * Determine if we should show a back button
 */
function shouldShowBackButton(pathname: string): boolean {
  // Show back on nested pages, but not on main navigation pages
  const mainPages = ['/', '/levels', '/progress', '/settings'];
  return !mainPages.includes(pathname);
}

/**
 * Get the back link destination
 */
function getBackLink(pathname: string): string {
  if (pathname.startsWith('/train/') && pathname.includes('/session')) {
    // From training session, go back to briefing (remove /session)
    return pathname.replace('/session', '');
  }
  if (pathname.startsWith('/train/')) {
    // From briefing, go to levels
    return '/levels';
  }
  if (pathname.startsWith('/results/')) {
    return '/progress';
  }
  return '/';
}

export function MobileHeader({ className }: MobileHeaderProps) {
  const pathname = usePathname();
  const pageTitle = getPageTitle(pathname);
  const showBackButton = shouldShowBackButton(pathname);
  const backLink = getBackLink(pathname);

  return (
    <motion.header
      initial={{ y: -56, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-14 px-4',
        'flex items-center justify-between',
        'bg-bg-primary/80 backdrop-blur-lg',
        'border-b border-border-subtle',
        // Safe area for iOS notch
        'pt-[env(safe-area-inset-top)]',
        className
      )}
    >
      {/* Left: Logo or Back Button */}
      <div className="w-10 flex justify-start">
        {showBackButton ? (
          <Link
            href={backLink}
            className={cn(
              'w-10 h-10 flex items-center justify-center rounded-xl',
              'hover:bg-surface-hover active:scale-95',
              'transition-all duration-150'
            )}
            aria-label="Go back"
          >
            <svg
              className="w-6 h-6 text-text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </Link>
        ) : (
          <Link href="/" aria-label="Home" className="flex items-center">
            <div className="w-8 h-8 rounded-lg bg-accent-cyan flex items-center justify-center">
              <span className="text-bg-primary font-bold text-sm">N</span>
            </div>
          </Link>
        )}
      </div>

      {/* Center: Page Title */}
      <h1 className="text-lg font-semibold text-text-primary truncate max-w-[200px]">
        {pageTitle}
      </h1>

      {/* Right: Placeholder for future actions */}
      <div className="w-10 flex justify-end">
        {/* Reserved for future menu/action buttons */}
      </div>
    </motion.header>
  );
}
