'use client';

/**
 * Desktop Header
 *
 * A full-width header with horizontal navigation for desktop viewports.
 * Replaces mobile header + bottom nav on screens >= 1024px.
 */

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface NavLinkConfig {
  href: string;
  label: string;
  matchPaths: string[];
}

const NAV_LINKS: NavLinkConfig[] = [
  { href: '/', label: 'Home', matchPaths: ['/'] },
  { href: '/levels', label: 'Train', matchPaths: ['/levels', '/train'] },
  { href: '/progress', label: 'Progress', matchPaths: ['/progress', '/results'] },
  { href: '/settings', label: 'Settings', matchPaths: ['/settings'] },
];

/**
 * Check if a nav link should be marked as active
 */
function isLinkActive(pathname: string, link: NavLinkConfig): boolean {
  // Exact match for root
  if (link.href === '/' && pathname === '/') return true;
  if (link.href === '/' && pathname !== '/') return false;

  // Check match paths
  return link.matchPaths.some((path) => {
    if (path === '/') return pathname === '/';
    return pathname.startsWith(path);
  });
}

interface DesktopHeaderProps {
  className?: string;
}

export function DesktopHeader({ className }: DesktopHeaderProps) {
  const pathname = usePathname();

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'h-16 px-6',
        'hidden lg:flex items-center justify-between',
        'bg-bg-primary/80 backdrop-blur-lg',
        'border-b border-border-subtle',
        className
      )}
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center gap-3 group"
        aria-label="Neuralift Home"
      >
        <div
          className={cn(
            'w-10 h-10 rounded-xl bg-accent-cyan',
            'flex items-center justify-center',
            'group-hover:shadow-glow-cyan transition-shadow duration-200'
          )}
        >
          <span className="text-bg-primary font-bold text-lg">N</span>
        </div>
        <span className="text-xl font-semibold text-text-primary">
          Neuralift
        </span>
      </Link>

      {/* Navigation */}
      <nav className="flex items-center gap-1" aria-label="Main navigation">
        {NAV_LINKS.map((link) => {
          const active = isLinkActive(pathname, link);

          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex items-center gap-2 px-4 py-2 rounded-xl',
                'text-sm font-medium transition-all duration-200',
                active
                  ? 'text-accent-cyan'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
              )}
              aria-current={active ? 'page' : undefined}
            >
              {active && (
                <motion.div
                  className="absolute inset-0 bg-accent-cyan/10 rounded-xl"
                  layoutId="desktop-nav-active"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
              <span className="relative z-10">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Right side placeholder for future features (user account, etc.) */}
      <div className="w-[140px] flex justify-end">
        {/* Reserved for future features */}
      </div>
    </motion.header>
  );
}
