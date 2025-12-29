'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface QuickStartCardProps {
  className?: string;
}

export function QuickStartCard({ className }: QuickStartCardProps) {
  return (
    <Card
      variant="interactive"
      glow="cyan"
      padding="md"
      className={cn('flex-1', className)}
    >
      <CardContent className="flex flex-col items-center text-center gap-4">
        {/* Icon */}
        <div className="w-12 h-12 rounded-full bg-accent-cyan/10 flex items-center justify-center">
          <svg
            className="w-6 h-6 text-accent-cyan"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>

        {/* Text */}
        <div>
          <h3 className="font-semibold text-text-primary text-lg">Quick Start</h3>
          <p className="text-text-secondary text-sm mt-1">
            Jump right into training
          </p>
        </div>

        {/* Button */}
        <Link href="/levels" className="w-full">
          <Button variant="primary" fullWidth>
            Start Training
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
