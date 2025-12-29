'use client';

import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BackButtonProps {
  href: string;
  label?: string;
  className?: string;
}

export function BackButton({ href, label = 'Back', className }: BackButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        'inline-flex items-center gap-2 text-text-secondary hover:text-text-primary',
        'transition-colors duration-200',
        className
      )}
    >
      <svg
        className="w-5 h-5"
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
      <span className="text-sm font-medium">{label}</span>
    </Link>
  );
}
