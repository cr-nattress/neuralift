'use client';

/**
 * Bottom Navigation
 *
 * A mobile-friendly bottom navigation bar with main nav items.
 * Shows on all viewports. Filters items based on feature flags.
 */

import { useMemo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { isFeatureEnabled, type FeatureFlag } from '@/config/features';

interface NavItemConfig {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  matchPaths: string[];
  feature: FeatureFlag | null; // null means always enabled
}

// Icons as components
function HomeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  );
}

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  );
}

function ChartIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  );
}

function SettingsIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

const NAV_ITEMS: NavItemConfig[] = [
  {
    href: '/',
    label: 'Home',
    icon: HomeIcon,
    matchPaths: ['/'],
    feature: null, // Always enabled
  },
  {
    href: '/levels',
    label: 'Train',
    icon: PlayIcon,
    matchPaths: ['/levels', '/train'],
    feature: 'FEATURE_LEVELS',
  },
  {
    href: '/progress',
    label: 'Progress',
    icon: ChartIcon,
    matchPaths: ['/progress', '/results'],
    feature: 'FEATURE_PROGRESS',
  },
  {
    href: '/settings',
    label: 'Settings',
    icon: SettingsIcon,
    matchPaths: ['/settings'],
    feature: 'FEATURE_SETTINGS',
  },
];

/**
 * Check if a nav item should be marked as active
 */
function isNavItemActive(pathname: string, item: NavItemConfig): boolean {
  // Exact match for root
  if (item.href === '/' && pathname === '/') return true;
  if (item.href === '/' && pathname !== '/') return false;

  // Check match paths
  return item.matchPaths.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });
}

interface BottomNavigationProps {
  className?: string;
}

export function BottomNavigation({ className }: BottomNavigationProps) {
  const pathname = usePathname();

  // Filter nav items based on feature flags
  const enabledNavItems = useMemo(() => {
    return NAV_ITEMS.filter((item) => {
      if (item.feature === null) return true;
      return isFeatureEnabled(item.feature);
    });
  }, []);

  return (
    <motion.nav
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50',
        'h-16 px-2',
        'flex items-center justify-around',
        'bg-bg-primary/90 backdrop-blur-lg',
        'border-t border-border-subtle',
        // Safe area for iOS home indicator
        'pb-[env(safe-area-inset-bottom)]',
        className
      )}
      aria-label="Main navigation"
    >
      {enabledNavItems.map((item) => {
        const active = isNavItemActive(pathname, item);
        const Icon = item.icon;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center justify-center',
              'min-w-[64px] h-12 px-3 rounded-xl',
              'transition-all duration-200',
              'active:scale-95',
              active
                ? 'text-accent-cyan'
                : 'text-text-muted hover:text-text-secondary'
            )}
            aria-current={active ? 'page' : undefined}
          >
            <motion.div
              className="relative flex items-center justify-center"
              whileTap={{ scale: 0.9 }}
            >
              {/* Active background indicator */}
              {active && (
                <motion.div
                  className="absolute -inset-2 bg-accent-cyan/10 rounded-xl"
                  layoutId="bottom-nav-active"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className="w-6 h-6 relative z-10" />
            </motion.div>
            <span
              className={cn(
                'text-xs mt-1 transition-all duration-200',
                active ? 'font-medium text-accent-cyan' : 'font-normal text-text-muted'
              )}
            >
              {item.label}
            </span>
          </Link>
        );
      })}
    </motion.nav>
  );
}
